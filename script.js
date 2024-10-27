const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");

let width = canvas.width = 1920;
let height = canvas.height = 1080;

const maxFPS = 60;

const mouse = { pos: vec(0, 0), clicked: false, clickFinality: false };
const keys = { };

const events = [];

let lastTime = performance.now();

const grid = new Grid();
const path = new Path();
const ui = new UI();
const enemies = [];
const towers = [];

function init() {
  document.addEventListener("keydown", e => events.push({ key: e.key.toLowerCase(), type: "keydown" }));
  document.addEventListener("keyup", e => events.push({ key: e.key.toLowerCase(), type: "keyup" }));

  document.addEventListener("mousemove", e => events.push({ x: e.clientX, y: e.clientY, type: "mousemove" }));
  document.addEventListener("mousedown", e => events.push({ type: "mousedown" }));
  document.addEventListener("mouseup", e => events.push({ type: "mouseup" }));

  canvas.addEventListener("click", e => {
    if (innerWidth / innerHeight != 16 / 9) {
      fullscreen(canvas);
      while (events.length)
        events.pop();
    }
  });

  path.addPoints(vec(0, 0), vec(0, 3), vec(3, 0), vec(3, 8), vec(8, 8), vec(8, 5), vec(0, 5), vec(0, 6), vec(6, 0), vec(8, 2));

  fullscreen(canvas);

  setInterval(() => enemies.push(new Enemy()), 1000);

  loop();
}

function loop() {
  // check if the window is the right aspect ratio
  if (innerWidth / innerHeight != 16 / 9) {
    ctx.fillStyle = Color.black;
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = "center";
    ctx.fillStyle = Color.white;

    let scaler = Math.min(innerHeight, innerWidth) / 20;

    ctx.font = `${scaler}px monospace`;
    ctx.fillText("Game is paused. Your aspect ratio is incorrect.", innerWidth / 2, innerHeight / 2);

    ctx.font = `${scaler / 2}px monospace`;
    ctx.fillText("Note: Generally, you can fix this by pressing F11 to fullscreen.", innerWidth / 2, innerHeight / 2 + scaler);
    ctx.fillText("You can also click to prompt a pop-up to fullscreen.", innerWidth / 2, innerHeight / 2 + scaler * 2);
    ctx.fillText("(Game is not playable on non 16:9 panels and some browsers)", innerWidth / 2, innerHeight / 2 + scaler * 3);

    lastTime = performance.now();
    return requestAnimationFrame(loop);
  }

  handleInputs();

  if (keys.q) location = location;

  // time + pausing
  let delta, time;
  {
    time = performance.now();
    delta = time - lastTime;
    let fps = 1000 / delta;

    if (fps > maxFPS) return requestAnimationFrame(loop);
    if (keys[" "]) return requestAnimationFrame(loop);

    lastTime = time;
    delta = delta / 1000;
  }

  ctx.fillStyle = `rgba(0, 0, 0, 1)`;
  ctx.fillRect(0, 0, width, height);

  grid.draw();
  path.draw();
  ui.draw();

  let point = Vector.round(grid.untranslatePoint(mouse.pos));

  enemies.forEach(enemy => {
    enemy.update(delta);
    enemy.draw();
  });

  towers.forEach(tower => {
    tower.update(delta);
    tower.draw();
  });

  ctx.globalAlpha = 0.5;
  let exampleTower = new Tower(point);
  exampleTower.draw();
  exampleTower.drawRange();
  ctx.globalAlpha = 1;

  ctx.fillStyle = (mouse.clicked ? Color.blue : Color.deep_blue).alpha(0.25);
  if (grid.get(point) != 0) ctx.fillStyle = (mouse.clicked ? Color.neon_red : Color.red).alpha(0.25);
  Draw.square(grid.translatePoint(point), grid.width - 20);

  if (mouse.clickFinality) {
    let value = grid.get(point);

    if (value == 0) {
      placeTower(point);
      grid.plotPoint(point, 2);
    }
  }

  mouse.clickFinality = false;

  requestAnimationFrame(loop);
}

function lightning(v, w, width) {
  lightningSplit(v, w, 6, 250, width, 0.5);
}

function lightningSplit(v, w, branchFactor, offset, width, side) {
  if (branchFactor <= 0) {
    ctx.strokeStyle = Color.lerp(Color.white, Color.yellow, side / 2);
    Draw.line(v, w, width);
    return;
  }

  let mid = vec((v.x + w.x) / 2, (v.y + w.y) / 2).add(Vector.random().scale(offset));

  lightningSplit(v, mid, branchFactor - 1, offset / 2, width, side / 2);
  lightningSplit(mid, w, branchFactor - 1, offset / 2, width, 1 - side / 2);

  if (Math.random() < .4) {
    lightningBranch(mid, Math.random() > .5 ? v : w, branchFactor + 2, offset / 2, width, side);
  }
}

function lightningBranch(v, w, branchFactor, offset, width, side) {
  let direction = v.sub(w).add(Vector.random().scale(offset)).norm().scale(offset);
  let mid = v.add(direction);

  ctx.strokeStyle = Color.lerp(Color.white, Color.yellow, side / 2);
  Draw.line(v, mid, width);

  if (branchFactor > 0) lightningBranch(mid, v, branchFactor - 1, offset / 2, width * 0.6, side);
}

function renderColors() {
  let i = 0;

  ctx.font = "32px monospace";

  let colors = Object.keys(Color);
  colors = colors.splice(0, colors.length - 5);
  colors.forEach(color => {
    let w = width / (colors.length / 3);
    let x = (w * i) % width;
    let y = Math.floor((w * i) / width) * (height / 3);
    ctx.fillStyle = Color[color];
    ctx.fillRect(x, y, w, height / 3);

    ctx.fillStyle = Color.contrast(Color[color]);
    let parts = color.split("_");
    ctx.fillText(parts.shift(), x, y + height / 6);
    if (parts.length)
      ctx.fillText(parts.shift(), x, y + height / 6 + 36);

    ctx.fillText(Color.relativeLuminance(Color[color]).toFixed(2), x, y + height / 6 - height / 6 + 36);

    i++;
  });
}

function handleInputs() {
  while (events.length) {
    let event = events.pop();

    if (event.type == "keydown") keys[event.key] = true;
    if (event.type == "keyup") keys[event.key] = false;

    if (event.type == "mousemove") {
      mouse.pos.x = event.x;
      mouse.pos.y = event.y;
    }

    if (event.type == "mousedown") mouse.clicked = true;
    if (event.type == "mouseup") {
      mouse.clicked = false;
      mouse.clickFinality = true;
    }
  }
}

function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}

function fullscreen(element) {
  if(element.requestFullScreen) {
    element.requestFullScreen();
  } else if(element.mozRequestFullScreen) {
    element.mozRequestFullScreen();
  } else if(element.webkitRequestFullScreen) {
    element.webkitRequestFullScreen();
  }
}

init();