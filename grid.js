class Grid {
  size = 20;
  columns = this.size;
  rows = this.size;
  grid = [[]];

  constructor() {
    this.grid = new Array(this.columns).fill(0).map(() => new Array(this.rows).fill(null));
  }

  width = height / this.rows;

  // gridspace -> screenspace
  translatePoint(v) {
    let scaled = v.scale(this.width);

    return scaled.add(vec(this.width / 2, this.width / 2));
  }

  // screenspace -> gridspace
  untranslatePoint(v) {
    let translated = v.sub(vec(this.width / 2, this.width / 2));
    return translated.scale(1 / this.width).clamp(vec(0, 0), vec(this.rows, this.columns));
  }

  update() {
    
  }

  plotPoints(inputPoints, value = 1) {
    let points = inputPoints.flat();

    for (let i = 0; i < points.length; i++) {
      this.set(points[i], value);
    }
  }

  plotPoint(point, value) {
    this.set(point, value);
  }

  set(v, value) {
    return this.grid[v.x][v.y] = value;
  }

  get(v) {
    return this.grid[v.x][v.y];
  }

  resetGrid() {
    this.grid = new Array(this.columns).fill(0).map(() => new Array(this.rows).fill(0));
  }

  draw() {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        let point = this.translatePoint(vec(x, y));

        ctx.fillStyle = Color.white.alpha(0.5);
        Draw.square(point, this.width - 4);

        ctx.fillStyle = Color.black.alpha(0.5);
        Draw.square(point, this.width - 6);

        ctx.fillStyle = Color.black;
        Draw.square(point, this.width - 8);
      }
    }
  }
}