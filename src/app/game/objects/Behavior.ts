import { GameObject } from "./GameObject";
import { MovementPattern } from "../AI/MovePattern";

/**
 * esta clase es para agregar el "comportamiento" que es actualmente el movimiento automatico  
 */
export class ObjectWithBehavior extends GameObject {
    public speed: number = 0;

    /** patrón de movimiento */
    protected movementPattern: MovementPattern;

    /** repetir la secuencia de posiciones */
    public repeat: boolean = false;

    /** retardo entre cada posición (ms) */
    public delayBetweenPositions: number = 1000;

    constructor({
        x = 0,
        y = 0,
        radius = 0,
        speed = 0,
        positions = [],
        repeat = false,
        delayBetweenPositions = 1000
    }: {
        x?: number,
        y?: number,
        radius?: number,
        speed?: number,
        positions?: { x: number; y: number }[],
        repeat?: boolean,
        delayBetweenPositions?: number
    } = {}) {
        super({ x, y });
        this.radius = radius;
        this.speed = speed;
        this.repeat = repeat;
        this.delayBetweenPositions = delayBetweenPositions;

        // Inicializa MovementPattern
        this.movementPattern = new MovementPattern(positions, this.speed, this.delayBetweenPositions, this.repeat);
    }

    /** actualiza la posición usando el MovementPattern */
    public override update() {
        super.update();
        this.movementPattern.updatePosition(this);
    }

}