import { Particle } from './Particle';

export class ParticleSystem {
  private particles: Particle[] = [];
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  spawn(x: number, y: number, startColor: [number, number, number, number], endColor: [number, number, number, number], amount: number = 10, spread = 3, speed = 5) {
    for (let i = 0; i < amount; i++) {
      this.particles.push(new Particle(x, y, startColor, endColor, spread, speed));
    }
  }

      /**
   * Genera un chorro de partículas para simular la flama de un cohete.
   * Las partículas se emiten continuamente en un cono direccional.
   * @param {number} x - La coordenada X del punto de emisión.
   * @param {number} y - La coordenada Y del punto de emisión.
   * @param {number} [amount=3] - La cantidad de partículas a generar en cada llamada.
   * @param {number} [directionInDegrees=90] - La dirección de la flama en grados (0° = derecha, 90° = abajo).
   * @param {number} [life=50] - El tiempo de vida base de las partículas.
   * @param {number} [speed=5] - La velocidad base de las partículas.
   */
  emitFlame(x: number, y: number, amount: number = 3, directionInDegrees: number = 90, life: number = 50, speed: number = 5) {
    const startColor: [number, number, number, number] = [255, 165, 0, 1]; // Naranja
    const endColor: [number, number, number, number] = [255, 0, 0, 0];   // Rojo transparente

    // Convertimos los grados a radianes
    const directionInRadians = (directionInDegrees * Math.PI) / 180;

    for (let i = 0; i < amount; i++) {
      // El ángulo del cono de la flama se crea a partir de la dirección base
      const angle = directionInRadians + (Math.random() - 0.5) * (Math.PI / 4);
      
      const particleSpeed = Math.random() * speed + 1; // Velocidad de las partículas
      
      const vx = Math.cos(angle) * particleSpeed;
      const vy = Math.sin(angle) * particleSpeed;
      
      // Creamos una nueva partícula y le asignamos la velocidad y la vida
      const particle = new Particle(x, y, startColor, endColor, 0, 0); 
      particle.vx = vx;
      particle.vy = vy;
      
      // La vida de la partícula tendrá una variación aleatoria alrededor del valor base.
      particle.life = life + (Math.random() * life * 0.5); // Variación de hasta el 50%
      particle.maxLife = particle.life;

      this.particles.push(particle);
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
