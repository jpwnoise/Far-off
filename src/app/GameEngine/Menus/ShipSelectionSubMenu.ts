import { Border, ShipOption, SurgeCannonOption } from "./Interfaces";
import { TextTools } from "./TextTools";

export class ShipSelectionSubMenu extends TextTools {
    private ctx: CanvasRenderingContext2D;

    /** el tamaño de la fuente de las opciones */
    private readonly fontSize = 20;

    /** la posicion del borde que funciona como selector  */
    selectorPosition: number = 0;

    /** el borde por defecto para la opción */
    borderOption: Border = {
        width: 150,
        height: 50,
        color: 'white',
        borderWidth: 3,
        backgroundColor: 'rgba(0,0,0,.5)'
    }

    constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.loadShips();
        this.ctx = ctx;
    }

    /** la opacidad del menu de naves */
    private shipMenuOpacity = 1;

    /** color para el selector y el fondo del ship  */
    get bgColor() {
        return `rgba(0,0,120,${this.shipMenuOpacity})`;
    }

    get mainColor() {
        return `rgba(40,40,150,${this.shipMenuOpacity * 0.5})`;
    }

    /** la ultima vez que se actualizo la opacidad del menu de naves */
    private lastUpdateShipMenuOpacity = 0;

    /** el tiempo que dura la animacion de opacidad en ms */
    private readonly timeOpacityAnimacion = .25; //s

    /** bandera que indica si se debe ejecutar la animacion de opacidad */
    public runOpaciyAnimacion = false;

    /** hace un fade out del menu de naves */
    fadeOut(deltaTime: number) {
        if (!this.runOpaciyAnimacion) return;

        this.lastUpdateShipMenuOpacity += deltaTime;
        if (this.lastUpdateShipMenuOpacity >= this.timeOpacityAnimacion) {
            this.lastUpdateShipMenuOpacity = this.timeOpacityAnimacion;
        }
        const progress = this.lastUpdateShipMenuOpacity / this.timeOpacityAnimacion;
        this.shipMenuOpacity = 1 - progress;
    }


    /** las coordenadas de la primera opcion */
    private readonly firstOptionLocation = {
        x: 300,
        y: 200
    }

    /** el espacio entre cada opción */
    private readonly optionSpacing = 200;

    /** todas las opciones de naves */
    ships: ShipOption[] = [
        {
            name: 'Interceptor',
            description: 'A fast and agile ship, perfect for quick maneuvers\nand hit-and-run tactics.',
            imageSrc: 'Sprites/PlayerShip/GraySpaceShip.png'
        },
        {
            name: 'Destroyer',
            description: 'A heavily armored ship with powerful weapons, ideal\nfor taking on large enemy fleets.',
            imageSrc: 'Sprites/PlayerShip/destroyer.png'
        },
        {
            name: 'Cruiser',
            description: 'A balanced ship with a mix of speed, armor, and firepower,\nsuitable for various combat scenarios.',
            imageSrc: 'Sprites/PlayerShip/nave cruiser 2.png'
        }
    ];

    loadShips() {
        this.ships.forEach((ship, index) => {
            const img = new Image();
            img.src = ship.imageSrc;
            img.onload = (e) => {
                ship.image = e.target as HTMLImageElement;
            }
        });
    }

    /** selecciona la opcion anterior en el menu */
    previosOption() {
        if (this.selectorPosition > 0) {
            this.selectorPosition--;
        }
    }

    /** selecciona la siguiente opcion en el menu */
    nextOption() {
        if (this.selectorPosition < this.ships.length - 1) {
            this.selectorPosition++;
        }
    }

    /** dibula el selector de la opcion que puede ser seleccionada */
    drawSelector() {
        const ctx = this.ctx;
        const padding = 10;
        const x = this.firstOptionLocation.x - padding - 70;
        let y = this.firstOptionLocation.y + this.selectorPosition * this.optionSpacing - this.fontSize + padding / 2;
        y -= 10;
        const width = this.borderOption.width + padding * 2;
        const height = this.borderOption.height;
        ctx.strokeStyle = this.mainColor;
        ctx.lineWidth = this.borderOption.borderWidth;
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
    }

    //** dibuja el borde que rodea a la nave en el centro del menu */
    drawShipBorder() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const border: Border = {
            width: 220,
            height: 220,
            color: 'white',
            borderWidth: 3,
            backgroundColor: this.bgColor
        }
        const x = (canvasWidth - border.width) / 2;
        const y = (canvasHeight - border.height) / 2;
        ctx.strokeStyle = this.mainColor;
        ctx.lineWidth = border.borderWidth;
        ctx.fillStyle = border.backgroundColor;
        ctx.fillRect(x, y, border.width, border.height);
        ctx.strokeRect(x, y, border.width, border.height);
    }


    /**dibujamos las opciones */
    drawOptions() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;

        /**dibujamos las opciones de las naves */
        this.ships.forEach((ship, index) => {
            ctx.fillStyle = `rgba(200,200,255,${this.shipMenuOpacity * 0.7})`;
            ctx.font = `${this.fontSize}px Audiowide`;
            ctx.fillText(ship.name, this.firstOptionLocation.x, this.firstOptionLocation.y + index * this.optionSpacing);
        });
    }

    /** dibuja la nave que está en el selector */
    drawShip() {
        const ctx = this.ctx;
        const image = this.ships[this.selectorPosition].image;
        if (!image) return;

        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const imageWidth = 200;
        const imageHeight = 200;

        const x = (canvasWidth - imageWidth) / 2;   // centrado horizontal
        const y = (canvasHeight - imageHeight) / 2; // centrado vertical

        ctx.save();
        ctx.globalAlpha = this.shipMenuOpacity;
        ctx.drawImage(image, x, y, imageWidth, imageHeight);
        ctx.restore();
    }

    /** dibuja la descripcion de la nave seleccionada */
    drawShipDescription() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        ctx.fillStyle = `rgba(200,200,255,${this.shipMenuOpacity})`;
        ctx.font = `20px Audiowide`;
        const description = this.ships[this.selectorPosition].description;
        this.drawMultilineText(ctx, description, canvasWidth / 2, canvasHeight * 0.75, 25);
    }

    /** dibujado del menu de seleccion */
    draw() {
        this.drawSelector();
        this.drawShipBorder();
        this.drawOptions();
        this.drawShip();
        this.drawShipDescription();
    }

}