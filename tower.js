class Tower {
  cost = 0;
  range = 0;
  cooldown = 0;
  damage = 0;
  color = Color.white;

  constructor({ cost, range, cooldown, damage, color } = 
              { cost: this.cost, range: this.range, cooldown: this.cooldown, damage: this.damage, color: this.color }) {
    this.cost = cost || this.cost;
    this.range = range || this.range;
    this.cooldown = cooldown || this.cooldown;
    this.damage = damage || this.damage;
    this.color = color || this.color;
  }

  draw() {
    
  }
}