import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { StartMenu } from '../GameEngine/Menus/StartMenu';
import { Scene, SceneManager } from '../GameEngine/core/SceneManager';
import { ParticleSystem } from '../GameEngine/core/ParticleSystem';
import { createFirstScene } from '../GameEngine/Scenes/First Scene/FirstScene';
import { createSecondScene } from '../GameEngine/Scenes/Second Scene/SecondScene';

interface GameEngineObject {
  update: (deltaTime: number) => void;
  draw: (ctx: CanvasRenderingContext2D) => void;
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
  private objects: GameEngineObject[] = [];
  
  // Propiedad para el tiempo del último fotograma
  private lastTime: number = 0;

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const particleSystem = new ParticleSystem(ctx);

    const firstScene = createFirstScene(this.canvasRef, ctx, particleSystem);
    const sceneManager = new SceneManager(this.canvasRef, ctx, firstScene);
    this.objects.push(sceneManager);

    const secondScene = createSecondScene(this.canvasRef, ctx, particleSystem);
    sceneManager.addScene(secondScene);
    sceneManager.setCurrentScene(1);

    this.objects.push(particleSystem);
    const startMenu = new StartMenu(ctx);
    this.objects.push(startMenu);

    // Se inicializa el loop sin pasar el contexto
    this.loop();
  }

  playPause() {}

  start() {
    this.finalAnimAndDestroyMenu(() => {
      this.objects.forEach(e => {
        if (e instanceof SceneManager) {
          e.getCurrentScene().start = true;
        }
      });
    });
  }

  finalAnimAndDestroyMenu(onDestroy: () => void) {
    this.objects.forEach((e) => {
      if (e instanceof StartMenu) {
        e.startMenuMovement();
      }
    });

    setTimeout(() => {
      this.objects = this.objects.filter((e) => !(e instanceof StartMenu));
      onDestroy();
    }, 4000);
  }

  // === El loop principal del juego ===
  private loop = (currentTime: number = 0) => {
    // Si es el primer fotograma, se inicializa el tiempo
    if (this.lastTime === 0) {
      this.lastTime = currentTime;
    }
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    const ctx = this.canvasRef.nativeElement.getContext('2d')!;

    this.clearScreen(ctx);
    this.update(deltaTime);
    this.draw(ctx);
    
    // Aquí es donde se llama a requestAnimationFrame y se pasa el loop como callback
    this.animationId = requestAnimationFrame(this.loop);
  }

  update(deltaTime: number) {
    this.objects.forEach((e) => { e.update(deltaTime) });
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.objects.forEach((e) => { e.draw(ctx) });
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