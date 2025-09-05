export class AudioManager {
  private ctx: AudioContext;

  constructor() {
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }

  async loadSound(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return this.ctx.decodeAudioData(arrayBuffer);
  }

  play(buffer: AudioBuffer, volume: number = 1) {
    const source = this.ctx.createBufferSource();
    const gainNode = this.ctx.createGain();
    gainNode.gain.value = volume;

    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(this.ctx.destination);

    source.start(0);
  }
}