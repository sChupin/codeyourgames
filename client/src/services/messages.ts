import {ImageInfo, SpriteInfo} from '../utils/interfaces';

export class CodeUpdate {
  constructor(public preloadCode: string, public createCode: string, public updateCode: string) { }
}

export class BoardInfo {
  constructor(
    public gameWidth: number, public gameHeight: number,
    public background: ImageInfo, public backgroundType: string,
    public sprites: Array<SpriteInfo>,
    public cameraWidth?: number, public cameraHeight?: number,
  ) { }
}
