/**
 * SIMPLE Popup - WhatsApp Check-in Logger
 */

// Elements
const loggingToggle = document.getElementById('loggingToggle');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const scanNowBtn = document.getElementById('scanNowBtn');
const eventsContainer = document.getElementById('eventsContainer');
const eventCount = document.getElementById('eventCount');

// Initialize
async function init() {
  await loadSettings();
  await loadEvents();
  setupListeners();
}

// Load settings
async function loadSettings() {
  const result = await chrome.storage.local.get(['loggingEnabled']);
  loggingToggle.checked = result.loggingEnabled !== false;
}

// Load events
async function loadEvents() {
  try {
    const result = await chrome.storage.local.get(['events']);
    const events = result.events || [];
    
    displayEvents(events);
    eventCount.textContent = `(${events.length})`;
  } catch (error) {
    console.error('Error loading events:', error);
    displayEvents([]);
  }
}

// Display events
function displayEvents(events) {
  eventsContainer.innerHTML = '';
  
  if (events.length === 0) {
    eventsContainer.innerHTML = '<div class="empty-state">No events yet. Click "Scan Now" to find check-in/out messages.</div>';
    return;
  }
  
  // Show last 20 events
  const recentEvents = events.slice(-20).reverse();
  
  const html = recentEvents.map(event => {
    const typeClass = event.type === 'checkin' ? 'checkin' : 'checkout';
    const date = new Date(event.isoTimestamp);
    const time = date.toLocaleTimeString();
    
    return `
      <div class="event-item ${typeClass}">
        <div class="event-header">
          <span class="event-name">${escapeHtml(event.name || 'User')}</span>
          <span class="event-type ${typeClass}">${event.type}</span>
        </div>
        <div class="event-message">${escapeHtml(event.message || '')}</div>
        <div class="event-timestamp">${escapeHtml(time)}</div>
      </div>
    `;
  }).join('');
  
  eventsContainer.innerHTML = html;
}

// Setup listeners
function setupListeners() {
  // Logging toggle
  loggingToggle.addEventListener('change', async () => {
    await chrome.storage.local.set({ loggingEnabled: loggingToggle.checked });
  });
  
  // Download CSV
  downloadBtn.addEventListener('click', async () => {
    try {
      const result = await chrome.storage.local.get(['events']);
      const events = result.events || [];
      
      if (events.length === 0) {
        alert('No events to export');
        return;
      }
      
      // Create CSV
      const csv = 'Group,Name,Message,Type,Timestamp\n' +
        events.map(e => 
          `"${e.group}","${e.name}","${e.message}","${e.type}","${e.isoTimestamp}"`
        ).join('\n');
      
      // Download
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `whatsapp-checkins-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      
      alert('CSV downloaded!');
    } catch (error) {
      alert('Error: ' + error.message);
    }
  });
  
  // Clear events
  clearBtn.addEventListener('click', async () => {
    if (confirm('Clear all events?')) {
      await chrome.storage.local.set({ events: [] });
      await loadEvents();
      alert('Events cleared!');
    }
  });
  
  // Refresh
  refreshBtn.addEventListener('click', async () => {
    await loadEvents();
  });
  
  // Scan Now
  scanNowBtn.addEventListener('click', async () => {
    scanNowBtn.disabled = true;
    scanNowBtn.textContent = 'Scanning...';
    
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.url && tab.url.includes('web.whatsapp.com')) {
        // Send message to content script
        chrome.tabs.sendMessage(tab.id, { action: 'scanNow' });
        
        // Wait and reload
        setTimeout(async () => {
          await loadEvents();
          scanNowBtn.textContent = '✅ Scanned!';
          setTimeout(() => {
            scanNowBtn.textContent = '🔍 Scan Now';
            scanNowBtn.disabled = false;
          }, 2000);
        }, 2000);
      } else {
        alert('Please open WhatsApp Web first');
        scanNowBtn.textContent = '🔍 Scan Now';
        scanNowBtn.disabled = false;
      }
    } catch (error) {
      alert('Error: ' + error.message);
      scanNowBtn.textContent = '🔍 Scan Now';
      scanNowBtn.disabled = false;
    }
  });
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Start
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Auto-refresh every 3 seconds
setInterval(loadEvents, 3000);
