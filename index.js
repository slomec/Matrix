// window.wallpaperPropertyListener = {
//   applyUserProperties: function (properties) {
//     if (properties.enablePause) {
//       intervals = properties.enablePause.value;
//     }
//     if (properties.text) {
//       text = properties.textSize.value;
//     }
//     if (properties.color1) {
//       colors[0] = properties.color1.value
//         .split(" ")
//         .map(function (c) {
//           return Math.ceil(c * 255);
//         })
//         .join(", ");
//     }
//     if (properties.color2) {
//       colors[1] = properties.color2.value
//         .split(" ")
//         .map(function (c) {
//           return Math.ceil(c * 255);
//         })
//         .join(", ");
//     }
//     if (properties.color2) {
//       colors[2] = properties.color2.value
//         .split(" ")
//         .map(function (c) {
//           return Math.ceil(c * 255);
//         })
//         .join(", ");
//     }
//   },
// };

let text = "aa";
let intervals = true;
let textSize = 40;
let timeInterval = 10000;
const colors = ["23,20,224"];
const chanseOfspawn = 0.02;
const chanseOfdeasapear = 0.02;
const fadingSpeed = 0.1;
const speedOfFall = 66;
const fontSize = 16;
const IntervalOfImageUpdate = 1000;

let fallingMode;
let imageMode;
let alpha = 1;
let col = 0;

const canvasText = document.getElementById("text");
const ctx = canvasText.getContext("2d");
const canvas = document.getElementById("matrix");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const columns = Math.ceil(canvas.width / fontSize);
const rows = Math.ceil(canvas.height / fontSize);

canvasText.width = columns;
canvasText.height = rows;

const drops = [];
for (let i = 0; i < columns; i++) {
  drops.push([]);
}

ctx.font = `${textSize}px Lucida Console`;
ctx.fillText(text, 0, rows);
console.log(columns);
console.log(rows);
const imageData = ctx.getImageData(0, 0, window.innerWidth, window.innerHeight);
const data = imageData.data;

const image = [];

for (let i = 0; i < columns; i++) {
  image.push([]);
}

let topp = 0;
let bottom = Infinity;
let left = Infinity;
let right = 0;
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < columns; x++) {
    const index = (y * canvas.width + x) * 4;
    const alpha = data[index + 3];
    if (alpha > 0) {
      if (topp < y) {
        topp = y;
      }
      if (bottom > y) {
        bottom = y;
      }
      if (left > x) {
        left = x;
      }
      if (right < x) {
        right = x;
      }
      image[x].push(y);
    }
  }
}
console.log(topp, bottom, left, right);
const xCorrection = Math.round((columns - (right + left)) / 2);
const yCorrection = Math.round((rows - (topp - bottom)) / 2);

function fading() {
  context.fillStyle = `rgba(0, 0, 0, ${fadingSpeed})`;
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFall() {
  context.fillStyle = `rgba(${colors[col]}, ${alpha})`;
  context.font = `${fontSize}px monospace`;
  for (let i = 0; i < drops.length; i++) {
    for (let k in drops[i]) {
      const text = Math.random() > 0.5 ? "0" : "1";
      context.fillText(text, i * fontSize, drops[i][k] * fontSize);
      if (drops[i][k] * fontSize > canvas.height || Math.random() <= chanseOfdeasapear) {
        drops[i].pop();
      }
      drops[i][k]++;
    }
    if (fallingMode) {
      if (Math.random() <= chanseOfspawn) {
        drops[i].splice(0, 0, 0);
      }
    }
  }
}

function drawImage() {
  if (imageMode) {
    context.fillStyle = `rgba(${colors[col]}, ${alpha})`;
    context.font = `${fontSize}px monospace`;
    for (let i = 0; i < image.length; i++) {
      for (let k in image[i]) {
        const text = Math.random() > 0.5 ? "0" : "1";
        context.fillText(text, (i + xCorrection) * fontSize, (image[i][k] - yCorrection) * fontSize);
      }
    }
  }
}
function switchMode() {
  fallingMode = !fallingMode;
  imageMode = !imageMode;
  if (fallingMode) {
    col = (col + 1) % colors.length;
  }
}

function nextColor() {
  col = (col + 1) % colors.length;
}

if (intervals) {
  fallingMode = true;
  imageMode = false;
  setInterval(() => {
    drawFall(), fading();
  }, speedOfFall);
  setInterval(() => {
    drawImage();
  }, IntervalOfImageUpdate);
  setInterval(() => {
    switchMode();
  }, timeInterval / 2);
} else {
  fallingMode = true;
  imageMode = true;
  setInterval(() => {
    drawFall(), fading();
  }, speedOfFall);
  setInterval(() => {
    nextColor();
  }, timeInterval);
  setInterval(() => {
    drawImage();
  }, IntervalOfImageUpdate);
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
