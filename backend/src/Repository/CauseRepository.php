<?php

class CauseRepository
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function get_by_problem_id($problemId)
    {
        $sql = "SELECT * FROM causes WHERE problem_id = :pid ORDER BY id ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':pid' => $problemId]);
        $data = $stmt->fetchAll();
        return $data;
    }

    public function create($data)
    {
        $sql = "INSERT INTO causes (problem_id, parent_id, description) VALUES (:pid, :parid, :desc)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':pid' => $data['problem_id'],
            ':parid' => $data['parent_id'] ?? null,
            ':desc' => $data['description']
        ]);
        return $this->pdo->lastInsertId();
    }

    public function update($id, $isRootCause, $action)
    {
        $sql = "UPDATE causes SET is_root_cause = :irc, solution_action = :act WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':irc' => $isRootCause,
            ':act' => $action,
            ':id' => $id
        ]);
    }

    // Bir probleme ait tüm root cause işaretlerini kaldırır
    public function resetRootCauses($problemId)
    {
        $sql = "UPDATE causes SET is_root_cause = 0 WHERE problem_id = :pid";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':pid' => $problemId]);
    }

    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM causes WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }
}
