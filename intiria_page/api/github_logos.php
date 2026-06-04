<?php
/**
 * github_logos.php
 * Server-side proxy + cache for GitHub /logo folder listing.
 * Uses cURL (works even when allow_url_fopen = Off in php.ini).
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$GITHUB_API = 'https://api.github.com/repos/infoarchitectshive-pixel/intiria/contents/logo';
$CACHE_FILE = __DIR__ . '/github_logos_cache.json';
$CACHE_TTL  = 3600; // 1 hour

// ── Serve from cache if still fresh ───────────────────────────
if (file_exists($CACHE_FILE) && (time() - filemtime($CACHE_FILE)) < $CACHE_TTL) {
    echo file_get_contents($CACHE_FILE);
    exit;
}

// ── Fetch from GitHub API via cURL ────────────────────────────
function fetchUrl($url) {
    if (!function_exists('curl_init')) {
        return false; // cURL not available
    }
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => false,  // avoids SSL issues on local XAMPP
        CURLOPT_HTTPHEADER     => [
            'User-Agent: intiria-page-proxy/1.0',
            'Accept: application/vnd.github.v3+json'
        ]
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error    = curl_error($ch);
    curl_close($ch);

    if ($error || $httpCode < 200 || $httpCode >= 300) {
        return false;
    }
    return $response;
}

$response = fetchUrl($GITHUB_API);

// ── If fetch failed, serve stale cache or 503 ─────────────────
if ($response === false) {
    if (file_exists($CACHE_FILE)) {
        // Return stale cache rather than failing completely
        echo file_get_contents($CACHE_FILE);
    } else {
        http_response_code(503);
        echo json_encode([
            'success' => false,
            'error'   => 'GitHub API unreachable and no local cache available. Check internet connection or cURL settings.'
        ]);
    }
    exit;
}

// ── Parse & filter ────────────────────────────────────────────
$files = json_decode($response, true);
if (!is_array($files)) {
    http_response_code(502);
    echo json_encode(['success' => false, 'error' => 'Invalid response from GitHub API.']);
    exit;
}

$skipFiles = [
    'logo (1).png', 'logo-gradient-trans.png', 'logo-new.png', 'logo.png',
    'new_page_logo.svg', 'fianl-logo.png', 'navbigimg.webp'
];
$imgExts = ['png', 'jpg', 'jpeg', 'webp', 'svg', 'avif'];

$logos = [];
foreach ($files as $file) {
    if ($file['type'] !== 'file') continue;
    $name = $file['name'];
    $ext  = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($ext, $imgExts)) continue;
    if (in_array(strtolower($name), array_map('strtolower', $skipFiles))) continue;
    $logos[] = [
        'name' => $name,
        'url'  => 'https://raw.githubusercontent.com/infoarchitectshive-pixel/intiria/main/logo/' . rawurlencode($name)
    ];
}

$result = json_encode(['success' => true, 'logos' => $logos]);

// ── Save to cache ─────────────────────────────────────────────
file_put_contents($CACHE_FILE, $result);

echo $result;
?>
