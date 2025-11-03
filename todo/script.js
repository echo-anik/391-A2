// To-Do List with Bonus Features
// Features: Add, delete, complete tasks, localStorage persistence, search, priority, stats, import/export

// CRITICAL: localStorage key
const STORAGE_KEY = 'todos';

let tasks = [];
let currentFilter = 'all';
let searchTerm = '';

// DOM elements
const taskInput = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const clearCompletedBtn = document.getElementById('clear-completed');
const filterBtns = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('search-input');
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const completionRateEl = document.getElementById('completion-rate');
const exportBtn = document.getElementById('export-btn');
const importBtn = document.getElementById('import-btn');
const fileInput = document.getElementById('file-input');

// CRITICAL: Load from localStorage on startup
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    tasks = stored ? JSON.parse(stored) : [];
}

// CRITICAL: Save to localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    updateStats();
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    if (!text) {
        alert('Please enter a task!');
        return;
    }

    // BONUS: Check for priority tags
    let priority = 'low';
    let taskText = text;
    if (text.includes('!!!')) {
        priority = 'high';
        taskText = text.replace(/!!!/g, '').trim();
    } else if (text.includes('!!')) {
        priority = 'medium';
        taskText = text.replace(/!!/g, '').trim();
    }

    tasks.push({
        id: Date.now(),
        text: taskText,
        completed: false,
        priority: priority,
        createdAt: new Date().toISOString()
    });

    taskInput.value = '';
    saveTasks();
    renderTasks();
}

// Delete task
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        if (task.completed) {
            task.completedAt = new Date().toISOString();
        } else {
            delete task.completedAt;
        }
        saveTasks();
        renderTasks();
    }
}

// BONUS: Edit task
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const newText = prompt('Edit task:', task.text);
        if (newText && newText.trim()) {
            task.text = newText.trim();
            saveTasks();
            renderTasks();
        }
    }
}

// Clear completed tasks
function clearCompleted() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount === 0) {
        alert('No completed tasks to clear!');
        return;
    }

    if (confirm(`Are you sure you want to delete ${completedCount} completed task(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        saveTasks();
        renderTasks();
    }
}

// Render tasks
function renderTasks() {
    taskList.innerHTML = '';

    // Filter tasks
    let filtered = tasks;
    if (currentFilter === 'active') {
        filtered = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filtered = tasks.filter(t => t.completed);
    }

    // BONUS: Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(t =>
            t.text.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // BONUS: Sort by priority (high > medium > low)
    filtered.sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Show empty state if no tasks
    if (filtered.length === 0) {
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-state';
        emptyDiv.innerHTML = `
            <div class="empty-state-icon">📭</div>
            <p>${searchTerm ? 'No tasks match your search' : 'No tasks yet. Add one above!'}</p>
        `;
        taskList.appendChild(emptyDiv);
    }

    // Render each task
    filtered.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item' + (task.completed ? ' completed' : '');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.onchange = () => toggleTask(task.id);

        // BONUS: Priority badge
        const priorityBadge = document.createElement('span');
        priorityBadge.className = `task-priority priority-${task.priority}`;
        priorityBadge.textContent = task.priority.toUpperCase();

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = task.text;

        // BONUS: Edit button
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '✏️';
        editBtn.title = 'Edit task';
        editBtn.onclick = () => editTask(task.id);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '🗑️';
        deleteBtn.title = 'Delete task';
        deleteBtn.onclick = () => deleteTask(task.id);

        li.appendChild(checkbox);
        li.appendChild(priorityBadge);
        li.appendChild(span);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });

    // Update count
    const activeCount = tasks.filter(t => !t.completed).length;
    taskCount.textContent = `${activeCount} active ${activeCount === 1 ? 'task' : 'tasks'}`;
}

// BONUS: Update productivity statistics
function updateStats() {
    const total = tasks.length;
    const completed = tasks.filter(t => t.completed).length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    totalTasksEl.textContent = total;
    completedTasksEl.textContent = completed;
    completionRateEl.textContent = `${rate}%`;
}

// BONUS: Export tasks to JSON
function exportTasks() {
    if (tasks.length === 0) {
        alert('No tasks to export!');
        return;
    }

    const dataStr = JSON.stringify(tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

// BONUS: Import tasks from JSON
function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedTasks = JSON.parse(e.target.result);
            if (!Array.isArray(importedTasks)) {
                throw new Error('Invalid format');
            }

            const confirmMsg = `Import ${importedTasks.length} tasks? This will replace your current tasks.`;
            if (confirm(confirmMsg)) {
                tasks = importedTasks;
                saveTasks();
                renderTasks();
                alert('Tasks imported successfully!');
            }
        } catch (error) {
            alert('Error importing tasks. Please check the file format.');
        }
    };
    reader.readAsText(file);

    // Reset file input
    fileInput.value = '';
}

// Event listeners
addBtn.onclick = addTask;
taskInput.onkeypress = (e) => {
    if (e.key === 'Enter') addTask();
};

clearCompletedBtn.onclick = clearCompleted;

filterBtns.forEach(btn => {
    btn.onclick = () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    };
});

// BONUS: Search functionality
searchInput.oninput = (e) => {
    searchTerm = e.target.value;
    renderTasks();
};

// BONUS: Export and Import
exportBtn.onclick = exportTasks;
importBtn.onclick = () => fileInput.click();
fileInput.onchange = importTasks;

// BONUS: Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInput.focus();
    }
    // Ctrl/Cmd + N to focus task input
    if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        taskInput.focus();
    }
});

// BONUS: Add tooltip for priority feature
taskInput.addEventListener('focus', () => {
    if (!taskInput.getAttribute('data-tooltip-shown')) {
        taskInput.title = 'Tip: Add !!! for high priority, !! for medium priority';
        taskInput.setAttribute('data-tooltip-shown', 'true');
    }
});

// CRITICAL: Initialize
loadTasks();
renderTasks();
