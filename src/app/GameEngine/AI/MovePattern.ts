export class MovementPattern {
    private positions: { x: number; y: number }[] = [];
    private currentIndex: number = 0;
    private speed: number;
    private delayBetweenPositions: number;
    private lastMoveTime: number = 0;
    private repeat: boolean;

    constructor(
        positions: { x: number; y: number }[] = [],
        speed: number = 2,
        delayBetweenPositions: number = 1000,
        repeat: boolean = false
    ) {
        this.positions = positions;
        this.speed = speed;
        this.delayBetweenPositions = delayBetweenPositions;
        this.repeat = repeat;
    }

    public updatePosition(obj: { x: number; y: number }) {
        if (this.positions.length === 0) return;

        const now = Date.now();
        if (now - this.lastMoveTime < this.delayBetweenPositions) return;

        const target = this.positions[this.currentIndex];
        const dx = target.x - obj.x;
        const dy = target.y - obj.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.speed) {
            obj.x = target.x;
            obj.y = target.y;
            this.lastMoveTime = now;

            if (this.currentIndex < this.positions.length - 1) {
                this.currentIndex++;
            } else if (this.repeat) {
                this.currentIndex = 0;
            }
        } else {
            obj.x += (dx / distance) * this.speed;
            obj.y += (dy / distance) * this.speed;
        }
    }

    public setPositions(positions: { x: number; y: number }[]) {
        this.positions = positions;
        this.currentIndex = 0;
    }
}
