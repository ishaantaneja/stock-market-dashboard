# dump.ps1
# Dump only frontend/src + backend/src into one file each inside dump folder
# Compressed + filtered

$targets = @(
    @{ Dir = "frontend/src"; OutFile = "dump/frontend_src.txt" },
    @{ Dir = "backend/src";  OutFile = "dump/backend_src.txt"  }
)

$excludeFolders = @("node_modules", ".git", "dist", "assets", "generated", "environments")

# Ensure dump folder exists
if (-Not (Test-Path "dump")) { New-Item -ItemType Directory -Path "dump" }

function Compress-Content {
    param([string]$filePath)
    $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
    $lines = Get-Content $filePath -ErrorAction SilentlyContinue
    $lines = $lines | Where-Object { $_.Trim() -ne "" }

    switch ($ext) {
        ".ts" { $lines = $lines | Where-Object { $_ -notmatch "^\s*//" } }
        ".js" { $lines = $lines | Where-Object { $_ -notmatch "^\s*//" } }
        ".cjs" { $lines = $lines | Where-Object { $_ -notmatch "^\s*//" } }
        ".json" { }
        ".html" { $lines = $lines | Where-Object { $_ -notmatch "^\s*<!--" } }
        ".scss" { $lines = $lines | Where-Object { $_ -notmatch "^\s*//" } }
        ".css"  { $lines = $lines | Where-Object { $_ -notmatch "^\s*/\*" } }
        ".py"   { $lines = $lines | Where-Object { $_ -notmatch "^\s*#" } }
        default { }
    }
    return $lines
}

foreach ($t in $targets) {
    $dir = $t.Dir
    $outFile = $t.OutFile
    "" | Out-File $outFile -Encoding utf8  # reset file

    if (Test-Path $dir) {
        # Folder tree
        Add-Content $outFile "===== PROJECT STRUCTURE =====`n"
        Add-Content $outFile "--- $dir ---"
        tree /F $dir | Out-String | Add-Content $outFile

        # File contents
        Add-Content $outFile "`n===== FILE CONTENTS =====`n"
        $files = Get-ChildItem $dir -Recurse -File | Where-Object {
            $skip = $false
            foreach ($ex in $excludeFolders) {
                if ($_.FullName -match [regex]::Escape($ex)) { $skip = $true }
            }
            -not $skip
        }

        foreach ($file in $files) {
            Add-Content $outFile "===== FILE: $($file.FullName) ====="
            Compress-Content $file.FullName | Out-String | Add-Content $outFile
            Add-Content $outFile "`n"
        }

        Write-Host "✅ $outFile created with compressed src for $dir"
    } else {
        Write-Host "⚠️ $dir not found"
    }
}

Write-Host "🎯 All src folders dumped into dump folder as single files"
