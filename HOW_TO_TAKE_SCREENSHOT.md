# How to Take a Screenshot of Your Extension - Detailed Guide

## What is a Screenshot?

A **screenshot** is a picture/capture of what you see on your computer screen. In this case, you need to take a picture of your extension's popup window.

## What You Need to Capture

You need to take a picture of the **extension popup** - that's the small window that appears when you click the extension icon in Chrome.

---

## Step-by-Step Instructions

### Step 1: Open WhatsApp Web

1. Open Google Chrome browser
2. Go to: `https://web.whatsapp.com`
3. Log in to WhatsApp Web (scan QR code if needed)
4. Wait for WhatsApp to load completely

### Step 2: Find Your Extension Icon

1. Look at the top-right corner of Chrome (near the address bar)
2. You should see a puzzle piece icon (🧩) or your extension icon
3. If you don't see it:
   - Click the puzzle piece icon
   - Find "WhatsApp Web Check-in Logger" in the list
   - Click the pin icon (📌) next to it to pin it to the toolbar

### Step 3: Open the Extension Popup

1. **Click** on your extension icon (the one you just pinned)
2. A small window/popup will appear
3. This popup shows:
   - Title: "WhatsApp Web Check-in Logger"
   - Status indicator (green or red dot)
   - "Enable Logging" toggle switch
   - Buttons like "Download CSV", "Clear Events"
   - Recent events section

### Step 4: Enable Logging (If Not Already Enabled)

1. In the popup window, find the "Enable Logging" toggle
2. Make sure it's turned ON (should be green/highlighted)
3. If it's OFF, click it to turn it ON

### Step 5: Take the Screenshot

**Method 1: Using Windows Snipping Tool (Easiest)**

1. Make sure the extension popup is open and visible
2. Press these keys together: `Windows + Shift + S`
   - (Windows key is usually between Ctrl and Alt)
3. Your screen will dim slightly
4. Click and drag your mouse to select the popup window
5. The screenshot is automatically copied to your clipboard
6. Open Paint (search "Paint" in Windows)
7. Press `Ctrl + V` to paste
8. Save the file (File → Save As)
9. Name it: `extension-popup.png`

**Method 2: Using Print Screen**

1. Make sure the extension popup is open
2. Press the `Print Screen` key (usually labeled "PrtScn" or "PrtSc")
3. Open Paint
4. Press `Ctrl + V` to paste
5. Use the selection tool to crop just the popup
6. Save as `extension-popup.png`

**Method 3: Using Chrome's Built-in Tool**

1. Right-click on the extension popup
2. Select "Inspect" (this opens Developer Tools)
3. In the Developer Tools, click the device toolbar icon (📱)
4. Set custom size: 1280 x 800
5. Take a screenshot using the tools

### Step 6: Resize the Screenshot

Your screenshot needs to be exactly **1280 pixels wide by 800 pixels tall**.

**Using Windows Paint:**

1. Open your screenshot in Paint
2. Click "Resize" button (in the Home tab)
3. Make sure "Pixels" is selected (not Percentage)
4. Enter:
   - Horizontal: `1280`
   - Vertical: `800`
5. Uncheck "Maintain aspect ratio" (if you want exact size)
6. Click OK
7. Save the file

**Using Online Tool (Easier):**

1. Go to: https://www.iloveimg.com/resize-image
2. Upload your screenshot
3. Select "Resize by pixels"
4. Enter: Width: 1280, Height: 800
5. Click "Resize image"
6. Download the resized image

### Step 7: Check the File Format

- Make sure the file is saved as **PNG** or **JPEG**
- File name should be something like: `extension-popup.png`
- File size should be reasonable (not too large, not too small)

---

## What Your Screenshot Should Look Like

Your screenshot should show:

✅ The extension popup window (small window that appears when you click the icon)
✅ Title: "WhatsApp Web Check-in Logger" at the top
✅ Status indicator showing "Logging Active" (green dot)
✅ "Enable Logging" toggle switch (turned ON/green)
✅ Buttons like "Download CSV", "Clear Events"
✅ Recent Events section (can be empty)
✅ Privacy notice at the bottom

**Important:** The screenshot should ONLY show the popup window, not the entire browser or WhatsApp Web page.

---

## Visual Example

```
┌─────────────────────────────────────┐
│  WhatsApp Web Check-in Logger       │  ← Title
│  🟢 Logging Active                  │  ← Status
│                                     │
│  ☑ Enable Logging                  │  ← Toggle (ON)
│                                     │
│  [Download CSV] [Clear Events]      │  ← Buttons
│                                     │
│  Recent Events (0)                  │
│  ┌─────────────────────────────┐   │
│  │ No events yet...            │   │
│  └─────────────────────────────┘   │
│                                     │
│  Privacy: All data stored locally   │
└─────────────────────────────────────┘
```

This is what you need to capture!

---

## Common Questions

**Q: What if the popup closes when I try to screenshot?**
A: Keep the popup open by clicking on it, or use Chrome DevTools method (Method 3 above).

**Q: Can I include the browser in the screenshot?**
A: It's better to capture just the popup, but if the popup is clearly visible, that's okay.

**Q: What if my screenshot is a different size?**
A: You MUST resize it to 1280x800. Use Paint or an online tool.

**Q: Can I use a phone to take a picture?**
A: No, you need a proper screenshot from your computer.

**Q: What format should I save it as?**
A: PNG or JPEG. PNG is usually better quality.

**Q: How do I know if it's the right size?**
A: Right-click the image file → Properties → Details tab. Check the dimensions.

---

## Quick Checklist

Before uploading to Chrome Web Store, make sure:

- [ ] Screenshot shows the extension popup
- [ ] Popup shows "Logging Active" or logging enabled
- [ ] Image size is exactly 1280x800 pixels
- [ ] File format is PNG or JPEG
- [ ] File doesn't have transparency (alpha channel)
- [ ] Image is clear and readable
- [ ] No personal/sensitive information visible

---

## Still Need Help?

If you're still having trouble:

1. **Try the easiest method**: Windows + Shift + S
2. **Use online tools**: Upload to iloveimg.com to resize
3. **Ask for help**: Share what step you're stuck on

Remember: You only need ONE screenshot to submit your extension. Make it count! 📸

