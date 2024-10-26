class Path {
  points = [];

  constructor(points = []) {
    this.points = points;
  }

  addPoint(point) {
    this.points.push(point);
  }

  addPoints(...points) {
    this.points.push(...points.flat());
  }

  draw() {
    ctx.strokeStyle = Color.white;
    ctx.lineWidth = 10;

    ctx.beginPath();

    for (let i = 0; i < this.points.length; i++) {
      let point = grid.translatePoint(this.points[i]);
      ctx.lineTo(point.x, point.y);
    }

    ctx.stroke();
  }
}