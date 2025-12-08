<?php
//CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once __DIR__ . '/../../db.php';
require_once __DIR__ . '/../../src/Controller/ProblemController.php';

//başlat
$pdo = getPDO();
$controller = new ProblemController($pdo);
$controller->handleRequest();
