export class Keyboard {

  public A: Keyboard.Key;
  public B: Keyboard.Key;
  public C: Keyboard.Key;
  public D: Keyboard.Key;
  public E: Keyboard.Key;
  public F: Keyboard.Key;
  public G: Keyboard.Key;
  public H: Keyboard.Key;
  public I: Keyboard.Key;
  public J: Keyboard.Key;
  public K: Keyboard.Key;
  public L: Keyboard.Key;
  public M: Keyboard.Key;
  public N: Keyboard.Key;
  public O: Keyboard.Key;
  public P: Keyboard.Key;
  public Q: Keyboard.Key;
  public R: Keyboard.Key;
  public S: Keyboard.Key;
  public T: Keyboard.Key;
  public U: Keyboard.Key;
  public V: Keyboard.Key;
  public W: Keyboard.Key;
  public X: Keyboard.Key;
  public Y: Keyboard.Key;
  public Z: Keyboard.Key;

  public ZERO: Keyboard.Key;
  public ONE: Keyboard.Key;
  public TWO: Keyboard.Key;
  public THREE: Keyboard.Key;
  public FOUR: Keyboard.Key;
  public FIVE: Keyboard.Key;
  public SIX: Keyboard.Key;
  public SEVEN: Keyboard.Key;
  public EIGHT: Keyboard.Key;
  public NINE: Keyboard.Key;

  public BACKSPACE: Keyboard.Key;
  public ENTER: Keyboard.Key;
  public SHIFT: Keyboard.Key;
  public CONTROL: Keyboard.Key;
  public ALT: Keyboard.Key;
  public ESC: Keyboard.Key;
  public SPACEBAR: Keyboard.Key;
  public DELETE: Keyboard.Key;

  public LEFT: Keyboard.Key;
  public UP: Keyboard.Key;
  public RIGHT: Keyboard.Key;
  public DOWN: Keyboard.Key;
  
  public PLUS: Keyboard.Key;
  public MINUS: Keyboard.Key;

  constructor(private phaserKeyboard: Phaser.Keyboard) {
    this.A = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.A));
    this.B = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.B));
    this.C = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.C));
    this.D = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.D));
    this.E = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.E));
    this.F = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.F));
    this.G = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.G));
    this.H = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.H));
    this.I = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.I));
    this.J = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.J));
    this.K = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.K));
    this.L = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.L));
    this.M = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.M));
    this.N = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.N));
    this.O = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.O));
    this.P = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.P));
    this.Q = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.Q));
    this.R = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.R));
    this.S = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.S));
    this.T = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.T));
    this.U = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.U));
    this.V = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.V));
    this.W = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.W));
    this.X = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.X));
    this.Y = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.Y));
    this.Y = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.Y));
    this.Z = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.Z));

    this.ZERO = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_0));
    this.ONE = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_1));
    this.TWO = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_2));
    this.THREE = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_3));
    this.FOUR = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_4));
    this.FIVE = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_5));
    this.SIX = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_6));
    this.SEVEN = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_7));
    this.EIGHT = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_8));
    this.NINE = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_9));

    this.BACKSPACE = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.BACKSPACE));
    this.ENTER = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.ENTER));
    this.SHIFT = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.SHIFT));
    this.CONTROL = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.CONTROL));
    this.ALT = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.ALT));
    this.ESC = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.ESC));
    this.SPACEBAR = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.SPACEBAR));
    this.DELETE = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.DELETE));

    this.LEFT = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.LEFT));
    this.UP = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.UP));
    this.RIGHT = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.RIGHT));
    this.DOWN = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.DOWN));
    
    this.PLUS = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_ADD));
    this.MINUS = new Keyboard.Key(this.phaserKeyboard.addKey(Phaser.Keyboard.NUMPAD_SUBTRACT));
  }
}

export namespace Keyboard {

  export class Key {
    private isDown: boolean;
    private isUp: boolean;

    constructor(private phaserKey: Phaser.Key) {
      phaserKey.onDown.add(() => {this.isDown = true; this.isUp = false;});
      phaserKey.onUp.add(() => {this.isUp = true; this.isDown = false;});
    }
  }
}

export class Mouse {
  private isDown: boolean;
  private isUp: boolean;

  constructor(private phaserInput: Phaser.Input) {
    phaserInput.onDown.add(() => {this.isDown = true; this.isUp = false;});
    phaserInput.onUp.add(() => {this.isUp = true; this.isDown = false;});
  }
}
