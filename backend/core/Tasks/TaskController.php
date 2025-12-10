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
        // Symulacja: pobranie ID z parametru GET (np. ?studentId=4) lub domyślnie 4 (Katarzyna)
        // W produkcji powinno być z $_SESSION['user_id']
        $studentId = $_GET['studentId'] ?? 4; 
        
        $tasks = $this->repo->getStudentTasks((int)$studentId);
        header('Content-Type: application/json');
        return json_encode($tasks);
    }
}
