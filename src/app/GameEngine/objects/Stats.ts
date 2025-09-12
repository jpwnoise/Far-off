export class Stats {
  public health: number;
  public maxHealth: number;
  public shield: number;
  public maxShield: number;
  public energy: number;
  public maxEnergy: number;

  constructor(health = 100, shield = 0, energy = 0) {
    this.health = health;
    this.maxHealth = health;
    this.shield = shield;
    this.maxShield = shield;
    this.energy = energy;
    this.maxEnergy = energy;
  }

  takeDamage(amount: number) {
    if (this.shield > 0) {
      const absorbed = Math.min(this.shield, amount);
      this.shield -= absorbed;
      amount -= absorbed;
    }
    this.health -= amount;

    //para que nunca sea menos que cero
    if (this.health < 0) {
      this.health = 0;
    }

    if (!this.isAlive()){
      this.whenDie();
    }

  }

  isAlive(): boolean {
    return this.health > 0;
  }

  /** === evento cuando muere === */
  whenDie: (() => void) = ()=>{};
}
