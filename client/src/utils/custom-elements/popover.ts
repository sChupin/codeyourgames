import {customElement, bindable} from "aurelia-framework";

@customElement("popover-element")
export class PopoverElement {
  public template: HTMLElement;
  public target: HTMLElement;

  @bindable({defaultValue: true})
  public animation: boolean;

  @bindable({defaultValue: false})
  public container: (string | false);

  @bindable({defaultValue: 0})
  public delay: (number | object);

  @bindable({defaultValue: false})
  public html: boolean;

  @bindable({defaultValue: "right"})
  public placement: (string | Function);

  @bindable({defaultValue: false})
  public selector: (string | false);

  @bindable({defaultValue: "Default Title"})
  public title: (string | Function);

  @bindable({defaultValue: "click"})
  public trigger: string;

  @bindable({defaultValue: { selector: "body", padding: 0 }})
  public viewport: (string | Object | Function);

  public attached(): void {

    $(this.target.firstElementChild).popover({
      animation: this.animation,
      container: this.container,
      delay: this.delay,
      html: this.html,
      placement: this.placement,
      selector: this.selector,
      template: this.template.firstElementChild.outerHTML,
      title: this.title,
      trigger: this.trigger,
      viewport: this.viewport
    });
  }
}
