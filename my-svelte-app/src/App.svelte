<script>
  import { onMount } from 'svelte';
 
 let firstNames = ["Ali", "Ashley", "Ang", "Bradlee", "Bobbie", "Jose", "Wei", "Yan", "Andy", "Ying", "Jean", "Fransico", "Hong", "Fady", "Rich", "Rory", "Jorge", "Sammy"];
 let lastNames = ["Beaverton", "Affagato", "Consomme", "Vendetta", "Smiley", "Gorge", "Calamity", "Diamanté", "Blancmange", "Afterdinner", "Tobermory", "Futon", "Banquette", "Meringue", "Fingertip", "President", "Chapter", "Cookie", "Tennis-Smythe", "Badminton", "Flounder", "Crust", "Sandal"];
 let sceneryEmojis = ["🏡", "🌳", "🌲", "🌲", "🏡", "🌳", "🌲", "🌲", "🌳", "🏡"];
 let buildingEmojis = ["🏠", "🏢", "🏰", "🛕", "🏩", "🕍", "🏚️", "🏢", "🏬", "🏛️", "🏥", "💒", "🕌", "🏠", "🏦"];
 let peopleEmojis = ["🧍‍♂️", "🧍‍♀️", "🚶‍♀️", "🚶‍♂️", "🚶‍♀️‍➡️", "🚶‍♂️‍➡️"];
 
let missingPerson = {};
let firstName = "";
let lastName = "";
let isGameStarted = false;
let isGameWon = false;
let backgroundEmojis = [];
let peopleOnScreen = [];

// Constants for collision detection and grid
const EMOJI_SIZE = 30; // Size in pixels
const BUFFER = 10; // Extra space between emojis
const TOTAL_SPACE = EMOJI_SIZE + BUFFER;
const GRID_SIZE = 24; // Size of grid cells in pixels

// Function to convert pixel values to percentage
function pxToPercent(px, isWidth = true) {
    return (px / (isWidth ? window.innerWidth : window.innerHeight)) * 100;
}

// Function to snap to grid
function snapToGrid(value) {
    return Math.floor(value / GRID_SIZE) * GRID_SIZE;
}

// Function to generate a grid position with better vertical distribution
function generateGridPosition() {
    // Get the number of possible grid positions horizontally and vertically
    const gridCols = Math.floor((window.innerWidth - EMOJI_SIZE) / GRID_SIZE);
    const gridRows = Math.floor((window.innerHeight - EMOJI_SIZE) / GRID_SIZE);
    
    // Generate grid coordinates
    const gridX = Math.floor(Math.random() * gridCols);
    const gridY = Math.floor(Math.random() * gridRows);
    
    // Convert to pixels
    const x = gridX * GRID_SIZE;
    const y = gridY * GRID_SIZE;
    
    return {
        x: pxToPercent(x),
        y: pxToPercent(y)
    };
}

// Function to generate a free position (for people)
function generateFreePosition() {
    // Get available space in viewport
    const maxX = window.innerWidth - EMOJI_SIZE;
    const maxY = window.innerHeight - EMOJI_SIZE;
    
    // Generate position in pixels first
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    // Convert to percentages
    return {
        x: pxToPercent(x),
        y: pxToPercent(y)
    };
}

// Function to check if two positions overlap
function checkOverlap(pos1, pos2) {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return dx < pxToPercent(TOTAL_SPACE) && dy < pxToPercent(TOTAL_SPACE);
}

// Function to find a valid grid position
function findValidGridPosition(existingPositions) {
    let maxAttempts = 30;
    let attempts = 0;
    let newPos;
    
    do {
        newPos = generateGridPosition();
        attempts++;
        
        const hasOverlap = existingPositions.some(pos => checkOverlap(newPos, pos));
        
        if (!hasOverlap) {
            return newPos;
        }
    } while (attempts < maxAttempts);
    
    return generateGridPosition();
}

// Function to find a valid free position
function findValidFreePosition(existingPositions) {
    let maxAttempts = 100;
    let attempts = 0;
    let newPos;
    
    do {
        newPos = generateFreePosition();
        attempts++;
        
        const hasOverlap = existingPositions.some(pos => checkOverlap(newPos, pos));
        
        if (!hasOverlap) {
            return newPos;
        }
    } while (attempts < maxAttempts);
    
    return generateFreePosition();
}

function initializeGame() {
    firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    missingPerson = {
        emoji: peopleEmojis[Math.floor(Math.random() * peopleEmojis.length)],
        id: Math.random().toString(36).substr(2, 9)
    };
    
    backgroundEmojis = [];
    peopleOnScreen = [];
}

function setupGameScreen() {
    const allPositions = [];
    
    // Generate background elements with grid-aligned non-overlapping positions
    backgroundEmojis = [...sceneryEmojis, ...buildingEmojis].map(emoji => {
        const position = findValidGridPosition(allPositions);
        allPositions.push(position);
        return {
            emoji,
            x: position.x,
            y: position.y
        };
    });

    // Generate people with free (non-grid) non-overlapping positions
    const otherPeople = peopleEmojis
        .filter(emoji => emoji !== missingPerson.emoji)
        .map(emoji => {
            const position = findValidFreePosition(allPositions);
            allPositions.push(position);
            return {
                emoji,
                id: Math.random().toString(36).substr(2, 9),
                x: position.x,
                y: position.y
            };
        });

    // Add missing person with free position
    const missingPersonPosition = findValidFreePosition(allPositions);
    missingPerson = {
        ...missingPerson,
        x: missingPersonPosition.x,
        y: missingPersonPosition.y
    };
    
    peopleOnScreen = [...otherPeople, missingPerson];
}

onMount(() => {
    initializeGame();
});

function startGame() {
    isGameStarted = true;
    isGameWon = false;
    setupGameScreen();
}

function startNewGame() {
    initializeGame();
    isGameStarted = false;
    isGameWon = false;
}

function checkForWin(clickedPerson) {
    if (clickedPerson.id === missingPerson.id) {
        isGameWon = true;
    }
}

$: winMessage = isGameWon ? `Congratulations! You found ${firstName} ${lastName}!` : '';
</script>

<!-- Splash screen -->
{#if !isGameStarted}
<div class="splash-screen">
    <h1>Where is {firstName} {lastName}?</h1>
    <div class="emoji">{missingPerson.emoji}</div>
    <button on:click={startGame}>Search</button>
</div>
{/if}

<!-- Game screen -->
{#if isGameStarted && !isGameWon}
<div class="game-screen">
    {#each backgroundEmojis as emoji}
    <div 
        class="background-emoji" 
        style="top: {emoji.y}%; left: {emoji.x}%;">
        {emoji.emoji}
    </div>
    {/each}
    
    {#each peopleOnScreen as person}
    <button 
        class="person-emoji"
        style="top: {person.y}%; left: {person.x}%;"
        on:click={() => checkForWin(person)}>
        {person.emoji}
    </button>
    {/each}
</div>
{/if}

<!-- Win screen -->
{#if isGameWon}
<div class="win-screen">
    <h1>{winMessage}</h1>
    <button class="new-game-btn" on:click={startNewGame}>New Game</button>
</div>
{/if}

<style>
.splash-screen, .win-screen {
    text-align: center;
    margin-top: 50px;
}

.game-screen {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
}

.background-emoji {
    position: absolute;
    font-size: 3vw;
    z-index: 1;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.person-emoji {
    position: absolute;
    font-size: 3vw;
    background: none;
    border: none;
    cursor: pointer;
    z-index: 2;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    transition: transform 0.2s;
    background-color: transparent
}

.person-emoji:hover {
    transform: scale(1.1);
    background-color: transparent
}

.emoji {
    font-size: 5rem;
    margin: 20px 0;
}

button {
    margin-top: 20px;
    padding: 10px 20px;
    font-size: 1.2rem;
    border: 2px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.25s;
}

button:hover {
    background-color: #f0f0f0;
    border-color: #999;
}

.new-game-btn {
  margin-top: 20px;
    padding: 10px 20px;
    font-size: 1.2rem;
    border: 2px solid #ccc;
    border-radius: 5px;
    cursor: pointer;
    transition: all 0.25s;
}

.new-game-btn:hover {
    background-color: #45a049;
}

@media (max-width: 768px) {
    .background-emoji, .person-emoji {
        font-size: 8vw; 
    }
}

/* Styles for mobile phones */
@media (max-width: 480px) {
    .background-emoji, .person-emoji {
        font-size: 8vw; /* Adjust as needed for mobile */
    }
}
</style>