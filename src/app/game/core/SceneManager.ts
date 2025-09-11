import { ElementRef } from "@angular/core";
import { GameObject } from "../objects/GameObject";
import { CollisionSystem } from "./CollisitionSystem";
import { Proyectile } from "../objects/Proyectile";
import { AudioManager } from "./AudioManager";

export class SceneManager {
  public scenes = [];


  constructor(
    public canvas: ElementRef<HTMLCanvasElement>,
    public ctx: CanvasRenderingContext2D,
  ) {
  }
}


/** escenas o niveles del juego algo que se va a ir cargando dependiendo del momento adecuado */
export class Scene {

  gameObjects: GameObject[] = [];
  private musicLeve1!: AudioBuffer;
  public audioManager!: AudioManager

  playMusic(){
    this.audioManager = new AudioManager();
      this.audioManager.loadSound('Music/Ecos del vacio - Level 1.mp3').then((b)=>{
        this.musicLeve1 = b;
        this.audioManager.play(this.musicLeve1,.5);
      });
  }

  update() {
    // Filtra los objetos que ya no están activos (como proyectiles desactivados)
    this.gameObjects = this.gameObjects.filter(obj => obj.active);

    this.gameObjects.forEach((gameObj) => {
      gameObj.update();
      CollisionSystem.iterateGameObjectsForCollisions(this.gameObjects);
    });

    // Llama al nuevo método para eliminar proyectiles fuera del canvas
    this._checkAndRemoveOutOfBoundObjects();
  }

  draw() {
    this.gameObjects.forEach((gameObj) => {
      gameObj.draw();
    })
  }

  constructor(
    public canvas: ElementRef<HTMLCanvasElement>,
    public ctx: CanvasRenderingContext2D,
    
  ) {
    
  }

  add(gameObject: GameObject) {
    gameObject.canvas = this.canvas;
    gameObject.ctx = this.ctx;
    this.gameObjects.push(gameObject)
  }

  /**
  * Método privado para desactivar proyectiles que salieron del canvas.
  */
  private _checkAndRemoveOutOfBoundObjects() {
    this.gameObjects.forEach((gameObj) => {
      // Solo se aplica a los proyectiles
      if (gameObj instanceof Proyectile) {
        const isOutOfBounds =
          gameObj.x < 0 ||
          gameObj.x > this.canvas.nativeElement.width ||
          gameObj.y < 0 ||
          gameObj.y > this.canvas.nativeElement.height;

        if (isOutOfBounds) {
          // Desactiva el proyectil para que sea eliminado en el próximo update
          gameObj.active = false;
        }
      }
    });
  }
}
