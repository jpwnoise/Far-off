import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Ship } from './objects/Ship';
import { InputHandler } from './core/InputHandler';
import { ParticleSystem } from './core/ParticleSystem';
import { AudioManager } from './core/AudioManager';
import { Enemy } from './objects/Enemy';
import { BackgroundCreator } from './objects/BackgroundCreator';
import { Stats } from './objects/Stats';
import { Scene, SceneManager } from './core/SceneManager';

@Component({
  selector: 'app-game',
  templateUrl: './game.html',
  styleUrl: './game.sass'
})
export class Game implements AfterViewInit {

  sceneManager!:SceneManager;
  /** === controlando el estado de juego "jugando/pausado" ===*/
  isPlaying = true;

  /** === toggle para el play ===*/
  playPause() {
    this.isPlaying = !this.isPlaying;
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

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.sceneManager = new SceneManager(this.canvasRef,this.ctx);
    this.primerNivel = new Scene(this.canvasRef,this.ctx);
    
    this.particleSystem = new ParticleSystem(this.ctx);
    this.backgroundCreator = new BackgroundCreator({canvasRef:this.canvasRef, ctx: this.ctx});
    this.playerShip.particlesSystem = this.particleSystem;
    this.primerNivel.add(this.playerShip);
    const enemy = new Enemy({
      x:50, 
      y:0, 
      radius:50, 
      speed: 5, 
      positions:[
        {x:50,y:50},
        {x:300,y:50},
        {x:50,y:50},
        {x:400,y:200},
        {x:500,y:50}, 
        {x:650,y:300}], 
        repeat:true, 
        delayBetweenPositions:1000 });
    enemy.projectileWasCreated = (p)=>{ this.primerNivel.add(p)}
    this.primerNivel.add(enemy);
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
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }
}