export interface ImageInfo {
  name: string;
  url: string;
  spritesheet?: SpriteSheetInfo;
}

export interface SpriteSheetInfo {
  sheetUrl: string;
  spriteWidth: number;
  spriteHeight: number;
  horizontalNbr: number;
  verticalNbr: number;
  spriteNbr: number;
  defaultSpriteNo: number;
}

export interface SpriteInfo {
  key: string;
  name: string;
  url: string;
  type: string;
  typeProps: any;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number;
  spritesheet?: SpriteSheetInfo;
}

export interface Dimensions {
  width: number;
  height: number;
}
