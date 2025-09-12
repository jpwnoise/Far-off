import { Proyectile } from "../objects/Proyectile";
import { GameObject } from "../objects/GameObject";
import { ParticleSystem } from "../core/ParticleSystem";

export class Shooter {
    private cooldown: number; // milisegundos entre disparos
    private lastShotTime: number = 0;
    private projectileSpeed: number;
    private projectileWidth: number;
    private projectileHeight: number;
    particleSystem!: ParticleSystem;

    constructor(cooldown: number = 1000, projectileSpeed: number = 5, projectileWidth: number = 4, projectileHeight: number = 10) {
        this.cooldown = cooldown;
        this.projectileSpeed = projectileSpeed;
        this.projectileWidth = projectileWidth;
        this.projectileHeight = projectileHeight;
    }

    canShoot(): boolean {
        return Date.now() - this.lastShotTime >= this.cooldown;
    }

    shoot(origin: GameObject): Proyectile | null {
        if (!this.canShoot()) return null;

        this.lastShotTime = Date.now();

        const p = new Proyectile({
            x: origin.x,
            y: origin.y + (origin.radius ?? 0), // debajo del enemigo
            width: this.projectileWidth,
            height: this.projectileHeight,
            speed: this.projectileSpeed,
            owner: origin,
            dx:0,
            dy:1,
        });
        p.particleSystem = this.particleSystem;
        return p;
    }
}
