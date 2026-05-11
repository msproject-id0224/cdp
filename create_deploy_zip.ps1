$ErrorActionPreference = "Stop"
$source = "c:\Users\Administrator\OneDrive\Documents\code_pr\child-development-program"
$destination = "$source\deploy_temp"
$zipFile = "$source\deploy.zip"

Write-Host "Creating deployment zip..."

# Clean up previous runs
if (Test-Path $destination) { Remove-Item $destination -Recurse -Force }
if (Test-Path $zipFile) { Remove-Item $zipFile -Force }

# Create temp directory
New-Item -ItemType Directory -Path $destination | Out-Null

# Define exclusions (root level folders/files to skip)
$exclusions = @(
    "node_modules",
    "vendor",
    ".git",
    ".idea",
    ".vscode",
    "deploy_temp",
    "deploy.zip",
    "*.log",
    ".env",
    "hot"
)

# Copy files to temp directory
Get-ChildItem -Path $source | Where-Object { $exclusions -notcontains $_.Name } | ForEach-Object {
    Write-Host "Copying $($_.Name)..."
    Copy-Item -Path $_.FullName -Destination $destination -Recurse -Force
}

# Clean storage folder content but keep structure
Write-Host "Cleaning storage..."
$storageCleanup = @(
    "$destination\storage\framework\cache\*",
    "$destination\storage\framework\sessions\*",
    "$destination\storage\framework\views\*",
    "$destination\storage\logs\*"
)

foreach ($path in $storageCleanup) {
    if (Test-Path $path) {
        Get-ChildItem $path -Include * -Recurse | Remove-Item -Force -Recurse -ErrorAction SilentlyContinue
    }
}

# Zip content
Write-Host "Compressing to $zipFile..."
Compress-Archive -Path "$destination\*" -DestinationPath $zipFile

# Cleanup temp
Remove-Item $destination -Recurse -Force

Write-Host "✅ Deployment zip created successfully at: $zipFile"
