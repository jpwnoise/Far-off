import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Ship } from './objects/Ship';
import { InputHandler } from './core/InputHandler';
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

  /** === toggle para el play ===*/
  start(){
    this.primerNivel.playMusic();
    this.isPlaying = true;
    this.hasTarted = true;
  }
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
    this.playerShip = new Ship({ x: 200, y: 550, radius: 20, speed: 5 });
  } //fin constructor 

  primerNivel!:Scene; 

  playerShip!:Ship; 

  enemies:Enemy[] = [];

  currentHittedEnemy: Enemy | null = null;

  /** === cuando en el enemigo lanza disparos estos tienen que se agregados a la escena para que funcionen las colisiones en ellos */
  addEnemiesAndProjectilesToScene(){
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
    })
  }

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.sceneManager = new SceneManager(this.canvasRef,this.ctx);
    this.primerNivel = new Scene(this.canvasRef,this.ctx);
    this.particleSystem = new ParticleSystem(this.ctx);
    this.addEnemiesAndProjectilesToScene()
    this.backgroundCreator = new BackgroundCreator({canvasRef:this.canvasRef, ctx: this.ctx});
    this.playerShip.particlesSystem = this.particleSystem;
    this.primerNivel.add(this.playerShip);
    this.playerShip.projectileWasCreated = (p)=>{ this.primerNivel.add(p) };
    this.loop();
  }

  private loop = () => {
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop);
  }

  /** === dibujado o renderizado de todo el juego === */
  private draw() {
    const canvas = this.canvasRef.nativeElement;
    //si no esta en pausa, renderiza
    if (this.isPlaying) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      this.backgroundCreator.drawBackground();
      this.primerNivel.draw();
      this.particleSystem.draw();
    }
  }

  /** === actualización de todo el juego moviento, disparo etc === */
  private update() {
    //si no esta en pausa el juego sigue operando
    if (this.isPlaying) {
      this.primerNivel.update()
      this.particleSystem.update();
    }

    this.backgroundCreator.update();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }
}