/**
 * Content script for WhatsApp Web Check-in Logger
 * Observes messages in real-time and detects check-in/check-out events
 */

let isLoggingEnabled = false;
let processedMessageIds = new Set();
let observer = null;
let checkInterval = null;

/**
 * Initializes the content script
 */
async function initContentScript() {
  // Check if logging is enabled
  const result = await chrome.storage.local.get(['loggingEnabled']);
  isLoggingEnabled = result.loggingEnabled !== false; // Default to true
  
  // Start observing messages
  startObserving();
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleLogging') {
      isLoggingEnabled = request.enabled;
      console.log(`[Check-in Logger] Logging ${isLoggingEnabled ? 'enabled' : 'disabled'}`);
      sendResponse({ success: true });
    } else if (request.action === 'getStatus') {
      sendResponse({ enabled: isLoggingEnabled });
    } else if (request.action === 'forceCheck') {
      // Force check for messages (for testing)
      processNewMessages();
      sendResponse({ success: true });
    }
    return true; // Keep channel open for async response
  });
  
  console.log('[Check-in Logger] Content script initialized. Logging enabled:', isLoggingEnabled);
  
  // Add force detection function for debugging
  window.forceCheckInDetection = async function() {
    console.log('[Check-in Logger] 🔍 FORCE DETECTION - Scanning entire chat...');
    
    const messagePanel = document.querySelector('[data-testid="conversation-panel-messages"]');
    if (!messagePanel) {
      console.log('[Check-in Logger] ❌ Message panel not found!');
      return 0;
    }
    
    // Get all text content
    const allText = messagePanel.innerText || messagePanel.textContent || '';
    console.log('[Check-in Logger] Scanning', allText.length, 'characters of text...');
    
    // Keywords to search for
    const keywords = {
      checkin: ['check-in', 'checked in', 'checkin', 'check in', 'check-in:', 'checking in'],
      checkout: ['check out', 'checked out', 'checkout', 'check-out', 'check out:', 'checking out']
    };
    
    const foundMessages = [];
    
    // Find all spans with selectable text
    const textSpans = messagePanel.querySelectorAll('span.selectable-text, span[class*="selectable"], span[dir="ltr"], span[dir="auto"]');
    
    console.log(`[Check-in Logger] Found ${textSpans.length} text spans to check...`);
    
    for (const span of textSpans) {
      const text = (span.textContent || '').trim().toLowerCase();
      if (text.length < 3 || text.length > 500) continue;
      
      // Check for check-in
      for (const keyword of keywords.checkin) {
        if (text.includes(keyword)) {
          const fullText = (span.textContent || span.innerText || '').trim();
          foundMessages.push({
            text: fullText,
            element: span,
            type: 'checkin',
            keyword: keyword
          });
          console.log(`[Check-in Logger] ✅ Found check-in: "${fullText.substring(0, 50)}"`);
          break;
        }
      }
      
      // Check for check-out
      for (const keyword of keywords.checkout) {
        if (text.includes(keyword)) {
          const fullText = (span.textContent || span.innerText || '').trim();
          foundMessages.push({
            text: fullText,
            element: span,
            type: 'checkout',
            keyword: keyword
          });
          console.log(`[Check-in Logger] ✅ Found check-out: "${fullText.substring(0, 50)}"`);
          break;
        }
      }
    }
    
    console.log(`[Check-in Logger] Found ${foundMessages.length} check-in/out messages`);
    
    // Process found messages
    if (foundMessages.length > 0) {
      const groupName = await extractGroupName();
      let stored = 0;
      
      for (const msg of foundMessages) {
        const messageId = `force_${Date.now()}_${Math.random()}`;
        
        // Extract member name
        let memberName = 'Unknown';
        let current = msg.element;
        for (let i = 0; i < 10; i++) {
          if (current) {
            const nameSpan = current.querySelector('span[title]');
            if (nameSpan) {
              memberName = nameSpan.getAttribute('title') || nameSpan.textContent || 'Unknown';
              if (memberName !== 'Unknown') break;
            }
            current = current.parentElement;
          } else {
            break;
          }
        }
        
        const event = {
          group: groupName,
          name: memberName,
          message: msg.text,
          type: msg.type,
          isoTimestamp: new Date().toISOString(),
          id: messageId
        };
        
        // Check if already stored
        const result = await chrome.storage.local.get(['events']);
        const events = result.events || [];
        const exists = events.some(e => e.message === msg.text && e.type === msg.type);
        
        if (!exists) {
          events.push(event);
          await chrome.storage.local.set({ events });
          stored++;
          console.log(`[Check-in Logger] 💾 Stored:`, event);
        }
      }
      
      console.log(`[Check-in Logger] ✅ Stored ${stored} new events!`);
      console.log(`[Check-in Logger] 💡 Click "Refresh" in extension popup to see events`);
      return stored;
    }
    
    return 0;
  };
  
  console.log('[Check-in Logger] 💡 Force detection available! Type in console: window.forceCheckInDetection()');
}

/**
 * Starts observing WhatsApp messages
 */
function startObserving() {
  // Wait for WhatsApp to load
  if (!document.querySelector('[data-testid="chatlist"]')) {
    setTimeout(startObserving, 1000);
    return;
  }
  
  // Use MutationObserver to detect new messages
  const messageContainer = document.querySelector('[data-testid="conversation-panel-messages"]') ||
                          document.querySelector('#main') ||
                          document.body;
  
  if (!messageContainer) {
    setTimeout(startObserving, 1000);
    return;
  }
  
  // Create observer
  observer = new MutationObserver((mutations) => {
    if (isLoggingEnabled) {
      processNewMessages();
    }
  });
  
  // Start observing
  observer.observe(messageContainer, {
    childList: true,
    subtree: true
  });
  
  // Also check periodically for messages (fallback)
  checkInterval = setInterval(() => {
    if (isLoggingEnabled) {
      processNewMessages();
    }
  }, 3000);
  
  // Process existing messages on load - try multiple times
  setTimeout(processNewMessages, 1000);
  setTimeout(processNewMessages, 3000);
  setTimeout(processNewMessages, 5000);
}

/**
 * Processes new messages in the chat
 */
async function processNewMessages() {
  try {
    if (!isLoggingEnabled) {
      console.log('[Check-in Logger] Logging is disabled, skipping');
      return;
    }
    
    console.log('[Check-in Logger] Starting message processing...');
    
    // Get group name first
    const groupName = await extractGroupName();
    
    // Find message panel
    const messagePanel = document.querySelector('[data-testid="conversation-panel-messages"]');
    if (!messagePanel) {
      console.log('[Check-in Logger] Message panel not found!');
      return;
    }
    
    // Strategy 1: Try standard selectors
    const messageSelectors = [
      '[data-testid="msg-container"]',
      '[data-testid="conversation-panel-messages"] [data-testid="msg-container"]',
      'div[data-testid="conversation-panel-messages"] > div > div',
      'div[data-testid="conversation-panel-messages"] div[data-testid="msg-container"]',
      'div[data-testid="conversation-panel-messages"] > div[role="row"]',
      '[data-testid="msg-container"] > div'
    ];
    
    let messages = [];
    let usedSelector = '';
    
    for (const selector of messageSelectors) {
      const found = messagePanel.querySelectorAll(selector);
      if (found.length > 0) {
        messages = Array.from(found);
        usedSelector = selector;
        console.log(`[Check-in Logger] Found ${messages.length} message containers using selector: ${selector}`);
        break;
      }
    }
    
    // Strategy 2: If no messages found, scan all spans with selectable text
    if (messages.length === 0) {
      console.log('[Check-in Logger] No messages found with standard selectors, trying text-based search...');
      
      // Find all spans with selectable text (WhatsApp message text)
      const textSpans = messagePanel.querySelectorAll('span.selectable-text, span[class*="selectable"], span[dir="ltr"], span[dir="auto"]');
      
      // Group spans by their parent message container
      const messageMap = new Map();
      
      textSpans.forEach(span => {
        const text = (span.textContent || '').trim();
        if (text.length > 0 && text.length < 500) {
          // Find parent message container
          let parent = span.closest('[data-testid="msg-container"]') || 
                      span.closest('div[role="row"]') ||
                      span.parentElement;
          
          // Go up to find a reasonable container
          while (parent && parent !== messagePanel) {
            const parentText = (parent.textContent || '').trim();
            if (parentText.length > 0 && parentText.length < 1000) {
              const parentId = parent.getAttribute('data-id') || 
                              parent.getAttribute('data-testid') ||
                              parent.className ||
                              parent.outerHTML.substring(0, 100);
              
              if (!messageMap.has(parentId)) {
                messageMap.set(parentId, parent);
              }
              break;
            }
            parent = parent.parentElement;
          }
        }
      });
      
      messages = Array.from(messageMap.values());
      console.log(`[Check-in Logger] Text-based search found ${messages.length} potential message containers`);
    }
    
    // Strategy 3: Last resort - scan all divs in message panel
    if (messages.length === 0) {
      console.log('[Check-in Logger] Trying aggressive scan of all divs...');
      const allDivs = messagePanel.querySelectorAll('div');
      const candidateMessages = [];
      
      allDivs.forEach(div => {
        const text = (div.textContent || '').trim();
        // Look for divs that look like messages
        if (text.length > 2 && text.length < 500) {
          // Check if it contains message-like content (not just UI elements)
          const hasMessageText = !text.match(/^(✓|✓✓|\d{1,2}:\d{2}|AM|PM)$/i);
          if (hasMessageText) {
            candidateMessages.push(div);
          }
        }
      });
      
      // Remove duplicates and nested elements
      messages = candidateMessages.filter((div, index) => {
        // Check if this div is a child of another candidate
        for (let i = 0; i < candidateMessages.length; i++) {
          if (i !== index && candidateMessages[i].contains(div)) {
            return false; // This is nested, skip it
          }
        }
        return true;
      });
      
      console.log(`[Check-in Logger] Aggressive scan found ${messages.length} candidate messages`);
    }
    
    if (messages.length === 0) {
      console.log('[Check-in Logger] ❌ No messages found at all');
      return;
    }
    
    console.log(`[Check-in Logger] Processing ${messages.length} messages in group: ${groupName}`);
    
    // Process each message
    let processedCount = 0;
    let checkedCount = 0;
    
    for (const messageElement of messages) {
      checkedCount++;
      const result = await processMessage(messageElement, groupName);
      if (result) {
        processedCount++;
      }
      
      // Log progress every 10 messages
      if (checkedCount % 10 === 0) {
        console.log(`[Check-in Logger] Checked ${checkedCount}/${messages.length} messages, found ${processedCount} events`);
      }
    }
    
    console.log(`[Check-in Logger] Finished: Checked ${checkedCount} messages, processed ${processedCount} new check-in/out events`);
    
    if (processedCount > 0) {
      console.log(`[Check-in Logger] ✅ Successfully logged ${processedCount} events!`);
    } else {
      console.log(`[Check-in Logger] ⚠️ No check-in/out events found in ${checkedCount} messages`);
      console.log(`[Check-in Logger] 💡 Tip: Make sure messages contain keywords like "check-in", "check out", "in", "out"`);
    }
  } catch (error) {
    console.error('[Check-in Logger] ❌ Error processing messages:', error);
    console.error(error.stack);
  }
}

/**
 * Processes a single message element
 * @param {Element} messageElement - The message DOM element
 * @param {string} groupName - The group name
 */
async function processMessage(messageElement, groupName) {
  try {
    // Generate a unique ID for this message
    const messageId = generateMessageId(messageElement);
    
    // Skip if already processed
    if (processedMessageIds.has(messageId)) {
      return false;
    }
    
    // Extract message text
    const messageText = extractMessageText(messageElement);
    
    if (!messageText || messageText.trim().length === 0) {
      processedMessageIds.add(messageId);
      return false;
    }
    
    // Debug: Log all message texts (first 10 only to avoid spam)
    if (processedMessageIds.size < 10) {
      console.log(`[Check-in Logger] Message text extracted: "${messageText.substring(0, 100)}"`);
    }
    
    // Parse for check-in/check-out
    const parseResult = parseCheckInOut(messageText);
    
    if (!parseResult) {
      // Mark as processed even if not a check-in/out to avoid reprocessing
      processedMessageIds.add(messageId);
      return false;
    }
    
    console.log(`[Check-in Logger] ✅ Detected ${parseResult.type}: "${messageText}"`);
    
    // Extract member name
    const memberName = extractMemberName(messageElement);
    
    // Create event object
    const event = {
      group: groupName,
      name: memberName,
      message: messageText,
      type: parseResult.type,
      isoTimestamp: getCurrentTimestamp(),
      id: messageId
    };
    
    // Store event
    await storeEvent(event);
    console.log(`[Check-in Logger] Stored event:`, event);
    
    // Mark as processed
    processedMessageIds.add(messageId);
    
    // Notify background script
    chrome.runtime.sendMessage({
      action: 'newEvent',
      event: event
    }).catch(() => {
      // Ignore errors if background script is not ready
    });
    
    return true;
  } catch (error) {
    console.error('[Check-in Logger] Error processing message:', error);
    return false;
  }
}

/**
 * Generates a unique ID for a message element
 * @param {Element} messageElement - The message DOM element
 * @returns {string} - Unique message ID
 */
function generateMessageId(messageElement) {
  try {
    // Try to get a data attribute or generate from content
    const text = extractMessageText(messageElement);
    const timestamp = messageElement.getAttribute('data-pre-plain-text') || 
                     messageElement.querySelector('[data-testid="msg-meta"]')?.textContent ||
                     '';
    
    // Create a hash-like ID from text and timestamp
    const hash = (text + timestamp).split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    return `msg_${Math.abs(hash)}_${Date.now()}`;
  } catch (error) {
    return `msg_${Date.now()}_${Math.random()}`;
  }
}

/**
 * Stores an event in chrome.storage.local
 * @param {Object} event - Event object to store
 */
async function storeEvent(event) {
  try {
    // Get existing events
    const result = await chrome.storage.local.get(['events']);
    const events = result.events || [];
    
    // Add new event
    events.push(event);
    
    // Keep only last 1000 events to prevent storage overflow
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }
    
    // Save back to storage
    await chrome.storage.local.set({ events });
    
    // Update last event timestamp
    await chrome.storage.local.set({ lastEventTime: event.isoTimestamp });
    
  } catch (error) {
    console.error('Error storing event:', error);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContentScript);
} else {
  initContentScript();
}

