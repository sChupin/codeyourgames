import Phaser = require('phaser');

export class Point {
  public x: number;
  public y: number;
}

export class Velocity {
  static SLOW: number = 1;
  static MEDIUM: number = 10;
  static FAST: number = 100;
}

export class Direction {
  static RIGHT: number = 0;
  static DOWN: number = 90;
  static LEFT: number = -180;
  static UP: number = -90;
  static NORTH_EAST: number = -45;
  static NORTH_WEST: number = -135;
  static SOUTH_EAST: number = 45;
  static SOUTH_WEST: number = 135;
}

export class Time extends Phaser.Time {
  static QUARTER_SECOND: number = Phaser.Timer.QUARTER;
  static HALF_SECOND: number = Phaser.Timer.HALF;
  static SECOND: number = Phaser.Timer.SECOND;
  static MINUTE: number = Phaser.Timer.MINUTE;

  
  /**
   * 
   * 
   * @param {number} time Number of ms to wait before executing the action
   * @param {function} action The function to execute once the time hase elapsed.
   * @memberof Time
   */
  public wait(time: number, action) {
    let timer = this.create();
    timer.add(time, action);
  }
}

export class Color {
  static AliceBlue: string = '#F0F8FF';
  static AntiqueWhite: string = '#FAEBD7';
  static Aqua: string = '#00FFFF';
  static Aquamarine: string = '#7FFFD4';
  static Azure: string = '#F0FFFF';
  static Beige: string = '#F5F5DC';
  static Bisque: string = '#FFE4C4';
  static Black: string = '#000000';
  static BlanchedAlmond: string = '#FFEBCD';
  static Blue: string = '#0000FF';
  static BlueViolet: string = '#8A2BE2';
  static Brown: string = '#A52A2A';
  static BurlyWood: string = '#DEB887';
  static CadetBlue: string = '#5F9EA0';
  static Chartreuse: string = '#7FFF00';
  static Chocolate: string = '#D2691E';
  static Coral: string = '#FF7F50';
  static CornflowerBlue: string = '#6495ED';
  static Cornsilk: string = '#FFF8DC';
  static Crimson: string = '#DC143C';
  static Cyan: string = '#00FFFF';
  static DarkBlue: string = '#00008B';
  static DarkCyan: string = '#008B8B';
  static DarkGoldenRod: string = '#B8860B';
  static DarkGray: string = '#A9A9A9';
  static DarkGrey: string = '#A9A9A9';
  static DarkGreen: string = '#006400';
  static DarkKhaki: string = '#BDB76B';
  static DarkMagenta: string = '#8B008B';
  static DarkOliveGreen: string = '#556B2F';
  static DarkOrange: string = '#FF8C00';
  static DarkOrchid: string = '#9932CC';
  static DarkRed: string = '#8B0000';
  static DarkSalmon: string = '#E9967A';
  static DarkSeaGreen: string = '#8FBC8F';
  static DarkSlateBlue: string = '#483D8B';
  static DarkSlateGray: string = '#2F4F4F';
  static DarkSlateGrey: string = '#2F4F4F';
  static DarkTurquoise: string = '#00CED1';
  static DarkViolet: string = '#9400D3';
  static DeepPink: string = '#FF1493';
  static DeepSkyBlue: string = '#00BFFF';
  static DimGray: string = '#696969';
  static DimGrey: string = '#696969';
  static DodgerBlue: string = '#1E90FF';
  static FireBrick: string = '#B22222';
  static FloralWhite: string = '#FFFAF0';
  static ForestGreen: string = '#228B22';
  static Fuchsia: string = '#FF00FF';
  static Gainsboro: string = '#DCDCDC';
  static GhostWhite: string = '#F8F8FF';
  static Gold: string = '#FFD700';
  static GoldenRod: string = '#DAA520';
  static Gray: string = '#808080';
  static Grey: string = '#808080';
  static Green: string = '#008000';
  static GreenYellow: string = '#ADFF2F';
  static HoneyDew: string = '#F0FFF0';
  static HotPink: string = '#FF69B4';
  static IndianRed : string = '#CD5C5C';
  static Indigo  : string = '#4B0082';
  static Ivory: string = '#FFFFF0';
  static Khaki: string = '#F0E68C';
  static Lavender: string = '#E6E6FA';
  static LavenderBlush: string = '#FFF0F5';
  static LawnGreen: string = '#7CFC00';
  static LemonChiffon: string = '#FFFACD';
  static LightBlue: string = '#ADD8E6';
  static LightCoral: string = '#F08080';
  static LightCyan: string = '#E0FFFF';
  static LightGoldenRodYellow: string = '#FAFAD2';
  static LightGray: string = '#D3D3D3';
  static LightGrey: string = '#D3D3D3';
  static LightGreen: string = '#90EE90';
  static LightPink: string = '#FFB6C1';
  static LightSalmon: string = '#FFA07A';
  static LightSeaGreen: string = '#20B2AA';
  static LightSkyBlue: string = '#87CEFA';
  static LightSlateGray: string = '#778899';
  static LightSlateGrey: string = '#778899';
  static LightSteelBlue: string = '#B0C4DE';
  static LightYellow: string = '#FFFFE0';
  static Lime: string = '#00FF00';
  static LimeGreen: string = '#32CD32';
  static Linen: string = '#FAF0E6';
  static Magenta: string = '#FF00FF';
  static Maroon: string = '#800000';
  static MediumAquaMarine: string = '#66CDAA';
  static MediumBlue: string = '#0000CD';
  static MediumOrchid: string = '#BA55D3';
  static MediumPurple: string = '#9370DB';
  static MediumSeaGreen: string = '#3CB371';
  static MediumSlateBlue: string = '#7B68EE';
  static MediumSpringGreen: string = '#00FA9A';
  static MediumTurquoise: string = '#48D1CC';
  static MediumVioletRed: string = '#C71585';
  static MidnightBlue: string = '#191970';
  static MintCream: string = '#F5FFFA';
  static MistyRose: string = '#FFE4E1';
  static Moccasin: string = '#FFE4B5';
  static NavajoWhite: string = '#FFDEAD';
  static Navy: string = '#000080';
  static OldLace: string = '#FDF5E6';
  static Olive: string = '#808000';
  static OliveDrab: string = '#6B8E23';
  static Orange: string = '#FFA500';
  static OrangeRed: string = '#FF4500';
  static Orchid: string = '#DA70D6';
  static PaleGoldenRod: string = '#EEE8AA';
  static PaleGreen: string = '#98FB98';
  static PaleTurquoise: string = '#AFEEEE';
  static PaleVioletRed: string = '#DB7093';
  static PapayaWhip: string = '#FFEFD5';
  static PeachPuff: string = '#FFDAB9';
  static Peru: string = '#CD853F';
  static Pink: string = '#FFC0CB';
  static Plum: string = '#DDA0DD';
  static PowderBlue: string = '#B0E0E6';
  static Purple: string = '#800080';
  static RebeccaPurple: string = '#663399';
  static Red: string = '#FF0000';
  static RosyBrown: string = '#BC8F8F';
  static RoyalBlue: string = '#4169E1';
  static SaddleBrown: string = '#8B4513';
  static Salmon: string = '#FA8072';
  static SandyBrown: string = '#F4A460';
  static SeaGreen: string = '#2E8B57';
  static SeaShell: string = '#FFF5EE';
  static Sienna: string = '#A0522D';
  static Silver: string = '#C0C0C0';
  static SkyBlue: string = '#87CEEB';
  static SlateBlue: string = '#6A5ACD';
  static SlateGray: string = '#708090';
  static SlateGrey: string = '#708090';
  static Snow: string = '#FFFAFA';
  static SpringGreen: string = '#00FF7F';
  static SteelBlue: string = '#4682B4';
  static Tan: string = '#D2B48C';
  static Teal: string = '#008080';
  static Thistle: string = '#D8BFD8';
  static Tomato: string = '#FF6347';
  static Turquoise: string = '#40E0D0';
  static Violet: string = '#EE82EE';
  static Wheat: string = '#F5DEB3';
  static White: string = '#FFFFFF';
  static WhiteSmoke: string = '#F5F5F5';
  static Yellow: string = '#FFFF00';
  static YellowGreen: string = '#9ACD32';
}
