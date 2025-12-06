<?php
require __DIR__ . '/../vendor/autoload.php';

use Core\Router;
use Core\Auth\SessionManager;
use Core\Database;
use Core\Courses\CourseRepository;
use Core\Courses\CourseService;

$router = new Router();
$route = $router->dispatch($_SERVER['REQUEST_URI']);

$auth = new SessionManager();

// Baza danych
$config = require __DIR__ . '/config/config.php';
$db = new Database($config);

switch ($route['controller']) {
    case 'Courses':
        $repo = new CourseRepository($db);
        $service = new CourseService($repo, $auth);
        echo $service->view($route['params']);
        break;

    case 'Auth':
        echo "Tutaj będzie logowanie...";
        break;

    default:
        // dla innych kontrolerów wymagaj logowania
        if (!$auth->isLoggedIn()) {
            http_response_code(403);
            exit('Access denied');
        }
        echo "Controller: {$route['controller']}, Action: {$route['action']}";
}
