$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing
$brandRoot = Split-Path -Parent $PSScriptRoot
$manifest = Get-Content -Raw -LiteralPath (Join-Path $brandRoot 'manifest.json') | ConvertFrom-Json
$failures = [System.Collections.Generic.List[string]]::new()
$svgs = @(Get-ChildItem -LiteralPath $PSScriptRoot -Recurse -Filter '*.svg')
$pngs = @(Get-ChildItem -LiteralPath $PSScriptRoot -Recurse -Filter '*.png')
$registered = @{}
foreach ($entry in $manifest.assets) {
    if ($entry.status -ne 'draft') { $failures.Add("Non-draft entry: $($entry.name)") }
    foreach ($property in $entry.files.PSObject.Properties) {
        $target = Join-Path $brandRoot $property.Value
        if (-not (Test-Path -LiteralPath $target)) { $failures.Add("Missing: $target") }
        $registered[[System.IO.Path]::GetFullPath($target)] = $true
    }
}
foreach ($file in $svgs) {
    $raw = Get-Content -Raw -LiteralPath $file.FullName
    [xml]$doc = $raw
    if ($raw -match '<(text|image|style|filter|mask|foreignObject)\b|\b(transform|class)\s*=|xmlns:') { $failures.Add("Forbidden SVG feature: $($file.Name)") }
    foreach ($group in $doc.SelectNodes('//*[@id]')) {
        if ($group.id -notmatch '^(accent|bg|main|layer-back|layer-mid|layer-front|accents|anim-[a-z-]+)$') { $failures.Add("Unexpected ID: $($group.id)") }
    }
    $limit = 40000
    if ($file.FullName -match 'icons\\ui') {
        $limit = 1500
        if ($doc.svg.viewBox -ne '0 0 24 24') { $failures.Add("UI viewBox: $($file.Name)") }
        if ($raw -match '#[0-9a-fA-F]{3,8}|rgb\(') { $failures.Add("Hard-coded UI colour: $($file.Name)") }
        if ($doc.svg.stroke -ne 'currentColor') { $failures.Add("UI stroke not currentColor: $($file.Name)") }
    }
    if ($file.FullName -match 'icons\\spot') {
        $limit = 5000
        if ($doc.svg.viewBox -ne '0 0 48 48') { $failures.Add("Spot viewBox: $($file.Name)") }
        $colours = @([regex]::Matches($raw, '#[0-9a-fA-F]{6}|currentColor') | ForEach-Object Value | Sort-Object -Unique)
        if ($colours.Count -ne 2 -or -not $raw.Contains('id="accent"')) { $failures.Add("Spot colour contract: $($file.Name)") }
    }
    if ($file.Name -like 'onboarding-*') { $limit = 80000 }
    if ($file.Length -gt $limit) { $failures.Add("File size: $($file.Name)") }
    if (-not $registered.ContainsKey($file.FullName)) { $failures.Add("Unregistered SVG: $($file.FullName)") }
}
foreach ($file in $pngs) {
    $bmp = [System.Drawing.Bitmap]::new($file.FullName)
    try {
        if ($file.Name -eq 'preview-sheet.png') {
            if ($bmp.Width -ne 1800 -or $bmp.Height -ne 1600) { $failures.Add("Preview dimensions: $($file.Name)") }
        } else {
            $size = [int]([regex]::Match($file.BaseName, '(\d+)$').Value)
            if ($bmp.Width -ne $size -or $bmp.Height -ne $size) { $failures.Add("PNG dimensions: $($file.Name)") }
            if ($file.Name -like 'app-icon-*') {
                # Every pixel must be opaque, not merely the corners.
                for ($y=0; $y -lt $bmp.Height; $y++) {
                    for ($x=0; $x -lt $bmp.Width; $x++) {
                        if ($bmp.GetPixel($x,$y).A -ne 255) { $failures.Add("App alpha: $($file.Name)"); break }
                    }
                }
            } elseif ($bmp.GetPixel(0,0).A -ne 0) { $failures.Add("Cutout has opaque corner: $($file.Name)") }
        }
        if (-not $registered.ContainsKey($file.FullName)) { $failures.Add("Unregistered PNG: $($file.FullName)") }
    } finally { $bmp.Dispose() }
}
if ($svgs.Count -ne 87 -or $pngs.Count -ne 54) { $failures.Add("Wrong total: $($svgs.Count) SVG / $($pngs.Count) PNG") }
foreach ($key in @('a','b','c')) {
    $dir = Join-Path $PSScriptRoot "direction-$key"
    foreach ($name in @('home','search','bag','bag-pencil','heart','user','school-list','truck','edit','tag-sale','check-circle','package','bell','refresh')) {
        if (-not (Test-Path -LiteralPath (Join-Path $dir "icons/ui/outline/$name.svg"))) { $failures.Add("Missing outline $key/$name") }
    }
    foreach ($name in @('home','bag','heart','user')) {
        if (-not (Test-Path -LiteralPath (Join-Path $dir "icons/ui/filled/$name.svg"))) { $failures.Add("Missing filled $key/$name") }
    }
}
if ($failures.Count) { $failures | ForEach-Object { Write-Output "FAIL: $_" }; exit 1 }
Write-Output "PASS: $($svgs.Count) SVGs, $($pngs.Count) PNGs, $($manifest.assets.Count) draft manifest entries; XML, SVG contracts, sizes, PNG dimensions and alpha checked."
