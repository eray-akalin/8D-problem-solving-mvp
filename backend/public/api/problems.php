<?php
// backend/public/api/problems.php


ini_set('display_errors', 0);
error_reporting(E_ALL);

// CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// Sadece POST ve GET'e izin veriyoruz (Tarayıcı PUT/DELETE atmasın diye)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- METHOD SPOOFING ---
// Hosting kısıtlamasını aşmak için:
// Eğer istek POST ise ve URL'de ?_method=DELETE varsa, PHP bunu DELETE sansın.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['_method'])) {
        $_SERVER['REQUEST_METHOD'] = strtoupper($_GET['_method']);
    }
}

require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../src/Controller/ProblemController.php';

try {
    $pdo = getPDO();
    $controller = new ProblemController($pdo);
    $controller->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Sunucu Hatası: ' . $e->getMessage()]);
}
