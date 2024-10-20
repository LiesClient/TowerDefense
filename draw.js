class Draw {
  static circle(position = Vector(), radius = 0) {
    ctx.beginPath();
    ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  static line(a = Vector(), b = Vector(), lineWidth = null) {
    if (lineWidth) ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }
}