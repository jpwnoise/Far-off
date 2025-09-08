import { iCollidable } from "./Collider";
import { GameObject } from "../objects/GameObject";
import { Stats } from "./Stats";
import { Proyectile } from "./Proyectile";
import { ParticleSystem } from "../core/ParticleSystem";
import { InputHandler } from "../core/InputHandler";
import { AudioManager } from "../core/AudioManager";
import { SpriteManager } from "../core/SpriteManager";
import { Sprite } from "../core/Sprite";
import { SquareColliderManager } from "../core/SquareCollider";
import { SquareCollider } from "../core/SquareCollider";

export class Ship extends GameObject implements iCollidable {
    speed: number = 0;
    stats: Stats;
    particlesSystem!: ParticleSystem;
    input: InputHandler = new InputHandler();
    audioManager: AudioManager = new AudioManager();
    lastShotTime: number = 0;
    shotCooldown: number = 100;
    spriteManager: SpriteManager = new SpriteManager();
    usingSprites = true;
    
    constructor({ x = 0, y = 0, radius = 0, speed = 0 }:
        { x?: number; y?: number; radius?: number; speed?: number } = {}) {
            super({ x, y, radius });
            this.speed = speed;
            this.stats = new Stats(100, 50, 20);
            this.audioManager.loadSound('Laser-Fire-sfx_ogg/laserfire01.ogg').then((b) => { this.laserBuffer = b });
            this.spriteManager.addSprite(new Sprite('Sprites/PlayerShip/Ship_sprite_1.png', 100, 100));
            this.squareColliderManager = new SquareColliderManager();
            this.initColliders();
    }

    private initColliders(){
        this.squareColliderManager.addCollider(new SquareCollider(this, 20, 100, 40, 2));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 50, 30, 40));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 50, 60, 40));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 40, 70, 55));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 30, 80, 65));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 40, 20, 55));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 30, 10, 65));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 30, 10, 65));
        this.squareColliderManager.addCollider(new SquareCollider(this, 5, 20, 5, 70,));
        this.squareColliderManager.addCollider(new SquareCollider(this, 5, 20, 90, 70));
    }

    lastHitOwner?: GameObject;

    /** === que hacer cuando colisiona === */
    onCollision(other: GameObject): void {
        // Solo procesamos si other es un proyectil activo
        if (other instanceof Proyectile && other.active) {
            // Evitamos que el proyectil nos golpee más de una vez
            if (!this.lastHitOwner || this.lastHitOwner.identifier !== other.identifier) {
                this.stats.takeDamage(5);
                this.lastHitOwner = other;
                other.active = false; // destruimos el proyectil
                this.particlesSystem.spawn(other.x, other.y, [255, 165, 0, 1], [255, 0, 0, 0], 5)
            }
        }
    }

    projectiles: Proyectile[] = [];

    /** === disparos del jugador === */
    private shooting() {
        const now = Date.now();
        if (this.input.isPressed('j') && now - this.lastShotTime > this.shotCooldown) {
            this.audioManager.play(this.laserBuffer, .5);
            const projectile = new Proyectile({
                width: 4,
                height: 10,
                speed: 10,
                x: this.x,
                y: this.y - (this.radius ?? 0),
                owner: this,
                dx: 0,
                dy: -1
            });
            projectile.ctx = this.ctx;
            projectile.particleSystem = this.particlesSystem;
            this.lastShotTime = now;
            this.projectileWasCreated(projectile);
            this.projectiles.push(projectile)
        }
    }

    laserBuffer!: AudioBuffer;

    /** === actualizamos todos los datos === */
    override update() {
        super.update();
        const canvasWidth = this.canvas.nativeElement.width;
        const canvasHeight = this.canvas.nativeElement.height;
        this.shooting();
        this.projectiles.forEach((e) => {
            e.update();
        })

        if (this.input.isPressed('a') && this.x - (this.radius ?? 0) > 0) this.x -= this.speed;
        if (this.input.isPressed('d') && this.x + (this.radius ?? 0) < canvasWidth) this.x += this.speed;
        if (this.input.isPressed('w') && this.y - (this.radius ?? 0) > 0) this.y -= this.speed;
        if (this.input.isPressed('s') && this.y + (this.radius ?? 0) < canvasHeight) this.y += this.speed;
    }

    //** === para externar los proyectiles y poderlos agregarlos a la escena que es el que controla las colisiones === */
    projectileWasCreated:(p:Proyectile)=>void = ()=>{}

    /** === dibuja la forma correcta === */
    override draw() {
        super.draw();

        
        //dibujamos las balas 
        this.projectiles.forEach((e) => {
            e.draw();
        });
        
        //si no estamos usando sprites usanmos el circulo
        if (!this.usingSprites) {
            this.drawCircle();
            return;
        }
        this.drawSprite();
        
        //dibujamos las formas de los collisionadores (solo debug)
        this.squareColliderManager.ctx = this.ctx;
        this.squareColliderManager.colliders.forEach(c => {
            c.ctx = this.ctx;
            //c.draw()
        })
    }

    /** === dibujar un circulo si no tiene sprite === */
    private drawCircle() {
        this.ctx.fillStyle = 'white';
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius ?? 0, 0, Math.PI * 2);
        this.ctx.fill();
    }

    /** === dibujar cuando tiene sprite === */
    private drawSprite() {
        const sprite = this.spriteManager.getCurrentSprite();
        sprite?.draw(this.ctx, this.x, this.y);
    }
}