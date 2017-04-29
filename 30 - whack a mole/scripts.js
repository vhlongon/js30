const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const moles = document.querySelectorAll('.mole');
const startButton = document.querySelector('.js-start');
const speedLevel = {min:200, max: 1000}; // min and max values for showing a mole
const duration = 10 // 10 seconds
let lastHole;
let timeUp = false;

const generateRandomTime = (min, max) =>
    Math.round(Math.random() * (max - min) + min);

const generateRandomIndex = collection =>
    Math.floor(Math.random() * collection.length);

const getRandomHole = holes => {
    const currentHole = holes[generateRandomIndex(holes)];
    if (currentHole === lastHole) {
        return getRandomHole(holes)
    }
    lastHole = currentHole;
    return currentHole;
};

const showMole = ({min, max}) => {
    const time = generateRandomTime(min, max);
    const hole = getRandomHole(holes);
    hole.classList.add('up');
    setTimeout(()=> {
        hole.classList.remove('up');
        !timeUp && showMole(speedLevel);
    }, time)
};

const resetGame = () => {
    scoreBoard.textContent = 0;
    score = 0;
    timeUp = false;
}

const startGame = duration => {
    resetGame();
    showMole(speedLevel);
    setTimeout(() => timeUp = true, duration * 1000)
}

const onMoleClick = e => {
    // if the click is not from an actual user click return
    // no cheating!
    if (!e.isTrusted) return;
    score++;
    e.target.classList.remove('up');
    scoreBoard.textContent = score;
}

moles.forEach(mole => mole.addEventListener('click', onMoleClick));

startButton.addEventListener('click', () => startGame(duration));