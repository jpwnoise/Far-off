import { GameObject } from "../objects/GameObject";

export interface iCollidable {
    onCollision(other:GameObject): void; 
}