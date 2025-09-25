import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { StartMenu } from '../GameEngine/Menus/StartMenu';
import { Scene, SceneManager } from '../GameEngine/core/SceneManager';
import { ParticleSystem } from '../GameEngine/core/ParticleSystem';
import { createFirstScene } from '../GameEngine/Scenes/First Scene/FirstScene';
import { createSecondScene } from '../GameEngine/Scenes/Second Scene/SecondScene';
import { Enemy } from '../GameEngine/objects/Enemy';
import { Ship } from '../GameEngine/objects/Ship';

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

  constructor(private cd: ChangeDetectorRef) { }

  /**Se nececita referencia al jugador para mostrar el HUD*/
  public player: Ship | null = null; 

  /** contiene los objetos a ser actualizados y dibujados por el loop del juego */
  private objects: GameEngineObject[] = [];

  /** el enemigo actual que esta recibiendo daño */
  public currentEnemyAttacked: Enemy | null = null;
  public enemyHudTransition = false; 

  // Propiedad para el tiempo del último fotograma
  private lastTime: number = 0;

  /** el maximo del HUD del enemigo en pixeles 
   * el cual será calculado con un % del tamaño del canvas para mantener la proporción cuando el canvas cambie
  */
  maxHudWidth:number = 0;

  /** obtienes la proporción de HUD
   *  esto para hacer lo siguiente:
   *  los enemigos con mas vida o mas resistentes como los jefes 
   *  tienen barras de vida mas largas 
   *  y los mas debiles barras mas pequeñas 
  */
  get currentEnemyHudWidth(): number {
    if (!this.currentEnemyAttacked) return 0;

    const vidaMax = this.currentEnemyAttacked.stats.maxHealth;
    // Ajusta la escala según la vida máxima (por ejemplo, enemigos más fuertes = barra más larga)
    // Aquí puedes definir tu fórmula de proporcionalidad
    const factor = vidaMax / 100; // ejemplo: si vidaMax = 200 -> factor = 2
    const width = Math.min(this.maxHudWidth, factor * 100);
    return width;
  }

  /** inicializaciones ya cuando los elementos son visibles  */
  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.maxHudWidth = canvas.width * .8; // el tamaño maximo del hud del enemigo mas grande 
    const ctx = canvas.getContext('2d')!;
    const particleSystem = new ParticleSystem(ctx);

    const firstScene = createFirstScene(this.canvasRef, ctx, particleSystem);
    const sceneManager = new SceneManager(this.canvasRef, ctx, firstScene);
    this.objects.push(sceneManager);

    const secondScene = createSecondScene(this.canvasRef, ctx, particleSystem);
    sceneManager.addScene(secondScene);
    sceneManager.setCurrentScene(1);

    //obtenemos la referencia a la nave del jugador de la escena actual
    sceneManager.getCurrentScene().gameObjects.forEach((e)=>{
      if (e instanceof Ship){
        this.player = e; 
        this.cd.detectChanges(); //actualizamos la vista para que el HUD del jugador sepa que la nave ya fue creada
      }
    })

    //asignamos la función que establece el actualizador del enemigo atacado 
    //esto para visualizar la vida del enemigo en el juego 
    sceneManager.getCurrentScene().gameObjects.forEach((obj) => { if (obj instanceof Enemy) { obj.wasHittedHandler = ()=>{this.setEnemy(obj)} } });
    
    //se agrega particleSystem por que tambien necesita ser actualizado y dibujado 
    this.objects.push(particleSystem);
    const startMenu = new StartMenu(ctx);
    this.objects.push(startMenu);
    
    // Se inicializa el loop sin pasar el contexto
    this.loop();
  }
  
  //establecemos el enemigo que fue golpeado
  setEnemy(obj:Enemy){
    this.currentEnemyAttacked = obj;
    this.enemyHudTransition = true;
    setTimeout(()=>{
      this.enemyHudTransition = false;
    }, 1000)
  }

  playPause() { }

  /**inicio del juego */
  start() {

    //para activar animaciones 
    this.hasTarted = true;

    //cambiar entre el menu y la escena 
    this.finalAnimAndDestroyMenu(() => {
      this.objects.forEach(e => {
        if (e instanceof SceneManager) {
          e.getCurrentScene().init();
          this.isStartButtonPressed = true;
        }
      });
    });
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

  /** inicia la animacion final antes de liberar la memoria del mismo */
  finalAnimAndDestroyMenu(onDestroy: () => void) {
    this.objects.forEach((e) => {
      if (e instanceof StartMenu) {
        e.startMenuMovement();
      }
    });

    //la animacion dura 4 segundos por eso el delay en la destruccion 
    setTimeout(() => {
      this.objects = this.objects.filter((e) => !(e instanceof StartMenu));
      onDestroy();
    }, 4000);
  }

}