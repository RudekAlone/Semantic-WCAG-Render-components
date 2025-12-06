import { UIFacade } from "../UIFacade.js";
import { DataService } from "../Service/DataService.js";
import { MONTH_NAMES_PL } from "./constants.js";

export class StatisticsPage {
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
            
            const loginCanvas = document.createElement("canvas");
            loginCanvas.id = "loginStatisticsChart";
            loginStatsSection.appendChild(loginCanvas);
            container.appendChild(loginStatsSection);
    
            setTimeout(() => {
                this.createLoginChart(loginStats, "loginStatisticsChart");
            }, 0);
    
            const tasksStatusSection = document.createElement("section");
            tasksStatusSection.id = "tasks-statistics-section";
            const tasksCanvas = document.createElement("canvas");
            tasksCanvas.id = "tasksStatusChart";
            tasksStatusSection.appendChild(tasksCanvas);
            container.appendChild(tasksStatusSection);
            setTimeout(() => {
                this.tasksChartCompletionStatusByStudent("tasksStatusChart", tasks);
            }, 0);
    
            const roadmapSection = document.createElement("section");
            roadmapSection.id = "roadmap-statistics-section";
            const roadmapCanvas = document.createElement("canvas");
            roadmapCanvas.id = "roadmapChart";
            roadmapSection.appendChild(roadmapCanvas);
            container.appendChild(roadmapSection);
            setTimeout(() => {
                this.createChartRoadmap(
                    { quizzes: quizStats, courses: courseStats, canvasId: "roadmapChart" },
                    null,
                    null,
                    branches,
                    coursesData
                );
            }, 0);
    
            const quizStatsSection = document.createElement("section");
            quizStatsSection.id = "quiz-statistics-section";
            const quizCanvas = document.createElement("canvas");
            quizCanvas.id = "quizCompletionChart";
            quizStatsSection.appendChild(quizCanvas);
            container.appendChild(quizStatsSection);
            setTimeout(() => {
                this.createQuizCompletionChart(quizStats, "quizCompletionChart");
            }, 0);
    
            const coursesStatsSection = document.createElement("section");
            coursesStatsSection.id = "courses-statistics-section";
            const coursesCanvas = document.createElement("canvas");
            coursesCanvas.id = "coursesCompletionChart";
            coursesStatsSection.appendChild(coursesCanvas);
            container.appendChild(coursesStatsSection);
            setTimeout(() => {
                this.createCoursesCompletionChart(courseStats, "coursesCompletionChart");
            }, 0);

        } catch (error) {
            console.error("Błąd pobierania szczegółów statystyk:", error);
            container.innerHTML = '<p class="error">Błąd pobierania szczegółowych danych.</p>';
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
        const ctx = canvas.getContext('2d');

        // Prepare readable month-year labels (safe parsing)
        const labels = data.map(entry => {
            const [year = '', month = ''] = (entry.date || '').split('-');
            const monthIndex = Math.max(0, Math.min(11, parseInt(month, 10) - 1 || 0));
            return `${MONTH_NAMES_PL[monthIndex] ?? ''} ${year}`.trim();
        });

        // Dynamic canvas height so chart remains readable on different datasets/sizes
        const perItemHeight = 36;
        const padding = 40;
        const minHeight = 160;
        const maxHeight = 600;
        const computedHeight = Math.max(minHeight, Math.min(maxHeight, labels.length * perItemHeight + padding));
        canvas.style.width = '100%';
        canvas.style.height = `${computedHeight}px`;

        // Destroy any existing chart instance on this canvas (Chart.js v3+)
        const existing = Chart.getChart(canvasId);
        if (existing) existing.destroy();

        // Create subtle gradient for fill to improve readability
        const gradient = ctx.createLinearGradient(0, 0, 0, computedHeight);
        gradient.addColorStop(0, 'rgba(75,192,192,0.35)');
        gradient.addColorStop(1, 'rgba(75,192,192,0.04)');

        const loginCounts = data.map(entry => entry.logins);

        new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Liczba logowań',
                    data: loginCounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.25,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                }]
            },
            options: {
                // default text color for Chart.js v3+; ensures most text is #ebebeb
                color: '#ebebeb',
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
                            color: '#ebebeb'
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        titleColor: '#ebebeb',
                        bodyColor: '#ebebeb'
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            autoSkip: true,
                            maxRotation: 45,
                            minRotation: 0,
                            color: '#ebebeb'
                        },
                        grid: { display: false, color: 'rgba(235,235,235,0.06)' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { precision: 0, color: '#ebebeb' },
                        grid: { color: 'rgba(235,235,235,0.06)' }
                    }
                }
            }
        });
    }


    static createQuizCompletionChart(data, canvasId) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const labels = data.map(entry => entry.quizName);
        const completedCounts = data.map(entry => entry.completed);
        const totalCounts = data.map(entry => entry.count);

        // dynamic height: approx 38px per item (11 -> ~418px), with min/max caps
        const perItemHeight = 38;
        const padding = 20;
        const minHeight = 150;
        const maxHeight = 1200;
        const computedHeight = Math.max(minHeight, Math.min(maxHeight, labels.length * perItemHeight + padding));

        canvas.style.height = `${computedHeight}px`;
        canvas.style.width = '100%';

        // destroy existing chart on this canvas (Chart.js v3+)
        const existing = Chart.getChart(canvasId);
        if (existing) existing.destroy();

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Ilość trzykrotnie pod rząd udzielonych poprawnie odpowiedzi',
                        data: completedCounts,
                        backgroundColor: 'rgba(148, 54, 235, 0.7)'
                    },
                    {
                        label: 'Ilość wszystkich pytań',
                        data: totalCounts,
                        backgroundColor: 'rgba(255, 206, 86, 0.7)'
                    }
                ]
            },
            options: {
                // default text color for all chart text
                color: '#ebebeb',
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                elements: {
                    bar: {
                        borderRadius: 4,
                        borderSkipped: false,
                        maxBarThickness: 40
                    }
                },
                scales: {
                    x: {
                        beginAtZero: true,
                        ticks: {
                            precision: 0,
                            color: '#ebebeb'
                        },
                        grid: {
                            color: 'rgba(235,235,235,0.06)'
                        }
                    },
                    y: {
                        ticks: {
                            autoSkip: false,
                            color: '#ebebeb'
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            color: '#ebebeb'
                        }
                    },
                    tooltip: {
                        titleColor: '#ebebeb',
                        bodyColor: '#ebebeb'
                    }
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
                parent.innerHTML = '<p class="no-data" style="color:#ebebeb;margin:8px 0;">Brak dopasowań do branż — brak sensownych danych do wykresu.</p>';
            }
            return;
        }

        const maxRaw = Math.max(...filtered.map(b => b.score), 1);
        const scores = filtered.map(b => Math.round((b.score / maxRaw) * 100));
        const labels = filtered.map(b => b.key);
        const dataScores = scores;

        const bgColor = 'rgba(54,162,235,0.22)';
        const borderColor = 'rgba(54,162,235,0.9)';
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
                color: '#ebebeb',
                responsive: true,
                maintainAspectRatio: false,
                elements: { line: { tension: 0.28 } },
                scales: {
                    r: {
                        beginAtZero: true,
                        min: 0,
                        max: 100,
                        ticks: { display: false, color: '#ebebeb' },
                        grid: { color: 'rgba(160, 160, 160, 0.15)' },
                        pointLabels: { font: { size: 12 }, color: '#ebebeb' }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#ebebeb' }
                    },
                    tooltip: {
                        titleColor: '#ebebeb',
                        bodyColor: '#ebebeb',
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
        const parent = canvas.parentElement;
        if (parent) {
            parent.style.maxHeight = `${maxH}px`;
            parent.style.overflowY = labels.length * perItem > maxH ? 'auto' : 'visible';
            parent.style.paddingRight = '8px'; // avoid clipping scrollbar over canvas
        }

        // Destroy existing chart instance
        const existing = Chart.getChart(canvasId);
        if (existing) existing.destroy();

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
                // ensure all chart text is #ebebeb
                color: '#ebebeb',
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
                            color: '#ebebeb'
                        },
                        grid: { display: true, color: 'rgba(235,235,235,0.06)' }
                    },
                    y: {
                        ticks: {
                            autoSkip: false,
                            maxRotation: 0,
                            minRotation: 0,
                            color: '#ebebeb'
                        },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        display: false,
                        labels: { color: '#ebebeb' }
                    },
                    tooltip: {
                        titleColor: '#ebebeb',
                        bodyColor: '#ebebeb',
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
                parent.innerHTML = '<p class="no-data" style="color:#ebebeb;margin:8px 0;">Brak danych zadań do wyświetlenia.</p>';
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
                        backgroundColor: 'rgba(76,175,80,0.85)',
                        borderColor: 'rgba(56,142,60,1)',
                        borderWidth: 1
                    },
                    {
                        label: 'Pozostałe (%)',
                        data: remainingData,
                        backgroundColor: 'rgba(220,53,69,0.28)',
                        borderColor: 'rgba(220,53,69,0.9)',
                        borderWidth: 1
                    }
                ]
            },
            options: {
                color: '#ebebeb',
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        stacked: true,
                        beginAtZero: true,
                        max: 100,
                        ticks: { callback: v => `${v}%`, color: '#ebebeb', precision: 0 },
                        grid: { color: 'rgba(235,235,235,0.06)' }
                    },
                    y: {
                        stacked: true,
                        ticks: { color: '#ebebeb', autoSkip: false },
                        grid: { display: false }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: { color: '#ebebeb' }
                    },
                    tooltip: {
                        titleColor: '#ebebeb',
                        bodyColor: '#ebebeb',
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
