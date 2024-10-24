<script>
    import { onMount, tick } from 'svelte';
    
    let firstNames = ["Ali", "Ashley", "Ang", "Bradlee", "Bobbie", "Jose", "Wei", "Yan", "Andy", "Ying", "Jean", "Fransico", "Hong", "Fady", "Rich", "Rory", "Jo", "Sammy", "Philly", "Mal", "Tippy", "Sal", "Barb"];
    let lastNames = ["Beaverton", "Affagato", "Consomme", "Vendetta", "Smiley", "Gorge", "Keyboard", "Diamanté", "Blancmange", "Afterdinner", "Tobermory", "Futon", "Banquette", "Meringue", "Fingertip", "President", "Chapter", "Cookie", "Tennis-Smythe", "Badminton", "Flounder", "Crust", "Sandal", "Greenhouse", "Bassoon", "Foothold", "Mouthbreath", "Rowboat", "Childsplay", "Flatbread", "Legume"];
    let sceneryEmojis = ["🌳", "🌲", "🎄", "🌴", "⛩️", "🗿", "🗼", "🎡", "⛲️"];
    let buildingEmojis = ["🏠", "🏰", "🛕", "🏩", "🕍", "🏚️", "🏢", "🏬", "🏛️", "🏥", "💒", "🕌", "🏦", "🏟️", "🏫", "🏯", "🏣", "🏪", "🏤"];
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
        if (width <= 480) return { size: 36, fontSize: '8vw' };
        if (width <= 768) return { size: 48, fontSize: '8vw' };
        return { size: 48, fontSize: '5vw' };
    };
    
    // Updated position generation with proper bounds
    function generatePosition(isBackground = false) {
    const { size } = getEmojiSize();
    const sidePadding = size / 2;
    const bottomPadding = isBackground ? size / 2 : size; // Extra bottom padding for people
    
    // Get available space with safe bounds
    const maxX = gameAreaWidth - sidePadding * 2;
    const maxY = gameAreaHeight - (sidePadding + bottomPadding); // Asymmetric padding for bottom
    
    // For background items, use grid-like positioning with protected edges
    if (isBackground) {
        const gridSize = size * 1.2;
        const cols = Math.floor(maxX / gridSize);
        const rows = Math.floor(maxY / gridSize);
        
        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);
        
        return {
            x: (sidePadding + col * gridSize) / gameAreaWidth * 100,
            y: (sidePadding + row * gridSize) / gameAreaHeight * 100
        };
    }
    
    // For people, use random positioning with protected edges and extra bottom padding
    return {
        x: (sidePadding + Math.random() * maxX) / gameAreaWidth * 100,
        y: (sidePadding + Math.random() * (maxY - sidePadding)) / gameAreaHeight * 100 // Reduced height range for people
    };
}

// Updated overlap check
function checkOverlap(pos1, pos2, minDistance = 8) {
    const dx = Math.abs(pos1.x - pos2.x);
    const dy = Math.abs(pos1.y - pos2.y);
    return dx < minDistance && dy < minDistance;
}

// Updated position finding with edge protection
function findValidPosition(existingPositions, isBackground = false) {
    let attempts = 0;
    const maxAttempts = 500;
    
    while (attempts < maxAttempts) {
        const position = generatePosition(isBackground);
        
        // Enhanced bounds checking
        const { size } = getEmojiSize();
        const bottomLimit = isBackground ? 95 : 90; // More restrictive bottom limit for people
        
        if (position.x < 0 || position.x > 100 || position.y < 0 || position.y > bottomLimit) {
            attempts++;
            continue;
        }
        
        const hasOverlap = existingPositions.some(pos => 
            checkOverlap(position, pos, isBackground ? 12 : 8)
        );
        
        if (!hasOverlap) return position;
        attempts++;
    }
    
    // If we couldn't find a valid position, return a safe fallback
    const fallbackPosition = generatePosition(isBackground);
    const bottomLimit = isBackground ? 95 : 90;
    return {
        x: Math.min(Math.max(fallbackPosition.x, 5), 95),
        y: Math.min(Math.max(fallbackPosition.y, 5), bottomLimit)
    };
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
    <div class="container">
        <div class="splash-screen">
            <div class="text-container">
                <h1><span class="highlight">Where is</span><br><span class="name">{firstName} {lastName}</span>?</h1>
            </div>
            <div class="emoji">{missingPerson.emoji}</div>
            <button on:click={startGame}>Search</button>
        </div>
    </div>
    {/if}
    
    <!-- Game screen -->
    {#if isGameStarted && !isGameWon}
    <div class="container">
        <div 
            class="game-screen"
            on:touchmove|preventDefault={() => {}}
            on:touchstart|preventDefault={() => {}}
            on:touchend|preventDefault={() => {}}>
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
                    on:click={() => checkForWin(person)}
                    on:touchstart|preventDefault={() => checkForWin(person)}>
                    {person.emoji}
                </button>
                {/each}
            {/if}
        </div>
    </div>
    {/if}
    
    
    <!-- Win screen -->
    {#if isGameWon}
    <div class="container">
        <div class="win-screen">
            <div class="text-container">
                <h1><span class="highlight">Congratulations!</span><br>You found<br><span class="name">{firstName} {lastName}</span>!</h1>
            </div>
            <button class="new-game-btn" on:click={startNewGame}>New Game</button>
        </div>
    </div>
    {/if}
    
    <style>
    .container {
    display: flex;
    justify-content: center;
    align-items: flex start;
    padding-top: 20px;
    width: 100%;
    height: 100vh; 
    background-color: #ffffff;
}

    .splash-screen, .win-screen, .game-screen {
        text-align: center;
        padding: 0px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 50vh;
        width: 80%;
        height: 80%;
        max-width: 400px;
        max-height: 700px;
        aspect-ratio: 4 / 7;
        border: 2px solid black;
        border-radius: 1em;
        overflow: hidden;
        touch-action: none; /* Prevents default touch behaviors */
        -webkit-user-select: none; /* Prevents text selection on iOS */
        user-select: none;
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
        font-size: 6rem;
        margin: 20px 0;
    }
    
    h1 {
    font-size: clamp(1.5rem, 4vw, 2rem);
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
        background-color: #f0f0f0;
        border: 2px solid #ccc;
        color: #000000;
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
        background-color: #f0f0f0;
        border-color: #999;
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
            font-size: 8vw;
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
            font-size: 8vw;
        }
        }
        </style>