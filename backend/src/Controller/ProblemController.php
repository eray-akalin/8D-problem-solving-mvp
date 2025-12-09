<?php
// backend/src/Controller/ProblemController.php

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
            // --- GET ---
            if ($method === 'GET') {
                if (isset($_GET['id'])) {
                    $problem = $this->problemService->getProblemById($_GET['id']);
                    echo json_encode($problem);
                } else {
                    $problems = $this->problemService->getAllProblems();
                    echo json_encode($problems);
                }
            }

            // --- POST ---
            elseif ($method === 'POST') {
                $input = json_decode(file_get_contents("php://input"), true);
                if (!$input) throw new Exception("Veri eksik");

                $id = $this->problemService->createProblem($input);
                echo json_encode(['status' => 'success', 'id' => $id]);
            }

            // --- DELETE ---
            elseif ($method === 'DELETE') {
                // Method Spoofing ile ?id=123&_method=DELETE şeklinde geliyor
                $id = $_GET['id'] ?? null;

                if (!$id) throw new Exception("ID eksik");

                $this->problemService->deleteProblem($id);
                echo json_encode(['status' => 'success', 'message' => 'Problem silindi']);
            }

            // --- PUT ---
            elseif ($method === 'PUT') {
                $input = json_decode(file_get_contents("php://input"), true);

                // ID hem URL'den hem Body'den gelebilir
                $id = $_GET['id'] ?? ($input['id'] ?? null);
                $status = $input['status'] ?? null;

                if (!$id || !$status) {
                    throw new Exception("ID veya status eksik");
                }

                $this->problemService->updateProblemStatus($id, $status);
                echo json_encode(['status' => 'success', 'message' => 'Problem durumu güncellendi']);
            }
        } catch (Exception $e) {
            http_response_code(500); // Veya 400
            echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }
}
