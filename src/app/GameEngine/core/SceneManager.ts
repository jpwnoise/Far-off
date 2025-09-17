import { ElementRef } from "@angular/core";
import { GameObject } from "../objects/GameObject";
import { CollisionSystem } from "./CollisitionSystem";
import { Proyectile } from "../objects/Proyectile";
import { AudioManager } from "./AudioManager";
import { Enemy } from "../objects/Enemy";
import { ParticleSystem } from "./ParticleSystem";
import { BackgroundCreator } from '../objects/BackgroundCreator';


export class SceneManager {
  public scenes: Scene[] = [];
  private currentScene: Scene;
  private currentSceneIndex = 0;
  
  /** @param scene  el manejador de escenas debe tener al menos una escena al crearse  */
  constructor(public canvas: ElementRef<HTMLCanvasElement>, public ctx: CanvasRenderingContext2D, scene: Scene) {
    this.scenes.push(scene);
    this.currentScene = scene;
  }
  
  addRenderingContext(ctx: CanvasRenderingContext2D, canvas:ElementRef<HTMLCanvasElement>) {
    this.scenes.forEach(s=>{s.ctx = ctx; s.canvas = canvas});
  }

  /** agrega una scena */
  addScene(scene: Scene) {
    this.scenes.push(scene);
  }

  /** === la escena actual es la que se renderiza y este metodo te da la escena actual === */
  getCurrentScene() {
    return this.currentScene;
  }

  setCurrentScene(sceneIndex: number) {
    if (sceneIndex < this.scenes.length) {
      this.currentSceneIndex = sceneIndex;
      this.currentScene = this.scenes[this.currentSceneIndex];
    }
    else throw new Error('Estas tratando de establecer una escena inexistente como la principal')
  }

  update(){
    this.scenes.forEach((s)=>{s.update()})
  }
  
  draw(){
    this.scenes.forEach((s)=>{s.draw()})

  }
}

/** escenas o niveles del juego algo que se va a ir cargando dependiendo del momento adecuado */
export class Scene {

  gameObjects: GameObject[] = [];
  private musicLeve1!: AudioBuffer;
  public audioManager!: AudioManager
  public enemies: Enemy[] = [];
  particleSystem: ParticleSystem;
  backgroundCreator: BackgroundCreator;
  start = false; 

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


  update() {
    if (!this.start) return; 
    // Filtra los objetos que ya no están activos (como proyectiles desactivados)
    this.gameObjects = this.gameObjects.filter(obj => obj.active);

    this.gameObjects.forEach((gameObj) => {
      gameObj.update();
      CollisionSystem.iterateGameObjectsForCollisions(this.gameObjects);
    });

    // Llama al nuevo método para eliminar proyectiles fuera del canvas
    this._checkAndRemoveOutOfBoundObjects();
    this.backgroundCreator.update();
  }


  /** === dibujando === */
  draw() {
    if (!this.start) return; 
    this.backgroundCreator.drawBackground();
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

  /** === cuando en el enemigo lanza disparos estos tienen que se agregados a la escena para que funcionen las colisiones en ellos */
  addEnemiesAndProjectilesToScene() {
    setTimeout(() => {
      this.enemies.forEach(e => {
        e.projectileWasCreated = (p) => { this.add(p) };
        e.ctx = this.ctx;
        e.particlesSystem = this.particleSystem;
        e.wasHittedHandler = (stats) => {
          //this.enemyHudVisible = true;
          //this.currentHittedEnemy = e;
          setTimeout(() => {
            //this.enemyHudVisible = false;
          }, 1000)
        }
        this.add(e);
      })//for each
    }, 20000);
  }

}
