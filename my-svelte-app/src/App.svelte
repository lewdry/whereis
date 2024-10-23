<script>
    import { onMount, tick } from 'svelte';
    
    let firstNames = ["Ali", "Ashley", "Ang", "Bradlee", "Bobbie", "Jose", "Wei", "Yan", "Andy", "Ying", "Jean", "Fransico", "Hong", "Fady", "Rich", "Rory", "Jorge", "Sammy"];
    let lastNames = ["Beaverton", "Affagato", "Consomme", "Vendetta", "Smiley", "Gorge", "Keyboard", "Diamanté", "Blancmange", "Afterdinner", "Tobermory", "Futon", "Banquette", "Meringue", "Fingertip", "President", "Chapter", "Cookie", "Tennis-Smythe", "Badminton", "Flounder", "Crust", "Sandal", "Greenhouse", "Bassoon", "Foothold"];
    let sceneryEmojis = ["🌳", "🌲", "🎄", "🌴"];
    let buildingEmojis = ["🏠", "🏰", "🛕", "🏩", "🕍", "🏚️", "🏢", "🏬", "🏛️", "🏥", "💒", "🕌", "🏦", "🏟️", "🏫"];
    let peopleEmojis = ["🧍‍♂️", "🧍‍♀️", "💃", "🕺", "🧜", "🧘", "🤾", "👨‍🦼", "👩‍🦯‍➡️", "⛹️‍♀️", "🧚", "🤺", "🤸‍♀️", "🏌️‍♂️", "🪂", "🏇", "🏋️‍♀️"];
    
    let missingPerson = {};
    let firstName = "";
    let lastName = "";
    let isGameStarted = false;
    let isGameWon = false;
    let backgroundEmojis = [];
    let peopleOnScreen = [];
    let gameAreaWidth;
    let gameAreaHeight;
    let isInitialized = false;
    
    // Responsive sizing
    const getEmojiSize = () => {
        const width = window.innerWidth;
        if (width <= 480) return { size: 32, fontSize: '6vw' };
        if (width <= 768) return { size: 40, fontSize: '4vw' };
        return { size: 48, fontSize: '3vw' };
    };
    
    // Updated position generation with proper bounds
    function generatePosition(isBackground = false) {
        const { size } = getEmojiSize();
        const padding = size / 2;
        
        // Get available space
        const maxX = gameAreaWidth - size - padding;
        const maxY = gameAreaHeight - size - padding;
        
        // For background items, use a grid-like positioning
        if (isBackground) {
            const gridSize = size * 1.5;
            const cols = Math.floor(maxX / gridSize);
            const rows = Math.floor(maxY / gridSize);
            
            const col = Math.floor(Math.random() * cols);
            const row = Math.floor(Math.random() * rows);
            
            return {
                x: (padding + col * gridSize) / gameAreaWidth * 100,
                y: (padding + row * gridSize) / gameAreaHeight * 100
            };
        }
        
        // For people, use more random positioning
        return {
            x: (padding + Math.random() * (maxX - padding)) / gameAreaWidth * 100,
            y: (padding + Math.random() * (maxY - padding)) / gameAreaHeight * 100
        };
    }
    
    function checkOverlap(pos1, pos2, minDistance = 10) {
        const dx = Math.abs(pos1.x - pos2.x);
        const dy = Math.abs(pos1.y - pos2.y);
        return dx < minDistance && dy < minDistance;
    }
    
    function findValidPosition(existingPositions, isBackground = false) {
        let attempts = 0;
        const maxAttempts = 100;
        
        while (attempts < maxAttempts) {
            const position = generatePosition(isBackground);
            const hasOverlap = existingPositions.some(pos => 
                checkOverlap(position, pos, isBackground ? 15 : 10)
            );
            
            if (!hasOverlap) return position;
            attempts++;
        }
        
        return generatePosition(isBackground);
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
        if (!gameAreaWidth || !gameAreaHeight) {
            const gameArea = document.querySelector('.game-screen');
            if (gameArea) {
                gameAreaWidth = gameArea.clientWidth;
                gameAreaHeight = gameArea.clientHeight;
            }
        }
    
        const allPositions = [];
        
        // Generate background elements
        backgroundEmojis = [...sceneryEmojis, ...buildingEmojis].map(emoji => {
            const position = findValidPosition(allPositions, true);
            allPositions.push(position);
            return {
                emoji,
                x: position.x,
                y: position.y
            };
        });
    
        // Generate people
        const shuffledPeople = [...peopleEmojis]
            .filter(emoji => emoji !== missingPerson.emoji)
            .sort(() => Math.random() - 0.5)
            .slice(0, 5);
    
        const otherPeople = shuffledPeople.map(emoji => {
            const position = findValidPosition(allPositions, false);
            allPositions.push(position);
            return {
                emoji,
                id: Math.random().toString(36).substr(2, 9),
                x: position.x,
                y: position.y
            };
        });
    
        // Add missing person
        const missingPersonPosition = findValidPosition(allPositions, false);
        missingPerson = {
            ...missingPerson,
            x: missingPersonPosition.x,
            y: missingPersonPosition.y
        };
        
        peopleOnScreen = [...otherPeople, missingPerson];
    }
    
    function updateGameArea() {
        const gameArea = document.querySelector('.game-screen');
        if (gameArea) {
            gameAreaWidth = gameArea.clientWidth;
            gameAreaHeight = gameArea.clientHeight;
            if (isGameStarted && !isGameWon) {
                setupGameScreen();
            }
        }
    }
    
    onMount(() => {
        initializeGame();
        window.addEventListener('resize', updateGameArea);
        
        return () => {
            window.removeEventListener('resize', updateGameArea);
        };
    });
    
    async function startGame() {
        isGameStarted = true;
        isGameWon = false;
        
        // Wait for the game screen to be rendered
        await tick();
        
        // Small delay to ensure DOM is updated
        setTimeout(() => {
            updateGameArea();
            isInitialized = true;
        }, 50);
    }
    
    function startNewGame() {
        initializeGame();
        isGameStarted = false;
        isGameWon = false;
        isInitialized = false;
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
        <div class="text-container">
            <h1><span class="highlight">Where is</span><br><span class="name">{firstName} {lastName}</span>?</h1>
        </div>
        <div class="emoji">{missingPerson.emoji}</div>
        <button on:click={startGame}>Search</button>
    </div>
    {/if}
    
    <!-- Game screen -->
    {#if isGameStarted && !isGameWon}
    <div class="game-screen">
        {#if isInitialized}
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
        {/if}
    </div>
    {/if}
    
    <!-- Win screen -->
    {#if isGameWon}
    <div class="win-screen">
        <div class="text-container">
            <h1><span class="highlight">Congratulations!</span><br>You found<br><span class="name">{firstName} {lastName}</span>!</h1>
        </div>
        <button class="new-game-btn" on:click={startNewGame}>New Game</button>
    </div>
    {/if}
    
    <style>
    .splash-screen, .win-screen {
    text-align: center;
    padding: 20px;
    max-width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 50vh;
}

    .text-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 0 20px;
        box-sizing: border-box;
    }
    
    .game-screen {
        position: relative;
        width: 100%;
        height: 80vh;
        overflow: hidden;
        background-color: #ffffff;
    }
    
    .background-emoji {
        position: absolute;
        font-size: 3vw;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
    }
    
    .person-emoji {
        position: absolute;
        font-size: 3vw;
        background: none;
        border: none;
        cursor: pointer;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        transition: transform 0.2s;
        background-color: transparent;
        transform: translate(-50%, -50%);
    }
    
    .person-emoji:hover {
        transform: translate(-50%, -50%) scale(1.1);
        background-color: transparent;
    }
    
    .emoji {
        font-size: 5rem;
        margin: 20px 0;
    }
    
    h1 {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    margin: 0;
    padding: 10px;
    line-height: 1.4;
    overflow-wrap: break-word;
    word-wrap: break-word;
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
    }
    
    button {
        margin-top: 20px;
        padding: 10px 20px;
        font-size: clamp(1rem, 2vw, 1.2rem);
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
        font-size: clamp(1rem, 2vw, 1.2rem);
        border: 2px solid #ccc;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.25s;
    }
    
    .new-game-btn:hover {
        background-color: #45a049;
    }
    
    .highlight {
    display: inline-block;
    margin-bottom: 0.5rem;
    }   

    .name {
        display: inline-block;
        font-weight: 700;
        color: #000000; 
        word-break: break-word;
    }

    @media (max-width: 768px) {
        .background-emoji, .person-emoji {
            font-size: 4vw;
        }
        
        .emoji {
            font-size: clamp(3rem, 10vw, 5rem);
        }
    }
    
    @media (max-width: 480px) {
    .text-container {
        padding: 0 10px;
    }

    h1 {
        font-size: clamp(1.2rem, 5vw, 1.5rem);
    }
    
    .background-emoji, .person-emoji {
        font-size: 6vw;
    }
    }
    </style>