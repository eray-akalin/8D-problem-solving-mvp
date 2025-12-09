<?php
// backend/public/api/causes.php


ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../src/Controller/CauseController.php';

// CORS Ayarları
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
// Tarayıcıya POST'a izin verdiğimizi söylüyoruz (PUT/DELETE'i sildik kafa karışmasın)
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// --- METHOD SPOOFING (HOSTING KISITLAMASINI AŞMA) ---
// Eğer istek POST ise ve URL'de ?_method=PUT varsa, PHP'yi kandırıyoruz.
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_GET['_method'])) {
        $_SERVER['REQUEST_METHOD'] = strtoupper($_GET['_method']);
    }
}

try {
    $pdo = getPDO();
    $controller = new CauseController($pdo);
    $controller->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Sunucu Hatası: ' . $e->getMessage()]);
}
