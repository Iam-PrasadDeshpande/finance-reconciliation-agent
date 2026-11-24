param([int]$Port = 8876)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if (Get-Command py -ErrorAction SilentlyContinue) {
    & py -3 (Join-Path $PSScriptRoot 'local_demo.py') --mode web --port $Port
} else {
    & python (Join-Path $PSScriptRoot 'local_demo.py') --mode web --port $Port
}
if ($LASTEXITCODE -ne 0) { throw "Local finance demo exited with code $LASTEXITCODE" }
