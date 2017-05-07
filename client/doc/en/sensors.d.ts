declare class Mouse {
  static POINTER: Point;

  static isPressed: boolean;
  // or isDown & isUp ?
}

declare class Keyboard {
  // Letters
  static A: Keyboard.Key;
  static B: Keyboard.Key;
  static C: Keyboard.Key;
  static D: Keyboard.Key;
  static E: Keyboard.Key;
  static F: Keyboard.Key;
  static G: Keyboard.Key;
  static H: Keyboard.Key;
  static I: Keyboard.Key;
  static J: Keyboard.Key;
  static K: Keyboard.Key;
  static L: Keyboard.Key;
  static M: Keyboard.Key;
  static N: Keyboard.Key;
  static O: Keyboard.Key;
  static P: Keyboard.Key;
  static Q: Keyboard.Key;
  static R: Keyboard.Key;
  static S: Keyboard.Key;
  static T: Keyboard.Key;
  static U: Keyboard.Key;
  static V: Keyboard.Key;
  static W: Keyboard.Key;
  static X: Keyboard.Key;
  static Y: Keyboard.Key;
  static Z: Keyboard.Key;

  // Digits
  static ZERO: Keyboard.Key;
  static ONE: Keyboard.Key;
  static TWO: Keyboard.Key;
  static THREE: Keyboard.Key;
  static FOUR: Keyboard.Key;
  static FIVE: Keyboard.Key;
  static SIX: Keyboard.Key;
  static SEVEN: Keyboard.Key;
  static EIGHT: Keyboard.Key;
  static NINE: Keyboard.Key;

  // Controls
  static BACKSPACE: Keyboard.Key;
  static ENTER: Keyboard.Key;
  static SHIFT: Keyboard.Key;
  static CONTROL: Keyboard.Key;
  static ALT: Keyboard.Key;
  static ESC: Keyboard.Key;
  static SPACEBAR: Keyboard.Key;
  static DELETE: Keyboard.Key;

  // Arrows
  static LEFT: Keyboard.Key;
  static UP: Keyboard.Key;
  static RIGHT: Keyboard.Key;
  static DOWN: Keyboard.Key;
  
  // Others
  static PLUS: Keyboard.Key;
  static MINUS: Keyboard.Key;
}

declare module Keyboard {
  class Key {
    public isDown: boolean;
    public isUp: boolean;
  }
}
