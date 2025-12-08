<?php

require_once __DIR__ . '/../Repository/CauseRepository.php';

class CauseService
{
    private $causeRepository;

    public function __construct($pdo)
    {
        $this->causeRepository = new CauseRepository($pdo);
    }

    public function get_causes_tree($problemId)
    {
        $rawData = $this->causeRepository->get_by_problem_id($problemId);

        return $this->buildTree($rawData);
    }

    public function addCause($data)
    {

        if (empty($data['description'])) {
            throw new Exception("Açıklama alanı zorunludur.");
        }
        return $this->causeRepository->create($data);
    }

    private function buildTree(array $elements, $parentId = null)
    {
        $branch = array();
        foreach ($elements as $element) {
            if ($element['parent_id'] == $parentId) {
                $children = $this->buildTree($elements, $element['id']);
                $element['children'] = $children ? $children : [];
                $branch[] = $element;
            }
        }
        return $branch;
    }

    public function updateRootCause($data)
    {
        if (!isset($data['id'])) {
            throw new Exception("ID eksik.");
        }

        $isRootCause = isset($data['is_root_cause']) ? $data['is_root_cause'] : 0;
        $action = isset($data['solution_action']) ? $data['solution_action'] : null;

        //Eğer bu bir kök neden işaretlemesiyse, 
        //önce o probleme ait diğer işaretleri temizle.
        if ($isRootCause == 1 && isset($data['problem_id'])) {
            $this->causeRepository->resetRootCauses($data['problem_id']);
        }

        return $this->causeRepository->update($data['id'], $isRootCause, $action);
    }

    public function deleteCause($id)
    {
        return $this->causeRepository->delete($id);
    }
}
