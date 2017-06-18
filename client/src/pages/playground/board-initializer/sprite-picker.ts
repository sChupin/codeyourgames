import {bindable, bindingMode} from 'aurelia-framework';
import {SpriteSheetInfo} from '../../../utils/custom-elements/image-gallery';

export class SpritePicker {
  @bindable sprite: SpriteSheetInfo;
  // @bindable({ defaultBindingMode: bindingMode.twoWay }) picked: number;

  private offsetX: number = 0;
  private offsetY: number = 0;

  attached() {
    console.log('attached');
    this.updateBaseImg();

    let __this = this;
    $('[data-toggle="popover"]').popover({
      html: true,
      title: 'Select a costume <button type="button" class="close closepopover">&times;</button>',
      placement: 'right',
      trigger: 'focus'
    }).parent().delegate('button.closepopover', 'click', function() {
      __this.closePopover();
    }).delegate('img.popover-img', 'click', function(evt) {
      if (__this.sprite.defaultSpriteNo != evt.target.attributes.spriteno.value) {
        __this.sprite.defaultSpriteNo = evt.target.attributes.spriteno.value;
        __this.updateBaseImg();
      }
      __this.closePopover();
    });

    this.setContent();
  }

  detached() {
    console.log('detached');
  }

  private closePopover() {
    $('[data-toggle="popover"]').popover('hide');
  }

  private updateBaseImg() {
    let i = Math.floor(this.sprite.defaultSpriteNo/this.sprite.verticalNbr);
    let j = this.sprite.defaultSpriteNo%this.sprite.horizontalNbr;

    this.offsetX = -j*this.sprite.spriteWidth;
    this.offsetY = -i*this.sprite.spriteHeight;
  }

  private setContent() {
    let __this = this;
    let popOverContent = "";
    for (let i = 0; i < this.sprite.verticalNbr; i++) {
      for (let j = 0; j < this.sprite.horizontalNbr; j++) {
        let src = __this.sprite.sheetUrl;
        let style = 'object-fit: none; object-position:';
        style += ' -' + j*__this.sprite.spriteWidth + 'px ';
        style += ' -' + i*__this.sprite.spriteHeight + 'px; ';
        style += 'width: ' + __this.sprite.spriteWidth + 'px; ';
        style += 'height: ' + __this.sprite.spriteHeight + 'px;';
        popOverContent += '<img class="popover-img" spriteno="' + (i*__this.sprite.horizontalNbr + j) + '" src="' + src + '" style="' + style + '">';
      }
      popOverContent += "<br>";
    }

    $('[data-toggle="popover"]').attr('data-content', popOverContent);

  }

  spriteChanged(newval, oldval) {
    console.log('spriteChanged')
    console.log(newval);
    if (newval) {
      this.updateBaseImg();
      this.setContent();
    }
  }
}
