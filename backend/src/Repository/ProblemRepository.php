<?php

class ProblemRepository
{
    private $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function getAll()
    {
        $stmt = $this->pdo->query("SELECT * FROM problems ORDER BY created_at DESC");
        return $stmt->fetchAll();
    }

    public function create($data)
    {
        $sql = "INSERT INTO problems (title, description, responsible_team, status) VALUES (:title, :description, :team, 'open')";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            ':title' => $data['title'],
            ':description' => $data['description'],
            ':team' => $data['responsible_team']
        ]);
        return $this->pdo->lastInsertId();
    }

    public function delete($id)
    {
        $stmt = $this->pdo->prepare("DELETE FROM problems WHERE id = :id");
        return $stmt->execute([':id' => $id]);
    }

    public function get_by_id($id)
    {
        $sql = "SELECT * FROM problems WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([':id' => $id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function updateStatus($id, $status)
    {
        $sql = "UPDATE problems SET status = :status WHERE id = :id";
        $stmt = $this->pdo->prepare($sql);
        return $stmt->execute([':status' => $status, ':id' => $id]);
    }
}
