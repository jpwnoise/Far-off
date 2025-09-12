import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Ship } from './objects/Ship';
import { TextAnimation } from './TextAnimation';
import { ParticleSystem } from './core/ParticleSystem';
import { AudioManager } from './core/AudioManager';
import { Enemy } from './objects/Enemy';
import { BackgroundCreator } from './objects/BackgroundCreator';
import { Stats } from './objects/Stats';
import { Scene, SceneManager } from './core/SceneManager';
import { enemiesLevel_1 } from './EnemiesLevel_1';

@Component({
  selector: 'app-game',
  templateUrl: './game.html',
  styleUrl: './game.sass'
})
export class Game implements AfterViewInit {

  enemiesLevel_1 = enemiesLevel_1; 
  sceneManager!:SceneManager;

  /** === controlando el estado de juego "jugando/pausado" ===*/
  isPlaying = false;
  hasTarted = false;
  isStartButtonPressed: boolean = false;

  start(){
    this.primerNivel.playMusic();
    this.titleAnimation.movementDirection = 'right';
    this.subTitle.movementDirection = 'left';
    this.titleAnimation.fadeOut = true;
    this.subTitle.fadeOut = true;

    setTimeout(() => {
      this.isPlaying = true;
      this.hasTarted = true;
      this.addEnemiesAndProjectilesToScene();
    }, 4000);
  }
  
  /** === toggle para el play ===*/
  playPause() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying){
      this.primerNivel.audioManager.resume();
    }else {
      this.primerNivel.audioManager.pause();
    }
  }

  private ctx!: CanvasRenderingContext2D;
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private particleSystem!: ParticleSystem;
  private backgroundCreator!: BackgroundCreator;

  // ===== Enemy con MovePattern y Shooter =====
  private animationId: number = 0;
  public enemyHudVisible = false;

  constructor() {
    this.playerShip = new Ship({ x: 665 , y: 450 , radius: 20, speed: 5 });
  } //fin constructor 

  primerNivel!:Scene; 

  playerShip!:Ship; 

  currentHittedEnemy: Enemy | null = null;

  private titleAnimation!: TextAnimation;
  private subTitle!: TextAnimation;

  
  /** === se implementa el metodo de angular para cuando los elementos fueron renderizados ===  */
  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.titleAnimation = new TextAnimation(this.ctx,'Far-off','50px', { r: 255, g: 255, b: 255 }, 0, 0, 8000, 0);
    this.titleAnimation.fadeOut = false;
    
    this.subTitle = new TextAnimation(this.ctx,'El silencio del abismo', '25px', { r: 255, g: 0, b: 0 }, 0, 40, 8000, 3000);
    this.subTitle.fadeOut = false; 
    

    //=== se agrega un fondo negro para ubicar el área del canvas ===
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.sceneManager = new SceneManager(this.canvasRef,this.ctx);
    this.primerNivel = new Scene(this.canvasRef,this.ctx);
    this.particleSystem = new ParticleSystem(this.ctx);
    this.backgroundCreator = new BackgroundCreator({canvasRef:this.canvasRef, ctx: this.ctx});
    this.playerShip.addParticleSystem(this.particleSystem);
    this.primerNivel.add(this.playerShip);
    this.playerShip.projectileWasCreated = (p)=>{ this.primerNivel.add(p) };
    this.loop();
  }

  

  /** === el loop principal del juego se ejecuta cada frame */
  private loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  }

  
  /** === actualización de todo el juego moviento, disparo etc === */
  private update() {

    this.titleAnimation.update(); 
    this.subTitle.update();

    //si no esta en pausa el juego sigue operando
    if (this.isPlaying) {
      this.primerNivel.update()
      this.particleSystem.update();
      this.backgroundCreator.update();
    }
    
  }

  /** === dibujado o renderizado de todo el juego === */
  private draw() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.titleAnimation.draw();
    this.subTitle.draw(); 
    //si no esta en pausa, renderiza
    if (this.isPlaying) {
      this.backgroundCreator.drawBackground();
      this.primerNivel.draw();
      this.particleSystem.draw();
    }
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }

  /** === cuando en el enemigo lanza disparos estos tienen que se agregados a la escena para que funcionen las colisiones en ellos */
  addEnemiesAndProjectilesToScene(){
    setTimeout(()=>{
      this.enemiesLevel_1.forEach(e=>{
        e.projectileWasCreated = (p)=>{ this.primerNivel.add(p) };
        e.ctx = this.ctx; 
        e.particlesSystem = this.particleSystem;
        e.wasHittedHandler = (stats)=>{
          this.enemyHudVisible = true;
          this.currentHittedEnemy = e;
          setTimeout(()=>{
            this.enemyHudVisible = false;
          }, 1000)
        }
        this.primerNivel.add(e);
      })//for each
    }, 20000)
  }

}