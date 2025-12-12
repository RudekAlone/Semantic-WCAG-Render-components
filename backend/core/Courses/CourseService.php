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

        // Wszystkie kursy są publiczne - możesz dodać kolumnę 'status' później jeśli potrzebne
        return $this->renderCourse($course);
    }

    private function renderCourse(array $course)
    {
        // Używamy 'name' zamiast 'title' i 'hash' zamiast 'slug'
        $courseName = htmlspecialchars($course['name'] ?? 'Kurs');
        $courseHash = htmlspecialchars($course['hash'] ?? '');
        
        return <<<HTML
<!DOCTYPE html>
<html lang="pl" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
    <title>Ładowanie kursu {$courseName}</title>
    <link rel="stylesheet" href="/css/style.css">
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
      <header>
    <h1>
      <a href="/">
        <img src="/logo.png" alt="logo" />
        Koala-V
      </a>
    </h1>
  </header>
  <main class="course-page">
    <span id="course-slug" style="display:none;">{$courseHash}</span>
  </main>
    <footer>
    <p>&copy; 2026 Koala-V</p>
  </footer>
    

        <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/dos.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/languages/powershell.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/katex.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/katex@0.16.22/dist/contrib/auto-render.min.js"></script>

    <script type="module" src="/js/course.js"></script>
</body>
</html>
HTML;
    }
}
