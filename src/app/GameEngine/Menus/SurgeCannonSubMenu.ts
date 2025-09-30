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

    // --- PROPIEDADES DE ANIMACIÓN DE OPACIDAD ---

    /** la opacidad global del menu de armas secundarias */
    private globalOpacity = 0;

    /** Define el estado de la animación: 'none' (estático), 'in' (aparecer), o 'out' (desaparecer) */
    public opacityAnimationState: 'none' | 'in' | 'out' = 'none';

    /** el tiempo transcurrido desde que comenzó la animación de opacidad */
    private timeElapsedOpacityAnim = 0;

    /** el tiempo que dura la animacion de opacidad en segundos */
    private readonly timeOpacityAnimacion = 0.25; //s

    // --- PROPIEDADES DE ANIMACIÓN DE BRILLO/PARPADEO ---
    optionBaseColor = { r: 200, g: 200, b: 255 };
    blinkTimeAnim = 1; // 1 segundo para ir de oscuro a brillante o viceversa
    textOptionAnimState: 'brighter' | 'darker' = 'brighter'; 
    private textAnimTimeElapsed = 0; // Acumulador de tiempo
    private readonly maxLightnessIncrease = 55; // Cuánto se añade a los canales RGB
    // --------------------------------------------------

    private get mainColor() { return `rgba(100,0,200,${this.globalOpacity})` }

    get bgColor() { 
        return `rgba(20,0,120,${this.globalOpacity * 0.5})`;
    }

    /** la posicion del borde que funciona como selector  */
    selectorPosition: number = 0;
    borderOption: Border = {
        width: 200,
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
                description: 'Fires concentrated plasma bolts\nthat deal high damage to single targets.',
                imageSrc: 'Sprites/Cannons/PlasmaCannon.png'
            },
            {
                name: 'Laser Beam',
                description: 'Emits a continuous laser beam\nthat can cut through multiple enemies in a line.',
                imageSrc: 'Sprites/Cannons/LaserBeam.png'
            },
            {
                name: 'Missile Launcher',
                description: 'Launches homing missiles that track\nand explode upon impact with enemies.',
                imageSrc: 'Sprites/Cannons/MissileLauncher.png'
            }
        ];
        this.surgeCannons.forEach((cannon) => {
            const img = new Image();
            img.src = cannon.imageSrc;
            img.onload = (e) => {
                cannon.image = e.target as HTMLImageElement;
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
        if (this.selectorPosition < this.surgeCannons.length - 1) {
            this.selectorPosition++;
        }
    }

    // --- MÉTODOS DE CONTROL DE ANIMACIÓN DE OPACIDAD ---

    public startFadeIn() {
        if (this.opacityAnimationState !== 'in') {
            this.opacityAnimationState = 'in';
            this.timeElapsedOpacityAnim = this.globalOpacity * this.timeOpacityAnimacion;
        }
    }

    public startFadeOut() {
        if (this.opacityAnimationState !== 'out') {
            this.opacityAnimationState = 'out';
            this.timeElapsedOpacityAnim = (1 - this.globalOpacity) * this.timeOpacityAnimacion;
        }
    }


    /** * Valida si la opcion a dibujar es la que tiene el selector.
     * Calcula el color animado de brillo/oscurecimiento.
     * ! La lógica de estado del brillo se maneja en 'update'.
     */
    textOptionColor(indexOption: number): string {
        if (indexOption !== this.selectorPosition) {
            // Color base si no está seleccionada
            return `rgba(${this.optionBaseColor.r},
                          ${this.optionBaseColor.g},
                          ${this.optionBaseColor.b},
                          ${this.globalOpacity})`;
        }

        // 1. Calcula el progreso (siempre entre 0 y 1 para la fase actual)
        let progress = this.textAnimTimeElapsed / this.blinkTimeAnim;
        
        let currentLightness: number;

        if (this.textOptionAnimState === 'brighter') {
            // Fase Brighter: va de 0 a maxLightnessIncrease
            currentLightness = progress * this.maxLightnessIncrease;
        } else { // 'darker'
            // Fase Darker: va de maxLightnessIncrease a 0
            currentLightness = this.maxLightnessIncrease - (progress * this.maxLightnessIncrease);
        }

        // Devolvemos el color animado (usando Math.round para colores enteros)
        return `rgba(${Math.round(this.optionBaseColor.r + currentLightness)},
                     ${Math.round(this.optionBaseColor.g + currentLightness)},
                     ${Math.round(this.optionBaseColor.b + currentLightness)},
                     ${this.globalOpacity})`;
    }


    /** dibuja las opciones de las armas secundarias */
    drawSurgeCannonOptions() {
        const ctx = this.ctx;
        const offsetX = 0; 
        this.surgeCannons.forEach((cannon, index) => {
            ctx.fillStyle = this.textOptionColor(index); // Usa la función de color corregida
            ctx.font = `${this.fontSize}px Audiowide`;
            ctx.fillText(cannon.name, this.firstOptionLocation.x + offsetX, this.firstOptionLocation.y + index * this.optionSpacing);
        });
    }

    /** dibuja el arma secundaria que esta en el selector */
    drawCannons() {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalAlpha = this.globalOpacity; 

        const offsetX = 200;
        this.surgeCannons.forEach((cannon, index) => {
            if (!cannon.image) return;
            const positionY = (this.firstOptionLocation.y + index * 200) - 100;
            ctx.drawImage(cannon.image, this.firstOptionLocation.x + offsetX, positionY, 150, 150);
        });

        ctx.restore();
    }

    // --- BUCLE DE ACTUALIZACIÓN (MOTOR DE ANIMACIÓN) ---

    update(deltaTime: number) {
        
        // --- 1. Lógica de ANIMACIÓN DE BRILLO (Parpadeo) ---
        // Acumulamos el tiempo. Esta es la clave para la progresión
        this.textAnimTimeElapsed += deltaTime;
        
        // Verifica si la fase actual de animación (brighter o darker) ha terminado
        if (this.textAnimTimeElapsed >= this.blinkTimeAnim) {
            // Si terminó, cambiamos el estado y reseteamos el tiempo para la nueva fase
            this.textOptionAnimState = (this.textOptionAnimState === 'brighter') ? 'darker' : 'brighter';
            this.textAnimTimeElapsed = 0; 
        }

        // --- 2. Lógica de ANIMACIÓN DE OPACIDAD (Fade In/Out) ---
        if (this.opacityAnimationState === 'none') {
             // Si el fade terminó, solo retornamos si la opacidad está en un extremo (0 o 1)
             // Esto permite que el brillo del texto continúe si el fade ya terminó.
             if (this.globalOpacity === 0 || this.globalOpacity === 1) return;
        }

        this.timeElapsedOpacityAnim += deltaTime;

        let progress = this.timeElapsedOpacityAnim / this.timeOpacityAnimacion;
        progress = Math.min(1, Math.max(0, progress));

        if (this.opacityAnimationState === 'out') {
            this.globalOpacity = 1 - progress;
            if (progress >= 1) {
                this.globalOpacity = 0;
                this.opacityAnimationState = 'none'; 
            }
        } else if (this.opacityAnimationState === 'in') {
            this.globalOpacity = progress;
            if (progress >= 1) {
                this.globalOpacity = 1;
                this.opacityAnimationState = 'none'; 
            }
        }
    }

    // --- MÉTODOS DE DIBUJO ---
    
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
            backgroundColor: `rgba(0,0,0,${this.globalOpacity * .7})`
        }
        const x = (canvasWidth - mainBorder.width) / 2;
        const y = (canvasHeight - mainBorder.height) / 2;
        ctx.strokeStyle = mainBorder.color;
        ctx.lineWidth = mainBorder.borderWidth;
        ctx.fillStyle = mainBorder.backgroundColor;
        ctx.fillRect(x, y, mainBorder.width, mainBorder.height);
        ctx.strokeRect(x, y, mainBorder.width, mainBorder.height);
    }

    /** dibula el selector de la opcion que puede ser seleccionada */
    drawSelector() {
        const ctx = this.ctx;
        const padding = 10;
        const x = this.firstOptionLocation.x - padding - 100;
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

    /** dibuja la descripcion del cañon */
    drawDescription() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const canvasHeight = ctx.canvas.height;
        const description = this.surgeCannons[this.selectorPosition].description;
        
        ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(820, 350, 550, 100);

        ctx.fillStyle = `rgba(200,200,255,${this.globalOpacity})`;
        ctx.font = `20px Audiowide`;
        this.drawMultilineText(ctx, description, canvasWidth / 2 + 300, canvasHeight / 2, 25);
    }

    /** dibuja el borde que rodea a un cañon */
    drawBorderCannon() {
        const ctx = this.ctx;
        const y = (this.firstOptionLocation.y + this.selectorPosition * 200) - 100;
        const offsetX = 200;
        const w = 150;;
        const x = this.firstOptionLocation.x + offsetX;
        const cannonImage = this.surgeCannons[this.selectorPosition];
        const h = 150;
        if (!cannonImage.image) return;
        ctx.strokeStyle = this.mainColor;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(x, y, w, h);
    }

    /** dibuja el titulo de la ventana actual */
    drawWindowTitle() {
        const ctx = this.ctx;
        const canvasWidth = ctx.canvas.width;
        const title = 'Select your Surge Cannon'
        ctx.fillStyle = this.mainColor;
        ctx.font = '30px Audiowide';
        // const textMetrics = ctx.measureText(title); // No necesario para centrado simple
        const y = 50;
        ctx.textAlign = 'center';
        ctx.fillText(title, canvasWidth / 2, y);
    }


    /** dibujado del menu de seleccion */
    draw() {
        // Solo dibujamos si hay opacidad para mejorar el rendimiento.
        if (this.globalOpacity > 0.01) {
            this.drawMainBorder();
            this.drawSelector();
            this.drawSurgeCannonOptions();
            this.drawBorderCannon();
            this.drawCannons();
            this.drawDescription();
            this.drawWindowTitle();
        }
    }
}