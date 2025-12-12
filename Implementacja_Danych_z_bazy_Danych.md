## DashboardPage.js
Brakuje danych z bazy danych.
Bo w sumie jeszcze tego nie robiliśmy.

```js
  static async getStudentExams() {
    // Brak endpointu w backendzie? Tabele `exams` nie widziałem.
    // constants.js EXAM_STUDENT_DATA_0
    // Zwróć pustą tablicę lub mocka jeśli backend tego nie ma.
    return []; 
  }
```

Mam do tego następujący plan. Będą to zestawy egzaminów próbnych (INF.02, INF.03).
Muszę mieć panel do ich aktywacji i wyświetlania statystyk i raportu z wyniku dla danej klasy.
Aktualnie frontend korzystał z mocku EXAM_STUDENT_DATA_0 w constants.js aby przygotować podgląd z strony ucznia.
Możemy to przełożyć na dalszy etap rozwoju projektu.

Dodatkowo zamiast DataService do zadań pobiera je wszystkie a nie tylko danego użytkownika. Co daje błedne dane dla generowania "Podsumowanie przedmiotów" oraz strony zadań.

## TasksPage.js

Tu jest ogromny problem. Wyświetla się tylko details z trwającymi zadaniami. Filtrowanie względem przedmiotu jest poprawne.
Jednak że uczniowi wyświetlają się wszystkie zadania z tabeli tasks zamiast tylko swoje z tabeli student_tasks i wtedy można by było faktycznie pogrupować ich statusy (-1, 0, 1):
```js
    const container = document.createElement("div");
    Object.entries(grouped).forEach(([key, list]) => {
      if (list.length > 0) {
        // Find label for this target group (reverse lookup or simplified)
        // Since statusMap keys are "0", "1", "-1", we need to find which one maps to 'key'
        // But here we can just use hardcoded labels or find first match
        let label = "Zadania";
        if (key === 'ongoing') label = "🟡 Zadania trwające";
        if (key === 'completed') label = "🟢 Zadania ukończone";
        if (key === 'overdue') label = "🔴 Zadania przeterminowane";
        
        container.appendChild(this.renderTaskList(list, previewSection, label));
      }
    });
    return container;
  }
```

## StatisticsPage.js

Tu jest problem z wyświetlaniem statystyk oraz z strukturą bazodanową.
Widzę że w DataService dopisano filtrowanie co jest błędne i było zaimplementowane jedynie na poczet mocku aby nie dublować danych.
Co do konstrukcji bazodanowej:
- tabela `stats_quiz_completed` [id, user_id, quiz_type, completed_count, total_count]:
Należy to wyekstrachować ponieważ zmiana ilości pytań w quzie wymusi zmianę setek wierszy powiązanych z uczniem. Tą informację można przeliczyć badając tabelę `quiz_questions` count() po typie quizu. Wiec sama klasa odpowiadająca za render statystyki powinna wyświetlać tylko te quizy które dany użytkownik rozpoczął.
- tabela `stats_course_completed` [id, user_id, course_hash, completed_count, total_count]:
Należy tak samo jak w przypadku quizów odzielić ilość total od całej tej tabeli.
Brakuje tabeli która bedzie przechowywać dane dotyczące modułów kursów.
To zagadnienie bedziemy jeszcze rozwijać w dalszym etapie. Konstruując interaktywność i śledzenie kursu per user. Przerobione lekcje i quiz weryfikacyjny to na razie idea. Może coś lepszego wymyślimy.

Co do klasy javascript. W przypadku braku danych co bedzie na początku widoczne dla nowego użytkownika. Należy zastosować odpowiednie placeholdery.
Statystyki Logowań domyślnie uwzględniają zakres aktualnego roku szkolnego to jest np.: od września 2025 do sierpnia 2026. + fajnie dodać bajer typu możliwość przełączania zakresu na poszczegulne lata szkolne np. 2024, 2025, 2026 i wyświetlenie całościowego np. od września 2024 do sierpnia 2026 wtedy z scss bedzie trzeba ogarnąć aby się zmieściły na stronie xP.
Zadania wydają się poprawne ale gdy użytkownik nie ma zadań to powinien się wyświetlać placeholder z informacją o braku zadań.
Quizy są nie poprawne co wynika z struktury bazo danowej poniweaż nie chcemy wyświetlać ich wszystkich. W przypadku braku danych powinien się wyświetlać placeholder z zachętą do rozpoczęcia quizu i przyciskiem przełączającym na stronę w dashbordzie. Może to być wywołanie onclick na przycisku:
```js
<button data-ui="button" data-variant="quaternary" type="button" role="button" tabindex="0" aria-label="❔ Quizzes" class="bg-quaternary" id="nav-quizzes" data-page-id="quizzes"><span class="emoji">❔</span> Quizzes</button>
```
Adekwatnie jak w przypadku quizów musimy postąpić z kursami wtedy przycisk jest taki:
```js
<button data-ui="button" data-variant="quaternary" type="button" role="button" tabindex="0" aria-label="🎓 Kursy" class="bg-quaternary" id="nav-courses" data-page-id="courses"><span class="emoji">🎓</span> Kursy</button>
```

Zostaje jeszcze statystyka branżowa, któras jest zależna od quizów i kursów. Wiec tu w przypadku braku danych powinien się wyświetlać placeholder z informacją o braku danych i zachętą do rozpoczęcia quizu i kursu.

## CoursesPage.js

Jest poprawny... prawie. Wyświetla wszystkie kursy ale ich link jest nie poprawny.
Zamiast `https://localhost/courses/windows-11` jest `https://localhost/windows-11` dodatkowo po porawieniu adresu backend zwraca nieznany endpoint a powinien Wykorzystać CourseController.php CourseRepository.php oraz CourseService.php do zwrócenia strony domyślnej która jest zawarta w CourseService.php z odpowienim slug a js ogarnie resztę.

## QuizzesPage.js
To jest w trakcie rozwoju działa aktualnie poprawnie ale pełną funkcjonalność zaprojektujemy i przygotujemy w późniejszym etapie.
Początkowa idea jest taka aby losować z danej kategori po 5 pytań gdy użytkownik źle odpowie to wyświetli mu się wyjaśnienie danego pytania, a jak dobrze to tylko pochwała. Backend powinien weryfikować poprawność odpowiedzi aby nie dało się ich podejżeć. Gdy użytkownik poprawnie odpowie to pytanie na czas 1 godziny wypada z puli do losowania i jest NIE jest zaliczone w statystykach. Gdy 3 razy pod rząd zostanie udzielona poprawna odpowiedź to pytanie wypada z puli i jest zaliczone w statystykach. Gdy po dwóch poprawnych odpowiedziach w seri na dane pytanie użytkownik odpowie źle to seria jest zerowana i znowu musi dążyć do trzykrotnej odpowiedzi poprawnej aby zaliczyć pytanie.


## TasksStatusPage.js

Ta strona Dashboardu nie działa. Co prawda ładują się zadania klasy przedmioty ale nie jest uwzględniane najważniejsze czyli statusy zadań uczniów z danej klasy. Tabela `student_tasks` nie jest uwzględniona w zapytaniu do bazy danych. Wiec tabele są puste.

## StudentsTasks

Powinno to się nazwać StudentsTasksPage.js i jest do poprawy ponieważ ma hardcodowane wykorzystanie danych z starego mocka oraz tak jak w przypadku TasksStatusPage.js nie jest uwzględnione zapytanie do bazy danych dotyczące statusów zadań uczniów.

## UsersPage.js

Do poprawy ponieważ używam tej samej klasy do dwóch różnych stron.
Jeżeli chodzi o uczniowie i użytkownicy:
- [uczniowie] Sortowni względem klasy nauczyciel oraz admin kliknieciem zrestartować im hasło do domyślnego `ZAQ!2wsx`
- [uzytkownicy] Sortowni względem roli  i/lub klasy. Tu administrator może dodać nowego użytkownika i kliknieciem zrestartować im hasło do domyślnego `ZAQ!2wsx` oraz usunąć danego użytkownika dodatkowo może też zmienić uczniowi klasę


## TasksEditorPage.js i CoursesManagerPage.js

Tu bedzie trzeba poświecić wiecej czasu i uwagi bo w grę wchodzi edycja markdown i komunikacja z repozytorium github przez token.
Same menadżery są w fazie koncepcyjnej i ich rozwój bedzie kontynuowany po zaimplementowaniu podstaw projektu. 