/**  clase para crear un flash o un destello  de toda la pantalla */ 
export class ScreenFlash {
    private ctx:CanvasRenderingContext2D; 
    constructor(ctx:CanvasRenderingContext2D){
        this.ctx = ctx;
    }

    /** opacidad del flash  */
    private flashOpacity = 0;

    // === manda a ejecutar la animacion de flash 
    runFlashAnimation(){
        this.animState = 'in';
    }

    public duration = .0625; 

    //acumulador de tiempo
    private timeAcc = 0; 

    //estado de animacion 
    private animState: 'in' | 'out' | 'none' = 'none'; 

    private readonly maxOpacity = .5; 

    fadeIn(delta:number){
            this.timeAcc += delta; 
            const timeProgress = this.timeAcc / this.duration;
            this.flashOpacity = timeProgress * this.maxOpacity; 
            if (this.timeAcc >= this.duration){
                this.animState = 'out'; //del fade in pasamos al fadeout 
                this.timeAcc = 0; 
            }
    }

    fadeOut(delta:number){
            this.timeAcc += delta; 
            const timeProgress = this.timeAcc / this.duration;
            this.flashOpacity = this.maxOpacity - ( timeProgress * this.maxOpacity); 
            if (this.timeAcc >= this.duration){
                this.animState = 'none'; //paramos la animacion
                this.timeAcc = 0; 
            }
    }

    //actualiza los valores cada frame 
    updateFlash(delta:number){
        if (this.animState === 'in'){
            this.fadeIn(delta); 
        }

        if (this.animState === 'out'){
            this.fadeOut(delta);
        }
    }

    // === FUNCIONES GLOBALES PARA ANIMACION  ===       
    update(deltaTime:number){
        this.updateFlash(deltaTime);
    }

    drawFlash(){
        const w = this.ctx.canvas.width; 
        const h = this.ctx.canvas.height; 
        const x = 0; 
        const y = 0; 
        const ctx = this.ctx; 
        ctx.fillStyle = `rgba(255,255,255,${this.flashOpacity})`;
        ctx.fillRect(x, y, w, h);

    }

    draw(){
        this.drawFlash(); 
    }
}