const playClass = 'playing';
const keys = document.querySelectorAll('.key');

const setKeyActive = (key, show) =>  show ? key.classList.add(playClass) : key.classList.remove(playClass);
// const setKeyActive = (key, show) =>  key.classList.toggle(show, playClass);

// this is an interesting pattern because we can easily curry an event listener callback 
// if we need the 'e' parameter of it to process an operation
// so have the specific operation first on the chain then the function containing the 'e' param from the callback
const onTransitionEnd = (property, cb) => e => e.propertyName === property ? cb(e.target) : false;

const playSound = ({keyCode}) => {
		const audio = document.querySelector(`audio[data-key="${keyCode}"]`);
		const key = document.querySelector(`.key[data-key="${keyCode}"]`);
	// return if there is not sound associated with the key pressed 
	if(!audio) { return; }

	// this make sure we rewind the sound before playing it, which makes possible 
	// repeating playing the sound with having to wait until the sound has finished playing
	audio.currentTime = 0;
	audio.play();
	setKeyActive(key, true);
}

// using onTransitionEnd makes possible to curry the event listener callback implicitly 
keys.forEach(key => key.addEventListener('transitionend', onTransitionEnd('transform', setKeyActive )) );

window.addEventListener('keydown', playSound);