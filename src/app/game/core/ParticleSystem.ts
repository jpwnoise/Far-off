import { Particle } from './Particle';

export class ParticleSystem {
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  spawn(x: number, y: number, startColor: [number, number, number, number], endColor: [number, number, number, number], amount: number = 10, spread = 3, speed = 5) {
    for (let i = 0; i < amount; i++) {
      this.particles.push(new Particle(x, y, startColor, endColor,spread, speed ));
    }
  }

  update() {
    for (const p of this.particles) p.update();
    // eliminar partículas muertas
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw() {
    for (const p of this.particles) p.draw(this.ctx);
  }
}
