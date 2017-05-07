declare class Souris {
  static POINTEUR: Point;

  static estPresse: boolean;
}

declare class Clavier {
  // Lettres
  static A: Clavier.Touche;
  static B: Clavier.Touche;
  static C: Clavier.Touche;
  static D: Clavier.Touche;
  static E: Clavier.Touche;
  static F: Clavier.Touche;
  static G: Clavier.Touche;
  static H: Clavier.Touche;
  static I: Clavier.Touche;
  static J: Clavier.Touche;
  static K: Clavier.Touche;
  static L: Clavier.Touche;
  static M: Clavier.Touche;
  static N: Clavier.Touche;
  static O: Clavier.Touche;
  static P: Clavier.Touche;
  static Q: Clavier.Touche;
  static R: Clavier.Touche;
  static S: Clavier.Touche;
  static T: Clavier.Touche;
  static U: Clavier.Touche;
  static V: Clavier.Touche;
  static W: Clavier.Touche;
  static X: Clavier.Touche;
  static Y: Clavier.Touche;
  static Z: Clavier.Touche;

  // Chiffres
  static ZERO: Clavier.Touche;
  static ONE: Clavier.Touche;
  static TWO: Clavier.Touche;
  static THREE: Clavier.Touche;
  static FOUR: Clavier.Touche;
  static FIVE: Clavier.Touche;
  static SIX: Clavier.Touche;
  static SEVEN: Clavier.Touche;
  static EIGHT: Clavier.Touche;
  static NINE: Clavier.Touche;

  // Controle
  static BACKSPACE: Clavier.Touche;
  static ENTER: Clavier.Touche;
  static SHIFT: Clavier.Touche;
  static CONTROL: Clavier.Touche;
  static ALT: Clavier.Touche;
  static ESC: Clavier.Touche;
  static SPACEBAR: Clavier.Touche;
  static DELETE: Clavier.Touche;

  // Fleches
  static LEFT: Clavier.Touche;
  static UP: Clavier.Touche;
  static RIGHT: Clavier.Touche;
  static DOWN: Clavier.Touche;
  
  // Autres
  static PLUS: Clavier.Touche;
  static MINUS: Clavier.Touche;

}

declare module Clavier {
  class Touche {
    public estPresse: boolean;
    public estRelache: boolean;
  }
}
