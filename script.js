const canvas = document.getElementById("display");
const ctx = canvas.getContext("2d");

let width = canvas.width = height = canvas.height = window.innerHeight;

const maxFPS = 60;

const mouse = { pos: vec(0, 0), clicked: false, clickFinality: false, enabled: false };
const keys = { };

const events = [];

let lastTime = performance.now();

const synth = new Tone.Synth().toDestination();
const grid = new Grid();
const path = new Path();
const ui = new UI();
const towers = [];
let enemies = [];
let health = 20;

let enemySpawnCooldown = 1;
let enemySpawnCooldownReset = 1;

function init() {
  canvas.addEventListener("keydown", e => events.push({ key: e.key.toLowerCase(), type: "keydown" }));
  canvas.addEventListener("keyup", e => events.push({ key: e.key.toLowerCase(), type: "keyup" }));

  canvas.addEventListener("mousemove", e => events.push({ x: e.offsetX, y: e.offsetY, type: "mousemove" }));
  canvas.addEventListener("mousedown", e => events.push({ type: "mousedown" }));
  canvas.addEventListener("mouseout", e => events.push({ type: "mouseout" }));
  canvas.addEventListener("mouseup", e => events.push({ type: "mouseup" }));

  // canvas.addEventListener("click", e => {
  //   if (innerWidth / innerHeight != 16 / 9) {
  //     fullscreen(canvas);
  //     while (events.length)
  //       events.pop();
  //   }
  // });

  // path.addPoints(vec(0, 0), vec(0, 7), vec(7, 0), vec(7, 14), vec(0, 7), vec(0, 14), vec(5, 9), vec(5, 5), vec(13, 5));

  path.addPoints(vec(0, 0), vec(4, 4));
  fullscreen(canvas);

  loop();
}

function loop() {
  // // check if the window is the right aspect ratio
  // if (innerWidth / innerHeight != 16 / 9) {
  //   ctx.fillStyle = Color.black;
  //   ctx.fillRect(0, 0, width, height);

  //   ctx.textAlign = "center";
  //   ctx.fillStyle = Color.white;

  //   let scaler = Math.min(innerHeight, innerWidth) / 20;

  //   ctx.font = `${scaler}px monospace`;
  //   ctx.fillText("Game is paused. Your aspect ratio is incorrect.", innerWidth / 2, innerHeight / 2);

  //   ctx.font = `${scaler / 2}px monospace`;
  //   ctx.fillText("Note: Generally, you can fix this by pressing F11 to fullscreen.", innerWidth / 2, innerHeight / 2 + scaler);
  //   ctx.fillText("You can also click to prompt a pop-up to fullscreen.", innerWidth / 2, innerHeight / 2 + scaler * 2);
  //   ctx.fillText("(Game is not playable on non 16:9 panels and some browsers)", innerWidth / 2, innerHeight / 2 + scaler * 3);

  //   lastTime = performance.now();
  //   return requestAnimationFrame(loop);
  // }

  if (health <= 0) {
    canvas.style.aspectRatio = "";
    canvas.width = window.innerWidth;
    canvas.style.width = "100%";
    ctx.fillStyle = Color.black;
    ctx.fillRect(0, 0, width, height);

    ctx.textAlign = "center";
    ctx.fillStyle = Color.white;

    let scaler = Math.min(innerHeight, innerWidth) / 20;

    ctx.font = `${scaler}px monospace`;
    ctx.fillText("GAME OVER", innerWidth / 2, innerHeight / 2);

    ctx.font = `${scaler / 2}px monospace`;
    ctx.fillText("Click to restart! (or refresh the page)", innerWidth / 2, innerHeight / 2 + scaler);

    window.addEventListener("click", () => location = location);

    return;
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

  ctx.font = `${grid.width / 2}px monospace`;
  ctx.fillStyle = Color.neon_red;
  let healthPosition = grid.translatePoint(vec(-1.5, 0));
  ctx.fillText("HP: " + health, healthPosition.x, healthPosition.y);

  enemySpawnCooldown -= delta;
  if (enemySpawnCooldown <= 0) {
    enemySpawnCooldown = enemySpawnCooldownReset;
    enemySpawnCooldownReset = enemySpawnCooldownReset - 0.001;
    enemies.push(new Enemy());
  }

  enemies.forEach(enemy => {
    enemy.update(delta);
    enemy.draw();
  });

  towers.forEach(tower => {
    tower.update(delta);
    tower.draw();
  });

  enemies = enemies.filter(enemy => enemy.health > 0).sort((a, b) => a.progress - b.progress);


  if (mouse.enabled) {
    ctx.globalAlpha = 0.5;
    let exampleTower = new Sniper(point);
    exampleTower.draw();
    exampleTower.drawRange();
    ctx.globalAlpha = 1;

    ctx.fillStyle = (mouse.clicked ? Color.blue : Color.deep_blue).alpha(0.25);
    if (grid.get(point) != null) ctx.fillStyle = (mouse.clicked ? Color.neon_red : Color.red).alpha(0.25);
    Draw.square(grid.translatePoint(point), grid.width);
  }

  if (mouse.clickFinality && mouse.enabled) {
    let value = grid.get(point);

    if (value == null) {
      placeTower(point);
      grid.plotPoint(point, towers.length - 1);
    }
  }

  mouse.clickFinality = false;

  if (keys.g) applyGrayscaleFilter();

  // requestAnimationFrame(loop);
}


function applyGrayscaleFilter() {
  let imageData = ctx.getImageData(0, 0, width, height);

  for (let i = 0; i < imageData.data.length; i += 4) {
    let r = imageData.data[i];
    let g = imageData.data[i + 1];
    let b = imageData.data[i + 2];
    let value = (r + g + b) / 3;

    imageData.data[i] = value;
    imageData.data[i + 1] = value;
    imageData.data[i + 2] = value;
  }

  ctx.clearRect(0, 0, width, height);
  ctx.putImageData(imageData, 0, 0);
}

function lightning(v, w, offset, width) {
  lightningSplit(v, w, 6, offset, width, 0.5);
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
    lightningBranch(mid, Math.random() > .5 ? v : w, branchFactor + 2, offset / 1.5, width, side);
  }
}

function lightningBranch(v, w, branchFactor, offset, width, side) {
  let direction = v.sub(w).add(Vector.random().scale(offset)).norm().scale(offset);
  let mid = v.add(direction);

  ctx.strokeStyle = Color.lerp(Color.white, Color.yellow, side / 2);
  Draw.line(v, mid, width);

  if (branchFactor > 0) lightningBranch(mid, v, branchFactor - 1, offset / 1.5, width * 0.6, side);
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

    if (event.type == "mousedown") mouse.clicked = true;
    if (event.type == "mouseup") mouse.clicked = !(mouse.clickFinality = true);

    if (event.type == "mouseout") mouse.enabled = false;
    else if (event.type.startsWith("mouse")) mouse.enabled = true;

    if (event.type == "mousemove") {
      mouse.pos.x = event.x;
      mouse.pos.y = event.y;
    }

    if (event.type == "keydown") keys[event.key] = true;
    if (event.type == "keyup") keys[event.key] = false;
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