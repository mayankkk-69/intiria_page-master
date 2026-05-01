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
    Write-Host "Processing $file..."
    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

    # Replace the image-container block: remove min-height & aspect-ratio, add height: 75vh
    $content = $content -replace '(?s)(\.image-container\s*\{[^}]*)min-height:\s*[^;]+;', '$1'
    $content = $content -replace '(?s)(\.image-container\s*\{[^}]*)aspect-ratio:\s*[^;]+;', '$1height: 75vh;'

    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $file"
}

Write-Host "`nAll image containers updated!"
