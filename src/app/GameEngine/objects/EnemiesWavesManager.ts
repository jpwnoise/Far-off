/** el objetivo es crear una clase manejadora de oleadas para que scene sepa cuando agregar 
 * la oleada siguiente cuando la actual fue eliminada
 */
import { Enemy } from "./Enemy";

export class EnemiesWavesManager {

    setWaveTo(index: number) {
        this.currentWaveIndex = index;
        this.currentWave = this.Waves[this.currentWaveIndex];
    }
    /** la oleada actual */
    private currentWave: Enemy[] = [];

    /** todas las oleadas */
    private Waves: Enemy[][] = [];

    /** indice de la oleada actual */
    private currentWaveIndex = 0;

    constructor(firstWave:Enemy[]) {
        this.setWave(firstWave);
     }

    /** establece la oleada actual */
    setWave(wave: Enemy[]) {
        this.currentWave = wave;
    }

    /** devuelve la oleada actual */
    getCurrentWave() {
        return this.currentWave;
    }

    /** agrega una oleada al manejador de oleadas */
    addWave(wave: Enemy[]) {
        this.Waves.push(wave);
    }

    /** establece la siguiente oleada si existe y devuelve true, si no existe devuelve false */
    nextWave() {
        if (this.currentWaveIndex < this.Waves.length - 1) {
            this.currentWaveIndex++;
            this.currentWave = this.Waves[this.currentWaveIndex];
            return true
        } else return false;
    }

    /** devuelve true si la oleada actual fue eliminada */
    isCurrentWaveCleared() {
        return this.currentWave.every(enemy => !enemy.active);
    }
}