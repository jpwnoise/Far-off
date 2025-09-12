export class Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  startColor: [number, number, number, number]; // RGBA
  endColor: [number, number, number, number];   // RGBA

  constructor(
    x: number,
    y: number,
    radiusMultiplier:number = 2,
    startColor: [number, number, number, number] = [255, 165, 0, 1], // naranja
    endColor: [number, number, number, number] = [255, 0, 0, 0],     // rojo transparente
    spread: number = 2,   // 🔥 dispersión (rango mayor = explosión más abierta)
    speed: number = 2     // ⚡ velocidad base
  ) {
    this.x = x;
    this.y = y;
    this.radius = Math.random() * radiusMultiplier + 1;

    // Generamos un ángulo aleatorio
    const angle = Math.random() * Math.PI * 2;
    // Magnitud depende de spread y speed
    const magnitude = Math.random() * speed * spread;

    this.vx = Math.cos(angle) * magnitude;
    this.vy = Math.sin(angle) * magnitude;

    this.life = 50 + Math.random() * 30;
    this.maxLife = this.life;
    this.startColor = startColor;
    this.endColor = endColor;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    // fricción para que no salgan disparadas infinitamente
    this.vx *= 0.95;
    this.vy *= 0.95;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const t = Math.max(this.life / this.maxLife, 0);
    const color = this.lerpColor(this.startColor, this.endColor, 1 - t);
    ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${color[3]})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  private lerpColor(start: [number, number, number, number], end: [number, number, number, number], t: number): [number, number, number, number] {
    return [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
      start[2] + (end[2] - start[2]) * t,
      start[3] + (end[3] - start[3]) * t,
    ];
  }
}
