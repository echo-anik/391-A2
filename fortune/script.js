// Fortune Generator with Bonus Features
// Features: Random fortune display, style customization, fortune history with localStorage

// Array of 10+ fortunes (CRITICAL REQUIREMENT)
const fortunes = [
    "True wisdom comes not from knowledge, but from understanding.",
    "Your future is as bright as your determination to succeed.",
    "A journey of a thousand miles begins with a single step.",
    "The best time to plant a tree was 20 years ago. The second best time is now.",
    "Success is not final, failure is not fatal: courage to continue counts.",
    "Believe you can and you're halfway there.",
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Your limitation—it's only your imagination.",
    "Great things never come from comfort zones.",
    "Dream big and dare to fail.",
    "The harder you work for something, the greater you'll feel when you achieve it.",
    "Opportunities don't happen, you create them.",
    "Don't wait for opportunity. Create it.",
    "Everything you've ever wanted is on the other side of fear."
];

// Color and style arrays
const fontColors = ['#e74c3c', '#2c3e50', '#8e44ad', '#16a085', '#c0392b', '#d35400'];
const bgColors = ['#fff3cd', '#d1ecf1', '#d4edda', '#f8d7da', '#e2e3e5', '#ffeaa7'];
const borderColors = ['#ffc107', '#007bff', '#28a745', '#dc3545', '#6c757d', '#fd79a8'];
const fontStyles = [
    { family: 'Arial, sans-serif', size: '18px' },
    { family: 'Georgia, serif', size: '20px' },
    { family: '"Courier New", monospace', size: '16px' },
    { family: '"Times New Roman", serif', size: '19px' },
    { family: 'Verdana, sans-serif', size: '17px' },
    { family: '"Trebuchet MS", sans-serif', size: '18px' }
];

// State tracking
let fontColorIdx = 0;
let bgColorIdx = 0;
let borderColorIdx = 0;
let fontStyleIdx = 0;
let fortuneHistory = [];

// DOM elements
const fortuneText = document.getElementById('fortune-text');
const fortuneBox = document.getElementById('fortune-box');
const newFortuneBtn = document.getElementById('new-fortune-btn');
const historyList = document.getElementById('history-list');
const clearHistoryBtn = document.getElementById('clear-history-btn');

// BONUS FEATURE: localStorage for history
const HISTORY_KEY = 'fortuneHistory';

// Load fortune history from localStorage
function loadHistory() {
    const stored = localStorage.getItem(HISTORY_KEY);
    fortuneHistory = stored ? JSON.parse(stored) : [];
    renderHistory();
}

// Save fortune history to localStorage
function saveHistory() {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(fortuneHistory));
}

// Display random fortune (CRITICAL REQUIREMENT)
function displayRandomFortune() {
    const idx = Math.floor(Math.random() * fortunes.length);
    const selectedFortune = fortunes[idx];
    fortuneText.textContent = selectedFortune;

    // BONUS: Add to history with timestamp
    const timestamp = new Date().toLocaleString();
    fortuneHistory.unshift({ text: selectedFortune, time: timestamp });

    // Keep only last 10 fortunes
    if (fortuneHistory.length > 10) {
        fortuneHistory.pop();
    }

    saveHistory();
    renderHistory();
}

// BONUS: Render fortune history
function renderHistory() {
    historyList.innerHTML = '';
    fortuneHistory.forEach(fortune => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${fortune.time}</strong><br>${fortune.text}`;
        historyList.appendChild(li);
    });
}

// BONUS: Clear fortune history
function clearHistory() {
    if (confirm('Are you sure you want to clear your fortune history?')) {
        fortuneHistory = [];
        saveHistory();
        renderHistory();
    }
}

// Button handlers for style customization
document.getElementById('font-color-btn').onclick = () => {
    fontColorIdx = (fontColorIdx + 1) % fontColors.length;
    fortuneText.style.color = fontColors[fontColorIdx];
};

document.getElementById('bg-color-btn').onclick = () => {
    bgColorIdx = (bgColorIdx + 1) % bgColors.length;
    fortuneBox.style.backgroundColor = bgColors[bgColorIdx];
};

document.getElementById('border-color-btn').onclick = () => {
    borderColorIdx = (borderColorIdx + 1) % borderColors.length;
    fortuneBox.style.borderColor = borderColors[borderColorIdx];
};

document.getElementById('font-style-btn').onclick = () => {
    fontStyleIdx = (fontStyleIdx + 1) % fontStyles.length;
    const style = fontStyles[fontStyleIdx];
    fortuneText.style.fontFamily = style.family;
    fortuneText.style.fontSize = style.size;
};

// BONUS: Button to generate new fortune
newFortuneBtn.onclick = displayRandomFortune;

// BONUS: Clear history button
clearHistoryBtn.onclick = clearHistory;

// Initialize on page load (CRITICAL REQUIREMENT)
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    displayRandomFortune();
});
