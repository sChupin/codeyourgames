export class CodeTranslator {

  private enToFr = {
    // keywords
    and:  'et',
    or: 'ou',
    not: 'non',
    greater_than: 'plus_grand_que',
    lower_than: 'plus_petit_que',
    equals: 'égale',
    true: 'vrai',
    false: 'faux',
    if: 'si',
    then: 'alors',
    else: 'sinon',
    repeat: 'répéter',
    repeat_until: 'répéter_tant_que',
    forever: 'toujours',
    when: 'quand',
    while: 'tant_que',
    once: 'une_fois_que',
    do: 'faire',
    function: 'fonction',
    return: 'retourner',
    let: 'soit',
    // Globals
    Game: 'Jeu',
    Keyboard: 'Clavier',
    Mouse: 'Souris',
    Math: 'Math',
    Time: 'Temps',
    Direction: 'Direction',
    Color: 'Color',
    // Sprite types
    // Globals methods + properties
    // Sprite types method + properties
    // do it automatically
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
