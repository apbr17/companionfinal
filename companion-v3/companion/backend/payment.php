<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once 'db.php';

// ── Razorpay credentials (Test keys — replace with live keys for production) ──
define('RAZORPAY_KEY_ID',     'rzp_test_REPLACE_WITH_YOUR_KEY');
define('RAZORPAY_KEY_SECRET', 'REPLACE_WITH_YOUR_SECRET');

$conn = getDbConnection();
$raw  = json_decode(file_get_contents('php://input'), true);
$action = $raw['action'] ?? '';

// ─────────────────────────────────────────────────────────────
// ACTION: create_order
// Creates a Razorpay order and saves it to payments table
// ─────────────────────────────────────────────────────────────
if ($action === 'create_order') {
    $userId      = intval($raw['user_id'] ?? 0);
    $amountPaise = intval($raw['amount_paise'] ?? 0); // INR × 100
    $currency    = 'INR';

    if (!$userId || $amountPaise < 100) {
        echo json_encode(["success" => false, "message" => "Invalid amount"]);
        exit;
    }

    // Call Razorpay API to create order
    $orderData = [
        "amount"   => $amountPaise,
        "currency" => $currency,
        "receipt"  => "CPN" . uniqid(),
        "payment_capture" => 1,
    ];

    $ch = curl_init("https://api.razorpay.com/v1/orders");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($orderData),
        CURLOPT_HTTPHEADER     => ["Content-Type: application/json"],
        CURLOPT_USERPWD        => RAZORPAY_KEY_ID . ":" . RAZORPAY_KEY_SECRET,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        $err = json_decode($response, true);
        echo json_encode(["success" => false, "message" => "Razorpay error: " . ($err['error']['description'] ?? 'unknown')]);
        exit;
    }

    $order = json_decode($response, true);

    // Save to DB
    $stmt = $conn->prepare("INSERT INTO payments (user_id, razorpay_order_id, amount_paise, currency, status) VALUES (?,?,?,?,?)");
    $status = 'created';
    $stmt->bind_param("isiss", $userId, $order['id'], $amountPaise, $currency, $status);
    $stmt->execute();
    $stmt->close();

    echo json_encode([
        "success"  => true,
        "order_id" => $order['id'],
        "amount"   => $amountPaise,
        "currency" => $currency,
        "key_id"   => RAZORPAY_KEY_ID,
    ]);
    $conn->close();
    exit;
}

// ─────────────────────────────────────────────────────────────
// ACTION: verify_payment
// Verifies Razorpay signature and confirms booking
// ─────────────────────────────────────────────────────────────
if ($action === 'verify_payment') {
    $orderId   = $raw['razorpay_order_id']   ?? '';
    $paymentId = $raw['razorpay_payment_id'] ?? '';
    $signature = $raw['razorpay_signature']  ?? '';
    $userId    = intval($raw['user_id']      ?? 0);
    $eventExtId = $raw['event_id']           ?? '';
    $seats     = $raw['seats']               ?? '';
    $ticketCount = intval($raw['ticket_count'] ?? 1);
    $totalPrice  = floatval($raw['total_price'] ?? 0);

    // Verify HMAC signature
    $expectedSig = hash_hmac('sha256', $orderId . '|' . $paymentId, RAZORPAY_KEY_SECRET);
    if (!hash_equals($expectedSig, $signature)) {
        echo json_encode(["success" => false, "message" => "Payment verification failed"]);
        exit;
    }

    // Update payment status
    $stmt = $conn->prepare("UPDATE payments SET razorpay_payment_id=?, razorpay_signature=?, status='paid' WHERE razorpay_order_id=?");
    $stmt->bind_param("sss", $paymentId, $signature, $orderId);
    $stmt->execute();
    $stmt->close();

    // Get event DB id from ext_id
    $evStmt = $conn->prepare("SELECT id FROM events WHERE ext_id = ?");
    $evStmt->bind_param("s", $eventExtId);
    $evStmt->execute();
    $evRes = $evStmt->get_result()->fetch_assoc();
    $evStmt->close();
    $eventDbId = $evRes ? $evRes['id'] : 0;

    // Create booking
    $bookingRef = 'CPN' . strtoupper(substr(uniqid(), -8));
    $bStmt = $conn->prepare("INSERT INTO bookings (user_id, event_id, seats, ticket_count, total_price, booking_ref, status) VALUES (?,?,?,?,?,?,'confirmed')");
    $bStmt->bind_param("iisids", $userId, $eventDbId, $seats, $ticketCount, $totalPrice, $bookingRef);
    $bStmt->execute();
    $bStmt->close();

    echo json_encode(["success" => true, "booking_ref" => $bookingRef, "payment_id" => $paymentId]);
    $conn->close();
    exit;
}

echo json_encode(["success" => false, "message" => "Unknown action"]);
