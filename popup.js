/**
 * Popup script for WhatsApp Web Check-in Logger
 * Handles UI interactions and displays status/events
 */

// DOM elements
const loggingToggle = document.getElementById('loggingToggle');
const autoDownloadToggle = document.getElementById('autoDownloadToggle');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const editKeywordsBtn = document.getElementById('editKeywordsBtn');
const statusIndicator = document.getElementById('statusIndicator');
const statusDot = document.getElementById('statusDot');
const statusText = document.getElementById('statusText');
const eventsContainer = document.getElementById('eventsContainer');
const eventCount = document.getElementById('eventCount');
const errorContainer = document.getElementById('errorContainer');
const checkinKeywords = document.getElementById('checkinKeywords');
const checkoutKeywords = document.getElementById('checkoutKeywords');

// Modal elements
const keywordsModal = document.getElementById('keywordsModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const saveKeywordsBtn = document.getElementById('saveKeywordsBtn');
const cancelKeywordsBtn = document.getElementById('cancelKeywordsBtn');
const checkinKeywordsInput = document.getElementById('checkinKeywordsInput');
const checkoutKeywordsInput = document.getElementById('checkoutKeywordsInput');

/**
 * Initializes the popup
 */
async function initPopup() {
  // Load settings
  await loadSettings();
  
  // Load events
  await loadEvents();
  
  // Load keywords
  await loadKeywords();
  
  // Check if on WhatsApp Web
  checkWhatsAppWeb();
  
  // Set up event listeners
  setupEventListeners();
}

/**
 * Loads settings from storage
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get(['loggingEnabled', 'autoDownload']);
    
    loggingToggle.checked = result.loggingEnabled !== false; // Default to true
    autoDownloadToggle.checked = result.autoDownload === true;
    
    updateStatus(result.loggingEnabled !== false);
  } catch (error) {
    showError('Error loading settings: ' + error.message);
  }
}

/**
 * Loads events from storage
 */
async function loadEvents() {
  try {
    // Clear loading message first
    if (eventsContainer.innerHTML.includes('Loading events')) {
      eventsContainer.innerHTML = '';
    }
    
    // Try to get events from background script
    let response;
    try {
      response = await chrome.runtime.sendMessage({ action: 'getEvents', limit: 50 });
    } catch (msgError) {
      // If message fails, try to get events directly from storage
      console.log('Background script not responding, getting events directly from storage');
      const result = await chrome.storage.local.get(['events']);
      response = { events: result.events || [] };
    }
    
    if (response && response.events && Array.isArray(response.events)) {
      displayEvents(response.events);
      eventCount.textContent = `(${response.events.length})`;
    } else {
      displayEvents([]);
      eventCount.textContent = '(0)';
    }
  } catch (error) {
    console.error('Error loading events:', error);
    showError('Error loading events: ' + error.message);
    displayEvents([]);
    eventCount.textContent = '(0)';
  }
}

/**
 * Loads keywords from storage
 */
async function loadKeywords() {
  try {
    const result = await chrome.storage.local.get(['keywords']);
    const keywords = result.keywords || {
      checkin: ['check-in', 'checked in', 'checkin', 'in', 'present', 'here', 'arrived'],
      checkout: ['check out', 'checked out', 'checkout', 'out', 'left', 'exit', 'gone', 'departed']
    };
    
    checkinKeywords.textContent = keywords.checkin.join(', ');
    checkoutKeywords.textContent = keywords.checkout.join(', ');
    
    // Set modal inputs
    checkinKeywordsInput.value = keywords.checkin.join(', ');
    checkoutKeywordsInput.value = keywords.checkout.join(', ');
  } catch (error) {
    showError('Error loading keywords: ' + error.message);
  }
}

/**
 * Displays events in the container
 * @param {Array} events - Array of event objects
 */
function displayEvents(events) {
  // Clear container first to remove "Loading events..." message
  eventsContainer.innerHTML = '';
  
  if (!events || events.length === 0) {
    eventsContainer.innerHTML = '<div class="empty-state">No events yet. Check-in/check-out messages will appear here.</div>';
    return;
  }
  
  const html = events.map(event => {
    const typeClass = event.type === 'checkin' ? 'checkin' : 'checkout';
    const timestamp = formatTimestamp(event.isoTimestamp);
    
    return `
      <div class="event-item ${typeClass}">
        <div class="event-header">
          <span class="event-name">${escapeHtml(event.name || 'Unknown')}</span>
          <span class="event-type ${typeClass}">${event.type}</span>
        </div>
        <div class="event-message">${escapeHtml(event.message || '')}</div>
        <div class="event-timestamp">${escapeHtml(timestamp)}</div>
      </div>
    `;
  }).join('');
  
  eventsContainer.innerHTML = html;
}

/**
 * Updates status indicator
 * @param {boolean} enabled - Whether logging is enabled
 */
function updateStatus(enabled) {
  if (enabled) {
    statusDot.classList.add('active');
    statusDot.classList.remove('inactive');
    statusText.textContent = 'Logging Active';
  } else {
    statusDot.classList.remove('active');
    statusDot.classList.add('inactive');
    statusText.textContent = 'Logging Inactive';
  }
}

/**
 * Checks if user is on WhatsApp Web
 */
async function checkWhatsAppWeb() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab && tab.url && tab.url.includes('web.whatsapp.com')) {
      // On WhatsApp Web
      statusText.textContent = loggingToggle.checked ? 'Logging Active' : 'Logging Inactive';
    } else {
      // Not on WhatsApp Web
      statusText.textContent = 'Not on WhatsApp Web';
      statusDot.classList.remove('active');
      statusDot.classList.add('inactive');
    }
  } catch (error) {
    console.error('Error checking WhatsApp Web:', error);
  }
}

/**
 * Sets up event listeners
 */
function setupEventListeners() {
  // Logging toggle
  loggingToggle.addEventListener('change', async () => {
    const enabled = loggingToggle.checked;
    updateStatus(enabled);
    
    try {
      await chrome.storage.local.set({ loggingEnabled: enabled });
      
      // Notify content script
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('web.whatsapp.com')) {
        chrome.tabs.sendMessage(tab.id, { action: 'toggleLogging', enabled });
      }
    } catch (error) {
      showError('Error updating logging status: ' + error.message);
      loggingToggle.checked = !enabled; // Revert
    }
  });
  
  // Auto-download toggle
  autoDownloadToggle.addEventListener('change', async () => {
    try {
      await chrome.storage.local.set({ autoDownload: autoDownloadToggle.checked });
    } catch (error) {
      showError('Error updating auto-download setting: ' + error.message);
      autoDownloadToggle.checked = !autoDownloadToggle.checked; // Revert
    }
  });
  
  // Download button
  downloadBtn.addEventListener('click', async () => {
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Exporting...';
    
    try {
      const response = await chrome.runtime.sendMessage({ action: 'exportCSV' });
      
      if (response && response.success) {
        showError('CSV exported successfully!', 'success');
      } else {
        showError(response?.error || 'Failed to export CSV');
      }
    } catch (error) {
      showError('Error exporting CSV: ' + error.message);
    } finally {
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download CSV';
    }
  });
  
  // Clear button
  clearBtn.addEventListener('click', async () => {
    if (!confirm('Are you sure you want to clear all events? This cannot be undone.')) {
      return;
    }
    
    clearBtn.disabled = true;
    
    try {
      const response = await chrome.runtime.sendMessage({ action: 'clearEvents' });
      
      if (response && response.success) {
        await loadEvents();
        showError('Events cleared successfully!', 'success');
      } else {
        showError(response?.error || 'Failed to clear events');
      }
    } catch (error) {
      showError('Error clearing events: ' + error.message);
    } finally {
      clearBtn.disabled = false;
    }
  });
  
  // Refresh button
  refreshBtn.addEventListener('click', async () => {
    refreshBtn.disabled = true;
    refreshBtn.textContent = 'Refreshing...';
    
    await loadEvents();
    
    refreshBtn.disabled = false;
    refreshBtn.textContent = 'Refresh';
  });
  
  // Edit keywords button
  editKeywordsBtn.addEventListener('click', () => {
    keywordsModal.classList.add('show');
  });
  
  // Close modal button
  closeModalBtn.addEventListener('click', () => {
    keywordsModal.classList.remove('show');
  });
  
  // Cancel keywords button
  cancelKeywordsBtn.addEventListener('click', () => {
    keywordsModal.classList.remove('show');
    // Reset inputs
    loadKeywords();
  });
  
  // Save keywords button
  saveKeywordsBtn.addEventListener('click', async () => {
    try {
      const checkinKeywordsList = checkinKeywordsInput.value
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      const checkoutKeywordsList = checkoutKeywordsInput.value
        .split(',')
        .map(k => k.trim())
        .filter(k => k.length > 0);
      
      if (checkinKeywordsList.length === 0 || checkoutKeywordsList.length === 0) {
        showError('Please provide at least one keyword for each type');
        return;
      }
      
      const keywords = {
        checkin: checkinKeywordsList,
        checkout: checkoutKeywordsList
      };
      
      const response = await chrome.runtime.sendMessage({ action: 'updateKeywords', keywords });
      
      if (response && response.success) {
        await loadKeywords();
        keywordsModal.classList.remove('show');
        showError('Keywords updated successfully!', 'success');
      } else {
        showError(response?.error || 'Failed to update keywords');
      }
    } catch (error) {
      showError('Error updating keywords: ' + error.message);
    }
  });
  
  // Close modal on outside click
  keywordsModal.addEventListener('click', (e) => {
    if (e.target === keywordsModal) {
      keywordsModal.classList.remove('show');
    }
  });
}

/**
 * Shows an error message
 * @param {string} message - Error message
 * @param {string} type - Message type ('error' or 'success')
 */
function showError(message, type = 'error') {
  errorContainer.textContent = message;
  errorContainer.className = 'error-container show';
  
  if (type === 'success') {
    errorContainer.style.background = '#e8f5e9';
    errorContainer.style.borderColor = '#4CAF50';
    errorContainer.style.color = '#2e7d32';
  } else {
    errorContainer.style.background = '#ffebee';
    errorContainer.style.borderColor = '#f44336';
    errorContainer.style.color = '#c62828';
  }
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    errorContainer.classList.remove('show');
  }, 5000);
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
 * Escapes HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPopup);
} else {
  initPopup();
}

// Refresh events every 5 seconds
setInterval(loadEvents, 5000);

