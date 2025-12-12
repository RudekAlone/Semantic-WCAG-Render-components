<?php
namespace Core\Tasks;

use Core\Database;

/**
 * Class TaskController
 * Obsługuje żądania związane z zadaniami.
 */
class TaskController {
    private $repo;

    public function __construct(Database $db) {
        $this->repo = new TaskRepository($db);
    }

    /**
     * Zwraca listę wszystkich zadań (format JSON).
     */
    public function getAll() {
        $tasks = $this->repo->getAll();
        header('Content-Type: application/json');
        return json_encode($tasks);
    }

    /**
     * Zwraca zadania studenta.
     * Wymaga parametru 'studentId' (opcjonalnie z sesji, tu weźmiemy z GET dla testów lub sesji).
     */
    public function getStudentTasks() {
        // ID użytkownika z sesji (middleware zapewnia, że użytkownik jest zalogowany)
        $studentId = $_SESSION['user_id'] ?? 0;
        
        $tasks = $this->repo->getStudentTasks((int)$studentId);
        header('Content-Type: application/json');
        return json_encode($tasks);
    }
    /**
     * Zwraca status zadania (listę uczniów).
     */
    public function getTaskStatus() {
        $taskName = $_GET['taskName'] ?? '';
        $className = $_GET['className'] ?? null;

        if (empty($taskName)) {
            http_response_code(400);
            return json_encode(['error' => 'Missing taskName']);
        }
        $data = $this->repo->getTaskStatus($taskName, $className);
        header('Content-Type: application/json');
        return json_encode($data);
    }
}
