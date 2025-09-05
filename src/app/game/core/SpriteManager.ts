import { Sprite } from "./Sprite";

export class SpriteManager {
    private sprites: Sprite[] = [];
    private currentIndex: number = 0;

    // Agrega un sprite al manager
    addSprite(sprite: Sprite) {
        this.sprites.push(sprite);
    }

    // Cambia al siguiente sprite (ciclo)
    nextSprite() {
        if (this.sprites.length === 0) return;
        this.currentIndex = (this.currentIndex + 1) % this.sprites.length;
    }

    // Cambia al sprite anterior
    previousSprite() {
        if (this.sprites.length === 0) return;
        this.currentIndex = (this.currentIndex - 1 + this.sprites.length) % this.sprites.length;
    }

    // Obtiene el sprite actual
    getCurrentSprite(): Sprite | null {
        if (this.sprites.length === 0) return null;
        return this.sprites[this.currentIndex];
    }

    // Cambia a un sprite específico por índice
    setSprite(index: number) {
        if (index < 0 || index >= this.sprites.length) return;
        this.currentIndex = index;
    }
}