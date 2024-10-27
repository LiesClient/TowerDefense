class Grid {
  columns = 7;
  rows = 6;

  width = height / this.rows;
  offset = width - this.width * (this.columns + 1);

  // gridspace -> screenspace
  translatePoint(v) {
    let scaled = v.scale(this.width);

    return scaled.add(vec(this.offset + this.width / 2, this.width / 2));
  }

  // screenspace -> gridspace
  untranslatePoint(v) {
    let translated = v.sub(vec(this.offset + this.width / 2, this.width / 2));
    return translated.scale(1 / this.width).clamp(vec(0, 0), vec(this.rows, this.columns));
  }

  draw() {
    for (let x = 0; x < this.columns; x++) {
      for (let y = 0; y < this.rows; y++) {
        let point = this.translatePoint(vec(x, y));

        ctx.fillStyle = Color.gray4;
        Draw.square(point, this.width - 5);

        ctx.fillStyle = Color.black;
        Draw.square(point, this.width - 15);
      }
    }
  }
}