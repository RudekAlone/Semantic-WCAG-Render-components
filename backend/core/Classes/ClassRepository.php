<?php
namespace Core\Classes;

use Core\Database;

class ClassRepository {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getAll() {
        return $this->db->query("SELECT id, name FROM classes ORDER BY name");
    }
}
