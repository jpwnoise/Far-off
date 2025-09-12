export class Sprite {
    public image: HTMLImageElement;
    public loaded: boolean = false;
    public x: number = 0;
    public y: number = 0;
    public width: number;
    public height: number;

    constructor(src: string, width: number, height: number) {
        this.image = new Image();
        this.image.src = src;
        this.width = width;
        this.height = height;

        this.image.onload = () => {
            this.loaded = true;
        };
    }

    draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    degrees: number = 0,
    tintColor: string | null = null // Parámetro para el color
) {
    if (!ctx) return;
    const centerX = x + this.width / 2;
    const centerY = y + this.height / 2;
    const radians = degrees * (Math.PI / 180);

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(radians);

    if (tintColor) {
        // === Técnica de tintado ===
        // 1. Crear un canvas temporal para manipular la imagen
        const offscreenCanvas = document.createElement('canvas');
        const offscreenCtx = offscreenCanvas.getContext('2d');
        offscreenCanvas.width = this.width;
        offscreenCanvas.height = this.height;

        if (offscreenCanvas !== null && offscreenCtx != null ){

            // 2. Dibujar la imagen original en el canvas temporal
            offscreenCtx.drawImage(this.image, 0, 0, this.width, this.height);
            
            // 3. Establecer el modo de composición
            offscreenCtx.globalCompositeOperation = 'source-atop';
            
            // 4. Dibujar un rectángulo con el color deseado
            offscreenCtx.fillStyle = tintColor;
            offscreenCtx.fillRect(0, 0, this.width, this.height);
            
            // 5. Dibujar el resultado en el canvas principal
            ctx.drawImage(offscreenCanvas, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        else {
            throw new Error('el canvas o el contexto son nulos')
        }

    } else {
        // === Si no hay color, dibujar la imagen normal ===
        ctx.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
    }
    
    ctx.restore();
}

}
