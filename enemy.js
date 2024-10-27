class Enemy {
  speed = 0;
  radius = 0;
  color = Color.white;
  progress = 0;
  health = 20;
  maxHealth = 20;

  constructor() {
    this.speed = 2;
    this.radius = grid.width / 3;
    this.color = Color.fromHSL(0, 0.8, 0.6);
  }

  update(dt) {
    this.progress += this.speed * dt;

    if (this.progress > path.totalDistance) {
      health -= 2;
      this.health = 0;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    let screenPos = grid.translatePoint(this.pos);
    Draw.circle(screenPos, this.radius / 4);
    Draw.progressCircle(screenPos, this.radius, this.health / this.maxHealth);
  }

  get pos() {
    return path.translatePoint(this.progress / path.totalDistance);
  }
}