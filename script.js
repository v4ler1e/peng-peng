const canvas = document.getElementById('pong');
const context = canvas.getContext('2d');

const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 100;
const BALL_RADIUS = 10;
const PADDLE_SPEED = 6;

let ballSpeedX = 4;
let ballSpeedY = 4;
let paused = true;

const leftPaddle = { x: 10, y: canvas.height / 2 - PADDLE_HEIGHT / 2 };
const rightPaddle = { x: canvas.width - PADDLE_WIDTH - 10, y: canvas.height / 2 - PADDLE_HEIGHT / 2 };
const ball = { x: canvas.width / 2, y: canvas.height / 2 };

let score1 = 0;
let score2 = 0;
const score1Display = document.getElementById("score1");
const score2Display = document.getElementById("score2");

const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

const speedSettings = {
    easy: { speedX: 4, speedY: 4 },
    normal: { speedX: 6, speedY: 6 },
    hard: { speedX: 8, speedY: 8 },
    insane: { speedX: 10, speedY: 10 }
};

let currentSpeed = speedSettings.normal;

const ballColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
let currentBallColor = ballColors[0];

let highScore1 = 0;
let highScore2 = 0;

function updateLeaderboard() {
    document.getElementById("currentScore1").textContent = score1;
    document.getElementById("highScore1").textContent = highScore1;
    document.getElementById("currentScore2").textContent = score2;
    document.getElementById("highScore2").textContent = highScore2;
}

function resetBall() {
    currentBallColor = ballColors[Math.floor(Math.random() * ballColors.length)];
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ballSpeedX = -currentSpeed.speedX;
    ballSpeedY = currentSpeed.speedY;
    paused = true;
}

document.addEventListener('keydown', (event) => {
    if (event.key === "w" || event.key === "s") {
        keys[event.key] = true;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        keys[event.key] = true;
    }
    if (paused && (event.key === "w" || event.key === "s" || event.key === "ArrowUp" || event.key === "ArrowDown")) {
        paused = false;
    }
    if (event.key.toLowerCase() === 'r') {
        resetGame();
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === "w" || event.key === "s") {
        keys[event.key] = false;
    }
    if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        keys[event.key] = false;
    }
});

function update() {
    if (paused) return;

    if (keys.w && leftPaddle.y > 0) leftPaddle.y -= PADDLE_SPEED;
    if (keys.s && leftPaddle.y < canvas.height - PADDLE_HEIGHT) leftPaddle.y += PADDLE_SPEED;

    if (keys.ArrowUp && rightPaddle.y > 0) rightPaddle.y -= PADDLE_SPEED;
    if (keys.ArrowDown && rightPaddle.y < canvas.height - PADDLE_HEIGHT) rightPaddle.y += PADDLE_SPEED;

    ball.x += ballSpeedX;
    ball.y += ballSpeedY;

    if (ball.y <= BALL_RADIUS || ball.y >= canvas.height - BALL_RADIUS) {
        ballSpeedY = -ballSpeedY;
    }

    if (ball.x - BALL_RADIUS <= leftPaddle.x + PADDLE_WIDTH && ball.y >= leftPaddle.y && ball.y <= leftPaddle.y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX * 1.05;
        ball.x = leftPaddle.x + PADDLE_WIDTH + BALL_RADIUS;
    }

    if (ball.x + BALL_RADIUS >= rightPaddle.x && ball.y >= rightPaddle.y && ball.y <= rightPaddle.y + PADDLE_HEIGHT) {
        ballSpeedX = -ballSpeedX * 1.05;
        ball.x = rightPaddle.x - BALL_RADIUS;
    }

    if (ball.x < 0) {
        score2++;
        score2Display.textContent = score2;
        if (score2 > highScore2) highScore2 = score2;
        resetBall();
        updateLeaderboard();
    }

    if (ball.x > canvas.width) {
        score1++;
        score1Display.textContent = score1;
        if (score1 > highScore1) highScore1 = score1;
        resetBall();
        updateLeaderboard();
    }
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    context.fillStyle = 'white';
    context.fillRect(leftPaddle.x, leftPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    context.fillRect(rightPaddle.x, rightPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT);

    context.strokeStyle = 'white';
    context.lineWidth = 2;
    for (let i = 0; i < canvas.height; i += 30) {
        context.beginPath();
        context.moveTo(canvas.width / 2, i);
        context.lineTo(canvas.width / 2, i + 15);
        context.stroke();
    }

    context.beginPath();
    context.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    context.fillStyle = currentBallColor;
    context.fill();
    context.closePath();
}

function resetGame() {
    score1 = 0;
    score2 = 0;
    score1Display.textContent = score1;
    score2Display.textContent = score2;
    resetBall();
    updateLeaderboard();
}

document.getElementById("easy").addEventListener("click", () => {
    currentSpeed = speedSettings.easy;
    resetBall();
});

document.getElementById("normal").addEventListener("click", () => {
    currentSpeed = speedSettings.normal;
    resetBall();
});

document.getElementById("hard").addEventListener("click", () => {
    currentSpeed = speedSettings.hard;
    resetBall();
});

document.getElementById("insane").addEventListener("click", () => {
    currentSpeed = speedSettings.insane;
    resetBall();
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
