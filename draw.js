class Draw {
  static circle(position = vec(), radius = 0) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  static line(a = vec(), b = vec(), lineWidth = null) {
    if (lineWidth) ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  static square(position = vec(), size = 0) {
    ctx.fillRect(position.x - size / 2, position.y - size / 2, size, size);
  }

  static arrow(a = vec(), b = vec(), arrowSize) {
    let base = b.sub(a).norm();
    let direction = base.perp().scale(arrowSize);
    let offset = base.scale(-arrowSize).add(b);

    let points = [offset.add(direction), offset.add(direction.scale(-1)), b];

    ctx.beginPath();
    points.forEach(point => ctx.lineTo(point.x, point.y));
    ctx.fill();

    Draw.line(a, offset);
  }

  static progressCircle(position = vec(), radius = 0, progress = 0) {
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.arc(position.x, position.y, radius, 0, Math.PI * 2 * progress);
    ctx.fill();
  }
}