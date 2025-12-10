<?php
namespace Core\Auth;

use Core\Database;

class AuthController {
    private $db;
    private $session;

    public function __construct(Database $db, SessionManager $session) {
        $this->db = $db;
        $this->session = $session;
    }

    public function login() {
        // Odczyt danych z POST (JSON)
        $input = json_decode(file_get_contents('php://input'), true);
        $login = $input['username'] ?? ''; // Frontend może wysyłać username lub login
        $password = $input['password'] ?? '';

        if (!$login || !$password) {
            http_response_code(400);
            return json_encode(['error' => 'Missing login or password']);
        }

        // Pobierz usera
        $sql = "SELECT * FROM accounts WHERE login = ?";
        $accounts = $this->db->query($sql, [$login]);

        if (!$accounts) {
             http_response_code(401);
             return json_encode(['error' => 'User not found']);
        }

        $account = $accounts[0];

        if (password_verify($password, $account['password'])) {
            // Sukces - ustaw sesję (mock lub real)
            // Pobierz dane użytkownika (role)
            $users = $this->db->query("SELECT * FROM users WHERE id = ?", [$account['user_id']]);
            $user = $users[0];

            $_SESSION['user_id'] = $user['id'];
            $_SESSION['role'] = $user['role'];
            $_SESSION['name'] = $user['first_name'] . ' ' . $user['last_name'];
            
            return json_encode(['success' => true, 'role' => $user['role'], 'name' => $_SESSION['name']]);
        } else {
            http_response_code(401);
            return json_encode(['error' => 'Invalid credentials']);
        }
    }
    
    public function logout() {
        session_destroy();
        return json_encode(['success' => true]);
    }
}
