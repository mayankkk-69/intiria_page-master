<?php
/**
* DB API
* Fetches data from cms_sections and returns it as a flat JSON structure.
*/
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$host = 'localhost';
$db   = 'intiria_master';
$user = 'root'; 
$pass = '';     

$dsn = "mysql:host=$host;dbname=$db;charset=utf8mb4";
$options = [
PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
$pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
echo json_encode(['success' => false, 'message' => 'DB Connection failed']);
exit;
}

$tables = ['header', 'hero', 'kpi', 'pricing', 'cta', 'footer', 'studio', 'industrial', 'quotes', 'brands'];
$currentData = [];

try {
foreach ($tables as $table) {
// Check if table exists to prevent errors if user hasn't created it yet
try {
$stmt = $pdo->query("SELECT * FROM $table LIMIT 1");
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if ($row) {
foreach ($row as $key => $value) {
if (is_string($value)) {
$decoded = json_decode($value, true);
if (json_last_error() === JSON_ERROR_NONE && (is_array($decoded) || is_object($decoded))) {
$row[$key] = $decoded;
}
}
}
$currentData[$table] = $row;
}
} catch (\PDOException $e) {
// Table might not exist, skip silently for now
continue;
}
}

echo json_encode(['success' => true, 'data' => $currentData]);
} catch (Exception $e) {
echo json_encode(['success' => false, 'message' => 'Failed to fetch sections: ' . $e->getMessage()]);
}
?>
