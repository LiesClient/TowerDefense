class Path {
  points = [];
  gridPoints = [];
  totalDistance = 0;

  constructor(points = []) {
    this.points = points;
    this.updatePath();
  }

  addPoint(point) {
    this.points.push(point);
    this.updatePath();
  }

  addPoints(...points) {
    this.points.push(...points.flat());
    this.updatePath();
  }

  updatePath() {
    this.gridPoints = [];

    let lastPoint = this.points[0];

    for (let i = 1; i < this.points.length; i++) {
      let point = this.points[i];
      let distance = Vector.distance(lastPoint, point);

      for (let j = distance; j >= -0.5; j--) {
        let t = Math.max(j / distance, 0);
        let currentPoint = Vector.round(Vector.lerp(lastPoint, point, 1 - t));

        this.gridPoints.push(currentPoint);
      }

      lastPoint = point;
    }

    for (let i = this.gridPoints.length - 1; i > 0; i--) {
      if (this.gridPoints[i].equals(this.gridPoints[i - 1])) {
        this.gridPoints.splice(i, 1);
      }
    }

    this.totalDistance = 0;
    for (let i = 0; i < this.gridPoints.length - 1; i++) {
      this.totalDistance += Vector.distance(this.gridPoints[i], this.gridPoints[i + 1]);
    }
  }

  translatePoint(x) {
    let distance = this.totalDistance * x;

    for (let i = 0; i < this.gridPoints.length - 1; i++) {
      let currentDistance = Vector.distance(this.gridPoints[i], this.gridPoints[i + 1]);

      if (distance > currentDistance) {
        distance -= currentDistance;
        continue;
      }

      let t = distance / currentDistance;
      return Vector.lerp(this.gridPoints[i], this.gridPoints[i + 1], t);
    }

    return this.gridPoints[this.gridPoints.length - 1].copy();
  }

  draw() {
    ctx.fillStyle = Color.deep_blue;

    for (let i = 0; i < this.gridPoints.length; i++) {
      Draw.square(grid.translatePoint(this.gridPoints[i]), grid.width - 20);
    }
  }
}