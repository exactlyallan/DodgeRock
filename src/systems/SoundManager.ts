export class SoundManager {
  private ctx: AudioContext | null = null;

  private getCtx(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
    }
    return this.ctx;
  }

  private playTone(freq: number, duration: number, type: OscillatorType = 'square', volume = 0.15) {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  }

  private playNoise(duration: number, volume = 0.1) {
    const ctx = this.getCtx();
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  }

  jump() {
    const ctx = this.getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(300, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  }

  hit() {
    this.playTone(100, 0.3, 'sawtooth', 0.2);
    this.playNoise(0.15, 0.15);
  }

  pickup() {
    this.playTone(400, 0.08, 'square', 0.12);
    setTimeout(() => this.playTone(600, 0.1, 'square', 0.12), 80);
  }

  throwRock() {
    this.playNoise(0.12, 0.2);
    this.playTone(200, 0.08, 'triangle', 0.1);
  }

  bounce() {
    this.playTone(80, 0.1, 'triangle', 0.08);
  }

  win() {
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.25, 'square', 0.12), i * 150);
    });
  }

  lose() {
    const notes = [400, 350, 300, 200];
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.3, 'sawtooth', 0.1), i * 200);
    });
  }
}
