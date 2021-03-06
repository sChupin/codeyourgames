import {BoardInfo} from "./messages";
import {Dimensions} from "../utils/interfaces";

export class BoardInfoParser {
  
  public getDimensions(boardInfo: BoardInfo): Dimensions {
    let width, height;

    if (boardInfo.backgroundType != 'camera') {
      width = boardInfo.gameWidth;
      height = boardInfo.gameHeight;
    } else {
      width = boardInfo.cameraWidth;
      height = boardInfo.cameraHeight;
    }

    return { width: width, height: height };
  }

  public toCreateCode(boardInfo: BoardInfo): string {
    let code = "";

    // Add background image
    if (boardInfo.background) {
      code += "Game.setBackground('" + boardInfo.background.name + "', '" + boardInfo.backgroundType + "');\n";
      
      if (boardInfo.backgroundType == 'camera') {
        code += "Game.setCamera(" + boardInfo.cameraWidth + ", " + boardInfo.cameraHeight + ", " + boardInfo.gameWidth + ", " + boardInfo.gameHeight + ");\n";
      }
    }

    // Add each body on the board
    boardInfo.sprites.forEach(sprite => {
      let spritesheet = sprite.spritesheet;

      if (sprite.type == 'Weapon') {
        code += "let " + sprite.name + " = Game.createWeapon('" + sprite.key + "'";
        code += ");\n\n";      
      } else {
        code += "let " + sprite.name + " = Game.add" + sprite.type.charAt(0).toUpperCase() + sprite.type.slice(1) + "(" + sprite.x + ", " + sprite.y + ", '" + sprite.key + "'";
        code += ");\n\n";      
        if (spritesheet && (sprite.type == 'Hero' || sprite.type == 'Enemy')) {
          code += sprite.name + ".animated = true;\n";
        }
      }
      code += sprite.name + ".width = " + sprite.width + ";\n";
      code += sprite.name + ".height = " + sprite.height + ";\n";
      code += sprite.name + ".angle = " + sprite.angle + ";\n\n";

      if (spritesheet && spritesheet.defaultSpriteNo !== 0) {
        code += sprite.name + ".changeCostume(" + spritesheet.defaultSpriteNo + ");\n\n"
      }

    });

    code += "\n";

    return code;
  }

  public toPreloadCode(boardInfo: BoardInfo): string {
    let keyList: Array<string> = [];

    let code = "";

    // Allow cross-origin
    code += "this.load.crossOrigin = 'anonymous';\n";

    // Load background image
    if (boardInfo.background) {
      code += "this.load.image('" + boardInfo.background.name + "', '" + boardInfo.background.url + "');\n";
    }

    // Load each image asset once
    boardInfo.sprites.forEach(sprite => {
      if (keyList.indexOf(sprite.key) === -1) {
        keyList.push(sprite.key);
        
        if (sprite.spritesheet === undefined) {
          code += "this.load.image('" + sprite.key + "', '" + sprite.url + "');\n"
        } else {
          code += "this.load.spritesheet('" + sprite.key + "', '" + sprite.spritesheet.sheetUrl + "', " + sprite.spritesheet.spriteWidth + ", " + sprite.spritesheet.spriteHeight + ", " + sprite.spritesheet.spriteNbr + ");\n";
        }
      }
    });

    return code;
  }
}


