export class StringToNumberValueConverter {
  fromView(str) {
    let isnan = isNaN(parseInt(str));
    return str && !isnan ? parseInt(str) : 0;
  }
}
