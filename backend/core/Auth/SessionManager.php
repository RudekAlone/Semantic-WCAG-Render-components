<?php
namespace Core\Auth;

class SessionManager {
    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function isLoggedIn(): bool {
        return isset($_SESSION['user_id']);
    }

    public function login(int $userId): void {
        $_SESSION['user_id'] = $userId;
    }

    public function logout(): void {
        session_destroy();
    }
}
