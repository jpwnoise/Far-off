import { SpriteManager } from "../core/SpriteManager";

/** animacion de movimiento del fondo verticalmente */
export class SequencedBackground {
    spriteManager: SpriteManager;
    ctx: CanvasRenderingContext2D;

    // Propiedad para la velocidad en pixeles por segundo
    pixelsPerSecond: number;
    // Propiedad para el tiempo del último fotograma
    private lastTime: number = 0;

    constructor(ctx: CanvasRenderingContext2D, pixelsPerSecond: number = 100) {
        this.ctx = ctx;
        this.spriteManager = new SpriteManager();
        this.getLength();
        this.pixelsPerSecond = pixelsPerSecond; // Velocidad en pixeles/segundo
    }

    wayPos = 0;
    lengthMax: number = 0;
    getLength() {
        this.lengthMax = this.spriteManager.sprites.length * this.ctx.canvas.height;
    }

    // El método update ahora recibe deltaTime
    update(deltaTime: number) {
        // Movimiento hacia abajo
        this.wayPos += this.pixelsPerSecond * deltaTime;

        // Reinicia cuando un sprite completo salió de pantalla
        if (this.wayPos >= this.ctx.canvas.height) {
            this.wayPos -= this.ctx.canvas.height;
            this.spriteManager.nextSprite();
        }
    }

    draw() {
        const currentSprite = this.spriteManager.getCurrentSprite();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = 1;
        this.ctx.imageSmoothingEnabled = false;
        // Restablece las propiedades de la sombra a sus valores predeterminados
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0)'; // Un color transparente


        if (currentSprite) {
            // Redondear wayPos a entero
            const posY = Math.floor(this.wayPos);
            const nextPosY = posY - currentSprite.height;

            // Sprite actual
            this.ctx.drawImage(currentSprite.image, 0, posY, currentSprite.width, currentSprite.height );

            // Siguiente sprite arriba
            const nextSprite = this.spriteManager.sprites[(this.spriteManager.currentIndex + 1) % this.spriteManager.sprites.length];
            this.ctx.drawImage(nextSprite.image, 0, nextPosY, nextSprite.width, nextSprite.height );
        }
    }


}