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

    // --- Control de Opacidad y Animación ---

    /** la opacidad del menu de naves */
    private shipMenuOpacity = 1;

    /** Define el estado de la animación: 'none' (estático), 'in' (aparecer), o 'out' (desaparecer) */
    public opacityAnimationState: 'none' | 'in' | 'out' = 'none';

    /** color para el selector y el fondo del ship  */
    get bgColor() {
        // La opacidad en el color de fondo y el selector ahora se basa en shipMenuOpacity
        return `rgba(0,0,120,${this.shipMenuOpacity * 0.5})`; 
    }

    get mainColor() {
        return `rgba(40,40,150,${this.shipMenuOpacity})`;
    }

    /** el tiempo transcurrido desde que comenzó la animación de opacidad */
    private timeElapsedOpacityAnim = 0;

    /** el tiempo que dura la animacion de opacidad en segundos */
    private readonly timeOpacityAnimacion = 0.25; //s

    /** * Inicia la animación de desvanecimiento (Fade Out).
     * Esto es lo que llamarás desde tu clase externa.
     */
    startFadeOut() {
        if (this.opacityAnimationState !== 'out') {
            this.opacityAnimationState = 'out';
            // Setea el tiempo transcurrido para que la transición sea fluida
            // incluso si se llama startFadeOut antes de que termine startFadeIn
            this.timeElapsedOpacityAnim = (1 - this.shipMenuOpacity) * this.timeOpacityAnimacion;
            console.log('Iniciando Fade Out');
        }
    }

    /** * Inicia la animación de aparición (Fade In).
     * Esto es lo que llamarás desde tu clase externa.
     */
    startFadeIn() {
        if (this.opacityAnimationState !== 'in') {
            this.opacityAnimationState = 'in';
            // Setea el tiempo transcurrido para que la transición sea fluida
            this.timeElapsedOpacityAnim = this.shipMenuOpacity * this.timeOpacityAnimacion;
            console.log('Iniciando Fade In');
        }
    }

    // --- Lógica del Menú y Gráficos (sin cambios significativos) ---

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
        /**dibujamos las opciones de las naves */
        this.ships.forEach((ship, index) => {
            // Se usa shipMenuOpacity para controlar la visibilidad del texto
            ctx.fillStyle = `rgba(200,200,255,${this.shipMenuOpacity})`; 
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

        const x = (canvasWidth - imageWidth) / 2;
        const y = (canvasHeight - imageHeight) / 2;

        ctx.save();
        // Controlamos la opacidad global aquí
        ctx.globalAlpha = this.shipMenuOpacity; 
        ctx.drawImage(image, x, y, imageWidth, imageHeight);
        ctx.restore();
    }

    /** dibuja la descripcion de la nave seleccionada */
    drawShipDescription() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        // Usamos shipMenuOpacity
        ctx.fillStyle = `rgba(200,200,255,${this.shipMenuOpacity})`; 
        ctx.font = `20px Audiowide`;
        const description = this.ships[this.selectorPosition].description;
        this.drawMultilineText(ctx, description, canvasWidth / 2, canvasHeight * 0.75, 25);
    }
    /** dibuja el titulo de la ventana actual */
    drawWindowTitle() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const title = 'Select your Ship'
        ctx.fillStyle = this.mainColor;
        ctx.font = '30px Audiowide';
        const textMetrics = ctx.measureText(title);
        const y = 50;
        ctx.textAlign = 'center';
        ctx.fillText(title, canvasWidth / 2, y);
    }

    // --- Bucle de Actualización (El motor de la animación) ---

    update(deltaTime: number) {
        if (this.opacityAnimationState === 'none') {
            return;
        }

        // Aumentamos el tiempo transcurrido
        this.timeElapsedOpacityAnim += deltaTime;
        
        // Calculamos el progreso (siempre entre 0 y 1)
        let progress = this.timeElapsedOpacityAnim / this.timeOpacityAnimacion;
        progress = Math.min(1, Math.max(0, progress));

        if (this.opacityAnimationState === 'out') {
            // Fade Out: la opacidad va de 1 a 0
            this.shipMenuOpacity = 1 - progress;
            if (progress >= 1) {
                this.shipMenuOpacity = 0;
                this.opacityAnimationState = 'none';
            }
        } else if (this.opacityAnimationState === 'in') {
            // Fade In: la opacidad va de 0 a 1
            this.shipMenuOpacity = progress;
            if (progress >= 1) {
                this.shipMenuOpacity = 1;
                this.opacityAnimationState = 'none';
            }
        }
        
        // console.log(`Opacidad: ${this.shipMenuOpacity.toFixed(2)} | Estado: ${this.opacityAnimationState}`);
    }

    /** dibujamos un cuadro que contendra visualmente al menú */
    drawMainBorder() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const mainBorder: Border = {
            width: canvasWidth * 0.8,
            height: canvasHeight * 0.8,
            color: this.mainColor,
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

    /** dibujado del menu de seleccion */
    draw() {
        // Solo dibujamos si hay algo de opacidad. Esto ahorra ciclos.
        if (this.shipMenuOpacity > 0.01) { 
            this.drawSelector();
            this.drawShipBorder();
            this.drawMainBorder()
            this.drawOptions();
            this.drawShip();
            this.drawShipDescription();
            this.drawWindowTitle(); 
        }
    }
}