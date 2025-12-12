# Troubleshooting: Extension Not Showing in Chrome

## Problem
Your extension "WhatsApp Web Check-in Logger" is not appearing in `chrome://extensions` page.

## Solution Steps

### Step 1: Enable Developer Mode

1. Go to `chrome://extensions` (you're already there)
2. Look at the **top-right corner** of the page
3. Find the toggle switch that says **"Developer mode"**
4. **Turn it ON** (switch should turn blue)
5. You should see new buttons appear: "Load unpacked", "Pack extension", etc.

### Step 2: Check Your Extension Files

Make sure you have ALL these files in your extension folder:

**Required Files:**
- ✅ `manifest.json`
- ✅ `popup.html`
- ✅ `popup.js`
- ✅ `popup.css`
- ✅ `content_script.js`
- ✅ `background.js`
- ✅ `utils.js`
- ✅ `icon16.png` (16x16 pixels)
- ✅ `icon48.png` (48x48 pixels)
- ✅ `icon128.png` (128x128 pixels)

**Important:** The icon files are REQUIRED. If they're missing, the extension won't load!

### Step 3: Create Icons (If Missing)

If you don't have the icon files:

1. Open `create-icons.html` in your browser
2. Click "Download All Icons"
3. Save the three files in your extension folder:
   - `icon16.png`
   - `icon48.png`
   - `icon128.png`

### Step 4: Load the Extension

1. In `chrome://extensions` page, make sure **Developer mode is ON**
2. Click the **"Load unpacked"** button (should appear after enabling Developer mode)
3. Navigate to your extension folder (the folder containing all the files)
4. Select the folder (don't go inside it, just select the folder itself)
5. Click "Select Folder" or "Open"
6. Your extension should now appear in the list!

### Step 5: Check for Errors

If the extension still doesn't appear:

1. Look at the top of the `chrome://extensions` page
2. Check for any **red error messages**
3. Click on your extension card (if it appears)
4. Look for error messages in red text
5. Common errors:
   - "Manifest file is missing or unreadable"
   - "Could not load icon"
   - "Service worker registration failed"

---

## Common Issues and Fixes

### Issue 1: "Load unpacked" Button Not Showing

**Problem:** You don't see the "Load unpacked" button.

**Solution:**
- Make sure Developer mode toggle is ON (blue, not gray)
- Refresh the `chrome://extensions` page
- The button should appear at the top-left

### Issue 2: "Manifest file is missing or unreadable"

**Problem:** Chrome can't find or read `manifest.json`.

**Solution:**
- Make sure `manifest.json` is in the root of your extension folder
- Check that the file is not corrupted
- Verify the JSON syntax is correct (no extra commas, proper quotes)

### Issue 3: "Could not load icon"

**Problem:** Icon files are missing or in wrong format.

**Solution:**
- Create icons using `create-icons.html`
- Make sure files are named exactly: `icon16.png`, `icon48.png`, `icon128.png`
- Files must be PNG format
- Files must be in the same folder as `manifest.json`

### Issue 4: Extension Loads But Shows Errors

**Problem:** Extension appears but has red error messages.

**Solution:**
- Click on the extension card
- Read the error message
- Check the browser console for details
- Fix the issue mentioned in the error

### Issue 5: Wrong Folder Selected

**Problem:** You selected a file instead of the folder, or selected the wrong folder.

**Solution:**
- Make sure you select the FOLDER containing all extension files
- Don't select individual files
- Don't select a parent folder - select the exact folder with manifest.json

---

## Quick Checklist

Before loading the extension, verify:

- [ ] Developer mode is ON (blue toggle)
- [ ] All 8 required files are in the folder
- [ ] All 3 icon files exist (icon16.png, icon48.png, icon128.png)
- [ ] manifest.json is in the root folder
- [ ] You're selecting the correct folder (not a file)
- [ ] No typos in file names

---

## Step-by-Step Visual Guide

```
1. Go to chrome://extensions
   ↓
2. Turn ON Developer mode (top-right toggle)
   ↓
3. Click "Load unpacked" button (top-left)
   ↓
4. Select your extension folder
   ↓
5. Extension appears in the list!
```

---

## Still Not Working?

If your extension still doesn't show:

1. **Check the folder structure:**
   ```
   extension/
   ├── manifest.json
   ├── popup.html
   ├── popup.js
   ├── popup.css
   ├── content_script.js
   ├── background.js
   ├── utils.js
   ├── icon16.png
   ├── icon48.png
   └── icon128.png
   ```

2. **Verify manifest.json is valid:**
   - Open manifest.json in a text editor
   - Check for syntax errors
   - Make sure all quotes are correct

3. **Check browser console:**
   - Press F12 to open DevTools
   - Go to Console tab
   - Look for error messages

4. **Try reloading:**
   - Remove the extension (if it partially loaded)
   - Click "Load unpacked" again
   - Select the folder again

---

## Need More Help?

Share:
- What error message you see (if any)
- Whether Developer mode is ON
- Whether you see the "Load unpacked" button
- Whether the icon files exist

Good luck! 🚀

