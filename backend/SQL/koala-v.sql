-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 13, 2025 at 09:34 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `koala-v`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `accounts`
--

CREATE TABLE `accounts` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `login` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `old_password` varchar(255) DEFAULT NULL,
  `password_expiry_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `user_id`, `login`, `password`, `old_password`, `password_expiry_date`, `created_at`) VALUES
(1, 1, 'jnowak001', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', NULL, '2025-12-31', '2025-12-12 20:21:40'),
(2, 2, 'awisniewska002', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', NULL, '2025-12-31', '2025-12-12 20:21:40'),
(3, 3, 'pzielinski003', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', NULL, '2025-12-31', '2025-12-12 20:21:40'),
(4, 4, 'kkowalczyk004', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', NULL, '2025-12-31', '2025-12-12 20:21:40'),
(5, 5, 'mkaminski005', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', NULL, '2025-12-31', '2025-12-12 20:21:40'),
(6, 6, 'alewandowska006', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', NULL, '2025-12-31', '2025-12-12 20:21:40'),
(7, 7, 'tdabrowski007', '$2y$10$ycq/ghBgvO4uu0yJ0kBsYOnw2hLInGiRU3HXjn6A0f/jOoxexDnmO', NULL, '2025-12-31', '2025-12-12 20:21:40');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `classes`
--

CREATE TABLE `classes` (
  `id` int(11) NOT NULL,
  `name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `classes`
--

INSERT INTO `classes` (`id`, `name`) VALUES
(1, '1A'),
(2, '1B'),
(3, '2A'),
(4, '2B'),
(5, '3A'),
(6, '3B'),
(7, '4A'),
(8, '4B');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `courses`
--

CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `hash` varchar(100) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `total_modules` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `courses`
--

INSERT INTO `courses` (`id`, `name`, `hash`, `img`, `total_modules`, `created_at`) VALUES
(1, 'Windows 11', 'Windows-11', 'windows11.webp', 50, '2025-12-12 20:21:40'),
(2, 'Ubuntu 24.04 Desktop', 'ubuntu-24.04-desktop', 'ubuntuDesktop.webp', 40, '2025-12-12 20:21:40'),
(3, 'Windows Server 2025', 'windows-server-2025', 'windowsServer2025.webp', 35, '2025-12-12 20:21:40'),
(4, 'VirtualBox', 'virtualbox', 'VirtualBox.webp', 25, '2025-12-12 20:21:40'),
(5, 'JavaScript', 'javascript', 'javascript.webp', 60, '2025-12-12 20:21:40');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `quizzes`
--

CREATE TABLE `quizzes` (
  `id` int(11) NOT NULL,
  `code` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `total_questions` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`id`, `code`, `name`, `total_questions`, `created_at`) VALUES
(1, 'javascript', 'JavaScript', 100, '2025-12-12 20:21:40'),
(2, 'html', 'HTML', 80, '2025-12-12 20:21:40'),
(3, 'css', 'CSS', 75, '2025-12-12 20:21:40'),
(4, 'php', 'PHP', 90, '2025-12-12 20:21:40'),
(5, 'cpp', 'C++', 85, '2025-12-12 20:21:40'),
(6, 'so', 'Systemy Operacyjne', 120, '2025-12-12 20:21:40'),
(7, 'utk', 'Urządzenia Techniki Komputerowej', 95, '2025-12-12 20:21:40'),
(8, 'bd', 'Bazy Danych', 110, '2025-12-12 20:21:40'),
(9, 'inf02', 'INF.02 - Administracja bazami danych', 150, '2025-12-12 20:21:40'),
(10, 'inf03', 'INF.03 - Tworzenie aplikacji webowych', 140, '2025-12-12 20:21:40'),
(11, 'sk', 'Sieci Komputerowe', 105, '2025-12-12 20:21:40');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int(11) NOT NULL,
  `type` varchar(20) NOT NULL,
  `question` text NOT NULL,
  `options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`options`)),
  `answer` int(11) NOT NULL,
  `img` varchar(255) DEFAULT NULL,
  `img_alt` varchar(255) DEFAULT NULL,
  `explanation` text DEFAULT NULL,
  `explanation_img` varchar(255) DEFAULT NULL,
  `explanation_img_alt` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `type`, `question`, `options`, `answer`, `img`, `img_alt`, `explanation`, `explanation_img`, `explanation_img_alt`) VALUES
(1, 'js', 'Co to jest zmienna w JavaScript?', '[\"Miejsce do przechowywania danych\", \"Funkcja do wykonywania zadań\", \"Typ danych\", \"Operator matematyczny\"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', 'Logo JavaScript', 'Zmienna to nazwana przestrzeń w pamięci...', NULL, NULL),
(2, 'js', 'Jak zadeklarować funkcję w JavaScript?', '[\"function myFunction() {}\", \"var myFunction = []\", \"let myFunction = {}\", \"const myFunction = () => {}\"]', 0, NULL, NULL, 'Funkcję w JavaScript można zadeklarować za pomocą słowa kluczowego function...', NULL, NULL),
(3, 'html', 'Co oznacza skrót HTML?', '[\"HyperText Markup Language\", \"Home Tool Markup Language\", \"Hyperlinks and Text Markup Language\", \"Hyperlinking Text Markup Language\"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg', 'Logo HTML5', 'HTML to skrót od HyperText Markup Language...', NULL, NULL),
(4, 'php', 'Co to jest PHP?', '[\"Język skryptowy po stronie serwera\", \"Język znaczników\", \"System zarządzania bazą danych\", \"Framework do tworzenia aplikacji webowych\"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg', 'Logo PHP', 'PHP to język skryptowy po stronie serwera...', NULL, NULL),
(5, 'so', 'Co to jest system operacyjny?', '[\"Oprogramowanie zarządzające zasobami komputera\", \"Program do edycji tekstu\", \"Aplikacja do przeglądania internetu\", \"Narzędzie do tworzenia grafiki\"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/3/3f/Windows_logo_-_2021.svg', 'Logo systemu operacyjnego', 'System operacyjny to oprogramowanie zarządzające zasobami komputera...', NULL, NULL),
(6, 'utk', 'Co to jest CPU?', '[\"Central Processing Unit\", \"Computer Power Unit\", \"Central Performance Unit\", \"Computer Processing Unit\"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/1/10/Intel_CPU_Logo.svg', 'Logo CPU', 'CPU (Central Processing Unit) to centralna jednostka przetwarzająca...', NULL, NULL),
(7, 'cpp', 'Kto jest twórcą języka C++?', '[\"Bjarne Stroustrup\", \"Dennis Ritchie\", \"James Gosling\", \"Guido van Rossum\"]', 0, 'https://upload.wikimedia.org/wikipedia/commons/1/18/ISO_C%2B%2B_Logo.svg', 'Logo C++', 'Język C++ został stworzony przez Bjarne Stroustrupa...', NULL, NULL);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `stats_course_completed`
--

CREATE TABLE `stats_course_completed` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `course_id` int(11) NOT NULL,
  `completed_modules` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stats_course_completed`
--

INSERT INTO `stats_course_completed` (`id`, `user_id`, `course_id`, `completed_modules`, `created_at`) VALUES
(1, 4, 1, 45, '2025-12-12 20:21:41'),
(2, 4, 2, 30, '2025-12-12 20:21:41'),
(3, 4, 3, 25, '2025-12-12 20:21:41'),
(4, 4, 4, 20, '2025-12-12 20:21:41'),
(5, 4, 5, 50, '2025-12-12 20:21:41');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `stats_login`
--

CREATE TABLE `stats_login` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date_month` varchar(7) NOT NULL,
  `logins_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stats_login`
--

INSERT INTO `stats_login` (`id`, `user_id`, `date_month`, `logins_count`) VALUES
(1, 4, '2024-09', 15),
(2, 4, '2024-10', 22),
(3, 4, '2024-11', 18),
(4, 4, '2024-12', 30),
(5, 4, '2025-01', 25),
(6, 4, '2025-02', 28),
(7, 4, '2025-03', 35),
(8, 4, '2025-04', 5),
(9, 4, '2025-05', 8),
(10, 4, '2025-06', 6),
(11, 3, '2024-04', 10),
(12, 3, '2024-05', 7),
(13, 3, '2024-06', 9),
(14, 3, '2024-07', 12);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `stats_quiz_completed`
--

CREATE TABLE `stats_quiz_completed` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `quiz_id` int(11) NOT NULL,
  `completed_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `stats_quiz_completed`
--

INSERT INTO `stats_quiz_completed` (`id`, `user_id`, `quiz_id`, `completed_count`, `created_at`) VALUES
(1, 4, 1, 27, '2025-12-12 20:21:40'),
(2, 4, 2, 15, '2025-12-12 20:21:40'),
(3, 4, 3, 10, '2025-12-12 20:21:40'),
(4, 4, 4, 8, '2025-12-12 20:21:40'),
(5, 4, 5, 5, '2025-12-12 20:21:40'),
(6, 4, 6, 89, '2025-12-12 20:21:40'),
(7, 4, 7, 34, '2025-12-12 20:21:40'),
(8, 4, 8, 22, '2025-12-12 20:21:40'),
(9, 4, 9, 12, '2025-12-12 20:21:40'),
(10, 4, 10, 9, '2025-12-12 20:21:40');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `student_tasks`
--

CREATE TABLE `student_tasks` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `task_id` int(11) NOT NULL,
  `status` enum('0','1','-1') NOT NULL DEFAULT '0',
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `student_tasks`
--

INSERT INTO `student_tasks` (`id`, `user_id`, `task_id`, `status`, `updated_at`) VALUES
(1, 4, 1, '-1', '2025-12-12 20:33:42'),
(2, 4, 3, '1', '2025-12-12 20:21:40'),
(3, 4, 4, '0', '2025-12-12 20:33:46'),
(4, 4, 2, '1', '2025-12-12 20:21:40'),
(5, 4, 6, '0', '2025-12-12 20:34:28');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `subjects`
--

CREATE TABLE `subjects` (
  `id` int(11) NOT NULL,
  `code` varchar(10) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`id`, `code`, `name`, `created_at`) VALUES
(1, 'aso', 'Administracja Systemami Operacyjnymi', '2025-12-12 20:21:40'),
(2, 'so', 'Systemy Operacyjne', '2025-12-12 20:21:40'),
(3, 'bd', 'Bazy Danych', '2025-12-12 20:21:40'),
(4, 'pai', 'Programowanie Aplikacji Internetowych', '2025-12-12 20:21:40'),
(5, 'utk', 'Urządzenia Techniki Komputerowej', '2025-12-12 20:21:40');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `part_name` varchar(100) DEFAULT NULL,
  `subject_id` int(11) NOT NULL,
  `link` varchar(500) DEFAULT NULL,
  `deadline` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `name`, `part_name`, `subject_id`, `link`, `deadline`, `created_at`) VALUES
(1, 'Konfiguracja Domeny Active Directory', 'AD', 1, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task10.md', '2024-05-20', '2025-12-12 20:21:40'),
(2, 'Sortowanie i filtrowanie danych w SQL', 'SQL', 3, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task7.md', '2024-06-15', '2025-12-12 20:21:40'),
(3, 'Aliasy nazw domenowych DNS', 'DNS', 1, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task8.md', '2026-05-10', '2025-12-12 20:21:40'),
(4, 'Zarządzanie Użytkownikami w Domenie', 'AD', 1, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task9.md', '2026-05-25', '2025-12-12 20:21:40'),
(5, 'Tworzenie bazy danych MySQL', 'MySQL', 3, 'https://raw.githubusercontent.com/Edu-Koala-V/task-markdown/refs/heads/main/task4.md', '2026-06-15', '2025-12-12 20:21:40'),
(6, 'Tworzenie stron internetowych', NULL, 4, NULL, '2024-07-10', '2025-12-12 20:21:40');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `middle_name` varchar(100) DEFAULT NULL,
  `last_name` varchar(100) NOT NULL,
  `role` enum('student','teacher','admin') NOT NULL,
  `class_name` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `first_name`, `middle_name`, `last_name`, `role`, `class_name`, `created_at`) VALUES
(1, 'Jan', 'Marek', 'Nowak', 'student', '1A', '2025-12-12 20:21:40'),
(2, 'Anna', 'Maria', 'Wiśniewska', 'teacher', NULL, '2025-12-12 20:21:40'),
(3, 'Piotr', NULL, 'Zieliński', 'admin', NULL, '2025-12-12 20:21:40'),
(4, 'Katarzyna', 'Ewa', 'Kowalczyk', 'student', '2A', '2025-12-12 20:21:40'),
(5, 'Michał', NULL, 'Kamiński', 'teacher', NULL, '2025-12-12 20:21:40'),
(6, 'Agnieszka', 'Joanna', 'Lewandowska', 'admin', NULL, '2025-12-12 20:21:40'),
(7, 'Tomasz', NULL, 'Dąbrowski', 'student', '1B', '2025-12-12 20:21:40');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `login` (`login`),
  ADD KEY `user_id` (`user_id`);

--
-- Indeksy dla tabeli `classes`
--
ALTER TABLE `classes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indeksy dla tabeli `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hash` (`hash`);

--
-- Indeksy dla tabeli `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indeksy dla tabeli `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `stats_course_completed`
--
ALTER TABLE `stats_course_completed`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `course_id` (`course_id`);

--
-- Indeksy dla tabeli `stats_login`
--
ALTER TABLE `stats_login`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `stats_quiz_completed`
--
ALTER TABLE `stats_quiz_completed`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Indeksy dla tabeli `student_tasks`
--
ALTER TABLE `student_tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indeksy dla tabeli `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`);

--
-- Indeksy dla tabeli `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `subject_id` (`subject_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `classes`
--
ALTER TABLE `classes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `stats_course_completed`
--
ALTER TABLE `stats_course_completed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `stats_login`
--
ALTER TABLE `stats_login`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `stats_quiz_completed`
--
ALTER TABLE `stats_quiz_completed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `student_tasks`
--
ALTER TABLE `student_tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stats_course_completed`
--
ALTER TABLE `stats_course_completed`
  ADD CONSTRAINT `stats_course_completed_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stats_course_completed_ibfk_2` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stats_quiz_completed`
--
ALTER TABLE `stats_quiz_completed`
  ADD CONSTRAINT `stats_quiz_completed_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `stats_quiz_completed_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quizzes` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `student_tasks`
--
ALTER TABLE `student_tasks`
  ADD CONSTRAINT `student_tasks_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `student_tasks_ibfk_2` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
