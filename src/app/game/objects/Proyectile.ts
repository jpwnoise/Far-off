import { iCollidable } from "./Collider";
import { GameObject } from "../objects/GameObject";
import { Particle } from "../core/Particle";
import { ParticleSystem } from "../core/ParticleSystem";
import { SquareCollider, SquareColliderManager } from "../core/SquareCollider";

export class Proyectile extends GameObject implements iCollidable {
  public width: number = 5;
  public height: number = 10;
  public speed: number = 7;
  public isActive: boolean = true;
  public owner?: GameObject;
  particleSystem!: ParticleSystem;

  // vector dirección normalizado
  public dx: number = 0;
  public dy: number = -1; // por defecto hacia arriba

  constructor({
    x = 0, y = 0, width = 5, height = 10, speed = 7,
    owner, dx = 0, dy = -1
  }: {
    x?: number; y?: number;
    width?: number; height?: number;
    speed?: number;
    owner?: GameObject;
    dx?: number; dy?: number;
  } = {}) {
    super({ x, y });
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.owner = owner;

    // normalizar dirección
    const length = Math.hypot(dx, dy);
    if (length > 0) {
      this.dx = dx / length;
      this.dy = dy / length;
    }

    this.squareColliderManager = new SquareColliderManager();
    this.squareColliderManager.addCollider(new SquareCollider(this,this.width,this.height))
    
  }

  override update() {
    super.update();
    this.x += this.dx * this.speed;
    this.y += this.dy * this.speed;
  }

  override draw(): void {
    if (!this.isActive || !this.ctx) return;

    this.ctx.save();
    this.ctx.fillStyle = 'blue';

    // dibujar como un rectángulo vertical (bala tipo láser)
    this.ctx.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );

    this.ctx.restore();

    this.squareColliderManager.colliders.forEach(c=>{
      c.ctx = this.ctx;
      c.draw();
    });
  }


  onCollision(other: GameObject): void {
    this.isActive = false;
    //this.particleSystem.spawn(other.x, other.y,'orange',10); 
  }
}
