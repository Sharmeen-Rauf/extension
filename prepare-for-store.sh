#!/bin/bash
# Bash script to prepare extension for Chrome Web Store submission
# Run this script to create a ZIP file with only the necessary files

echo "Preparing extension for Chrome Web Store submission..."

# Files to include in the ZIP
FILES_TO_INCLUDE=(
    "manifest.json"
    "popup.html"
    "popup.js"
    "popup.css"
    "content_script.js"
    "background.js"
    "utils.js"
    "icon16.png"
    "icon48.png"
    "icon128.png"
)

# Check if all required files exist
echo ""
echo "Checking required files..."
MISSING_FILES=()

for file in "${FILES_TO_INCLUDE[@]}"; do
    if [ -f "$file" ]; then
        echo "  ✓ $file"
    else
        echo "  ✗ $file (MISSING)"
        MISSING_FILES+=("$file")
    fi
done

if [ ${#MISSING_FILES[@]} -gt 0 ]; then
    echo ""
    echo "ERROR: Missing required files!"
    echo "Please create the following files before proceeding:"
    for file in "${MISSING_FILES[@]}"; do
        echo "  - $file"
    done
    if [[ " ${MISSING_FILES[@]} " =~ " icon16.png " ]] || \
       [[ " ${MISSING_FILES[@]} " =~ " icon48.png " ]] || \
       [[ " ${MISSING_FILES[@]} " =~ " icon128.png " ]]; then
        echo ""
        echo "To create icons, open create-icons.html in your browser and download the icons."
    fi
    exit 1
fi

# Create ZIP file
ZIP_FILE="whatsapp-checkin-logger.zip"

# Remove existing ZIP if it exists
if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
    echo ""
    echo "Removed existing $ZIP_FILE"
fi

echo ""
echo "Creating ZIP file: $ZIP_FILE"

# Create ZIP file
zip -q "$ZIP_FILE" "${FILES_TO_INCLUDE[@]}"

echo ""
echo "✓ Successfully created $ZIP_FILE"
echo ""
echo "Next steps:"
echo "1. Go to https://chrome.google.com/webstore/devconsole"
echo "2. Click 'New Item'"
echo "3. Upload $ZIP_FILE"
echo "4. Fill in the store listing (see STORE_LISTING.md)"
echo "5. Submit for review"
echo ""
echo "For detailed instructions, see CHROME_STORE_GUIDE.md"

