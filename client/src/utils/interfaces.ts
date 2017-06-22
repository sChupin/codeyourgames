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
