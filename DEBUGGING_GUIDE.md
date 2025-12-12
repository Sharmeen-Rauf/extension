# Debugging Guide - Extension Not Working

## Quick Fix Steps

### Step 1: Check Browser Console

1. **Open WhatsApp Web** in Chrome
2. **Press F12** to open Developer Tools
3. **Click "Console" tab**
4. Look for messages starting with `[Check-in Logger]`
5. You should see:
   - "Content script initialized. Logging enabled: true"
   - "Found X messages using selector: ..."
   - "Processing messages in group: ..."

### Step 2: Test Message Detection

1. In a WhatsApp group, send a test message: **"check-in"** or **"check out"**
2. Check the console - you should see:
   - "Detected checkin: 'check-in'"
   - "Stored event: ..."

### Step 3: Check Extension Status

1. Go to `chrome://extensions`
2. Find "WhatsApp Web Check-in Logger"
3. Make sure it's **enabled** (toggle is ON)
4. Click **"Service Worker"** link (if available)
5. Check for errors in the service worker console

### Step 4: Reload Extension

1. Go to `chrome://extensions`
2. Find your extension
3. Click the **refresh/reload icon** (🔄)
4. Go back to WhatsApp Web
5. Refresh the page (F5)
6. Try sending a test message again

## Common Issues

### Issue 1: No Console Messages

**Problem:** Console shows nothing, extension not running.

**Solution:**
- Check if extension is enabled in `chrome://extensions`
- Reload the extension
- Refresh WhatsApp Web page
- Check if content script is injected (look for errors in console)

### Issue 2: "Found 0 messages"

**Problem:** Extension can't find messages in WhatsApp.

**Solution:**
- Make sure you're in a **group chat** (not individual chat)
- Make sure you have messages visible on screen
- Try scrolling to load more messages
- WhatsApp structure might have changed - check console for selector errors

### Issue 3: Messages Found But Not Detected

**Problem:** Console shows "Found X messages" but no events logged.

**Solution:**
- Check if message contains keywords: "check-in", "check out", "in", "out", etc.
- Try sending: "I'm checking in" or "check out"
- Check console for "Detected checkin/checkout" messages

### Issue 4: Events Stored But Not Showing in Popup

**Problem:** Events are logged but popup shows 0 events.

**Solution:**
- Click "Refresh" button in popup
- Check browser console for errors
- Try closing and reopening popup
- Check if events are in storage (see below)

### Issue 5: CSV Download Not Working

**Problem:** Click "Download CSV" but nothing happens.

**Solution:**
- Check browser console for errors
- Make sure Chrome has download permissions
- Try with 0 events (should still create empty CSV)
- Check Downloads folder

## Advanced Debugging

### Check Storage Directly

1. Open WhatsApp Web
2. Press F12 (Developer Tools)
3. Go to **"Application"** tab (or "Storage" in some browsers)
4. Click **"Local Storage"** → `https://web.whatsapp.com`
5. Look for entries starting with `chrome-extension://`
6. Or go to **"Extension"** → Your extension → **"Storage"**

### Check Content Script

1. Open WhatsApp Web
2. Press F12
3. Go to **"Sources"** tab
4. Look for your extension files under "Content scripts"
5. Set breakpoints to debug

### Force Check Messages

1. Open WhatsApp Web
2. Press F12
3. Go to Console tab
4. Type: `chrome.runtime.sendMessage({action: 'forceCheck'})`
5. Press Enter
6. This forces the extension to check for messages

## Test Messages to Try

Send these in a WhatsApp group to test:

```
check-in
checking in
I'm in
present
here
check out
checking out
I'm out
left
exit
```

## Expected Console Output

When working correctly, you should see:

```
[Check-in Logger] Content script initialized. Logging enabled: true
[Check-in Logger] Found 15 messages using selector: [data-testid="msg-container"]
[Check-in Logger] Processing messages in group: Family Crowd
[Check-in Logger] Detected checkin: "check-in"
[Check-in Logger] Stored event: {group: "Family Crowd", name: "John", message: "check-in", type: "checkin", ...}
```

## Still Not Working?

1. **Share console errors** - Copy any red error messages
2. **Check extension version** - Make sure you have the latest code
3. **Try in incognito** - Test if other extensions interfere
4. **Check WhatsApp Web** - Make sure it's fully loaded
5. **Try different group** - Test in a different WhatsApp group

## Quick Test Checklist

- [ ] Extension enabled in chrome://extensions
- [ ] WhatsApp Web fully loaded
- [ ] In a group chat (not individual)
- [ ] Logging toggle is ON in popup
- [ ] Console shows "[Check-in Logger] Content script initialized"
- [ ] Sent test message with "check-in" or "check out"
- [ ] Console shows "Detected checkin/checkout"
- [ ] Events appear in popup after clicking Refresh

Good luck! 🐛🔍

