// set some variables to hold the html nodes
const clock = document.querySelector('.clock');
const clockHands = [...document.querySelectorAll('.js-hand')];

// generate object containing keys for each time unit
const getDate = () => {
    const date = new Date();
    return {
        sec: date.getSeconds(),
        min: date.getMinutes(),
        hour: date.getHours()
    }
};

// get time unit
const getUnit = (unit, date = getDate()) => date[unit];

// get rotation degree based on the time unit
const getDegree = (unit, offset = 90) => unit === 'hour' ? 
      (getUnit(unit) / 12 * 360) + offset : (getUnit(unit) / 60 * 360) + offset;

// set angle for a clock arm
const setAngle = node => {
  const {style, dataset} = node;
  const unitType = dataset.unit;
  const degree = getDegree(unitType);
    
  style.transitionDuration = degree === 90 ? '0s' : '0.3s';
  style.transform = `rotate(${degree}deg)`;
  
  return node;
}

//  set the correct time on the clock
// this is the equivalent to:

//const setTime = () => clockHands.forEach(
//    (hand, i) => {
//        setAngle(hand);
//    }
//);
const setTime = () => clockHands.forEach(setAngle);

// wait until we offset the arms to 90 degrees before showing the clock
const showClock = () => clock.classList.add('is-visible');

clock.addEventListener('transitionend', showClock);

// update clock time once every second
setInterval(setTime, 1000);