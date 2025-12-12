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
  }, 2000);
  
  // Process existing messages on load
  setTimeout(processNewMessages, 2000);
}

/**
 * Processes new messages in the chat
 */
async function processNewMessages() {
  try {
    if (!isLoggingEnabled) {
      return;
    }
    
    // Find all message containers - try multiple selectors
    const messageSelectors = [
      '[data-testid="msg-container"]',
      '[data-testid="conversation-panel-messages"] [data-testid="msg-container"]',
      'div[data-testid="conversation-panel-messages"] > div > div',
      '.message',
      'div[role="application"] div[role="row"]',
      '[data-testid="msg-container"] > div'
    ];
    
    let messages = [];
    for (const selector of messageSelectors) {
      const found = document.querySelectorAll(selector);
      if (found.length > 0) {
        messages = Array.from(found);
        console.log(`[Check-in Logger] Found ${messages.length} messages using selector: ${selector}`);
        break;
      }
    }
    
    if (messages.length === 0) {
      // Try to find messages by text content as fallback
      const allDivs = document.querySelectorAll('[data-testid="conversation-panel-messages"] div');
      messages = Array.from(allDivs).filter(div => {
        const text = div.textContent || '';
        return text.length > 5 && text.length < 500; // Reasonable message length
      });
      
      if (messages.length === 0) {
        return;
      }
    }
    
    // Get group name once
    const groupName = await extractGroupName();
    console.log(`[Check-in Logger] Processing messages in group: ${groupName}`);
    
    // Process each message
    let processedCount = 0;
    for (const messageElement of messages) {
      const result = await processMessage(messageElement, groupName);
      if (result) processedCount++;
    }
    
    if (processedCount > 0) {
      console.log(`[Check-in Logger] Processed ${processedCount} new check-in/out events`);
    }
  } catch (error) {
    console.error('[Check-in Logger] Error processing messages:', error);
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
    
    // Parse for check-in/check-out
    const parseResult = parseCheckInOut(messageText);
    
    if (!parseResult) {
      // Mark as processed even if not a check-in/out to avoid reprocessing
      processedMessageIds.add(messageId);
      return false;
    }
    
    console.log(`[Check-in Logger] Detected ${parseResult.type}: "${messageText}"`);
    
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

