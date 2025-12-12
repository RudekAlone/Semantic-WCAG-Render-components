-- Schemat Bazy Danych dla Projektu Semantic-WCAG

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- --------------------------------------------------------
-- Tabela: subjects (Przedmioty)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `subjects`;
CREATE TABLE `subjects` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(10) NOT NULL UNIQUE, -- np. 'aso', 'bd', 'so'
  `name` VARCHAR(100) NOT NULL, -- Pełna nazwa
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Tabela: classes (Klasy)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `classes`;
CREATE TABLE `classes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane początkowe dla Klas
INSERT INTO `classes` (`name`) VALUES
('1A'), ('1B'), ('2A'), ('2B'), ('3A'), ('3B'), ('4A'), ('4B');

-- Dane początkowe dla Przedmiotów
INSERT INTO `subjects` (`code`, `name`) VALUES
('aso', 'Administracja Systemami Operacyjnymi'),
('so', 'Systemy Operacyjne'),
('bd', 'Bazy Danych'),
('pai', 'Programowanie Aplikacji Internetowych'),
('utk', 'Urządzenia Techniki Komputerowej');

-- --------------------------------------------------------
-- Tabela: users (Użytkownicy)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(100) NOT NULL,
  `middle_name` VARCHAR(100) DEFAULT NULL,
  `last_name` VARCHAR(100) NOT NULL,
  `role` ENUM('student', 'teacher', 'admin') NOT NULL,
  `class_name` VARCHAR(10) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane początkowe dla Użytkowników
INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `role`, `class_name`) VALUES
(1, 'Jan', 'Marek', 'Nowak', 'student', '1A'),
(2, 'Anna', 'Maria', 'Wiśniewska', 'teacher', NULL),
(3, 'Piotr', NULL, 'Zieliński', 'admin', NULL),
(4, 'Katarzyna', 'Ewa', 'Kowalczyk', 'student', '2A'),
(5, 'Michał', NULL, 'Kamiński', 'teacher', NULL),
(6, 'Agnieszka', 'Joanna', 'Lewandowska', 'admin', NULL),
(7, 'Tomasz', NULL, 'Dąbrowski', 'student', '1B');

-- --------------------------------------------------------
-- Tabela: accounts (Konta)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `login` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- Hasło zahashowane
  `old_password` VARCHAR(255) DEFAULT NULL,
  `password_expiry_date` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane początkowe dla Kont (Hasło: ZAQ!2wsx)
INSERT INTO `accounts` (`user_id`, `login`, `password`, `password_expiry_date`) VALUES
(1, 'jnowak001', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', '2025-12-31'),
(2, 'awisniewska002', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', '2025-12-31'),
(3, 'pzielinski003', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', '2025-12-31'),
(4, 'kkowalczyk004', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', '2025-12-31'),
(5, 'mkaminski005', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', '2025-12-31'),
(6, 'alewandowska006', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', '2025-12-31'),
(7, 'tdabrowski007', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', '2025-12-31');

-- --------------------------------------------------------
-- Tabela: tasks (Zadania)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `tasks`;
CREATE TABLE `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `part_name` VARCHAR(100) DEFAULT NULL,
  `subject_id` INT NOT NULL,
  `link` VARCHAR(500) DEFAULT NULL,
  `deadline` DATE DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane początkowe dla Zadań
-- Mapowanie Subject ID: 1=aso, 2=so, 3=bd, 4=pai
INSERT INTO `tasks` (`id`, `name`, `part_name`, `subject_id`, `link`, `deadline`) VALUES
(1, 'Konfiguracja Domeny Active Directory', 'AD', 1, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task10.md', '2024-05-20'),
(2, 'Sortowanie i filtrowanie danych w SQL', 'SQL', 3, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task7.md', '2024-06-15'),
(3, 'Aliasy nazw domenowych DNS', 'DNS', 1, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task8.md', '2026-05-10'),
(4, 'Zarządzanie Użytkownikami w Domenie', 'AD', 1, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task9.md', '2026-05-25'),
(5, 'Tworzenie bazy danych MySQL', 'MySQL', 3, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task4.md', '2026-06-15'),
(6, 'Tworzenie stron internetowych', NULL, 4, NULL, '2024-07-10');

-- --------------------------------------------------------
-- Tabela: student_tasks (Zadania Studenta)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `student_tasks`;
CREATE TABLE `student_tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `task_id` INT NOT NULL,
  `status` ENUM('0', '1', '-1') NOT NULL DEFAULT '0', -- 0: trwające, 1: zakończone, -1: zaległe
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane początkowe Zadania Studenta (Katarzyna - ID 4)
INSERT INTO `student_tasks` (`user_id`, `task_id`, `status`) VALUES 
(4, 1, '1'),
(4, 3, '1'),
(4, 4, '1'),
(4, 2, '1'),
(4, 5, '0'),
(4, 6, '1');

-- --------------------------------------------------------
-- Tabela: courses (Kursy)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(100) NOT NULL,
  `hash` VARCHAR(100) NOT NULL UNIQUE,
  `img` VARCHAR(255) DEFAULT NULL,
  `total_modules` INT DEFAULT 0, -- Całkowita liczba modułów w kursie
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane początkowe Kursów
INSERT INTO `courses` (`id`, `name`, `hash`, `img`, `total_modules`) VALUES
(1, 'Windows 11', 'windows-11', 'windows11.webp', 50),
(2, 'Ubuntu 24.04 Desktop', 'ubuntu-24.04-desktop', 'ubuntuDesktop.webp', 40),
(3, 'Windows Server 2025', 'windows-server-2025', 'windowsServer2025.webp', 35),
(4, 'VirtualBox', 'virtualbox', 'VirtualBox.webp', 25),
(5, 'JavaScript', 'javascript', 'javascript.webp', 60);

-- --------------------------------------------------------
-- Tabela: quizzes (Quizy - definicje)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `quizzes`;
CREATE TABLE `quizzes` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `code` VARCHAR(20) NOT NULL UNIQUE, -- np. 'javascript', 'html', 'css'
  `name` VARCHAR(100) NOT NULL, -- Pełna nazwa quizu
  `total_questions` INT DEFAULT 0, -- Całkowita liczba pytań w quizie
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane początkowe Quizów
INSERT INTO `quizzes` (`code`, `name`, `total_questions`) VALUES
('javascript', 'JavaScript', 100),
('html', 'HTML', 80),
('css', 'CSS', 75),
('php', 'PHP', 90),
('cpp', 'C++', 85),
('so', 'Systemy Operacyjne', 120),
('utk', 'Urządzenia Techniki Komputerowej', 95),
('bd', 'Bazy Danych', 110),
('inf02', 'INF.02 - Administracja bazami danych', 150),
('inf03', 'INF.03 - Tworzenie aplikacji webowych', 140),
('sk', 'Sieci Komputerowe', 105);

-- --------------------------------------------------------
-- Tabela: quiz_questions (Pytania Quizowe)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `quiz_questions`;
CREATE TABLE `quiz_questions` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `type` VARCHAR(20) NOT NULL,
  `question` TEXT NOT NULL,
  `options` JSON NOT NULL,
  `answer` INT NOT NULL,
  `img` VARCHAR(255) DEFAULT NULL,
  `img_alt` VARCHAR(255) DEFAULT NULL,
  `explanation` TEXT DEFAULT NULL,
  `explanation_img` VARCHAR(255) DEFAULT NULL,
  `explanation_img_alt` VARCHAR(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane początkowe Pytania
INSERT INTO `quiz_questions` (`type`, `question`, `options`, `answer`, `img`, `img_alt`, `explanation`) VALUES
('js', 'Co to jest zmienna w JavaScript?', '["Miejsce do przechowywania danych", "Funkcja do wykonywania zadań", "Typ danych", "Operator matematyczny"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', 'Logo JavaScript', 'Zmienna to nazwana przestrzeń w pamięci...'),
('js', 'Jak zadeklarować funkcję w JavaScript?', '["function myFunction() {}", "var myFunction = []", "let myFunction = {}", "const myFunction = () => {}"]', 0, NULL, NULL, 'Funkcję w JavaScript można zadeklarować za pomocą słowa kluczowego function...'),
('html', 'Co oznacza skrót HTML?', '["HyperText Markup Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language", "Hyperlinking Text Markup Language"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg', 'Logo HTML5', 'HTML to skrót od HyperText Markup Language...'),
('php', 'Co to jest PHP?', '["Język skryptowy po stronie serwera", "Język znaczników", "System zarządzania bazą danych", "Framework do tworzenia aplikacji webowych"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg', 'Logo PHP', 'PHP to język skryptowy po stronie serwera...'),
('so', 'Co to jest system operacyjny?', '["Oprogramowanie zarządzające zasobami komputera", "Program do edycji tekstu", "Aplikacja do przeglądania internetu", "Narzędzie do tworzenia grafiki"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Windows_logo_-_2021.svg', 'Logo systemu operacyjnego', 'System operacyjny to oprogramowanie zarządzające zasobami komputera...'),
('utk', 'Co to jest CPU?', '["Central Processing Unit", "Computer Power Unit", "Central Performance Unit", "Computer Processing Unit"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/1/10/Intel_CPU_Logo.svg', 'Logo CPU', 'CPU (Central Processing Unit) to centralna jednostka przetwarzająca...'),
('cpp', 'Kto jest twórcą języka C++?', '["Bjarne Stroustrup", "Dennis Ritchie", "James Gosling", "Guido van Rossum"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg', 'Logo C++', 'Język C++ został stworzony przez Bjarne Stroustrupa...');

-- --------------------------------------------------------
-- Tabela: stats_login (Statystyki Logowania)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `stats_login`;
CREATE TABLE `stats_login` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL,
  `date_month` VARCHAR(7) NOT NULL, -- YYYY-MM
  `logins_count` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane Statystyk Logowania (Katarzyna)
INSERT INTO `stats_login` (`user_id`, `date_month`, `logins_count`) VALUES
(4, '2024-01', 15), (4, '2024-02', 22), (4, '2024-03', 18), 
(4, '2024-04', 30), (4, '2024-05', 25), (4, '2024-06', 28), (4, '2024-07', 35);
-- (Admin)
INSERT INTO `stats_login` (`user_id`, `date_month`, `logins_count`) VALUES
(3, '2024-01', 5), (3, '2024-02', 8), (3, '2024-03', 6), 
(3, '2024-04', 10), (3, '2024-05', 7), (3, '2024-06', 9), (3, '2024-07', 12);

-- --------------------------------------------------------
-- Tabela: stats_quiz_completed (Statystyki Ukończonych Quizów)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `stats_quiz_completed`;
CREATE TABLE `stats_quiz_completed` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `quiz_id` INT NOT NULL, -- Klucz obcy do tabeli quizzes
  `completed_count` INT DEFAULT 0, -- Liczba poprawnie ukończonych pytań (3x pod rząd)
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`quiz_id`) REFERENCES `quizzes`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane Statystyk Quizów (Katarzyna - user_id=4)
-- Mapowanie: javascript=1, html=2, css=3, php=4, cpp=5, so=6, utk=7, bd=8, inf02=9, inf03=10, sk=11
INSERT INTO `stats_quiz_completed` (`user_id`, `quiz_id`, `completed_count`) VALUES
(4, 1, 27),  -- javascript
(4, 2, 15),  -- html
(4, 3, 10),  -- css
(4, 4, 8),   -- php
(4, 5, 5),   -- cpp
(4, 6, 89),  -- so
(4, 7, 34),  -- utk
(4, 8, 22),  -- bd
(4, 9, 12),  -- inf02
(4, 10, 9),  -- inf03
(4, 11, 14); -- sk

-- --------------------------------------------------------
-- Tabela: stats_course_completed (Statystyki Ukończonych Kursów)
-- --------------------------------------------------------
DROP TABLE IF EXISTS `stats_course_completed`;
CREATE TABLE `stats_course_completed` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT NOT NULL,
  `course_id` INT NOT NULL, -- Klucz obcy do tabeli courses
  `completed_modules` INT DEFAULT 0, -- Liczba ukończonych modułów
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`course_id`) REFERENCES `courses`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dane Statystyk Kursów (Katarzyna - user_id=4)
-- Mapowanie: windows-11=1, ubuntu-24.04-desktop=2, windows-server-2025=3, virtualbox=4, javascript=5
INSERT INTO `stats_course_completed` (`user_id`, `course_id`, `completed_modules`) VALUES
(4, 1, 45),  -- windows-11
(4, 2, 30),  -- ubuntu-24.04-desktop
(4, 3, 25),  -- windows-server-2025
(4, 4, 20),  -- virtualbox
(4, 5, 50);  -- javascript

SET FOREIGN_KEY_CHECKS = 1;
