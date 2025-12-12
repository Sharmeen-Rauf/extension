# Chrome Web Store Publishing Checklist

Use this checklist to ensure everything is ready before submitting to the Chrome Web Store.

## Pre-Submission Checklist

### ✅ Extension Files

- [ ] All JavaScript files present and working
  - [ ] `manifest.json`
  - [ ] `content_script.js`
  - [ ] `background.js`
  - [ ] `popup.js`
  - [ ] `popup.html`
  - [ ] `popup.css`
  - [ ] `utils.js`

- [ ] Icons created and present
  - [ ] `icon16.png` (16x16 pixels)
  - [ ] `icon48.png` (48x48 pixels)
  - [ ] `icon128.png` (128x128 pixels)

- [ ] Extension tested and working
  - [ ] Loads without errors
  - [ ] Detects messages correctly
  - [ ] CSV export works
  - [ ] Popup displays correctly
  - [ ] All features functional

### ✅ Store Assets

- [ ] Screenshots prepared (at least 1, recommended 3-5)
  - [ ] Screenshot 1: Main interface/popup
  - [ ] Screenshot 2: Events display
  - [ ] Screenshot 3: CSV export example
  - [ ] All screenshots are 1280x800 or 640x400 pixels

- [ ] Store listing content prepared
  - [ ] Name: "WhatsApp Web Check-in Logger"
  - [ ] Short description (132 chars max)
  - [ ] Detailed description (see STORE_LISTING.md)
  - [ ] Category selected: Productivity

### ✅ Developer Account

- [ ] Chrome Web Store Developer account created
- [ ] $5 registration fee paid
- [ ] Developer Terms of Service accepted

### ✅ Privacy & Permissions

- [ ] Privacy practices documented
  - [ ] Data collection: No
  - [ ] Data usage: Local storage only
  - [ ] Permissions justified

- [ ] Permissions reviewed
  - [ ] activeTab: Justified
  - [ ] storage: Justified
  - [ ] downloads: Justified
  - [ ] scripting: Justified
  - [ ] identity: Justified (optional)

### ✅ Package Preparation

- [ ] ZIP file created
  - [ ] Only necessary files included
  - [ ] No documentation files in ZIP
  - [ ] No test files in ZIP
  - [ ] ZIP file tested (can be loaded as unpacked extension)

- [ ] Manifest.json verified
  - [ ] Version number set (1.0.0)
  - [ ] Description is clear
  - [ ] All permissions listed
  - [ ] Icons referenced correctly

## Submission Checklist

### ✅ Store Listing Form

- [ ] Extension name entered
- [ ] Short description entered (132 chars max)
- [ ] Detailed description pasted
- [ ] Category selected: Productivity
- [ ] Language: English (or others if translated)

### ✅ Assets Uploaded

- [ ] ZIP file uploaded
- [ ] Screenshots uploaded (at least 1)
- [ ] Promotional images uploaded (optional)
- [ ] Store icon uploaded (or using icon128.png)

### ✅ Privacy Section

- [ ] Privacy practices answered
- [ ] Data collection: No
- [ ] Permissions justified
- [ ] Privacy policy URL (if applicable)

### ✅ Distribution

- [ ] Visibility selected
  - [ ] Unlisted (for testing)
  - [ ] Public (for release)

- [ ] Regions selected (default: all regions)

### ✅ Final Review

- [ ] All information reviewed
- [ ] No typos or errors
- [ ] Screenshots look good
- [ ] Description is clear and accurate
- [ ] Ready to submit

## Post-Submission

- [ ] Submission confirmation received
- [ ] Review status checked (1-3 business days)
- [ ] Any reviewer feedback addressed
- [ ] Extension approved and published
- [ ] Store URL saved
- [ ] Extension tested after publication

## Common Issues to Avoid

- ❌ Missing icons (will be rejected)
- ❌ Vague description (be specific)
- ❌ Unjustified permissions (explain each one)
- ❌ Privacy concerns (clarify data handling)
- ❌ ZIP includes unnecessary files (keep it minimal)
- ❌ Extension doesn't work (test thoroughly first)

## Quick Reference

**Developer Dashboard**: https://chrome.google.com/webstore/devconsole

**Store Listing Template**: See `STORE_LISTING.md`

**Publishing Guide**: See `CHROME_STORE_GUIDE.md`

**Package Script**: Run `prepare-for-store.ps1` (Windows) or `prepare-for-store.sh` (Mac/Linux)

---

**Good luck with your submission!** 🚀

