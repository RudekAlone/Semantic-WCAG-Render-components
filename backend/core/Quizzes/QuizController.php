<?php
namespace Core\Quizzes;

use Core\Database;

class QuizController {
    private $repo;

    public function __construct(Database $db) {
        $this->repo = new QuizRepository($db);
    }

    public function getByType($type) {
        $questions = $this->repo->getByType($type);
        
        // Przetwarzanie options z JSON string na array
        foreach ($questions as &$q) {
            if (isset($q['options'])) {
                $q['options'] = json_decode($q['options']);
            }
            // Mapowanie kolumn na camelCase (jeśli frontend tego wymaga, a wymaga: imgAlt, explanationImg itp.)
            $q['imgAlt'] = $q['img_alt'];
            $q['explanationImg'] = $q['explanation_img'];
            $q['explanationImgAlt'] = $q['explanation_img_alt'];
            
            // Usunięcie snake_case kluczy (opcjonalne, dla czystości)
            unset($q['img_alt'], $q['explanation_img'], $q['explanation_img_alt']);
        }
        
        header('Content-Type: application/json');
        return json_encode($questions);
    }
}
