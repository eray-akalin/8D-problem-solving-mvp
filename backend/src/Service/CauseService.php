<?php
// backend/src/Service/CauseService.php

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

        //Önce veritabanından mevcut kaydı bul

        $currentCause = $this->causeRepository->find($data['id']);

        if (!$currentCause) {
            throw new Exception("Kayıt bulunamadı.");
        }

        // Eğer bu bir kök neden işaretlemesiyse (is_root_cause = 1)
        // O probleme ait diğer işaretleri temizle.
        if (isset($data['is_root_cause']) && $data['is_root_cause'] == 1) {
            $this->causeRepository->resetRootCauses($currentCause['problem_id']);
        }


        return $this->causeRepository->update($data['id'], $data);
    }

    public function deleteCause($id)
    {
        return $this->causeRepository->delete($id);
    }
}
