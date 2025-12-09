<?php
// backend/src/Controller/CauseController.php

require_once __DIR__ . '/../Service/CauseService.php';

class CauseController
{
    private $causeService;

    public function __construct($pdo)
    {
        $this->causeService = new CauseService($pdo);
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];

        try {
            // --- GET ---
            if ($method === 'GET') {
                $problemId = $_GET['problem_id'] ?? null;

                if (!$problemId) {
                    echo json_encode([]);
                    return;
                }

                $tree = $this->causeService->get_causes_tree($problemId);
                echo json_encode($tree);
            }

            // --- POST ---
            elseif ($method === 'POST') {
                $input = json_decode(file_get_contents("php://input"), true);
                if (!$input) throw new Exception("Geçersiz veri");

                $id = $this->causeService->addCause($input);
                echo json_encode(['status' => 'success', 'id' => $id]);
            }

            // --- PUT ---
            elseif ($method === 'PUT') {
                $input = json_decode(file_get_contents("php://input"), true);

                // ID'yi güvene al: URL'den mi geldi, Body'den mi?
                $idFromUrl = isset($_GET['id']) ? $_GET['id'] : null;
                $idFromBody = isset($input['id']) ? $input['id'] : null;

                $finalId = $idFromUrl ? $idFromUrl : $idFromBody;

                if (!$finalId) throw new Exception("ID eksik");

                // ID'yi input verisine ekle (Service kullanabilsin diye)
                $input['id'] = $finalId;

                $this->causeService->updateRootCause($input);
                echo json_encode(['status' => 'success', 'message' => 'Güncelleme başarılı']);
            }

            // --- DELETE ---
            elseif ($method === 'DELETE') {
                $id = $_GET['id'] ?? null;
                if (!$id) throw new Exception("ID eksik");

                $this->causeService->deleteCause($id);
                echo json_encode(['status' => 'success', 'message' => 'Neden silindi']);
            }
        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
