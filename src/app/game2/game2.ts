import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { StartMenu } from '../GameEngine/Menus/StartMenu';
import { Scene, SceneManager } from '../GameEngine/core/SceneManager';
import { ParticleSystem } from '../GameEngine/core/ParticleSystem';
import { Ship } from '../GameEngine/objects/Ship';

interface GameEngineObject {
  update: () => void;
  draw: () => void;
}
@Component({
  selector: 'app-game2',
  imports: [],
  templateUrl: './game2.html',
  styleUrl: './game2.sass'
})
export class Game2 implements AfterViewInit, OnDestroy {
  isPlaying: boolean = false;
  hasTarted: boolean = false;
  isStartButtonPressed: boolean = false;
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private animationId: number = 0;
  private objects: GameEngineObject[] = []


  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    
    const particleSystem = new ParticleSystem(ctx); 
    const firstScene = new Scene(this.canvasRef, ctx, particleSystem)
    const sceneManager = new SceneManager(this.canvasRef, ctx, firstScene);
    this.objects.push(sceneManager);

    const startMenu = new StartMenu(ctx);
    this.objects.push(startMenu);

    const playerShip = new Ship({ x: 665, y: 450, radius: 20, speed: 5 });
    playerShip.addParticleSystem(particleSystem);
    
    
    playerShip.projectileWasCreated = (p) => { firstScene.add(p) };
    firstScene.add(playerShip);
    this.loop(ctx);//debe ir al final
  }

  /** pausa y reanudación del juego  */
  playPause() {
  }

  /** == inicio del juego == */
  start() {
    this.finalAnimAndDestroyMenu(()=>{
      this.objects.forEach(e=>{
        if (e instanceof SceneManager){
          e.getCurrentScene().start = true; 
        }
      })
    });
  }

  //** inicio de la animación del menu  y posteriomente elimnamos el menú de los objetos a renderizar y a actualizar */
  finalAnimAndDestroyMenu(onDestroy:()=>void) {
    //se activa la animación del menú
    this.objects.forEach((e) => {
      if (e instanceof StartMenu) {
        e.startMenuMovement();
      }
    });

    setTimeout(()=>{
      //se activa la animación del menú
      this.objects = this.objects.filter((e) => !(e instanceof StartMenu) );
      onDestroy();
    }, 4000)
  }

  /** === el loop principal del juego se ejecuta cada frame */
  private loop(ctx: CanvasRenderingContext2D) {
    this.clearScreen(ctx);
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(this.loop.bind(this, ctx));
  }

  update() {
    this.objects.forEach((e) => { e.update() })
  }

  draw() {
    this.objects.forEach((e) => { e.draw() })
  }

  clearScreen(ctx: CanvasRenderingContext2D) {
    const canvas = this.canvasRef.nativeElement;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animationId);
  }

}