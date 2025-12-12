<?php
namespace Core\Dictionaries;

use Core\Database;

class DictionaryController {
    private $db;

    public function __construct(Database $db) {
        $this->db = $db;
    }

    public function getSubjects() {
        // Pobierz z bazy
        // Format frontend: { value: 'aso', text: '...' }
        // UWAGA: Frontend oczekuje tablicy [{value, text}] oraz obiektu {aso: 'nazwa'}.
        // DataService.js: getSubjectOptions() -> array, getSubjectNames() -> object.
        // Router.php: 'dictionaries/subjects' -> jedna akcja. 
        // Zróbmy 'options' bo to typowy słownik.
        
        // Zmodyfikujmy Router by obsługiwał oba? 
        // DataService ma 2 metody.
        // Ale tu implementujemy API.
        
        $sql = "SELECT code as value, name as text FROM subjects";
        $rows = $this->db->query($sql);
        
        // Dodaj opcje puste/wszystkie jak w constants.js?
        // constants.js ma:
        // { value: "", text: "Wybierz przedmiot" },
        // { value: "all", text: "Wszystkie przedmioty" }
        
        $result = array_merge(
            [
                ['value' => '', 'text' => 'Wybierz przedmiot'],
                ['value' => 'all', 'text' => 'Wszystkie przedmioty']
            ],
            $rows
        );

        header('Content-Type: application/json');
        return json_encode($result);
    }

    public function getRoles() {
         $roles = [
            ['value' => 'student', 'text' => 'Uczeń'],
            ['value' => 'teacher', 'text' => 'Nauczyciel'],
            ['value' => 'admin', 'text' => 'Administrator'],
        ];
        header('Content-Type: application/json');
        return json_encode($roles);
    }

    public function getClasses() {
         $classes = [
            ['value' => '1A', 'text' => '1A'],
            ['value' => '2B', 'text' => '2B'],
            ['value' => '3C', 'text' => '3C'],
        ];
        header('Content-Type: application/json');
        return json_encode($classes);
    }
    
    public function getQuizzesGroup() {
        // constants.js DATA_QUIZZES_GROUP
         $groups = [
            ['value' => 'inf02', 'text' => 'INF.02'],
            ['value' => 'inf03', 'text' => 'INF.03'],
            ['value' => 'so', 'text' => 'Systemy operacyjne'],
            ['value' => 'utk', 'text' => 'Urządzenia Techniki Komputerowej'],
            ['value' => 'sk', 'text' => 'Sieci komputerowe'],
            ['value' => 'bd', 'text' => 'Bazy danych'],
            ['value' => 'js', 'text' => 'JavaScript'],
            ['value' => 'html', 'text' => 'HTML'],
            ['value' => 'css', 'text' => 'CSS'],
            ['value' => 'php', 'text' => 'PHP'],
            ['value' => 'cpp', 'text' => 'C++']
        ];
        header('Content-Type: application/json');
        return json_encode($groups);
    }

    public function getBranches() {
        // Skomplikowana struktura z constants.js BRANCHES
        $branches = [
          [
            'key' => "Frontend",
            'quizNames' => ["javascript", "html", "css"],
            'courseNames' => ["javascript"]
          ],
          [
            'key' => "Backend",
            'quizNames' => ["php", "bd"],
            'courseNames' => ["mysql"]
          ],
          [
            'key' => "Fullstack",
            'quizNames' => [],
            'courseNames' => []
          ],
          [
            'key' => "Mobile",
            'quizNames' => [],
            'courseNames' => []
          ],
          [
            'key' => "DevOps/Cloud",
            'quizNames' => [],
            'courseNames' => ["virtualbox", "docker", "kubernetes", "aws", "azure"]
          ],
          [
            'key' => "Cyberbezpieczeństwo",
            'quizNames' => [],
            'courseNames' => []
          ],
          [
            'key' => "Data Science",
            'quizNames' => [],
            'courseNames' => []
          ],
          [
            'key' => "Grafika 2D",
            'quizNames' => [],
            'courseNames' => []
          ],
          [
            'key' => "Game Dev",
            'quizNames' => [],
            'courseNames' => []
          ]
        ];
        header('Content-Type: application/json');
        return json_encode($branches);
    }
}
