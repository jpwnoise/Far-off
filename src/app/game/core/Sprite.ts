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

    draw(ctx: CanvasRenderingContext2D, x: number, y: number, degrees: number = 0) {
        const centerX = x + this.width / 2;
        const centerY = y + this.height / 2;
        const radians = degrees * (Math.PI / 180); // convertir a radianes

        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.rotate(radians);
        ctx.drawImage(
            this.image,
            -this.width / 2,
            -this.height / 2,
            this.width,
            this.height
        );
        ctx.restore();
    }
}
