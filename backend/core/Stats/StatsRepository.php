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
            // Rok szkolny: wrzesień {year} - sierpień {year+1}
            // Np. 2024/2025 = 2024-09 do 2025-08
            // date_month format: 'YYYY-MM'
            $sql .= " AND (
                (CAST(SUBSTRING(date_month, 1, 4) AS UNSIGNED) = ? AND CAST(SUBSTRING(date_month, 6, 2) AS UNSIGNED) >= 9) OR
                (CAST(SUBSTRING(date_month, 1, 4) AS UNSIGNED) = ? AND CAST(SUBSTRING(date_month, 6, 2) AS UNSIGNED) <= 8)
            )";
            $params[] = intval($year);      // wrzesień-grudzień roku {year}
            $params[] = intval($year) + 1;  // styczeń-sierpień roku {year+1}
        }
        $sql .= " ORDER BY date_month ASC";
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
