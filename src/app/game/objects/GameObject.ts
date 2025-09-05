import { ElementRef } from "@angular/core";
import { SquareColliderManager } from "../core/SquareCollider";

/** === todos los objetos tiene coordenadas (x,y) === */
export class GameObject {
    public static id: number = 0;
    public x: number = 0;
    public y: number = 0;
    public radius?: number = 0; // opcional
    public identifier: number;
    public canvas!: ElementRef<HTMLCanvasElement>;
    ctx!: CanvasRenderingContext2D;
    squareColliderManager!:SquareColliderManager;

    constructor({ x = 0, y = 0, radius }: { x?: number; y?: number; radius?: number } = {}) {
        this.x = x;
        this.y = y;
        if (radius) this.radius = radius;
        this.identifier = GameObject.id++;
    }

    /** === las cosas cambiantes entre cada frame ==?*/
    update(){

    }

    /** === renderizado === */
    draw(){

    }
}
