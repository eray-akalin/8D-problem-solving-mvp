<?php
// backend/public/api/login.php

/*
 * NOT: Bu authentication sistemi MVP demosu için basitleştirilmiştir.
 * Production ortamında tabiki JWT ve veritabanı tabanlı kullanıcı yönetimi kullanılmalıdır.
 * Güvenlik amacıyla credentials bilgileri repoya gönderilmemiş, config dosyasından çekilmektedir.
 */

// CORS headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Load config
$config = require __DIR__ . '/../../config.php';

// Get POST data
$input = json_decode(file_get_contents("php://input"), true);
$username = $input['username'] ?? '';
$password = $input['password'] ?? '';

// Check credentials
if ($username === $config['auth']['username'] && $password === $config['auth']['password']) {
    echo json_encode([
        'status' => 'success',
        'token' => 'SIEMENS_MOCK_TOKEN',
        'user' => 'admin'
    ]);
} else {
    http_response_code(401);
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid credentials'
    ]);
}
