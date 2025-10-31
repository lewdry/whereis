<script>
    import { onMount, tick } from 'svelte';
    import firstNames from './firstnames.json';
    import lastNames from './lastnames.json';

    import winSoundFile from './assets/win.mp3';
    const winSound = new Audio(winSoundFile);
    winSound.preload = 'auto';

    let sceneryEmojis = ["🌳", "🌲", "🎄", "🌴", "⛩️", "🗿", "🗼", "🎡", "⛲️", "🌳", "🌲", "🌴", "🌳", "🌲", "🌴", "🌵", "🌵", "🏕️", "🌾"];
    let buildingEmojis = ["🏠", "🏡", "🏰", "🛕", "🏩", "🕍", "🏚️", "🏢", "🏬", "🏛️", "🏥", "💒", "🏦", "🏟️", "🏫", "🏯", "🏣", "🏪", "🏤", "🏠", "🎪", "🛖", "🏗️", "🏘️", "⛪️", "🏨", "🏭"];
    let peopleEmojis = ["🧍‍♂️", "💃", "🕺", "🧜", "🧘‍♀️", "🧘‍♂️", "🤾‍♀️", "🤾‍♂️", "👨‍🦼", "👩‍🦽‍➡️", "👩‍🦯‍➡️", "👨‍🦯", "⛹️‍♀️", "⛹️‍♂️", "🧚‍♀️", "🧚‍♂️", "🤺", "🤸‍♀️", "🤸‍♂️", "🏌️‍♂️", "🏌️‍♀️", "🪂", "🏇", "🏋️‍♂️", "🏋️‍♀️", "🏂", "🚴‍♀️", "🚴‍♂️"];
    
    let missingPerson = { emoji: '🧍', id: '', frisked: false };
    // Track whether the found/won emoji was frisked
    // we'll attach this to the missingPerson as `frisked` when appropriate
    let firstName = "";
    let lastName = "";
    let isGameStarted = false;
    let isGameWon = false;
    let backgroundEmojis = [];
    let peopleOnScreen = [];
    let gameAreaWidth;
    let gameAreaHeight;
    let isInitialized = false;
    // weapon emojis for frisking
    const weaponEmojis = ["🗡️","⚔️","🔪","🏹","🪓","🪚","🪄","💣","🧨","🔫"];

    // spawned weapons on the win screen (frisked items)
    let friskedWeapons = [];
    
    //variables to track the previous game's person
    let previousGamePerson = {
        firstName: '',
        lastName: '',
        emoji: ''
    };

    let isFirstGame = true;
    
    // Score tracking
    let totalPeopleFound = 0;
    let scoreAnimating = false;
    
    // Responsive sizing
    const getEmojiSize = () => {
        const width = window.innerWidth;
        if (width <= 768) return { size: 38};
        return { size: 48, fontSize: '5vw' };
    };
    
    function calculateEmojiBounds(elements) {
    // Find the extremes of emoji positions. Be defensive: handle empty arrays
    if (!elements || elements.length === 0) {
        return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    const positions = elements.map(el => ({ x: Number(el.x) || 0, y: Number(el.y) || 0 }));

    return {
        minX: Math.min(...positions.map(p => p.x)),
        maxX: Math.max(...positions.map(p => p.x)),
        minY: Math.min(...positions.map(p => p.y)),
        maxY: Math.max(...positions.map(p => p.y))
    };
    }

    let audioPreloaded = false;

    function preloadAudio() {
        return new Promise((resolve, reject) => {
            console.log('Loading audio from:', winSoundFile);
            if (audioPreloaded) {
                resolve();
                return;
            }

            winSound.oncanplaythrough = () => {
                console.log('Audio loaded successfully');
                audioPreloaded = true;
                resolve();
            };

            winSound.onerror = (e) => {
                console.error('Audio loading error:', e);
                console.log('Attempted audio path:', winSoundFile);
                reject(e);
            };

            try {
                winSound.load();
            } catch (err) {
                // Some environments may throw when loading media without user interaction.
                console.warn('winSound.load() failed:', err);
                reject(err);
            }
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

    // Use safe fallbacks if game area isn't set yet
    const safeGameAreaWidth = gameAreaWidth || window.innerWidth;
    const safeGameAreaHeight = gameAreaHeight || window.innerHeight;

    // Get available space with safe bounds
    const maxX = Math.max(safeGameAreaWidth - sidePadding * 2, size);
    const maxY = Math.max(safeGameAreaHeight - (sidePadding + bottomPadding), size); // Asymmetric padding for bottom

    // For background items, use grid-like positioning with protected edges
    if (isBackground) {
        const gridSize = Math.max(size, 1);
        const cols = Math.max(1, Math.floor(maxX / gridSize));
        const rows = Math.max(1, Math.floor(maxY / gridSize));

        const col = Math.floor(Math.random() * cols);
        const row = Math.floor(Math.random() * rows);

        return {
            x: ((sidePadding + col * gridSize) / safeGameAreaWidth) * 100,
            y: ((sidePadding + row * gridSize) / safeGameAreaHeight) * 100
        };
    }

    // For people, use random positioning with protected edges and extra bottom padding
    return {
        x: ((sidePadding + Math.random() * maxX) / safeGameAreaWidth) * 100,
        y: ((sidePadding + Math.random() * (maxY - sidePadding)) / safeGameAreaHeight) * 100
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
            id: Math.random().toString(36).substr(2, 9),
            frisked: false
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
                        id: Math.random().toString(36).substr(2, 9),
                        frisked: false
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

    // Generate background elements (use full set of scenery + buildings)
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
        // Defer audio preloading until user interaction (startGame) to avoid autoplay blocks
        
        window.addEventListener('resize', updateGameArea);
        
        return () => {
            window.removeEventListener('resize', updateGameArea);
        };
    });
        
    async function startGame() {
        isGameStarted = true;
        isGameWon = false;
        // Preload audio on first user action; ignore errors
        preloadAudio().catch(e => console.debug('Audio preload deferred or failed:', e));

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
    
    // clear any frisked weapons from the previous win screen
    friskedWeapons = [];

    initializeGame();
    // also ensure frisked flag reset just in case
    missingPerson = { ...missingPerson, frisked: false };

    isGameStarted = false;
    isGameWon = false;
    isInitialized = false;
    }
    
    function checkForWin(clickedPerson) {
        if (clickedPerson.id === missingPerson.id) {
            isGameWon = true;
            totalPeopleFound += 1; // Increment score
            
            // Trigger score animation
            scoreAnimating = true;
            setTimeout(() => {
                scoreAnimating = false;
            }, 800); // Animation duration
            
            // Try to unlock audio context if needed (some browsers require this)
            const playFanfare = async () => {
                try {
                    // Reset the audio to start from beginning
                    winSound.currentTime = 0;
                    // Ensure audio is unmuted and at normal volume
                    winSound.muted = false;
                    if (typeof winSound.volume === 'number') {
                        winSound.volume = 1;
                    }
                    // Play the fanfare
                    await winSound.play();
                } catch (error) {
                    console.error('Error playing fanfare:', error);
                }
            };
            
            playFanfare();
        }
    }

    // Frisking on the win screen: spawn a weapon emoji that bounces out
    // and settles off to the left or right. Marks the missingPerson as frisked.
    async function friskWinEmoji(event) {
        // If already frisked this win, ignore further interactions
        if (missingPerson && missingPerson.frisked) return;
        // Guard: ensure we have a win-screen container
        const clickedEl = event.currentTarget;
        const container = clickedEl.closest('.win-screen');
        if (!container) return;

        const containerRect = container.getBoundingClientRect();
        const targetRect = clickedEl.getBoundingClientRect();

        // center of the clicked emoji relative to container
        const centerX = (targetRect.left + targetRect.width / 2) - containerRect.left;
        const centerY = (targetRect.top + targetRect.height / 2) - containerRect.top;

        const xPercent = (centerX / containerRect.width) * 100;
        const yPercent = (centerY / containerRect.height) * 100;

        const side = Math.random() < 0.5 ? 'left' : 'right';
        const weaponEmoji = weaponEmojis[Math.floor(Math.random() * weaponEmojis.length)];
        const id = Math.random().toString(36).substr(2, 9);

    // how far to push the weapon (fraction of an emoji width). Use 0.5 to place
    // the fallen weapon about 0.5 emoji widths away on the x axis.
    const offsetPercent = (targetRect.width / containerRect.width) * 100 * 0.5;
        const upOffset = Math.min(12, (targetRect.height / containerRect.height) * 100 + 2);

        const weapon = {
            id,
            emoji: weaponEmoji,
            x: xPercent,
            y: yPercent,
            side,
            settled: false
        };

        // Add to list so it renders
        friskedWeapons = [...friskedWeapons, weapon];

        // mark the missing person as frisked for later game logic
        missingPerson = { ...missingPerson, frisked: true };

        // Wait for DOM to update
        await tick();

        // Animate: move outwards and slightly up, then drop and settle
        const newX = xPercent + (side === 'right' ? offsetPercent : -offsetPercent);
        // first move up/out
        friskedWeapons = friskedWeapons.map(w => w.id === id ? { ...w, x: newX, y: yPercent - upOffset } : w);

        // after a short time, drop to the original y and mark settled (so it stays)
        setTimeout(() => {
            friskedWeapons = friskedWeapons.map(w => w.id === id ? { ...w, y: yPercent, settled: true } : w);
        }, 50);
    }
    
    $: winMessage = isGameWon ? `Congratulations! You found ${firstName} ${lastName}!` : '';
    </script>
    
    <!-- Splash screen -->
    {#if !isGameStarted}
    <div class="container">
        <div class="game-wrapper">
            <div class="splash-screen">
                <div class="text-container">
                    <h1><span class="highlight">Where is</span><br><span class="name">{firstName} {lastName}</span>?</h1>
                </div>
                <div class="emoji">{missingPerson.emoji}</div>
                <button on:click={startGame}>Search</button>
            </div>
            <div class="scorecard">
                <div class="score-text">People Found: <span class="score-number" class:score-pop={scoreAnimating}>{totalPeopleFound}</span></div>
            </div>
        </div>
    </div>
    {/if}
    
    <!-- Game screen -->
    {#if isGameStarted && !isGameWon}
    <div class="container">
        <div class="game-wrapper">
            <div 
                class="game-screen"
                on:touchmove|preventDefault={() => {}}
                on:touchstart|preventDefault={() => {}}
                on:touchend|preventDefault={() => {}}>
                {#if isInitialized}
                        {#each backgroundEmojis as emoji}
                        <div 
                            class="background-emoji" 
                            style="top: {emoji.y}%; left: {emoji.x}%;"
                            role="img"
                            aria-hidden="true">
                            {emoji.emoji}
                        </div>
                        {/each}
                    
                    {#each peopleOnScreen as person, i}
                    <button 
                        class="person-emoji"
                        style="top: {person.y}%; left: {person.x}%;"
                        on:click={() => checkForWin(person)}
                        on:pointerdown|preventDefault={() => checkForWin(person)}
                        title={`Person ${i+1}`}
                        aria-label={`Person ${i+1}: ${person.emoji}`}>
                        {person.emoji}
                    </button>
                    {/each}
                {/if}
            </div>
            <div class="scorecard">
                <div class="score-text">People Found: <span class="score-number" class:score-pop={scoreAnimating}>{totalPeopleFound}</span></div>
            </div>
        </div>
    </div>
    {/if}
    
    
    <!-- Win screen -->
    {#if isGameWon}
    <div class="container">
        <div class="game-wrapper">
            <div class="win-screen">
                <div class="text-container">
                    <h1><span class="highlight">Congratulations!</span><br>You found<br><span class="name">{firstName} {lastName}</span>!</h1>
                </div>
                <div
                    class="emoji"
                    role="button"
                    tabindex="0"
                    on:click={friskWinEmoji}
                    on:keydown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); friskWinEmoji(e); } }}
                    title="Tap to frisk"
                >{missingPerson.emoji}</div>
                    
                {#each friskedWeapons as weapon (weapon.id)}
                    <div
                        class="weapon-emoji"
                        style="left: {weapon.x}%; top: {weapon.y}%;"
                        aria-hidden="true"
                    >{weapon.emoji}</div>
                {/each}
                    <div class="sr-only" aria-live="polite">{winMessage}</div>
                <button class="new-game-btn" on:click={startNewGame}>New Game</button>
            </div>
            <div class="scorecard">
                <div class="score-text">People Found: <span class="score-number" class:score-pop={scoreAnimating}>{totalPeopleFound}</span></div>
            </div>
        </div>
    </div>
    {/if}
    
    <style>
    .container {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding-top: 32px;
    width: 100%;
    height: 100vh; 
    background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

    .game-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
        width: 80%;
        max-width: 400px;
    }

    .scorecard {
        background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        padding: 12px 20px;
        width: 100%;
        max-width: 200px;
        text-align: center;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.06);
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
    }

    .scorecard::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, #374151 0%, #6b7280 100%);
        border-radius: 0 0 12px 12px;
    }

    .score-text {
        font-size: 1rem;
        color: #6b7280;
        font-weight: 500;
        letter-spacing: 0.01em;
        margin-bottom: 2px;
    }

    .score-number {
        font-weight: 700;
        color: #111827;
        font-size: 1rem;
        font-variant-numeric: tabular-nums;
        line-height: 1;
        transition: transform 0.2s ease;
        position: relative;
        display: inline-block;
    }

    .score-pop {
        animation: scoreIncrement 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    .score-pop::before {
        content: '✨';
        position: absolute;
        left: -15px;
        top: -5px;
        font-size: 0.8em;
        animation: sparkle1 0.8s ease-out;
        pointer-events: none;
    }

    .score-pop::after {
        content: '🎉';
        position: absolute;
        right: -15px;
        top: -5px;
        font-size: 0.8em;
        animation: sparkle2 0.8s ease-out;
        pointer-events: none;
    }

    @keyframes scoreIncrement {
        0% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.4);
            color: #059669;
        }
        100% {
            transform: scale(1);
            color: #111827;
        }
    }

    @keyframes sparkle1 {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg) translateY(0);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg) translateY(-10px);
        }
        100% {
            opacity: 0;
            transform: scale(0.8) rotate(360deg) translateY(-20px);
        }
    }

    @keyframes sparkle2 {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg) translateY(0);
        }
        60% {
            opacity: 1;
            transform: scale(1.1) rotate(-150deg) translateY(-8px);
        }
        100% {
            opacity: 0;
            transform: scale(0.9) rotate(-270deg) translateY(-18px);
        }
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
        width: 100%;
        height: 80vh;
        max-width: 400px;
        max-height: 700px;
        aspect-ratio: 4 / 7;
        background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
        border: 1px solid #e5e7eb;
        border-radius: 24px;
        box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.05),
            0 2px 4px -1px rgba(0, 0, 0, 0.03),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
        overflow: hidden;
        touch-action: none;
        -webkit-user-select: none;
        user-select: none;
    }

    .text-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 0 24px;
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

    .person-emoji:focus-visible {
        outline: 2px solid #6b7280;
        outline-offset: 2px;
        border-radius: 8px;
        transform: translate(-50%, -50%) scale(1.05);
    }

    /* Screen-reader-only helper */
    .sr-only {
        position: absolute !important;
        height: 1px; width: 1px;
        overflow: hidden;
        clip: rect(1px, 1px, 1px, 1px);
        white-space: nowrap;
    }
    
    .emoji {
        font-size: 6rem;
        margin: 20px 0;
    }

    /* Win-screen weapon (frisk) visuals */
    .win-screen {
        position: relative;
    }

    .win-screen .emoji {
        cursor: pointer;
    }

    .weapon-emoji {
        position: absolute;
        font-size: 2.5rem;
        z-index: 4;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%);
        transition: left 520ms cubic-bezier(.2,.8,.2,1), top 320ms ease;
        pointer-events: none; /* don't block further interactions */
    }
    
    h1 {
        font-size: 1.5rem;
        margin: 0;
        padding: 16px;
        line-height: 1.3;
        overflow-wrap: break-word;
        word-wrap: break-word;
        -webkit-hyphens: auto;
        -ms-hyphens: auto;
        hyphens: auto;
        color: #1f2937;
        font-weight: 600;
        letter-spacing: -0.025em;
    }
    
    button {
        margin-top: 24px;
        padding: 14px 28px;
        font-size: clamp(1rem, 2vw, 1.1rem);
        background: linear-gradient(135deg, #DBF9F0 0%, #C7F4E8 100%);
        border: 1px solid #A7F3D0;
        color: #064e3b;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 600;
        letter-spacing: 0.025em;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    
    button:hover {
        background: linear-gradient(135deg, #C7F4E8 0%, #A7F3D0 100%);
        border-color: #86EFAC;
        transform: translateY(-1px);
        box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.08),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    button:active {
        transform: translateY(0);
        box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    
    .new-game-btn {
        margin-top: 24px;
        padding: 14px 28px;
        font-size: clamp(1rem, 2vw, 1.1rem);
        background: linear-gradient(135deg, #DBF9F0 0%, #C7F4E8 100%);
        border: 1px solid #A7F3D0;
        color: #064e3b;
        border-radius: 12px;
        cursor: pointer;
        font-weight: 600;
        letter-spacing: 0.025em;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    
    .new-game-btn:hover {
        background: linear-gradient(135deg, #C7F4E8 0%, #A7F3D0 100%);
        border-color: #86EFAC;
        transform: translateY(-1px);
        box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.08),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }

    .new-game-btn:active {
        transform: translateY(0);
        box-shadow: 
            0 1px 2px rgba(0, 0, 0, 0.05),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
    }
    
    .highlight {
        display: inline-block;
        margin-bottom: 0.5rem;
        color: #6b7280;
        font-weight: 500;
    }   

    .name {
        display: inline-block;
        font-weight: 700;
        color: #111827; 
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