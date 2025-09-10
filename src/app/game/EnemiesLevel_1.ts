import { Enemy } from "./objects/Enemy";

export const enemiesLevel_1: Enemy[] = [];

enemiesLevel_1.push(new Enemy({
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
}) )
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
enemiesLevel_1.push(new Enemy({
    x: 50,
    y: 0,
    radius: 50,
    speed: 5,
    positions: [
        { x: 700, y: 50 },
        { x: 600, y: 60 },
        { x: 400, y: 70 },
        { x: 500, y: 200 },
        { x: 600, y: 80 },
        { x: 650, y: 300 }],
    repeat: true,
    delayBetweenPositions: 1000
}) );

enemiesLevel_1.forEach((e)=>{e.name = 'Aetheron - ' + e.identifier})