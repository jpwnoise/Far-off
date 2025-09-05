import { GameObject } from "../objects/GameObject";
import { Ship } from "../objects/Ship";
import { Proyectile } from "../objects/Proyectile";
import { iCollidable } from "../objects/Collider";
import { Enemy } from "../objects/Enemy";

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

    // --- Ship vs Ship (círculos) ---
    if (obj1 instanceof Ship && obj2 instanceof Ship) {
      const dx = obj1.x - obj2.x;
      const dy = obj1.y - obj2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const r1 = obj1.radius ?? 0;
      const r2 = obj2.radius ?? 0;
      return distance < r1 + r2;
    }

    // --- Projectile vs Ship/Enemy (fallback AABB) ---
    if (obj1 instanceof Proyectile && (obj2 instanceof Ship || obj2 instanceof Enemy)) {
      const r2 = obj2.radius ?? 0;
      return (
        obj1.x + obj1.width / 2 > obj2.x - r2 &&
        obj1.x - obj1.width / 2 < obj2.x + r2 &&
        obj1.y < obj2.y + r2 &&
        obj1.y + obj1.height > obj2.y - r2
      );
    }

    // --- Caso inverso ---
    if ((obj1 instanceof Ship || obj1 instanceof Enemy) && obj2 instanceof Proyectile) {
      return this.checkCollision(obj2, obj1);
    }

    return false;
  }


  /** ===== revisa colisiones en todos los objetos ===== **/
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
