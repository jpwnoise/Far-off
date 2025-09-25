/** solo una prueba de configuración de multiples enemigos
 *  la ruta de movimiento y las posiciones son aleatorias
 */

import { Sprite } from "../../core/Sprite";
import { SquareCollider } from "../../core/SquareCollider";
import { Enemy } from "../../objects/Enemy";

export const enemiesLevel_2: Enemy[] = [];

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
enemy1.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - 1.png',100,100))

enemiesLevel_2.push( enemy1)


const enemy2 = new Enemy({
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
    });
    
enemy2.spriteManager.sprites = [];
enemy2.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - 2.png',100,100))


enemiesLevel_2.push(enemy2);

const enemy3 = new Enemy({
    x: 50,
    y: 0,
    radius: 50,
    speed: 5,
    positions: [
        { x: 1200, y: 30 },
        { x: 1000, y: 50 },
        { x: 1300, y: 50 },
        { x: 1400, y: 200 },
        { x: 1000, y: 50 },
        { x: 950, y: 300 }],
        repeat: true,
        delayBetweenPositions: 1000
    });
    
enemy3.spriteManager.sprites = [];
enemy3.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - 3.png',100,100))

const enemy4 = new Enemy({
    x: 50,
    y: 0,
    radius: 50,
    speed: 5,
    positions: [
        { x: 1000, y: 200 },
        { x: 800, y: 50 },
        { x: 900, y: 300 },
        { x: 600, y: 60 },
        { x: 800, y: 500 },
        { x: 1300, y: 100 }],
        repeat: true,
        delayBetweenPositions: 1000
    });
    
enemy4.spriteManager.sprites = [];
enemy4.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - master.png',100,100))


enemiesLevel_2.push(enemy4);

const enemy5 = new Enemy({
    x: 50,
    y: 0,
    radius: 50,
    speed: 5,
    positions: [
        { x: 800, y: 100 },
        { x: 600, y: 110 },
        { x: 500, y: 120 },
        { x: 600, y: 130 },
        { x: 800, y: 150 },
        { x: 950, y: 160 }],
        repeat: true,
        delayBetweenPositions: 1000
    });
    
enemy5.spriteManager.sprites = [];
enemy5.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - subboss.png',100,100))

enemiesLevel_2.push(enemy5);

/** asignamos un nombre unico a cada enemigo */
enemiesLevel_2.forEach((e)=>{e.name = 'Aetheron - ' + e.identifier})

const boss_level2 = new Enemy({
    x: 500,
    y: -100,
    radius: 50,
    speed: 5,
    positions: [
        { x: 700, y: 100 },
        { x: 600, y: 60 },
        { x: 400, y: 70 },
        { x: 500, y: 200 },
        { x: 600, y: 80 },
        { x: 650, y: 300 }],
    repeat: true,
    delayBetweenPositions: 1000,    
});

boss_level2.name = 'Boss: Gargot-fungi'; 
boss_level2.spriteManager.sprites = [];
boss_level2.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - boss.png',100,100))

/** === borramos los sprites por defecto === */
const bossLife  = 500;
boss_level2.stats.maxHealth = bossLife;
boss_level2.stats.health = bossLife;

//**== agregamos los colisionadores adecuados para el sprite == */
boss_level2.squareColliderManager.colliders = [];
boss_level2.squareColliderManager.colliders.push(new SquareCollider(boss_level2,110,370,150,20,'green'));
boss_level2.squareColliderManager.colliders.push(new SquareCollider(boss_level2,25,260,125,80,'green'));
boss_level2.squareColliderManager.colliders.push(new SquareCollider(boss_level2,25,260,260,80,'red'));
//boss_level1.drawCollider = true; 
enemiesLevel_2.push( boss_level2 );