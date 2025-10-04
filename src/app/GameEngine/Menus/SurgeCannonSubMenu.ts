import { Border, SurgeCannonOption } from "./Interfaces";
import { TextTools } from "./TextTools";
import { ScreenFlash } from "../Animation/ScreenFlash";
import { MovingText } from "../Animation/MovingText";

export class SurgeCannonSubMenu extends TextTools {

    // ... (Propiedades de la clase, getters, constructor, loadOptions, previosOption, nextOption se mantienen igual) ...

    /** las coordenadas de la primera opcion */
    private readonly firstOptionLocation = { x: 300, y: 200 };

    private ctx: CanvasRenderingContext2D;
    private surgeCannons: SurgeCannonOption[] = [];
    screenFlashAnim:ScreenFlash; 

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

    /** el color calculado para el selector */
    get selectorColor() {
        return `rgba(20,0,120,${this.globalOpacity * 0.5 * this.selectOpacityProgress})`;
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

    movingText:MovingText

    constructor(ctx: CanvasRenderingContext2D) {
        super();
        this.ctx = ctx;
        this.loadOptions();
        this.screenFlashAnim = new ScreenFlash(ctx);
        this.movingText = new MovingText(ctx,{x:1300,y:50});
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
            this.activateLinesAnim();
            this.optionTextFadeIn();
            this.selectorFadeIn()
        }
    }
    
    /** selecciona la siguiente opcion en el menu */
    nextOption() {
        if (this.selectorPosition < this.surgeCannons.length - 1) {
            this.selectorPosition++;
            this.activateLinesAnim();
            this.optionTextFadeIn();
            this.selectorFadeIn()
        }
    }

    //activa la animacion de las lineas 
    activateLinesAnim(){
        this.verticalHeightProgress = 0;
        this.firstLineAnim = true; 
        this.secondLineAnim = true; 
        this.verticalLineAnim = true; 
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

    //ANIMACIONES DE OPACIDAD PARA EL TEXTO  
    runTextFadeInFlag = false; 

    //es necesario llamar esta funcion para inicializar la animacion 
    private optionTextFadeIn(){
        this.runTextFadeInFlag = true; 
        this.textOpacityProgress = 0; 
        this.textTimeAcc = .5;
    }

    textTimeAcc = .5; 

    //en 1 por defecto (visible)
    textOpacityProgress = 1;
    textOpacityAnimDuration = 1; 

    // acualiza el valor de la opacidad del texto 
    updateTextOpacity(deltatime:number){
        if (this.runTextFadeInFlag){
            this.textTimeAcc += deltatime;
            this.textOpacityProgress = this.textTimeAcc / this.textOpacityAnimDuration;
            if (this.textOpacityProgress >= 1){
                this.textOpacityProgress = 1;
                this.runTextFadeInFlag = false; 
            }
        }

    }

    /** * Valida si la opcion a dibujar es la que tiene el selector.
     * Calcula el color animado de brillo/oscurecimiento.
     * // la opacidad puede estar manipulada en la transicion del menu o solo or fade de seleccion  por eso tiene la multiplicacion
     */
    textOptionColor(indexOption: number): string {

        // Color base si no está seleccionada
        if (indexOption !== this.selectorPosition) {
            return `rgba(${this.optionBaseColor.r},${this.optionBaseColor.g},${this.optionBaseColor.b},${this.globalOpacity*.5} )`; 
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
                     ${this.globalOpacity * this.textOpacityProgress})`;
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
            const color = this.textOptionColor(index);
            ctx.fillStyle =  color;
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
        return `rgba(${r}, ${g}, ${b}, ${this.globalOpacity * this.selectOpacityProgress})`;
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
                this,this.imgDescwidthProgress = this.secondLineFinalWith;
                this.secondLineAnim = false; 
            }
        }

    }

    // bandera para activar la animacion vertical 
    verticalLineAnim = false;
    verticalLineTimeAcc = 0; 
    verticalHeightProgress = 0;
    finalHeight = 200;

    // actualiza gradualmente la altura de la tercera linea 
    updateVerticalHeight(deltatime:number){
        if (this.verticalLineAnim){
            this.verticalLineTimeAcc += deltatime; 
            const timeProgress = this.verticalLineTimeAcc / this.movimgLineAnimDuration; 
            this.verticalHeightProgress = timeProgress * this.finalHeight; 
            if (this.verticalLineTimeAcc >= this.movimgLineAnimDuration){
                this.verticalLineTimeAcc = 0;
                this.verticalHeightProgress = this.finalHeight; // aseguras valor final estable
                this.verticalLineAnim = false; 
            }
        }

    }

    /** actualiza cada frame la opacidad de el selector  */
    selectOpacityProgress = 0;
    timeSelectOpacityAcc = 0; 
    selectFadeInFlag = false;

    // activa la animación fadein del selector 
    selectorFadeIn(){
        this.selectFadeInFlag = true; 
        this.timeSelectOpacityAcc = 0; 
        this.selectOpacityProgress = 0; 
    }

    //cuando cambiamos de opcion hacemos un fade en el selector 
    updateSelectorOpacity(delta:number){
        if (this.selectFadeInFlag){
            this.timeSelectOpacityAcc += delta;
            this.selectOpacityProgress = this.timeSelectOpacityAcc / .5; 
            if (this.selectOpacityProgress >= .5){
                this.selectOpacityProgress = .5; 
                this.selectFadeInFlag = false; 
            }
        }
    }


    /** la opcion seleccionada */
    optionSelected:number = -1; 

    /** ===== SELECCIONAR LA OPCION ACTUAL =====*/
    selectCurrentOption(){
        // si estas seleccionando la opcion que ya esta seleccionada no aplicamos animaciones etc...
        if (this.optionSelected === this.selectorPosition) return; 

        this.optionSelected = this.selectorPosition;

        // activamos la animacion del borde
        this.runBorderWidthGrowAnim();

        this.screenFlashAnim.runFlashAnimation();

        const selectedWeapon = this.surgeCannons[this.selectorPosition]
        const text = `${selectedWeapon.name} selected`; 
        this.movingText.setText(text); 
        this.movingText.playAnim();
    }

    /** el grosor del borde de la seleccion  */
    selectionBorderWidth = 0;

    //** bandera para ejecutar la actualización del borde */
    runWidthGrowing = false;

    /** funcion para activar la animación del border de la seleccion */
    private runBorderWidthGrowAnim(){
        this.runWidthGrowing = true; 
    }

    /** acumulador de tiempo (avance de animación) */
    growingAcc = 0; 

    /** actualiza los valores de la anchura cada frame */
    updateSelectionWidth(delta:number){
        const finalWidth = 6;
        const animDuration = .125; 
        if (this.runWidthGrowing){
            this.growingAcc += delta;
            const timeProgress = this.growingAcc / animDuration; 
            this.selectionBorderWidth = timeProgress * finalWidth; 
            if (this.growingAcc >= animDuration){ // un segundo de animacion 
                this.growingAcc = 0; 
                this.runWidthGrowing = false; //detenemos la animacion 
                this.selectionBorderWidth = finalWidth; // aseguramos el valor para que no sea 6.31 o algo asi
            }
        }
    }

    /** dibuja el recuadro que indica que has seleccionado */
    drawSelectionBorder() {
        const optionIndex = this.optionSelected;

        // si no ha seleccionado nada no dibuja 
        if (optionIndex === -1) return;
        const ctx = this.ctx;
        const padding = 10;
        const x = this.firstOptionLocation.x - padding - 100;
        let y = this.firstOptionLocation.y + optionIndex * this.optionSpacing - this.fontSize + padding / 2;
        y -= 10;
        const width = this.borderOption.width + padding * 2;
        const height = this.borderOption.height;
        ctx.strokeStyle = 'red';
        ctx.lineWidth = this.selectionBorderWidth;// contiene el crecimiento
        ctx.fillStyle = 'rgba(255,0,0,.1)';
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);
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
        ctx.fillStyle = this.selectorColor;
        ctx.fillRect(x, y, width, height);
        ctx.strokeRect(x, y, width, height);

        //primera linea
        const offsetY = 25;
        const lineX = x + 220;
        ctx.beginPath();
        ctx.moveTo(lineX, y + offsetY);
        ctx.lineTo(lineX + this.widthProgress, y + offsetY);
        ctx.stroke();
        //ctx.closePath();
        
        //segunda linea 
        ctx.beginPath();
        ctx.moveTo(x + 460, y + offsetY);
        ctx.lineTo(x + 460 + this.imgDescwidthProgress, y + offsetY); // linea de la imagen hacia la tercera linea
        ctx.stroke();
        //ctx.closePath()
        
        // esta animacion solo es para la primera opion
        if (this.selectorPosition === 0){
            //tercera linea la vertical de arriba hacia abajo 
            ctx.beginPath();
            ctx.moveTo(x + 540, y + offsetY);
            ctx.lineTo(x + 540, y + offsetY + this.verticalHeightProgress);
            ctx.stroke();
            //ctx.closePath()
        }

        // esta animacion solo es para la primera opion
        if (this.selectorPosition === 1){
            
            ctx.beginPath();
            ctx.moveTo(x + 540, y + offsetY);
            ctx.lineTo(x + 550 + this.imgDescwidthProgress, y + offsetY );
            ctx.stroke();
            //ctx.closePath()
        }
        
        if (this.selectorPosition === 2){
            ctx.beginPath();
            ctx.moveTo(x + 540, y + offsetY);
            ctx.lineTo(x + 540, y + offsetY - this.verticalHeightProgress);
            ctx.stroke();
            //ctx.closePath();
        }

        
        ctx.beginPath();
        ctx.moveTo(730, 400);
        ctx.lineTo(730 + this.widthProgress , 400);
        ctx.stroke();
        //ctx.closePath();
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
        this._updateTextBlink(deltaTime);
        this._updateOpacityFade(deltaTime);
        this._updateSelectorColorBlink(deltaTime)
        this.updateNameToImageLineWidth(deltaTime);
        this.updateImageToDescWidth(deltaTime);
        this.updateVerticalHeight(deltaTime);
        this.updateTextOpacity(deltaTime);
        this.updateSelectorOpacity(deltaTime)
        this.updateSelectionWidth(deltaTime);
        this.screenFlashAnim.update(deltaTime);
        this.movingText.update(deltaTime); 
    }

    /** dibujado del menu de seleccion */
    draw() {
        if (this.globalOpacity > 0.01) {
            this.drawMainBorder();
            this.drawSelector();
            this.drawSelectionBorder();
            this.drawSurgeCannonOptions();
            this.drawBorderCannon();
            this.drawCannons();
            this.drawDescription();
            this.drawWindowTitle();
            this.screenFlashAnim.draw();
            this.movingText.draw(); 
        }
    }
}