<?php
namespace Core\Courses;

use Core\Database;

class CourseRepository {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function findBySlug(string $slug) {
        $sql = "SELECT * FROM courses WHERE slug = ? LIMIT 1";
        $result = $this->db->query($sql, [$slug]);
        return $result ? $result[0] : null;
    }
}
