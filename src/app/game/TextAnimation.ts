export class TextAnimation {

    private ctx: CanvasRenderingContext2D;
    public text: string;
    public offsetY: number;
    public offsetX: number;
    public textSize: string;
    private delay: number;         // retraso en ms
    private elapsedDelay: number;  // tiempo acumulado desde creación
    public color: { r: number, g: number, b: number };
    public fadeIn = true;
    public fadeOut = true;
    public movementDirection: 'left' | 'right' | 'top' | 'bottom' | null = null;

    constructor(
        ctx: CanvasRenderingContext2D,
        text = '',
        textSize = '50px',
        color = { r: 255, g: 255, b: 255 },
        offsetX = 0,
        offsetY = 0,
        duration = 4000,
        delay = 0) {
        this.ctx = ctx;
        this.lastUpdate = Date.now();
        this.text = text;
        this.offsetY = offsetY;
        this.textSize = textSize;
        this.animDuration = duration;
        this.delay = delay;
        this.elapsedDelay = 0;
        this.color = color;
        this.offsetX = offsetX;
    }

    alpha: number = 0;
    forwards = true;
    finalized = false;
    animDuration: number //duración de la animación en ms
    lastUpdate: number;
    maxAlphaValue = 1;
    minAlphaValue = 0;


    update() {
        this.fadeAnim();
        if (!this.movementDirection != null){
            this.movementAnimation();
        }
    }

    lastUpdateMovement = Date.now();
    animDurationMovement = 6000;

    movementAnimation() {
    if (this.finalized) return;

    const now = Date.now();
    const deltaTime = now - this.lastUpdateMovement;

    // actualizar lastUpdateMovement
    this.lastUpdateMovement = now;

    // manejamos el delay
    if (this.elapsedDelay < this.delay) {
        this.elapsedDelay += deltaTime;
        return;
    }

    const speed = (this.ctx.canvas.width / 2) / this.animDurationMovement;

    switch (this.movementDirection) {
        case 'left':
            this.offsetX -= speed * deltaTime;
            break;
        case 'right':
            this.offsetX += speed * deltaTime;
            break;
        case 'top':
            this.offsetY -= speed * deltaTime;
            break;
        case 'bottom':
            this.offsetY += speed * deltaTime;
            break;
    }
}


    /** fade in and fade out del texto con delay */
    fadeAnim() {
        if (this.finalized) return;

        const now = Date.now();
        const deltaTime = now - this.lastUpdate;
        this.lastUpdate = now;

        // primero acumulamos tiempo de delay
        if (this.elapsedDelay < this.delay) {
            this.elapsedDelay += deltaTime;
            return; // no hacemos fade hasta que pase el delay
        }

        // velocidad de alpha por ms
        const alphaSpeed = deltaTime / (this.animDuration / 2);

        if (this.forwards && this.fadeIn) {
            this.alpha += alphaSpeed;
            if (this.alpha >= this.maxAlphaValue) {
                this.alpha = this.maxAlphaValue;
                this.forwards = false;
            }
        } else if (this.fadeOut) {
            this.alpha -= alphaSpeed;
            if (this.alpha <= this.minAlphaValue) {
                this.alpha = this.minAlphaValue;
                this.finalized = true;
            }
        }
    }

    /** dibuja el texto */
    draw() {
        this.ctx.font = `${this.textSize} Audiowide`;
        this.ctx.fillStyle = `rgba(${this.color.r},${this.color.g},${this.color.b},${this.alpha})`
        const centerX = this.ctx.canvas.width / 2 + this.offsetX;
        const centerY = this.ctx.canvas.height / 2 + this.offsetY;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "middle";
        this.ctx.shadowColor = `rgba(${this.color.r},${this.color.g},${this.color.b},0.8)`;
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.fillText(this.text, centerX, centerY);
    }

}
