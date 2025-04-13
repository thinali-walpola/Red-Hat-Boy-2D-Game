function controller(event) {
    if (event.key == "Enter") {
        if (runWorkerNumber == 0) {
            run();
            runSound.play();
            moveBackground();
            updateScore();
            flameLocations.forEach((x) => createFlame(x));
        }
    }
    if (event.key == " ") {
        if (runWorkerNumber != 0) {
            if (jumpWorkerNumber == 0) {
                clearInterval(runWorkerNumber);
                runSound.pause();
                jump();
                jumpSound.play();
            }
        }
    }
}

var runImgNumber = 1;
var runWorkerNumber = 0;
var runSound = new Audio("run.mp3");
runSound.loop = true;

function run() {
    runWorkerNumber = setInterval(() => {
        runImgNumber++;
        if (runImgNumber == 9) {
            runImgNumber = 1;
        }
        document.getElementById("boy").src = "run" + runImgNumber + ".png";
    }, 100);
}

var jumpWorkerNumber = 0;
var jumpImgNumber = 1;
var jumpMarginTop = 430;
var jumpSound = new Audio("jump.mp3");

function jump() {
    jumpWorkerNumber = setInterval(() => {
        jumpImgNumber++;
        if (jumpImgNumber < 8) {
            jumpMarginTop -= 15;
        } else {
            jumpMarginTop += 15;
        }
        document.getElementById("boy").style.marginTop = jumpMarginTop + "px";
        document.getElementById("boy").src = "jump" + jumpImgNumber + ".png";
        if (jumpImgNumber == 13) {
            jumpImgNumber = 1;
            clearInterval(jumpWorkerNumber);
            jumpWorkerNumber = 0;
            run();
            runSound.play();
        }
    }, 100);
}

var backgroundWorkerNumber = 0;
var moveBackgroundX = 0;

function moveBackground() {
    backgroundWorkerNumber = setInterval(() => {
        moveBackgroundX -= 10;
        document.getElementById("background").style.backgroundPositionX = moveBackgroundX + "px";
    }, 50);
}

var scoreWorkerNumber = 0;
var score = 0;

function updateScore() {
    scoreWorkerNumber = setInterval(() => {
        if (score >= 2000) {
            alert("You won! Press OK to restart.");
            window.location.reload();
        }
        score += 10;
        document.getElementById("score").innerHTML = score;
    }, 200);
}

var flameLocations = [500, 800, 1100, 1400, 1700, 2000, 2300,2700,3000,3300,3600,3900,4200,4500];

function createFlame(x) {
    var flame = document.createElement("img");
    flame.src = "flame.gif";
    flame.className = "flame";
    flame.style.marginLeft = x + "px";
    document.getElementById("background").appendChild(flame);
    var flameWorkerNumber = setInterval(() => {
        x -= 5;
        flame.style.marginLeft = x + "px";
        if (x < -100) {
            clearInterval(flameWorkerNumber);
            flame.remove();
        }
        if (x <= 140 && x >= 100 && jumpWorkerNumber == 0) {
            clearInterval(runWorkerNumber);
            runSound.pause();
            clearInterval(backgroundWorkerNumber);
            clearInterval(scoreWorkerNumber);
            clearInterval(flameWorkerNumber);
            dead();
            deadSound.play();
        }
    }, 50);
}

function showGameOverScreen() {
    let gameOverDiv = document.createElement("div");
    gameOverDiv.id = "gameOverScreen";
    gameOverDiv.innerHTML = `
        <div class='game-over-content'>
            <h1>GAME OVER!</h1>
            <h2>Your Score: ${score}</h2>
            <h3>Highest Score: ${getHighestScore()}</h3>
            <button onclick='restartGame()'>Try Again?</button>
        </div>
    `;
    document.body.appendChild(gameOverDiv);
    gameOverDiv.classList.add("fade-in");
    updateHighestScore(score);
}

function restartGame() {
    window.location.reload();
}

function updateHighestScore(currentScore) {
    let highestScore = localStorage.getItem("highestScore") || 0;
    if (currentScore > highestScore) {
        localStorage.setItem("highestScore", currentScore);
    }
}

function getHighestScore() {
    return localStorage.getItem("highestScore") || 0;
}

var deadWorkerNumber = 0;
var deadImgNumber = 1;
var deadSound = new Audio("dead.mp3");
function dead() {
    deadWorkerNumber = setInterval(() => {
        deadImgNumber++;
        if (deadImgNumber == 11) {
            clearInterval(deadWorkerNumber);
            showGameOverScreen();
        }
        document.getElementById("boy").src = "dead" + deadImgNumber + ".png";
    }, 100);
}