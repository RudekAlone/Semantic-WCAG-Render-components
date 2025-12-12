<?php
require __DIR__ . '/../vendor/autoload.php';

use Core\Router;
use Core\Auth\SessionManager;
use Core\Database;

// Kontrolery
use Core\Tasks\TaskController;
use Core\Courses\CourseController;
use Core\Quizzes\QuizController;
use Core\Stats\StatsController;
use Core\Dictionaries\DictionaryController;
use Core\Users\UserController;
use Core\Auth\AuthController;
use Core\Classes\ClassController;
use Core\Subjects\SubjectController;

// Inicjalizacja Routera
$router = new Router();
$route = $router->dispatch($_SERVER['REQUEST_URI']);

// Inicjalizacja Sesji
$auth = new SessionManager();

// Baza danych
$config = require __DIR__ . '/config/config.php';
$db = new Database($config);

// Middleware autoryzacji
if ($route['controller'] !== 'Auth' && !$auth->isLoggedIn()) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized']);
    exit;
}

// Dispatcher Kontrolerów
switch ($route['controller']) {
    case 'Tasks':
        $controller = new TaskController($db);
        break;
    case 'Courses':
        $controller = new CourseController($db, $auth);
        break;
    case 'Quizzes':
        $controller = new QuizController($db);
        break;
    case 'Stats':
        $controller = new StatsController($db);
        break;
    case 'Dictionaries':
        $controller = new DictionaryController($db);
        break;
    case 'Users':
        $controller = new UserController($db);
        break;
    case 'Auth':
        $controller = new AuthController($db, $auth);
        break;
    case 'Classes':
        $controller = new ClassController($db);
        break;
    case 'Subjects':
        $controller = new SubjectController($db);
        break;
    case 'Error':
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        exit;
}

// Wywołanie akcji
$action = $route['action'];
if (method_exists($controller, $action)) {
    // Przekazanie parametrów (np. slug dla kursu, type dla quizu)
    if (isset($route['params'])) {
        echo $controller->$action($route['params']);
    } else {
        echo $controller->$action();
    }
} else {
    http_response_code(500);
    echo json_encode(['error' => "Action $action not found in controller"]);
}
