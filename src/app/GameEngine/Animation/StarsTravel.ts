interface Star {
    x: number;
    y: number;
    z: number;
    pz: number;
}

export class StarsTravel {
    private ctx: CanvasRenderingContext2D;
    private stars: Star[] = [];
    private numStars = 600;

    constructor(ctx: CanvasRenderingContext2D) {
        this.ctx = ctx;
        this.createStars();
    }

    /** inicializamos estrellas en 3D */
    createStars() {
        const canvas = this.ctx.canvas;
        const w = canvas.width;
        const h = canvas.height;

        this.stars = [];
        for (let i = 0; i < this.numStars; i++) {
            this.stars.push({
                x: Math.random() * w - w / 2,
                y: Math.random() * h - h / 2,
                z: Math.random() * w,   // profundidad inicial
                pz: Math.random() * w   // profundidad previa
            });
        }
    }

    /** actualización de movimiento */
    update(speed: number = 20) {
        const w = this.ctx.canvas.width;
        const h = this.ctx.canvas.height;

        for (const star of this.stars) {
            star.z -= speed;

            if (star.z < 1) {
                // cuando pasa la cámara, reiniciamos atrás
                star.x = Math.random() * w - w / 2;
                star.y = Math.random() * h - h / 2;
                star.z = w;
                star.pz = star.z;
            }
        }
    }

    /** dibujar estrellas con efecto túnel */
    draw() {
        const canvas = this.ctx.canvas;
        const w = canvas.width;
        const h = canvas.height;
        const ctx = this.ctx;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, w, h);

        ctx.translate(w / 2, h / 2);

        for (const star of this.stars) {
            // proyección actual
            const sx = (star.x / star.z) * w;
            const sy = (star.y / star.z) * h;

            // proyección anterior (para estela)
            const px = (star.x / star.pz) * w;
            const py = (star.y / star.pz) * h;

            star.pz = star.z;

            // brillo proporcional a la cercanía
            const alpha = 1 - star.z / w;

            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            ctx.stroke();
        }

        ctx.resetTransform();
    }
}
