# Local Testing Checklist - Right Now

You're doing it correctly! Testing locally before publishing is smart.

## ✅ Current Setup

- [x] Extension loaded via "Load unpacked"
- [x] Testing on your PC
- [x] Extension folder selected directly

## 🧪 Quick Test (5 minutes)

### Test 1: Extension Loads ✓
- [ ] Go to `chrome://extensions`
- [ ] Extension appears in list
- [ ] No red error messages
- [ ] Status shows "Enabled"

### Test 2: Popup Works ✓
- [ ] Open WhatsApp Web
- [ ] Click extension icon
- [ ] Popup opens
- [ ] "Enable Logging" toggle works
- [ ] Status shows "Logging Active" (green)

### Test 3: Console Check ✓
- [ ] Press F12 (Developer Tools)
- [ ] Click "Console" tab
- [ ] See: `[Check-in Logger] Content script initialized. Logging enabled: true`
- [ ] No red errors from your extension

### Test 4: Message Detection ✓
- [ ] Go to a WhatsApp group
- [ ] Send message: **"check-in"**
- [ ] Check console for:
  ```
  [Check-in Logger] Starting message processing...
  [Check-in Logger] Found X messages...
  [Check-in Logger] ✅ Detected checkin: "check-in"
  ```
- [ ] Click extension icon → "Refresh"
- [ ] Event appears in popup

### Test 5: CSV Export ✓
- [ ] Click "Download CSV" button
- [ ] File downloads to Downloads folder
- [ ] Open file in Excel/Sheets
- [ ] Has headers and your event

## 🐛 If Something Doesn't Work

### Extension Not Loading
- Check: All files in folder?
- Check: manifest.json valid?
- Check: Icons exist? (icon16.png, icon48.png, icon128.png)

### Popup Not Opening
- Check: Extension enabled in chrome://extensions?
- Check: Click extension icon (not right-click)
- Check: Console for errors (F12)

### Messages Not Detected
- Check: In a group chat? (not individual)
- Check: Logging enabled? (toggle ON)
- Check: Console for `[Check-in Logger]` messages
- Check: Message contains keywords? ("check-in", "check out", etc.)

### CSV Not Downloading
- Check: Chrome download permissions
- Check: Console for errors
- Check: Try with at least 1 event logged

## 📝 Testing Notes

Write down any issues you find:

```
Date: ___________
Chrome Version: ___________

Issues Found:
1. 
2. 
3. 

What Works:
✓
✓
✓

Ready to Publish: [ ] Yes  [ ] No
```

## ✅ When Everything Works

Once all tests pass:

1. **Create ZIP file:**
   - Run: `.\prepare-for-store.ps1`
   - Or manually zip required files

2. **Take screenshots:**
   - See `SCREENSHOT_GUIDE.md`
   - Need at least 1 screenshot (1280x800)

3. **Submit to Chrome Web Store:**
   - See `CHROME_STORE_GUIDE.md`
   - Use `STORE_LISTING.md` for content

## 🎯 Focus Areas

**Must Work:**
- ✅ Extension loads without errors
- ✅ Popup opens and works
- ✅ Message detection works
- ✅ Events show in popup
- ✅ CSV downloads

**Nice to Have:**
- Custom keywords work
- Auto-download works
- Clear events works

## 💡 Pro Tips

1. **Test in real group** - Use actual WhatsApp group, not just test
2. **Test different messages** - "check-in", "checking in", "in", "check out", etc.
3. **Check console regularly** - Look for `[Check-in Logger]` messages
4. **Reload if needed** - If something breaks, reload extension in chrome://extensions

## 🚀 You're Ready When:

- [ ] All 5 tests pass
- [ ] No errors in console
- [ ] Messages detected correctly
- [ ] CSV exports work
- [ ] Extension works smoothly

Good luck with testing! 🧪

