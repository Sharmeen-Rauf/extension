# Quick 5-Minute Test Guide

Test your extension quickly before publishing.

## ⚡ Quick Test (5 minutes)

### 1. Load Extension (30 seconds)
- [ ] Go to `chrome://extensions`
- [ ] Enable Developer mode
- [ ] Click "Load unpacked"
- [ ] Select your extension folder
- [ ] Extension appears in list (no red errors)

### 2. Test Popup (30 seconds)
- [ ] Open WhatsApp Web
- [ ] Click extension icon
- [ ] Popup opens
- [ ] Toggle "Enable Logging" ON
- [ ] Status shows "Logging Active" (green)

### 3. Test Message Detection (2 minutes)
- [ ] Go to a WhatsApp group
- [ ] Send message: **"check-in"**
- [ ] Open browser console (F12)
- [ ] Look for: `[Check-in Logger] Detected checkin`
- [ ] Click extension icon
- [ ] Click "Refresh"
- [ ] Event should appear in list

### 4. Test CSV Export (1 minute)
- [ ] Click "Download CSV"
- [ ] File downloads
- [ ] Open file in Excel/Sheets
- [ ] Should have headers and your event

### 5. Final Check (1 minute)
- [ ] No errors in console
- [ ] Extension works smoothly
- [ ] Ready to publish!

## 🎯 Minimum Requirements

Extension is ready if:
- ✅ Loads without errors
- ✅ Detects "check-in" messages
- ✅ Shows events in popup
- ✅ CSV downloads correctly

## 🐛 If Something Fails

1. **Check console** (F12) for errors
2. **Reload extension** in chrome://extensions
3. **Refresh WhatsApp Web** page
4. **Check** `DEBUGGING_GUIDE.md` for help

## ✅ All Tests Pass?

You're ready to:
1. Create ZIP file
2. Take screenshots
3. Submit to Chrome Web Store!

Good luck! 🚀

