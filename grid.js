class Grid {
  columns = 5;
  rows = 4;

  width = height / this.rows;
  offset = width - this.width * this.columns;

  // gridspace -> screenspace
  translatePoint(v) {
    let scaled = v.scale(this.width);

    return scaled.add(vec(this.offset + this.width / 2, this.width / 2));
  }

  draw() {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        let point = this.translatePoint(vec(x, y));

        ctx.fillStyle = Color.white;
        Draw.square(point, this.width - 5);

        ctx.fillStyle = Color.black;
        Draw.square(point, this.width - 20);
      }
    }
  }
}