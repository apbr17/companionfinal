<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once 'db.php';
$conn = getDbConnection();

// Accept both JSON body and FormData
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $raw = json_decode(file_get_contents('php://input'), true);
    $firstName   = trim($raw['firstName'] ?? '');
    $lastName    = trim($raw['lastName'] ?? '');
    $email       = trim($raw['email'] ?? '');
    $aadhaar     = trim($raw['aadhaar'] ?? '');
    $passwordRaw = $raw['password'] ?? '';
} else {
    $firstName   = trim($_POST['firstName'] ?? '');
    $lastName    = trim($_POST['lastName'] ?? '');
    $email       = trim($_POST['email'] ?? '');
    $aadhaar     = trim($_POST['aadhaar'] ?? '');
    $passwordRaw = $_POST['password'] ?? '';
}

if (!$firstName || !$lastName || !$email || !$aadhaar || !$passwordRaw) {
    echo json_encode(["success" => false, "message" => "All fields are required"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["success" => false, "message" => "Invalid email address"]);
    exit;
}

if (!preg_match('/^[2-9][0-9]{11}$/', $aadhaar)) {
    echo json_encode(["success" => false, "message" => "Invalid Aadhaar number"]);
    exit;
}

if (strlen($passwordRaw) < 8) {
    echo json_encode(["success" => false, "message" => "Password must be at least 8 characters"]);
    exit;
}

$password = password_hash($passwordRaw, PASSWORD_DEFAULT);

$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();
if ($check->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Email already registered"]);
    $check->close();
    $conn->close();
    exit;
}
$check->close();

$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, aadhaar, password) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $firstName, $lastName, $email, $aadhaar, $password);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Account created successfully"]);
} else {
    echo json_encode(["success" => false, "message" => "Registration failed. Please try again."]);
}

$stmt->close();
$conn->close();
?>
