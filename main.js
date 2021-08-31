"use strict";

const GAME_DURATION_SEC = 10;
const MOUSE_COUNT = 5;
const CHEESE_COUNT = 5;
const BULLET_COUNT = 8;
const MOUSE_SIZE = 70;
const SNIPER_SIZE = 200;
const ANIMATION_HEIGHT = 70;

const soundMainBG = new Audio(`sound/mainBG.mp3`);
const soundGameBG = new Audio(`sound/gameBG.mp3`);
const soundClick = new Audio(`sound/gunSound.wav`);
const soundMouse = new Audio(`sound/ratSound.mp3`);
const soundAlert = new Audio(`sound/alert.wav`);
const soundLose = new Audio(`sound/game_lose.mp3`);
const soundWin = new Audio(`sound/game_win.mp3`);

const mainScreen = document.querySelector(".mainScreen");
const title = document.querySelector(".title");
const ruleDescription = document.querySelector(".ruleDescription");
const ruleBtn = document.querySelector(".ruleBtn");
const closeBtn = document.querySelector(".closeBtn");
const gameMenu = document.querySelector(".gameMenu");
const gameBtn = document.querySelector(".gameBtn");
const gameTimer = document.querySelector(".gameTimer");
const gameLevel = document.querySelector(".gameLevel");
const gameLeftMouse = document.querySelector(".gameLeftMouse");
const gameBullet = document.querySelector(".gameBullet");
const gameScreen = document.querySelector(".gameScreen");
const sniper = document.querySelector(".sniper");
const sniperRect = sniper.getBoundingClientRect();
const gameField = document.querySelector(".gameField");
const gameFieldRect = gameField.getBoundingClientRect();
const popUp = document.querySelector(".popUp");
const popUpText = document.querySelector(".comment");
const reStartBtn = document.querySelector(".reStartBtn");
const nextLevelBtn = document.querySelector(".nextLevelBtn");
const playBg = document.querySelector(".playBg");

let started = false;
let paused = false;
let timer = undefined;
let score = 0;
let level = 1;
let win = `win`;
let loose = `loose`;
let bulletCount = BULLET_COUNT;
let mouseCount = MOUSE_COUNT;
let cheeseCount = CHEESE_COUNT;

clickRuleBtn();

playBg.addEventListener("click", () => {
    playSound(soundMainBG);
});

document.addEventListener("mousemove", (e) => {
    if (started) {
        if (e.clientX < gameFieldRect.width - SNIPER_SIZE) {
            sniper.style.left = `${e.clientX}px`;
        }
    } else {
        return;
    }
});

gameField.addEventListener("click", (event) => {
    if (!started) {
        return;
    }
    const target = event.target;
    updateBullet(--bulletCount);
    soundClick.volume = 0.5;
    playSound(soundClick);
    if (bulletCount <= 0) {
        stopGame("YOU USED ALL BULLETS😢<br/>TRY AGAIN👍");
        hideNextLevelBtn();
        playSound(soundLose);
    }
    if (target.className === "mouse") {
        target.remove();
        playSound(soundMouse);
        score++;
        updateRemainingMouse(score);
        if (score === mouseCount) {
            stopGame(`YOU WON🎉<br/>GO TO THE NEXT LEVEL✌️`);
            showNextLevelBtn();
            playSound(soundWin);
        }
    } else if (target.className === "cheese") {
        stopGame("YOU SHOOT A CHEESE😢<br/>TRY AGAIN👍");
        hideNextLevelBtn();
        playSound(soundLose);
    }
});

gameBtn.addEventListener("click", () => {
    startGame(1, MOUSE_COUNT, CHEESE_COUNT, BULLET_COUNT);
    stopSound(soundMainBG);
});

reStartBtn.addEventListener("click", () => {
    level = 1;
    mouseCount = MOUSE_COUNT;
    cheeseCount = CHEESE_COUNT;
    bulletCount = BULLET_COUNT;
    startGame(1, mouseCount, cheeseCount, bulletCount);
});

nextLevelBtn.addEventListener("click", () => {
    ++level;
    ++mouseCount;
    ++cheeseCount;
    bulletCount = BULLET_COUNT + level - 1;
    startGame(level, mouseCount, cheeseCount, bulletCount);
});

function startGame(level, mouseCount, cheeseCount, bulletCount) {
    gameBtn.innerHTML = `HOW TO PLAY`;
    started = true;
    paused = false;
    score = 0;
    switchGameMenu();
    initGame(mouseCount, cheeseCount);
    startGameTimer();
    updateRemainingMouse(score);
    updateBullet(bulletCount);
    updateLevel(level);
    hidePopUp();
    showRuleBtn();
    playSound(soundGameBG);
}

function stopGame(text) {
    started = false;
    stopGameTimer();
    showPopUp();
    hideRuleBtn();
    updatePopUpText(text);
    stopSound(soundGameBG);
}

function updatePopUpText(text) {
    popUpText.innerHTML = text;
}

function startGameTimer() {
    let remainingTime = GAME_DURATION_SEC;
    updateTimer(remainingTime);
    timer = setInterval(() => {
        if (!paused) {
            if (remainingTime <= 0) {
                stopGame("TIME IS OUT😢<br/>TRY AGAIN👍");
                hideNextLevelBtn();
                return;
            }
            updateTimer(--remainingTime);
        }
    }, 1000);
}

function stopGameTimer() {
    clearInterval(timer);
}

function updateTimer(sec) {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    gameTimer.innerHTML = `
    <i class="fas fa-hourglass-half"></i> ${minutes}:${seconds}
    `;
}

function initGame(mouseCount, cheeseCount) {
    gameField.innerHTML = "";
    addItems("mouse", mouseCount, "img/rat2.png");
    addItems("cheese", cheeseCount, "img/cheese.png");
}

function addItems(className, count, imgPath) {
    for (let i = 0; count > i; i++) {
        const x1 = 0;
        const y1 = 0;
        const x2 = gameFieldRect.width - MOUSE_SIZE;
        const y2 = gameFieldRect.height - MOUSE_SIZE - ANIMATION_HEIGHT;
        const item = document.createElement("img");
        item.setAttribute("class", className);
        item.setAttribute("src", imgPath);
        item.style.position = "absolute";
        const x = randomNumber(x1, x2);
        const y = randomNumber(y1, y2);
        item.style.bottom = `${y}px`;
        item.style.left = `${x}px`;
        if (item.className === "mouse") {
            item.animate(
                [
                    { transform: "translateY(0px)" },
                    { transform: "translateY(-100px)" },
                    { transform: "translateY(0px)" },
                ],
                {
                    duration: 5000,
                    iterations: Infinity,
                }
            );
        }

        gameField.appendChild(item);
    }
}

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function switchGameMenu() {
    mainScreen.classList.add("mainScreen__gameMode");
    title.classList.add("title__hide");
    gameMenu.classList.add("gameMenu__gameMode");
    gameBtn.classList.add("gameBtn__gameMode");
    ruleBtn.classList.add("ruleBtn__gameMode");
    gameTimer.classList.remove("gameTimer__hide");
    gameLeftMouse.classList.remove("gameLeftMouse__hide");
    gameLevel.classList.remove("gameLevel__hide");
    gameBullet.classList.remove("gameBullet__hide");
    gameScreen.classList.remove("gameScreen__hide");
    sniper.classList.remove("sniper__hide");
    playBg.classList.add("playBg__hide");
}

function clickRuleBtn() {
    ruleBtn.addEventListener("click", () => {
        started = false;
        paused = true;
        ruleDescription.classList.remove("ruleDescription__hide");
    });
    closeBtn.addEventListener("click", () => {
        paused = false;
        started = true;
        ruleDescription.classList.add("ruleDescription__hide");
    });
}

function updateRemainingMouse(score) {
    const RemainingMouse = mouseCount - score;
    gameLeftMouse.innerHTML = `
    <img src="img/rat2.png" alt="rat" /> ${RemainingMouse}
    `;
}

function updateBullet(bulletCount) {
    gameBullet.innerHTML = `
    <img src="img/bullet.png" alt="bullet" /> ${bulletCount}
    `;
}

function updateLevel(level) {
    gameLevel.innerHTML = `LV ${level}`;
}

function showPopUp() {
    popUp.classList.remove("popUp__hide");
}

function hidePopUp() {
    popUp.classList.add("popUp__hide");
}

function hideRuleBtn() {
    ruleBtn.classList.add("ruleBtn__hide");
}

function showRuleBtn() {
    ruleBtn.classList.remove("ruleBtn__hide");
}

function hideNextLevelBtn() {
    nextLevelBtn.classList.add("nextLevelBtn__hide");
}

function showNextLevelBtn() {
    nextLevelBtn.classList.remove("nextLevelBtn__hide");
}

function playSound(sound) {
    sound.currentTime = 0;
    sound.play();
}

function stopSound(sound) {
    sound.pause();
}
