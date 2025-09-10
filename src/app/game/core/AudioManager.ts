export class AudioManager {
  private ctx: AudioContext;
  private source!: AudioBufferSourceNode;
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

  play(buffer: AudioBuffer, volume: number = 1, loop: boolean = false) {
    // Guardamos datos
    this.buffer = buffer;
    this.loop = loop;

    this.source = this.ctx.createBufferSource();
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = volume;

    this.source.buffer = this.buffer;
    this.source.loop = this.loop;

    this.source.connect(this.gainNode);
    this.gainNode.connect(this.ctx.destination);

    this.startTime = this.ctx.currentTime - this.pausedAt;
    this.source.start(0, this.pausedAt);
    this.isPlaying = true;

    // Cuando termina la música, reiniciamos variables
    this.source.onended = () => {
      if (!this.loop) {
        this.pausedAt = 0;
        this.isPlaying = false;
      }
    };
  }

  pause() {
    if (!this.isPlaying) return;
    this.source.stop();
    this.pausedAt = this.ctx.currentTime - this.startTime;
    this.isPlaying = false;
  }

  resume() {
    if (this.isPlaying || !this.buffer) return;
    this.play(this.buffer, this.gainNode.gain.value, this.loop);
  }

  stop() {
    if (!this.isPlaying) return;
    this.source.stop();
    this.pausedAt = 0;
    this.isPlaying = false;
  }
}
