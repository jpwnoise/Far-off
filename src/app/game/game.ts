import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Ship } from '../GameEngine/objects/Ship';
import { TextAnimation } from '../GameEngine/Animation/TextAnimation';
import { StarsTravel } from '../GameEngine/Animation/StarsTravel';
import { ParticleSystem } from '../GameEngine/core/ParticleSystem';
import { Enemy } from '../GameEngine/objects/Enemy';
import { Scene, SceneManager } from '../GameEngine/core/SceneManager';

@Component({
  selector: 'app-game',
  templateUrl: './game.html',
  styleUrl: './game.sass'
})
export class Game implements AfterViewInit {

  sceneManager!: SceneManager;
  starsTravelAnimation!: StarsTravel;

  /** === controlando el estado de juego "jugando/pausado" ===*/
  isPlaying = false;
  hasTarted = false;
  isStartButtonPressed: boolean = false;
  currentScene: Scene;

  private ctx!: CanvasRenderingContext2D;
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private particleSystem!: ParticleSystem;


  // ===== Enemy con MovePattern y Shooter =====
  private animationId: number = 0;
  public enemyHudVisible = false;

  playerShip!: Ship;

  currentHittedEnemy: Enemy | null = null;

  private titleAnimation!: TextAnimation;
  private subTitle!: TextAnimation;

  constructor() {
    this.playerShip = new Ship({ x: 665, y: 450, radius: 20, speed: 5 });
    this.createScenes();
    this.currentScene = this.sceneManager.getCurrentScene();
  } //fin constructor 

  start() {
    this.currentScene.playMusic();
    this.titleAnimation.movementDirection = 'right';
    this.subTitle.movementDirection = 'left';
    this.titleAnimation.fadeOut = true;
    this.subTitle.fadeOut = true;
    this.starsAnimationSpeed = 5;

    setTimeout(() => {
      this.isPlaying = true;
      this.hasTarted = true;
      // despues de presionar "iniciar en el menú principal empezamos agregarlos enemigos a la escena"
        this.currentScene.addEnemiesAndProjectilesToScene();
    }, 4000);
  }

  /** === toggle para el play ===*/
  playPause() {
    this.isPlaying = !this.isPlaying;

    const currentScene = this.sceneManager.getCurrentScene();
    if (currentScene) {
      if (this.isPlaying) {
        currentScene.audioManager.resume();
      } else {
        currentScene.audioManager.pause();
      }
    }
  }

  /** === se implementa el metodo de angular para cuando los elementos fueron renderizados ===  */
  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.particleSystem = new ParticleSystem(this.ctx)
    this.createStartMenu();
    this.sceneManager.addRenderingContext(this.ctx, this.canvasRef);

    //=== se agrega un fondo negro para ubicar el área del canvas ===
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.loop();
  }

  /** === se inicializa el menú principal del juego === */
  createStartMenu() {
    this.starsTravelAnimation = new StarsTravel(this.ctx)

    this.titleAnimation = new TextAnimation(this.ctx, 'Far-off', '50px', { r: 255, g: 255, b: 255 }, 0, 0, 8000, 0);
    this.titleAnimation.fadeOut = false;

    this.subTitle = new TextAnimation(this.ctx, 'El silencio del abismo', '25px', { r: 255, g: 0, b: 0 }, 0, 40, 8000, 3000);
    this.subTitle.fadeOut = false;
  }


  /** === incializa las escenas con lo necesario ===  */
  private createScenes() {
    // niveles del juego 
    const primerNivel = new Scene(this.canvasRef, this.ctx, this.particleSystem);
    primerNivel.add(this.playerShip);
    this.sceneManager = new SceneManager(this.canvasRef, this.ctx, primerNivel);

    // segundo nivel
    //const segundoNivel = new Scene(this.canvasRef, this.ctx, this.particleSystem);
    //this.sceneManager.addScene(segundoNivel);

    //establecemos el segundo nivel como el actual para prueba 
    //this.sceneManager.setCurrentScene(0);

    this.playerShip.addParticleSystem(this.particleSystem);
    this.playerShip.projectileWasCreated = (p) => { primerNivel.add(p) };

  }

  /** === el loop principal del juego se ejecuta cada frame */
  private loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  }

  /** velocidad de las estrellas en la animacion del inicio */
  starsAnimationSpeed = 10;

  /** === actualización de todo el juego moviento, disparo etc === */
  private update() {

    this.titleAnimation.update();
    this.subTitle.update();
    
    //solo actualiza los valores del viajes en las estrellas del menú cuando el juego no ha empezado
    if ( !this.hasTarted ) this.starsTravelAnimation.update(this.starsAnimationSpeed);

    //si no esta en pausa el juego sigue operando
    if (this.isPlaying) {
      const currentScene = this.sceneManager.getCurrentScene();
      if (currentScene) {
        currentScene.update();
      }
      this.particleSystem.update();
      
    }

  }

  /** === dibujado o renderizado de todo el juego === */
  private draw() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    // solo renderizamos las estrellas del menú cuando el juego no ha empezado
    if ( !this.hasTarted ) this.starsTravelAnimation.draw();

    this.titleAnimation.draw();
    this.subTitle.draw();
    //si no esta en pausa, renderiza
    if (this.isPlaying) {
      
      this.currentScene.draw();
      this.particleSystem.draw();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }


}