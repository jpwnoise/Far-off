import { Star } from "../../interfaces/Star";
import { ElementRef } from "@angular/core";

export class BackgroundCreator {

    canvasRef: ElementRef<HTMLCanvasElement> | null;
    ctx: CanvasRenderingContext2D | null;

    constructor({
        canvasRef = null,
        ctx = null }: {
            canvasRef?: ElementRef<HTMLCanvasElement> | null,
            ctx?: CanvasRenderingContext2D | null
        }) {
        this.canvasRef = canvasRef;
        this.ctx = ctx;
    }

    private stars: Star[] = [];
    private numStars = 150;

    /** ===  crea "estrellas" (puntos blancos en la negrura del espacio) === */
    public initStars() {
        this.validateCanvas();
        const canvas = this.canvasRef.nativeElement;
        for (let i = 0; i < this.numStars; i++) {
            const star = {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.5 + 0.1,
                color: 'white'
            }
            const halo = this.createStarHalo(star);
            this.stars.push(halo)
            this.stars.push(star);
        }
    }

    private createStarHalo(star: Star, size: number = 1.5): Star {
        const opacity = 0.7;
        // crear un nuevo objeto basado en star
        return {
            x: star.x,
            y: star.y,
            radius: star.radius * size,
            speed: star.speed,
            color: `rgba(255,255,200,${opacity})` // halo semi-transparente
        };
    }

    private validateCanvas(): asserts this is { canvasRef: ElementRef<HTMLCanvasElement> } {
        if (!this.canvasRef) {
            throw new Error('Es necesario el canvas para inicializar las estrellas');
        }
    }

    private validateCtx(): asserts this is { ctx: CanvasRenderingContext2D } {
        if (!this.ctx) {
            throw new Error('No se tiene el contexto 2d para renderizar el fondo')
        }
    }

    /** === metodo para dibujar el fondo en el canvas y el contexto dado === */
    public drawBackground() {
        this.validateCanvas();
        const canvas = this.canvasRef.nativeElement;
        this.validateCtx();
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);

        for (const star of this.stars) {
            this.ctx.fillStyle = star.color;
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fill();
            star.y += star.speed;
            if (star.y > canvas.height) {
                star.y = 0;
                star.x = Math.random() * canvas.width;
            }
        }
    }
}