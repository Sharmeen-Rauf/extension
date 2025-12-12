# PowerShell script to prepare extension for Chrome Web Store submission
# Run this script to create a ZIP file with only the necessary files

Write-Host "Preparing extension for Chrome Web Store submission..." -ForegroundColor Green

# Files to include in the ZIP
$filesToInclude = @(
    "manifest.json",
    "popup.html",
    "popup.js",
    "popup.css",
    "content_script.js",
    "background.js",
    "utils.js",
    "icon16.png",
    "icon48.png",
    "icon128.png"
)

# Files to exclude
$filesToExclude = @(
    "README.md",
    "CHROME_STORE_GUIDE.md",
    "STORE_LISTING.md",
    "QUICKSTART.md",
    "ICONS.md",
    "create-icons.html",
    "prepare-for-store.ps1",
    ".git",
    ".gitignore"
)

# Check if all required files exist
Write-Host "`nChecking required files..." -ForegroundColor Yellow
$missingFiles = @()

foreach ($file in $filesToInclude) {
    if (Test-Path $file) {
        Write-Host "  ✓ $file" -ForegroundColor Green
    } else {
        Write-Host "  ✗ $file (MISSING)" -ForegroundColor Red
        $missingFiles += $file
    }
}

if ($missingFiles.Count -gt 0) {
    Write-Host "`nERROR: Missing required files!" -ForegroundColor Red
    Write-Host "Please create the following files before proceeding:" -ForegroundColor Yellow
    foreach ($file in $missingFiles) {
        Write-Host "  - $file" -ForegroundColor Yellow
    }
    if ($missingFiles -contains "icon16.png" -or $missingFiles -contains "icon48.png" -or $missingFiles -contains "icon128.png") {
        Write-Host "`nTo create icons, open create-icons.html in your browser and download the icons." -ForegroundColor Cyan
    }
    exit 1
}

# Create ZIP file
$zipFileName = "whatsapp-checkin-logger.zip"

# Remove existing ZIP if it exists
if (Test-Path $zipFileName) {
    Remove-Item $zipFileName -Force
    Write-Host "`nRemoved existing $zipFileName" -ForegroundColor Yellow
}

Write-Host "`nCreating ZIP file: $zipFileName" -ForegroundColor Yellow

# Create temporary directory
$tempDir = "temp-store-package"
if (Test-Path $tempDir) {
    Remove-Item $tempDir -Recurse -Force
}
New-Item -ItemType Directory -Path $tempDir | Out-Null

# Copy files to temporary directory
foreach ($file in $filesToInclude) {
    Copy-Item $file -Destination $tempDir -Force
    Write-Host "  ✓ Added $file" -ForegroundColor Green
}

# Create ZIP from temporary directory
Compress-Archive -Path "$tempDir\*" -DestinationPath $zipFileName -Force

# Clean up temporary directory
Remove-Item $tempDir -Recurse -Force

Write-Host "`n✓ Successfully created $zipFileName" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://chrome.google.com/webstore/devconsole" -ForegroundColor White
Write-Host "2. Click 'New Item'" -ForegroundColor White
Write-Host "3. Upload $zipFileName" -ForegroundColor White
Write-Host "4. Fill in the store listing (see STORE_LISTING.md)" -ForegroundColor White
Write-Host "5. Submit for review" -ForegroundColor White
Write-Host "`nFor detailed instructions, see CHROME_STORE_GUIDE.md" -ForegroundColor Yellow

