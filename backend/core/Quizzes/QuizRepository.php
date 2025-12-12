<?php
namespace Core\Quizzes;

use Core\Database;

class QuizRepository {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getByType($type) {
        // Pobrane opcje są JSONem w bazie, przy odczycie PDO zwróci string, trzeba zdekodować w kontrolerze lub tu?
        // Zwracamy surowe dane, kontroler sformatuje.
        $sql = "SELECT * FROM quiz_questions WHERE type = ?";
        return $this->db->query($sql, [$type]);
    }
}
