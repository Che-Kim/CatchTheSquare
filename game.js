document.addEventListener('DOMContentLoaded', () => {
    // Game elements
    const target = document.getElementById('target');
    const powerUp = document.getElementById('power-up');
    const scoreDisplay = document.getElementById('score');
    const timeDisplay = document.getElementById('time');
    const comboDisplay = document.getElementById('combo');
    const levelDisplay = document.getElementById('level');
    const startBtn = document.getElementById('start-btn');
    const pauseBtn = document.getElementById('pause-btn');
    const restartBtn = document.getElementById('restart-btn');
    const gameContainer = document.getElementById('game-container');
    const gameArea = document.getElementById('game-area');
    const gameOverScreen = document.getElementById('game-over-screen');
    const particlesContainer = document.getElementById('particles-container');

    // Game state
    let score = 0;
    let timeLeft = 30;
    let combo = 0;
    let level = 1;
    let gameActive = false;
    let gamePaused = false;
    let gameInterval;
    let targetInterval;
    let powerUpInterval;
    let particleInterval;

    // Power-ups state
    let powerUps = {
        speedBoost: 0,
        timeFreeze: 0,
        doublePoints: 0
    };

    let activeEffects = {
        doublePoints: false,
        timeFrozen: false,
        speedBoost: false
    };

    let targetSpeed = 2000; // milliseconds
    let targetType = 'normal';
    let powerUpActive = false;

    // Initialize game
    function initGame() {
        gameArea.style.position = 'relative';
        gameArea.style.width = '100%';
        gameArea.style.height = '100%';
        target.style.display = 'none';
        powerUp.style.display = 'none';
        createParticles();
    }

    // Create floating particles
    function createParticles() {
        setInterval(() => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particlesContainer.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 6000);
        }, 200);
    }

    // Move target to random position
    function moveTarget() {
        if (!gameActive || gamePaused) return;

        const container = gameArea.getBoundingClientRect();
        const maxX = container.width - 60;
        const maxY = container.height - 60;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        target.style.left = `${randomX}px`;
        target.style.top = `${randomY}px`;

        // Random target type
        const rand = Math.random();
        if (rand < 0.7) {
            targetType = 'normal';
            target.className = 'target-normal';
        } else if (rand < 0.9) {
            targetType = 'special';
            target.className = 'target-special';
        } else {
            targetType = 'golden';
            target.className = 'target-golden';
        }
    }

    // Spawn power-up
    function spawnPowerUp() {
        if (!gameActive || gamePaused || powerUpActive) return;

        const container = gameArea.getBoundingClientRect();
        const maxX = container.width - 50;
        const maxY = container.height - 50;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        powerUp.style.left = `${randomX}px`;
        powerUp.style.top = `${randomY}px`;

        const powerUpTypes = ['speed', 'freeze', 'double'];
        const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
        
        powerUp.className = `power-up-${randomType}`;
        powerUp.dataset.type = randomType;
        powerUp.style.display = 'block';
        powerUpActive = true;

        // Power-up disappears after 5 seconds
        setTimeout(() => {
            if (powerUpActive) {
                powerUp.style.display = 'none';
                powerUpActive = false;
            }
        }, 5000);
    }

    // Create floating text effect
    function createFloatingText(text, x, y, color = '#fff') {
        const floatingText = document.createElement('div');
        floatingText.textContent = text;
        floatingText.style.position = 'absolute';
        floatingText.style.left = x + 'px';
        floatingText.style.top = y + 'px';
        floatingText.style.color = color;
        floatingText.style.fontWeight = 'bold';
        floatingText.style.fontSize = '1.2em';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.zIndex = '1000';
        floatingText.style.animation = 'floatUp 1s ease-out forwards';
        
        gameArea.appendChild(floatingText);
        
        setTimeout(() => {
            floatingText.remove();
        }, 1000);
    }

    // Update power-ups display
    function updatePowerUpsDisplay() {
        document.querySelector('#speed-boost .power-up-count').textContent = powerUps.speedBoost;
        document.querySelector('#time-freeze .power-up-count').textContent = powerUps.timeFreeze;
        document.querySelector('#double-points .power-up-count').textContent = powerUps.doublePoints;
    }

    // Apply power-up effect
    function applyPowerUp(type) {
        switch(type) {
            case 'speed':
                powerUps.speedBoost++;
                activeEffects.speedBoost = true;
                targetSpeed = Math.max(500, targetSpeed - 300);
                createFloatingText('⚡ SPEED BOOST!', 50, 50, '#ffff00');
                setTimeout(() => {
                    activeEffects.speedBoost = false;
                    targetSpeed = Math.min(2000, targetSpeed + 300);
                }, 10000);
                break;
            case 'freeze':
                powerUps.timeFreeze++;
                activeEffects.timeFrozen = true;
                createFloatingText('❄️ TIME FROZEN!', 50, 50, '#00ffff');
                setTimeout(() => {
                    activeEffects.timeFrozen = false;
                }, 5000);
                break;
            case 'double':
                powerUps.doublePoints++;
                activeEffects.doublePoints = true;
                createFloatingText('💎 DOUBLE POINTS!', 50, 50, '#ff00ff');
                setTimeout(() => {
                    activeEffects.doublePoints = false;
                }, 10000);
                break;
        }
        updatePowerUpsDisplay();
    }

    // Start game
    function startGame() {
        clearInterval(gameInterval);
        clearInterval(targetInterval);
        clearInterval(powerUpInterval);
        gameActive = true;
        gamePaused = false;
        score = 0;
        timeLeft = 30;
        combo = 0;
        level = 1;
        targetSpeed = 2000;
        // Reset power-ups
        powerUps = { speedBoost: 0, timeFreeze: 0, doublePoints: 0 };
        activeEffects = { doublePoints: false, timeFrozen: false, speedBoost: false };
        // Update displays
        scoreDisplay.textContent = score;
        timeDisplay.textContent = timeLeft;
        comboDisplay.textContent = combo;
        levelDisplay.textContent = level;
        // Update UI
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        target.style.display = 'block';
        gameContainer.classList.add('game-active');
        // Start game loops
        moveTarget();
        targetInterval = setInterval(moveTarget, targetSpeed);
        powerUpInterval = setInterval(spawnPowerUp, 8000);
        // Game timer
        gameInterval = setInterval(() => {
            if (!activeEffects.timeFrozen) {
                timeLeft--;
                timeDisplay.textContent = timeLeft;
                if (timeLeft <= 10) {
                    timeDisplay.style.color = '#ff0000';
                    timeDisplay.style.animation = 'scorePop 0.5s ease-out';
                } else if (timeLeft <= 20) {
                    timeDisplay.style.color = '#ffaa00';
                }
                if (timeLeft <= 0) {
                    endGame();
                }
            }
        }, 1000);
    }

    // Pause game
    function pauseGame() {
        if (!gameActive) return;
        
        gamePaused = !gamePaused;
        pauseBtn.textContent = gamePaused ? '▶️ RESUME' : '⏸️ PAUSE';
        
        if (gamePaused) {
            target.style.display = 'none';
            powerUp.style.display = 'none';
            clearInterval(gameInterval); // Stop timer when paused
        } else {
            target.style.display = 'block';
            if (powerUpActive) powerUp.style.display = 'block';
            // Resume timer
            gameInterval = setInterval(() => {
                if (!activeEffects.timeFrozen) {
                    timeLeft--;
                    timeDisplay.textContent = timeLeft;
                    if (timeLeft <= 10) {
                        timeDisplay.style.color = '#ff0000';
                        timeDisplay.style.animation = 'scorePop 0.5s ease-out';
                    } else if (timeLeft <= 20) {
                        timeDisplay.style.color = '#ffaa00';
                    }
                    if (timeLeft <= 0) {
                        endGame();
                    }
                }
            }, 1000);
        }
    }

    // End game
    function endGame() {
        gameActive = false;
        gamePaused = false;
        clearInterval(gameInterval);
        clearInterval(targetInterval);
        clearInterval(powerUpInterval);
        target.style.display = 'none';
        powerUp.style.display = 'none';
        powerUpActive = false;
        gameContainer.classList.remove('game-active');
        timeDisplay.style.color = '#ff0000';
        timeDisplay.style.animation = '';
        document.getElementById('final-score').textContent = score;
        document.getElementById('final-combo').textContent = combo;
        document.getElementById('final-level').textContent = level;
        gameOverScreen.classList.remove('hidden');
    }

    // Restart game
    function restartGame() {
        gameOverScreen.classList.add('hidden');
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        pauseBtn.textContent = '⏸️ PAUSE';
        timeDisplay.style.color = '#fff';
        timeDisplay.style.animation = '';
        updatePowerUpsDisplay();
        clearInterval(gameInterval); // Ensure timer is stopped
        clearInterval(targetInterval);
        clearInterval(powerUpInterval);
        timeLeft = 30;
        timeDisplay.textContent = timeLeft;
        gameActive = false;
        gamePaused = false;
    }

    // Handle target click
    target.addEventListener('click', () => {
        if (!gameActive || gamePaused) return;
        
        const rect = target.getBoundingClientRect();
        const clickX = rect.left + rect.width / 2;
        const clickY = rect.top + rect.height / 2;
        
        // Calculate points based on target type
        let points = 1;
        let color = '#fff';
        
        switch(targetType) {
            case 'normal':
                points = 1;
                color = '#ff0000';
                break;
            case 'special':
                points = 3;
                color = '#ff00ff';
                break;
            case 'golden':
                points = 5;
                color = '#ffd700';
                break;
        }
        
        // Apply double points effect
        if (activeEffects.doublePoints) {
            points *= 2;
        }
        
        // Update score and combo
        score += points;
        combo++;
        
        // Level up every 10 points
        const newLevel = Math.floor(score / 10) + 1;
        if (newLevel > level) {
            level = newLevel;
            levelDisplay.classList.add('level-up');
            setTimeout(() => levelDisplay.classList.remove('level-up'), 1000);
            createFloatingText('🎉 LEVEL UP!', 50, 100, '#ffff00');
            
            // Increase difficulty
            targetSpeed = Math.max(500, targetSpeed - 100);
            clearInterval(targetInterval);
            targetInterval = setInterval(moveTarget, targetSpeed);
        }
        
        // Update displays
        scoreDisplay.textContent = score;
        comboDisplay.textContent = combo;
        levelDisplay.textContent = level;
        
        // Visual feedback
        scoreDisplay.classList.add('score-increase');
        comboDisplay.classList.add('combo-active');
        setTimeout(() => {
            scoreDisplay.classList.remove('score-increase');
            comboDisplay.classList.remove('combo-active');
        }, 500);
        
        // Create floating text
        createFloatingText(`+${points}`, clickX, clickY, color);
        
        // Move target
        moveTarget();
    });

    // Handle power-up click
    powerUp.addEventListener('click', () => {
        if (!gameActive || gamePaused) return;
        
        const type = powerUp.dataset.type;
        applyPowerUp(type);
        
        powerUp.style.display = 'none';
        powerUpActive = false;
        
        const rect = powerUp.getBoundingClientRect();
        const clickX = rect.left + rect.width / 2;
        const clickY = rect.top + rect.height / 2;
        
        createFloatingText('POWER-UP!', clickX, clickY, '#00ffff');
    });

    // Event listeners
    startBtn.addEventListener('click', startGame);
    pauseBtn.addEventListener('click', pauseGame);
    restartBtn.addEventListener('click', restartGame);
    document.getElementById('play-again-btn').addEventListener('click', restartGame);

    // Initialize game
    initGame();
});
