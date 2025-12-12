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

    public function getBySlug($slug) {
        $course = $this->repo->getByHash($slug);
        if (!$course) {
            http_response_code(404);
            return json_encode(['error' => 'Course not found']);
        }
        header('Content-Type: application/json');
        return json_encode($course);
    }
}
