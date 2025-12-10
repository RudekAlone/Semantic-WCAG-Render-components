<?php
namespace Core\Stats;

use Core\Database;

class StatsController {
    private $repo;

    public function __construct(Database $db) {
        $this->repo = new StatsRepository($db);
    }

    public function getLoginStats() {
        // Mock: domyślnie user 4 (Katarzyna)
        // Jeśli isAdmin=true (parametr get), to user 3 (Admin).
        $userId = 4;
        if (isset($_GET['isAdmin']) && $_GET['isAdmin'] == 'true') {
            $userId = 3;
        }

        $data = $this->repo->getLoginStats($userId);
        header('Content-Type: application/json');
        return json_encode($data);
    }

    public function getQuizStats() {
        $userId = 4; // Mock Katarzyna
        $data = $this->repo->getQuizStats($userId);
        header('Content-Type: application/json');
        return json_encode($data);
    }

    public function getCourseStats() {
        $userId = 4; // Mock Katarzyna
        $data = $this->repo->getCourseStats($userId);
        header('Content-Type: application/json');
        return json_encode($data);
    }
}
