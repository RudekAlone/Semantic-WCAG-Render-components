<?php
namespace Core\Users;

use Core\Database;

class UserController {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getAll() {
        // Zwracamy format jak w USERS_DATA constants.js
        // [id, name, middle, last, login, roleFormatted?]
        // USERS_DATA = [ [1, "Jan", "Marek", "Nowak", "jnowak001", "🧑🏻‍🎓 Uczeń"], ... ]
        // Frontend oczekuje tablicy tablic?
        // Zobaczmy constants.js:
        // export const USERS_DATA = [ [1, "Jan", "Marek", "Nowak", "jnowak001", "🧑🏻‍🎓 Uczeń"], ... ];
        // Tak, to tablica tablic.
        
        // Muszę pobrać użytkowników i sformatować.
        // Login jest w tabeli accounts! Join needed.
        
        $sql = "
            SELECT u.id, u.first_name, u.middle_name, u.last_name, a.login, u.role
            FROM users u
            LEFT JOIN accounts a ON u.id = a.user_id
        ";
        
        $rows = $this->db->query($sql);
        $result = [];
        
        foreach ($rows as $row) {
            // Formatuj rolę z emoji
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
                $roleText
            ];
        }

        header('Content-Type: application/json');
        return json_encode($result);
    }
}
