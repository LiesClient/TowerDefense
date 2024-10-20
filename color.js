class Color {
  // namespace color static defs
  static yellow = Color.fromHSL(60, 1, 0.5);

  static white = Color.fromHSL(0, 0, 1);

  // instance code
  r = 0;
  g = 0;
  b = 0;
  a = 0;

  constructor(r = 1, g = 1, b = 1, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  static fromHSL(hue, saturation, lightness) {
    let alpha = saturation * Math.min(lightness, 1 - lightness);
    let sample = (angle) => {
      let gamma = (angle + hue / 30) % 12;
      return lightness - alpha * Math.max(Math.min(gamma - 3, 9 - gamma, 1), -1);
    };

    return new Color(sample(0), sample(8), sample(4), 1);
  }

  static lerp(a, b, t) {
    return new Color(lerp(a.r, b.r, t), lerp(a.g, b.g, t), lerp(a.b, b.b, t), lerp(a.a, b.a, t));
  }

  toString() {
    return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a})`;
  }
}