import { GameObject } from "../objects/GameObject";
import { Proyectile } from "../objects/Proyectile";
import { iCollidable } from "../objects/Collider";

export class CollisionSystem {
  /** ===== revisa si dos objetos están colisionando ===== **/
  static checkCollision(obj1: GameObject, obj2: GameObject): boolean {
    // --- Si ambos tienen colliders definidos, usamos esos ---
    if (obj1.squareColliderManager && obj2.squareColliderManager) {
      for (const cA of obj1.squareColliderManager.colliders) {
        const a = cA.getAbsolute();
        for (const cB of obj2.squareColliderManager.colliders) {
          const b = cB.getAbsolute();
          if (
            a.x < b.x + b.width &&
            a.x + a.width > b.x &&
            a.y < b.y + b.height &&
            a.y + a.height > b.y
          ) {
            return true; // ✅ hay colisión
          }
        }
      }
      return false; // ❌ no colisionaron
    }

    return false;
  }


  /** ===== revisa colisiones en todos   los objetos ===== **/
  static iterateGameObjectsForCollisions(gameObjects: GameObject[]) {
    for (let i = 0; i < gameObjects.length; i++) {
      for (let j = i + 1; j < gameObjects.length; j++) {
        const a = gameObjects[i];
        const b = gameObjects[j];

        // 🚫 evitar que un proyectil colisione con su dueño
        if (
          (a instanceof Proyectile && a.owner === b) ||
          (b instanceof Proyectile && b.owner === a)
        ) {
          continue; // saltar este par
        }

        if (this.checkCollision(a, b)) {
          if ("onCollision" in a) {
            (a as iCollidable).onCollision(b);
          }
          if ("onCollision" in b) {
            (b as iCollidable).onCollision(a);
          }
        }
      }
    }
  }

}
