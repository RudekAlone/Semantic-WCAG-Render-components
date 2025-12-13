import { UIFacade } from "../UIFacade.js";
import { DataService } from "../Service/DataService.js";
import { MONTH_NAMES_PL } from "./constants.js";

export class StatisticsPage {

    /**
     * Globalna pula kolorów do wykresów
     */
    static get COLOR_PALETTE() {
    const theme = document.documentElement.getAttribute("data-theme");
    return theme === "dark" ? this.COLOR_PALETTE_DARK : this.COLOR_PALETTE_LIGHT;
  }
    static COLOR_PALETTE_LIGHT = [
    "rgba(33, 33, 33, 1)", // 0
    "rgba(75,192,192,0.35)", // 1
    "rgba(75,192,192,0.04)", // 2
    "rgba(75, 192, 192, 1)", // 3
    "rgba(200, 200, 200, 0.15)", // 4
    "rgba(148, 54, 235, 0.7)", // 5
    "rgba(255, 206, 86, 0.7)", // 6
    "rgba(54,162,235,0.22)", // 7
    "rgba(54,162,235,0.9)", // 8
    "rgba(160, 160, 160, 0.15)", // 9
    "rgba(68, 190, 72, 0.85)", // 10
    "rgba(51, 126, 54, 1)", // 11
    "rgba(220,53,69,0.28)", // 12
    "rgba(220,53,69,0.9)", // 13
    "rgba(240, 240, 240, 1)" // 14
    ];

      static COLOR_PALETTE_DARK = [
    "rgba(235, 235, 235, 1)", // 0
    "rgba(75,192,192,0.35)", // 1
    "rgba(75,192,192,0.04)", // 2
    "rgba(75, 192, 192, 1)", // 3
    "rgba(235,235,235,0.06)", // 4
    "rgba(148, 54, 235, 0.7)", // 5
    "rgba(255, 206, 86, 0.7)", // 6
    "rgba(54,162,235,0.22)", // 7
    "rgba(54,162,235,0.9)", // 8
    "rgba(160, 160, 160, 0.15)", // 9
    "rgba(68, 190, 72, 0.85)", // 10
    "rgba(51, 126, 54, 1)", // 11
    "rgba(220,53,69,0.28)", // 12
    "rgba(220,53,69,0.9)", // 13
    "rgba(33, 33, 33, 1)" // 14
  ];


    static renderStatisticsPage() {

        const container = document.createElement("section");
        container.id = "statistics-page";
        const title = document.createElement("h2");
        title.textContent = "Statystyki";
        container.appendChild(title);
        
        const contentContainer = document.createElement("div");
        contentContainer.id = "statistics-content";
        contentContainer.innerHTML = '<div class="loader">Ładowanie statystyk...</div>';
        container.appendChild(contentContainer);

        this._loadDataAndRender(contentContainer);

        // Dodaj listener tylko raz
        if (!this._themeListenerAdded) {
            setTimeout(() => {
                const switcherTheme = document.querySelector("label.switch");
                if (switcherTheme) {
                    switcherTheme.addEventListener("change", () => {
                        const statsContent = document.getElementById("statistics-content");
                        if (statsContent) {
                            statsContent.innerHTML = '<div class="loader">Ładowanie statystyk...</div>';
                            this._loadDataAndRender(statsContent);
                            console.log("Przełączono motyw, odświeżanie statystyk...");
                        }
                    });
                    this._themeListenerAdded = true;
                }
            }, 100);
        }

        return container;
    }

    static async _loadDataAndRender(container) {
        try {
            const usersData = await DataService.getUsers();
            const userData = usersData[0]; // Mock: current user is always index 0

            container.innerHTML = ""; // Clear loader
            
            const statsSection = document.createElement("section");
            statsSection.id = "statistics-section";
            container.appendChild(statsSection);

            if(userData[5].split(" ")[1]==="Uczeń"){
                await this.loadUserStatistics(statsSection, userData);
            } else {
                await this.loadAllUserStatistics(statsSection, usersData);
            }

        } catch (error) {
            console.error("Błąd ładowania statystyk:", error);
            container.innerHTML = '<p class="error">Nie udało się pobrać danych statystycznych.</p>';
        }
    }

    static async loadUserStatistics(container, userData) {
        // Zapobiegaj wielokrotnemu ładowaniu
        if (this._isLoadingStats) {
            console.warn('Statystyki są już ładowane, pomijam...');
            return;
        }
        
        this._isLoadingStats = true;
        container.innerHTML = '<div class="loader">Pobieranie szczegółowych danych...</div>';
        
        try {
            const [
                loginStats,
                tasks,
                quizStats,
                courseStats,
                coursesData,
                branches
            ] = await Promise.all([
                DataService.getLoginStatistics(false),
                DataService.getAllStudentTasks(),
                DataService.getQuizCompletedStatistics(),
                DataService.getCoursesCompletedStatistics(),
                DataService.getCourses(),
                DataService.getBranches()
            ]);

            container.innerHTML = ""; // Clear loader

            const loginStatsSection = document.createElement("section");
            loginStatsSection.id = "login-statistics-section";
            
            // Year Selector
            const headerRow = document.createElement("div");
            headerRow.className = "chart-header-row";
            headerRow.style.display = "flex";
            headerRow.style.justifyContent = "space-between";
            headerRow.style.alignItems = "center";
            headerRow.style.marginBottom = "10px";

            const title = document.createElement("h3");
            title.textContent = "Logowania";
            headerRow.appendChild(title);

            // Dynamiczne generowanie lat szkolnych od 2022 do aktualnego roku
            const currentYear = new Date().getFullYear();
            const yearSelect = document.createElement("select");
            let yearOptions = '';
            for (let year = currentYear; year >= 2022; year--) {
                const nextYear = year + 1;
                yearOptions += `<option value="${year}">${year}/${nextYear}</option>`;
            }
            yearSelect.innerHTML = yearOptions;
            
            // Ustaw domyślnie aktualny rok
            yearSelect.value = currentYear.toString();
            
            yearSelect.addEventListener("change", async (e) => {
                const year = e.target.value;
                const newStats = await DataService.getLoginStatistics(false, year);
                this.createLoginChart(newStats, "loginStatisticsChart");
            });
            headerRow.appendChild(yearSelect);
            loginStatsSection.appendChild(headerRow);

            const loginCanvas = document.createElement("canvas");
            loginCanvas.id = "loginStatisticsChart";
            loginStatsSection.appendChild(loginCanvas);
            container.appendChild(loginStatsSection);
    
            // Renderuj od razu
            this.createLoginChart(loginStats, "loginStatisticsChart");

            // Dodaj resize listener z debouncing aby odświeżać wykres przy zmianie rozmiaru okna
            if (!this._resizeListenerAdded) {
                let resizeTimeout;
                window.addEventListener("resize", () => {
                    clearTimeout(resizeTimeout);
                    resizeTimeout = setTimeout(async () => {
                        const currentYearValue = document.querySelector("#login-statistics-section select")?.value;
                        if (currentYearValue) {
                            const stats = await DataService.getLoginStatistics(false, currentYearValue);
                            this.createLoginChart(stats, "loginStatisticsChart");
                        }
                    }, 250); // debounce 250ms
                });
                this._resizeListenerAdded = true;
            }
    
            const tasksStatusSection = document.createElement("section");
            tasksStatusSection.id = "tasks-statistics-section";
            const tasksCanvas = document.createElement("canvas");
            tasksCanvas.id = "tasksStatusChart";
            tasksStatusSection.appendChild(tasksCanvas);
            container.appendChild(tasksStatusSection);
            this.tasksChartCompletionStatusByStudent("tasksStatusChart", tasks);
    
            const roadmapSection = document.createElement("section");
            roadmapSection.id = "roadmap-statistics-section";
            const roadmapCanvas = document.createElement("canvas");
            roadmapCanvas.id = "roadmapChart";
            roadmapSection.appendChild(roadmapCanvas);
            container.appendChild(roadmapSection);
            this.createChartRoadmap(
                { quizzes: quizStats, courses: courseStats, canvasId: "roadmapChart" },
                null,
                null,
                branches,
                coursesData
            );
    
            const quizStatsSection = document.createElement("section");
            quizStatsSection.id = "quiz-statistics-section";
            const quizCanvas = document.createElement("canvas");
            quizCanvas.id = "quizCompletionChart";
            quizStatsSection.appendChild(quizCanvas);
            container.appendChild(quizStatsSection);
            this.createQuizCompletionChart(quizStats, "quizCompletionChart");
    
            const coursesStatsSection = document.createElement("section");
            coursesStatsSection.id = "courses-statistics-section";
            const coursesCanvas = document.createElement("canvas");
            coursesCanvas.id = "coursesCompletionChart";
            coursesStatsSection.appendChild(coursesCanvas);
            container.appendChild(coursesStatsSection);
            this.createCoursesCompletionChart(courseStats, "coursesCompletionChart");

        } catch (error) {
            console.error("Błąd pobierania szczegółów statystyk:", error);
            container.innerHTML = '<p class="error">Błąd pobierania szczegółowych danych.</p>';
        } finally {
            this._isLoadingStats = false;
        }
    }

    static async loadAllUserStatistics(container, usersData) {
        container.innerHTML = '<div class="loader">Pobieranie statystyk administratora...</div>';
        
        try {
            const loginStatsAdmin = await DataService.getLoginStatistics(true);
            
            container.innerHTML = "";
           
             const loginStatsSection = document.createElement("section");
            loginStatsSection.id = "login-statistics-section";
            
            const loginCanvas = document.createElement("canvas");
            loginCanvas.id = "loginStatisticsChart";
            loginStatsSection.appendChild(loginCanvas);
            container.appendChild(loginStatsSection);
    
            setTimeout(() => {
                this.createLoginChart(loginStatsAdmin, "loginStatisticsChart");
            }, 0);

        } catch (error) {
            console.error("Błąd pobierania statystyk admina:", error);
            container.innerHTML = '<p class="error">Błąd pobierania danych.</p>';
        }
    }

    static createLoginChart(data, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        // Remove existing chart first
        const existing = Chart.getChart(canvasId);
        if (existing) existing.destroy();

        // Pobierz wybrany rok szkolny z selecta
        const yearSelect = document.querySelector(`#login-statistics-section select`);
        const selectedYear = yearSelect ? parseInt(yearSelect.value) : new Date().getFullYear();
        const nextYear = selectedYear + 1;

        // Generuj statyczne etykiety dla roku szkolnego (wrzesień - sierpień)
        const schoolYearMonths = [
            { month: 9, year: selectedYear, label: `wrzesień ${selectedYear}`, shortLabel: `wrz ${selectedYear}` },
            { month: 10, year: selectedYear, label: `październik ${selectedYear}`, shortLabel: `paź ${selectedYear}` },
            { month: 11, year: selectedYear, label: `listopad ${selectedYear}`, shortLabel: `lis ${selectedYear}` },
            { month: 12, year: selectedYear, label: `grudzień ${selectedYear}`, shortLabel: `gru ${selectedYear}` },
            { month: 1, year: nextYear, label: `styczeń ${nextYear}`, shortLabel: `sty ${nextYear}` },
            { month: 2, year: nextYear, label: `luty ${nextYear}`, shortLabel: `lut ${nextYear}` },
            { month: 3, year: nextYear, label: `marzec ${nextYear}`, shortLabel: `mar ${nextYear}` },
            { month: 4, year: nextYear, label: `kwiecień ${nextYear}`, shortLabel: `kwi ${nextYear}` },
            { month: 5, year: nextYear, label: `maj ${nextYear}`, shortLabel: `maj ${nextYear}` },
            { month: 6, year: nextYear, label: `czerwiec ${nextYear}`, shortLabel: `cze ${nextYear}` },
            { month: 7, year: nextYear, label: `lipiec ${nextYear}`, shortLabel: `lip ${nextYear}` },
            { month: 8, year: nextYear, label: `sierpień ${nextYear}`, shortLabel: `sie ${nextYear}` }
        ];

        // Utwórz mapę danych z backendu dla łatwego odnajdywania
        const dataMap = new Map();
        (data || []).forEach(entry => {
            if (entry.date) {
                dataMap.set(entry.date, Number(entry.logins) || 0);
            }
        });

        // Responsive sizing detection
        const isMobile = window.innerWidth < 768;
        const isUltraMobile = window.innerWidth < 400;

        // Dopasuj dane do statycznych miesięcy
        const labels = [];
        const loginCounts = [];
        schoolYearMonths.forEach(({ month, year, label, shortLabel }) => {
            const dateKey = `${year}-${String(month).padStart(2, '0')}`;
            // Użyj ultra-skróconych etykiet na bardzo małych ekranach
            if (isUltraMobile) {
                labels.push(shortLabel.split(' ')[0]); // tylko "wrz", "paź", etc.
            } else {
                labels.push(isMobile ? shortLabel : label);
            }
            loginCounts.push(dataMap.get(dateKey) || 0);
        });

        // Sprawdź czy są jakiekolwiek dane
        const hasData = loginCounts.some(count => count > 0);
        if (!hasData) {
            const parent = canvas.parentElement;
            const oldPlaceholder = parent.querySelector('.no-data-placeholder');
            if(oldPlaceholder) oldPlaceholder.remove();

            canvas.style.display = 'none';

            const placeholder = document.createElement('div');
            placeholder.className = 'no-data-placeholder';
            placeholder.innerHTML = `<p>Brak danych logowania dla roku szkolnego ${selectedYear}/${nextYear}.</p>`;
            parent.appendChild(placeholder);
            return;
        }

        // Ensure canvas is visible
        canvas.style.display = 'block';
        const parent = canvas.parentElement;
        const oldPlaceholder = parent.querySelector('.no-data-placeholder');
        if(oldPlaceholder) oldPlaceholder.remove();

        // Usuń stare style canvas - niech Chart.js zarządza rozmiarami
        canvas.style.width = '';
        canvas.style.height = '';
        canvas.width = 0;
        canvas.height = 0;

        const ctx = canvas.getContext('2d');

        // Create gradient for fill (używa arbitrary height dla gradientu)
        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, this.COLOR_PALETTE[1]);
        gradient.addColorStop(1, this.COLOR_PALETTE[2]);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Liczba logowań',
                    data: loginCounts,
                    borderColor: this.COLOR_PALETTE[3],
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.25,
                    pointRadius: 3,
                    pointHoverRadius: 5,
                }]
            },
            options: {
                color: this.COLOR_PALETTE[0],
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: this.COLOR_PALETTE[0],
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        titleColor: this.COLOR_PALETTE[0],
                        bodyColor: this.COLOR_PALETTE[0],
                        backgroundColor: this.COLOR_PALETTE[14],
                        titleFont: { size: 13 },
                        bodyFont: { size: 12 }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 0,
                            color: this.COLOR_PALETTE[0],
                            font: { size: 11 }
                        },
                        grid: { display: false, color: this.COLOR_PALETTE[4] }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { 
                            precision: 0, 
                            color: this.COLOR_PALETTE[0],
                            font: { size: 11 }
                        },
                        grid: { color: this.COLOR_PALETTE[4] }
                    }
                }
            }
        });
    }


    static createQuizCompletionChart(data, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Filter out quizzes with no completions
        const filteredData = (data || []).filter(entry => Number(entry.completed) > 0);

        // Remove existing
        const existing = Chart.getChart(canvasId);
        if (existing) existing.destroy();

        if (filteredData.length === 0) {
            const parent = canvas.parentElement;
            const oldPlaceholder = parent.querySelector('.no-data-placeholder');
            if(oldPlaceholder) oldPlaceholder.remove();

            canvas.style.display = 'none';

            const placeholder = document.createElement('div');
            placeholder.className = 'no-data-placeholder';
            const p = document.createElement('p');
            p.textContent = "Rozpocznij quiz, aby śledzić postępy tutaj.";
            placeholder.appendChild(p);
            const placeholderBtn = UIFacade.createButton("Zobacz quizy", "primary", "button", () => {
                document.getElementById("nav-quizzes").click();
            });
            placeholder.appendChild(placeholderBtn);
            parent.appendChild(placeholder);
            return;
        }
        
        // Use filteredData
        data = filteredData;

        canvas.style.display = 'block';
        const parent = canvas.parentElement;
        parent.querySelectorAll('.no-data-placeholder').forEach(el => el.remove());

        const ctx = canvas.getContext('2d');

        const labels = data.map(entry => entry.quizName);
        const fullLabels = [...labels]; // Kopia pełnych nazw dla tooltipów
        
        // Skracanie etykiet dla osi Y aby nie zajmowały za dużo miejsca
        const truncatedLabels = labels.map(l => l.length > 30 ? l.substring(0, 30) + '...' : l);
        
        const completedCounts = data.map(entry => entry.completed);
        const totalCounts = data.map(entry => entry.count);

        // dynamic height: approx 40px per item
        const perItemHeight = 40;
        const padding = 20;
        const minHeight = 300; // Zwiększone min-height
        const maxHeight = 2000; // Zwiększony limit dla dużej ilości quizów
        const computedHeight = Math.max(minHeight, Math.min(maxHeight, labels.length * perItemHeight + padding));

        canvas.style.height = `${computedHeight}px`;
        canvas.style.width = '100%';

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: truncatedLabels,
                datasets: [
                    {
                        label: 'Ilość nauczonych pytań',
                        data: completedCounts,
                        backgroundColor: this.COLOR_PALETTE[5]
                    },
                    {
                        label: 'Ilość wszystkich pytań',
                        data: totalCounts,
                        backgroundColor: this.COLOR_PALETTE[6]
                    }
                ]
            },
            options: {
                color: this.COLOR_PALETTE[0],
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    bar: {
                        borderRadius: 4,
                        borderSkipped: false,
                        maxBarThickness: 32
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            color: this.COLOR_PALETTE[0]
                        },
                        grid: { color: this.COLOR_PALETTE[4] }
                    },
                    y: {
                        ticks: {
                            autoSkip: false,
                            color: this.COLOR_PALETTE[0]
                        },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: this.COLOR_PALETTE[0] }
                    },
                    tooltip: {
                        titleColor: this.COLOR_PALETTE[0],
                        bodyColor: this.COLOR_PALETTE[0],
                        backgroundColor: this.COLOR_PALETTE[14],
                        callbacks: {
                            title: (tooltipItems) => {
                                // Pokaż pełną nazwę quizu w tytule tooltipa
                                const index = tooltipItems[0].dataIndex;
                                return fullLabels[index] || '';
                            }
                        }
                    }
                },
                layout: {
                    padding: { left: 10, right: 20, top: 10, bottom: 10 }
                }
            }
        });
    }

    static computeBranchScores(quizData = [], courseData = [], branchesData = []) {
        const branches = branchesData;
        const branchInfo = branches.map(b => ({
            key: b.key,
            score: 0,
            matchedQuizzes: [],
            matchedCourses: []
        }));

        const normalize = s => String(s || '').toLowerCase().replace(/[_\-.]+/g, ' ').replace(/\s+/g, ' ').trim();
        const tokens = s => (normalize(s) || '').split(' ').filter(Boolean);

        const matchesByList = (name, list) => {
            if (!name || !Array.isArray(list) || list.length === 0) return false;
            const n = normalize(name);
            for (let item of list) {
                if (!item) continue;
                const itemNorm = normalize(item);
                if (itemNorm === n) return true;
                const itTokens = tokens(itemNorm);
                const nTokens = tokens(n);
                if (itTokens.some(t => nTokens.includes(t))) return true;
            }
            return false;
        };

        (quizData || []).forEach(q => {
            const name = normalize(q.quizName || q.name || '');
            const completed = Number(q.completed ?? 0);
            const total = Number(q.count ?? q.total ?? 0) || 1;
            const ratio = Math.max(0, Math.min(1, completed / total));
            const weight = Math.log1p(total);
            branches.forEach((b, idx) => {
                let matched = false;
                if (Array.isArray(b.quizNames) && b.quizNames.length > 0) {
                    matched = matchesByList(name, b.quizNames);
                }
                if (matched) {
                    const contribution = ratio * weight * 1.1;
                    branchInfo[idx].score += contribution;
                    branchInfo[idx].matchedQuizzes.push({ name: q.quizName || q.name || '', completed, total, ratio });
                }
            });
        });

        (courseData || []).forEach(c => {
            const name = normalize(c.courseName || c.name || c.hash || '');
            const completed = Number(c.completed ?? 0);
            const total = Number(c.total ?? c.count ?? 0) || 1;
            const ratio = Math.max(0, Math.min(1, completed / total));
            const weight = Math.log1p(total) * 1.25;
            branches.forEach((b, idx) => {
                let matched = false;
                if (Array.isArray(b.courseNames) && b.courseNames.length > 0) {
                    matched = matchesByList(name, b.courseNames);
                }
                if (matched) {
                    const contribution = ratio * weight;
                    branchInfo[idx].score += contribution;
                    branchInfo[idx].matchedCourses.push({ name: c.courseName || c.name || c.hash || '', completed, total, ratio });
                }
            });
        });

        const filtered = branchInfo.filter(b => b.score > 0);
        return { filtered, branchInfo };
    }

    static createChartRoadmap(quizData, courseData, canvasId, branchesData, coursesData) {
        // Accept either (quizData, courseData, canvasId) or (dataObject, canvasId, ...)
        if (!canvasId && quizData && quizData.canvasId) {
            canvasId = quizData.canvasId;
            courseData = quizData.courses;
            quizData = quizData.quizzes;
        }

        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === 'undefined') return;
        const ctx = canvas.getContext('2d');

        const { filtered } = this.computeBranchScores(quizData || [], courseData || [], branchesData);

        if (!filtered || filtered.length === 0) {
            const existing = Chart.getChart(canvasId);
            if (existing) existing.destroy();
            const parent = canvas.parentElement;
            if (parent) {
                parent.innerHTML = `<p class="no-data-placeholder">Brak dopasowań do branż, <br> brak sensownych danych do wykresu.</p>`;
            }
            return;
        }

        const maxRaw = Math.max(...filtered.map(b => b.score), 1);
        const scores = filtered.map(b => Math.round((b.score / maxRaw) * 100));
        const labels = filtered.map(b => b.key);
        const dataScores = scores;

        const bgColor = this.COLOR_PALETTE[7];
        const borderColor = this.COLOR_PALETTE[8];
        const pointColors = dataScores.map((v, i) => `hsla(${(i * 37) % 360},70%,45%,1)`);

        const baseH = Math.max(340, Math.min(700, labels.length * 40));
        canvas.style.width = '100%';
        canvas.style.height = `${baseH}px`;

        const existing = Chart.getChart(canvasId);
        if (existing) existing.destroy();

        new Chart(ctx, {
            type: 'radar',
            data: {
                labels,
                datasets: [{
                    label: 'Dopasowanie do branży',
                    data: dataScores,
                    backgroundColor: bgColor,
                    borderColor: borderColor,
                    borderWidth: 2,
                    pointBackgroundColor: pointColors,
                    pointRadius: 4,
                    fill: true
                }]
            },
            options: {
                color: this.COLOR_PALETTE[0],
                responsive: true,
                maintainAspectRatio: false,
                elements: { line: { tension: 0.28 } },
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: { display: false, color: this.COLOR_PALETTE[0] },
                        grid: { color: this.COLOR_PALETTE[9] },
                        pointLabels: { font: { size: 12 }, color: this.COLOR_PALETTE[0] }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: this.COLOR_PALETTE[0] }
                    },
                    tooltip: {
                        titleColor: this.COLOR_PALETTE[0],
                        bodyColor: this.COLOR_PALETTE[0],
                        backgroundColor: this.COLOR_PALETTE[14],
                        callbacks: {
                            title: items => items[0].label,
                            label: ctxItem => {
                                const idx = ctxItem.dataIndex;
                                const info = filtered[idx];
                                const parts = [];
                                if (info.matchedQuizzes && info.matchedQuizzes.length) {
                                    parts.push(`Quizy: ${info.matchedQuizzes.map(q => `${q.name} (${Math.round(q.ratio*100)}%)`).join(', ')}`);
                                }
                                if (info.matchedCourses && info.matchedCourses.length) {
                                    parts.push(`Kursy: ${info.matchedCourses.map(c => `${c.name} (${Math.round(c.ratio*100)}%)`).join(', ')}`);
                                }
                                if (parts.length === 0) parts.push('Brak dopasowanych pozycji');
                                return [`Dopasowanie: ${dataScores[idx]}%`, ...parts];
                            }
                        }
                    }
                },
                layout: { padding: 8 }
            }
        });
    }



    static createCoursesCompletionChart(data, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        // Filter out courses with no completions
        const filteredData = (data || []).filter(entry => Number(entry.completed) > 0);

        // Destroy existing
        const existing = Chart.getChart(canvasId);
        if (existing) existing.destroy();

        if (filteredData.length === 0) {
            const parent = canvas.parentElement;
            parent.querySelectorAll('.no-data-placeholder').forEach(el => el.remove());
            
            canvas.style.display = 'none';
            const placeholder = document.createElement('div');
            placeholder.className = 'no-data-placeholder';
           
            const p = document.createElement('p');
            p.textContent = "Rozpocznij kurs, aby śledzić postępy tutaj.";
            placeholder.appendChild(p);
            const placeholderBtn = UIFacade.createButton("Zobacz kursy", "primary", "button", () => {
                document.getElementById("nav-courses").click();
            });
            placeholder.appendChild(placeholderBtn);


            parent.appendChild(placeholder);
             const btn = placeholder.querySelector('button');
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.history.pushState(null, '', '/dashboard/courses');
                window.dispatchEvent(new Event('popstate'));
            });
            return;
        }

        // Use filteredData
        data = filteredData;

        canvas.style.display = 'block';
        const parent = canvas.parentElement;
        parent.querySelectorAll('.no-data-placeholder').forEach(el => el.remove());

        const ctx = canvas.getContext('2d');

        // Raw labels and percentage calculation
        const labels = data.map(entry => entry.courseName || entry.name || entry.hash || 'Unknown');
        const percents = data.map(entry => {
            const total = Number(entry.total ?? entry.count ?? 0);
            const completed = Number(entry.completed ?? 0);
            return total > 0 ? +((completed / total) * 100).toFixed(1) : 0;
        });

        // Truncate long labels for legibility on the axis, keep full label for tooltips
        const maxLabelLen = 40;
        const displayLabels = labels.map(l => (l.length > maxLabelLen ? l.slice(0, maxLabelLen) + '…' : l));

        // Compute canvas height proportional to number of courses, but cap to keep page usable.
        const perItem = 40; // px per row
        const minH = 200;
        const maxH = 900; // if more courses, parent will scroll
        let computedHeight = Math.max(minH, Math.min(maxH, labels.length * perItem));
        canvas.style.width = '100%';
        canvas.style.height = `${computedHeight}px`;

        // Make parent scrollable if there are too many items
        if (parent) {
            parent.style.maxHeight = `${maxH}px`;
            parent.style.overflowY = labels.length * perItem > maxH ? 'auto' : 'visible';
            parent.style.paddingRight = '8px'; // avoid clipping scrollbar over canvas
        }

        // Colors for bars
        const colors = labels.map((_, i) => `hsla(${(i * 37) % 360}, 65%, 55%, 0.75)`);
        const borders = labels.map((_, i) => `hsla(${(i * 37) % 360}, 65%, 40%, 1)`);

        // Horizontal bar chart (better for many items)
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: displayLabels,
                datasets: [{
                    label: 'Procent ukończenia kursu (%)',
                    data: percents,
                    backgroundColor: colors,
                    borderColor: borders,
                    borderWidth: 1,
                    barThickness: Math.min(32, perItem - 8)
                }]
            },
            options: {
                color: this.COLOR_PALETTE[0],
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: value => `${value}%`,
                            precision: 0,
                            color: this.COLOR_PALETTE[0]
                        },
                        grid: { display: true, color: this.COLOR_PALETTE[4] }
                    },
                    y: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                            color: this.COLOR_PALETTE[0]
                        },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: { color: this.COLOR_PALETTE[0] }
                    },
                    tooltip: {
                        titleColor: this.COLOR_PALETTE[0],
                        bodyColor: this.COLOR_PALETTE[0],
                        backgroundColor: this.COLOR_PALETTE[14],
                        callbacks: {
                            // show full course name in tooltip title
                            title: items => {
                                const idx = items[0].dataIndex;
                                return labels[idx] || '';
                            },
                            // show numeric breakdown in tooltip body
                            label: ctxItem => {
                                const idx = ctxItem.dataIndex;
                                const entry = data[idx] || {};
                                const total = Number(entry.total ?? entry.count ?? 0);
                                const completed = Number(entry.completed ?? 0);
                                const pct = percents[idx];
                                return `${pct}% — ${completed}/${total} modułów`;
                            }
                        }
                    }
                },
                layout: {
                    padding: { top: 8, right: 8, bottom: 8, left: 8 }
                }
            }
        });
    }


static tasksChartCompletionStatusByStudent(canvasId = "tasksStatusChart", tasks = []) {
    try {
        const canvas = document.getElementById(canvasId);
        if (!canvas || typeof Chart === 'undefined') return;
        const ctx = canvas.getContext('2d');

        const normalize = s => String(s || '').trim();
        const isCompleted = item => {
            if (!item) return false;
            if (typeof item.completed === 'number') return item.completed > 0;
            if (typeof item.completed === 'string') {
                const n = Number(item.completed);
                if (!Number.isNaN(n)) return n > 0;
                if (/^(1|true|yes|done|completed|finished|passed)$/i.test(item.completed)) return true;
            }
            if (typeof item.status === 'number') return item.status > 0;
            if (typeof item.status === 'string') {
                const ns = item.status.trim();
                const n = Number(ns);
                if (!Number.isNaN(n)) return n > 0;
                return /^(1|true|yes|done|completed|finished|passed|ok)$/i.test(ns);
            }
            if (typeof item.done === 'boolean') return item.done;
            if (typeof item.progress === 'number') return item.progress > 0;
            return false;
        };

        const getGroup = item => {
            return normalize(item.subject) ||
                   normalize(item.branch) ||
                   normalize(item.topic) ||
                   normalize(item.group) ||
                   normalize(item.courseName) ||
                   normalize(item.name) ||
                   'Nieznane';
        };

        // Agregacja bezpośrednio po tasks
        const map = new Map();
        tasks.forEach(it => {
            const group = getGroup(it);
            const total = ('total' in it) ? (Number(it.total) || 1) : 1;
            const treatedTotal = Math.max(1, total);
            const done = isCompleted(it) ? 1 : 0;

            const entry = map.get(group) || { group, totalCount: 0, completedCount: 0, items: [] };
            entry.totalCount += treatedTotal;
            entry.completedCount += done;
            entry.items.push(it);
            map.set(group, entry);
        });

        const aggregated = Array.from(map.values());
        if (aggregated.length === 0) {
            const existing = Chart.getChart(canvasId);
            if (existing) existing.destroy();
            const parent = canvas.parentElement;
            if (parent) {
                parent.innerHTML = `<p class="no-data-placeholder">Brak danych o aktywnych zadaniach.</p>`;
            }
            return;
        }

        aggregated.sort((a, b) => (b.completedCount / b.totalCount) - (a.completedCount / a.totalCount));

        const labels = aggregated.map(a => a.group);
        const completedData = aggregated.map(a => +( (a.totalCount > 0) ? ((a.completedCount / a.totalCount) * 100).toFixed(1) : 0 ));
        const remainingData = completedData.map(v => +( (100 - v).toFixed(1) ));

        // Dynamiczna wysokość
        const perItem = 38;
        const minH = 160;
        const maxH = 900;
        const computedH = Math.max(minH, Math.min(maxH, labels.length * perItem));
        canvas.style.width = '100%';
        canvas.style.height = `${computedH}px`;

        const parent = canvas.parentElement;
        if (parent) {
            parent.style.maxHeight = `${maxH}px`;
            parent.style.overflowY = labels.length * perItem > maxH ? 'auto' : 'visible';
            parent.style.paddingRight = '8px';
        }

        const existing = Chart.getChart(canvasId);
        if (existing) existing.destroy();

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Ukończone (%)',
                        data: completedData,
                        backgroundColor: this.COLOR_PALETTE[10],
                        borderColor: this.COLOR_PALETTE[11],
                        borderWidth: 1
                    },
                    {
                        label: 'Pozostałe (%)',
                        data: remainingData,
                        backgroundColor: this.COLOR_PALETTE[12],
                        borderColor: this.COLOR_PALETTE[13],
                        borderWidth: 1
                    }
                ]
            },
            options: {
                color: this.COLOR_PALETTE[0],
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: v => `${v}%`, color: this.COLOR_PALETTE[0], precision: 0 },
                        grid: { color: this.COLOR_PALETTE[4] }
                    },
                    y: {
                        stacked: true,
                        ticks: { color: this.COLOR_PALETTE[0], autoSkip: false },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: this.COLOR_PALETTE[0] }
                    },
                    tooltip: {
                        titleColor: this.COLOR_PALETTE[0],
                        bodyColor: this.COLOR_PALETTE[0],
                        backgroundColor: this.COLOR_PALETTE[14] ,
                        callbacks: {
                            title: items => items[0].label || '',
                            label: ctxItem => {
                                const idx = ctxItem.dataIndex;
                                const ag = aggregated[idx] || {};
                                const pct = ctxItem.datasetIndex === 0 ? completedData[idx] : remainingData[idx];
                                return `${ctxItem.dataset.label}: ${pct}% — ${ag.completedCount}/${ag.totalCount}`;
                            }
                        }
                    }
                },
                layout: { padding: 8 },
                elements: {
                    bar: { borderRadius: 6 }
                }
            }
        });
    } catch (e) {
        // fail silently
    }
}

}
