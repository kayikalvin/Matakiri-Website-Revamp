# Find all JavaScript/JSX files
$files = Get-ChildItem -Path "src" -Recurse -Include "*.js", "*.jsx", "*.jsx", "*.ts", "*.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if file contains Heroicons imports
    if ($content -match "@heroicons/react") {
        Write-Host "Found Heroicons in: $($file.Name)" -ForegroundColor Yellow
        
        # Fix the import paths
        $newContent = $content -replace "from '@heroicons/react/outline'", "from '@heroicons/react/24/outline'"
        $newContent = $newContent -replace "from '@heroicons/react/solid'", "from '@heroicons/react/24/solid'"
        
        # Also check for individual icon imports
        $newContent = $newContent -replace "import.*from '@heroicons/react/outline/([^']+)'", "import { `$1 } from '@heroicons/react/24/outline'"
        
        if ($newContent -ne $content) {
            $newContent | Out-File -FilePath $file.FullName -Encoding UTF8
            Write-Host "✅ Updated: $($file.Name)" -ForegroundColor Green
        }
    }
}

Write-Host "`nAll Heroicons imports have been updated to v2 syntax!" -ForegroundColor Green
