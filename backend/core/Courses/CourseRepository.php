<?php
namespace Core\Courses;

use Core\Database;

class CourseRepository {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function findBySlug(string $slug) {
        $sql = "SELECT * FROM courses WHERE hash = ? LIMIT 1";
        $result = $this->db->query($sql, [$slug]);
        return $result ? $result[0] : null;
    }

    public function getByHash(string $hash) {
        return $this->findBySlug($hash);
    }

    public function getAll() {
        $sql = "SELECT id, name, hash, img FROM courses";
        return $this->db->query($sql);
    }
}
