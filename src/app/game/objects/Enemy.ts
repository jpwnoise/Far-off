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
    public scene!:Scene;
    private spriteManager = new SpriteManager();
    public usingSprites = true; 
    
    private initColliders(){
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
    
    /** esta vivo o muerto */
    public active = true;
    
    constructor(config: iEnemyConfig) {
        
        // valores por defecto
        const {
            x = 0,
            y = 0,
            radius = 0,
            speed = 0,
            positions = [
                { x: 200, y: 50 },
                { x: 400, y: 100 },
                { x: 100, y: 180 },
                { x: 500, y: 220 },
                { x: 150, y: 300 },
                { x: 450, y: 350 },
                { x: 250, y: 450 },
                { x: 400, y: 500 },
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
        this.spriteManager.addSprite(new Sprite('Sprites/Alien/Alien Ship Sprite 1.png',100,100))
        this.initColliders();
    }

    lastHitOwner?: GameObject;

    onCollision(other: GameObject): void {
        // Solo procesamos si other es un proyectil activo
        if (other instanceof Proyectile && other.isActive) {
            // Evitamos que el proyectil nos golpee más de una vez
            if (!this.lastHitOwner || this.lastHitOwner.identifier !== other.identifier) {
                this.stats.takeDamage(5);
                this.lastHitOwner = other;
                other.isActive = false; // destruimos el proyectil
                this.particlesSystem.spawn(other.x, other.y, [255, 165, 0, 1], [255, 0, 0, 0], 5);
                this.stats.takeDamage(5);
                this.wasHittedHandler(this.stats);
            }
        }
    }

    /** === funcion para exponer el evento de que fue golpeado === */
    public wasHittedHandler!: (stats: Stats) => void

    whenDie() {
        this.active = false;
    }


    /** === evento para exponer el game object del projectile a la game y asi poderlo asignar a la escena */
    projectileWasCreated:(p:Proyectile)=>void = ()=>{};

    override update() {
        super.update();
        const projectile = this.shooter.shoot(this);
        if (projectile){
            this.projectileWasCreated(projectile);
        }
    }

    override draw() {
        super.draw();
        this.drawEnemy();
        this.squareColliderManager.colliders.forEach(c => {
            c.ctx = this.ctx;
            c.draw()
        })
    }
    
    drawEnemy(){
        if (!this.usingSprites){
            this.ctx.fillStyle = 'red';
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius ?? 0, 0, Math.PI * 2);
            this.ctx.fill();
            return; 
        }
        const sprite = this.spriteManager.getCurrentSprite();
        sprite?.draw(this.ctx, this.x, this.y,180);
    }
}