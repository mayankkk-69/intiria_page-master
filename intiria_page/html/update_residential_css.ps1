$files = @(
    "premium-quote.html",
    "deluxe-quote.html"
)

$newBodyColumn = @"
html {
    height: 100%;
}

body {
    display: flex;
    justify-content: space-around;
    align-items: stretch;
    height: 100%;
    margin: 0;
    font-family: Arial, sans-serif;
}

.column {
    width: 30%;
    padding: 14px;
    height: 100%;
    box-sizing: border-box;
}

/* Right column: fills full height and stacks its content */
.column:last-child {
    display: flex;
    flex-direction: column;
}

.column:first-child {
    align-self: center;
}
"@

$newSliderSection = @"
.slider-container {
    margin-top: 6px;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    font-size: 15px;
}

.slider-container h3 {
    font-size: 16px;
    margin: 14px 0 6px 0;
    font-weight: 700;
}

.slider-container input[type="range"] {
    width: 70%;
    margin: 10px 0;
    height: 6px;
}

.slider-container input[type="number"] {
    width: 30%;
    padding: 7px 10px;
    margin-top: 5px;
    box-sizing: border-box;
    border-radius: 18px;
    font-size: 14px;
}

.total-price, .site-visits {
    font-size: 1.5em;
    margin: 8px 0;
}

.site-visits {
    margin-top: 8px;
}

.checkbox-container {
    margin-top: 10px;
    font-size: 15px;
}

/* Kill the big default h3 margin inside the right column sections */
.checkbox-container h3 {
    font-size: 16px;
    margin: 14px 0 8px 0;
    font-weight: 700;
    color: #222;
}

/* Tighten the gap between each radio group */
.checkbox-container > div {
    margin-bottom: 8px;
}

.checkbox-container label {
    display: block;
    margin-bottom: 6px;
    font-size: 15px;
    font-weight: 500;
    line-height: 1.8;
}

.checkbox-container input[type="radio"] {
    margin-right: 8px;
    color: red;
}

.button-container {
    margin-top: 14px;
    padding-bottom: 10px;
}

.button-container button {
    padding: 8px 20px;
    margin: 4px;
    border: none;
    color: white;
    background-color: red;
    cursor: pointer;
    border-radius: 18px;
    font-size: 14px;
}
"@

foreach ($file in $files) {
    Write-Host "Processing $file..."
    $content = [System.IO.File]::ReadAllText($file, [System.Text.Encoding]::UTF8)

    # 1. Replace body/column block using regex
    $content = $content -replace '(?s)\s*body\s*\{[\s\S]*?font-family:\s*Arial,\s*sans-serif;\s*\}\s*\.column\s*\{[\s\S]*?box-sizing:\s*border-box;\s*\}\s*\.column:first-child\s*\{\s*align-self:\s*center;\s*\}', "`r`n$newBodyColumn"

    # 2. Replace slider-container through button-container button block
    $content = $content -replace '(?s)\.slider-container\s*\{[\s\S]*?margin-top:\s*20px;[\s\S]*?\}[\s\S]*?\.button-container\s+button\s*\{[\s\S]*?font-size:\s*16px;\s*\}', $newSliderSection

    [System.IO.File]::WriteAllText($file, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Done: $file"
}

Write-Host "`nAll residential files updated!"
