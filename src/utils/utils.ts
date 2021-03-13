
export class Color {

  constructor(color?: string) {
    if (color) {
      this.parse(color);
    }
  }

  toRGBAString(): string {
    return `rgba(${this.r},${this.g},${this.b},${this.a})`;
  }

  toHSLAString(): string {
    return `hsla(${this.h}deg,${this.s}%,${this.l}%,${this.a})`;
  }

  toHexAlphaString() {
    return this.hex + Color.to2DigitHex(this.a);
  }

  toRGBString(): string {
    return `rgb(${this.r},${this.g},${this.b})`;
  }

  toHSLString(): string {
    return `hsl(${this.h}deg,${this.s}%,${this.l}%)`;
  }

  toHexString() {
    return this.hex;
  }

  getRGBA() {
    return {
      r: this.r,
      g: this.g,
      b: this.b,
      a: this.a,
    };
  }

  getHSLA() {
    return {
      h: this.h,
      s: this.s,
      l: this.l,
      a: this.a,
    };
  }

  getLightness() {
    return this.l;
  }

  isDark(threshold = 50) {
    return this.l <= threshold;
  }

  isLight(threshold = 50) {
    return this.l > threshold;
  }

  // rgb
  protected r: number = 0;
  protected g: number = 0;
  protected b: number = 0;

  // hsl
  protected h: number = 0;
  protected s: number = 0;
  protected l: number = 0;

  // alpha
  protected a: number = 1;

  // hex
  protected hex = '#000000';


  private static to2DigitHex(value: number) {
    return ('00' + value.toString(16)).substr(-2)
  }

  protected fixRGB() {
    const h = (this.h % 360) / 360;
    const s = this.s / 100;
    const l = this.l / 100;

    let r;
    let g;
    let b;

    if (s === 0) {
      r = g = b = l * 2.55;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      }
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;

      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    this.r = Math.round(r * 255);
    this.g = Math.round(g * 255);
    this.b = Math.round(b * 255);
  }


  protected fixHSL() {
    const r = this.r / 255;
    const g = this.g / 255;
    const b = this.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h;
    let s;
    let l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }

      h /= 6;
    }

    this.h = Math.round(h * 360);
    this.s = Math.round(s * 100);
    this.l = Math.round(l * 100);

    return this;
  }


  protected fixHex() {
    this.hex = `#${Color.to2DigitHex(this.r)}${Color.to2DigitHex(this.g)}${Color.to2DigitHex(this.b)}`;
  }

  private static limitRGB(value) {
    return Math.max(0, Math.min(255, value));
  }

  private static limitAlpha(value) {
    return Math.max(0, Math.min(1, value));
  }

  private static limitPercentage(value) {
    return Math.max(0, Math.min(100, value));
  }

  private innerParsing = false;
  parse(color: string) {
    let result;
    if (result = /^\s*#([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})?\s*$/i.exec(color)) { // Check if color is in #fff or #ffff pattern
      this.r = Color.limitRGB(parseInt(result[1], 16) * 16);
      this.g = Color.limitRGB(parseInt(result[2], 16) * 16);
      this.b = Color.limitRGB(parseInt(result[3], 16) * 16);
      this.a = Color.limitAlpha(parseInt((result[4] ?? 'F'), 16) / 15);
      this.fixHSL();
      this.fixHex();
    } else if (result = /^\s*#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?\s*$/i.exec(color)) {  // Check if color is in #ffffff or #ffffffff pattern
      this.r = Color.limitRGB(parseInt(result[1], 16));
      this.g = Color.limitRGB(parseInt(result[2], 16));
      this.b = Color.limitRGB(parseInt(result[3], 16));
      this.a = Color.limitAlpha(parseInt((result[4] ?? 'FF'), 16) / 255);
      this.fixHSL();
      this.fixHex();
    } else if (result = /^\s*rgb\(\s*(\d+)\s*,?\s*(\d+)\s*,?\s*(\d+)\s*(?:,?\s*(\d+)\s*){0,1}\)\s*$/i.exec(color)) {  // Check if color is in rgb(0,0,0) or rgba(0,0,0,1) pattern
      this.r = Color.limitRGB(result[1]);
      this.g = Color.limitRGB(result[2]);
      this.b = Color.limitRGB(result[3]);
      this.a = Color.limitAlpha(result[4] ?? 1);
      this.fixHSL();
      this.fixHex();
    } else if (result = /^\s*hsl\(\s*(\d+)(deg|rad)\s*,?\s*(\d+)%\s*,?\s*(\d+)%\s*(?:,?\s*(\d+)\s*){0,1}\)\s*$/i.exec(color)) {  // Check if color is in hsla() pattern

      this.h = (result[1] * (result[2] === 'rad' ? 180 / Math.PI : 1)) % 360
      this.s = Color.limitPercentage(result[3]);
      this.l = Color.limitPercentage(result[4]);
      this.a = Color.limitAlpha(result[5] ?? 1);
      this.fixRGB();
      this.fixHex();
    } else if (!this.innerParsing) {
      this.innerParsing = true;
      const element = document.createElement('div');
      element.style.setProperty('color', color);

      if (element.style.color) {
        this.parse(window.getComputedStyle(element).color);
      }
      element.remove();
    }

    if (!result) {
      try {
        throw new Error('Could not parse color of value: ' + color);
      } catch (error) {
        console.error(error);
      }
    }
    this.innerParsing = false;
    return this;
  }
}
