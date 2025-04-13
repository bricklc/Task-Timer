// DOM Elements Constants
const app = document.getElementById('app');
const bodyEl = document.body; // Added body element reference
const header = document.querySelector('header');
const currentTimeEl = document.getElementById('current-time');
const headerCreditsEl = document.getElementById('header-total-credits');
const optionsBtn = document.getElementById('options-btn');
const optionsMenu = document.getElementById('options-menu');
const clearAllBtn = document.getElementById('clear-all-data');
const clearSelectedBtn = document.getElementById('clear-selected-data');
const deleteSelectedBtn = document.getElementById('delete-selected');
const exportBtn = document.getElementById('export-data');
const importBtn = document.getElementById('import-data');
const importFileEl = document.getElementById('import-file');
const manualAddFinishedBtn = document.getElementById('manual-add-finished-task');
const creditResetSelect = document.getElementById('credit-reset-select');
const dailyDecayGroup = document.getElementById('daily-decay-group');
const dailyDecayInput = document.getElementById('daily-decay-input');

const tabNavigation = document.getElementById('tab-navigation');
const tabContent = document.getElementById('tab-content');
const currentTasksPanel = document.getElementById('current-tasks-panel');
const finishedTasksPanel = document.getElementById('finished-tasks-panel');
const scheduleTasksPanel = document.getElementById('schedule-tasks-panel'); // New
const scheduleGraphContainer = document.getElementById('schedule-graph-container'); // New
const currentTasksContainer = document.getElementById('current-tasks-container');
const finishedListContainer = document.getElementById('finished-list-container');
const endTimeEl = document.getElementById('end-time');
const totalFinishedTimeEl = document.getElementById('total-finished-time');

const motivationSection = document.getElementById('motivation');
const quoteTextEl = document.getElementById('quote-text');
const quoteAuthorEl = document.getElementById('quote-author');
const prevQuoteBtn = document.getElementById('prev-quote');
const nextQuoteBtn = document.getElementById('next-quote');

const addTaskBtn = document.getElementById('add-task-btn');
const addTaskFormModal = document.getElementById('add-task-form');
const cancelAddTaskBtn = document.getElementById('cancel-add');
const addTaskForm = addTaskFormModal.querySelector('form');
const taskTypeSelect = document.getElementById('task-type');
const taskNameInput = document.getElementById('task-name');
const taskSubjectGroup = document.getElementById('subject-group');
const taskSubjectSelect = document.getElementById('task-subject-select');
const taskNewSubjectGroup = document.getElementById('new-subject-group');
const taskNewSubjectInput = document.getElementById('task-subject-input');
const addSubjectBtn = document.getElementById('add-subject-btn');
const cancelAddSubjectBtn = document.getElementById('cancel-add-subject-btn');
const studyModeGroup = document.getElementById('study-mode-group');
const studyModeSelect = document.getElementById('mode');
const durationGroup = document.getElementById('duration-group');
const durationInput = document.getElementById('duration');
const rewardRequiredGroup = document.getElementById('reward-required-time-group');
const rewardRequiredInput = document.getElementById('required-time-hms');
const dueDateGroup = document.getElementById('due-date-group'); // New
const setDueDateCheckbox = document.getElementById('set-due-date-checkbox'); // New
const dueDatePickerContainer = document.getElementById('due-date-picker-container'); // New
const taskDueDateInput = document.getElementById('task-due-date'); // New

const manualFinishedFormModal = document.getElementById('manual-finished-task-form');
const cancelManualFinishedBtn = document.getElementById('cancel-finished-add');
const manualFinishedForm = manualFinishedFormModal.querySelector('form');
const manualFinishedNameInput = document.getElementById('finished-task-name');
const manualFinishedTimeInput = document.getElementById('finished-task-time');
const manualFinishedSubjectSelect = document.getElementById('manual-finished-subject-select');

const changeSubjectModal = document.getElementById('change-subject-modal');
const changeSubjectTaskNameEl = document.getElementById('change-subject-task-name');
const editSubjectSelect = document.getElementById('edit-subject-select');
const saveSubjectChangeBtn = document.getElementById('save-subject-change-btn');
const cancelSubjectChangeBtn = document.getElementById('cancel-subject-change-btn');
let taskToChangeSubject = null; // Store task ID temporarily

const notificationModal = document.getElementById('notification-modal');
const notificationMessageEl = document.getElementById('notification-message');
const notificationButtonsEl = document.getElementById('notification-buttons');

const taskMenu = document.getElementById('task-menu');
const deleteTaskBtn = document.getElementById('delete-task-btn');
const moveTaskBtn = document.getElementById('move-task-btn');
const changeSubjectMenuBtn = document.getElementById('change-subject-btn');

const taskCompleteSound = document.getElementById('task-complete-sound');

const toggleDarkModeBtn = document.getElementById('toggle-dark-mode'); // Added dark mode toggle button

// --- Motivational Quotes Data (Replaces quotes.json) ---
const inlineMotivationalQuotes = [
    { text: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "Focus on progress, not perfection.", author: "Unknown" },
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "Your limitation—it's only your imagination.", author: "Unknown" },
    { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
    { text: "Great things never come from comfort zones.", author: "Unknown" }
];

// --- State Variables ---
let currentTasks = []; // Study tasks
let exerciseTasks = []; // Exercise tasks
let rewardTasks = []; // Reward tasks
let finishedTasks = []; // All finished tasks (Study, Exercise)
let availableSubjects = ["Work", "Personal", "Learning"]; // Default subjects
let totalCredits = 0; // In seconds
let activeTask = null; // The currently running/paused task object
let timerInterval = null;
let selectionMode = false;
let draggableTaskId = null; // ID of the task being dragged
let activeTabId = 'tab-current'; // Default active tab
let quotes = []; // Will be populated from inlineMotivationalQuotes
let currentQuoteIndex = 0;
let collapsedSubjects = {}; // Key: normalized subject, Value: boolean (true if collapsed) for Finished tab
let collapsedCurrentSubjects = {}; // Key: normalized subject, Value: boolean (true if collapsed) for Current tab
let creditManagementOption = 'none'; // 'none', 'reset', 'decay'
let dailyDecayPercent = 10;
let lastCreditCheckDate = null;
let darkModeEnabled = false; // Added dark mode state

// --- Telegram Bot Configuration (Keep constants) ---
const botToken = "8151598635:AAHvVVSbTqsyl5mX3OY1tosg3960SKm3V4Q"; // Replace with your Bot Token if using
const chatId = "-4713749658"; // Replace with your Chat ID if using

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    applyTheme(); // Apply theme early
    loadQuotes();
    displayMotivation();
    populateSubjectDropdowns();
    updateCurrentTime();
    performDailyCreditCheck(); // Perform check on load
    switchTab(activeTabId); // Render the initially active tab
    setupEventListeners();
    setInterval(() => {
        updateCurrentTime();
        calculateEndTime(); // Update end time periodically
    }, 1000); // Update time every second
});

// --- Theme Management ---
function applyTheme() {
    if (darkModeEnabled) {
        bodyEl.classList.add('dark-mode');
        toggleDarkModeBtn.textContent = 'Switch to Light Mode'; // Update button text
    } else {
        bodyEl.classList.remove('dark-mode');
        toggleDarkModeBtn.textContent = 'Switch to Dark Mode'; // Update button text
    }
}

function toggleTheme() {
    darkModeEnabled = !darkModeEnabled;
    applyTheme();
    saveState(); // Save the new theme preference
    hideOptionsMenu(); // Close menu after toggling
}

// --- State Management (Save/Load/Export/Import) ---
function saveState() {
    const state = {
        currentTasks,
        exerciseTasks,
        rewardTasks,
        finishedTasks,
        availableSubjects,
        totalCredits,
        activeTabId,
        collapsedSubjects,
        collapsedCurrentSubjects,
        creditManagementOption,
        dailyDecayPercent,
        lastCreditCheckDate,
        darkModeEnabled, // Save dark mode state
        // Note: dueDate is saved within each task object
    };
    localStorage.setItem('studyFocusState', JSON.stringify(state));
}

function loadState() {
    const savedState = localStorage.getItem('studyFocusState');
    if (savedState) {
        try {
            const state = JSON.parse(savedState);
            currentTasks = state.currentTasks || [];
            exerciseTasks = state.exerciseTasks || [];
            rewardTasks = state.rewardTasks || [];
            finishedTasks = state.finishedTasks || [];
            availableSubjects = state.availableSubjects || ["Work", "Personal", "Learning"];
            totalCredits = state.totalCredits || 0;
            activeTabId = state.activeTabId || 'tab-current';
            collapsedSubjects = state.collapsedSubjects || {};
            collapsedCurrentSubjects = state.collapsedCurrentSubjects || {};
            creditManagementOption = state.creditManagementOption || 'none';
            dailyDecayPercent = state.dailyDecayPercent || 10;
            lastCreditCheckDate = state.lastCreditCheckDate || null;
            darkModeEnabled = state.darkModeEnabled || false; // Load dark mode state (default to false)

            // Ensure tasks have unique IDs and dueDate (default to null)
            [...currentTasks, ...exerciseTasks, ...rewardTasks, ...finishedTasks].forEach(task => {
                if (!task.id) task.id = generateId();
                if (task.dueDate === undefined) task.dueDate = null; // Add default dueDate if missing
            });

        } catch (error) {
            console.error("Error loading state from localStorage:", error);
            sendTelegramError("Error loading state", error);
            // Reset to defaults on error?
            darkModeEnabled = false;
        }
    } else {
         // Set default dark mode based on system preference if no saved state
         darkModeEnabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    // Update UI based on loaded state
    creditResetSelect.value = creditManagementOption;
    dailyDecayInput.value = dailyDecayPercent;
    dailyDecayGroup.style.display = creditManagementOption === 'decay' ? 'block' : 'none';
    // Theme is applied in DOMContentLoaded after loadState runs
}

function exportData() {
    const data = {
        version: 4, // Increment version for dark mode addition (optional but good practice)
        currentTasks,
        exerciseTasks,
        rewardTasks,
        finishedTasks,
        availableSubjects,
        totalCredits,
        activeTabId,
        collapsedSubjects,
        collapsedCurrentSubjects,
        creditManagementOption,
        dailyDecayPercent,
        lastCreditCheckDate,
        darkModeEnabled, // Include dark mode in export
        // Note: Not exporting activeTask or timerInterval
    };
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    a.download = `study_focus_data_v4_${timestamp}.json`; // Update version in filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    hideOptionsMenu();
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            // Basic validation (check for key properties, allow V2, V3 or V4)
             if ((data.version >= 2 && data.version <= 4) && data.currentTasks && data.exerciseTasks && data.rewardTasks && data.finishedTasks && data.availableSubjects && data.totalCredits !== undefined) {
                // Clear existing interval if importing over an active task
                if (timerInterval) clearInterval(timerInterval);
                activeTask = null;

                currentTasks = data.currentTasks;
                exerciseTasks = data.exerciseTasks;
                rewardTasks = data.rewardTasks;
                finishedTasks = data.finishedTasks;
                availableSubjects = data.availableSubjects;
                totalCredits = data.totalCredits;
                activeTabId = data.activeTabId || 'tab-current';
                collapsedSubjects = data.collapsedSubjects || {};
                collapsedCurrentSubjects = data.collapsedCurrentSubjects || {};
                creditManagementOption = data.creditManagementOption || 'none';
                dailyDecayPercent = data.dailyDecayPercent || 10;
                lastCreditCheckDate = data.lastCreditCheckDate || null; // Load last check date
                darkModeEnabled = data.darkModeEnabled || false; // Load dark mode from V4, default false otherwise

                 // Ensure tasks have unique IDs and dueDate (default to null for V2/V3 imports)
                 [...currentTasks, ...exerciseTasks, ...rewardTasks, ...finishedTasks].forEach(task => {
                    if (!task.id) task.id = generateId();
                    if (task.dueDate === undefined) task.dueDate = null; // Add default dueDate if missing
                 });

                saveState(); // Save the newly imported state
                applyTheme(); // Apply the imported theme
                populateSubjectDropdowns(); // Update dropdowns with imported subjects
                switchTab(activeTabId); // Render the correct tab
                updateCreditWallet(); // Update header credits
                updateCreditOptionsUI(); // Update options menu UI
                showNotification("Data imported successfully!");
            } else {
                showNotification("Import failed: Invalid or outdated data format.", { error: true });
            }
        } catch (error) {
            console.error("Error parsing JSON file:", error);
            showNotification("Import failed: Error parsing the file.", { error: true });
            sendTelegramError("Error parsing import file", error);
        } finally {
            hideOptionsMenu();
        }
    };
    reader.onerror = () => {
        showNotification("Import failed: Could not read the file.", { error: true });
        hideOptionsMenu();
    }
    reader.readAsText(file);
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

// --- Time & Formatting ---
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function formatTimeHMS(seconds) {
    if (isNaN(seconds) || seconds < 0) seconds = 0;
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function parseTimeHMS(timeStr) {
    if (!timeStr || typeof timeStr !== 'string') return 0;
    const parts = timeStr.split(':');
    let hours = 0, minutes = 0, seconds = 0;
    if (parts.length === 3) {
        hours = parseInt(parts[0], 10) || 0;
        minutes = parseInt(parts[1], 10) || 0;
        seconds = parseInt(parts[2], 10) || 0;
    } else if (parts.length === 2) {
        minutes = parseInt(parts[0], 10) || 0;
        seconds = parseInt(parts[1], 10) || 0;
    } else if (parts.length === 1) {
        seconds = parseInt(parts[0], 10) || 0;
    }
    return Math.max(0, hours * 3600 + minutes * 60 + seconds); // Ensure non-negative
}

function formatDateTime(date) {
    if (!(date instanceof Date)) date = new Date(date); // Handle potential string dates
    if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid date strings
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
}

// Formats YYYY-MM-DD date string to a user-friendly format (e.g., "Mon, Oct 26")
function formatShortDate(dateStr) {
    if (!dateStr) return '';
    try {
        // Add time part to avoid timezone issues where new Date('YYYY-MM-DD') might become previous day
        const date = new Date(dateStr + 'T12:00:00');
        if (isNaN(date.getTime())) return 'Invalid Date';
        // Use browser's default locale and standard options
        return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
    } catch (e) {
        console.error("Error formatting date:", dateStr, e);
        return 'Invalid Date';
    }
}

// Gets YYYY-MM-DD string from a Date object
function getDateString(date) {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
        console.warn("Invalid date passed to getDateString:", date);
        return null; // Return null or throw an error
    }
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}


function updateCurrentTime() {
    currentTimeEl.textContent = formatDateTime(new Date());
}

function calculateEndTime() {
    const now = new Date();
    let totalRemainingSeconds = 0;

    // Combine all active task lists for calculation
    const allActiveTasks = [...currentTasks, ...exerciseTasks, ...rewardTasks];

    allActiveTasks.forEach(task => {
        // Only consider tasks that are not finished or paused
        if (task.state === 'running' || task.state === 'not started') {
            if (task.state === 'running') {
                // Use remaining time if running (applies to timer/reward, exercise just counts up)
                 if (task.mode === 'timer' || task.type === 'reward') {
                    totalRemainingSeconds += task.remainingTime || 0;
                }
                // Don't add anything for running 'stopwatch' or 'exercise' as they don't have a defined end yet
            } else if (task.state === 'not started') {
                 // Only add duration for timer-based or fixed duration tasks that haven't started
                 if (task.mode === 'timer' || task.type === 'exercise' || task.type === 'reward') {
                    totalRemainingSeconds += task.duration || 0;
                }
                // Stopwatch tasks don't contribute predictable time until started
            }
        }
    });


    if (totalRemainingSeconds > 0) {
        const endTime = new Date(now.getTime() + totalRemainingSeconds * 1000);
        endTimeEl.textContent = `Est. End: ${formatDateTime(endTime)}`;
    } else {
        // Clear if no pending predictable time or only stopwatch tasks remain
        endTimeEl.textContent = '';
    }
}

// --- UI Rendering ---

function renderTasks() {
    // Determine which render function to call based on active tab
    if (activeTabId === 'tab-current') {
        renderCurrentTasks();
    } else if (activeTabId === 'tab-finished') {
        renderFinishedTasks();
    } else if (activeTabId === 'tab-schedule') {
        renderScheduleGraph(); // New
    } else {
        // Handle other tabs (Exercise, Reward if they get their own views later)
        // Currently they are shown within 'current'
        if (activeTabId === 'tab-exercise' || activeTabId === 'tab-reward') {
             // Maybe render a message or eventually filter 'current' view?
             // For now, let's ensure current tasks are rendered if these tabs are selected
             // This might feel weird if the user expects a filtered view.
             // A better approach would be to filter inside renderCurrentTasks based on activeTabId
             // or keep these tabs simple informational panels. Let's stick to simple info panels.
             // So, no specific render call here for Exercise/Reward panels.
        }
    }
    updateCreditWallet();
    calculateEndTime(); // Recalculate end time after any render
}

function groupTasksBySubject(tasks) {
    return tasks.reduce((groups, task) => {
        const subjectKey = task.subject || "Uncategorized"; // Use original case for display
        const normalizedSubject = normalizeSubject(subjectKey); // Use normalized for grouping/ID
        if (!groups[normalizedSubject]) {
            // Store both original case and task list
            groups[normalizedSubject] = { displayName: subjectKey, tasks: [] };
        }
        groups[normalizedSubject].tasks.push(task);
        return groups;
    }, {});
}

function createSubjectGroupElement(subjectKey, tasks, isCurrentTab) {
    const normalizedSubject = normalizeSubject(subjectKey); // Use normalized for state keys and data attributes
    const isCollapsed = isCurrentTab
        ? collapsedCurrentSubjects[normalizedSubject] === true
        : collapsedSubjects[normalizedSubject] === true;

    const groupDiv = document.createElement('div');
    groupDiv.className = `subject-group ${isCollapsed ? 'collapsed' : ''}`;
    groupDiv.dataset.subject = normalizedSubject; // Store normalized subject

    const headerDiv = document.createElement('div');
    headerDiv.className = 'subject-header';
    // Display the original casing in the header
    headerDiv.innerHTML = `
        <h3>${escapeHtml(subjectKey)}</h3>
        <button class="toggle-subject-list" aria-label="${isCollapsed ? 'Expand' : 'Collapse'} ${escapeHtml(subjectKey)} tasks" title="${isCollapsed ? 'Expand' : 'Collapse'}"></button>
    `;
    // Use normalized subject for the event handler
    headerDiv.addEventListener('click', () => handleCollapseToggle(normalizedSubject, isCurrentTab)); // Pass normalized key

    const ul = document.createElement('ul');
    ul.className = 'subject-tasks-list';
    // Add drag/drop listeners to the UL only for the 'current' tab
    if (isCurrentTab) {
        addDragDropListeners(ul, 'current');
    } // No drag/drop needed in 'finished' list

    tasks.forEach(task => {
        // Pass 'current' or 'finished' context to createListItemElement
        const li = createListItemElement(task, isCurrentTab ? 'current' : 'finished');
        ul.appendChild(li);
    });

    groupDiv.appendChild(headerDiv);
    groupDiv.appendChild(ul);
    return groupDiv;
}


function renderCurrentTasks() {
    currentTasksContainer.innerHTML = ''; // Clear previous content

    // Combine all active task types
    const allCurrentDisplayTasks = [
        ...currentTasks.map(t => ({ ...t, type: 'study' })),
        ...exerciseTasks.map(t => ({ ...t, type: 'exercise' })),
        ...rewardTasks.map(t => ({ ...t, type: 'reward' }))
    ];

    // Filter out finished tasks
    const activeDisplayTasks = allCurrentDisplayTasks.filter(task => task.state !== 'finished');

    if (activeDisplayTasks.length === 0) {
        currentTasksContainer.innerHTML = '<p class="empty-list-message">No current tasks. Add one using the "+" button!</p>';
        endTimeEl.textContent = '';
        return;
    }

    const groupedTasks = groupTasksBySubject(activeDisplayTasks);

    // Render Uncategorized first, then others alphabetically by display name
    if (groupedTasks["uncategorized"]) {
        const groupEl = createSubjectGroupElement(groupedTasks["uncategorized"].displayName, groupedTasks["uncategorized"].tasks, true);
        currentTasksContainer.appendChild(groupEl);
        delete groupedTasks["uncategorized"]; // Remove from object
    }

    Object.keys(groupedTasks)
        .sort((a, b) => groupedTasks[a].displayName.toLowerCase().localeCompare(groupedTasks[b].displayName.toLowerCase()))
        .forEach(normalizedKey => {
            const groupEl = createSubjectGroupElement(groupedTasks[normalizedKey].displayName, groupedTasks[normalizedKey].tasks, true);
            currentTasksContainer.appendChild(groupEl);
        });

    // calculateEndTime is called in the main renderTasks function after this runs
}

function renderFinishedTasks() {
    finishedListContainer.innerHTML = ''; // Clear previous content

    if (finishedTasks.length === 0) {
        finishedListContainer.innerHTML = '<p class="empty-list-message">No tasks finished yet.</p>';
        totalFinishedTimeEl.textContent = '';
        return;
    }

     // Sort finished tasks by finishedAt timestamp, most recent first
    const sortedFinished = [...finishedTasks].sort((a, b) => {
         const dateA = a.finishedAt ? new Date(a.finishedAt).getTime() : 0;
         const dateB = b.finishedAt ? new Date(b.finishedAt).getTime() : 0;
         // Fallback sort by name if dates are equal or missing
         if (dateB === dateA) {
             return (a.name || '').localeCompare(b.name || '');
         }
         return dateB - dateA; // Descending order by date
     });


    const groupedTasks = groupTasksBySubject(sortedFinished);

    // Render Uncategorized first, then others alphabetically by display name
    if (groupedTasks["uncategorized"]) {
        const groupEl = createSubjectGroupElement(groupedTasks["uncategorized"].displayName, groupedTasks["uncategorized"].tasks, false);
        finishedListContainer.appendChild(groupEl);
        delete groupedTasks["uncategorized"];
    }

    Object.keys(groupedTasks)
        .sort((a, b) => groupedTasks[a].displayName.toLowerCase().localeCompare(groupedTasks[b].displayName.toLowerCase()))
        .forEach(normalizedKey => {
            const groupEl = createSubjectGroupElement(groupedTasks[normalizedKey].displayName, groupedTasks[normalizedKey].tasks, false);
            finishedListContainer.appendChild(groupEl);
        });

    updateFinishedTime(); // Update total time display
}

// --- List Item Creation ---
function createListItemElement(task, listType) { // listType: 'current' or 'finished'
    const li = document.createElement('li');
    li.dataset.id = task.id;
    // Store type even for finished tasks if available (helps with potential future filtering)
    li.dataset.type = task.type || 'unknown';
    // Only make current tasks draggable if selected via menu
    li.draggable = listType === 'current' && draggableTaskId === task.id;

    const isCurrentList = listType === 'current';
    const isFinishedList = listType === 'finished';

    let contentHTML = '';
    let taskDetails = '';
    let controlsHTML = '';

    // --- Determine Task Details ---
    if (isCurrentList) {
        let durationText = '';
        if (task.type === 'study' && task.mode === 'timer') {
            durationText = `(${(task.duration / 60).toFixed(0)} min)`;
            taskDetails = `Timer ${durationText}`;
        } else if (task.type === 'study' && task.mode === 'stopwatch') {
            taskDetails = `Stopwatch`;
        } else if (task.type === 'exercise') {
            durationText = `(${(task.duration / 60).toFixed(0)} min target)`;
            taskDetails = `Exercise ${durationText}`;
        } else if (task.type === 'reward') {
            durationText = `(${(task.duration / 60).toFixed(0)} min)`;
            taskDetails = `Reward ${durationText}`;
            if(task.requiredTime > 0) {
                 taskDetails += ` <span class="task-requires">Requires: ${formatTimeHMS(task.requiredTime)}</span>`;
            }
        }
        // Add due date info if present
        if (task.dueDate) {
             // Check if date is valid before formatting
             try {
                taskDetails += `<span class="task-due-date">(Due: ${formatShortDate(task.dueDate)})</span>`;
             } catch (e) {
                taskDetails += `<span class="task-due-date">(Due: Invalid Date)</span>`;
                console.error("Invalid due date found for task:", task.id, task.dueDate);
             }
         }
    } else if (isFinishedList) {
         const finishedDate = task.finishedAt ? `Finished: ${formatDateTime(new Date(task.finishedAt))}` : 'Finished: Unknown Time';
         taskDetails = `Time: ${formatTimeHMS(task.totalTimeSpent)} | ${finishedDate}`;
         if (task.subject) { // Show subject on finished items too
              taskDetails += ` | Subject: ${escapeHtml(task.subject)}`;
         }
         // Show original due date if it existed (Optional)
         // if (task.dueDate) {
         //     taskDetails += ` | Originally Due: ${formatShortDate(task.dueDate)}`;
         // }
    }


    // --- Determine Controls ---
    if (isCurrentList) {
        const canPlayReward = task.type !== 'reward' || totalCredits >= (task.requiredTime || 0);
        const playButtonDisabled = !!activeTask || (task.type === 'reward' && !canPlayReward);
        const playButtonTitle = (task.type === 'reward' && !canPlayReward)
                                ? `Requires ${formatTimeHMS(task.requiredTime || 0)} credits`
                                : (activeTask ? 'Another task active' : 'Start Task');

        if (task.state === 'running') {
            li.classList.add('active-task');
            controlsHTML = `
                <span class="task-timer">${formatTime((task.mode === 'timer' || task.type === 'reward') ? (task.remainingTime || 0) : (task.totalTimeSpent || 0))}</span>
                <div class="task-controls">
                    <button class="pause-btn text-button" aria-label="Pause Task" title="Pause">Pause</button>
                    <button class="stop-btn text-button" aria-label="Stop Task" title="Stop">Stop</button>
                </div>`;
        } else if (task.state === 'paused') {
             li.classList.add('active-task'); // Still show as 'active' visually when paused
            controlsHTML = `
                <span class="task-timer">${formatTime((task.mode === 'timer' || task.type === 'reward') ? (task.remainingTime || 0) : (task.totalTimeSpent || 0))}</span>
                <div class="task-controls">
                    <button class="play-btn text-button" aria-label="Resume Task" title="Resume">Resume</button>
                    <button class="stop-btn text-button" aria-label="Stop Task" title="Stop">Stop</button>
                </div>`;
        } else { // 'not started'
             if (task.type === 'reward' && !canPlayReward) {
                li.classList.add('disabled-task'); // Visually disable if cannot play reward yet
            }
            controlsHTML = `
                <div class="task-controls">
                     <button class="play-btn text-button ${playButtonDisabled ? 'disabled' : ''}"
                             aria-label="${playButtonTitle}"
                             title="${playButtonTitle}"
                             ${playButtonDisabled ? 'disabled' : ''}>
                         Start
                     </button>
                 </div>`;
        }
    }

    // --- Add Task Options Button (Always add, control visibility via menu options) ---
     controlsHTML += `<button class="task-options" aria-label="Task Options" title="Options">⋮</button>`;


    // --- Construct Inner HTML ---
    // Use innerHTML for taskDetails as it might contain spans
    contentHTML = `
        ${selectionMode ? `<input type="checkbox" class="select-task" data-id="${task.id}" aria-label="Select task ${escapeHtml(task.name)}">` : ''}
        <div class="task-info">
            <span class="task-name">${escapeHtml(task.name)}</span>
            <span class="task-details">${taskDetails}</span>
        </div>
        ${controlsHTML}
    `;

    li.innerHTML = contentHTML;

    // Add selection mode class if needed (for padding adjustment)
    if (selectionMode && (isCurrentList || isFinishedList)) { // Apply to both lists if selectable
        li.classList.add('selection-mode-item');
    }

    return li;
}

// --- Schedule Graph Rendering ---
function renderScheduleGraph() {
    scheduleGraphContainer.innerHTML = ''; // Clear previous graph

    const allCurrentTasks = [
        ...currentTasks.map(t => ({ ...t, type: 'study' })),
        ...exerciseTasks.map(t => ({ ...t, type: 'exercise' })),
        ...rewardTasks.map(t => ({ ...t, type: 'reward' }))
    ];

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day
    const todayStr = getDateString(today);

    const upcomingTasks = {}; // Key: YYYY-MM-DD, Value: array of tasks
    const dateLabels = []; // Array to hold { dateStr: 'YYYY-MM-DD', label: 'Mon 10', isToday: bool }

    // Populate date labels and initialize upcomingTasks for the next 7 days
    for (let i = 0; i < 7; i++) {
        const loopDate = new Date(today);
        loopDate.setDate(today.getDate() + i);
        const dateStr = getDateString(loopDate);
        upcomingTasks[dateStr] = []; // Initialize empty array for the day

        let label = loopDate.toLocaleDateString(undefined, { weekday: 'short' }); // e.g., 'Mon'
         // Add day number for clarity
         label += ' ' + loopDate.getDate();

         if (i === 0) label = 'Today';
         else if (i === 1) label = 'Tomorrow';

        dateLabels.push({ dateStr: dateStr, label: label, isToday: i === 0 });
    }

    const weekEndDate = new Date(today);
    weekEndDate.setDate(today.getDate() + 6); // Last day included in the 7-day span
    const weekEndStr = getDateString(weekEndDate);

    // Filter and group tasks by due date within the 7-day range
    allCurrentTasks.forEach(task => {
        // Only include tasks with a valid due date within the range
        if (task.dueDate && task.dueDate >= todayStr && task.dueDate <= weekEndStr) {
            if (upcomingTasks[task.dueDate]) {
                upcomingTasks[task.dueDate].push(task);
            } else {
                 // This shouldn't happen if initialization worked, but safety check
                 console.warn("Task due date exists but wasn't initialized in upcomingTasks:", task.dueDate);
            }
        }
    });

    // Check if there are any tasks to display
    const hasTasksInSchedule = Object.values(upcomingTasks).some(dayTasks => dayTasks.length > 0);

    if (!hasTasksInSchedule) {
        scheduleGraphContainer.innerHTML = '<p class="empty-list-message">No tasks scheduled for the upcoming week. Add tasks with due dates!</p>';
        return;
    }


    // Render the graph columns and tasks
    dateLabels.forEach(({ dateStr, label, isToday }) => {
        const dayColumn = document.createElement('div');
        dayColumn.className = 'schedule-day-column';

        const tasksForDay = upcomingTasks[dateStr] || [];
         tasksForDay.sort((a, b) => (a.name || '').localeCompare(b.name || '')); // Sort tasks alphabetically within the day

        tasksForDay.forEach(task => {
            const taskBlock = document.createElement('div');
            taskBlock.className = 'schedule-task-block';
            taskBlock.dataset.taskId = task.id;
            taskBlock.dataset.taskType = task.type || 'unknown'; // For styling based on type
            taskBlock.textContent = escapeHtml(task.name);
            taskBlock.title = `${escapeHtml(task.name)} (${task.type || 'unknown'}) - Due: ${formatShortDate(task.dueDate)}`; // Tooltip
            dayColumn.appendChild(taskBlock);
        });

        // Add Day Label below the column (using absolute positioning relative to column)
        const dayLabel = document.createElement('div');
        dayLabel.className = `schedule-day-label ${isToday ? 'today' : ''}`;
        dayLabel.textContent = label;
        dayColumn.appendChild(dayLabel); // Label is inside column for simpler layout

        scheduleGraphContainer.appendChild(dayColumn);
    });
}


// --- Collapse/Expand Subject Groups ---
function handleCollapseToggle(normalizedSubjectKey, isCurrentTab) {
    // normalizedSubjectKey is already normalized because it's passed from createSubjectGroupElement's event listener
    const collapseMap = isCurrentTab ? collapsedCurrentSubjects : collapsedSubjects;
    const container = isCurrentTab ? currentTasksContainer : finishedListContainer;

    collapseMap[normalizedSubjectKey] = !collapseMap[normalizedSubjectKey]; // Toggle state

    // Find the specific group element and toggle its class
    const groupElement = container.querySelector(`.subject-group[data-subject="${normalizedSubjectKey}"]`);
    if (groupElement) {
        groupElement.classList.toggle('collapsed', collapseMap[normalizedSubjectKey]);
        const button = groupElement.querySelector('.toggle-subject-list');
        if(button) {
            // Find the display name from the h3 tag for the label
            const headerText = groupElement.querySelector('h3')?.textContent || normalizedSubjectKey;
            const action = collapseMap[normalizedSubjectKey] ? 'Expand' : 'Collapse';
            button.setAttribute('aria-label', `${action} ${escapeHtml(headerText)} tasks`);
            button.setAttribute('title', action);
        }
    }

    saveState(); // Save the updated collapse state
}

// --- Tab Switching ---
function switchTab(tabIdToActivate) {
    // Deactivate previous tab
    const currentActiveTab = tabNavigation.querySelector('.tab-button.active');
    const currentActivePanel = tabContent.querySelector('.tab-panel.active');
    if (currentActiveTab) {
        currentActiveTab.classList.remove('active');
        currentActiveTab.setAttribute('aria-selected', 'false');
        currentActiveTab.setAttribute('tabindex', '-1');
    }
    if (currentActivePanel) {
        currentActivePanel.classList.remove('active');
    }

    // Activate new tab
    const newActiveTab = document.getElementById(tabIdToActivate);
    if (!newActiveTab) { // Safety check
        console.error("Tab button not found:", tabIdToActivate);
        // Default to current tab if requested tab is invalid
        switchTab('tab-current');
        return;
    }
    const newActivePanelId = newActiveTab.getAttribute('aria-controls');
    const newActivePanel = document.getElementById(newActivePanelId);

    if (newActiveTab) {
        newActiveTab.classList.add('active');
        newActiveTab.setAttribute('aria-selected', 'true');
         newActiveTab.setAttribute('tabindex', '0'); // Make active tab focusable
        activeTabId = tabIdToActivate; // Update state variable
    }
    if (newActivePanel) {
        newActivePanel.classList.add('active');
        renderTasks(); // Re-render based on the newly active tab (will call correct render function)
    } else {
         console.error("Tab panel not found:", newActivePanelId);
         // Optionally clear content area or show error
         tabContent.innerHTML = `<p class="empty-list-message">Error: Content panel for ${tabIdToActivate} not found.</p>`;
    }

    saveState(); // Save the active tab ID
}

// --- Subject Management ---
function normalizeSubject(subject) {
    return typeof subject === 'string' ? subject.trim().toLowerCase() : 'uncategorized';
}

function addSubject(newSubjectName) {
    const trimmedName = newSubjectName.trim();
    // Check against normalized existing subjects
    if (trimmedName && !availableSubjects.some(s => normalizeSubject(s) === normalizeSubject(trimmedName))) {
        availableSubjects.push(trimmedName); // Add with original casing
        availableSubjects.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase())); // Keep sorted case-insensitively
        saveState();
        populateSubjectDropdowns(); // Update all dropdowns
        return trimmedName; // Return the added name (original casing)
    } else if (!trimmedName) {
        showNotification("Subject name cannot be empty.", { error: true });
    } else {
        // Find the existing subject name with original casing for the message
        const existingSubject = availableSubjects.find(s => normalizeSubject(s) === normalizeSubject(trimmedName));
        showNotification(`Subject "${existingSubject || trimmedName}" already exists.`, { error: true });
    }
    return null; // Indicate failure or duplicate
}


function populateSubjectDropdowns() {
    const subjectSelects = [taskSubjectSelect, manualFinishedSubjectSelect, editSubjectSelect];
    const currentValues = subjectSelects.map(select => select?.value); // Remember selection, handle null select

    subjectSelects.forEach(select => {
        if (!select) return; // Skip if element doesn't exist
        // Clear existing options except the default/special ones
        // Assumes first option is "-- Select --" (value="") and second is "Add New..." (value="_new_subject_")
        while (select.options.length > 2) {
            select.remove(2);
        }
        // Populate with available subjects (original casing)
        availableSubjects.forEach(subject => {
            const option = document.createElement('option');
            option.value = subject; // Use original casing as value
            option.textContent = subject;
            select.appendChild(option);
        });
    });

    // Restore previous selection if possible
    subjectSelects.forEach((select, index) => {
        if(select && currentValues[index] !== undefined) select.value = currentValues[index];
    });
}


// --- Motivational Quotes ---
function loadQuotes() {
    if (inlineMotivationalQuotes && Array.isArray(inlineMotivationalQuotes) && inlineMotivationalQuotes.length > 0) {
        quotes = inlineMotivationalQuotes; // Assign directly from the predefined array
    } else {
        console.warn("Inline quotes data is missing or invalid. Using fallback.");
        quotes = [
            { text: "Keep pushing forward!", author: "" },
            { text: "Focus and do your best.", author: "" }
        ];
    }
    if (quotes.length > 0) {
        currentQuoteIndex = Math.floor(Math.random() * quotes.length);
    } else {
        currentQuoteIndex = 0;
    }
}


function displayMotivation() {
    if (!quotes || quotes.length === 0) {
        quoteTextEl.textContent = "Keep pushing forward!";
        quoteAuthorEl.textContent = "";
        prevQuoteBtn.disabled = true;
        nextQuoteBtn.disabled = true;
        return;
    }
    prevQuoteBtn.disabled = false;
    nextQuoteBtn.disabled = false;

    if (currentQuoteIndex < 0 || currentQuoteIndex >= quotes.length) {
        currentQuoteIndex = 0;
    }

    const quote = quotes[currentQuoteIndex];
    quoteTextEl.textContent = quote.text;
    quoteAuthorEl.textContent = quote.author ? `- ${quote.author}` : "";
}


function showNextQuote() {
    if (quotes.length > 0) {
        currentQuoteIndex = (currentQuoteIndex + 1) % quotes.length;
        displayMotivation();
    }
}

function showPrevQuote() {
    if (quotes.length > 0) {
        currentQuoteIndex = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
        displayMotivation();
    }
}

// --- Task Management ---

// Helper to get the correct task array and type based on ID
function findTaskAndSource(taskId) {
    let task = currentTasks.find(t => t.id === taskId);
    if (task) return { task, sourceArray: currentTasks, type: 'study' };

    task = exerciseTasks.find(t => t.id === taskId);
    if (task) return { task, sourceArray: exerciseTasks, type: 'exercise' };

    task = rewardTasks.find(t => t.id === taskId);
    if (task) return { task, sourceArray: rewardTasks, type: 'reward' };

    // Check finished tasks too, needed for delete/change subject from finished list
    task = finishedTasks.find(t => t.id === taskId);
    if (task) return { task, sourceArray: finishedTasks, type: task.type || 'finished' };

    return { task: null, sourceArray: null, type: null };
}


// Helper to get the visual list context ('current', 'finished', 'schedule')
function getListContext(element) {
    const panel = element.closest('.tab-panel');
    if (panel) {
        if (panel.id === 'current-tasks-panel') return 'current';
        if (panel.id === 'finished-tasks-panel') return 'finished';
        if (panel.id === 'schedule-tasks-panel') return 'schedule';
    }
    // Try finding based on parent list if element is detached? Less reliable.
    if(element.closest('#current-tasks-container')) return 'current';
    if(element.closest('#finished-list-container')) return 'finished';
    if(element.closest('#schedule-graph-container')) return 'schedule';

    return null; // Fallback
}


async function startTask(taskId) {
    if (activeTask && activeTask.id !== taskId) { // Prevent starting if another is running/paused
        await showNotification('Another task is currently active. Please stop or finish it first.');
        return;
    }

    const { task, sourceArray, type } = findTaskAndSource(taskId);

    // Cannot start finished tasks or if task not found in current lists
    if (!task || task.state === 'finished' || sourceArray === finishedTasks) {
        console.warn("Cannot start task:", taskId, task);
        return;
    }

    // Check Reward Credits
    if (type === 'reward' && totalCredits < (task.requiredTime || 0)) {
         await showNotification(`Not enough credits to start reward task "${task.name}". Required: ${formatTimeHMS(task.requiredTime || 0)}, Available: ${formatTimeHMS(totalCredits)}`);
        return;
    }

    // If it's the same task being resumed
    if (activeTask && activeTask.id === taskId && task.state === 'paused') {
        // Resuming
    } else if (activeTask && activeTask.id !== taskId) {
        // This case should be blocked by the initial check, but as a safeguard:
         console.warn("Tried to start a new task while another is active.");
         return;
    }


    task.state = 'running';
    activeTask = task; // Set the global active task

    // Send Telegram update only once when starting/resuming
    if(!timerInterval) { // Avoid sending message again if already running (e.g., after add time)
         const startMessage = `${task.name} (${type}) Started/Resumed\nTime: ${formatDateTime(new Date())}`;
         await sendTelegramUpdate(startMessage);
         // Play sound in response to user interaction
         taskCompleteSound.play().catch(e => console.warn("Audio play failed:", e));
    }

    renderTasks(); // Update UI immediately

    // Clear any existing interval before starting a new one
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        if (!activeTask || activeTask.id !== taskId || activeTask.state !== 'running') {
             clearInterval(timerInterval); // Safety check
             timerInterval = null; // Clear reference
             console.warn("Timer interval running for inactive/wrong task. Clearing.");
             return;
         }

        task.totalTimeSpent = (task.totalTimeSpent || 0) + 1;

        let shouldFinish = false;
        let askToAddTime = false;

        if (type === 'study' && task.mode === 'timer') {
            task.remainingTime = Math.max(0, (task.remainingTime || 0) - 1);
            if (task.remainingTime <= 0) {
                clearInterval(timerInterval); // Stop timer first
                timerInterval = null;
                taskCompleteSound.play().catch(e => console.warn("Audio play failed:", e));
                askToAddTime = true; // Set flag to ask user outside interval
            }
        } else if (type === 'reward') {
            task.remainingTime = Math.max(0, (task.remainingTime || 0) - 1);
            if (task.remainingTime <= 0) {
                shouldFinish = true; // Rewards finish automatically when timer ends
            }
        } else if (type === 'exercise') {
             // Exercise uses stopwatch logic for totalTimeSpent, duration is a target
             if (task.duration > 0 && task.totalTimeSpent === task.duration) { // Check for exact match to notify only once if duration is set
                // Optional: Notify user target reached?
                showNotification(`Exercise target of ${formatTimeHMS(task.duration)} reached for "${task.name}"!`);
             }
         }
        // Study stopwatch mode just increments totalTimeSpent

         if (askToAddTime) {
             // Ensure task still exists before prompting
             const { task: checkTask } = findTaskAndSource(taskId);
             if (checkTask && checkTask.state !== 'finished') {
                showAddTimePrompt(checkTask); // Ask user what to do
             } else {
                console.log("Task finished or removed before add time prompt.");
             }
         } else if (shouldFinish) {
            clearInterval(timerInterval);
            timerInterval = null;
            finishTask(taskId);
        } else if(task.state === 'running') { // Only update display if still running
            // Update display only if timer didn't finish in this tick
            updateTimerDisplay(task);
            saveState(); // Save progress frequently
        }
    }, 1000);

    // Ensure UI updates even if interval logic has issues
    renderTasks();
    saveState();
}

async function pauseTask(taskId) {
    if (!activeTask || activeTask.id !== taskId || activeTask.state !== 'running') {
        console.warn("Cannot pause task - no active task or ID mismatch or not running.", taskId, activeTask);
        return;
    }
    clearInterval(timerInterval);
    timerInterval = null; // Clear interval reference

    const { task, type } = findTaskAndSource(taskId);
    if (!task) return;

    task.state = 'paused';
    const pauseMessage = `${task.name} (${type}) Paused\nTime: ${formatDateTime(new Date())}\nProgress: ${formatTimeHMS(task.totalTimeSpent || 0)}`;
    await sendTelegramUpdate(pauseMessage);

    activeTask = null; // Unset global active task

    renderTasks();
    saveState();
}

async function stopTask(taskId) {
    const { task, sourceArray, type } = findTaskAndSource(taskId);
    if (!task || (task.state !== 'running' && task.state !== 'paused')) {
        console.warn("Cannot stop task - not running or paused.", task);
        return;
    }

    const wasRunning = task.state === 'running';

    // Clear interval immediately if it was running
    if (wasRunning && timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
     if (activeTask && activeTask.id === taskId) {
        activeTask = null; // Unset global active task
    }


    // Ask for confirmation
    const confirmStop = await showNotification(`Stop Task "${task.name}"? Current progress will be saved as finished time.`, { confirm: true });

    if (confirmStop) {
        // If confirmed, finish the task (handles state change, credits, array moving)
        finishTask(taskId); // finishTask will also send Telegram update
    } else {
        // If cancelled, and the task *was* running, resume the timer immediately
        if (wasRunning) {
            // User interaction (clicking No) allows resuming timer
            startTask(taskId); // This will set state back to 'running', restart interval, update UI
        } else {
             // If it was paused and they cancelled stop, it remains paused. Re-render to be sure.
             renderTasks();
        }
    }
}


async function finishTask(taskId) {
     // Clear interval if this task was the one running/paused
     if (activeTask && activeTask.id === taskId && timerInterval) {
         clearInterval(timerInterval);
         timerInterval = null;
     }
      if (activeTask && activeTask.id === taskId) {
         activeTask = null;
      }

    const { task, sourceArray, type } = findTaskAndSource(taskId);
    if (!task || task.state === 'finished' || !sourceArray) {
         console.warn("Cannot finish task - Task not found, already finished, or source invalid", taskId);
         return; // Cannot finish if not found or already finished
     }
     // Ensure totalTimeSpent is at least 1 second if finished immediately (e.g. stopwatch stopped)
     if (!task.totalTimeSpent || task.totalTimeSpent <= 0) task.totalTimeSpent = 1;

    task.state = 'finished';
    task.finishedAt = new Date().toISOString(); // Record finish time

    let creditChange = 0;
    let message = '';
    let shouldPlaySound = false;

    // Move task and handle credits based on type
    if (type === 'study') {
        creditChange = task.totalTimeSpent; // Earn full time spent
        finishedTasks.push(task);
        currentTasks = currentTasks.filter(t => t.id !== taskId); // Remove from source
        message = `${task.name} (Study) Finished!\n+ ${formatTimeHMS(creditChange)} Credits\nTotal Time: ${formatTimeHMS(task.totalTimeSpent)}`;
        shouldPlaySound = true;
    } else if (type === 'exercise') {
        const earned = Math.floor((task.totalTimeSpent || 0) * 0.30); // Earn 30% of time spent
        creditChange = earned;
        task.creditsEarned = earned; // Store earned amount on the task object
        finishedTasks.push(task); // Add to finished list
        exerciseTasks = exerciseTasks.filter(t => t.id !== taskId); // Remove from source
        message = `${task.name} (Exercise) Finished!\n+ ${formatTimeHMS(creditChange)} Credits\nTotal Time: ${formatTimeHMS(task.totalTimeSpent)}`;
        shouldPlaySound = true;
    } else if (type === 'reward') {
        creditChange = -(task.requiredTime || 0); // Cost is the required time
        // Rewards are usually *not* added to the finished list, they are just removed
        rewardTasks = rewardTasks.filter(t => t.id !== taskId); // Remove from source
        message = `${task.name} (Reward) Completed!\n- ${formatTimeHMS(Math.abs(creditChange))} Credits`;
        // Don't play sound for reward completion? Or different sound? For now, no sound.
    } else {
        // Handle 'manual' type from manually added finished tasks (shouldn't be finished again)
        // Or handle any other unknown types gracefully
        if (sourceArray === finishedTasks) {
             console.warn("Tried to finish an already finished task:", task.id, task.name);
             // No state change needed, just return
             return;
        } else {
            console.error("Unknown task type during finish:", type, task);
            // Move to finished without credit change?
            task.type = task.type || 'unknown'; // Mark type if missing
            finishedTasks.push(task);
            // Remove from original array if it exists (best guess)
            if (currentTasks.some(t=> t.id === taskId)) currentTasks = currentTasks.filter(t => t.id !== taskId);
            else if (exerciseTasks.some(t=> t.id === taskId)) exerciseTasks = exerciseTasks.filter(t => t.id !== taskId);
            else if (rewardTasks.some(t=> t.id === taskId)) rewardTasks = rewardTasks.filter(t => t.id !== taskId);
            message = `${task.name} Finished (Unknown Type)`;
        }
    }

    totalCredits = Math.max(0, totalCredits + creditChange); // Apply credit change, ensuring non-negative

    await sendTelegramUpdate(`${message}\nTime: ${formatDateTime(new Date())}\nNew Balance: ${formatTimeHMS(totalCredits)}`);

    if (shouldPlaySound) {
        taskCompleteSound.play().catch(e => console.warn("Audio play failed:", e));
    }

    saveState();
    renderTasks(); // Update UI
}

async function deleteTask(taskId) {
    const { task, sourceArray, type } = findTaskAndSource(taskId);
    if (!task || !sourceArray) {
        console.warn("Task not found for deletion:", taskId);
        hideTaskMenu(); // Ensure menu is hidden
        return;
    }

    // Ask for confirmation
    const confirmDelete = await showNotification(`Delete Task "${task.name}" permanently?`, { confirm: true, danger: true });
    hideTaskMenu(); // Hide menu after confirmation prompt is resolved

    if (!confirmDelete) return;

    // If deleting the active task, stop the timer and clear active state
    if (activeTask && activeTask.id === taskId) {
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        activeTask = null;
    }

    // Remove the task from its source array
    let wasFinishedTask = false;
    if (sourceArray === currentTasks) {
        currentTasks = currentTasks.filter(t => t.id !== taskId);
    } else if (sourceArray === exerciseTasks) {
        exerciseTasks = exerciseTasks.filter(t => t.id !== taskId);
    } else if (sourceArray === rewardTasks) {
        rewardTasks = rewardTasks.filter(t => t.id !== taskId);
    } else if (sourceArray === finishedTasks) {
        finishedTasks = finishedTasks.filter(t => t.id !== taskId);
        wasFinishedTask = true;
        // Optional: Adjust total credits if deleting a finished task that earned credits?
        // Let's NOT adjust credits for simplicity.
    }

    await sendTelegramUpdate(`Task Deleted: ${task.name} (${type || 'Finished'})`);

    saveState();
    // Re-render the list where the task was deleted from
    renderTasks(); // Re-render based on the currently active tab
}


// --- Timer Display & Add Time Prompt ---
function updateTimerDisplay(task) {
    if (!task || !task.id) return;
    // Find the list item only in the current tasks panel
    const listItem = document.querySelector(`#current-tasks-panel li[data-id="${task.id}"]`);
    if (!listItem) return; // Task might be finished or not in current view

    const timerDisplay = listItem.querySelector('.task-timer');
    if (timerDisplay) {
        const timeToDisplay = (task.type === 'study' && task.mode === 'timer') || task.type === 'reward'
            ? (task.remainingTime || 0)
            : (task.totalTimeSpent || 0);
        timerDisplay.textContent = formatTime(timeToDisplay);
    }
    // Also update end time estimate as timer progresses
    calculateEndTime();
}

async function showAddTimePrompt(task) {
     if (!task || task.state === 'finished') return; // Prevent prompt if already finished somehow

    // Ensure the task is considered paused visually while prompt is up
    if(task.state === 'running') {
        task.state = 'paused'; // Temporarily set to paused
    }
    if (activeTask && activeTask.id === task.id) {
        activeTask = null; // Unset global active while prompt is shown
    }
    renderTasks(); // Update UI to show paused state

    const addTime = await showNotification(`Task "${task.name}" timer finished. Add 5 more minutes?`, { confirm: true });

    // Check task state again *after* the await, in case user interacted elsewhere
    const { task: currentTaskState } = findTaskAndSource(task.id);
    if (!currentTaskState || currentTaskState.state === 'finished') {
        console.log("Add time prompt resolved, but task was already finished or deleted.");
        return; // Do nothing if task state changed
    }


    if (addTime) {
        currentTaskState.remainingTime = (currentTaskState.remainingTime || 0) + 300; // Add 5 minutes
        currentTaskState.duration = (currentTaskState.duration || 0) + 300; // Also update total duration
        // User interaction (clicking Yes) allows starting task
        startTask(currentTaskState.id); // Resume the task with the added time
    } else {
        // If they choose not to add time, finish the task properly
        finishTask(currentTaskState.id);
    }
    // No need to call renderTasks here, startTask or finishTask will do it.
}


// --- Credit System ---
function updateCreditWallet() {
    headerCreditsEl.textContent = `Credits: ${formatTimeHMS(totalCredits)}`;
    // Update reward task playability state if the current tab is active
    if(activeTabId === 'tab-current') {
        const currentPanel = document.getElementById('current-tasks-panel');
        if(currentPanel && currentPanel.classList.contains('active')) {
             renderCurrentTasks(); // Re-render to enable/disable reward buttons correctly
        }
    }
}

function performDailyCreditCheck() {
    const today = new Date().toDateString(); // Get date string like "Mon Oct 26 2023"

    if (lastCreditCheckDate === today) {
        return; // Already checked today
    }

    let creditChange = 0;
    let message = '';

    // Only apply reset/decay if it's not the first time ever running (lastCreditCheckDate exists)
    // and the date has actually changed
    if (lastCreditCheckDate !== null && lastCreditCheckDate !== today) {
        if (creditManagementOption === 'reset') {
            creditChange = -totalCredits; // Reset to 0
            message = "Daily credits reset to 0.";
        } else if (creditManagementOption === 'decay') {
            const decayAmount = Math.floor(totalCredits * (dailyDecayPercent / 100));
            if (decayAmount > 0) { // Only apply if there's something to decay
                creditChange = -decayAmount;
                message = `Daily credit decay (${dailyDecayPercent}%): -${formatTimeHMS(decayAmount)}`;
            }
        }
    }

    if (creditChange !== 0) {
        totalCredits = Math.max(0, totalCredits + creditChange);
        showNotification(message);
        sendTelegramUpdate(`Credit Update: ${message}\nNew Balance: ${formatTimeHMS(totalCredits)}`);
        updateCreditWallet(); // Update display immediately
    }

    lastCreditCheckDate = today; // Mark today as checked
    saveState(); // Save the new credit total and last check date
}

function updateCreditOptionsUI() {
     creditResetSelect.value = creditManagementOption;
     dailyDecayInput.value = dailyDecayPercent;
     dailyDecayGroup.style.display = creditManagementOption === 'decay' ? 'block' : 'none';
}

function updateFinishedTime() {
    const totalSeconds = finishedTasks.reduce((sum, task) => sum + (task.totalTimeSpent || 0), 0);
    totalFinishedTimeEl.textContent = `Total Time: ${formatTimeHMS(totalSeconds)}`;
}


// --- Modal Handling ---
function openModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'flex'; // Use flex for centering
        modalElement.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open'); // Prevent body scroll
        // Focus first focusable element
         const firstFocusable = modalElement.querySelector('input, select, button:not([disabled]), textarea, [tabindex]:not([tabindex="-1"])');
         if(firstFocusable) firstFocusable.focus();
    }
}

function closeModal(modalElement) {
    if (modalElement) {
        modalElement.style.display = 'none';
        modalElement.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
        // Reset form if it's a form modal
        const form = modalElement.querySelector('form');
        if (form) {
             form.reset();
             // Manually reset UI elements not handled by form.reset()
             if (modalElement === addTaskFormModal) {
                 taskNewSubjectGroup.style.display = 'none';
                 taskSubjectGroup.style.display = 'block'; // Default visibility
                 studyModeGroup.style.display = 'block'; // Default visibility
                 durationGroup.style.display = 'none'; // Should update based on type/mode
                 rewardRequiredGroup.style.display = 'none'; // Default
                 dueDatePickerContainer.style.display = 'none'; // Hide date picker
                 setDueDateCheckbox.checked = false; // Uncheck checkbox
                 taskTypeSelect.dispatchEvent(new Event('change')); // Trigger change to set initial state based on default task type
             }
              if (modalElement === manualFinishedFormModal) {
                  // Any specific resets for manual form if needed
              }
         }
        // Clear specific state if needed
        if (modalElement === changeSubjectModal) {
            taskToChangeSubject = null;
        }
    }
}

// Add Task Modal Logic
addTaskBtn.addEventListener('click', () => {
    populateSubjectDropdowns(); // Ensure subjects are up-to-date
    // Reset form state before opening
    addTaskForm.reset(); // Basic reset
    taskTypeSelect.value = 'study'; // Default to study
    setDueDateCheckbox.checked = false; // Ensure checkbox is unchecked
    dueDatePickerContainer.style.display = 'none'; // Hide picker
    taskDueDateInput.value = ''; // Clear date input
    // Set minimum date for due date picker to today
    taskDueDateInput.min = getDateString(new Date());
    taskTypeSelect.dispatchEvent(new Event('change')); // Trigger UI update based on type
    openModal(addTaskFormModal);
});
cancelAddTaskBtn.addEventListener('click', () => closeModal(addTaskFormModal));

taskTypeSelect.addEventListener('change', () => {
    const type = taskTypeSelect.value;
    const isStudy = type === 'study';
    const isExercise = type === 'exercise';
    const isReward = type === 'reward';

    taskSubjectGroup.style.display = isStudy ? 'block' : 'none'; // Only show subject for study
    studyModeGroup.style.display = isStudy ? 'block' : 'none';
    rewardRequiredGroup.style.display = isReward ? 'block' : 'none';

    // Duration logic: Needed for Study/Timer, Exercise, Reward
    const showDuration = (isStudy && studyModeSelect.value === 'timer') || isExercise || isReward;
    durationGroup.style.display = showDuration ? 'block' : 'none';
    durationInput.required = showDuration; // Make duration required only if visible

     // Reset subject selection if type changes away from 'study'
     if (!isStudy) {
        taskSubjectSelect.value = '';
        taskNewSubjectGroup.style.display = 'none';
        taskNewSubjectInput.value = '';
     }
     // Reset study mode if type changes away from 'study'
     if (!isStudy) {
        studyModeSelect.value = 'stopwatch'; // Or your default mode
     }
     // Reset required time if type changes away from 'reward'
     if (!isReward) {
        rewardRequiredInput.value = '';
     }
});

// Also update duration visibility when study mode changes
studyModeSelect.addEventListener('change', () => {
    if (taskTypeSelect.value === 'study') {
        const showDuration = studyModeSelect.value === 'timer';
        durationGroup.style.display = showDuration ? 'block' : 'none';
        durationInput.required = showDuration;
    }
});

taskSubjectSelect.addEventListener('change', () => {
    if (taskSubjectSelect.value === '_new_subject_') {
        taskNewSubjectGroup.style.display = 'block';
        taskNewSubjectInput.value = ''; // Clear previous input
        taskNewSubjectInput.focus();
    } else {
        taskNewSubjectGroup.style.display = 'none';
    }
});
cancelAddSubjectBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent potential form submission
    taskNewSubjectGroup.style.display = 'none';
    taskSubjectSelect.value = ''; // Reset dropdown to "-- Select --"
    taskNewSubjectInput.value = '';
});
addSubjectBtn.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent potential form submission
    const addedSubject = addSubject(taskNewSubjectInput.value);
    if (addedSubject) {
        // populateSubjectDropdowns() was already called by addSubject
        taskSubjectSelect.value = addedSubject; // Select the newly added subject (original casing)
        taskNewSubjectGroup.style.display = 'none'; // Hide input
        taskNewSubjectInput.value = '';
    }
    // If addSubject failed (empty/duplicate), it shows a notification. Keep input open.
});

// Due Date Checkbox Logic
setDueDateCheckbox.addEventListener('change', () => {
    dueDatePickerContainer.style.display = setDueDateCheckbox.checked ? 'block' : 'none';
    taskDueDateInput.required = setDueDateCheckbox.checked; // Make required only if visible
    if (setDueDateCheckbox.checked) {
        // Set default date to today if empty
        if (!taskDueDateInput.value) {
            taskDueDateInput.value = getDateString(new Date());
        }
        taskDueDateInput.focus();
    } else {
        taskDueDateInput.value = ''; // Clear date if unchecked
    }
});


addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const type = taskTypeSelect.value;
    const name = taskNameInput.value.trim();
    const mode = studyModeSelect.value; // Relevant only for type 'study'
    const durationMinutes = parseInt(durationInput.value, 10);
    // Determine if duration is needed based on current UI state
    const isDurationVisible = durationGroup.style.display === 'block';
    const durationSeconds = isDurationVisible ? durationMinutes * 60 : 0;
    const isRequiredTimeVisible = rewardRequiredGroup.style.display === 'block';
    const requiredTimeSeconds = isRequiredTimeVisible ? parseTimeHMS(rewardRequiredInput.value) : 0;
    let subject = null; // Default to null (Uncategorized)
    let dueDate = null; // Default to null

    // Get subject only if the subject group is visible (i.e., type is 'study')
    if (taskSubjectGroup.style.display === 'block') {
        subject = taskSubjectSelect.value; // This holds the original casing
        // Handle "Add New Subject" case if it wasn't added via button
        if (subject === '_new_subject_') {
            subject = addSubject(taskNewSubjectInput.value);
            if (!subject) return; // Stop if subject adding failed (empty name, duplicate)
        }
        if (subject === "") subject = null; // Treat empty selection "-- Select --" as Uncategorized
    }

     // Get due date if checkbox is checked and date input has a value
     if (setDueDateCheckbox.checked && taskDueDateInput.value) {
         dueDate = taskDueDateInput.value; // Get YYYY-MM-DD string
         // Basic validation: check if the date is today or in the future
         const selectedDate = new Date(dueDate + 'T00:00:00'); // Add time part for accurate comparison
         const today = new Date();
         today.setHours(0, 0, 0, 0); // Normalize today's date
         if (isNaN(selectedDate.getTime()) || selectedDate < today) {
             showNotification("Please select today's date or a future date for the due date.", { error: true });
             return;
         }
     }


    if (!name) {
        showNotification("Task name cannot be empty.", { error: true });
        return;
    }
    if (isDurationVisible && (isNaN(durationSeconds) || durationSeconds <= 0)) {
        showNotification("Please enter a valid positive duration (in minutes).", { error: true });
         return;
     }
    if (isRequiredTimeVisible && (isNaN(requiredTimeSeconds) || requiredTimeSeconds < 0)) { // Allow 0 required time? Let's allow >= 0
         showNotification("Please enter a valid required credit time (hh:mm:ss).", { error: true });
         return;
     }


    const newTask = {
        id: generateId(),
        name: name,
        subject: subject, // Assign selected subject (original case) or null
        duration: durationSeconds, // Will be 0 if not applicable/visible
        totalTimeSpent: 0,
        state: 'not started', // Initial state
        finishedAt: null,
        dueDate: dueDate, // Add due date (YYYY-MM-DD string or null)
        // Type-specific properties added below
    };

    let targetArray;
    let successMessage = '';

    if (type === 'study') {
        newTask.type = 'study';
        newTask.mode = mode;
        newTask.remainingTime = mode === 'timer' ? durationSeconds : 0; // Only timer has initial remainingTime
        targetArray = currentTasks;
        successMessage = `Study task "${name}" added.`;
    } else if (type === 'exercise') {
        newTask.type = 'exercise';
         newTask.mode = 'stopwatch'; // Exercise always tracks time spent up
         newTask.remainingTime = 0; // No countdown
        targetArray = exerciseTasks;
        successMessage = `Exercise task "${name}" added.`;
    } else if (type === 'reward') {
        newTask.type = 'reward';
        newTask.requiredTime = requiredTimeSeconds; // Required credits in seconds
        newTask.remainingTime = durationSeconds; // Reward has a duration to count down
         newTask.mode = 'timer'; // Reward always has a countdown timer
        targetArray = rewardTasks;
        successMessage = `Reward task "${name}" added.`;
    } else {
        console.error("Unknown task type:", type);
        showNotification("Failed to add task: Unknown type.", { error: true });
        return;
    }

    targetArray.push(newTask);
    saveState();
    showNotification(successMessage); // Give user feedback

    // Re-render current tab or schedule tab if a due date was set
    if (activeTabId === 'tab-current' || (dueDate && activeTabId === 'tab-schedule')) {
         renderTasks(); // Re-render the active tab
    } else if (activeTabId !== 'tab-current') {
         // Optionally switch to current tab if it wasn't active
         // switchTab('tab-current'); // Let's not force switch, user might be adding multiple scheduled tasks
    }

    closeModal(addTaskFormModal);
    // Form reset is handled by closeModal
});


// Manual Add Finished Task Modal Logic
manualAddFinishedBtn.addEventListener('click', () => {
    hideOptionsMenu(); // Close options menu first
    populateSubjectDropdowns(); // Ensure subjects are up-to-date
    // Reset form state before opening
    manualFinishedForm.reset(); // Clear inputs
    manualFinishedSubjectSelect.value = ''; // Ensure dropdown is reset
    openModal(manualFinishedFormModal);
});
cancelManualFinishedBtn.addEventListener('click', () => closeModal(manualFinishedFormModal));

manualFinishedForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = manualFinishedNameInput.value.trim();
    const timeStr = manualFinishedTimeInput.value;
    const totalTimeSpent = parseTimeHMS(timeStr);
    let subject = manualFinishedSubjectSelect.value; // Original casing or ""

    if (!name) {
        showNotification("Task name cannot be empty.", { error: true }); return;
    }
    if (totalTimeSpent <= 0) {
        showNotification("Please provide a valid positive time spent (e.g., 00:30:00 or 25:00 or 15).", { error: true }); return;
    }
    // Note: Add New Subject is not implemented in this specific modal in the original code.
     if (subject === "_new_subject_") { // Basic handling if the option exists but logic is missing
         showNotification("Adding new subjects is not supported here. Please add via the main task form first.", { error: true }); return;
     }
     if (subject === "") subject = null; // Treat empty selection as Uncategorized

    const finishedTask = {
        id: generateId(),
        name,
        subject: subject, // Store original casing or null
        totalTimeSpent,
        state: 'finished',
        finishedAt: new Date().toISOString(), // Mark as finished now
        type: 'manual', // Indicate it was added manually
        dueDate: null // Manually added tasks don't have a due date
    };

    finishedTasks.push(finishedTask);
    // Decide if manually added tasks should grant credits. YES.
    const creditChange = totalTimeSpent;
    totalCredits = Math.max(0, totalCredits + creditChange); // Ensure non-negative

    saveState();
    showNotification(`Manually added finished task "${name}". +${formatTimeHMS(creditChange)} Credits.`);
    updateCreditWallet(); // Update header display

    // Render will happen on tab switch or if already on finished tab
    if (activeTabId === 'tab-finished') {
         renderFinishedTasks(); // Re-render if already active
    } else {
         // Optional: switch to finished tab? Let's not force switch.
         // switchTab('tab-finished');
    }
    closeModal(manualFinishedFormModal);
    // Form reset handled by closeModal
});


// Change Subject Modal Logic
function openChangeSubjectModal(taskId) {
    const { task, sourceArray } = findTaskAndSource(taskId);
    // Allow changing subject only for finished tasks
    if (!task || sourceArray !== finishedTasks) {
        console.warn("Cannot change subject for non-finished task:", task);
        showNotification("Subject can only be changed for tasks in the Finished list.", {error: true});
        hideTaskMenu();
        return;
    }
    taskToChangeSubject = taskId;
    changeSubjectTaskNameEl.textContent = task.name;
    populateSubjectDropdowns(); // Ensure list is fresh
    editSubjectSelect.value = task.subject || ""; // Set current subject (use "" for null/Uncategorized)
    openModal(changeSubjectModal);
    hideTaskMenu(); // Hide task menu after opening modal
}

cancelSubjectChangeBtn.addEventListener('click', () => {
    closeModal(changeSubjectModal);
    // taskToChangeSubject is cleared in closeModal
});

saveSubjectChangeBtn.addEventListener('click', () => {
    if (!taskToChangeSubject) return;
    const { task, sourceArray } = findTaskAndSource(taskToChangeSubject);
    if (!task || sourceArray !== finishedTasks) {
         console.error("Task not found or not finished while saving subject change.");
         closeModal(changeSubjectModal);
         return;
    }

    let newSubject = editSubjectSelect.value; // Original casing or ""
     // Handle Add New Subject case if implemented in this modal
     if (newSubject === '_new_subject_') {
         // Logic to handle adding a new subject here would be needed
         showNotification("Adding new subjects is not supported here. Please add via the main task form first.", { error: true }); return;
     }
    if (newSubject === "") newSubject = null; // Uncategorized

    if (task.subject !== newSubject) { // Only save if changed
        const oldSubject = task.subject || "Uncategorized";
        task.subject = newSubject; // Update with original casing or null
        saveState();
        showNotification(`Subject for "${task.name}" changed from "${escapeHtml(oldSubject)}" to "${escapeHtml(newSubject || 'Uncategorized')}".`);
        renderTasks(); // Re-render the finished list (or whichever tab is active)
    }
    closeModal(changeSubjectModal);
    // taskToChangeSubject is cleared in closeModal
});


// Notification Modal
function showNotification(message, options = { confirm: false, danger: false, error: false }) {
    return new Promise((resolve) => {
        notificationMessageEl.textContent = message;
        notificationButtonsEl.innerHTML = ''; // Clear previous buttons
        notificationMessageEl.className = 'notification-message'; // Reset classes

        // Add styling for error/danger
        if (options.error) notificationMessageEl.classList.add('error-message');
        if (options.danger) notificationMessageEl.classList.add('danger-message');

        if (options.confirm) {
            const yesBtn = document.createElement('button');
            yesBtn.textContent = 'Yes';
            yesBtn.classList.add(options.danger ? 'danger-button' : 'primary-button'); // Style based on danger flag
            yesBtn.classList.add('confirm-yes-button'); // Add class for easier selection
            yesBtn.addEventListener('click', () => {
                closeModal(notificationModal);
                resolve(true);
            }, { once: true });

            const noBtn = document.createElement('button');
            noBtn.textContent = 'No';
            noBtn.classList.add('secondary-button');
            noBtn.classList.add('confirm-no-button'); // Add class for easier selection
            noBtn.addEventListener('click', () => {
                closeModal(notificationModal);
                resolve(false);
            }, { once: true });

            // Order: No (Cancel/Safe) then Yes (Confirm/Destructive) typically
            notificationButtonsEl.appendChild(noBtn);
            notificationButtonsEl.appendChild(yesBtn);
            noBtn.focus(); // Focus the less destructive option by default

        } else {
            const okBtn = document.createElement('button');
            okBtn.textContent = 'OK';
            okBtn.classList.add('primary-button');
            okBtn.classList.add('confirm-ok-button'); // Add class for easier selection
            okBtn.addEventListener('click', () => {
                closeModal(notificationModal);
                resolve(true); // Simple notification resolves true
            }, { once: true });
            notificationButtonsEl.appendChild(okBtn);
            okBtn.focus();
        }
        openModal(notificationModal);
    });
}


// --- Task Menu ---
function showTaskMenu(button, taskId) {
    const { task } = findTaskAndSource(taskId);
    const listContext = getListContext(button.closest('.tab-panel')); // Find context from panel
    if (!task || !listContext) {
        console.warn("Could not find task or list context for menu.", taskId, listContext);
        return;
    }

    taskMenu.dataset.taskId = taskId;

    // Enable/disable 'Move Task' based on context (only for 'current' list)
    moveTaskBtn.style.display = (listContext === 'current') ? 'block' : 'none';
    moveTaskBtn.disabled = (listContext !== 'current');

    // Enable/disable 'Change Subject' based on context (only for 'finished' list)
    changeSubjectMenuBtn.style.display = (listContext === 'finished') ? 'block' : 'none';
    changeSubjectMenuBtn.disabled = (listContext !== 'finished');

    // Add 'Edit Due Date' button (if needed later) - always shown for 'current' tasks?
    // const editDueDateBtn = document.getElementById('edit-due-date-btn'); // Assume it exists
    // editDueDateBtn.style.display = (listContext === 'current') ? 'block' : 'none';
    // editDueDateBtn.disabled = (listContext !== 'current');

    // --- Positioning Logic ---
    const rect = button.getBoundingClientRect();
    const appRect = app.getBoundingClientRect(); // Use app container for relative positioning

    taskMenu.style.display = 'block'; // Make visible *before* calculating position
    taskMenu.setAttribute('aria-hidden', 'false');

    const menuHeight = taskMenu.offsetHeight;
    const menuWidth = taskMenu.offsetWidth;
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Default: position below and slightly aligned with left edge
    let top = rect.bottom - appRect.top + scrollY + 2;
    let left = rect.left - appRect.left + scrollX;

    // Adjust if menu goes off bottom of viewport (consider app height)
    if (top + menuHeight > window.innerHeight + scrollY) {
        top = rect.top - appRect.top + scrollY - menuHeight - 2; // Position above button
    }
     // Adjust if menu goes off right of viewport (consider app width)
     if (left + menuWidth > appRect.width + scrollX) {
         left = rect.right - appRect.left + scrollX - menuWidth; // Align right edge
     }
     // Adjust if menu goes off left of viewport
     if (left < scrollX) {
         left = scrollX;
     }
     // Adjust if menu goes off top of viewport
     if (top < scrollY) {
          top = scrollY;
     }

    // Ensure position is within the app boundaries if absolutely needed,
    // but viewport boundaries are usually more relevant.
    // left = Math.max(0, Math.min(left, appRect.width - menuWidth));
    // top = Math.max(0, Math.min(top, appRect.height - menuHeight));


    taskMenu.style.top = `${top}px`;
    taskMenu.style.left = `${left}px`;
}


function hideTaskMenu() {
    if (taskMenu.style.display === 'block') {
        taskMenu.style.display = 'none';
        taskMenu.setAttribute('aria-hidden', 'true');
        taskMenu.removeAttribute('data-task-id');
    }
}

// --- Options Menu ---
function hideOptionsMenu() {
    if (optionsMenu.style.display === 'block') {
        optionsMenu.style.display = 'none';
        optionsMenu.setAttribute('aria-hidden', 'true');
        optionsBtn.setAttribute('aria-expanded', 'false');
    }
}

// --- Selection Mode ---
function toggleSelectionMode() {
    selectionMode = !selectionMode;
    const currentPanel = tabContent.querySelector('.tab-panel.active');
    const listContext = currentPanel ? getListContext(currentPanel) : null;

    // Selection mode only makes sense for 'current' and 'finished' lists
    const allowSelection = listContext === 'current' || listContext === 'finished';

    if (selectionMode && allowSelection) {
        // Entering selection mode
        deleteSelectedBtn.style.display = 'block';
        clearSelectedBtn.textContent = 'Cancel Selection';
        clearSelectedBtn.title = 'Exit selection mode';
        if (currentPanel) currentPanel.classList.add('selection-active');
        renderTasks(); // Re-render to show checkboxes
    } else {
        // Exiting selection mode (or not allowed on current tab)
        selectionMode = false; // Ensure it's off
        deleteSelectedBtn.style.display = 'none';
        clearSelectedBtn.textContent = 'Select Tasks...';
        clearSelectedBtn.title = 'Select multiple tasks for deletion';
        // Remove selection class from all panels just in case
        tabContent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('selection-active'));
        // Uncheck any visible checkboxes
        if (currentPanel) {
            currentPanel.querySelectorAll('.select-task:checked').forEach(cb => cb.checked = false);
        }
        if (allowSelection) {
            renderTasks(); // Re-render to hide checkboxes
        }
    }

    hideOptionsMenu(); // Close options menu after toggling
}


async function deleteSelectedTasks() {
     // Ensure we query within the currently active panel only
     const currentPanel = tabContent.querySelector('.tab-panel.active');
     if (!currentPanel) return; // Should not happen

    const selectedCheckboxes = currentPanel.querySelectorAll('.select-task:checked');
    const selectedIds = Array.from(selectedCheckboxes).map(cb => cb.dataset.id);

    if (selectedIds.length === 0) {
        await showNotification('No tasks selected.');
        // Do not exit selection mode here, let user cancel explicitly or delete something
        return;
    }

    const listContext = getListContext(currentPanel); // 'current' or 'finished'
    const confirmMessage = `Delete ${selectedIds.length} selected task(s) from the ${listContext} list permanently?`;
    const confirmClear = await showNotification(confirmMessage, { confirm: true, danger: true });

    if (confirmClear) {
        let deletedCount = 0;
        let activeTaskDeleted = false;
        selectedIds.forEach(id => {
            const { task, sourceArray } = findTaskAndSource(id);
             if (task) {
                // Check if deleting the active task
                if (activeTask && activeTask.id === id) {
                    if (timerInterval) clearInterval(timerInterval);
                    timerInterval = null;
                    activeTask = null;
                    activeTaskDeleted = true;
                }
                // Filter out the task from its source array
                if (sourceArray === currentTasks) currentTasks = currentTasks.filter(t => t.id !== id);
                else if (sourceArray === exerciseTasks) exerciseTasks = exerciseTasks.filter(t => t.id !== id);
                else if (sourceArray === rewardTasks) rewardTasks = rewardTasks.filter(t => t.id !== id);
                else if (sourceArray === finishedTasks) finishedTasks = finishedTasks.filter(t => t.id !== id);
                deletedCount++;
             }
        });

        if(deletedCount > 0) {
            await sendTelegramUpdate(`Deleted ${deletedCount} selected tasks from ${listContext} list.`);
            saveState();
            // If active task was deleted, update necessary UI
            if (activeTaskDeleted) {
                updateCreditWallet(); // Update in case credits changed (though delete doesn't)
                calculateEndTime(); // Recalculate end time
            }
        }
        // Exit selection mode after successful deletion
        toggleSelectionMode(); // This will re-render the list
    }
    // If user cancels deletion, remain in selection mode.
}


// --- Drag and Drop ---
function addDragDropListeners(listElement, listContextType) { // listContextType: 'current' (only needed for current)
     if (listContextType !== 'current') return; // Only add listeners for the current tasks list

     // Drag Start on List Item (delegated from UL)
     listElement.addEventListener('dragstart', (e) => {
         const li = e.target.closest('li[draggable="true"]'); // Only start if draggable is explicitly true
         if (!li) {
            e.preventDefault(); // Not a draggable item
            return;
         }
         if (li.dataset.id !== draggableTaskId) {
             e.preventDefault(); // Prevent dragging if not the task selected via 'Move'
             return;
         }

         // Check if the item belongs to this listElement (safety check)
         if (!listElement.contains(li)) {
            e.preventDefault();
            return;
         }

         e.dataTransfer.setData('text/plain', li.dataset.id);
         e.dataTransfer.effectAllowed = 'move';
         setTimeout(() => li.classList.add('dragging'), 0); // Style feedback
         // console.log('Drag Start:', li.dataset.id);
     });

     // Drag Over List Item or List (delegated from UL)
     listElement.addEventListener('dragover', (e) => {
         // Allow drop only if a task is being dragged (draggableTaskId is set)
         // and we are over the list element or one of its children
         if (!draggableTaskId || !listElement.contains(e.target)) {
            return;
         }

         const draggedLi = listElement.querySelector(`li[data-id="${draggableTaskId}"]`);
         const targetLi = e.target.closest('li');

         // Prevent dropping onto itself
         if (targetLi && targetLi.dataset.id === draggableTaskId) {
             clearDragOverStyles(listElement); // Clear styles if hovering over self
             return;
         }

         // Prevent dropping if targetLi is the element being dragged (should be covered above, but belt-and-suspenders)
         if (draggedLi && targetLi === draggedLi) {
             return;
         }

         e.preventDefault(); // Allow drop
         e.dataTransfer.dropEffect = 'move';

         // Add visual cue for drop target
         clearDragOverStyles(listElement); // Clear previous cues
         if (targetLi) {
            // Determine if dropping above or below the target li
            const rect = targetLi.getBoundingClientRect();
            const offsetY = e.clientY - rect.top;
            if (offsetY < rect.height / 2) {
                targetLi.classList.add('drag-over-top');
            } else {
                targetLi.classList.add('drag-over-bottom');
            }
        } else {
            // Add style to the list itself if dropping in empty area
             listElement.classList.add('drag-over-list');
        }
     });

      // Drag Leave List Item or List (delegated from UL)
      listElement.addEventListener('dragleave', (e) => {
         // Only clear if leaving the list element boundary or moving to a non-droppable child
         if (!listElement.contains(e.relatedTarget) || (e.relatedTarget && !e.relatedTarget.closest('li'))) {
            clearDragOverStyles(listElement);
         } else {
             // Clear specific item highlight if moving between items
             const li = e.target.closest('li');
             if(li) {
                  li.classList.remove('drag-over-top', 'drag-over-bottom');
             }
         }
      });

     // Drag End on List Item (delegated from UL)
     listElement.addEventListener('dragend', (e) => {
        // This event fires on the source element after drag completion (drop or cancel)
         const li = e.target.closest('li');
         if (li) {
             li.classList.remove('dragging');
         }
         clearDragOverStyles(listElement); // Clear styles on drag end regardless of success

          // If dropEffect is 'none', drag was cancelled (e.g., Esc key)
          // Reset draggable state ONLY if cancelled. Drop handler resets on success.
         if (e.dataTransfer.dropEffect === 'none') {
             if(draggableTaskId === li?.dataset.id) { // Ensure we only reset if the ended drag matches our state
                draggableTaskId = null;
                renderTasks(); // Re-render to remove draggable attribute
             }
         }
     });

     // Drop on List Item or List (delegated from UL)
     listElement.addEventListener('drop', (e) => {
         e.preventDefault(); // Prevent default drop behavior (like opening link)
         e.stopPropagation(); // Prevent drop event bubbling up

         const droppedOnLi = e.target.closest('li');
         const draggedId = e.dataTransfer.getData('text/plain');

         // Ensure we are dropping the task selected via 'Move' and data is present
         if (!draggedId || draggedId !== draggableTaskId) {
             console.warn("Drop cancelled: Mismatched or missing drag data.", draggedId, draggableTaskId);
             clearDragOverStyles(listElement);
             // Reset state if something went wrong mid-drag
             if (draggableTaskId) {
                 draggableTaskId = null;
                 renderTasks();
             }
             return;
         }

         const targetId = droppedOnLi ? droppedOnLi.dataset.id : null; // ID of the item dropped onto, or null if dropped on empty space within this UL

          // --- Find Tasks and Arrays ---
          // We know it must be in currentTasks, exerciseTasks, or rewardTasks because drag is only enabled there
          const { task: draggedTask, sourceArray: draggedSourceArray, type: draggedType } = findTaskAndSource(draggedId);

          if (!draggedTask || !draggedSourceArray || draggedSourceArray === finishedTasks) {
               console.error("Dropped task not found in current lists or is finished!", draggedId);
               clearDragOverStyles(listElement);
               draggableTaskId = null; // Reset state
               renderTasks(); // Re-render to ensure correct state
               return;
           }

         // --- Determine Target Position ---
         let targetIndex = -1;
         let targetArray = draggedSourceArray; // Start by assuming drop is within the same array

         if (targetId) { // Dropped onto another task
             const { task: targetTask, sourceArray: targetSourceArray, type: targetType } = findTaskAndSource(targetId);
             if (!targetTask || !targetSourceArray || targetSourceArray === finishedTasks) {
                 console.error("Target task for drop not found or is finished!", targetId);
                 clearDragOverStyles(listElement);
                 draggableTaskId = null; renderTasks(); return;
             }
             // *** Crucial: Only allow dropping within the *same* source array type ***
             if (targetSourceArray !== draggedSourceArray) {
                 console.warn(`Cannot move task between different types (${draggedType} to ${targetType}). Drop cancelled.`);
                 showNotification("Tasks can only be reordered within their own type (Study, Exercise, or Reward).", {error: true});
                 clearDragOverStyles(listElement);
                 // Don't reset draggableTaskId here, let dragend handle cancellation visual reset
                 // However, we *must* clear the drag over styles
                 return;
             }

             targetArray = targetSourceArray; // Confirmed target array
             const idx = targetArray.findIndex(t => t.id === targetId);

             // Determine if dropping above or below the target li based on classes added in dragover
             if (droppedOnLi.classList.contains('drag-over-top')) {
                 targetIndex = idx; // Insert *before* target
             } else if (droppedOnLi.classList.contains('drag-over-bottom')) {
                 targetIndex = idx + 1; // Insert *after* target
             } else {
                  // Fallback if classes somehow missing? Assume dropping before.
                  console.warn("Drop position class missing, assuming drop before target.");
                  targetIndex = idx;
             }

         } else { // Dropped onto empty space in the list (implies end of that list's task type)
             // Target array remains the dragged task's source array
             targetIndex = targetArray.length; // Insert at the end
         }

          // --- Perform Reordering ---
          if (targetArray && targetIndex !== -1) {
             // Find index in the source array (needed for splice removal)
             const draggedIndexInSource = draggedSourceArray.findIndex(t => t.id === draggedId);

             if (draggedIndexInSource !== -1) {
                 // Remove from original position
                 const [movedTask] = draggedSourceArray.splice(draggedIndexInSource, 1);

                 // Adjust target index if removing from *before* the target *in the same array*
                 if (targetArray === draggedSourceArray && targetIndex > draggedIndexInSource) {
                      targetIndex--;
                 }

                 // Insert at the new position
                 targetArray.splice(targetIndex, 0, movedTask);

                 console.log(`Moved task ${draggedId} in ${draggedType} list`);
                 saveState();
             } else {
                  console.error("Could not find dragged task in its source array for removal.");
             }
         } else {
              console.warn("Drop target array or index invalid. Reordering cancelled.");
         }

         // --- Cleanup ---
         clearDragOverStyles(listElement); // Clear styles from the target list
         draggableTaskId = null; // Reset the global dragging state variable
         renderTasks(); // Re-render the UI to reflect the new order and remove draggable attribute
     });
}


function clearDragOverStyles(listElement) {
     listElement.querySelectorAll('.drag-over-top, .drag-over-bottom').forEach(el => el.classList.remove('drag-over-top', 'drag-over-bottom'));
     listElement.classList.remove('drag-over-list');
}

// --- Telegram Updates ---
async function sendTelegramUpdate(message) {
    // console.log("Attempting to send Telegram message:", message); // Less verbose logging
    if (!botToken || !chatId || botToken === "YOUR_BOT_TOKEN" || chatId === "YOUR_CHAT_ID") {
        // console.log("Telegram bot not configured. Skipping message.");
        return; // Don't try if not configured
    }
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const payload = {
        chat_id: chatId,
        text: `[StudyFocus] ${message}`, // Add app identifier
        parse_mode: 'Markdown' // Optional: Allows some basic formatting like *bold* or _italic_
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            let errorDetails = `Status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorDetails += `, Message: ${errorData.description}`;
            } catch (jsonError) {
                 // If response is not JSON, read as text
                 try {
                    const textResponse = await response.text();
                    errorDetails += `, Response: ${textResponse.substring(0, 100)}...`; // Limit length
                 } catch (textError) {
                    errorDetails += ', Could not read error response body.'
                 }
            }
            throw new Error(`HTTP error! ${errorDetails}`);
        }
        // console.log("Telegram update sent successfully!"); // Only log success if needed
    } catch (e) {
        console.error("Failed to send Telegram message:", e);
        // Avoid flooding with notifications about failing to notify
        // showNotification("Failed to send status update via Telegram.", { error: true });
    }
}

async function sendTelegramError(context, error) {
     let errorMessage = `Error in ${context}:\n`;
     if (error instanceof Error) {
         errorMessage += `${error.name}: ${error.message}\n${error.stack ? error.stack.substring(0, 300) + '...' : ''}`; // Limit stack trace length
     } else if (typeof error === 'string') {
          errorMessage += error;
     }
     else {
         try {
             errorMessage += JSON.stringify(error);
         } catch (e) {
             errorMessage += "Could not stringify error object.";
         }
     }
     // Prepend identifier within the function call
     await sendTelegramUpdate(`⚠️ **APP ERROR** ⚠️\n${errorMessage}`);
}

// --- Utility ---
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        // console.warn("escapeHtml called with non-string value:", unsafe);
        return String(unsafe); // Convert to string gracefully
    }
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}

// --- Global Event Listeners Setup ---
function setupEventListeners() {
    // Tab Navigation Clicks
    tabNavigation.addEventListener('click', (e) => {
        const button = e.target.closest('button[role="tab"]');
        if (button && !button.classList.contains('active')) {
            // Cancel drag mode if switching tabs
            if (draggableTaskId) {
                console.log("Cancelling drag due to tab switch.");
                const draggedLi = document.querySelector(`li[data-id="${draggableTaskId}"]`);
                if (draggedLi) draggedLi.classList.remove('dragging'); // Clean up style
                draggableTaskId = null;
                // Render will happen in switchTab anyway
            }
             // Cancel selection mode if switching tabs
             if (selectionMode) {
                 console.log("Cancelling selection mode due to tab switch.");
                 toggleSelectionMode(); // This handles UI reset and state change
             }
            switchTab(button.id);
        }
    });

    // Task Actions & Options (Delegated from Tab Content)
    tabContent.addEventListener('click', (e) => {
        // Handle Checkbox clicks in selection mode
        if (selectionMode && e.target.classList.contains('select-task')) {
            // No action needed here, just let the checkbox change state
            return;
        }

        const button = e.target.closest('button');
        if (!button) return; // Exit if click wasn't on or inside a button

        const li = button.closest('li[data-id]');
        if (!li) return; // Exit if button is not inside a list item with a data-id

        const taskId = li.dataset.id;
        if (!taskId) return; // Exit if taskId is missing

        // Prevent actions if selection mode is active, except for the task options button
        if (selectionMode && !button.classList.contains('task-options')) {
             showNotification("Exit selection mode to interact with tasks.");
             return;
         }

        // Prevent actions if drag mode is active (shouldn't happen often, but safety)
        if (draggableTaskId && !button.classList.contains('task-options')) {
            showNotification("Finish or cancel task reordering first.");
            return;
        }

        if (button.classList.contains('play-btn') && !button.disabled) {
            startTask(taskId).catch(err => {
                console.error("Error starting task:", err);
                sendTelegramError("startTask click handler", err);
            });
        } else if (button.classList.contains('pause-btn')) {
            pauseTask(taskId).catch(err => {
                 console.error("Error pausing task:", err);
                 sendTelegramError("pauseTask click handler", err);
            });
        } else if (button.classList.contains('stop-btn')) {
            stopTask(taskId).catch(err => {
                 console.error("Error stopping task:", err);
                 sendTelegramError("stopTask click handler", err);
            });
        } else if (button.classList.contains('task-options')) {
            // If a task is currently being dragged, prevent opening menu
            if (draggableTaskId) {
                console.log("Task menu blocked during drag operation.");
                return;
            }
             // If selection mode is active, prevent opening menu
             if (selectionMode) {
                  console.log("Task menu blocked during selection mode.");
                  return;
             }
            showTaskMenu(button, taskId);
        }
    });

     // Task Menu Actions
     deleteTaskBtn.addEventListener('click', () => {
        const taskId = taskMenu.dataset.taskId;
        if (taskId) {
            // deleteTask asks for confirmation internally and hides menu
            deleteTask(taskId).catch(err => {
                 console.error("Error deleting task from menu:", err);
                 sendTelegramError("deleteTaskBtn click handler", err);
                 hideTaskMenu(); // Ensure menu hides on error too
            });
        } else {
            hideTaskMenu(); // Hide menu if no task ID somehow
        }
     });

     moveTaskBtn.addEventListener('click', () => {
         const taskId = taskMenu.dataset.taskId;
         if (taskId && !moveTaskBtn.disabled) { // Check disabled state
             draggableTaskId = taskId; // Set the task ID that can be dragged
             hideTaskMenu();
             renderTasks(); // Re-render to make the selected task draggable
             showNotification("Drag and drop enabled for this task. Move it to the desired position within its list (Study, Exercise, or Reward). Release to drop.", { /* autoDismiss: 5000 */ });
         } else {
              hideTaskMenu(); // Hide menu if disabled or no task ID
         }
     });

     changeSubjectMenuBtn.addEventListener('click', () => {
         const taskId = taskMenu.dataset.taskId;
         if (taskId && !changeSubjectMenuBtn.disabled) { // Check disabled state
            openChangeSubjectModal(taskId); // Handles hiding task menu internally
         } else {
              hideTaskMenu(); // Hide menu if disabled or no task ID
         }
     });

     // Add listener for Edit Due Date if button exists


    // Options Menu Button
    optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing immediately via global listener
        // Toggle visibility
        const isVisible = optionsMenu.style.display === 'block';
        if (isVisible) {
            hideOptionsMenu();
        } else {
            optionsMenu.style.display = 'block';
            optionsMenu.setAttribute('aria-hidden', 'false');
            optionsBtn.setAttribute('aria-expanded', 'true');
            // Focus first item when opening
            optionsMenu.querySelector('button, a, select')?.focus();
        }
    });

    // Options Menu Actions
     clearAllBtn.addEventListener('click', async () => {
         hideOptionsMenu();
         const confirmClear = await showNotification('Are you sure you want to clear ALL tasks, subjects, and credits? This cannot be undone.', { confirm: true, danger: true });
         if (confirmClear) {
             if (timerInterval) clearInterval(timerInterval);
             activeTask = null;
             currentTasks = [];
             exerciseTasks = [];
             rewardTasks = [];
             finishedTasks = [];
             availableSubjects = ["Work", "Personal", "Learning"]; // Reset subjects
             totalCredits = 0;
             activeTabId = 'tab-current';
             collapsedSubjects = {};
             collapsedCurrentSubjects = {};
             creditManagementOption = 'none';
             dailyDecayPercent = 10;
             lastCreditCheckDate = null; // Reset check date too
             selectionMode = false; // Ensure selection mode is off
             draggableTaskId = null; // Ensure drag mode is off
             // Reset theme to system preference on clear all? Or keep current? Let's keep current.
             // darkModeEnabled = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

             localStorage.removeItem('studyFocusState'); // Clear storage
             // Need to save the *current* dark mode state after clearing
             saveState();
             applyTheme(); // Re-apply theme based on current (potentially default) state
             populateSubjectDropdowns();
             updateCreditOptionsUI();
             switchTab('tab-current'); // Switch back to current and render empty state
             updateFinishedTime(); // Update total finished time display (will be 0)
             showNotification("All data has been cleared.");
             await sendTelegramUpdate("All user data cleared via options menu.");
         }
     });

    clearSelectedBtn.addEventListener('click', toggleSelectionMode); // Toggles selection mode or cancels if active
    deleteSelectedBtn.addEventListener('click', deleteSelectedTasks); // Deletes selected if in selection mode
    exportBtn.addEventListener('click', exportData);
    importBtn.addEventListener('click', () => importFileEl.click()); // Open file dialog
    importFileEl.addEventListener('change', function() { // Use 'function' for 'this'
        if (this.files && this.files[0]) {
            importData(this.files[0]);
        }
        // Reset file input value so the same file can be selected again if needed
        this.value = "";
        hideOptionsMenu(); // Close menu after initiating import
    });
    toggleDarkModeBtn.addEventListener('click', toggleTheme); // Added listener for dark mode toggle
    // manualAddFinishedBtn listener moved to its own section above closeModal

    // Credit Management Options
     creditResetSelect.addEventListener('change', () => {
        creditManagementOption = creditResetSelect.value;
        dailyDecayGroup.style.display = creditManagementOption === 'decay' ? 'block' : 'none';
        saveState();
        showNotification(`Credit management set to: ${creditManagementOption}. Changes apply daily.`);
     });
     dailyDecayInput.addEventListener('change', () => {
        let percent = parseInt(dailyDecayInput.value, 10);
        if(isNaN(percent) || percent < 0) percent = 0;
        if(percent > 100) percent = 100;
        dailyDecayPercent = percent;
        dailyDecayInput.value = percent; // Ensure value reflects sanitized number
        saveState();
        showNotification(`Daily decay rate set to ${percent}%.`);
     });
     dailyDecayInput.addEventListener('blur', () => { // Also update on blur in case user types and clicks away
         let percent = parseInt(dailyDecayInput.value, 10);
         if(isNaN(percent) || percent < 0) percent = 0;
         if(percent > 100) percent = 100;
         dailyDecayPercent = percent;
         dailyDecayInput.value = percent;
         saveState();
     });


    // Motivation Quote Navigation
    prevQuoteBtn.addEventListener('click', showPrevQuote);
    nextQuoteBtn.addEventListener('click', showNextQuote);

    // Global Click Listener (for closing menus/modals)
    document.addEventListener('click', (e) => {
        // Close options menu if clicking outside
        if (optionsMenu.style.display === 'block' && !optionsMenu.contains(e.target) && !optionsBtn.contains(e.target)) {
            hideOptionsMenu();
        }
        // Close task menu if clicking outside
        if (taskMenu.style.display === 'block' && !taskMenu.contains(e.target) && !e.target.closest('.task-options')) {
            hideTaskMenu();
        }
         // Close modals if clicking on the background overlay (the modal element itself)
        if (e.target.classList.contains('modal')) {
             // Check if the click was on the modal background itself, not on its content
             if (e.target === addTaskFormModal || e.target === manualFinishedFormModal || e.target === changeSubjectModal || e.target === notificationModal) {
                 // Find the cancel/no/ok button and simulate a click for consistent closing behavior
                 const closeButton = e.target.querySelector('#cancel-add, #cancel-finished-add, #cancel-subject-change-btn, .confirm-no-button, .confirm-ok-button');
                 if (closeButton) {
                     closeButton.click();
                 } else {
                     closeModal(e.target); // Fallback if no specific close button found
                 }
             }
        }
    });

    // Keyboard listeners (Spacebar, Escape)
    document.addEventListener('keydown', (e) => {
         const isModalOpen = !!document.querySelector('.modal[style*="display: flex"]');
         const isInputFocused = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);

        // Spacebar to toggle play/pause ONLY if no modal is open and no input is focused
        if (e.code === 'Space' && !isModalOpen && !isInputFocused) {
             e.preventDefault(); // Prevent page scroll
            if (activeTask && activeTask.state === 'running') {
                pauseTask(activeTask.id).catch(err => console.error("Spacebar pause error:", err));
            } else if (activeTask && activeTask.state === 'paused') {
                 // User interaction allows starting task
                 startTask(activeTask.id).catch(err => console.error("Spacebar resume error:", err));
             } else {
                // Find the *first* playable task in the *current tasks view* and start it
                // Ensure we only look at tasks displayed in the current view
                const allDisplayedTasks = [...currentTasks, ...exerciseTasks, ...rewardTasks].filter(t => t.state === 'not started');

                 if (allDisplayedTasks.length > 0) {
                     const firstPlayable = allDisplayedTasks.find(task => {
                         // Check if reward task has enough credits
                         return !(task.type === 'reward' && totalCredits < (task.requiredTime || 0));
                     });
                     if (firstPlayable) {
                        // User interaction allows starting task
                         startTask(firstPlayable.id).catch(err => console.error("Spacebar start first task error:", err));
                     }
                 }
            }
        }

        // Escape key handling
        if (e.key === 'Escape') {
            // Don't prevent default immediately, let inputs handle their own escape first maybe?
            // Or maybe we DO want to always override? Let's override for consistency.
            e.preventDefault();

             // Priority order for closing things with Escape
            if (draggableTaskId) {
                 console.log("Cancelling drag mode with Escape key.");
                 const draggedLi = document.querySelector(`li[data-id="${draggableTaskId}"]`);
                 if (draggedLi) draggedLi.classList.remove('dragging');
                 draggableTaskId = null; // Cancel drag mode
                 renderTasks(); // Re-render to remove draggable state
            } else if (taskMenu.style.display === 'block') {
                 hideTaskMenu();
            } else if (optionsMenu.style.display === 'block') {
                 hideOptionsMenu();
            } else if (selectionMode) {
                 toggleSelectionMode(); // Cancel selection mode
            } else if (isModalOpen) {
                 // Find the topmost/visible one
                const openModalElement = document.querySelector('.modal[style*="display: flex"]');
                if (openModalElement) {
                    // Find the cancel/no/ok button and click it programmatically
                    const closeButton = openModalElement.querySelector('#cancel-add, #cancel-finished-add, #cancel-subject-change-btn, .confirm-no-button, .confirm-ok-button');
                    if (closeButton) {
                        closeButton.click();
                    } else {
                        closeModal(openModalElement); // Fallback
                    }
                }
            } else if (document.activeElement && document.activeElement !== document.body) {
                // If nothing else to close, blur the currently focused element
                document.activeElement.blur();
            }
        }
    });


     // Handle window errors
     window.onerror = function (message, source, lineno, colno, error) {
        console.error("Unhandled Error:", message, source, lineno, colno, error);
        sendTelegramError(`Unhandled JS Error at ${source}:${lineno}:${colno}`, error || message).catch(e => console.error("Failed to send error report", e));
        // Avoid showing user notification for background errors unless critical
        // showNotification("An unexpected error occurred. Please check the console or report the issue.", { error: true });
        return true; // Prevents the default browser error handler
    };

    window.onunhandledrejection = function (event) {
        console.error("Unhandled Promise Rejection:", event.reason);
        // Avoid sending reports for common/ignorable promise rejections if needed
        if (event.reason && typeof event.reason.message === 'string' && event.reason.message.includes('The play() request was interrupted')) {
             console.warn("Audio play interrupted, likely by subsequent user action. Ignoring.");
             return; // Don't report common audio interruptions
         }
        sendTelegramError("Unhandled Promise Rejection", event.reason).catch(e => console.error("Failed to send error report", e));
        // showNotification("An unexpected promise error occurred.", { error: true });
    };
}