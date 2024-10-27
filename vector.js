class Vector {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  clamp(min, max) {
    return vec(Math.max(min.x, Math.min(max.x, this.x)), Math.max(min.y, Math.min(max.y, this.y)));
  }

  set(v) {
    this.x = v.x;
    this.y = v.y;
  }

  equals(v) {
    return this.x == v.x && this.y == v.y;
  }

  static floor(v) {
    return vec(Math.floor(v.x), Math.floor(v.y));
  }

  static round(v) {
    return vec(Math.round(v.x), Math.round(v.y));
  }

  static ceil(v) {
    return vec(Math.ceil(v.x), Math.ceil(v.y));
  }

  static random() {
    let angle = Math.random() * 2 * Math.PI;
    return vec(Math.cos(angle), Math.sin(angle));
  }

  static distance(a, b) {
    return a.sub(b).magnitude;
  }

  static lerp(a, b, t) {
    return vec(lerp(a.x, b.x, t), lerp(a.y, b.y, t));
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