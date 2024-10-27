class Color {
  // namespace color static defs
  static neon_red    = Color.fromHSL(  0, 1.0, 0.6);
  static neon_orange = Color.fromHSL( 30, 1.0, 0.6);
  static neon_yellow = Color.fromHSL( 62, 1.0, 0.6);
  static neon_green  = Color.fromHSL(120, 1.0, 0.6);
  static neon_blue   = Color.fromHSL(180, 1.0, 0.5);
  static neon_purple = Color.fromHSL(270, 1.0, 0.6);

  static red         = Color.darker(this.neon_red,    0.2);
  static orange      = Color.darker(this.neon_orange, 0.2);
  static yellow      = Color.darker(this.neon_yellow, 0.2);
  static green       = Color.darker(this.neon_green,  0.2);
  static blue        = Color.darker(this.neon_blue,   0.2);
  static purple      = Color.darker(this.neon_purple, 0.2);

  static deep_red    = Color.darker(this.red,    0.4);
  static deep_orange = Color.darker(this.orange, 0.4);
  static deep_yellow = Color.darker(this.yellow, 0.4);
  static deep_green  = Color.darker(this.green,  0.4);
  static deep_blue   = Color.darker(this.blue,   0.4);
  static deep_purple = Color.darker(this.purple, 0.4);

  static white = Color.fromHSL(0, 0, 1.0);
  static gray1 = Color.fromHSL(0, 0, 0.8);
  static gray2 = Color.fromHSL(0, 0, 0.6);
  static gray3 = Color.fromHSL(0, 0, 0.4);
  static gray4 = Color.fromHSL(0, 0, 0.2);
  static black = Color.fromHSL(0, 0, 0.0);

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

  static multiply(a, b) {
    return new Color(a.r * b.r, a.g * b.g, a.b * b.b, a.a * b.a);
  }

  static darker(color, percent = 0.2) {
    if (percent <= 0) return color;
    let darkerColor = new Color(0.8, 0.8, 0.9, 1);

    return Color.darker(Color.multiply(color, darkerColor), percent - 0.2);
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

  static contrast(color) {
    let luminance = Color.relativeLuminance(color);

    return (luminance < 0.5) ? Color.fromHSL(0, 0, 1) : Color.fromHSL(0, 0, 0);
  }

  static relativeLuminance(color) {
    let r = (color.r <= 0.03928) ? color.r / 12.92 : Math.pow((color.r + 0.055) / 1.055, 2.4);
    let g = (color.g <= 0.03928) ? color.g / 12.92 : Math.pow((color.g + 0.055) / 1.055, 2.4);
    let b = (color.b <= 0.03928) ? color.b / 12.92 : Math.pow((color.b + 0.055) / 1.055, 2.4);

    return (0.2126 * r + 0.7152 * g + 0.0722 * b) * color.a;
  }

  toString() {
    return `rgba(${this.r * 255}, ${this.g * 255}, ${this.b * 255}, ${this.a})`;
  }
}