/* ==========================================
   BE MY VALENTINE - RIDDLE WEBSITE SCRIPT
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ===== Floating Hearts Background =====
    const heartsBg = document.getElementById('heartsBg');
    const heartChars = ['\u2665', '\u2661', '\uD83D\uDC95', '\uD83D\uDC97', '\uD83E\uDE77'];

    function createHeart() {
        const h = document.createElement('span');
        h.className = 'floating-heart';
        h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
        h.style.left = Math.random() * 100 + '%';
        h.style.fontSize = (Math.random() * 18 + 12) + 'px';
        h.style.color = 'rgba(255, 77, 109, ' + (Math.random() * 0.2 + 0.08) + ')';
        h.style.animationDuration = (Math.random() * 7 + 7) + 's';
        h.style.animationDelay = (Math.random() * 3) + 's';
        heartsBg.appendChild(h);
        setTimeout(() => h.remove(), 16000);
    }
    for (let i = 0; i < 10; i++) setTimeout(createHeart, i * 500);
    setInterval(createHeart, 1000);


    // ===== Confetti =====
    function launchConfetti(count) {
        const container = document.getElementById('confetti');
        const colors = ['#ff4d6d', '#ff8fab', '#ffd700', '#c9184a', '#ff758f', '#e0c3fc', '#ffdab9'];
        count = count || 80;

        for (let i = 0; i < count; i++) {
            const p = document.createElement('div');
            p.className = 'confetti-piece';
            const color = colors[Math.floor(Math.random() * colors.length)];
            const isHeart = Math.random() < 0.3;

            p.style.left = Math.random() * 100 + '%';
            p.style.animationDuration = (Math.random() * 2 + 2) + 's';
            p.style.animationDelay = (Math.random() * 0.6) + 's';

            if (isHeart) {
                p.textContent = '\u2665';
                p.style.color = color;
                p.style.fontSize = (Math.random() * 14 + 10) + 'px';
            } else {
                p.style.background = color;
                p.style.width = (Math.random() * 8 + 5) + 'px';
                p.style.height = (Math.random() * 8 + 5) + 'px';
                if (Math.random() < 0.5) p.style.borderRadius = '50%';
            }

            container.appendChild(p);
            setTimeout(() => p.remove(), 4500);
        }
    }


    // ===== Screen Management =====
    function showScreen(id) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        const screen = document.getElementById(id);
        screen.classList.add('active', 'entering');
        setTimeout(() => screen.classList.remove('entering'), 600);
    }


    // ===== INTRO =====
    document.getElementById('startBtn').addEventListener('click', () => {
        showScreen('riddle1Screen');
    });


    // ===== RIDDLE 1: Crack the Code =====
    const r1Input = document.getElementById('riddle1Input');
    const r1Hint = document.getElementById('riddle1Hint');
    const lockIcon = document.getElementById('lockIcon');

    function checkRiddle1() {
        const val = r1Input.value.trim().toLowerCase();
        if (val === 'mike') {
            r1Input.classList.add('correct');
            r1Input.disabled = true;
            lockIcon.textContent = '\uD83D\uDD13';
            lockIcon.classList.add('unlocked');
            r1Hint.style.color = '#22c55e';
            r1Hint.textContent = 'Unlocked! \u2705';
            launchConfetti(30);
            setTimeout(() => showScreen('riddle2Screen'), 1200);
        } else if (val.length > 0) {
            r1Input.classList.add('shake');
            r1Hint.textContent = 'Not quite... try again!';
            setTimeout(() => r1Input.classList.remove('shake'), 500);
        }
    }

    document.getElementById('riddle1Submit').addEventListener('click', checkRiddle1);
    r1Input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') checkRiddle1();
    });


    // ===== RIDDLE 2: Unscramble =====
    const scrambledLetters = ['E', 'W', 'S', 'A', 'D', 'E', 'E'];
    const correctAnswer = 'SEAWEED';
    const scrambledTilesEl = document.getElementById('scrambledTiles');
    const answerSlots = document.querySelectorAll('.answer-slot');
    const r2Hint = document.getElementById('riddle2Hint');
    const answerRow = document.getElementById('answerSlots');
    let currentAnswer = [];
    let tileElements = [];

    // Shuffle the letters for display
    const shuffled = [...scrambledLetters];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    shuffled.forEach((letter, i) => {
        const tile = document.createElement('div');
        tile.className = 'letter-tile';
        tile.textContent = letter;
        tile.dataset.index = i;
        tile.addEventListener('click', () => pickTile(tile, letter));
        scrambledTilesEl.appendChild(tile);
        tileElements.push(tile);
    });

    function pickTile(tile, letter) {
        if (currentAnswer.length >= 7) return;
        tile.classList.add('used');
        currentAnswer.push({ letter, tile });
        const slot = answerSlots[currentAnswer.length - 1];
        slot.textContent = letter;
        slot.classList.add('filled');

        // Check if all slots filled
        if (currentAnswer.length === 7) {
            const guess = currentAnswer.map(a => a.letter).join('');
            if (guess === correctAnswer) {
                answerRow.classList.add('correct');
                r2Hint.style.color = '#22c55e';
                r2Hint.textContent = 'That\'s right, Seaweed! \uD83C\uDF3F';
                launchConfetti(30);
                setTimeout(() => showScreen('riddle3Screen'), 1200);
            } else {
                answerRow.classList.add('shake');
                r2Hint.textContent = 'Not quite... try rearranging!';
                setTimeout(() => {
                    answerRow.classList.remove('shake');
                    clearAnswer();
                }, 700);
            }
        }
    }

    function clearAnswer() {
        currentAnswer.forEach(a => a.tile.classList.remove('used'));
        currentAnswer = [];
        answerSlots.forEach(s => {
            s.textContent = '';
            s.classList.remove('filled');
        });
        answerRow.classList.remove('correct');
        r2Hint.textContent = '';
    }

    document.getElementById('clearTiles').addEventListener('click', clearAnswer);


    // ===== RIDDLE 3: The Magic Number =====
    const digits = ['d1', 'd2', 'd3', 'd4'];
    let enteredDigits = [];
    const r3Hint = document.getElementById('riddle3Hint');
    const correctNumber = '1520';

    document.querySelectorAll('.numpad-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.dataset.num;

            if (val === 'clear') {
                // Remove last digit
                if (enteredDigits.length > 0) {
                    enteredDigits.pop();
                    updateNumDisplay();
                }
                r3Hint.textContent = '';
                return;
            }

            if (val === 'go') {
                // Check answer
                if (enteredDigits.length === 4) {
                    const guess = enteredDigits.join('');
                    if (guess === correctNumber) {
                        digits.forEach(id => document.getElementById(id).classList.add('correct'));
                        r3Hint.style.color = '#22c55e';
                        r3Hint.textContent = '1520! We really are the same person \uD83E\uDDE0';
                        launchConfetti(50);
                        setTimeout(() => showScreen('askScreen'), 1500);
                    } else {
                        r3Hint.textContent = 'Hmm, that\'s not it... try again!';
                        digits.forEach(id => {
                            const el = document.getElementById(id);
                            el.classList.add('shake');
                            setTimeout(() => el.classList.remove('shake'), 500);
                        });
                        // Clear after shake
                        setTimeout(() => {
                            enteredDigits = [];
                            updateNumDisplay();
                        }, 600);
                    }
                } else {
                    r3Hint.textContent = 'Enter all 4 digits first!';
                }
                return;
            }

            // Regular digit
            if (enteredDigits.length < 4) {
                enteredDigits.push(val);
                updateNumDisplay();
                r3Hint.textContent = '';
            }
        });
    });

    function updateNumDisplay() {
        digits.forEach((id, i) => {
            const el = document.getElementById(id);
            if (i < enteredDigits.length) {
                el.textContent = enteredDigits[i];
                el.classList.add('active');
                el.classList.remove('correct');
            } else {
                el.textContent = '_';
                el.classList.remove('active', 'correct');
            }
        });
    }


    // ===== THE BIG ASK: Runaway No Button =====
    const btnNo = document.getElementById('btnNo');
    const btnYes = document.getElementById('btnYes');
    const askButtons = document.getElementById('askButtons');
    let noAttempts = 0;

    const noTexts = [
        'No',
        'Are you sure?',
        'Really??',
        'Think again...',
        'Nope, wrong answer!',
        'Try the other button!',
        'You can\'t click me!',
        '\uD83D\uDE1C',
    ];

    function moveNoButton() {
        noAttempts++;
        const parentRect = askButtons.getBoundingClientRect();
        const btnRect = btnNo.getBoundingClientRect();

        // Random position within reasonable bounds around the screen
        const viewW = window.innerWidth;
        const viewH = window.innerHeight;
        const maxX = viewW - btnRect.width - 20;
        const maxY = viewH - btnRect.height - 20;
        const newX = Math.random() * maxX + 10;
        const newY = Math.random() * maxY + 10;

        btnNo.style.position = 'fixed';
        btnNo.style.left = newX + 'px';
        btnNo.style.top = newY + 'px';
        btnNo.style.zIndex = '100';
        btnNo.style.transition = 'all 0.15s ease';

        // Shrink it progressively
        const scale = Math.max(0.4, 1 - noAttempts * 0.1);
        btnNo.style.transform = 'scale(' + scale + ')';

        // Change text
        if (noAttempts <= noTexts.length) {
            btnNo.textContent = noTexts[Math.min(noAttempts - 1, noTexts.length - 1)];
        }

        // After many attempts, make the Yes button grow
        if (noAttempts >= 3) {
            const yesScale = 1 + noAttempts * 0.05;
            btnYes.style.transform = 'scale(' + Math.min(yesScale, 1.4) + ')';
        }
    }

    // Mouse: move on hover
    btnNo.addEventListener('mouseenter', (e) => {
        e.preventDefault();
        moveNoButton();
    });

    // Touch: move on touchstart
    btnNo.addEventListener('touchstart', (e) => {
        e.preventDefault();
        moveNoButton();
    }, { passive: false });

    // Yes button
    btnYes.addEventListener('click', () => {
        launchConfetti(150);
        setTimeout(() => launchConfetti(100), 500);
        setTimeout(() => launchConfetti(80), 1000);
        setTimeout(() => showScreen('yesScreen'), 800);
    });

    // Build yes hearts
    const yesHearts = document.getElementById('yesHearts');
    for (let i = 0; i < 5; i++) {
        const h = document.createElement('span');
        h.textContent = '\u2665';
        h.style.color = 'rgba(255, 77, 109, ' + (0.5 + Math.random() * 0.5) + ')';
        h.style.animationDelay = (Math.random() * 0.3) + 's';
        yesHearts.appendChild(h);
    }

});

