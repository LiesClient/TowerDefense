class Tower {
  cost = 2;
  range = 2;
  firerate = 0.8;
  cooldown = 1;
  damage = 7;
  position = vec();
  color = Color.fromHSL(240, 1.0, 0.8);
  attackDuration = 0.5;

  attack = {
    duration: 0,
    position: vec(0, 0),
  }

  constructor(position) {
    this.position = position;
  }

  draw() {
    ctx.fillStyle = this.color;

    let screenPos = grid.translatePoint(this.position);

    Draw.circle(screenPos, 24);

    if (this.attack.duration > 0) {
      ctx.strokeStyle = this.color;
      Draw.line(screenPos, grid.translatePoint(this.attack.target.pos));
    }
  }

  drawRange() {
    ctx.fillStyle = Color.darker(this.color, 0.8);
    Draw.circle(grid.translatePoint(this.position), this.range * grid.width);
  }

  update(dt) {
    this.cooldown -= dt;
    this.attack.duration -= dt;

    if (this.attack.duration >= 0 && this.attack.target) {
      if (Vector.distance(this.attack.target?.pos, this.position) > this.range) {
        let targetableEnemies = enemies.filter(enemy => Vector.distance(enemy.pos, this.position) < this.range);
        this.attack.target = targetableEnemies.length ? targetableEnemies[0] : null;
      }

      if (this.attack.target)
        this.attack.target.health -= this.damage * (dt / this.attackDuration);
    }

    if (this.cooldown > 0) return;

    let targetableEnemies = enemies.filter(enemy => Vector.distance(enemy.pos, this.position) < this.range);

    if (targetableEnemies.length) {
      let target = targetableEnemies.pop();
      this.cooldown = 1 / this.firerate;

      this.attack.duration = this.attackDuration;
      this.attack.target = target;
    }
  }
}

function placeTower(position) {
  towers.push(new Tower(position));
}