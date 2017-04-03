const video = document.querySelector('.player');
const photoBtn = document.querySelector('.js-photo-btn');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const filterSelect = document.querySelector('.filter');
const rgbControls = document.querySelector('.rgb');
let paintingInterval;

let imageNumber = 0;

function renderVideo(videoNode = video) {
    // get the video from the browser and return a promise with a media stream
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then(localMediaStream => {
            // the media stream has to be transformed so that the video element can understand it
            videoNode.src = window.URL.createObjectURL(localMediaStream);
            videoNode.play();
        })
        .catch(err => {
            console.error(err);
        })
};

const createSnapshot = (id = 0, canvasNode = canvas) => {
    // this creates an image data object returning text representation of the iamge
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement(`a`);
    link.href = data;
    link.setAttribute('download', `snapshot${id}`);
    link.classList.add('snapshot');
    link.innerHTML = `
        <div>
            <img src="${data}" alt="snapshot ${id}" />
        </div>
        <div>snapshot ${id}</div>`;
    return link;
};

const redEffect = pixels => {
    // each pixel outputs 4 items in the array, the first is for red, second for green, third for blue and the fourth for alpha,
    // thus RGBA and it is also why we iterate in steps of for 'i += 4'.
    // Since this a special array it doesnt support functors (map, filter, etc) so we need to use a for loop
    // debugger
    const {data} = pixels;
    for(let i = 0; i < data.length; i += 4) {
        data[i + 0] = data[i + 0] + 150 // red
        data[i + 1] = data[i + 1] - 50 // green
        data[i + 2] = data[i + 2] * 0.5 // blue
    }
    return pixels;
};

const greenEffect = pixels => {
    // each pixel outputs 4 items in the array, the first is for red, second for green, third for blue and the fourth for alpha,
    // thus RGBA and it is also why we iterate in steps of for 'i += 4'.
    // Since this a special array it doesnt support functors (map, filter, etc) so we need to use a for loop
    // debugger
    const {data} = pixels;
    for(let i = 0; i < data.length; i += 4) {
        data[i + 0] = data[i + 0] - 100 // red
        data[i + 1] = data[i + 1] + 150 // green
        data[i + 2] = data[i + 2] + 50 // blue
    }
    return pixels;
};

const blueEffect = pixels => {
    // each pixel outputs 4 items in the array, the first is for red, second for green, third for blue and the fourth for alpha,
    // thus RGBA and it is also why we iterate in steps of for 'i += 4'.
    // Since this a special array it doesnt support functors (map, filter, etc) so we need to use a for loop
    // debugger
    const {data} = pixels;
    for(let i = 0; i < data.length; i += 4) {
        data[i + 0] = data[i + 0] - 50 // red
        data[i + 1] = data[i + 1] * 0.5 // green
        data[i + 2] = data[i + 2] + 150 // blue
    }
    return pixels;
};

const rgbSplit = pixels => {
    // each pixel outputs 4 items in the array, the first is for red, second for green, third for blue and the fourth for alpha,
    // thus RGBA and it is also why we iterate in steps of for 'i += 4'.
    // Since this a special array it doesnt support functors (map, filter, etc) so we need to use a for loop
    const {data} = pixels;
    // change the position of each channel
    for(let i = 0; i < data.length; i += 4) {
        data[i - 150] = data[i + 0] // red
        data[i + 100 ] = data[i + 1] // green
        data[i + 150] = data[i + 2]  // blue
    }
    return pixels;
};

const blackAndWhite = pixels => {
    const {data} = pixels;
    for(let i = 0; i < data.length; i += 4) {
        red = data[i + 0];
        green = data[i + 1];
        blue = data[i + 2];
        grey = parseInt((red + green + blue) / 3);

        data[i + 0] = grey // red
        data[i + 1] = grey // green
        data[i + 2] = grey  // blue
    }
    return pixels;
};

const sephia = pixels => {
    const {data} = pixels;
    for(let i = 0; i < data.length; i += 4) {
        red = data[i + 0];
        green = data[i + 1];
        blue = data[i + 2];

        data[i + 0] = (red * .393) + (green *.769) + (blue * .189); // red
        data[i + 1] = (red * .349) + (green *.686) + (blue * .168); // green
        data[i + 2] = (red * .272) + (green *.534) + (blue * .131);  // blue
    }
    return pixels;
};

const ghostEffect = (level = 1, context = ctx) => context.globalAlpha = level;

const greenScreen = pixels => {
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }
  return pixels;
};

const takePhoto = (node = strip, sound = snap) => {
    snap.currentTime = 0;
    snap.play();
    node.appendChild(createSnapshot(imageNumber++), strip.firstChild);
    return node;
};

const paintToCanvas = (filter = null, videoNode = video, canvasNode = canvas, context = ctx) => {
    clearInterval(paintingInterval);
    const [width, height] = [videoNode.videoWidth, videoNode.videoHeight];
    canvasNode.width = width;
    canvasNode.height = height;
     paintingInterval = setInterval(() => {
        context.drawImage(videoNode, 0,0, width, height);
        if(filter) {
            // take the pixels out
            const pixels = context.getImageData(0,0, width, height);

            if(filter === ghostEffect) {
                ghostEffect(0.1);
            } else {
                filter(pixels);
            }
            // put them back once the effect is applied
            context.putImageData(pixels, 0, 0);
        }
    }, 16);

    return paintingInterval;
};

const applyEffect = e => {
    const {target: {value}} = e;
    const filters = {
        'redEffect': redEffect, 
        'blueEffect': blueEffect, 
        'greenEffect': greenEffect, 
        'rgbSplit': rgbSplit, 
        'ghostEffect': ghostEffect, 
        'greenScreen': greenScreen, 
        'blackAndWhite': blackAndWhite,
        'sephia': sephia    
    };
    
    rgbControls.classList.toggle('is-active', value === 'greenScreen');
    paintToCanvas(filters[value]);
};

// once the video is ready to be played it will emit this 'canplay' event
video.addEventListener('canplay', (e) => paintToCanvas());

photoBtn.addEventListener('click', (e) => takePhoto());

filterSelect.addEventListener('change', applyEffect );

renderVideo();