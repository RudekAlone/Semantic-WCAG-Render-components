<?php
namespace Core\Subjects;

use Core\Database;

class SubjectController {
    private $repo;

    public function __construct(Database $db) {
        $this->repo = new SubjectRepository($db);
    }

    public function getAll() {
        $result = $this->repo->getAll();
        header('Content-Type: application/json');
        return json_encode($result);
    }
}
