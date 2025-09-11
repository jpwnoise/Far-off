export class AudioManager {
    private ctx: AudioContext;
    private source!: AudioBufferSourceNode | null;
    private gainNode!: GainNode;
    private buffer!: AudioBuffer;
    private startTime: number = 0;
    private pausedAt: number = 0;
    private isPlaying: boolean = false;
    private loop: boolean = false;

    constructor() {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    async loadSound(url: string): Promise<AudioBuffer> {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return this.ctx.decodeAudioData(arrayBuffer);
    }

    private createSource() {
        this.source = this.ctx.createBufferSource();
        this.gainNode = this.ctx.createGain();

        this.source.buffer = this.buffer;
        this.source.loop = this.loop;

        this.source.connect(this.gainNode);
        this.gainNode.connect(this.ctx.destination);
    }

    play(buffer: AudioBuffer, volume: number = 1, loop: boolean = false) {
        // Si ya hay un audio sonando, lo detenemos primero para evitar múltiples instancias
        //this.stop();

        // Guardamos datos para su uso futuro
        this.buffer = buffer;
        this.loop = loop;

        this.createSource();
        if (this.gainNode) {
            this.gainNode.gain.value = volume;
        }

        this.startTime = this.ctx.currentTime - this.pausedAt;
        this.source?.start(0, this.pausedAt);
        this.isPlaying = true;

        // Cuando termina la música, reiniciamos variables
        if (this.source) {
            this.source.onended = () => {
                if (!this.loop) {
                    this.pausedAt = 0;
                    this.isPlaying = false;
                    this.source = null; // Establecemos la fuente a null para indicar que ya no está activa
                }
            };
        }
    }

    pause() {
        // Solo intentamos detener la fuente si existe y está sonando
        if (!this.isPlaying || !this.source) return;

        // Usamos un bloque try-catch para manejar cualquier error si la fuente ya ha terminado
        try {
            this.source.stop();
        } catch (e) {
            console.warn("Error al detener la fuente de audio, puede que ya haya terminado.");
        }

        this.pausedAt = this.ctx.currentTime - this.startTime;
        this.isPlaying = false;
        this.source = null; // Marcamos la fuente como inactiva
    }

    resume() {
        if (this.isPlaying || !this.buffer) return;
        this.pausedAt = this.ctx.currentTime - this.startTime; // Recalcula el tiempo de pausa
        this.play(this.buffer, this.gainNode?.gain.value || 1, this.loop);
    }

    stop() {
        if (!this.isPlaying || !this.source) return;

        try {
            this.source.stop();
        } catch (e) {
            console.warn("Error al detener la fuente de audio, puede que ya haya terminado.");
        }
        
        this.pausedAt = 0;
        this.isPlaying = false;
        this.source = null; // Marcamos la fuente como inactiva
    }
}
