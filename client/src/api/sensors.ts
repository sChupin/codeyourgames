import {Point} from './utility';

/**
 * Gives access to the keys of your keyboard. A key can be in two states: up or down.
 * You can check the state of a key.
 * E.g.: Keyboard.SPACEBAR.isDown, Keyboard.A.isUp
 * 
 * @property A
 * @property B
 * @property C
 * @property D
 * @property E
 * @property F
 * @property G
 * @property H
 * @property I
 * @property J
 * @property K
 * @property L
 * @property M
 * @property N
 * @property O
 * @property P
 * @property Q
 * @property R
 * @property S
 * @property T
 * @property U
 * @property V
 * @property W
 * @property X
 * @property Y
 * @property Z
 * @property ZERO
 * @property ONE
 * @property TWO
 * @property THREE
 * @property FOUR
 * @property FIVE
 * @property SIX
 * @property SEVEN
 * @property EIGHT
 * @property NINE
 * @property BACKSPACE
 * @property ENTER
 * @property SHIFT
 * @property CONTROL
 * @property ALT
 * @property ESC
 * @property SPACEBAR
 * @property DELETE
 * @property LEFT
 * @property UP
 * @property RIGHT
 * @property DOWN
 * @property PLUS
 * @property MINUS
 * 
 * @event <KEY_NAME>.isDown The key <KEY_NAME> is pressed
 * @event <KEY_NAME>.isUp The key <KEY_NAME> is not pressed
 * 
 * @class Keyboard
 */
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

  public ARROWS: Keyboard.Arrows;

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

    this.ARROWS = new Keyboard.Arrows(
      this.phaserKeyboard.addKey(Phaser.Keyboard.UP),
      this.phaserKeyboard.addKey(Phaser.Keyboard.DOWN),
      this.phaserKeyboard.addKey(Phaser.Keyboard.LEFT),
      this.phaserKeyboard.addKey(Phaser.Keyboard.RIGHT)
    );
  }
}

export namespace Keyboard {

  export class Key {
    private isDown: boolean = false;
    private isUp: boolean = true;

    constructor(private phaserKey: Phaser.Key) {
      phaserKey.onDown.add(() => {this.isDown = true; this.isUp = false;});
      phaserKey.onUp.add(() => {this.isUp = true; this.isDown = false;});
    }
  }

  export class Arrows {
    private areUp: boolean = true;
    
    constructor(private up: Phaser.Key, private down: Phaser.Key, private left: Phaser.Key, private right: Phaser.Key) {
      up.onDown.add(() => {this.areUp = false;});
      down.onDown.add(() => {this.areUp = false;});
      left.onDown.add(() => {this.areUp = false;});
      right.onDown.add(() => {this.areUp = false;});

      up.onUp.add(() => {if (down.isUp && left.isUp && right.isUp) {this.areUp = true;}});
      down.onUp.add(() => {if (up.isUp && left.isUp && right.isUp) {this.areUp = true;}});
      left.onUp.add(() => {if (down.isUp && up.isUp && right.isUp) {this.areUp = true;}});
      right.onUp.add(() => {if (down.isUp && left.isUp && up.isUp) {this.areUp = true;}});
    }
  }
}


/**
 * Gives access to mouse position and click events.
 * 
 * @property position Coordinates of the cursor
 * @event isDown Left button is pressed
 * @event isUp Left button is not pressed
 * @class Mouse
 */
export class Mouse {
  public position: Point;

  private isDown: boolean;
  private isUp: boolean;

  constructor(private phaserInput: Phaser.Input) {
    this.position = phaserInput.activePointer.position;
    phaserInput.onDown.add(() => {this.isDown = true; this.isUp = false;});
    phaserInput.onUp.add(() => {this.isUp = true; this.isDown = false;});
  }
}
