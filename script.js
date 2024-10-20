const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");

let width, height;

const mouse = { x: 0, y: 0, clicked: false };
const keys = { };

const events = [];

let points = [];
let currentPoint = false;

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

  if (mouse.clicked) {
    if (!currentPoint) points.push(currentPoint = vec(mouse.x, mouse.y));
    currentPoint.x = mouse.x;
    currentPoint.y = mouse.y;
  } else currentPoint = null;

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "white";
  for (let i = 0; i < points.length; i++) {
    Draw.circle(points[i], 2);
    if (i > 0) lightning(points[i - 1], points[i]);
  }

  requestAnimationFrame(loop);
}

function lightning(v, w) {
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  lightningBranch(v, w, 6, 150);
}

function lightningBranch(v, w, branchFactor, offset) {
  if (branchFactor <= 0) {
    Draw.line(v, w);
    return;
  }

  let mid = vec((v.x + w.x) / 2, (v.y + w.y) / 2);
  mid.x += (Math.random() - 0.5) * offset;
  mid.y += (Math.random() - 0.5) * offset;

  lightningBranch(v, mid, branchFactor - 1, offset / 2);
  lightningBranch(mid, w, branchFactor - 1, offset / 2);
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

init();