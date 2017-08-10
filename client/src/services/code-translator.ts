export class CodeTranslator {

  private enToFr = {
    Game: 'Jeu',
    addPlatform: 'ajouterPlateforme',
    animated: 'animé',
    true: 'vrai',
    width: 'largeur',
    height: 'hauteur',
    angle: 'angle'
  };

  private frToEn = {
    Jeu: 'Game',
    ajouterPlateforme: 'addPlateform',
    animé: 'animated',
    vrai: 'true',
    largeur: 'width',
    hauteur: 'height',
    angle: 'angle'
  };

  public translateToEnglish(str: string) {
    console.log(str);
    let trl = this.translate(str, this.frToEn);
    console.log(trl);
    return trl;
  }

  public translateToFrench(str) {
    return this.translate(str, this.enToFr);
  }

  private translate(str, mapObj) {
    var re = new RegExp(Object.keys(mapObj).join('|'), 'g');

    return str.replace(re, function(matched){
        return mapObj[matched];
    });
  }
    
}
