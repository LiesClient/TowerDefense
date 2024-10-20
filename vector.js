class Vector {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  static random() {
    let angle = Math.random() * 2 * Math.PI;
    return vec(Math.cos(angle), Math.sin(angle));
  }

  get magnitude() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  copy() {
    return vec(this.x, this.y);
  }

  add(v) {
    return vec(this.x + v.x, this.y + v.y);
  }

  sub(v) {
    return vec(this.x - v.x, this.y - v.y);
  }

  norm() {
    return this.scale(1 / this.magnitude);
  }

  scale(s) {
    return vec(this.x * s, this.y * s);
  }
}

function vec(x = 0, y = 0) {
  return new Vector(x, y);
}