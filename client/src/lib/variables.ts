// List of number variables accessed by global Numbers in user code
export class NumberMap {
  [key: string]: number;

  static addNumber(name: string, value?: number) {
    this[name] = value ? value : 0;
  }
}

// List of text variables accessed by global Texts in user code
export class TextMap {
  [key: string]: string;

  static addText(name: string, value?: string) {
    this[name] = value ? value : "";
  }
}

// List of boolean variables accessed by global booleans in user code
export class BooleanMap {
  [key: string]: boolean;

  static addBoolean(name: string, value?: boolean) {
    this[name] = value ? value : false;
  }
}
