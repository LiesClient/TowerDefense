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
}