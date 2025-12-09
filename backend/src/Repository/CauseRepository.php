<?php
// backend/src/Repository/CauseRepository.php

class CauseRepository
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    // Tek bir kaydı ID ile getir ( Service'in problem_id'yi bulması için lazım)
    public function find($id)
    {
        $stmt = $this->pdo->prepare("SELECT * FROM causes WHERE id = :id");
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function get_by_problem_id($problemId)
    {
        $sql = "SELECT * FROM causes WHERE problem_id = :pid ORDER BY id ASC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':pid' => $problemId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function create($data)
    {
        $sql = "INSERT INTO causes (problem_id, parent_id, description, is_root_cause) VALUES (:pid, :parid, :desc, 0)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':pid' => $data['problem_id'],
            ':parid' => $data['parent_id'] ?? null,
            ':desc' => $data['description']
        ]);
        return $this->pdo->lastInsertId();
    }


    public function update($id, $data)
    {


        $fields = [];
        $params = [':id' => $id];

        if (isset($data['is_root_cause'])) {
            $fields[] = "is_root_cause = :irc";
            $params[':irc'] = $data['is_root_cause'];
        }

        if (isset($data['solution_action'])) {
            $fields[] = "solution_action = :act";
            $params[':act'] = $data['solution_action'];
        }

        if (isset($data['description'])) {
            $fields[] = "description = :desc";
            $params[':desc'] = $data['description'];
        }

        if (empty($fields)) {
            return true; // Güncellenecek bir şey yok
        }

        $sql = "UPDATE causes SET " . implode(', ', $fields) . " WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute($params);
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
