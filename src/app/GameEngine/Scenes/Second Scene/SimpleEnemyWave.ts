/**
 * Oleada de 5 enemigos simples en formación
 * 
 */

import { Sprite } from "../../core/Sprite";
import { SquareCollider } from "../../core/SquareCollider";
import { Enemy } from "../../objects/Enemy";

/** array que contiene los enemigos de esta wave */
export const enemies: Enemy[] = [];

/** tipo de enemigos */
const enemy1 = new Enemy({
    x: 750,
    y: 20,
    radius: 50,
    speed: 5,
    positions: [
        { x: 750, y: 100 },
        { x: 750, y: 300 },
        { x: 500, y: 310 },
        { x: 900, y: 310 },
        { x: 750, y: 300 }],
    repeat: true,
    delayBetweenPositions: 1000
});
enemy1.spriteManager.sprites = [];
enemy1.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - 2.png', 100, 100))
enemies.push(enemy1)

const enemy2 = new Enemy({
    x: 550,
    y: -20,
    radius: 50,
    speed: 5,
    positions: [
        { x: 550, y: 60 },
        { x: 550, y: 260 },
        { x: 300, y: 270 },
        { x: 700, y: 270 },
        { x: 550, y: 260 }],
    repeat: true,
    delayBetweenPositions: 1000
});
enemy2.spriteManager.sprites = [];
enemy2.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - 1.png', 100, 100))
enemies.push(enemy2);

const enemy3 = new Enemy({
    x: 950,
    y: -20,
    radius: 50,
    speed: 5,
    positions: [
        { x: 950, y: 60 },
        { x: 950, y: 260 },
        { x: 700, y: 270 },
        { x: 1100, y: 270 },
        { x: 950, y: 260 }],
    repeat: true,
    delayBetweenPositions: 1000
});
enemy3.spriteManager.sprites = [];
enemy3.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - 1.png', 100, 100))
enemies.push(enemy3)

const enemy4 = new Enemy({
    x: 710,
    y: -150,
    radius: 50,
    speed: 5,
    positions: [
        { x: 710, y: -70 },
        { x: 710, y: 130 },
        { x: 460, y: 140 },
        { x: 860, y: 140 },
        { x: 710, y: 130 }],
    repeat: true,
    delayBetweenPositions: 1000
});
enemy4.spriteManager.sprites = [];
enemy4.spriteManager.addSprite(new Sprite('Sprites/Enemies level 2/Enemy lv2 - 3.png', 180, 180))
enemies.push(enemy4)
