class Vector {
  x = 0;
  y = 0;

  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
}

function vec(x = 0, y = 0) {
  return new Vector(x, y);
}