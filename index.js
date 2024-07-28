let text = "ag";
let intervals = false;
let textSize = 40;
let timeInterval = 2000;
const colors = ["23,20,224"];
const chanseOfspawn = 0.02;
const chanseOfdeasapear = 0.02;
const fadingSpeed = 0.1;
const speedOfFall = 66;
const fontSize = 16;
const speedOfImageUpdate = 1000;

let alpha = 1;
let col = 0;

const canvasText = document.getElementById("text");
const textCtx = canvasText.getContext("2d");

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const columns = Math.ceil(canvas.width / fontSize);
const rows = Math.ceil(canvas.height / fontSize);

canvasText.width = columns;
canvasText.height = rows;

textCtx.font = `${textSize}px Lucida Console`;

const x = Math.round(columns / 2 - textCtx.measureText(text).width / 2);
const y = Math.round(rows / 2 + textSize / 4);

textCtx.fillText(text, x, y);

const imageData = textCtx.getImageData(0, 0, window.innerWidth, window.innerHeight);
const data = imageData.data;

const image = [];

for (let i = 0; i < columns; i++) {
  image.push([]);
}
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < columns; x++) {
    const index = (y * canvas.width + x) * 4;
    const alpha = data[index + 3];
    if (alpha > 0) {
      image[x].push(y);
    }
  }
}
function fading() {
  ctx.fillStyle = `rgba(0, 0, 0, ${fadingSpeed})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFall(color) {
  let falling = true;
  const drops = [];
  for (let i = 0; i < columns; i++) {
    drops.push([]);
  }
  const interval = setInterval(() => {
    ctx.fillStyle = `rgba(${color}, ${alpha})`;
    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      for (let k in drops[i]) {
        const text = Math.random() > 0.5 ? "0" : "1";
        ctx.fillText(text, i * fontSize, drops[i][k] * fontSize);
        if (drops[i][k] * fontSize > canvas.height || Math.random() <= chanseOfdeasapear) {
          drops[i].pop();
        }
        drops[i][k]++;
      }
      if (falling) {
        if (Math.random() <= chanseOfspawn) {
          drops[i].splice(0, 0, 0);
        }
      }
    }
  }, speedOfFall);
  setTimeout(
    () => {
      falling = false;
      setTimeout(() => {
        clearInterval(interval);
      }, speedOfFall * rows);
    },
    intervals ? timeInterval / 2 : timeInterval
  );
}

function drawImage() {
  const interval = setInterval(() => {
    ctx.fillStyle = `rgba(${colors[col]}, ${alpha})`;
    ctx.font = `${fontSize}px monospace`;
    for (let i = 0; i < image.length; i++) {
      for (let k in image[i]) {
        const text = Math.random() > 0.5 ? "0" : "1";
        ctx.fillText(text, i * fontSize, image[i][k] * fontSize);
      }
    }
  }, speedOfImageUpdate);
  if (intervals) {
    setTimeout(() => {
      clearInterval(interval);
    }, timeInterval);
  }
}

if (intervals) {
  setInterval(() => {
    col = (col + 1) % colors.length;
  }, timeInterval);
  setInterval(() => {
    fading();
  }, speedOfFall);

  drawFall(colors[col]);
  setInterval(() => {
    drawFall(colors[col]);
  }, timeInterval);

  if (text) {
    setTimeout(() => {
      drawImage();
      setInterval(() => {
        drawImage();
      }, timeInterval);
    }, timeInterval / 2);
  }
} else {
  setInterval(() => {
    col = (col + 1) % colors.length;
  }, timeInterval);

  setInterval(() => {
    fading();
  }, speedOfFall);

  drawFall(colors[col]);
  setInterval(() => {
    drawFall(colors[col]);
  }, timeInterval);

  if (text) {
    drawImage();
  }
}

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  window.location.reload();
});
