# Screenshot Creation Guide

## Quick Steps to Create Required Screenshots

### Screenshot 1: Extension Popup (REQUIRED)

**What to show:**
- Extension popup open
- "Enable Logging" toggle ON (green)
- Status indicator showing "Logging Active"
- Recent events section (even if empty)

**Steps:**
1. Open WhatsApp Web in Chrome
2. Click the extension icon in toolbar
3. Make sure logging is enabled (toggle ON)
4. Take screenshot of the popup
5. Resize to 1280x800 pixels
6. Save as PNG or JPEG

**Tools to use:**
- Windows: `Windows + Shift + S` (Snipping Tool)
- Mac: `Cmd + Shift + 4`
- Chrome: Right-click popup → Inspect → Device toolbar → Screenshot

---

### Screenshot 2: Events Display (Recommended)

**What to show:**
- Popup with logged events visible
- Multiple check-in/check-out events
- Member names, messages, timestamps
- Event types (checkin/checkout badges)

**Steps:**
1. Send test messages in WhatsApp group:
   - "checking in"
   - "check out"
   - "I'm here"
   - "leaving now"
2. Open extension popup
3. Show the events list
4. Take screenshot
5. Resize to 1280x800

---

### Screenshot 3: CSV Export (Recommended)

**What to show:**
- CSV file opened in Excel/Google Sheets
- Sample check-in/check-out data
- Columns: Group, Name, Message, Type, Timestamp
- Multiple rows of data

**Steps:**
1. Log some events using the extension
2. Click "Download CSV" in popup
3. Open the CSV file in Excel or Google Sheets
4. Take screenshot of the spreadsheet
5. Resize to 1280x800

---

## Screenshot Requirements Checklist

- [ ] At least 1 screenshot (REQUIRED)
- [ ] Size: 1280x800 OR 640x400 pixels
- [ ] Format: JPEG or PNG (no transparency/alpha)
- [ ] Clear and high quality
- [ ] Shows extension functionality
- [ ] No personal/sensitive information visible

---

## Resizing Screenshots

### Using Windows Paint:
1. Open screenshot in Paint
2. Click "Resize"
3. Select "Pixels"
4. Enter: 1280 width, 800 height
5. Uncheck "Maintain aspect ratio" (or crop first)
6. Save as PNG or JPEG

### Using Online Tools:
- **ResizeImage.net** - Free online resizer
- **ILoveIMG.com** - Image resizer
- **Photopea.com** - Free Photoshop alternative

### Using GIMP:
1. Open image
2. Image → Scale Image
3. Set width: 1280, height: 800
4. File → Export As → PNG/JPEG

---

## Tips for Better Screenshots

1. **Use a clean background** - Close unnecessary tabs
2. **Show the extension clearly** - Make sure popup is fully visible
3. **Use test data** - Don't show real personal information
4. **Consistent style** - Use similar colors/backgrounds
5. **Highlight features** - Show key functionality
6. **Remove transparency** - Convert PNG with alpha to solid background

---

## Example Screenshot Scenarios

### Scenario 1: Minimal (Just Required)
- 1 screenshot: Extension popup with logging enabled
- Shows basic functionality
- Good enough for submission

### Scenario 2: Recommended (3 Screenshots)
- Screenshot 1: Extension popup
- Screenshot 2: Events display
- Screenshot 3: CSV export
- Shows full workflow

### Scenario 3: Complete (5 Screenshots)
- All from Scenario 2, plus:
- Screenshot 4: Keywords editor
- Screenshot 5: Settings view
- Comprehensive coverage

---

## Quick Test Data for Screenshots

To create test events for screenshots, send these messages in a WhatsApp group:

```
checking in
I'm here
present
check out
leaving now
out
```

The extension will detect these and create events you can screenshot.

---

## Common Issues

**Issue**: Screenshot has transparency
- **Solution**: Open in Paint, add white background, save as JPEG

**Issue**: Screenshot is wrong size
- **Solution**: Use Paint or online tool to resize to 1280x800

**Issue**: Popup closes when trying to screenshot
- **Solution**: Use Chrome DevTools to inspect popup, then screenshot

**Issue**: Screenshot is blurry
- **Solution**: Use high DPI display or zoom in before capturing

---

## Ready to Upload?

Once you have your screenshots:
1. Verify they're 1280x800 or 640x400
2. Check they're JPEG or PNG (no alpha)
3. Make sure they show extension functionality
4. Upload to Chrome Web Store
5. Save draft

Good luck! 📸

