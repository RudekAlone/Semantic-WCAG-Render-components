<?php
namespace Core\Stats;

use Core\Database;

class StatsController {
    private $repo;

    public function __construct(Database $db) {
        $this->repo = new StatsRepository($db);
    }

    public function getLoginStats() {
        // Pobieramy statystyki zalogowanego użytkownika
        // Jeśli potrzebne są statystyki innego usera (np. admin sprawdza), tu powinna być weryfikacja uprawnień
        // Na razie zakładamy: moje statystyki.
        $userId = $_SESSION['user_id'] ?? 0;
        $year = $_GET['year'] ?? null;
        
        $data = $this->repo->getLoginStats($userId, $year);
        header('Content-Type: application/json');
        return json_encode($data);
    }

    public function getQuizStats() {
        $userId = $_SESSION['user_id'] ?? 0;
        $data = $this->repo->getQuizStats($userId);
        header('Content-Type: application/json');
        return json_encode($data);
    }

    public function getCourseStats() {
        $userId = $_SESSION['user_id'] ?? 0;
        $data = $this->repo->getCourseStats($userId);
        header('Content-Type: application/json');
        return json_encode($data);
    }
}
