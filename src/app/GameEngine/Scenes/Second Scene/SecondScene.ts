import { ElementRef } from "@angular/core";
import { SequencedBackground } from "../../Animation/SequencedBackground";
import { Scene } from "../../core/SceneManager";
import { ParticleSystem } from "../../core/ParticleSystem";
import { Sprite } from "../../core/Sprite";
import { Ship } from "../../objects/Ship";
import { enemiesLevel_1 } from "../First Scene/EnemiesLevel_1";


export const createSecondScene = (canvas: ElementRef<HTMLCanvasElement>, ctx: CanvasRenderingContext2D, ps: ParticleSystem): Scene => {
    const scene = new Scene(canvas, ctx, ps);
    const sequencedBackground = new SequencedBackground(ctx);
    const playerShip = new Ship({ x: 665, y: 450, radius: 20, speed: 5 });
    playerShip.addParticleSystem(ps);
    playerShip.projectileWasCreated = (p) => { scene.add(p) };
    scene.add(playerShip);
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/RedPlanet-floor-tileable 2.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/RedPlanet-transition.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/RedPlanet-dark.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/RedPlanet-dark 2.png', ctx.canvas.width, ctx.canvas.height));
    scene.backgroundCreator = sequencedBackground;
     enemiesLevel_1.forEach(e=>{
            e.particlesSystem = ps;
            scene.add(e);
        });    
    return scene;
}