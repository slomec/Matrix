window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.color1) {
      colors[0] = properties.color1.value
        .split(" ")
        .map(function (c) {
          return Math.ceil(c * 255);
        })
        .join(", ");
    }
    if (properties.color2) {
      colors[1] = properties.color2.value
        .split(" ")
        .map(function (c) {
          return Math.ceil(c * 255);
        })
        .join(", ");
    }
    if (properties.color3) {
      colors[2] = properties.color3.value
        .split(" ")
        .map(function (c) {
          return Math.ceil(c * 255);
        })
        .join(", ");
    }
    if (properties.color4) {
      colors[3] = properties.color4.value
        .split(" ")
        .map(function (c) {
          return Math.ceil(c * 255);
        })
        .join(", ");
    }
    if (properties.intervals) {
      intervals = properties.intervals.value;
    }
    if (properties.digitsize) {
      const oldFontSize = fontSize;
      fontSize = properties.digitsize.value;
      if (fontSize != oldFontSize) {
        setCanvas();
      }
    }
    if (properties.chanceofnumberdisappearing) {
      chanseOfdeasapear = properties.chanceofnumberdisappearing.value;
    }
    if (properties.intervaltime) {
      timeInterval = Math.round(properties.intervaltime.value * (1000 / speedOfFall));
    }
    if (properties.textsize) {
      const oldTextSize = textSize;
      textSize = properties.textsize.value;
      if (textSize != oldTextSize) {
        setCanvas();
      }
    }
    if (properties.numberofdigits) {
      chanseOfspawn = properties.numberofdigits.value / 100;
    }
    if (properties.speedoffall) {
      speedOfFall = 200 - properties.speedoffall.value;
    }
    if (properties.text) {
      const oldText = text;
      text = properties.text.value;
      if (text != oldText) {
        setCanvas();
      }
    }
    if (properties.textflickeringspeed) {
      imageUpdateSpeed = Math.round(properties.textflickeringspeed.value * (1000 / speedOfFall));
    }
    if (properties.tracklength) {
      fadingSpeed = (100 - properties.tracklength.value) / 100;
    }
  },
};

let text = "ыыы";
let intervals = false;
let textSize = 40;
let timeInterval = 200;
let colors = ["23,20,224", "255,255,255"];
let chanseOfspawn = 0.02;
let chanseOfdeasapear = 0.02;
let fadingSpeed = 0.1;
let speedOfFall = 66;
let fontSize = 16;
let imageUpdateSpeed = 20;

let alpha = 0;
let col = 0;

const canvasText = document.getElementById("text");
const textCtx = canvasText.getContext("2d");

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

const canvasImage = document.getElementById("image");
const imageCtx = canvasImage.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

canvasImage.width = window.innerWidth;
canvasImage.height = window.innerHeight;

let image = [];
let drops = [];
function setCanvas() {
  const columns = Math.ceil(canvas.width / fontSize);
  const rows = Math.ceil(canvas.height / fontSize);

  canvasText.width = columns;
  canvasText.height = rows;

  document.fonts
    .load(`${textSize / (fontSize / 16)}px pixel`)
    .then(() => {
      textCtx.font = `${textSize / (fontSize / 16)}px pixel`;
      const x = Math.round(columns / 2 - textCtx.measureText(text).width / 2);
      const y = Math.round(rows / 2 + textSize / (fontSize / 16) / 4);
      textCtx.fillText(text, x, y);

      drops = [];
      for (let i = 0; i < columns; i++) {
        drops.push([]);
      }
      const imageData = textCtx.getImageData(0, 0, window.innerWidth, window.innerHeight);
      const data = imageData.data;

      image = [];
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
    })
    .catch((error) => {
      console.error("Font loading failed:", error);
    });
}
setCanvas();
function fading(can) {
  can.fillStyle = `rgba(0, 0, 0, ${fadingSpeed})`;
  can.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFall(imageUpdateCallingCounter) {
  ctx.fillStyle = `rgb(${colors[col]})`;
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
    if (!intervals | (imageUpdateCallingCounter < timeInterval / 2)) {
      if (Math.random() <= chanseOfspawn) {
        drops[i].splice(0, 0, 0);
      }
    }
  }
}

function drawImage(c) {
  imageCtx.clearRect(0, 0, canvasImage.width, canvasImage.height);
  imageCtx.fillStyle = `rgba(${colors[col]}, ${(imageUpdateSpeed - alpha) / imageUpdateSpeed})`;
  imageCtx.font = `${fontSize}px monospace`;
  for (let i = 0; i < image.length; i++) {
    for (let k in image[i]) {
      const text = Math.random() > 0.5 ? "0" : "1";
      imageCtx.fillText(text, i * fontSize, image[i][k] * fontSize);
    }
  }
}

let prevSpeedOfFall = speedOfFall;
function update() {
  let imageUpdateCallingCounter = 0;
  const interval = setInterval(() => {
    drawFall(imageUpdateCallingCounter);

    if (!intervals | (imageUpdateCallingCounter >= timeInterval / 2)) {
      drawImage();
      alpha = (alpha + 1) % imageUpdateSpeed;
    }
    fading(ctx);
    if (prevSpeedOfFall != speedOfFall) {
      prevSpeedOfFall = speedOfFall;
      clearInterval(interval);
      update();
    }
    if (imageUpdateCallingCounter == timeInterval - 1) {
      col = (col + 1) % colors.length;
    }
    imageUpdateCallingCounter = (imageUpdateCallingCounter + 1) % timeInterval;
  }, speedOfFall);
}
update();
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
