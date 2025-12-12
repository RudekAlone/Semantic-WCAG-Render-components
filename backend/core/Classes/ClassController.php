<?php
namespace Core\Classes;

use Core\Database;

class ClassController {
    private $repo;

    public function __construct(Database $db) {
        $this->repo = new ClassRepository($db);
    }

    public function getAll() {
        $result = $this->repo->getAll();
        header('Content-Type: application/json');
        return json_encode($result);
    }
}
