<?php
require_once __DIR__ . '/../Repository/ProblemRepository.php';

class ProblemService
{
    private $problemRepository;

    public function __construct($pdo)
    {
        $this->problemRepository = new ProblemRepository($pdo);
    }

    public function getAllProblems()
    {
        $data = $this->problemRepository->getAll();
        return $data;
    }

    public function createProblem($data)
    {
        return $this->problemRepository->create($data);
    }

    public function deleteProblem($id)
    {
        return $this->problemRepository->delete($id);
    }
    public function getProblemById($id)
    {
        return $this->problemRepository->get_by_id($id);
    }
}
