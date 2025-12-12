# WhatsApp Web Check-in Logger — Chrome Extension

A Chrome extension that automatically detects and logs check-in/check-out messages from WhatsApp Web group chats to CSV files.

## Features

- **Real-time Detection**: Uses MutationObserver to detect new messages in WhatsApp Web group chats
- **Intelligent Parsing**: Detects check-in/check-out messages using customizable keyword lists
- **CSV Export**: Exports logged events to CSV files with proper escaping
- **Local Storage**: Stores all events locally in your browser using chrome.storage.local
- **Popup UI**: Easy-to-use popup interface for controlling the extension
- **Privacy-Focused**: Only reads messages when WhatsApp Web is open and logging is enabled
- **Customizable Keywords**: Edit check-in/check-out keywords through the popup interface
- **Auto-download**: Optional daily automatic CSV export

## Installation

### 🚀 Easy Installation from Chrome Web Store (Recommended)

**The easiest way to install the extension:**

1. Open Google Chrome
2. Go to the [Chrome Web Store](https://chrome.google.com/webstore)
3. Search for **"WhatsApp Web Check-in Logger"**
4. Click **"Add to Chrome"**
5. Click **"Add Extension"** in the confirmation dialog
6. The extension is now installed!

**That's it!** No need to download files or enable developer mode. The extension will automatically update when new versions are released.

### 🔧 Manual Installation (For Developers)

If you want to install from source code or the extension is not yet available on the Chrome Web Store:

#### Step 1: Download the Extension

1. Clone or download this repository to your computer
2. Make sure all files are in a single folder

#### Step 2: Create Icons

1. Open `create-icons.html` in your browser
2. Click "Download All Icons"
3. Save the three icon files (icon16.png, icon48.png, icon128.png) in the extension folder

#### Step 3: Load the Extension in Chrome

1. Open Google Chrome
2. Navigate to `chrome://extensions/`
3. Enable **Developer mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the folder containing the extension files
6. The extension should now appear in your extensions list

#### Step 4: Grant Permissions

When you first use the extension, Chrome will prompt you for permissions:
- **activeTab**: Allows the extension to access the active tab (WhatsApp Web)
- **storage**: Stores events locally in your browser
- **downloads**: Enables CSV file downloads
- **scripting**: Injects content scripts into WhatsApp Web
- **identity**: Required for optional Google Sheets sync (if enabled)

Click **Allow** to grant these permissions.

#### Step 5: Verify Installation

1. Open WhatsApp Web in Chrome (`https://web.whatsapp.com`)
2. Click the extension icon in the Chrome toolbar
3. You should see the popup interface with status indicators

## Usage

### Basic Usage

1. **Enable Logging**: 
   - Open WhatsApp Web
   - Click the extension icon
   - Toggle "Enable Logging" to ON (green)

2. **Monitor Messages**:
   - The extension automatically detects check-in/check-out messages in group chats
   - Messages containing keywords like "check-in", "checked in", "in", "present", "check out", "checked out", "out", "left", "exit" will be logged

3. **View Events**:
   - Click the extension icon to see the last 50 logged events
   - Events show: member name, message text, type (checkin/checkout), and timestamp

4. **Export CSV**:
   - Click "Download CSV" to export all logged events
   - The CSV file will be saved to your Downloads folder
   - Filename format: `whatsapp-checkins-YYYY-MM-DDTHH-MM-SS.csv`

### Advanced Features

#### Customize Keywords

1. Click "Edit Keywords" in the popup
2. Enter comma-separated keywords for check-in and check-out
3. Click "Save"
4. The extension will use your custom keywords for detection

#### Auto-download

1. Enable "Auto-download daily" in the popup
2. The extension will automatically export a CSV file every 24 hours
3. Files will be saved to your Downloads folder

#### Clear Events

1. Click "Clear Events" to remove all logged events
2. This action cannot be undone
3. Make sure to export your CSV before clearing if you want to keep the data

## File Structure

```
extension/
├── manifest.json          # Extension manifest (v3)
├── popup.html             # Popup UI HTML
├── popup.js               # Popup UI logic
├── popup.css              # Popup styling
├── content_script.js      # Message observer and parser
├── background.js          # Storage, CSV export, downloads
├── utils.js               # Helper functions (parsing, CSV generation)
├── icon16.png             # Extension icon (16x16)
├── icon48.png             # Extension icon (48x48)
├── icon128.png            # Extension icon (128x128)
└── README.md              # This file
```

## CSV Format

The exported CSV file contains the following columns:

- **Group**: Name of the WhatsApp group
- **Name**: Name of the member who sent the message
- **Message**: Full message text
- **Type**: Either "checkin" or "checkout"
- **Timestamp**: ISO 8601 timestamp (e.g., 2024-01-15T10:30:00.000Z)

Example:
```csv
Group,Name,Message,Type,Timestamp
"Team Chat","John Doe","I'm checking in","checkin","2024-01-15T10:30:00.000Z"
"Team Chat","Jane Smith","checking out for today","checkout","2024-01-15T18:00:00.000Z"
```

## Privacy & Security

### Privacy Notice

- **Local Storage Only**: All data is stored locally in your browser using chrome.storage.local
- **No External Servers**: The extension does not send data to any external servers
- **Active Tab Only**: The extension only reads messages when:
  - WhatsApp Web is open in the active tab
  - Logging is enabled in the popup
- **User Control**: You can disable logging at any time
- **Data Export**: You can export and delete your data at any time

### Permissions Explained

- **activeTab**: Required to access WhatsApp Web page content
- **storage**: Required to store events locally
- **downloads**: Required to save CSV files
- **scripting**: Required to inject content scripts
- **identity**: Required only if using Google Sheets sync (optional feature)

## Troubleshooting

### Extension Not Detecting Messages

1. **Check if logging is enabled**: Open the popup and verify the toggle is ON
2. **Verify you're on WhatsApp Web**: The extension only works on `web.whatsapp.com`
3. **Refresh the page**: Reload WhatsApp Web after enabling the extension
4. **Check browser console**: Open DevTools (F12) and look for error messages

### CSV Export Not Working

1. **Check download permissions**: Ensure Chrome has permission to download files
2. **Check storage**: Verify you have events logged (check the popup)
3. **Try manual export**: Click "Download CSV" in the popup

### Messages Not Being Detected

1. **Check keywords**: Verify your message contains one of the configured keywords
2. **Check group chat**: The extension works best in group chats (not individual chats)
3. **Check message format**: The extension looks for keywords in message text

### Extension Icon Not Showing

1. **Check installation**: Verify the extension is loaded in `chrome://extensions/`
2. **Pin the extension**: Right-click the extension icon and select "Pin"
3. **Check for errors**: Look for errors in `chrome://extensions/` under the extension

## Development

### Testing

1. Load the extension in Chrome (see Installation)
2. Open WhatsApp Web
3. Send test messages with check-in/check-out keywords
4. Verify events appear in the popup
5. Test CSV export functionality

### Debugging

1. **Content Script**: Open DevTools on WhatsApp Web page and check console
2. **Background Script**: Go to `chrome://extensions/`, click "Service Worker" under the extension
3. **Popup**: Right-click the popup and select "Inspect"

### Modifying Keywords

Keywords can be modified in two ways:
1. Through the popup UI (recommended)
2. Directly in `utils.js` (DEFAULT_KEYWORDS constant)

## Google Sheets Sync (Optional)

The extension includes commented-out code for Google Sheets sync. To enable:

1. Set up OAuth credentials in Chrome Web Store Developer Dashboard
2. Uncomment the Google Sheets sync code in `background.js`
3. Configure your Google Sheets API credentials
4. Update the spreadsheet ID in the code

**Note**: Google Sheets sync is disabled by default for privacy reasons.

## Limitations

- Only works on WhatsApp Web (not mobile app)
- Requires WhatsApp Web to be open and active
- Detection relies on keyword matching (may have false positives/negatives)
- Group name extraction may not work perfectly in all cases
- Member name extraction depends on WhatsApp Web's DOM structure (may break if WhatsApp updates their UI)

## Publishing to Chrome Web Store

Want to publish this extension to the Chrome Web Store so users can easily install it?

See **[CHROME_STORE_GUIDE.md](CHROME_STORE_GUIDE.md)** for complete step-by-step instructions.

**Quick summary:**
1. Create a Chrome Web Store Developer account ($5 one-time fee)
2. Prepare your extension files (use `prepare-for-store.ps1` or `prepare-for-store.sh`)
3. Upload to Chrome Web Store Developer Dashboard
4. Fill in store listing (see `STORE_LISTING.md` for ready-to-use content)
5. Submit for review

Once published, users can simply search for "WhatsApp Web Check-in Logger" and install with one click!

## Support

For issues, questions, or contributions:
1. Check the Troubleshooting section above
2. Review browser console for error messages
3. Verify all files are present and correctly formatted
4. If installed from Chrome Web Store, check the extension's store page for updates and support

## License

This extension is provided as-is for personal use. Use responsibly and respect privacy.

## Changelog

### Version 1.0.0
- Initial release
- Real-time message detection
- CSV export functionality
- Popup UI with event display
- Customizable keywords
- Auto-download feature
- Local storage for events

