<?php
require_once __DIR__ . '/../Service/ProblemService.php';

class ProblemController
{
    private $problemService;

    public function __construct($pdo)
    {
        $this->problemService = new ProblemService($pdo);
    }

    public function handleRequest()
    {
        $method = $_SERVER['REQUEST_METHOD'];

        try {
            if ($method === 'GET') {
                //ID varsa tek problem, yoksa liste dön
                if (isset($_GET['id'])) {
                    $problem = $this->problemService->getProblemById($_GET['id']);
                    echo json_encode($problem);
                } else {
                    $problems = $this->problemService->getAllProblems();
                    echo json_encode($problems);
                }
            } elseif ($method === 'POST') {
                $input = json_decode(file_get_contents("php://input"), true);
                $id = $this->problemService->createProblem($input);
                echo json_encode(['status' => 'success', 'id' => $id]);
            } elseif ($method === 'DELETE') {
                $id = $_GET['id'] ?? null;
                if (!$id) throw new Exception("ID eksik");
                $this->problemService->deleteProblem($id);
                echo json_encode(['status' => 'success', 'message' => 'Problem silindi']);
            }
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
}
