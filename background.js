/**
 * Background service worker for WhatsApp Web Check-in Logger
 * Handles storage, CSV export, downloads, and Google Sheets sync
 */

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  // Set default settings
  chrome.storage.local.set({
    loggingEnabled: true,
    autoDownload: false,
    events: [],
    lastEventTime: null,
    keywords: {
      checkin: ['check-in', 'checked in', 'checkin', 'in', 'present', 'here', 'arrived'],
      checkout: ['check out', 'checked out', 'checkout', 'out', 'left', 'exit', 'gone', 'departed']
    }
  });
  
  // Create alarm for daily CSV export (if auto-download is enabled)
  chrome.alarms.create('dailyExport', {
    delayInMinutes: 1440, // 24 hours
    periodInMinutes: 1440
  });
});

// Handle alarms
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyExport') {
    handleDailyExport();
  }
});

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'newEvent') {
    // Event already stored by content script, just acknowledge
    sendResponse({ success: true });
  } else if (request.action === 'exportCSV') {
    exportCSV().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Async response
  } else if (request.action === 'getEvents') {
    getEvents(request.limit).then((events) => {
      sendResponse({ events });
    }).catch((error) => {
      sendResponse({ events: [], error: error.message });
    });
    return true; // Async response
  } else if (request.action === 'clearEvents') {
    clearEvents().then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Async response
  } else if (request.action === 'updateKeywords') {
    updateKeywords(request.keywords).then(() => {
      sendResponse({ success: true });
    }).catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
    return true; // Async response
  }
});

/**
 * Exports events to CSV file
 */
async function exportCSV() {
  try {
    // Get events from storage
    const result = await chrome.storage.local.get(['events']);
    const events = result.events || [];
    
    // Allow export even with 0 events (empty CSV with headers)
    // if (events.length === 0) {
    //   throw new Error('No events to export');
    // }
    
    // Generate CSV content
    const csvContent = generateCSV(events);
    
    // Create blob
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const filename = `whatsapp-checkins-${timestamp}.csv`;
    
    // Download file
    await chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    });
    
    // Clean up
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    
  } catch (error) {
    console.error('Error exporting CSV:', error);
    throw error;
  }
}

/**
 * Gets events from storage
 * @param {number} limit - Maximum number of events to return
 * @returns {Promise<Array>} - Array of events
 */
async function getEvents(limit = 50) {
  try {
    const result = await chrome.storage.local.get(['events']);
    const events = result.events || [];
    
    // Return last N events
    return events.slice(-limit).reverse();
  } catch (error) {
    console.error('Error getting events:', error);
    return [];
  }
}

/**
 * Clears all events from storage
 */
async function clearEvents() {
  try {
    await chrome.storage.local.set({ events: [] });
  } catch (error) {
    console.error('Error clearing events:', error);
    throw error;
  }
}

/**
 * Updates keywords in storage
 * @param {Object} keywords - Keywords object
 */
async function updateKeywords(keywords) {
  try {
    await chrome.storage.local.set({ keywords });
  } catch (error) {
    console.error('Error updating keywords:', error);
    throw error;
  }
}

/**
 * Handles daily CSV export
 */
async function handleDailyExport() {
  try {
    const result = await chrome.storage.local.get(['autoDownload']);
    if (result.autoDownload) {
      await exportCSV();
    }
  } catch (error) {
    console.error('Error in daily export:', error);
  }
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
    const group = escapeCSVField(event.group || 'Unknown Group');
    const name = escapeCSVField(event.name || 'Unknown');
    const message = escapeCSVField(event.message || '');
    const type = escapeCSVField(event.type || 'unknown');
    const timestamp = escapeCSVField(event.isoTimestamp || new Date().toISOString());
    
    return `${group},${name},${message},${type},${timestamp}`;
  });
  
  return header + rows.join('\n');
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

// Google Sheets sync functions (optional, commented out by default)
// Uncomment and configure if you want to use Google Sheets sync

/*
async function syncToGoogleSheets(events) {
  try {
    // Get OAuth token
    const token = await chrome.identity.getAuthToken({ interactive: true });
    
    // Use Google Sheets API to append rows
    // This requires setting up OAuth credentials in Chrome Web Store
    // and implementing the Sheets API v4 integration
    
    // Example API call (requires proper setup):
    const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/A1:append', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: events.map(event => [
          event.group,
          event.name,
          event.message,
          event.type,
          event.isoTimestamp
        ])
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to sync to Google Sheets');
    }
    
    return true;
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
    throw error;
  }
}
*/

