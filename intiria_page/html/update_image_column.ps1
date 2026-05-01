$files = @(
    "basic-quote.html",
    "premium-quote.html",
    "deluxe-quote.html",
    "commercial-startup-quote.html",
    "commercial-corporate-quote.html",
    "commercial-enterprise-quote.html",
    "industrial-standard-quote.html",
    "industrial-premium-quote.html",
    "industrial-advanced-quote.html"
)

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

    # 1. Add overflow: hidden; to .column:first-child
    if ($content -notmatch '\.column:first-child\s*\{[^}]*overflow:\s*hidden') {
        $content = $content -replace '(?s)(\.column:first-child\s*\{)', "`$1`r`n    overflow: hidden;"
    }

    # 2. Update .image-container width and height
    # width: 100%; -> width: 85%; margin: 0 auto;
    $content = $content -replace '(?s)(\.image-container\s*\{[^}]*)width:\s*100%;', '$1width: 85%; margin: 0 auto;'
    # height: 75vh; -> height: 60vh;
    $content = $content -replace '(?s)(\.image-container\s*\{[^}]*)height:\s*75vh;', '$1height: 60vh;'

    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
}

Write-Host "All 9 files updated successfully!"
