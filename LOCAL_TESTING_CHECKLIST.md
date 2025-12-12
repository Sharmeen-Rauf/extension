# Local Testing Checklist - Before Publishing

You're doing the right thing! Testing locally in developer mode before publishing is the smart approach.

## ✅ Pre-Publishing Testing Checklist

### 1. Basic Functionality Tests

#### Extension Installation
- [ ] Extension loads without errors in `chrome://extensions`
- [ ] No red error messages in extension card
- [ ] All files present (manifest, scripts, icons)
- [ ] Extension icon appears in Chrome toolbar

#### Extension Popup
- [ ] Popup opens when clicking extension icon
- [ ] All UI elements visible and styled correctly
- [ ] "Enable Logging" toggle works (ON/OFF)
- [ ] Status indicator shows correct state (green/red dot)
- [ ] No JavaScript errors in popup console

#### WhatsApp Web Integration
- [ ] Extension works on `web.whatsapp.com`
- [ ] Content script loads (check console for `[Check-in Logger]` messages)
- [ ] Extension detects when on WhatsApp Web
- [ ] No errors when WhatsApp Web loads

### 2. Message Detection Tests

#### Test in Group Chat
- [ ] Send message: "check-in" → Should be detected
- [ ] Send message: "checking in" → Should be detected
- [ ] Send message: "I'm in" → Should be detected
- [ ] Send message: "present" → Should be detected
- [ ] Send message: "check out" → Should be detected
- [ ] Send message: "checking out" → Should be detected
- [ ] Send message: "I'm out" → Should be detected
- [ ] Send message: "left" → Should be detected

#### Test Normal Messages (Should NOT be detected)
- [ ] Send: "Hello everyone" → Should NOT be logged
- [ ] Send: "How are you?" → Should NOT be logged
- [ ] Send: "Meeting at 3pm" → Should NOT be logged

#### Verify Detection
- [ ] Check browser console for detection messages
- [ ] Events appear in popup after clicking "Refresh"
- [ ] Event count updates correctly
- [ ] Events show correct: name, message, type, timestamp

### 3. Storage Tests

#### Event Storage
- [ ] Events are saved to chrome.storage.local
- [ ] Events persist after closing/reopening popup
- [ ] Events persist after browser restart
- [ ] Multiple events are stored correctly
- [ ] Old events are kept (up to 1000 limit)

#### Settings Storage
- [ ] "Enable Logging" setting persists
- [ ] "Auto-download" setting persists
- [ ] Custom keywords are saved
- [ ] Settings survive browser restart

### 4. CSV Export Tests

#### Export Functionality
- [ ] "Download CSV" button works
- [ ] CSV file downloads to Downloads folder
- [ ] CSV filename is correct format: `whatsapp-checkins-YYYY-MM-DDTHH-MM-SS.csv`
- [ ] CSV opens correctly in Excel/Google Sheets

#### CSV Content
- [ ] CSV has correct headers: Group, Name, Message, Type, Timestamp
- [ ] All logged events are in CSV
- [ ] Data is properly formatted
- [ ] Special characters are escaped correctly
- [ ] Timestamps are in ISO format

#### Edge Cases
- [ ] CSV export works with 0 events (empty CSV with headers)
- [ ] CSV export works with 1 event
- [ ] CSV export works with many events (50+)
- [ ] CSV export works with special characters in messages

### 5. UI/UX Tests

#### Popup Interface
- [ ] All buttons are clickable
- [ ] Toggles work smoothly
- [ ] Events list scrolls if many events
- [ ] "Refresh" button updates events
- [ ] "Clear Events" shows confirmation
- [ ] Keywords editor modal works
- [ ] Error messages display correctly

#### Visual Design
- [ ] Colors are correct (WhatsApp green)
- [ ] Text is readable
- [ ] Layout looks good
- [ ] Icons display correctly
- [ ] Responsive to different screen sizes

### 6. Error Handling Tests

#### Test Error Scenarios
- [ ] Extension works when WhatsApp Web is not open
- [ ] Extension handles network errors gracefully
- [ ] Extension handles storage errors gracefully
- [ ] Extension handles invalid data gracefully
- [ ] Error messages are user-friendly

#### Console Checks
- [ ] No red errors in browser console
- [ ] No errors in extension service worker
- [ ] No errors in popup console
- [ ] Warnings are acceptable (not critical)

### 7. Performance Tests

#### Speed Tests
- [ ] Popup opens quickly (< 1 second)
- [ ] Events load quickly (< 2 seconds)
- [ ] CSV export is fast (< 3 seconds for 100 events)
- [ ] Message detection doesn't slow down WhatsApp

#### Resource Usage
- [ ] Extension doesn't cause high CPU usage
- [ ] Extension doesn't cause high memory usage
- [ ] Extension doesn't slow down browser

### 8. Privacy & Security Tests

#### Data Privacy
- [ ] All data stored locally (check chrome.storage.local)
- [ ] No data sent to external servers
- [ ] No network requests to external URLs
- [ ] Privacy notice is accurate

#### Permissions
- [ ] Extension only requests necessary permissions
- [ ] Permissions are justified
- [ ] Extension works with minimal permissions

### 9. Cross-Browser Compatibility (Optional)

If testing on multiple browsers:
- [ ] Works on Chrome (required)
- [ ] Works on Edge (Chromium-based, should work)
- [ ] Works on Brave (Chromium-based, should work)

### 10. Real-World Usage Tests

#### Daily Usage Simulation
- [ ] Use extension for 1-2 days
- [ ] Test with real WhatsApp groups
- [ ] Test with different message types
- [ ] Test with multiple groups
- [ ] Test with different users

#### Edge Cases
- [ ] Very long messages
- [ ] Messages with emojis
- [ ] Messages with special characters
- [ ] Multiple check-ins in short time
- [ ] Group name changes
- [ ] User leaves/joins group

## 🐛 Common Issues to Check

### Issue: Extension Not Detecting Messages
- **Check:** Console for `[Check-in Logger]` messages
- **Check:** Are you in a group chat?
- **Check:** Is logging enabled?
- **Check:** Does message contain keywords?

### Issue: Events Not Showing in Popup
- **Check:** Click "Refresh" button
- **Check:** Check browser console for errors
- **Check:** Events in storage (chrome.storage.local)

### Issue: CSV Not Downloading
- **Check:** Chrome download permissions
- **Check:** Browser console for errors
- **Check:** Downloads folder permissions

### Issue: Extension Not Loading
- **Check:** All files present
- **Check:** manifest.json is valid
- **Check:** Icons exist (icon16.png, icon48.png, icon128.png)
- **Check:** No syntax errors

## 📝 Testing Notes Template

Use this to track your testing:

```
Date: ___________
Chrome Version: ___________
Extension Version: 1.0.0

Issues Found:
1. 
2. 
3. 

Features Working:
✓
✓
✓

Ready to Publish: [ ] Yes  [ ] No

Notes:
_______________________________________
_______________________________________
```

## ✅ Ready to Publish?

Only publish when:
- [ ] All critical tests pass
- [ ] No blocking errors
- [ ] Extension works reliably
- [ ] CSV export works
- [ ] Message detection works
- [ ] UI is polished
- [ ] Privacy is verified
- [ ] Documentation is complete

## 🚀 After Testing

Once all tests pass:

1. **Create ZIP file** using `prepare-for-store.ps1` or `prepare-for-store.sh`
2. **Take screenshots** (see `SCREENSHOT_GUIDE.md`)
3. **Prepare store listing** (see `STORE_LISTING.md`)
4. **Submit to Chrome Web Store** (see `CHROME_STORE_GUIDE.md`)

Good luck with testing! 🧪

