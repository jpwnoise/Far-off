import { MovementPattern } from "../AI/MovePattern";
import { Shooter } from "../AI/Shooter";
import { ParticleSystem } from "../core/ParticleSystem";
import { Scene } from "../core/SceneManager";
import { ObjectWithBehavior } from "./Behavior";
import { iCollidable } from "./Collider";
import { GameObject } from "./GameObject";
import { Proyectile } from "./Proyectile";
import { Stats } from "./Stats";
import { SpriteManager } from "../core/SpriteManager";
import { Sprite } from "../core/Sprite";
import { SquareCollider, SquareColliderManager } from "../core/SquareCollider";

interface iEnemyConfig {
    x: number,
    y: number,
    radius: number,
    speed: number,
    positions: any[],
    repeat: boolean,
    delayBetweenPositions: number
}

export class Enemy extends ObjectWithBehavior implements iCollidable {
    public stats: Stats;
    public particlesSystem!: ParticleSystem;
    private shooter!: Shooter;
    public scene!: Scene;
    public spriteManager = new SpriteManager();
    public usingSprites = true;
    public name: string = 'Enemy'

    private initColliders() {
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 20, 0, 15));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 20, 10, 25));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 30, 20, 30));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 50, 30, 20));
        this.squareColliderManager.addCollider(new SquareCollider(this, 20, 90, 40, 4));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 50, 60, 20));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 30, 70, 30));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 20, 80, 25));
        this.squareColliderManager.addCollider(new SquareCollider(this, 10, 20, 90, 15));
    }

    constructor(config: iEnemyConfig) {

        // valores por defecto
        const {
            x = 0,
            y = 0,
            radius = 0,
            speed = 0,
            positions = [
            ],
            repeat = false,
            delayBetweenPositions = 1000,
        } = config;

        super({ x, y, radius, speed, positions, repeat, delayBetweenPositions });
        this.squareColliderManager = new SquareColliderManager();
        this.shooter = new Shooter();
        this.stats = new Stats(100, 25, 15);
        this.stats.whenDie = this.whenDie.bind(this);
        this.movementPattern = new MovementPattern(positions, 2, 1000, true);
        this.spriteManager.addSprite(new Sprite('Sprites/Alien/Alien Ship Sprite 1.png', 100, 100))
        this.spriteManager.addSprite(new Sprite('Sprites/Alien/Alien Ship Sprite 2.png', 100, 100))
        this.spriteManager.addSprite(new Sprite('Sprites/Alien/Alien Ship Sprite 3.png', 100, 100))
        this.spriteManager.addSprite(new Sprite('Sprites/Alien/Alien Ship Sprite 4.png', 100, 100))
        this.spriteManager.addSprite(new Sprite('Sprites/Alien/Alien Ship Sprite 5.png', 100, 100))
        this.spriteManager.addSprite(new Sprite('Sprites/Alien/Alien Ship Sprite 6.png', 100, 100))
        this.initColliders();
    }

    lastHitOwner?: GameObject;

    onCollision(other: GameObject): void {
        // Solo procesamos si other es un proyectil activo
        if (other instanceof Proyectile && other.active) {
            // Evitamos que el proyectil nos golpee más de una vez
            if (!this.lastHitOwner || this.lastHitOwner.identifier !== other.identifier) {
                this.stats.takeDamage(5);
                this.lastHitOwner = other;
                other.active = false; // destruimos el proyectil
                this.particlesSystem.spawn(other.x, other.y, [255, 165, 0, 1], [255, 0, 0, 0], 5, 2, 1);
                this.wasHittedHandler(this.stats);
                this.isFlashingDamage = true;
                this.damageFlashStartTime = Date.now();

            }
        }
    }

    //cambiamos el color del sprite para indicar visualmente que recibio 
    damageFlashStartTime = Date.now();
    isFlashingDamage = false;
    damageFlashDuration = 100;
    tintColor: string | null = null;
    updateColorDamageIndicator() {
        this.tintColor
        if (this.isFlashingDamage) {
            const elapsedTime = Date.now() - this.damageFlashStartTime;
            const progress = Math.min(elapsedTime / this.damageFlashDuration, 1);

            // Usamos una función para crear un efecto de "parpadeo" que se desvanece
            const alpha = Math.sin(progress * Math.PI) * 0.75; // de 0 a 0.75 y de vuelta a 0
            this.tintColor = `rgba(255, 0, 0, ${alpha})`;

            if (progress >= 1) {
                this.isFlashingDamage = false; // Detener el efecto
            }
        }
    }

    /** === funcion para exponer el evento de que fue golpeado === */
    public wasHittedHandler: (stats: Stats) => void = () => { }

    whenDie() {
        this.active = false;
        const sprite = this.spriteManager.getCurrentSprite()!;
        const xPos = this.x + sprite.width / 2;
        const yPos = this.y + sprite.height / 2;
        this.particlesSystem.spawn(xPos, yPos, [255, 100, 255, 1], [0, 0, 255, .2], 60, 3, 5);
    }


    /** === evento para exponer el game object del projectile a la game y asi poderlo asignar a la escena */
    projectileWasCreated: (p: Proyectile) => void = () => { };

    override update() {
        super.update();
        const projectile = this.shooter.shoot(this);
        if (projectile) {
            this.projectileWasCreated(projectile);
        }
        this.updateColorDamageIndicator();
        this.updateSpriteByLife();
        
    }

    //** === bandera para controlar el dibujado de las colisiones === */
    drawCollider = false;

    /** === dibuja lo referente al enemigo === */
    override draw() {
        super.draw();
        this.drawEnemy();
        this.squareColliderManager.colliders.forEach(c => {
            c.ctx = this.ctx;
            if (this.drawCollider) { c.draw() }
        })
        
    }

    drawEnemy() {
        if (!this.usingSprites) {
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius ?? 0, 0, Math.PI * 2);
            this.ctx.fill();
            return;
        }

        const sprite = this.spriteManager.getCurrentSprite();
        sprite?.draw(this.ctx, this.x, this.y, 180, this.tintColor);
    }

    /**
  * Actualiza el sprite del enemigo en función de su porcentaje de vida.
  * Mapea el porcentaje de vida (0-100%) a un índice de sprite (0 a N-1).
  */
    updateSpriteByLife() {
        // Obtiene el porcentaje de vida restante (valor entre 0.0 y 1.0)
        const lifePercent = this.stats.health / this.stats.maxHealth;

        // Obtiene el número total de sprites disponibles.
        const totalSprites = this.spriteManager.sprites.length;

        // Mapea el porcentaje de vida a un índice.
        // La vida del 100% (1.0) se mapea al primer sprite (índice 0).
        // La vida del 0% (0.0) se mapea al último sprite (índice totalSprites - 1).
        const spriteIndex = Math.floor((1 - lifePercent) * totalSprites);

        // Asegura que el índice no exceda los límites del array.
        const finalIndex = Math.min(spriteIndex, totalSprites - 1);

        this.spriteManager.setSprite(finalIndex);
    }
}