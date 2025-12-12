# Instrukcja Migracji Bazy Danych

## Problem
Baza danych używa starej struktury tabel statystyk:
- `stats_quiz_completed` ma kolumnę `quiz_type` (VARCHAR) zamiast `quiz_id` (INT)
- `stats_course_completed` ma kolumnę `course_hash` (VARCHAR) zamiast `course_id` (INT)

## Rozwiązanie

### Opcja 1: Migracja istniejącej bazy (ZALECANE)
Jeśli chcesz **zachować istniejące dane**, uruchom skrypt migracji:

```bash
# W phpMyAdmin lub MySQL CLI:
```

1. Otwórz phpMyAdmin (http://localhost/phpmyadmin)
2. Wybierz swoją bazę danych
3. Kliknij zakładkę "SQL"
4. Skopiuj i wklej zawartość pliku: `backend/sql/migration_stats_2025-12-12.sql`
5. Kliknij "Wykonaj" (Go)

**LUB** w MySQL CLI:
```bash
mysql -u root -p nazwa_bazy < backend/sql/migration_stats_2025-12-12.sql
```

### Opcja 2: Pełne przebudowanie bazy (UWAGA: USUWA WSZYSTKIE DANE)
Jeśli chcesz **zacząć od nowa**:

1. Otwórz phpMyAdmin
2. Wybierz swoją bazę danych
3. Kliknij zakładkę "SQL"
4. Skopiuj i wklej zawartość pliku: `backend/sql/database.sql`
5. Kliknij "Wykonaj" (Go)

## Weryfikacja

Po uruchomieniu migracji, sprawdź czy:

1. Tabela `quizzes` istnieje i ma 11 rekordów:
```sql
SELECT COUNT(*) FROM quizzes;
```

2. Tabela `stats_quiz_completed` ma kolumnę `quiz_id`:
```sql
DESCRIBE stats_quiz_completed;
```

3. Tabela `stats_course_completed` ma kolumnę `course_id`:
```sql
DESCRIBE stats_course_completed;
```

4. Tabela `courses` ma kolumnę `total_modules`:
```sql
DESCRIBE courses;
```

## Co zostało zmienione?

### Nowa struktura:
- ✅ Dodano tabelę `quizzes` z definicjami quizów
- ✅ Dodano `total_modules` do tabeli `courses`
- ✅ `stats_quiz_completed`: `quiz_type` → `quiz_id` (klucz obcy)
- ✅ `stats_course_completed`: `course_hash` → `course_id` (klucz obcy)
- ✅ `stats_course_completed`: `completed_count` → `completed_modules`
- ✅ Usunięto `total_count` z tabel statystyk (obliczane dynamicznie)

### Korzyści:
- Brak duplikacji danych
- Integralność referencyjna (klucze obce)
- Łatwiejsza konserwacja
- Automatyczne obliczanie total z JOIN

## Troubleshooting

### Błąd: "Column 'quiz_type' doesn't exist"
✅ To oznacza że migracja się powiodła! Odśwież stronę.

### Błąd: "Table 'quizzes' doesn't exist"
❌ Uruchom skrypt migracji ponownie.

### Błąd: "Duplicate entry"
⚠️ Skrypt migracji używa `INSERT IGNORE` - możesz go uruchomić wielokrotnie bezpiecznie.
