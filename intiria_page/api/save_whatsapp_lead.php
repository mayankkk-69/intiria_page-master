<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

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
    
    // Automatically create the whatsapp leads table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS whatsapp_leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        whatsapp_number VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Connection failed']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST['fullname'] ?? '';
    $whatsapp_number = $_POST['whatsapp_number'] ?? '';
    
    if(empty($fullname) || empty($whatsapp_number)) {
        echo json_encode(['success' => false, 'message' => 'Name and WhatsApp number are required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO whatsapp_leads (fullname, whatsapp_number) VALUES (?, ?)");
        $stmt->execute([$fullname, $whatsapp_number]);
        
        echo json_encode(['success' => true, 'message' => 'WhatsApp lead saved successfully!']);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to save lead: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
