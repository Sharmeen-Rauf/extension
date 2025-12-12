# Chrome Web Store Listing Content

Copy and paste this content when creating your store listing.

## Basic Information

**Extension Name**: WhatsApp Web Check-in Logger

**Category**: Productivity

**Language**: English (Primary)

## Short Description (132 characters max)

```
Automatically logs check-in/check-out messages from WhatsApp Web group chats to CSV files. Real-time detection with customizable keywords.
```

## Detailed Description

```
WhatsApp Web Check-in Logger is a powerful Chrome extension that automatically detects and logs check-in/check-out messages from your WhatsApp Web group chats.

KEY FEATURES:
✅ Real-time Detection - Automatically detects new messages using MutationObserver
✅ Intelligent Parsing - Detects check-in/check-out messages using customizable keywords
✅ CSV Export - Export all logged events to CSV files with proper formatting
✅ Local Storage - All data stored locally in your browser (privacy-focused)
✅ Easy-to-Use UI - Simple popup interface for controlling the extension
✅ Customizable Keywords - Edit check-in/check-out keywords to match your needs
✅ Auto-download - Optional daily automatic CSV export

HOW IT WORKS:
1. Enable logging in the extension popup
2. The extension automatically monitors WhatsApp Web group chats
3. When a message contains check-in/check-out keywords, it's logged
4. View logged events in the popup
5. Export to CSV whenever you need

PRIVACY & SECURITY:
- All data stored locally in your browser
- No external servers - your data never leaves your computer
- Only reads messages when WhatsApp Web is open and logging is enabled
- You have full control - disable logging anytime
- Export and delete your data whenever you want

PERFECT FOR:
- Team attendance tracking
- Office check-in/check-out logging
- Group activity monitoring
- Time tracking in group chats

INSTALLATION:
1. Click "Add to Chrome"
2. Grant permissions when prompted
3. Open WhatsApp Web
4. Enable logging in the extension popup
5. Start tracking check-ins/check-outs!

SUPPORT:
If you encounter any issues, check the extension popup for error messages or review the browser console for debugging information.
```

## Privacy Practices

### Does your extension collect user data?

**Answer**: No

**Explanation**: This extension does not collect, transmit, or store user data on any external servers. All data is stored locally in the user's browser using chrome.storage.local. The extension only reads messages when the user has WhatsApp Web open and has explicitly enabled logging.

### How do you use user data?

**Answer**: N/A - We don't collect user data

### Permissions Justification

**activeTab**: Required to access WhatsApp Web page content and read messages when the user has the page open.

**storage**: Required to store logged events locally in the user's browser using chrome.storage.local.

**downloads**: Required to export logged events to CSV files that are saved to the user's Downloads folder.

**scripting**: Required to inject content scripts into WhatsApp Web pages to monitor messages.

**identity**: Optional permission for future Google Sheets sync feature (currently disabled by default).

## Screenshots Description

### Screenshot 1: Main Interface
Shows the extension popup with logging enabled, displaying the status indicator and control toggles.

### Screenshot 2: Events Display
Shows the popup displaying multiple logged check-in/check-out events with member names, messages, and timestamps.

### Screenshot 3: CSV Export
Shows an exported CSV file opened in a spreadsheet application, displaying the logged check-in/check-out data in a structured format.

## Promotional Images (Optional)

If creating promotional images:
- Use WhatsApp green (#25D366) as primary color
- Include checkmark icons or "CI/CO" text
- Keep text minimal and clear
- Show the extension icon prominently

## Keywords for Discovery

- WhatsApp
- check-in
- check-out
- attendance
- logging
- CSV
- group chat
- time tracking
- attendance tracker
- WhatsApp logger

## Support Information

**Support URL** (if you have one): (Optional - can leave blank)

**Privacy Policy URL** (if you have one): (Optional - can leave blank)

**Note**: For a simple extension like this, you may not need separate URLs. The privacy information can be included in the description.

