//  get our elements
const player = document.querySelector('.player');
const video = player.querySelector('.viewer');
const progress = player.querySelector('.progress');
const progressBar = player.querySelector('.progress__filled');
const toggle = player.querySelector('.toggle');
const skipButtons = player.querySelectorAll('[data-skip]');
const ranges = player.querySelectorAll('.player__slider');
const fullScreen = document.querySelector('.fullscreen');

//  build our functions

const togglePlay = video => e => video.paused ? video.play() : video.pause();
// alternative approach, using a ternary to define the method a string matching the method to be run
// video[video.paused ? 'play' : 'pause']();

const updateButton = (buttonNode, videoNode) => e => buttonNode.textContent = videoNode.paused ? '►' : '❚ ❚';

const skipDuration = (skipNode, nodeVideo) => e => nodeVideo.currentTime += parseFloat(skipNode.dataset.skip);

// this works because the name giving to the range nodes matches the properties on the video object
const updateRange = (rangeNode, videoNode) => e => videoNode[rangeNode.name] = rangeNode.value;

const updateProgress = (progressNode, videoNode) => e => {
    const percent = (video.currentTime / video.duration) * 100;
    progressNode.style.flexBasis = `${percent}%`;
    return progressNode;
}

const slideDuration = (slideNode, videoNode) => ({offsetX}) => 
    video.currentTime  = (offsetX / slideNode.offsetWidth) * video.duration;

const toggleFullscreen = playerNode => e => playerNode.classList.toggle('is-fullscreen');

// hook our events

video.addEventListener('click', togglePlay(video));
video.addEventListener('play', updateButton(toggle, video));
video.addEventListener('pause', updateButton(toggle, video));
video.addEventListener('timeupdate', updateProgress(progressBar, video));

toggle.addEventListener('click', togglePlay(video));

skipButtons.forEach(button => button.addEventListener('click', skipDuration(button, video)) );

ranges.forEach(range => range.addEventListener('change', updateRange(range, video)) );
ranges.forEach(range => range.addEventListener('mousemove', updateRange(range, video)) );

let mousedown = false;
progress.addEventListener('click', slideDuration(progress, video));

// here we take advantage of shortcircuiting, which means if mousedown is true run slideDuration otherwise it will only return false
progress.addEventListener('mousemove', (e) => mousedown && slideDuration(progress, video)(e));
progress.addEventListener('mousedown', () => mousedown = true);
progress.addEventListener('mouseup', () => mousedown = false);

fullScreen.addEventListener('click', toggleFullscreen(player));

console.dir(video);
