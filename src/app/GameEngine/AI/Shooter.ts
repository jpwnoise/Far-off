import { Proyectile } from "../objects/Proyectile";
import { GameObject } from "../objects/GameObject";
import { ParticleSystem } from "../core/ParticleSystem";

export class Shooter {
  private baseCooldown: number;
  private nextCooldown: number;
  private lastShotTime: number = 0;
  private projectileSpeed: number;
  private projectileWidth: number;
  private projectileHeight: number;
  particleSystem!: ParticleSystem;

  constructor(cooldown: number = 1000, projectileSpeed: number = 8, projectileWidth: number = 10, projectileHeight: number = 10) {
    this.baseCooldown = cooldown;
    this.nextCooldown = cooldown; // inicial
    this.projectileSpeed = projectileSpeed;
    this.projectileWidth = projectileWidth;
    this.projectileHeight = projectileHeight;
  }

  canShoot(): boolean {
    return Date.now() - this.lastShotTime >= this.nextCooldown;
  }

  shoot(origin: GameObject): Proyectile | null {
    if (!this.canShoot()) return null;

    this.lastShotTime = Date.now();
    this.nextCooldown = this.baseCooldown + Math.random() * 500; // ← se fija aquí

    const p = new Proyectile({
      x: origin.x,
      y: origin.y + (origin.radius ?? 0),
      width: this.projectileWidth,
      height: this.projectileHeight,
      speed: this.projectileSpeed,
      owner: origin,
      dx: 0,
      dy: 1,
      color: 'orange',
      shadowColor: 'red',
      shadowBlur: 20
    });
    p.particleSystem = this.particleSystem;
    return p;
  }
}
