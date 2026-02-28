<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once 'db.php';
$conn = getDbConnection();
$method = $_SERVER['REQUEST_METHOD'];

// ── GET: fetch reviews ──────────────────────────────────────
if ($method === 'GET') {
    $type = $_GET['type'] ?? 'website';       // 'event' or 'website'
    $eventId = $_GET['event_id'] ?? null;

    if ($type === 'event' && $eventId) {
        $stmt = $conn->prepare("
            SELECT r.id, r.rating, r.title, r.body, r.created_at,
                   u.first_name, u.last_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.target_type = 'event' AND r.target_id = ?
            ORDER BY r.created_at DESC
            LIMIT 50
        ");
        $stmt->bind_param("s", $eventId);
    } else {
        $stmt = $conn->prepare("
            SELECT r.id, r.rating, r.title, r.body, r.created_at,
                   u.first_name, u.last_name
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.target_type = 'website'
            ORDER BY r.created_at DESC
            LIMIT 50
        ");
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $reviews = [];
    while ($row = $result->fetch_assoc()) $reviews[] = $row;

    // Average rating
    $avgStmt = $conn->prepare("
        SELECT AVG(rating) as avg_rating, COUNT(*) as total
        FROM reviews WHERE target_type = ? AND (? IS NULL OR target_id = ?)
    ");
    $avgStmt->bind_param("sss", $type, $eventId, $eventId);
    $avgStmt->execute();
    $avgRow = $avgStmt->get_result()->fetch_assoc();

    echo json_encode([
        "success" => true,
        "reviews" => $reviews,
        "avg_rating" => round((float)$avgRow['avg_rating'], 1),
        "total" => (int)$avgRow['total']
    ]);
    $conn->close();
    exit;
}

// ── POST: submit a review ───────────────────────────────────
if ($method === 'POST') {
    $raw = json_decode(file_get_contents('php://input'), true);
    $userId     = intval($raw['user_id'] ?? 0);
    $targetType = $raw['target_type'] ?? 'website';
    $targetId   = $raw['target_id'] ?? null;
    $rating     = intval($raw['rating'] ?? 0);
    $title      = trim($raw['title'] ?? '');
    $body       = trim($raw['body'] ?? '');

    if (!$userId || !$rating || $rating < 1 || $rating > 5) {
        echo json_encode(["success" => false, "message" => "Invalid data"]);
        exit;
    }

    // One review per user per target
    $check = $conn->prepare("SELECT id FROM reviews WHERE user_id=? AND target_type=? AND (target_id=? OR (target_id IS NULL AND ?='website'))");
    $check->bind_param("isss", $userId, $targetType, $targetId, $targetType);
    $check->execute();
    $check->store_result();
    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "You have already reviewed this"]);
        $check->close(); $conn->close(); exit;
    }
    $check->close();

    $stmt = $conn->prepare("INSERT INTO reviews (user_id, target_type, target_id, rating, title, body) VALUES (?,?,?,?,?,?)");
    $stmt->bind_param("ississ", $userId, $targetType, $targetId, $rating, $title, $body);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Review submitted!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Could not save review"]);
    }
    $stmt->close();
    $conn->close();
    exit;
}

echo json_encode(["success" => false, "message" => "Method not allowed"]);
