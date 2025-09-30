import { ElementRef } from "@angular/core";
import { AudioManager } from "../core/AudioManager";
import { InputHandler } from "../core/InputHandler";
import { BackgroundCreator } from "../objects/BackgroundCreator";
import { Border, SurgeCannonOption } from "./Interfaces";
import { ShipSelectionSubMenu } from "./ShipSelectionSubMenu";
import { SurgeCannonSubMenu } from "./SurgeCannonSubMenu";

/** menu donde elijes la nave y su surge weapon */
export class ShipAndWeaponMenu {
    private ctx: CanvasRenderingContext2D;
    private audioManager = new AudioManager();
    private inputHandler = new InputHandler();
    private backgroundCreator: BackgroundCreator;
    private shipSelectionSubMenu;
    private surgeCannonSubMenu;

    /** color para el selector y el fondo del ship  */
    private readonly bgColor = `rgba(0,0,120,${.3})`;
    private readonly brColor = `rgba(40,40,150,)${.5})`;

    constructor(ctx: CanvasRenderingContext2D, canvas: ElementRef<HTMLCanvasElement>) {
        this.ctx = ctx;
        this.backgroundCreator = new BackgroundCreator({ canvasRef: canvas, ctx: this.ctx, stars: true, celestialBodies: true });
        this.shipSelectionSubMenu = new ShipSelectionSubMenu(this.ctx);
        this.surgeCannonSubMenu = new SurgeCannonSubMenu(this.ctx);   
    }

    //** bandera de inicalizacion */
    initialized: boolean = false;

    //** permite la ejecucion del update y del draw  */
    init() {
        if (this.initialized) return;
        this.initialized = true;
    }

    /** la nave selccionada  */
    shipSelected: number = 0;

    /** el surge cannon seleccionado */
    surgeCannonSelected: number = 0;

    /** "ventana" visible por defecto 
     * por ventana me refiero a la seccion del menu que se esta viendo
     * por defecto es la de naves
     *  */
    currentWindow: 'ships' | 'weapons' = 'ships';

    /** cambia a la ventana de naves solo si esta en la de armas secundarias */
    showShipWindow() {

    }
    
    /** la opacidad del menu de armas secundarias */
    private readonly weaponMenuOpacity = 0;

    /** cambia a la ventana de armas secundarias solo si esta en la de naves */
    showWeaponWindow() {
        /** para mostrar el menu de armas hacemos fadeOut para ocultar el menu de naves  */
        this.shipSelectionSubMenu.runOpaciyAnimacion = true;
        this.surgeCannonSubMenu.runfadeIn = true;

        console.log('cambiando a menu de armas');
     }

    /** dibuja el titulo de la ventana actual */
    drawWindowTitle() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const title = this.currentWindow === 'ships' ? 'Select Your Ship' : 'Select Your Weapon';
        ctx.fillStyle = this.brColor;
        ctx.font = '30px Audiowide';
        const textMetrics = ctx.measureText(title);
        const y = 50;
        ctx.textAlign = 'center';
        ctx.fillText(title, canvasWidth / 2, y);
    }

    /** dibujamos un cuadro que contendra visualmente al menú */
    drawMainBorder() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const mainBorder: Border = {
            width: canvasWidth * 0.8,
            height: canvasHeight * 0.8,
            color: this.brColor,
            borderWidth: 5,
            backgroundColor: 'rgba(0,0,0,.7)'
        }
        const x = (canvasWidth - mainBorder.width) / 2;
        const y = (canvasHeight - mainBorder.height) / 2;
        ctx.strokeStyle = mainBorder.color;
        ctx.lineWidth = mainBorder.borderWidth;
        ctx.fillStyle = mainBorder.backgroundColor;
        ctx.fillRect(x, y, mainBorder.width, mainBorder.height);
        ctx.strokeRect(x, y, mainBorder.width, mainBorder.height);
    }


    /** actualizacion de datos del menu */
    update(deltaTime: number) {
        if (!this.initialized) return;
        this.checkInput();
        this.backgroundCreator.update();

        /** solo se anima si la bandera esta activada */
        this.shipSelectionSubMenu.fadeOut(deltaTime); 
        this.surgeCannonSubMenu.update(deltaTime);
    }


    /** para manejar la entrada del usuario con repeticion al mantener presionada una tecla */
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

    previosOption() {
        this.shipSelectionSubMenu.previosOption();
    }
    
    /** selecciona la opcion anterior en el menu */
    nextOption() {
        if (this.currentWindow === 'ships') {
            this.shipSelectionSubMenu.nextOption();
        }
    }

    


    /** dibuja el menu */
    draw() {

        if (!this.initialized) return;

        //fondo animado
        this.backgroundCreator.draw();

        this.drawWindowTitle();

        //el borde principal del menu
        this.drawMainBorder();

        this.shipSelectionSubMenu.draw();

        this.surgeCannonSubMenu.draw();
    }
}