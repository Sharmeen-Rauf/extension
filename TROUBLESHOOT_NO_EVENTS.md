# Troubleshooting: No Events Being Detected

## Quick Diagnostic Steps

### Step 1: Check Console Logs

1. Open WhatsApp Web
2. Press **F12** (Developer Tools)
3. Click **"Console"** tab
4. Look for messages starting with `[Check-in Logger]`

**What you should see:**
```
[Check-in Logger] Content script initialized. Logging enabled: true
[Check-in Logger] Starting message processing...
[Check-in Logger] Found X message containers using selector: ...
[Check-in Logger] Processing X messages in group: ...
```

### Step 2: Check if Messages Are Found

In console, you should see:
- `Found X messages...` - This means extension found message containers
- If you see `No messages found at all` - Selectors aren't matching WhatsApp structure

### Step 3: Check Message Text Extraction

Look for:
- `Message text extracted: "..."` - Shows what text was extracted
- If you don't see this, message text extraction is failing

### Step 4: Check Detection

Look for:
- `✅ Detected checkin: "..."` - Message was detected as check-in
- `✅ Detected checkout: "..."` - Message was detected as check-out
- If you don't see this, keywords aren't matching

## Common Issues & Fixes

### Issue 1: "No messages found at all"

**Problem:** Extension can't find message containers in WhatsApp DOM.

**Possible Causes:**
- WhatsApp Web structure changed
- Not in a chat/conversation view
- Messages haven't loaded yet

**Solutions:**
1. Make sure you're in a **chat/conversation** (not just the chat list)
2. Scroll to load messages
3. Wait a few seconds for WhatsApp to fully load
4. Try clicking "Refresh" in extension popup

### Issue 2: "Found X messages" but "No check-in/out events found"

**Problem:** Messages are found but not detected as check-in/out.

**Possible Causes:**
- Message text doesn't contain keywords
- Keywords are case-sensitive
- Message text extraction is failing

**Solutions:**
1. Check console for `Message text extracted: "..."` - see what text was extracted
2. Make sure your message contains keywords:
   - Check-in: "check-in", "checked in", "checkin", "in", "present", "here"
   - Check-out: "check out", "checked out", "checkout", "out", "left", "exit"
3. Try sending: "check-in" or "check out" (exact keywords)
4. Check if keywords are case-sensitive (they shouldn't be)

### Issue 3: Messages Found But Text Extraction Fails

**Problem:** Extension finds messages but can't extract text.

**Possible Causes:**
- WhatsApp DOM structure changed
- Messages are in a different format
- Selectors don't match current structure

**Solutions:**
1. Check console for extraction errors
2. Try different message types (text only, no media)
3. Make sure message is fully loaded (not loading placeholder)

### Issue 4: Events Detected But Not Showing in Popup

**Problem:** Console shows events detected but popup shows 0 events.

**Possible Causes:**
- Storage not saving
- Popup not refreshing
- Events stored but not retrieved

**Solutions:**
1. Click "Refresh" button in popup
2. Check console for storage errors
3. Close and reopen popup
4. Check chrome.storage.local directly (DevTools → Application → Storage)

## Manual Testing

### Test 1: Force Check Messages

1. Open WhatsApp Web
2. Open console (F12)
3. Type: `chrome.runtime.sendMessage({action: 'forceCheck'})`
4. Press Enter
5. Check console for processing messages

### Test 2: Check Storage Directly

1. Open DevTools (F12)
2. Go to **Application** tab
3. Click **Storage** → **Local Storage**
4. Look for extension storage
5. Check if `events` key exists and has data

### Test 3: Test Keywords

1. Send these exact messages in a group:
   - "check-in"
   - "check out"
   - "I'm checking in"
   - "checking out now"
2. Check console for detection messages
3. Check popup for events

## Debug Mode

The extension now has enhanced logging. Check console for:

- `[Check-in Logger] Starting message processing...`
- `[Check-in Logger] Found X message containers...`
- `[Check-in Logger] Processing X messages...`
- `[Check-in Logger] Message text extracted: "..."` (first 5 only)
- `[Check-in Logger] ✅ Detected checkin/checkout: "..."`
- `[Check-in Logger] ✅ Successfully logged X events!`

## Still Not Working?

1. **Share console output** - Copy all `[Check-in Logger]` messages
2. **Check WhatsApp version** - Make sure WhatsApp Web is up to date
3. **Try different group** - Test in a different WhatsApp group
4. **Reload extension** - Remove and reload in chrome://extensions
5. **Clear processed IDs** - Refresh WhatsApp Web page to reset

## Quick Fixes to Try

1. **Reload Extension:**
   - Go to chrome://extensions
   - Click reload icon on extension
   - Refresh WhatsApp Web page

2. **Clear and Retry:**
   - Click "Clear Events" in popup
   - Send new test message: "check-in"
   - Click "Refresh"

3. **Check Logging Status:**
   - Make sure "Enable Logging" toggle is ON (green)
   - Status should show "Logging Active"

4. **Force Process:**
   - Click "Refresh" button (now forces content script to check)
   - Wait 1-2 seconds
   - Check popup again

Good luck! 🐛🔍

