/**
 * AGGRESSIVE MESSAGE DETECTION
 * This is a more aggressive approach to find and process messages
 * Run this in console to test: window.forceCheckInDetection()
 */

// Add this function to content_script.js for testing
window.forceCheckInDetection = async function() {
  console.log('[Check-in Logger] 🔍 FORCE DETECTION - Scanning entire chat...');
  
  const messagePanel = document.querySelector('[data-testid="conversation-panel-messages"]');
  if (!messagePanel) {
    console.log('[Check-in Logger] ❌ Message panel not found!');
    return;
  }
  
  // Get all text content from the panel
  const allText = messagePanel.innerText || messagePanel.textContent || '';
  console.log('[Check-in Logger] Total text in panel:', allText.length, 'characters');
  
  // Find all text nodes that contain check-in/out keywords
  const keywords = {
    checkin: ['check-in', 'checked in', 'checkin', 'check in'],
    checkout: ['check out', 'checked out', 'checkout', 'check-out']
  };
  
  const foundMessages = [];
  
  // Walk through all text nodes
  const walker = document.createTreeWalker(
    messagePanel,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );
  
  let node;
  while (node = walker.nextNode()) {
    const text = node.textContent.trim().toLowerCase();
    
    // Check for check-in keywords
    for (const keyword of keywords.checkin) {
      if (text.includes(keyword)) {
        const parent = node.parentElement;
        if (parent) {
          foundMessages.push({
            text: node.textContent.trim(),
            element: parent,
            type: 'checkin',
            keyword: keyword
          });
          console.log(`[Check-in Logger] ✅ Found check-in: "${node.textContent.trim()}"`);
        }
      }
    }
    
    // Check for check-out keywords
    for (const keyword of keywords.checkout) {
      if (text.includes(keyword)) {
        const parent = node.parentElement;
        if (parent) {
          foundMessages.push({
            text: node.textContent.trim(),
            element: parent,
            type: 'checkout',
            keyword: keyword
          });
          console.log(`[Check-in Logger] ✅ Found check-out: "${node.textContent.trim()}"`);
        }
      }
    }
  }
  
  console.log(`[Check-in Logger] Found ${foundMessages.length} check-in/out messages`);
  
  // Process found messages
  if (foundMessages.length > 0) {
    const groupName = await extractGroupName();
    
    for (const msg of foundMessages) {
      const messageId = `force_${Date.now()}_${Math.random()}`;
      
      // Extract member name
      let memberName = 'Unknown';
      let current = msg.element;
      for (let i = 0; i < 5; i++) {
        if (current) {
          const nameSpan = current.querySelector('span[title]');
          if (nameSpan) {
            memberName = nameSpan.getAttribute('title') || nameSpan.textContent || 'Unknown';
            break;
          }
          current = current.parentElement;
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
      
      // Store event
      const result = await chrome.storage.local.get(['events']);
      const events = result.events || [];
      events.push(event);
      await chrome.storage.local.set({ events });
      
      console.log(`[Check-in Logger] 💾 Stored:`, event);
    }
    
    console.log(`[Check-in Logger] ✅ Processed ${foundMessages.length} events!`);
    console.log(`[Check-in Logger] 💡 Click "Refresh" in extension popup to see events`);
  }
  
  return foundMessages.length;
};

console.log('[Check-in Logger] 💡 Force detection available! Type: window.forceCheckInDetection()');

