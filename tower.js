class Tower {
  cost = 2;
  range = 2;
  cooldown = 0.5;
  damage = 2;
  position = vec();
  color = Color.blue;

  constructor(position) {
    this.position = position;
  }

  draw() {
    ctx.fillStyle = this.color;
    Draw.circle(grid.translatePoint(this.position), 24);
  }

  drawRange() {
    ctx.fillStyle = Color.darker(this.color, 0.8).alpha(0.5);
    Draw.circle(grid.translatePoint(this.position), this.range * grid.width * 0.9);
    Draw.circle(grid.translatePoint(this.position), this.range * grid.width);
  }

  update(dt) {
    
  }
}

function placeTower(position) {
  towers.push(new Tower(position));
}