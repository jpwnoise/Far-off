import { Sprite } from "./core/Sprite";
import { SquareCollider } from "./core/SquareCollider";
import { Enemy } from "./objects/Enemy";

export const enemiesLevel_1: Enemy[] = [];

const enemy1 = new Enemy({
    x: 50,
    y: 0,
    radius: 50,
    speed: 5,
    positions: [
        { x: 50, y: 50 },
        { x: 300, y: 50 },
        { x: 50, y: 50 },
        { x: 400, y: 200 },
        { x: 500, y: 50 },
        { x: 650, y: 300 }],
    repeat: true,
    delayBetweenPositions: 1000
});
enemy1.spriteManager.sprites = [];
enemy1.spriteManager.addSprite(new Sprite('Alien 3.png',100,100))

enemiesLevel_1.push( enemy1)
enemiesLevel_1.push(new Enemy({
    x: 50,
    y: 0,
    radius: 50,
    speed: 5,
    positions: [
        { x: 500, y: 30 },
        { x: 400, y: 50 },
        { x: 200, y: 50 },
        { x: 400, y: 200 },
        { x: 500, y: 50 },
        { x: 650, y: 300 }],
    repeat: true,
    delayBetweenPositions: 1000
}) );


enemiesLevel_1.forEach((e)=>{e.name = 'Aetheron - ' + e.identifier})

const boss_level1 = new Enemy({
    x: 50,
    y: 100,
    radius: 50,
    speed: 5,
    positions:[],
    //positions: [
    //    { x: 700, y: 50 },
    //    { x: 600, y: 60 },
    //    { x: 400, y: 70 },
    //    { x: 500, y: 200 },
    //    { x: 600, y: 80 },
    //    { x: 650, y: 300 }],
    repeat: true,
    delayBetweenPositions: 1000,    
});

/** === borramos los sprites por defecto === */
boss_level1.spriteManager.sprites = [];
boss_level1.spriteManager.addSprite(new Sprite('Boss-level-1_biodestructor.png',400,400));
boss_level1.stats.health = 500;

//**== agregamos los colisionadores adecuados para el sprite == */
boss_level1.squareColliderManager.colliders = [];
boss_level1.squareColliderManager.colliders.push(new SquareCollider(boss_level1,110,370,150,20,'green'));
boss_level1.squareColliderManager.colliders.push(new SquareCollider(boss_level1,25,260,125,80,'green'));
boss_level1.squareColliderManager.colliders.push(new SquareCollider(boss_level1,25,260,260,80,'red'));
boss_level1.drawCollider = true; 
enemiesLevel_1.push( boss_level1 );