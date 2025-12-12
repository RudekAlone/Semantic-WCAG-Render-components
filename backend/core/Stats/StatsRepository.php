<?php
namespace Core\Stats;

use Core\Database;

class StatsRepository {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getLoginStats($userId, $year = null) {
        $sql = "SELECT date_month as date, logins_count as logins FROM stats_login WHERE user_id = ?";
        $params = [$userId];
        if ($year) {
             $sql .= " AND date_month LIKE ?";
             $params[] = "$year-%";
        }
        return $this->db->query($sql, $params);
    }

    public function getQuizStats($userId) {
        // JOIN z tabelą quizzes aby pobrać nazwę i total_questions
        $sql = "
            SELECT 
                q.name as quizName, 
                sq.completed_count as completed, 
                q.total_questions as count 
            FROM stats_quiz_completed sq 
            INNER JOIN quizzes q ON sq.quiz_id = q.id
            WHERE sq.user_id = ?
        ";
        return $this->db->query($sql, [$userId]);
    }

    public function getCourseStats($userId) {
        // JOIN z tabelą courses aby pobrać nazwę i total_modules
        $sql = "
            SELECT 
                c.name as courseName, 
                sc.completed_modules as completed, 
                c.total_modules as total 
            FROM stats_course_completed sc 
            INNER JOIN courses c ON sc.course_id = c.id
            WHERE sc.user_id = ?
        ";
        return $this->db->query($sql, [$userId]);
    }
}
