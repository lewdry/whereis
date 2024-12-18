<script>
    import { onMount, tick } from 'svelte';

    import winSoundFile from './assets/win.mp3';
    const winSound = new Audio(winSoundFile);
    winSound.preload = 'auto';
    
    let firstNames = ["Ali", "Ashley", "Ang", "Bradlee", "Bobbie", "Wei", "Yan", "Andy", "Ying", "Jean", "Franc", "Hong", "Rich", "Rory", "Jo", "Sammy", "Philly", "Mal", "Tippy", "Sal", "Barb", "River", "Gio", "Leith", "Leaf", "Paris", "Axel", "Yun", "Cameron", "Avery", "Ainsley", "Adrian", "Ari", "Charlie", "Ellis", "Dylan", "Drew", "Jordan", "Riley", "Morgan", "Taylor", "Jesse", "Robin", "Jo", "Jules", "Terri", "Ridley", "Sage", "Blake", "Ira", "Basil", "Scout", "Ollie", "Devon", "Shannon", "Birch", "Pat"];
    let lastNames = ["Beaverton", "Affagato", "Consommé", "Vendetta", "Smiley", "Gorgon", "Keyboard", "Diamanté", "Blancmange", "Afterdinner", "Tobermory", "Futon", "Banquette", "Meringue", "Fingertip", "President", "Hotdog", "Cookie", "Tennis-Smythe", "Badminton", "Flounder", "Stuffed-Crust", "Sandal", "Greenhouse", "Bassoon", "Foothold", "Mouthbreath", "Rowboat", "Childsplay", "Flatbread", "Legume", "Broadbean", "Sneaker", "Turtle", "Bouquet", "Salmon", "Goldleaf", "Croissant", "Crossbow", "Trolley"];
    let sceneryEmojis = ["🌳", "🌲", "🎄", "🌴", "⛩️", "🗿", "🗼", "🎡", "⛲️", "🌳", "🌲", "🌴", "🌳", "🌲", "🌴", "🌵", "🌵"];
    let buildingEmojis = ["🏠", "🏡", "🏰", "🛕", "🏩", "🕍", "🏚️", "🏢", "🏬", "🏛️", "🏥", "💒", "🏦", "🏟️", "🏫", "🏯", "🏣", "🏪", "🏤", "🏠", "🎪", "🛖", "🏗️", "🏘️", "⛪️"];
    let peopleEmojis = ["🧍‍♂️", "🧍‍♀️", "💃", "🕺", "🧜", "🧘‍♀️", "🧘‍♂️", "🤾‍♀️", "🤾‍♂️", "👨‍🦼", "👩‍🦽‍➡️", "👩‍🦯‍➡️", "👨‍🦯", "⛹️‍♀️", "⛹️‍♂️", "🧚‍♀️", "🧚‍♂️", "🤺", "🤸‍♀️", "🤸‍♂️", "🏌️‍♂️", "🏌️‍♀️", "🪂", "🏇", "🏋️‍♂️", "🏋️‍♀️", "🏂", "🚴‍♀️", "🚴‍♂️"];
    
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
    
    //variables to track the previous game's person
    let previousGamePerson = {
        firstName: '',
        lastName: '',
        emoji: ''
    };

    let isFirstGame = true;
    
    // Responsive sizing
    const getEmojiSize = () => {
        const width = window.innerWidth;
        if (width <= 768) return { size: 38};
        return { size: 48, fontSize: '5vw' };
    };
    
    function calculateEmojiBounds(elements) {
    // Find the extremes of emoji positions
    const positions = elements.map(el => ({ x: el.x, y: el.y }));
    
    return {
        minX: Math.min(...positions.map(p => p.x)),
        maxX: Math.max(...positions.map(p => p.x)),
        minY: Math.min(...positions.map(p => p.y)),
        maxY: Math.max(...positions.map(p => p.y))
        };
    }

    function preloadAudio() {
        return new Promise((resolve, reject) => {
            console.log('Loading audio from:', winSoundFile);
            
            winSound.oncanplaythrough = () => {
                console.log('Audio loaded successfully');
                resolve();
            };
            
            winSound.onerror = (e) => {
                console.error('Audio loading error:', e);
                console.log('Attempted audio path:', winSoundFile);
                reject(e);
            };

            winSound.load();
        });
    }

    function centerEmojiDistribution(backgroundEmojis, peopleOnScreen) {
        // Combine all elements to find overall bounds
        const allElements = [...backgroundEmojis, ...peopleOnScreen];
        const bounds = calculateEmojiBounds(allElements);
        
        // Calculate unused space
        const unusedSpaceX = 100 - (bounds.maxX - bounds.minX);
        const unusedSpaceY = 100 - (bounds.maxY - bounds.minY);
        
        // Calculate adjustment (half of unused space)
        const adjustX = unusedSpaceX / 4;
        const adjustY = unusedSpaceY / 4;
        
        // Only apply adjustment if there's significant unused space (e.g., > 10%)
        if (unusedSpaceX > 10 || unusedSpaceY > 10) {
            // Adjust background emojis
            backgroundEmojis.forEach(emoji => {
                emoji.x = Math.min(Math.max(emoji.x + adjustX, 5), 95);
                emoji.y = Math.min(Math.max(emoji.y + adjustY, 5), 95);
            });
            
            // Adjust people
            peopleOnScreen.forEach(person => {
                person.x = Math.min(Math.max(person.x + adjustX, 5), 95);
                person.y = Math.min(Math.max(person.y + adjustY, 5), 95);
            });
        }
        
        return { backgroundEmojis, peopleOnScreen };
    }

    // Updated position generation with proper bounds
    function generatePosition(isBackground = false) {
    const { size } = getEmojiSize();
    const sidePadding = size / 2;
    const bottomPadding = isBackground ? size / 2 : size;
    
    // Get available space with safe bounds
    const maxX = gameAreaWidth - sidePadding * 2;
    const maxY = gameAreaHeight - (sidePadding + bottomPadding); // Asymmetric padding for bottom
    
    // For background items, use grid-like positioning with protected edges
    if (isBackground) {
        const gridSize = size * 1;
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
        x: (sidePadding + Math.random() * maxX) / gameAreaWidth * 80,
        y: (sidePadding + Math.random() * (maxY - sidePadding)) / gameAreaHeight * 80
        };
    }

    // Updated overlap check
    function checkOverlap(pos1, pos2, minDistance = 5) {
        const dx = Math.abs(pos1.x - pos2.x);
        const dy = Math.abs(pos1.y - pos2.y);
        return dx < minDistance && dy < minDistance;
    }

    // Updated position finding with edge protection
    function findValidPosition(existingPositions, isBackground = false) {
        let attempts = 0;
        const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
        const position = generatePosition(isBackground);
        
        // Enhanced bounds checking
        const { size } = getEmojiSize();
        const bottomLimit = isBackground ? 95 : 95; // More restrictive bottom limit for people
        
        if (position.x < 0 || position.x > 100 || position.y < 0 || position.y > bottomLimit) {
            attempts++;
            continue;
        }
        
        const hasOverlap = existingPositions.some(pos => 
            checkOverlap(position, pos, isBackground ? 5 : 10)
        );
        
        if (!hasOverlap) return position;
        attempts++;
    }
    
    // If we couldn't find a valid position, return a safe fallback
    const fallbackPosition = generatePosition(isBackground);
    const bottomLimit = isBackground ? 95 : 95;
    return {
        x: Math.min(Math.max(fallbackPosition.x, 5), 95),
        y: Math.min(Math.max(fallbackPosition.y, 5), 95)
        };
    }
        
    function initializeGame() {
    if (isFirstGame) {
        // First game always starts with Bobbie Futon
        firstName = "Bobbie";
        lastName = "Futon";
        missingPerson = {
            emoji: "🧍‍♀️",
            id: Math.random().toString(36).substr(2, 9)
        };
        isFirstGame = false;
    } else {
        // Generate new person different from previous game
        do {
            firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
            lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
            const newEmoji = peopleEmojis[Math.floor(Math.random() * peopleEmojis.length)];
            
            // Check that ALL values are different from the previous game
            const isDifferent = 
                firstName !== previousGamePerson.firstName &&
                lastName !== previousGamePerson.lastName &&
                newEmoji !== previousGamePerson.emoji;
                
                if (isDifferent) {
                    missingPerson = {
                        emoji: newEmoji,
                        id: Math.random().toString(36).substr(2, 9)
                    };
                    break;
                }
            } while (true);
        }
        
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
    
    // Apply centering after all positions are generated
    const { backgroundEmojis: centeredBackground, peopleOnScreen: centeredPeople } = 
        centerEmojiDistribution(backgroundEmojis, peopleOnScreen);
    
    backgroundEmojis = centeredBackground;
    peopleOnScreen = centeredPeople;
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
        // Initialize game first to set initial name/emoji
        initializeGame();
        
        // Then preload audio
        preloadAudio().then(() => {
            // Any post-audio initialization if needed
        });
        
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
    // Store the current person's details before starting new game
    previousGamePerson = {
        firstName: firstName,
        lastName: lastName,
        emoji: missingPerson.emoji
    };
    
    initializeGame();
    isGameStarted = false;
    isGameWon = false;
    isInitialized = false;
    }
    
    function checkForWin(clickedPerson) {
    if (clickedPerson.id === missingPerson.id) {
        isGameWon = true;
        // Immediately reset and play
        winSound.currentTime = 0;
        // Use Promise-based play with simple error handling
        winSound.play()
            .catch(error => console.error('Error playing sound:', error));
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
        font-size: 2.5em;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
    }
    
    .person-emoji {
        position: absolute;
        font-size: 2.5em;
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
    font-size: 1.4rem;
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
            font-size: 2rem;
        }
        
        .emoji {
            font-size: clamp(3rem, 4rem, 5rem);
        }
    }
        </style>