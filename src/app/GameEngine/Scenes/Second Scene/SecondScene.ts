import { ElementRef } from "@angular/core";
import { SequencedBackground } from "../../Animation/SequencedBackground";
import { Scene } from "../../core/SceneManager";
import { ParticleSystem } from "../../core/ParticleSystem";
import { Sprite } from "../../core/Sprite";
import { Ship } from "../../objects/Ship";
import { Proyectile } from "../../objects/Proyectile";
import { enemiesLevel_2 } from "./EnemiesLevel_2";
import { enemies as wave_5_enemies } from "./SimpleEnemyWave";
import { enemies as wave_7_ememies } from "./MediumEnemyWave";


export const createSecondScene = (canvas: ElementRef<HTMLCanvasElement>, ctx: CanvasRenderingContext2D, ps: ParticleSystem): Scene => {
    const scene = new Scene(canvas, ctx, ps);
    
    /** la nave del jugador */
    const playerShip = new Ship({ x: 665, y: 450, radius: 20, speed: 5 });
    playerShip.addParticleSystem(ps);
    
    /** los disparos del jugador */
    playerShip.projectileWasCreated = (p) => { scene.add(p) };
    scene.add(playerShip);
    
    /** secuencia de fondos  */
    const sequencedBackground = new SequencedBackground(ctx);
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/GreenTerrain 1.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/GreenTerrain 1 - 2.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/GreenTerrain 2.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/OrangeTerrain 2.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/OrangeTerrain.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/OrangeTerrain 3.png', ctx.canvas.width, ctx.canvas.height));
    sequencedBackground.spriteManager.addSprite(new Sprite('Sprites/Scene props/GreenTerrain 2 - 1.png', ctx.canvas.width, ctx.canvas.height));
    scene.backgroundCreator = sequencedBackground;

    //agregamos las oleadas de enemigos a la escena
    wave_5_enemies.forEach(e=>{
        e.particlesSystem = ps;
        //cuando un enemigo cree un proyectil lo agregamos a la escena
        e.projectileWasCreated = (p: Proyectile) => { scene.add(p) };
        e.wasHittedHandler = ()=>{ 
          scene.aEnemyWasHitted(e);
          console.log("enemigo atacado desde SecondScene.ts");
        }
    });
    scene.waveManager.addWave(wave_5_enemies);
    scene.waveManager.setWaveTo(0); //iniciamos en la primera oleada

    wave_7_ememies.forEach(e=>{
        e.particlesSystem = ps;
        e.projectileWasCreated = (p: Proyectile) => { scene.add(p) };   
        e.wasHittedHandler = ()=>{ 
          scene.aEnemyWasHitted(e);
          console.log("enemigo atacado desde SecondScene.ts");
        }
    });
    scene.waveManager.addWave(wave_7_ememies);
    
    return scene;
}