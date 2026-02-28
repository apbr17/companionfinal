<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

require_once 'db.php';

define('RAZORPAY_KEY_ID',     'rzp_test_REPLACE_WITH_YOUR_KEY');
define('RAZORPAY_KEY_SECRET', 'REPLACE_WITH_YOUR_SECRET');

$conn = getDbConnection();
$raw  = json_decode(file_get_contents('php://input'), true);
$action = $raw['action'] ?? '';

// ── create_order ─────────────────────────────────────────────
if ($action === 'create_order') {
    $userId      = intval($raw['user_id'] ?? 0);
    $amountPaise = intval($raw['amount_paise'] ?? 0);

    if ($amountPaise < 100) {
        echo json_encode(["success" => false, "message" => "Invalid amount"]);
        exit;
    }

    $orderPayload = json_encode([
        "amount"          => $amountPaise,
        "currency"        => "INR",
        "receipt"         => "CPN" . uniqid(),
        "payment_capture" => 1,
    ]);

    $ch = curl_init("https://api.razorpay.com/v1/orders");
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $orderPayload,
        CURLOPT_HTTPHEADER     => ["Content-Type: application/json"],
        CURLOPT_USERPWD        => RAZORPAY_KEY_ID . ":" . RAZORPAY_KEY_SECRET,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        $err = json_decode($response, true);
        echo json_encode(["success" => false,
            "message" => "Razorpay error: " . ($err['error']['description'] ?? 'unknown')]);
        exit;
    }

    $order = json_decode($response, true);

    // Save to payments table (users DB)
    if ($userId > 0) {
        $stmt = $conn->prepare(
            "INSERT INTO payments (user_id, razorpay_order_id, amount_paise, status)
             VALUES (?, ?, ?, 'created')"
        );
        $stmt->bind_param("isi", $userId, $order['id'], $amountPaise);
        $stmt->execute();
        $stmt->close();
    }

    echo json_encode([
        "success"  => true,
        "order_id" => $order['id'],
        "amount"   => $amountPaise,
        "currency" => "INR",
        "key_id"   => RAZORPAY_KEY_ID,
    ]);
    $conn->close();
    exit;
}

// ── verify_payment ───────────────────────────────────────────
if ($action === 'verify_payment') {
    $orderId     = $raw['razorpay_order_id']   ?? '';
    $paymentId   = $raw['razorpay_payment_id'] ?? '';
    $signature   = $raw['razorpay_signature']  ?? '';
    $userId      = intval($raw['user_id']      ?? 0);
    $eventExtId  = $raw['event_id']            ?? '';
    $eventTitle  = $raw['event_title']         ?? '';
    $seats       = $raw['seats']               ?? '';
    $ticketCount = intval($raw['ticket_count'] ?? 1);
    $totalPrice  = floatval($raw['total_price'] ?? 0);

    // Verify HMAC signature
    $expected = hash_hmac('sha256', $orderId . '|' . $paymentId, RAZORPAY_KEY_SECRET);
    if (!hash_equals($expected, $signature)) {
        echo json_encode(["success" => false, "message" => "Payment verification failed"]);
        exit;
    }

    $bookingRef = 'CPN' . strtoupper(substr(uniqid(), -8));

    // 1. Update payment record (users DB)
    $stmt = $conn->prepare(
        "UPDATE payments
         SET razorpay_payment_id=?, razorpay_signature=?, status='paid', booking_ref=?
         WHERE razorpay_order_id=?"
    );
    $stmt->bind_param("ssss", $paymentId, $signature, $bookingRef, $orderId);
    $stmt->execute();
    $stmt->close();

    // 2. Create booking record (users DB)
    if ($userId > 0) {
        $bStmt = $conn->prepare(
            "INSERT INTO bookings
             (user_id, event_ext_id, event_title, seats, ticket_count, total_price, booking_ref, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'confirmed')"
        );
        $bStmt->bind_param("isssisd",
            $userId, $eventExtId, $eventTitle, $seats, $ticketCount, $totalPrice, $bookingRef
        );
        $bStmt->execute();
        $bStmt->close();
    }

    echo json_encode([
        "success"     => true,
        "booking_ref" => $bookingRef,
        "payment_id"  => $paymentId,
    ]);
    $conn->close();
    exit;
}

echo json_encode(["success" => false, "message" => "Unknown action"]);
