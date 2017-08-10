export class Playground {

  private difficulty: string;

  activate(params, routeConfig, navigationInstruction) {
    this.difficulty = params.difficulty;
  }  
}
