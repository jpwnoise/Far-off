import { ElementRef } from "@angular/core";
import { Scene } from "../../core/SceneManager";
import { ParticleSystem } from "../../core/ParticleSystem";
import { enemiesLevel_1 } from "./EnemiesLevel_1";
import { Ship } from "../../objects/Ship";

export const createFirstScene = (canvasRef:ElementRef<HTMLCanvasElement>,ctx:CanvasRenderingContext2D, ps:ParticleSystem): Scene =>{
    const firstScene = new Scene(canvasRef,ctx,ps);
    const playerShip = new Ship({ x: 665, y: 450, radius: 20, speed: 5 });
    playerShip.addParticleSystem(ps);
    playerShip.projectileWasCreated = (p) => { firstScene.add(p) };
    firstScene.add(playerShip);

    enemiesLevel_1.forEach(e=>{
        e.particlesSystem = ps;
        firstScene.add(e);
    });    
    return firstScene; 
}