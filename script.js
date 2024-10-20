const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");

let width, height;

const maxFPS = 60;

const mouse = { x: 0, y: 0, clicked: false };
const keys = { };

const events = [];

let points = [];
let currentPoint = false;

let lastTime = performance.now();

function init() {
  resize();

  document.addEventListener("keydown", e => events.push({ key: e.key.toLowerCase(), type: "keydown" }));
  document.addEventListener("keyup", e => events.push({ key: e.key.toLowerCase(), type: "keyup" }));

  document.addEventListener("mousemove", e => events.push({ x: e.clientX, y: e.clientY, type: "mousemove" }));
  document.addEventListener("mousedown", e => events.push({ type: "mousedown" }));
  document.addEventListener("mouseup", e => events.push({ type: "mouseup" }));

  window.addEventListener("resize", resize);

  loop();
}

function loop() {
  handleInputs();

  // time + pausing
  {
    let time = performance.now();
    let delta = time - lastTime;
    let fps = 1000 / delta;
    
    if (fps > maxFPS) return requestAnimationFrame(loop);
    if (keys[" "]) return requestAnimationFrame(loop);
    
    lastTime = time;
  }

  if (mouse.clicked) {
    if (!currentPoint) points.push(currentPoint = vec(mouse.x, mouse.y));
    currentPoint.x = mouse.x;
    currentPoint.y = mouse.y;
  } else currentPoint = null;

  if (keys["r"]) {
    points = [];
    currentPoint = null;
    mouse.clicked = false;
  }

  ctx.fillStyle = `rgba(0, 0, 0, 1)`;
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "white";
  ctx.strokeStyle = Color.yellow;

  for (let i = 0; i < points.length; i++) {
    Draw.circle(points[i], 2);
    if (i == 0) continue;

    for (let j = 1; j < 4; j++) {
      ctx.strokeStyle = Color.lerp(Color.white, Color.yellow, (4 - j) / 6);
      lightning(points[i - 1], points[i], (j / 4) * 2);
    }

    ctx.globalAlpha = 1;
  }

  requestAnimationFrame(loop);
}

function lightning(v, w, width) {
  lightningSplit(v, w, 6, 250, width);
}

function lightningSplit(v, w, branchFactor, offset, width) {
  if (branchFactor <= 0) {
    Draw.line(v, w, width);
    return;
  }

  let mid = vec((v.x + w.x) / 2, (v.y + w.y) / 2).add(Vector.random().scale(offset));

  lightningSplit(v, mid, branchFactor - 1, offset / 2, width);
  lightningSplit(mid, w, branchFactor - 1, offset / 2, width);

  if (Math.random() < .4) {
    lightningBranch(mid, Math.random() > .5 ? v : w, branchFactor + 2, offset / 3, width);
  }
}

function lightningBranch(v, w, branchFactor, offset, width) {
  let direction = v.sub(w).add(Vector.random().scale(offset)).norm().scale(offset);
  let mid = v.add(direction);

  Draw.line(v, mid, width);

  if (branchFactor > 0) lightningBranch(mid, v, branchFactor - 1, offset / 2, width * 0.6);
}

function handleInputs() {
  while (events.length) {
    let event = events.pop();

    if (event.type == "keydown") keys[event.key] = true;
    if (event.type == "keyup") keys[event.key] = false;

    if (event.type == "mousemove") {
      mouse.x = event.x;
      mouse.y = event.y;
    }

    if (event.type == "mousedown") mouse.clicked = true;
    if (event.type == "mouseup") mouse.clicked = false;
  }
}

function resize() {
  points = points.map(p => vec(p.x / width, p.y / height));
  canvas.width = width = window.innerWidth;
  canvas.height = height = window.innerHeight;
  points = points.map(p => vec(p.x * width, p.y * height));
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

init();