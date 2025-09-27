import { ElementRef } from "@angular/core";
import { AudioManager } from "../core/AudioManager";
import { InputHandler } from "../core/InputHandler";
import { BackgroundCreator } from "../objects/BackgroundCreator";

/** menu donde elijes la nave y su surge weapon */
export class ShipAndWeaponMenu {
    private ctx: CanvasRenderingContext2D;
    private audioManager = new AudioManager();
    private inputHandler = new InputHandler();
    private backgroundCreator: BackgroundCreator;

    /** el borde por defecto para la opción */
    borderOption: Border = {
        width: 150,
        height: 50,
        color: 'white',
        borderWidth: 3,
        backgroundColor: 'rgba(0,0,0,.5)'
    }

    constructor(ctx: CanvasRenderingContext2D, canvas: ElementRef<HTMLCanvasElement>) {
        this.ctx = ctx;
        this.loadOptions();
        this.backgroundCreator = new BackgroundCreator({ canvasRef:canvas, ctx: this.ctx, stars: true, celestialBodies: true });
    }

    //** bandera de inicalizacion */
    initialized: boolean = false;

    //** permite la ejecucion del update y del draw  */
    init() {
        if (this.initialized) return;
        this.initialized = true;
    }

    /**carga las opciones de naves y armas */
    loadOptions() {
        this.ships = [
            {
                name: 'Interceptor',
                description: 'A fast and agile ship, perfect for quick maneuvers and hit-and-run tactics.',
                imageSrc: 'assets/images/ships/interceptor.png'
            },
            {
                name: 'Destroyer',
                description: 'A heavily armored ship with powerful weapons, ideal for taking on large enemy fleets.',
                imageSrc: 'assets/images/ships/destroyer.png'
            },
            {
                name: 'Cruiser',
                description: 'A balanced ship with a mix of speed, armor, and firepower, suitable for various combat scenarios.',
                imageSrc: 'assets/images/ships/cruiser.png'
            }
        ];
        this.surgeCannons = [
            {
                name: 'Plasma Cannon',
                description: 'Fires concentrated plasma bolts that deal high damage to single targets.',
                imageSrc: 'assets/images/weapons/plasma_cannon.png'
            },
            {
                name: 'Laser Beam',
                description: 'Emits a continuous laser beam that can cut through multiple enemies in a line.',
                imageSrc: 'assets/images/weapons/laser_beam.png'
            },
            {
                name: 'Missile Launcher',
                description: 'Launches homing missiles that track and explode upon impact with enemies.',
                imageSrc: 'assets/images/weapons/missile_launcher.png'
            }
        ]
    }

    /** todas las opciones de naves */
    ships: ShipOption[] = []

    /** la nave selccionada  */
    shipSelected: number = 0;

    /** todos los surge cannons */
    surgeCannons: SurgeCannonOption[] = []

    /** el surge cannon seleccionado */
    surgeCannonSelected: number = 0;

    /** la posicion del borde que funciona como selector  */
    selectorPosition: number = 0;


    /** "ventana" visible por defecto 
     * por ventana me refiero a la seccion del menu que se esta viendo
     * por defecto es la de naves
     *  */
    currentWindow: 'ships' | 'weapons' = 'ships';

    /** cambia a la ventana de naves solo si esta en la de armas secundarias */
    showShipWindow() {

    }

    /** cambia a la ventana de armas secundarias solo si esta en la de naves */
    showWeaponWindow() { }

    /** dibujamos un cuadro que contendra visualmente al menú */
    drawMainBorder() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const mainBorder: Border = {
            width: canvasWidth * 0.8,
            height: canvasHeight * 0.8,
            color: 'white',
            borderWidth: 5,
            backgroundColor: 'rgba(0,0,0,.7)'
        }
        const x = (canvasWidth - mainBorder.width) / 2;
        const y = (canvasHeight - mainBorder.height) / 2;
    }


    /** actualizacion de datos del menu */
    update() {
        if (!this.initialized) return;
        this.checkInput();
        this.backgroundCreator.update();
    }

private inputRepeatDelay = 300; // ms antes de empezar a repetir
private inputRepeatRate = 100;  // ms entre repeticiones
private inputState: Record<string, { firstPress: number; lastRepeat: number }> = {};

checkInput() {
  const now = Date.now();

  ['s', 'w'].forEach(key => {
    if (this.inputHandler.isPressed(key)) {
      const state = this.inputState[key] ?? { firstPress: now, lastRepeat: 0 };
      const timeHeld = now - state.firstPress;
      const timeSinceLast = now - state.lastRepeat;

      if (
        timeHeld < this.inputRepeatDelay && state.lastRepeat === 0 ||
        timeHeld >= this.inputRepeatDelay && timeSinceLast >= this.inputRepeatRate
      ) {
        if (key === 's') this.nextOption();
        if (key === 'w') this.previosOption();
        this.inputState[key] = {
          firstPress: state.firstPress,
          lastRepeat: now
        };
      } else {
        this.inputState[key] = state;
      }
    } else {
      delete this.inputState[key]; // reset when released
    }
  });

  if (this.inputHandler.isPressed('d')) this.showWeaponWindow();
  if (this.inputHandler.isPressed('a')) this.showShipWindow();
}



    /** selecciona la opcion anterior en el menu */
    previosOption() {
        if (this.currentWindow === 'ships' && this.selectorPosition > 0) {
            this.selectorPosition--;
        }
        else if (this.currentWindow === 'weapons' && this.selectorPosition > 0) {
            this.selectorPosition--;
        }
    }

    /** selecciona la siguiente opcion en el menu */
    nextOption() {
        if (this.currentWindow === 'ships' && this.selectorPosition < this.ships.length - 1) {
            this.selectorPosition++;
        }
        else if (this.currentWindow === 'weapons' && this.selectorPosition < this.surgeCannons.length - 1) {
            this.selectorPosition++;
        }
    }

    /** dibula el selector de la opcion que puede ser seleccionada */
    drawSelector() {
        const ctx = this.ctx;
        const padding = 10;
        const x = this.firstOptionLocation.x - padding;
        const y = this.firstOptionLocation.y + this.selectorPosition * this.optionSpacing - this.fontSize + padding / 2;
        const width = this.borderOption.width + padding * 2;
        const height = this.borderOption.height;
        ctx.strokeStyle = this.borderOption.color;
        ctx.lineWidth = this.borderOption.borderWidth;
        ctx.fillStyle = this.borderOption.backgroundColor;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    /** las coordenadas de la primera opcion */
    private readonly firstOptionLocation = {
        x: 100,
        y: 100
    }

    /** el espacio entre cada opción */
    private readonly optionSpacing = 200;

    /** el tamaño de la fuente de las opciones */
    private readonly fontSize = 20;

    /**dibujamos las opciones */
    drawOptions() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        /**dibujamos las opciones de las naves */
        this.ships.forEach((ship, index) => {
            ctx.fillStyle = 'white';
            ctx.font = `${this.fontSize}px Audiowide`;
            ctx.fillText(ship.name, this.firstOptionLocation.x, this.firstOptionLocation.y + index * this.optionSpacing);
        });
    }


    /** dibuja el menu */
    draw() {

        if (!this.initialized) return;

        //fondo animado
        this.backgroundCreator.draw();

        //el borde principal del menu
        this.drawMainBorder();

        //las opciones
        this.drawOptions();

        //el selector
        this.drawSelector();

    }

}

/** la info de la nave */
interface ShipOption {
    name: string;
    description: string;
    imageSrc: string;
}

/** la info del arma secundnaria */
interface SurgeCannonOption {
    name: string;
    description: string;
    imageSrc: string;
}

/** el tipo de borde que rodea la opcion */
interface Border {
    width: number;
    height: number;
    color: string;
    borderWidth: number;
    backgroundColor: string;
}
