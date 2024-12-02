const ALL_TOWERS = [];

class Tower {
  cost = 2;
  range = 2;
  firerate = 0.8;
  cooldown = 0;
  damage = 7;
  position = vec();
  color = Color.fromHSL(240, 1.0, 0.8);
  attackDuration = 0.5;

  get dps() {
    return this.damage * this.firerate;
  }

  attack = {
    duration: 0,
    position: vec(0, 0),
  }

  constructor(position = vec()) {
    this.position = position;
  }

  draw() {
    ctx.fillStyle = this.color;

    Draw.circle(grid.translatePoint(this.position), 24);

    if (this.attack.duration > 0 && this.attack.target != null && this.attack.target.health > 0) {
      ctx.strokeStyle = this.color;
      this.drawAttack(grid.translatePoint(this.attack.target.pos));
    }
  }

  drawAttack(target) {
    Draw.line(grid.translatePoint(this.position), target);
  }

  drawRange() {
    ctx.fillStyle = Color.darker(this.color, 0.8);
    Draw.circle(grid.translatePoint(this.position), this.range * grid.width);
  }

  update(dt) {
    this.cooldown -= dt;
    this.attack.duration -= dt;

    if (this.attack?.target?.health < 0)
      this.attack.target = null;

    if (this.attack.duration >= 0 && this.attack.target) {
      if (Vector.distance(this.attack.target?.pos, this.position) > this.range || this.attack.target == null) {
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

      synth.triggerAttackRelease("C4", this.attackDuration);
    }
  }
}

class Tesla extends Tower {
  cost = 2;
  range = 4;
  firerate = 0.5;
  cooldown = 0;
  damage = 8;
  color = Color.fromHSL(60, 1.0, 0.8);
  attackDuration = 0.5;

  constructor(position = vec()) {
    super(position);
  }

  draw() {
    ctx.fillStyle = this.color;

    let screenPos = grid.translatePoint(this.position);

    Draw.circle(screenPos, grid.width / 3);

    if (this.attack.duration > 0 && this.attack.target != null) {
      ctx.strokeStyle = this.color;
      let targetPosition = grid.translatePoint(this.attack.target.pos);
      lightning(screenPos, targetPosition, Vector.distance(screenPos, targetPosition) / 6, 2);
    }
  }

  drawRange() {
    ctx.fillStyle = Color.darker(this.color, 0.8);
    Draw.circle(grid.translatePoint(this.position), this.range * grid.width);
  }
}

ALL_TOWERS.push(Tesla);
ALL_TOWERS.push(Tesla);
ALL_TOWERS.push(Tesla);

class Sniper extends Tower {
  cost = 8;
  range = 12;
  firerate = 0.2;
  cooldown = 0;
  damage = 16;
  color = Color.fromHSL(180, 1.0, 0.8);
  attackDuration = 0.2;

  constructor(position = vec()) {
    super(position);
  }

  draw() {
    ctx.fillStyle = this.color;

    let screenPos = grid.translatePoint(this.position);

    Draw.circle(screenPos, grid.width / 3);

    if (this.attack.duration > 0 && this.attack.target != null) {
      ctx.strokeStyle = this.color;
      let targetPosition = grid.translatePoint(this.attack.target.pos);
      Draw.line(screenPos, targetPosition);
    }
  }

  drawRange() {
    ctx.fillStyle = Color.darker(this.color, 0.8);
    Draw.circle(grid.translatePoint(this.position), this.range * grid.width);
  }
}

ALL_TOWERS.push(Sniper);

function placeTower(position) {
  towers.push(new Sniper(position));
}