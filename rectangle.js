class Rectangle {
  position = vec();
  width = 0;
  height = 0;

  get left() { return this.position.x - this.width / 2; }
  get right() { return this.position.x + this.width / 2; }
  get top() { return this.position.y - this.height / 2; }
  get bottom() { return this.position.y + this.height / 2; }

  constructor(position = vec(), width = 0, height = 0) {
    this.position = position;
    this.width = width;
    this.height = height;
  }

  onRectangle(point = vec()) {
    return (Math.abs(point.x - this.position.x) < this.width / 2) && (Math.abs(point.y - this.position.y) < this.height / 2);
  }

  setMask() {
    let region = new Path2D();
    region.rect(this.left, this.top, this.width, this.height);
    ctx.clip(region);
  }

  draw() {
    let region = new Path2D();
    region.rect(this.left, this.top, this.width, this.height);
    ctx.fill(region);
  }
}