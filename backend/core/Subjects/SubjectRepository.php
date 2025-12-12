<?php
namespace Core\Subjects;

use Core\Database;

class SubjectRepository {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getAll() {
        return $this->db->query("SELECT id, code, name FROM subjects");
    }
}
