const timerDisplay = document.querySelector('.js-time-left');
const endTime = document.querySelector('.js-time-end');
const buttons = document.querySelectorAll('[data-time]');
let countdown;
function timer(seconds) {
    // clear any existing timers
    clearInterval(countdown);
    const now = Date.now();
    const then = now + seconds * 1000;
    displayTimeLeft(seconds);
    displayEndTime(then);
    countdown = setInterval(() => {
        const secondsLeft = Math.round((then - Date.now()) / 1000);
        // check if we should stop it
        if(secondsLeft <= 0) {
            clearInterval(countdown);
            return;
        }
        displayTimeLeft(secondsLeft);
    }, 1000);
}

function displayTimeLeft(seconds) {
    const [minutes, remainderSeconds ] = [Math.floor(seconds / 60), seconds % 60];
    const display = `${minutes < 10 ? '0' : ''}${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
    timerDisplay.textContent = display;
    document.title = display;
}

function displayEndTime(timeStamp) {
    const end = new Date(timeStamp);
    const [hour, minutes] = [end.getHours(), end.getMinutes()];
    const display = `Be back at ${hour}:${minutes}`;
    endTime.textContent = display;

}

function startTimer() {
    const seconds = parseInt(this.dataset.time);
    timer(seconds);
}

buttons.forEach((button => button.addEventListener('click', startTimer)));

document.customForm.addEventListener('submit', function(e){
    e.preventDefault();
    const mins = this.minutes.value;
    timer(mins * 60);
    this.reset();
})