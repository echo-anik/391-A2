// Stopwatch with Bonus Features
// Features: 3-second intervals, auto-stop at 30s, lap times, session statistics with localStorage

// CRITICAL: Configuration constants
const MAX_TIME = 30;
const INCREMENT = 3;

// State variables
let currentTime = 0;
let isRunning = false;
let intervalId = null;
let lapTimes = [];
let sessionStats = {
    totalSessions: 0,
    totalCompletions: 0
};

// DOM elements
const display = document.getElementById('display');
const status = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const stopBtn = document.getElementById('stop-btn');
const resetBtn = document.getElementById('reset-btn');
const lapBtn = document.getElementById('lap-btn');
const lapList = document.getElementById('lap-list');
const progressFill = document.getElementById('progress-fill');
const totalSessionsEl = document.getElementById('total-sessions');
const totalCompletionsEl = document.getElementById('total-completions');

// BONUS: localStorage keys
const STATS_KEY = 'stopwatchStats';

// BONUS: Load statistics from localStorage
function loadStats() {
    const stored = localStorage.getItem(STATS_KEY);
    if (stored) {
        sessionStats = JSON.parse(stored);
        updateStatsDisplay();
    }
}

// BONUS: Save statistics to localStorage
function saveStats() {
    localStorage.setItem(STATS_KEY, JSON.stringify(sessionStats));
    updateStatsDisplay();
}

// BONUS: Update statistics display
function updateStatsDisplay() {
    totalSessionsEl.textContent = sessionStats.totalSessions;
    totalCompletionsEl.textContent = sessionStats.totalCompletions;
}

// Update display
function updateDisplay() {
    display.textContent = currentTime;

    // BONUS: Update progress bar
    const progress = (currentTime / MAX_TIME) * 100;
    progressFill.style.width = `${progress}%`;
}

// Show status message
function showStatus(msg, type) {
    status.textContent = msg;
    status.className = `status-${type}`;
}

// CRITICAL: Start with 3-second interval
function start() {
    if (isRunning || currentTime >= MAX_TIME) return;

    isRunning = true;
    startBtn.disabled = true;
    stopBtn.disabled = false;
    lapBtn.disabled = false;
    showStatus('Running...', 'running');

    // BONUS: Increment session count on first start
    if (currentTime === 0) {
        sessionStats.totalSessions++;
        saveStats();
    }

    intervalId = setInterval(() => {
        currentTime += INCREMENT;
        updateDisplay();

        // CRITICAL: Auto-stop at 30 seconds
        if (currentTime >= MAX_TIME) {
            stop();
            showStatus('Completed!', 'complete');

            // BONUS: Increment completion count
            sessionStats.totalCompletions++;
            saveStats();

            // BONUS: Play completion animation
            display.style.animation = 'pulse 0.5s ease';
            setTimeout(() => {
                display.style.animation = '';
            }, 500);
        }
    }, INCREMENT * 1000); // 3000ms
}

// CRITICAL: Stop but preserve currentTime for resume
function stop() {
    if (!isRunning) return;

    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
    startBtn.disabled = false;
    stopBtn.disabled = true;
    lapBtn.disabled = true;

    if (currentTime < MAX_TIME) {
        showStatus(`Paused at ${currentTime}s`, 'stopped');
    }
}

// Reset stopwatch
function reset() {
    stop();
    currentTime = 0;
    lapTimes = [];
    updateDisplay();
    renderLaps();
    showStatus('Reset', 'stopped');
}

// BONUS: Record lap time
function recordLap() {
    if (!isRunning) return;

    const lapNumber = lapTimes.length + 1;
    lapTimes.push({
        lap: lapNumber,
        time: currentTime
    });
    renderLaps();
}

// BONUS: Render lap times
function renderLaps() {
    lapList.innerHTML = '';
    lapTimes.forEach(lap => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>Lap ${lap.lap}</span>
            <span>${lap.time}s</span>
        `;
        lapList.appendChild(li);
    });
}

// Event listeners
startBtn.onclick = start;
stopBtn.onclick = stop;
resetBtn.onclick = reset;
lapBtn.onclick = recordLap;

// BONUS: Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (isRunning) {
            stop();
        } else if (currentTime < MAX_TIME) {
            start();
        }
    } else if (e.code === 'KeyR') {
        reset();
    } else if (e.code === 'KeyL' && isRunning) {
        recordLap();
    }
});

// Add pulse animation to CSS via JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); color: #28a745; }
    }
`;
document.head.appendChild(style);

// Initialize
loadStats();
updateDisplay();
