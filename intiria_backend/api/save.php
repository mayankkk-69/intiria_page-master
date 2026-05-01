<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); 
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database Connection
$host = 'localhost';
$dbname = 'intiria_master';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Ensure database exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$dbname`");
    $pdo->exec("USE `$dbname`");

    // Ensure table exists
    $tableQuery = "
    CREATE TABLE IF NOT EXISTS cms_sections (
        section_name VARCHAR(50) PRIMARY KEY,
        data LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )";
    $pdo->exec($tableQuery);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database Connection Failed: ' . $e->getMessage()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if ($input && isset($input['section']) && isset($input['data'])) {
        $section = $input['section'];
        $jsonData = json_encode($input['data']);
        
        try {
            // Insert or Update the section data
            $stmt = $pdo->prepare("
                INSERT INTO cms_sections (section_name, data) 
                VALUES (:section, :data) 
                ON DUPLICATE KEY UPDATE data = :data
            ");
            $stmt->execute([':section' => $section, ':data' => $jsonData]);
            
            echo json_encode(['success' => true, 'message' => "$section saved successfully to database."]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Database Error: ' . $e->getMessage()]);
        }
    } else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON payload.']);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $stmt = $pdo->query("SELECT section_name, data FROM cms_sections");
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $currentData = [];
        foreach ($results as $row) {
            $currentData[$row['section_name']] = json_decode($row['data'], true);
        }
        
        echo json_encode($currentData);
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to fetch data']);
    }
}
?>
