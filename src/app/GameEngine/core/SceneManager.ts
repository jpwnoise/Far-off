import { ElementRef } from "@angular/core";
import { GameObject } from "../objects/GameObject";
import { CollisionSystem } from "./CollisitionSystem";
import { Proyectile } from "../objects/Proyectile";
import { AudioManager } from "./AudioManager";
import { Enemy } from "../objects/Enemy";
import { ParticleSystem } from "./ParticleSystem";
import { BackgroundCreator } from '../objects/BackgroundCreator';
import { SequencedBackground } from "../Animation/SequencedBackground";

/** controlador de Escenas */
export class SceneManager {
  public scenes: Scene[] = [];
  private currentScene: Scene;
  private currentSceneIndex = 0;

  /** @param scene  el manejador de escenas debe tener al menos una escena al crearse  */
  constructor(public canvas: ElementRef<HTMLCanvasElement>, public ctx: CanvasRenderingContext2D, scene: Scene) {
    this.scenes.push(scene);
    this.currentScene = scene;
  }

  /** agrega el contexto de dibujado a todas las escenas */
  addRenderingContext(ctx: CanvasRenderingContext2D, canvas: ElementRef<HTMLCanvasElement>) {
    this.scenes.forEach(s => { s.ctx = ctx; s.canvas = canvas });
  }

  /** agrega una scena */
  addScene(scene: Scene) {
    this.scenes.push(scene);
  }

  /** === la escena actual es la que se renderiza y este metodo te da la escena actual === */
  getCurrentScene() {
    return this.currentScene;
  }

  /** establece la escena actual  */
  setCurrentScene(sceneIndex: number) {
    if (sceneIndex < this.scenes.length) {
      this.currentSceneIndex = sceneIndex;
      this.currentScene = this.scenes[this.currentSceneIndex];
    }
    else throw new Error('Estas tratando de establecer una escena inexistente como la principal')
  }

  update(deltaTime = 0) {
    this.scenes.forEach((s) => { s.update(deltaTime) })
  }

  draw() {
    this.scenes.forEach((s) => { s.draw() })

  }
}

/** escenas o niveles del juego algo que se va a ir cargando dependiendo del momento adecuado */
export class Scene {

  gameObjects: GameObject[] = [];
  private musicLeve1!: AudioBuffer;
  public audioManager!: AudioManager
  particleSystem: ParticleSystem;
  backgroundCreator: BackgroundCreator | SequencedBackground;

  /** para indicar al nivel que inicie con la actualización en cada frame y el dibujado de los componentes de la escena*/
  start = false;

  /** para activar las animaciones del HUD */
  enemyHudVisible: boolean = false;

  constructor(public canvas: ElementRef<HTMLCanvasElement>, public ctx: CanvasRenderingContext2D, ps: ParticleSystem) {
    this.particleSystem = ps;
    this.backgroundCreator = new BackgroundCreator({ canvasRef: this.canvas, ctx: this.ctx });
  }


  playMusic() {
    this.audioManager = new AudioManager();
    this.audioManager.loadSound('Music/Ecos del vacio - Level 1.mp3').then((b) => {
      this.musicLeve1 = b;
      this.audioManager.play(this.musicLeve1, .5);
    });
  }

  update(deltaTime: number = 0) {
    if (!this.start) return;
    // Filtra los objetos que ya no están activos (como proyectiles desactivados)
    this.gameObjects = this.gameObjects.filter(obj => obj.active);

    this.gameObjects.forEach((gameObj) => {
      gameObj.update(deltaTime);
      CollisionSystem.iterateGameObjectsForCollisions(this.gameObjects);
    });

    // Llama al nuevo método para eliminar proyectiles fuera del canvas
    this._checkAndRemoveOutOfBoundObjects();
    this.backgroundCreator.update(deltaTime);
  }


  /** === dibujando === */
  draw() {
    if (!this.start) return;
    this.backgroundCreator.draw();
    this.gameObjects.forEach((gameObj) => {
      gameObj.draw();
    });

  }

  /** === se agrega al la escena un elemento nuevo para el manejo de colisiones y revisar si esta activo el objeto ===*/
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