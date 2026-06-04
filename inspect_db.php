<?php
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
$stmt = $pdo->prepare("SELECT * FROM cms_sections WHERE section_name = 'pricing'");
$stmt->execute();
$row = $stmt->fetch();
if ($row) {
echo "Found pricing row:\n";
echo "ID: " . $row['id'] . "\n";
echo "Section Name: " . $row['section_name'] . "\n";
echo "Current Data:\n";
$data = json_decode($row['current_data'], true);
print_r($data);
} else {
echo "Pricing row not found in cms_sections.\n";
}
} catch (\PDOException $e) {
echo "DB Connection failed: " . $e->getMessage() . "\n";
}
