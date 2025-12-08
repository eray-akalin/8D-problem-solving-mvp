<?php
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
            if ($method === 'GET') {
                $problemId = $_GET['problem_id'] ?? null;
                if (!$problemId) throw new Exception("Problem ID gerekli");

                $tree = $this->causeService->get_causes_tree($problemId);
                echo json_encode($tree);
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents("php://input"), true);
                $id = $this->causeService->addCause($input);
                echo json_encode(['status' => 'success', 'id' => $id]);
            } elseif ($method === 'PUT') {
                $input = json_decode(file_get_contents("php://input"), true);
                $this->causeService->updateRootCause($input);
                echo json_encode(['status' => 'success', 'message' => 'Kök neden güncellendi']);
            } elseif ($method === 'DELETE') {
                $id = $_GET['id'] ?? null;
                if (!$id) throw new Exception("ID eksik");
                $this->causeService->deleteCause($id);
                echo json_encode(['status' => 'success', 'message' => 'neden silindi']);
            }
        } catch (Exception $e) {
            http_response_code(400); // Bad Request
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
