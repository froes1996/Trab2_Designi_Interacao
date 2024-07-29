document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const message = document.getElementById('message');
    const scoreDisplay = document.getElementById('score');
    const highscoreDisplay = document.getElementById('highscore');

    let score = 0;
    let highscore = localStorage.getItem('highscore') || 0;
    let gameInterval;
    let starInterval;
    let obstacleInterval;
    let isGameActive = false;

    let touchStartX = 0;
    let touchStartY = 0;

    highscoreDisplay.textContent = highscore;

    startBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);
    document.addEventListener('keydown', movePlayer);

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);

    function startGame() {
        isGameActive = true;
        score = 0;
        scoreDisplay.textContent = score;
        message.textContent = '';
        startBtn.style.display = 'none';
        restartBtn.style.display = 'none';
        player.style.top = '50%';
        player.style.left = '50%';

        gameInterval = setInterval(updateGame, 1000 / 60);
        starInterval = setInterval(createStar, 2000);
        obstacleInterval = setInterval(createObstacle, 3000);
    }

    function restartGame() {
        clearInterval(gameInterval);
        clearInterval(starInterval);
        clearInterval(obstacleInterval);
        document.querySelectorAll('.star').forEach(star => star.remove());
        document.querySelectorAll('.obstacle').forEach(obstacle => obstacle.remove());

        startGame();
    }

    function movePlayer(e) {
        if (!isGameActive) return;

        const playerRect = player.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();
        
        switch (e.key) {
            case 'ArrowUp':
                if (playerRect.top > containerRect.top) {
                    player.style.top = `${player.offsetTop - 10}px`;
                }
                break;
            case 'ArrowDown':
                if (playerRect.bottom < containerRect.bottom) {
                    player.style.top = `${player.offsetTop + 10}px`;
                }
                break;
            case 'ArrowLeft':
                if (playerRect.left > containerRect.left) {
                    player.style.left = `${player.offsetLeft - 10}px`;
                }
                break;
            case 'ArrowRight':
                if (playerRect.right < containerRect.right) {
                    player.style.left = `${player.offsetLeft + 10}px`;
                }
                break;
        }
    }

    function handleTouchStart(e) {
        e.preventDefault();

        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function handleTouchMove(e) {
        e.preventDefault();
        if (!isGameActive) return;

        const touch = e.touches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        const playerRect = player.getBoundingClientRect();
        const containerRect = document.querySelector('.container').getBoundingClientRect();

        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (deltaX > 0 && playerRect.right < containerRect.right) {
                player.style.left = `${player.offsetLeft + 10}px`;
            } else if (deltaX < 0 && playerRect.left > containerRect.left) {
                player.style.left = `${player.offsetLeft - 10}px`;
            }
        } else {
            if (deltaY > 0 && playerRect.bottom < containerRect.bottom) {
                player.style.top = `${player.offsetTop + 10}px`;
            } else if (deltaY < 0 && playerRect.top > containerRect.top) {
                player.style.top = `${player.offsetTop - 10}px`;
            }
        }


        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    }

    function updateGame() {
        document.querySelectorAll('.star').forEach(star => {
            if (checkCollision(player, star)) {
                star.remove();
                score++;
                scoreDisplay.textContent = score;
            }
        });

        document.querySelectorAll('.obstacle').forEach(obstacle => {
            if (checkCollision(player, obstacle)) {
                endGame();
            }
        });
    }

    function createStar() {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.top = `${Math.random() * 90}%`;
        star.style.left = `${Math.random() * 90}%`;
        document.querySelector('.game-area').appendChild(star);
    }

    function createObstacle() {
        const obstacle = document.createElement('div');
        obstacle.classList.add('obstacle');
        obstacle.style.top = `${Math.random() * 90}%`;
        obstacle.style.left = `${Math.random() * 90}%`;
        document.querySelector('.game-area').appendChild(obstacle);
    }

    function checkCollision(rect1, rect2) {
        const rect1Bounds = rect1.getBoundingClientRect();
        const rect2Bounds = rect2.getBoundingClientRect();

        return !(
            rect1Bounds.top > rect2Bounds.bottom ||
            rect1Bounds.bottom < rect2Bounds.top ||
            rect1Bounds.left > rect2Bounds.right ||
            rect1Bounds.right < rect2Bounds.left
        );
    }

    function endGame() {
        isGameActive = false;
        clearInterval(gameInterval);
        clearInterval(starInterval);
        clearInterval(obstacleInterval);
        message.textContent = 'Game Over';
        startBtn.style.display = 'none';
        restartBtn.style.display = 'block';

        if (score > highscore) {
            highscore = score;
            localStorage.setItem('highscore', highscore);
            highscoreDisplay.textContent = highscore;
        }
    }
});
