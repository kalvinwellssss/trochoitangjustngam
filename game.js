const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const dragonfly = new Image();
dragonfly.src = "dragonfly.png";

let x = 80;
let y = 200;
let velocity = 0;
let gravity = 0.5;
let score = 0;
let gameOver = false;
let started = false;

const pipes = [];
const gap = 150;

const bgm = document.getElementById("bgm");
let musicStarted = false;

/* ====== CONTROL ====== */
function flap() {
  if (gameOver) return;

  started = true;
  velocity = -8;

  if (!musicStarted) {
    bgm.play().catch(() => {});
    musicStarted = true;
  }
}

document.addEventListener("click", flap);

document.addEventListener(
  "touchstart",
  (e) => {
    e.preventDefault();
    flap();
  },
  { passive: false }
);

/* ====== PIPE ====== */
function addPipe() {
  if (!started || gameOver) return;

  const topHeight = Math.random() * 250 + 50;
  pipes.push({
    x: canvas.width,
    top: topHeight,
    bottom: canvas.height - topHeight - gap,
    passed: false
  });
}

setInterval(addPipe, 1800);

/* ====== UPDATE ====== */
function update() {
  if (!started || gameOver) return;

  velocity += gravity;
  y += velocity;

  if (y + 40 > canvas.height || y < 0) {
    gameOver = true;
  }

  pipes.forEach(pipe => {
    pipe.x -= 2;

    if (!pipe.passed && pipe.x + 50 < x) {
      score++;
      pipe.passed = true;

      if (score === 10) {
        document.getElementById("message").classList.remove("hidden");
        gameOver = true;

        bgm.volume = 0.4;

        setTimeout(() => {
          window.location.href = "https://www.instagram.com/kalvinwells_/";
        }, 3000);
      }
    }

    if (
      x + 40 > pipe.x &&
      x < pipe.x + 50 &&
      (y < pipe.top || y + 40 > canvas.height - pipe.bottom)
    ) {
      gameOver = true;
    }
  });
}

/* ====== DRAW ====== */
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.drawImage(dragonfly, x, y, 40, 40);

  ctx.fillStyle = "#4caf50";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, 50, pipe.top);
    ctx.fillRect(
      pipe.x,
      canvas.height - pipe.bottom,
      50,
      pipe.bottom
    );
  });

  ctx.fillStyle = "#000";
  ctx.font = "24px Arial";
  ctx.fillText("Score: " + score, 20, 40);

  if (!started) {
    ctx.fillText("Tap to start", 140, 300);
  }

  if (gameOver) {
    ctx.fillText("Game Over", 130, 340);
  }
}

/* ====== LOOP ====== */
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();