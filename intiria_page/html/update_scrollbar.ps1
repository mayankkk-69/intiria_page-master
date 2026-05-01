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
    
    # Replace overflow: hidden; with overflow-y: auto; inside the .column rule
    $content = $content -replace '(?s)(\.column\s*\{[^}]*)overflow:\s*hidden;', '$1overflow-y: auto;'
    
    # In case there's no overflow rule at all, we can add it if we want, 
    # but based on the view it seems overflow: hidden; is there.
    
    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $file"
}

Write-Host "All files updated!"
