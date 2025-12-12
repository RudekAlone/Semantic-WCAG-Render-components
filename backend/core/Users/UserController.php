<?php
namespace Core\Users;

use Core\Database;

class UserController {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function resetPassword() {
        // Oczekujemy POST z { userId: int }
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['userId'] ?? 0;
        
        if (!$userId) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing ID']);
            return;
        }

        // Domyślne hasło: ZAQ!2wsx
        // Hash: $2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO (z database.sql)
        $defaultHash = '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO';
        
        $sql = "UPDATE accounts SET password = ? WHERE user_id = ?";
        $this->db->query($sql, [$defaultHash, $userId]);
        
        echo json_encode(['success' => true]);
    }

    public function changeClass() {
        $input = json_decode(file_get_contents('php://input'), true);
        $userId = $input['userId'] ?? 0;
        $newClass = $input['newClass'] ?? '';
        
        if (!$userId || !$newClass) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing data']);
            return;
        }
        
        // Zakładamy, że w tabeli users jest kolumna class_name (dodamy ją)
        // Jeśli nie ma, to zapytanie wywali błąd, ale dodamy ją zaraz.
        $sql = "UPDATE users SET class_name = ? WHERE id = ?";
        $this->db->query($sql, [$newClass, $userId]);
        
        echo json_encode(['success' => true]);
    }

    public function getAll() {
        // Dodaj class_name do selecta
        $sql = "
            SELECT u.id, u.first_name, u.middle_name, u.last_name, a.login, u.role, u.class_name
            FROM users u
            LEFT JOIN accounts a ON u.id = a.user_id
        ";
        
        $rows = $this->db->query($sql);
        $result = [];
        
        foreach ($rows as $row) {
            $roleText = '';
            switch ($row['role']) {
                case 'student': $roleText = "🧑🏻‍🎓 Uczeń"; break;
                case 'teacher': $roleText = "🧑🏻‍🏫 Nauczyciel"; break;
                case 'admin': $roleText = "🤖 Administrator"; break;
                default: $roleText = $row['role'];
            }
            
            $result[] = [
                (int)$row['id'],
                $row['first_name'],
                $row['middle_name'] ?: '-',
                $row['last_name'],
                $row['login'],
                $roleText,
                $row['class_name'] ?? '' // Dodajemy klasę jako 7. element
            ];
        }

        header('Content-Type: application/json');
        return json_encode($result);
    }
}
