<?php
namespace Core\Tasks;

use Core\Database;

/**
 * Class TaskRepository
 * Odpowiada za pobieranie danych zadań z bazy danych.
 */
class TaskRepository {
    private $db;

    /**
     * @param Database $db
     */
    public function __construct(Database $db) {
        $this->db = $db;
    }

    /**
     * Pobiera wszystkie zadania.
     * @return array
     */
    public function getAll() {
        // Pobieramy subject jako kod (code) z tabeli subjects
        $sql = "
            SELECT t.id, t.name, t.part_name, s.code as subject, t.status_map_placeholder as status, t.link, t.deadline
            FROM tasks t
            LEFT JOIN subjects s ON t.subject_id = s.id
        ";
        // Uwaga: W bazie tabelka 'tasks' nie ma pola 'status' jak w mocku (tam jest 'status' => "0").
        // W bazie status jest tylko w 'student_tasks'.
        // Mock w constants.js TASKS_DATA ma pole 'status' dla ogólnej listy?
        // Zobaczmy constants.js: 
        // TASKS_DATA = [{ id: 1, ..., status: "0", ... }]
        // Wygląda na to, że dla ogólnej listy zadań frontend oczekuje jakiegoś domyślnego statusu lub jest to status dla zalogowanego usera?
        // W TASKS_DATA values są "0", "1", "-1".
        // Jeśli to lista ogólna, to status nie ma sensu chyba że to "czy aktywne".
        // Przyjmijmy że zwracamy null lub 0.
        // Ale wait, TASKS_DATA w mocku ma konkretne wartości. Być może to widok "Moje zadania"?
        // Nie, DataService.getTasks() zwraca TASKS_DATA.
        // DataService.getAllStudentTasks() zwraca co innego.
        
        // Zostawmy status, frontend może go wymagać.
        
        // Zaktualizowane zapytanie bez statusu w tabeli tasks (bo go tam nie ma)
         $sql = "
            SELECT t.id, t.name, t.part_name as partName, s.code as subject, t.link, t.deadline, '0' as status
            FROM tasks t
            LEFT JOIN subjects s ON t.subject_id = s.id
        ";
        
        return $this->db->query($sql);
    }

    /**
     * Pobiera zadania przypisane do konkretnego studenta z ich statusami.
     * @param int $studentId
     * @return array
     */
    public function getStudentTasks(int $studentId) {
        $sql = "
            SELECT 
                t.name, 
                t.part_name as partName, 
                s.code as subject, 
                st.status, 
                t.deadline,
                t.link,
                u.first_name as studentName,
                COALESCE(u.middle_name, '-') as studentMiddleName,
                u.last_name as studentLastName
            FROM student_tasks st
            JOIN tasks t ON st.task_id = t.id
            JOIN subjects s ON t.subject_id = s.id
            JOIN users u ON st.user_id = u.id
            WHERE st.user_id = ?
        ";
        return $this->db->query($sql, [$studentId]);
    }
    /**
     * Pobiera statusy danego zadania dla wszystkich uczniów, którzy mają je przypisane.
     * @param string $taskName
     * @param string|null $className
     * @return array
     */
    public function getTaskStatus(string $taskName, ?string $className = null) {
        $sql = "
            SELECT 
                u.id as userNumber, 
                u.first_name as userName, 
                u.last_name as userLastName, 
                st.status,
                u.class_name
            FROM student_tasks st
            JOIN tasks t ON st.task_id = t.id
            JOIN users u ON st.user_id = u.id
            WHERE t.name = ?
        ";
        
        $params = [$taskName];
        
        if ($className && $className !== 'all') {
            $sql .= " AND u.class_name = ?";
            $params[] = $className;
        }
        
        $sql .= " ORDER BY u.last_name, u.first_name";
        
        return $this->db->query($sql, $params);
    }
}
