<?php

namespace Core\Courses;

use Core\Auth\SessionManager;

class CourseService
{
    private $repo;
    private $auth;

    public function __construct(CourseRepository $repo, SessionManager $auth)
    {
        $this->repo = $repo;
        $this->auth = $auth;
    }

    public function view(string $slug)
    {
        $course = $this->repo->findBySlug($slug);

        if (!$course) {
            http_response_code(404);
            return "Course not found";
        }

        if ($course['status'] === 'public') {
            // dostęp dla wszystkich
            return $this->renderCourse($course);
        }

        // kurs prywatny → sprawdź rolę
        if ($this->auth->isLoggedIn() && in_array($_SESSION['role'], ['teacher', 'admin'])) {
            return $this->renderCourse($course);
        }

        http_response_code(403);
        return "Access denied";
    }

private function renderCourse(array $course)
{
    return <<<HTML
<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
    <title>Ładowanie kursu {$course['title']}</title>
        <link
      rel="stylesheet"
      href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css"
    />
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.css"
    />
</head>
<body>
    <span id="course-slug" style="display:none;">{$course['slug']}</span>

        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dos.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/powershell.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js"></script>

    <script type="module" src="../js/course.js"></script>
</body>
</html>
HTML;
}

}
