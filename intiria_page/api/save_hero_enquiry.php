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
    
    // Automatically create the hero enquiries table if it doesn't exist
    $pdo->exec("CREATE TABLE IF NOT EXISTS enquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullname VARCHAR(255) NOT NULL,
        mobile VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");
} catch (\PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'DB Connection failed']);
    exit;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $fullname = $_POST['fullname'] ?? '';
    $mobile = $_POST['mobile'] ?? '';
    $email = $_POST['email'] ?? '';
    
    if(empty($fullname) || empty($mobile) || empty($email)) {
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO enquiries (fullname, mobile, email) VALUES (?, ?, ?)");
        $stmt->execute([$fullname, $mobile, $email]);
        
        echo json_encode(['success' => true, 'message' => 'Enquiry saved successfully!']);
    } catch (\PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Failed to save enquiry: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
