/**
 * SIMPLE WhatsApp Web Check-in Logger
 * Direct text scanning approach
 */

let isLoggingEnabled = true;
let lastScanTime = 0;

// Initialize
async function init() {
  const result = await chrome.storage.local.get(['loggingEnabled']);
  isLoggingEnabled = result.loggingEnabled !== false;
  
  console.log('[Check-in Logger] ✅ Simple scanner initialized');
  
  // Scan every 5 seconds
  setInterval(scanMessages, 5000);
  
  // Scan immediately
  setTimeout(scanMessages, 2000);
  
  // Listen for popup messages
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'scanNow') {
      scanMessages();
      sendResponse({ success: true });
    }
    return true;
  });
}

// Simple scan function
async function scanMessages() {
  if (!isLoggingEnabled) return;
  
  try {
    // Get the main chat area
    const chatArea = document.querySelector('[data-testid="conversation-panel-messages"]');
    if (!chatArea) return;
    
    // Get ALL text from chat area
    const allText = chatArea.innerText || chatArea.textContent || '';
    
    // Simple keyword matching
    const checkInPattern = /check[\s-]?in|checked[\s]+in|checking[\s]+in|i'?m[\s]+in|present|here/gi;
    const checkOutPattern = /check[\s-]?out|checked[\s]+out|checking[\s]+out|i'?m[\s]+out|left|exit/gi;
    
    // Find all matches
    const checkInMatches = [...allText.matchAll(checkInPattern)];
    const checkOutMatches = [...allText.matchAll(checkOutPattern)];
    
    if (checkInMatches.length === 0 && checkOutMatches.length === 0) {
      return; // No matches found
    }
    
    console.log(`[Check-in Logger] Found ${checkInMatches.length} check-ins and ${checkOutMatches.length} check-outs`);
    
    // Get group name
    let groupName = 'Unknown Group';
    const header = document.querySelector('[data-testid="conversation-info-header"] span[title]');
    if (header) {
      groupName = header.getAttribute('title') || header.textContent || 'Unknown Group';
    }
    
    // Get existing events
    const result = await chrome.storage.local.get(['events']);
    const events = result.events || [];
    const existingMessages = new Set(events.map(e => e.message));
    
    let stored = 0;
    
    // Process check-ins
    for (const match of checkInMatches) {
      const message = match[0].trim();
      if (message.length > 0 && !existingMessages.has(message)) {
        events.push({
          group: groupName,
          name: 'User',
          message: message,
          type: 'checkin',
          isoTimestamp: new Date().toISOString(),
          id: `msg_${Date.now()}_${Math.random()}`
        });
        existingMessages.add(message);
        stored++;
        console.log(`[Check-in Logger] ✅ Stored check-in: "${message}"`);
      }
    }
    
    // Process check-outs
    for (const match of checkOutMatches) {
      const message = match[0].trim();
      if (message.length > 0 && !existingMessages.has(message)) {
        events.push({
          group: groupName,
          name: 'User',
          message: message,
          type: 'checkout',
          isoTimestamp: new Date().toISOString(),
          id: `msg_${Date.now()}_${Math.random()}`
        });
        existingMessages.add(message);
        stored++;
        console.log(`[Check-in Logger] ✅ Stored check-out: "${message}"`);
      }
    }
    
    if (stored > 0) {
      await chrome.storage.local.set({ events });
      console.log(`[Check-in Logger] 💾 Stored ${stored} new events!`);
    }
    
  } catch (error) {
    console.error('[Check-in Logger] Error:', error);
  }
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
