<?php
namespace Core\Stats;

use Core\Database;

class StatsRepository {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getLoginStats($userId) {
        $sql = "SELECT date_month as date, logins_count as logins FROM stats_login WHERE user_id = ?";
        return $this->db->query($sql, [$userId]);
    }

    public function getQuizStats($userId) {
        $sql = "SELECT quiz_type as quizName, completed_count as completed, total_count as count FROM stats_quiz_completed WHERE user_id = ?";
        return $this->db->query($sql, [$userId]);
    }

    public function getCourseStats($userId) {
        $sql = "SELECT course_hash as courseName, completed_count as completed, total_count as count FROM stats_course_completed WHERE user_id = ?";
        return $this->db->query($sql, [$userId]);
    }
}
