export class Test {
  private privField = 0;
  public pubField = "";

  constructor(public test: number) {

  }

  private privMethod(arg) {

  }

  public pubMethod(arg: number) {
    return arg;
  }
}
