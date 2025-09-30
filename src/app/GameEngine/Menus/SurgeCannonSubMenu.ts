import { Border, SurgeCannonOption } from "./Interfaces";
import { TextTools } from "./TextTools";

export class SurgeCannonSubMenu extends TextTools {

    /** las coordenadas de la primera opcion */
    private readonly firstOptionLocation = { x: 300, y: 200 };

    private ctx: CanvasRenderingContext2D;
    private surgeCannons: SurgeCannonOption[] = [];

    /** el espacio entre cada opción */
    private readonly optionSpacing = 200;

    /** el tamaño de la fuente de las opciones */
    private readonly fontSize = 20;

    private globalOpacity = 0 //la opacidad del menu de armas secundarias;

    /** la posicion del borde que funciona como selector  */
    selectorPosition: number = 0;
    borderOption: Border = {
        width: 150,
        height: 50,
        color: 'white',
        borderWidth: 3,
        backgroundColor: 'rgba(0,0,0,.5)'
    }

    constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.loadOptions();
    }

    loadOptions() {
        this.surgeCannons = [
            {
                name: 'Plasma Cannon',
                description: 'Fires concentrated plasma bolts that deal high damage to single targets.',
                imageSrc: 'Sprites/Cannons/PlasmaCannon.png'
            },
            {
                name: 'Laser Beam',
                description: 'Emits a continuous laser beam that can cut through multiple enemies in a line.',
                imageSrc: 'Sprites/Cannons/LaserBeam.png'
            },
            {
                name: 'Missile Launcher',
                description: 'Launches homing missiles that track and explode upon impact with enemies.',
                imageSrc: 'Sprites/Cannons/MissileLauncher.png'
            }
        ];
        this.surgeCannons.forEach((cannon, index) => {
            const img = new Image();
            img.src = cannon.imageSrc;
            img.onload = (e) => {
                cannon.image = e.target as HTMLImageElement;
            }
        });
    }

    /** dibuja las opciones de las armas secundarias */
    drawSurgeCannonOptions() {
        const ctx = this.ctx;
        const offsetX = 0; // Desplazamiento horizontal para las opciones de armas
        this.surgeCannons.forEach((cannon, index) => {
            ctx.fillStyle = `rgba(200,200,255,${this.globalOpacity * 0.7})`;
            ctx.font = `${this.fontSize}px Audiowide`;
            ctx.fillText(cannon.name, this.firstOptionLocation.x + offsetX, this.firstOptionLocation.y + index * this.optionSpacing);
        });
    }

    /** la ultima vez que se actualizo la opacidad del menu de naves */
    private lastUpdateShipMenuOpacity = 0;

    /** el tiempo que dura la animacion de opacidad en ms */
    private readonly timeOpacityAnimacion = .25; //s

    /** bandera que indica si se debe ejecutar la animacion de opacidad */
    public runfadeIn = false;

    /** hace un fade in del menu de naves */
    fadeIn(deltaTime: number) {
        if (!this.runfadeIn) return;

        this.lastUpdateShipMenuOpacity += deltaTime;
        if (this.lastUpdateShipMenuOpacity >= this.timeOpacityAnimacion) {
            this.lastUpdateShipMenuOpacity = this.timeOpacityAnimacion;
        }
        const progress = this.lastUpdateShipMenuOpacity / this.timeOpacityAnimacion;
        this.globalOpacity = progress;
    }

    /** dibuja el arma secundaria que esta en el selector */
    drawCannons() {
        const ctx = this.ctx;
        this.surgeCannons.forEach((cannon, index) => {
            const image = new Image();
            if (!cannon.image) return;
            ctx.drawImage(cannon.image, 100 + index * 200, 400, 150, 150);
        });
    }

    update(deltaTime: number) {
        this.fadeIn(deltaTime);
    }

    draw() {
        this.drawSurgeCannonOptions();
        this.drawCannons();
    }
}