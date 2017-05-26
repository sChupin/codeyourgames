export class ToJsonValueConverter {
  toView(obj) {
    let ret = JSON.stringify(obj, null, 2);
    return ret;
  }
}
