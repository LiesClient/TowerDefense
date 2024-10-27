class Enemy {
  speed = 0;
  radius = 0;
  color = Color.white;
  progress = 0;

  constructor() {
    this.speed = 2;
    this.radius = 4;
    this.color = Color.neon_red;
  }

  update(dt) {
    this.progress += this.speed * dt;

    if (this.progress > path.totalDistance) this.progress = 0;
  }

  draw() {
    ctx.fillStyle = this.color;
    Draw.circle(grid.translatePoint(this.pos), this.radius);
  }

  get pos() {
    return path.translatePoint(this.progress / path.totalDistance);
  }
}