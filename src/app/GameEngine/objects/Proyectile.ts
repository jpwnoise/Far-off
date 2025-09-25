import { iCollidable } from "./Collider";
import { GameObject } from "../objects/GameObject";
import { Particle } from "../core/Particle";
import { ParticleSystem } from "../core/ParticleSystem";
import { SquareCollider, SquareColliderManager } from "../core/SquareCollider";

export class Proyectile extends GameObject implements iCollidable {
  public width: number = 5;
  public height: number = 10;
  public speed: number = 7;
  public owner?: GameObject;
  particleSystem!: ParticleSystem;
  private shadowColor: string = 'blue';
  private shadowBlur: number = 10;

  // vector dirección normalizado
  public dx: number = 0;
  public dy: number = -1; // por defecto hacia arriba
  private color: string = 'blue';

  constructor({
    x = 0, y = 0, width = 5, height = 10, speed = 7,
    owner, dx = 0, dy = -1, color = 'blue', shadowColor = 'blue', 
    shadowBlur = 10
  }: {
    x?: number; y?: number;
    width?: number; 
    height?: number;
    speed?: number;
    owner?: GameObject;
    dx?: number; dy?: number;
    color?: string, 
    shadowColor?: string, 
    shadowBlur?: number
  } = {}) {
    super({ x, y });
    this.width = width;
    this.height = height;
    this.speed = speed;
    this.owner = owner;
    this.color = color;
    this.shadowColor = shadowColor;
    this.shadowBlur = shadowBlur;

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

  /** determinamos la forma del proyectil */
  private ball: boolean = true;// true = bola, false = rectángulo

  override draw(): void {
    if (!this.active || !this.ctx) return;

    this.ctx.save();
    this.ctx.fillStyle = this.color;
    
    if (this.ball) {
      // dibujar como una bola
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.width / 2, 0, Math.PI * 2);
      this.ctx.shadowBlur = this.shadowBlur;
      this.ctx.shadowColor = this.shadowColor;
      this.ctx.fill();
      
      this.ctx.fillStyle = 'white';
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.width / 4, 0, Math.PI * 2);
      this.ctx.fill();
    } else
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
      //c.draw();
    });
  }


  onCollision(other: GameObject): void {
    this.active = false;
    //this.particleSystem.spawn(other.x, other.y,'orange',10); 
  }
}
