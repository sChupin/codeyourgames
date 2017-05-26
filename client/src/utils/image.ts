export class Image {
  constructor(public name: string, public url: string) { }
}

export class SpriteSheet extends Image {
  constructor(public name: string, public url: string, public spriteSheetInfo: SpriteSheetInfo) {
    super(name, url);
  }
}

interface SpriteSheetInfo {
  horizontalSprites: number;
  verticalSprites: number;
  defaultSprite: number;
  defaultSpriteUrl: string;
}
