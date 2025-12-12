/**
 * Utility functions for WhatsApp Web Check-in Logger
 */

// Default keywords for detecting check-in/check-out messages
const DEFAULT_KEYWORDS = {
  checkin: ['check-in', 'checked in', 'checkin', 'in', 'present', 'here', 'arrived'],
  checkout: ['check out', 'checked out', 'checkout', 'out', 'left', 'exit', 'gone', 'departed']
};

/**
 * Parses a message text to detect check-in/check-out events
 * @param {string} messageText - The message text to parse
 * @param {Object} keywords - Custom keywords object (optional)
 * @returns {Object|null} - {type: 'checkin'|'checkout', confidence: number} or null
 */
function parseCheckInOut(messageText) {
  if (!messageText || typeof messageText !== 'string') {
    return null;
  }

  const text = messageText.toLowerCase().trim();
  
  // Get keywords from storage or use defaults
  const keywords = DEFAULT_KEYWORDS;
  
  // Check for check-in keywords
  for (const keyword of keywords.checkin) {
    if (text.includes(keyword)) {
      return {
        type: 'checkin',
        confidence: 1.0,
        matchedKeyword: keyword
      };
    }
  }
  
  // Check for check-out keywords
  for (const keyword of keywords.checkout) {
    if (text.includes(keyword)) {
      return {
        type: 'checkout',
        confidence: 1.0,
        matchedKeyword: keyword
      };
    }
  }
  
  return null;
}

/**
 * Extracts member name from WhatsApp message element
 * @param {Element} messageElement - The message DOM element
 * @returns {string} - Extracted name or 'Unknown'
 */
function extractMemberName(messageElement) {
  try {
    // Try multiple selectors for WhatsApp Web's structure
    const selectors = [
      'span[data-testid="conversation-info-header"] span[title]',
      'span[title]',
      '[data-testid="conversation-header"] span[title]',
      '.message-in .copyable-text span[title]',
      '.message-out .copyable-text span[title]'
    ];
    
    // For group messages, look for sender name in the message bubble
    const nameSelectors = [
      'span[data-testid="conversation-info-header"]',
      '[data-testid="msg-container"] span[title]',
      '.message span[title]',
      'span.selectable-text.copyable-text span[title]'
    ];
    
    // First, try to get the group name from header
    let name = null;
    
    // Look for sender name in message metadata
    const messageContainer = messageElement.closest('[data-testid="msg-container"]') || 
                            messageElement.closest('.message') ||
                            messageElement;
    
    // Try to find name in various places
    const nameElement = messageContainer.querySelector('span[title]') ||
                       messageContainer.querySelector('[data-testid="conversation-info-header"]') ||
                       messageContainer.querySelector('.copyable-text span[title]');
    
    if (nameElement) {
      name = nameElement.getAttribute('title') || nameElement.textContent.trim();
    }
    
    // Fallback: try to extract from message structure
    if (!name || name === '') {
      const textElements = messageContainer.querySelectorAll('span');
      for (const span of textElements) {
        const title = span.getAttribute('title');
        if (title && title.length > 0 && title.length < 100) {
          name = title;
          break;
        }
      }
    }
    
    return name ? name.trim() : 'Unknown';
  } catch (error) {
    console.error('Error extracting member name:', error);
    return 'Unknown';
  }
}

/**
 * Extracts group name from WhatsApp Web
 * @returns {Promise<string>} - Group name or 'Unknown Group'
 */
async function extractGroupName() {
  try {
    // Try to find group name in header
    const headerSelectors = [
      '[data-testid="conversation-info-header"] span[title]',
      'header span[title]',
      '[data-testid="chatlist"] span[title]'
    ];
    
    for (const selector of headerSelectors) {
      const element = document.querySelector(selector);
      if (element) {
        const name = element.getAttribute('title') || element.textContent.trim();
        if (name && name.length > 0) {
          return name;
        }
      }
    }
    
    // Fallback: try to get from page title
    const title = document.title;
    if (title && title.includes('WhatsApp')) {
      const match = title.match(/(.+?)\s*-\s*WhatsApp/);
      if (match && match[1]) {
        return match[1].trim();
      }
    }
    
    return 'Unknown Group';
  } catch (error) {
    console.error('Error extracting group name:', error);
    return 'Unknown Group';
  }
}

/**
 * Extracts message text from WhatsApp message element
 * @param {Element} messageElement - The message DOM element
 * @returns {string} - Extracted message text
 */
function extractMessageText(messageElement) {
  try {
    // Strategy 1: Try specific selectors for message text
    const textSelectors = [
      'span.selectable-text.copyable-text',
      'span[data-testid="selectable-text"]',
      '.selectable-text',
      'span[dir="ltr"]',
      'span[dir="auto"]',
      'div[data-testid="msg-container"] span.selectable-text',
      '[data-testid="msg-container"] span[class*="selectable"]',
      '.message-text',
      'span.copyable-text'
    ];
    
    for (const selector of textSelectors) {
      const elements = messageElement.querySelectorAll(selector);
      for (const element of elements) {
        const text = (element.textContent || element.innerText || '').trim();
        if (text.length > 0 && text.length < 500) {
          // Skip if it looks like a timestamp or metadata
          if (text.match(/^\d{1,2}:\d{2}\s*(AM|PM)?$/i)) {
            continue;
          }
          // Skip if it's just checkmarks
          if (text.match(/^[✓✓]+$/)) {
            continue;
          }
          return text;
        }
      }
    }
    
    // Strategy 2: Get all text content and find the main message
    const allText = messageElement.textContent || messageElement.innerText || '';
    if (allText) {
      // Split by lines and find the longest non-metadata line
      const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      for (const line of lines) {
        // Skip timestamps, checkmarks, and metadata
        if (line.match(/^\d{1,2}:\d{2}\s*(AM|PM)?$/i)) continue;
        if (line.match(/^[✓✓]+$/)) continue;
        if (line.length < 2) continue;
        if (line.length > 500) continue;
        
        // This looks like a message
        return line;
      }
      
      // Fallback: Clean the entire text
      const cleaned = allText
        .replace(/\d{1,2}:\d{2}\s*(AM|PM)?/gi, '') // Remove timestamps
        .replace(/✓\s*✓/g, '') // Remove read receipts
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
      
      if (cleaned.length > 0 && cleaned.length < 500) {
        return cleaned;
      }
    }
    
    return '';
  } catch (error) {
    console.error('[Check-in Logger] Error extracting message text:', error);
    return '';
  }
}

/**
 * Escapes a CSV field value
 * @param {string} value - Value to escape
 * @returns {string} - Escaped value
 */
function escapeCSVField(value) {
  if (value === null || value === undefined) {
    return '';
  }
  
  const stringValue = String(value);
  
  // If value contains comma, newline, or quote, wrap in quotes and escape quotes
  if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
    return '"' + stringValue.replace(/"/g, '""') + '"';
  }
  
  return stringValue;
}

/**
 * Generates CSV content from events array
 * @param {Array} events - Array of event objects
 * @returns {string} - CSV content
 */
function generateCSV(events) {
  if (!events || events.length === 0) {
    return 'Group,Name,Message,Type,Timestamp\n';
  }
  
  // CSV header
  const header = 'Group,Name,Message,Type,Timestamp\n';
  
  // CSV rows
  const rows = events.map(event => {
    return [
      escapeCSVField(event.group || 'Unknown Group'),
      escapeCSVField(event.name || 'Unknown'),
      escapeCSVField(event.message || ''),
      escapeCSVField(event.type || 'unknown'),
      escapeCSVField(event.isoTimestamp || new Date().toISOString())
    ].join(',');
  });
  
  return header + rows.join('\n');
}

/**
 * Formats timestamp for display
 * @param {string} isoTimestamp - ISO timestamp string
 * @returns {string} - Formatted date/time string
 */
function formatTimestamp(isoTimestamp) {
  try {
    const date = new Date(isoTimestamp);
    return date.toLocaleString();
  } catch (error) {
    return isoTimestamp;
  }
}

/**
 * Gets current ISO timestamp
 * @returns {string} - ISO timestamp string
 */
function getCurrentTimestamp() {
  return new Date().toISOString();
}

