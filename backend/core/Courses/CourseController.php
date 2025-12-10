<?php
namespace Core\Courses;

use Core\Database;
use Core\Auth\SessionManager;

class CourseController {
    private $repo;
    private $service;

    public function __construct(Database $db, SessionManager $auth) {
        $this->repo = new CourseRepository($db);
        $this->service = new CourseService($this->repo, $auth);
    }

    public function getAll() {
        $courses = $this->repo->getAll();
        header('Content-Type: application/json');
        return json_encode($courses);
    }

    public function view($slug) {
        // Zwraca HTML
        return $this->service->view($slug);
    }
}
