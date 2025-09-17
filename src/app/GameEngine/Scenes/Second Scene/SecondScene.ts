import { ElementRef } from "@angular/core";
import { SequencedBackground } from "../../Animation/SequencedBackground";
import { Scene } from "../../core/SceneManager";
import { ParticleSystem } from "../../core/ParticleSystem";
import { Sprite } from "../../core/Sprite";
import { Ship } from "../../objects/Ship";

export const createSecondScene = (canvas: ElementRef<HTMLCanvasElement>, ctx: CanvasRenderingContext2D, ps: ParticleSystem): Scene => {
    const scene = new Scene(canvas, ctx, ps);
    const sequencedBackground = new SequencedBackground(ctx);
    const sprite = new Sprite('Sprites/Scene props/RedPlanet-floor-tileable 2.png', ctx.canvas.width, ctx.canvas.height);
    const playerShip = new Ship({ x: 665, y: 450, radius: 20, speed: 5 });
    playerShip.addParticleSystem(ps);
    playerShip.projectileWasCreated = (p) => { scene.add(p) };
    scene.add(playerShip);
    sequencedBackground.spriteManager.addSprite(sprite);
    scene.backgroundCreator = sequencedBackground;
    return scene;
}