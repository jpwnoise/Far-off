import { ElementRef } from "@angular/core";
import { GameObject } from "../objects/GameObject";
import { CollisionSystem } from "./CollisitionSystem";

export class SceneManager {
  public scenes = []

  constructor(
    public canvas: ElementRef<HTMLCanvasElement>,
    public ctx: CanvasRenderingContext2D) {
  }
}


/** escenas o niveles del juego algo que se va a ir cargando dependiendo del momento adecuado */
export class Scene {
  
  gameObjects: GameObject[] = [];

  update() {
    this.gameObjects.forEach((gameObj) => {
      gameObj.update();
      CollisionSystem.iterateGameObjectsForCollisions(this.gameObjects);
    })
  }

  draw() {
    this.gameObjects.forEach((gameObj) => {
      gameObj.draw();
    })
  }

  constructor(
    public canvas: ElementRef<HTMLCanvasElement>,
    public ctx: CanvasRenderingContext2D) {
  }

  add(gameObject: GameObject) {
    gameObject.canvas = this.canvas;
    gameObject.ctx = this.ctx;
    this.gameObjects.push(gameObject)
  }
}