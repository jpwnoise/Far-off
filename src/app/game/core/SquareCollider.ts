import { Game } from "../game";
import { GameObject } from "../objects/GameObject";

// Un solo rectángulo de colisión
export class SquareCollider {
    offsetX: number; // offset relativo al objeto
    offsetY: number;
    width: number;
    height: number;
    ctx!: CanvasRenderingContext2D;
    owner: GameObject;
    color:string;

    constructor(owner: GameObject, width: number, height: number, offsetX: number = 0, offsetY: number = 0, color:string = 'green') {
        this.owner = owner;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.width = width;
        this.height = height;
        this.color = color; 
    }

    validateCtx(): asserts this is { ctx: CanvasRenderingContext2D } {
        if (!(this.ctx instanceof CanvasRenderingContext2D)) {
            throw new Error("El contexto proporcionado no es un CanvasRenderingContext2D válido");
        }
    }

    // Obtiene las coordenadas absolutas según la posición del owner
    getAbsolute() {
        return {
            x: this.owner.x + this.offsetX,
            y: this.owner.y + this.offsetY,
            width: this.width,
            height: this.height
        };
    }

    // Dibuja el collider para debug
    draw() {
        this.validateCtx();
        const abs = this.getAbsolute();
        this.ctx.save();
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(abs.x, abs.y, abs.width, abs.height);
        this.ctx.restore();
    }

    // Si el owner se mueve, no hace falta update porque siempre calculamos desde owner.x/y
    update() {
        // En este diseño no es necesario, pero lo dejo por si quieres usarlo
    }
}


// Administra múltiples SquareCollider por objeto
export class SquareColliderManager extends GameObject {
    colliders: SquareCollider[] = [];

    addCollider(collider: SquareCollider) {
        this.colliders.push(collider);
    }

    /**  === Dibuja todos los colliders para debug === */
    override draw() {
        const color: string = 'red'
        super.draw();
        this.validateCtx();
        this.colliders.forEach((c) => { c.draw() })
    }

    validateCtx(): asserts this is CanvasRenderingContext2D {
        if (!(this.ctx instanceof CanvasRenderingContext2D)) {
            throw new Error("El contexto proporcionado no es un CanvasRenderingContext2D válido");
        }
    }
}