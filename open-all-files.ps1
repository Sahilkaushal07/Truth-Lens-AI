# Opens many project files in VSCode (in batches) to mimic "display all codes".
# Adjust maxFiles if needed.

$root = 'C:\Users\sahil\OneDrive\Desktop\TRUTHLENSAI'
$maxFiles = 250
$batchSize = 25

# Try Code.exe path; fallback to `code` if not found in PATH
$codeExe = 'C:\Users\sahil\AppData\Local\Programs\Microsoft VS Code\Code.exe'
if (Test-Path $codeExe) {
  $base = '"' + $codeExe + '" --reuse-window'
} else {
  $base = 'code --reuse-window'
}

$extensions = @(
  '*.js','*.jsx','*.ts','*.tsx','*.css','*.html','*.json','*.md','*.yml','*.yaml',
  '*.py','*.txt','*.sh','*.ps1','*Dockerfile','*.env'
)

$files = foreach ($ext in $extensions) {
  Get-ChildItem -Path $root -Recurse -File -Include (Split-Path -Leaf $ext) -ErrorAction SilentlyContinue
}

# Remove duplicates
$files = $files | Sort-Object FullName -Unique
$files = $files | Select-Object -First $maxFiles

$batch = @()
$i = 0
foreach ($f in $files) {
  $batch += ("`"$($f.FullName)`"")
  $i++
  if (($i % $batchSize) -eq 0) {
    Start-Process -FilePath 'cmd.exe' -ArgumentList "/c $base $($batch -join ' ')" -WindowStyle Hidden
    $batch = @()
  }
}

if ($batch.Count -gt 0) {
  Start-Process -FilePath 'cmd.exe' -ArgumentList "/c $base $($batch -join ' ')" -WindowStyle Hidden
}

Write-Host "Queued VSCode to open up to $($files.Count) files."
