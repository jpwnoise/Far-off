import { Border, SurgeCannonOption } from "./Interfaces";
import { TextTools } from "./TextTools";

export class SurgeCannonSubMenu extends TextTools {

    // ... (Propiedades de la clase, getters, constructor, loadOptions, previosOption, nextOption se mantienen igual) ...

    /** las coordenadas de la primera opcion */
    private readonly firstOptionLocation = { x: 300, y: 200 };

    private ctx: CanvasRenderingContext2D;
    private surgeCannons: SurgeCannonOption[] = [];

    /** el espacio entre cada opción */
    private readonly optionSpacing = 200;

    /** el tamaño de la fuente de las opciones */
    private readonly fontSize = 20;

    // --- PROPIEDADES DE ANIMACIÓN DE OPACIDAD ---
    private globalOpacity = 0;
    public opacityAnimationState: 'none' | 'in' | 'out' = 'none';
    private timeElapsedOpacityAnim = 0;
    private readonly timeOpacityAnimacion = 0.25; //s

    // --- TAMAÑO DE LAS IMAGENES DE LOS CAÑONES 
    cannonWidth = 150;
    cannonHeight = 150;

    // --- PROPIEDADES DE ANIMACIÓN DE BRILLO/PARPADEO PARA EL TEXTO DEL SELECTOR ---
    optionBaseColor = { r: 200, g: 200, b: 255 };
    blinkTimeAnim = 1; // 1 segundo para ir de oscuro a brillante o viceversa
    textOptionAnimState: 'brighter' | 'darker' = 'brighter';
    private textAnimTimeElapsed = 0; // Acumulador de tiempo
    private readonly maxLightnessIncrease = 55; // Cuánto se añade a los canales RGB
    // --------------------------------------------------

    // --- PROPIEDADES DE ANIMACIÓN DE COLOR DEL SELECTOR ---

    /** Acumulador de tiempo para la animación del color del selector */
    private selectorColorTimeElapsed = 0;

    /** Duración de una fase (ej. de color base a color animado) */
    private readonly selectorColorBlinkDuration = 1; // este es el tiempo por fase 

    /** Controla si el selector debe aumentar o disminuir la intensidad del color */
    private selectorColorAnimState: 'brighter' | 'darker' = 'brighter';

    /** El valor máximo de cambio de color (ej. cuántos puntos RGB se añaden o restan) */
    private readonly maxColorChange = 70;

    // --- FIN PROPIEDADES DE COLOR DEL SELECTOR ---

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

    // La lógica correcta que ya definimos
    private _updateSelectorColorBlink(deltaTime: number) {
        // 1. Acumular el tiempo transcurrido
        this.selectorColorTimeElapsed += deltaTime;

        // 2. Verificar si la fase actual de animación ha terminado
        if (this.selectorColorTimeElapsed >= this.selectorColorBlinkDuration) {

            // 3. Si terminó, cambiamos el estado (para invertir la animación)
            this.selectorColorAnimState = (this.selectorColorAnimState === 'brighter') ? 'darker' : 'brighter';

            // 4. Resetear el tiempo para empezar la nueva fase
            this.selectorColorTimeElapsed %= this.selectorColorBlinkDuration;
        }
    }


    /** dibuja las opciones de las armas secundarias */
    drawSurgeCannonOptions() {
        const ctx = this.ctx;
        const offsetX = 0;
        this.surgeCannons.forEach((cannon, index) => {
            ctx.fillStyle = this.textOptionColor(index); // Usa la función de color
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
            ctx.drawImage(cannon.image, this.firstOptionLocation.x + offsetX, positionY, this.cannonWidth, this.cannonHeight);
        });

        ctx.restore();
    }

    /** Maneja la lógica de acumulación de tiempo y cambio de estado para el efecto de brillo. */
    private _updateTextBlink(deltaTime: number) {
        this.textAnimTimeElapsed += deltaTime;

        // Verifica si la fase actual de animación (brighter o darker) ha terminado
        if (this.textAnimTimeElapsed >= this.blinkTimeAnim) {
            // Si terminó, cambiamos el estado y reseteamos el tiempo para la nueva fase
            this.textOptionAnimState = (this.textOptionAnimState === 'brighter') ? 'darker' : 'brighter';
            this.textAnimTimeElapsed = 0;
        }
    }

    /** Maneja la lógica de progresión y cambio de estado para el Fade In/Out del menú. */
    private _updateOpacityFade(deltaTime: number) {
        if (this.opacityAnimationState === 'none') {
            // Retorna si ya terminó el fade y la opacidad está en un extremo
            if (this.globalOpacity === 0 || this.globalOpacity === 1) return;
        }

        this.timeElapsedOpacityAnim += deltaTime;

        let progress = this.timeElapsedOpacityAnim / this.timeOpacityAnimacion;
        progress = Math.min(1, Math.max(0, progress)); // Limitar entre 0 y 1

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

    // Nuevo método para calcular el color animado del selector
    private get selectorAnimatedColor(): string {
        // 1. Calcular el progreso (siempre entre 0 y 1 para la fase actual)
        let progress = this.selectorColorTimeElapsed / this.selectorColorBlinkDuration;

        // Usaremos el color del selector principal (mainColor) como base.
        // El mainColor es `rgba(100, 0, 200, opacidad)`.
        const baseR = 100;
        const baseG = 0;
        const baseB = 200;

        let currentChange: number;

        if (this.selectorColorAnimState === 'brighter') {
            // Fase Brighter: el cambio de color va de 0 a maxColorChange
            currentChange = progress * this.maxColorChange;
        } else { // 'darker'
            // Fase Darker: el cambio de color va de maxColorChange a 0
            currentChange = this.maxColorChange - (progress * this.maxColorChange);
        }

        // Aplicamos el cambio al canal de color que queremos enfatizar (ej. Rojo/R)
        // También aplicamos un cambio menor a los otros canales para un efecto de "resplandor".
        const r = Math.round(baseR + currentChange);
        const g = Math.round(baseG + currentChange * 0.2); // Cambio menor en verde
        const b = Math.round(baseB + currentChange * 0.5); // Cambio moderado en azul

        // 2. Devolvemos el color animado con la opacidad global
        return `rgba(${r}, ${g}, ${b}, ${this.globalOpacity})`;
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

    // PROPIEDADES DE ANIMACION PARA LAS LINEAS DE LAS OPCIONES (NOMBRE A IMAGEN - IMAGEN A DESCRIPCION)

    /**el ancho final que tendra la linea */
    nameToImagefinalWidth = 90;

    /** el ancho temporal mientras se anima */
    nameToImageProgressWidth = 0; //s 

    /** el acumulador de tiempo */
    private movingLineTimeAcumulator = 0;

    /** duracion de la animacion  */
    private movimgLineAnimDuration = .5;

    /** bandera para activar la animacion  */
    firstLineAnim = false;

    /** anchura actual  */
    widthProgress = 0;

    /** actualiza en cada frame el ancho de la linea */
    updateNameToImageLineWidth(deltaTime: number) {
        //si activaron la bandera 
        if (this.firstLineAnim) {
            this.movingLineTimeAcumulator += deltaTime;
            const timeProgress = this.movingLineTimeAcumulator / this.movimgLineAnimDuration;
            this.widthProgress = timeProgress * this.nameToImagefinalWidth;

            // si ya llego al final de la anima reseteamos y desactivamos la anim
            if (this.movingLineTimeAcumulator >= this.movimgLineAnimDuration) {
                this.movingLineTimeAcumulator = 0;
                this.firstLineAnim = false;
            }
        }
    }

    /** anchura actual  */
    imgDescwidthProgress = 0;

    secondLineTimeAcumulator = 0; 

    secondLineFinalWith = 80; 

    secondLineAnim = false;

    //actualiza los valores de la anchura para animar la linea
    updateImageToDescWidth(deltaTime:number){
        if (this.secondLineAnim) {
            this.secondLineTimeAcumulator += deltaTime; 
            const timeProgress = this.secondLineTimeAcumulator / this.movimgLineAnimDuration;
            this.imgDescwidthProgress = timeProgress * this.secondLineFinalWith;
            if (this.secondLineTimeAcumulator >= this.movimgLineAnimDuration){
                this.secondLineTimeAcumulator = 0; 
                this.secondLineAnim = false; 
            }
        }

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
        ctx.strokeStyle = this.selectorAnimatedColor;
        ctx.lineWidth = this.borderOption.borderWidth;
        ctx.fillStyle = this.bgColor;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);

        //primera linea
        const offsetY = 25;
        const lineX = x + 220;
        ctx.beginPath();
        ctx.moveTo(lineX, y + offsetY);
        ctx.lineTo(lineX + this.widthProgress, y + offsetY);
        ctx.stroke();
        ctx.closePath()
        
        //segunda linea 
        ctx.beginPath();
        ctx.moveTo(x + 460, y + offsetY);
        ctx.lineTo(x + 460 + this.imgDescwidthProgress, y + offsetY); // linea de la imagen hacia la tercera linea
        ctx.stroke();
        ctx.closePath()

        //ctx.lineTo(x + 540, 400);
        //ctx.lineTo(x + 630, 400);

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
        const y = 50;
        ctx.textAlign = 'center';
        ctx.fillText(title, canvasWidth / 2, y);
    }

    /** dibuja una linea del nombre del cañon hacia la imagen */
    drawLine(startX: number, startY: number, endX: number, endY: number, color: string, width: number = 3) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    // === funciones globales 

    /** El método update ahora solo llama a sus submétodos, manteniéndose limpio y enfocado. */
    update(deltaTime: number) {
        // 1. Lógica del bucle de brillo del texto (siempre en ejecución)
        this._updateTextBlink(deltaTime);

        // 2. Lógica de Fade In/Out
        this._updateOpacityFade(deltaTime);

        // actualización del selector
        this._updateSelectorColorBlink(deltaTime)

        this.updateNameToImageLineWidth(deltaTime);

        this.updateImageToDescWidth(deltaTime);
    }

    /** dibujado del menu de seleccion */
    draw() {
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