export type AmbientSoundType = 'deep_focus' | 'rain' | 'ocean' | 'bowl';

export class AmbientAudioGenerator {
  private ctx: AudioContext | null = null;
  private activeNodes: AudioNode[] = [];
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private volume = 0.5;
  private currentType: AmbientSoundType = 'deep_focus';

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  public setType(type: AmbientSoundType) {
    if (this.currentType === type) return;
    this.currentType = type;
    if (this.isPlaying) {
      this.stop();
      this.play();
    }
  }
  
  public getType(): AmbientSoundType {
    return this.currentType;
  }

  private createBrownNoise(): AudioBuffer {
    if (!this.ctx) throw new Error("AudioContext not initialized");
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; 
    }
    return buffer;
  }

  private createPinkNoise(): AudioBuffer {
    if (!this.ctx) throw new Error("AudioContext not initialized");
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; 
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public play() {
    if (this.isPlaying) return;
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.value = this.volume;
    this.gainNode.connect(this.ctx.destination);

    switch (this.currentType) {
      case 'deep_focus':
        this.playDeepFocus();
        break;
      case 'rain':
        this.playRain();
        break;
      case 'ocean':
        this.playOcean();
        break;
      case 'bowl':
        this.playBowl();
        break;
    }

    this.isPlaying = true;
  }

  private playDeepFocus() {
    const noiseNode = this.ctx!.createBufferSource();
    noiseNode.buffer = this.createBrownNoise();
    noiseNode.loop = true;
    
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; 
    
    noiseNode.connect(filter);
    filter.connect(this.gainNode!);
    
    noiseNode.start();
    this.activeNodes.push(noiseNode, filter);
  }

  private playRain() {
    const noiseNode = this.ctx!.createBufferSource();
    noiseNode.buffer = this.createPinkNoise();
    noiseNode.loop = true;
    
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1000;
    
    // Slight modulation to simulate irregular rain intensity
    const lfo = this.ctx!.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.5; // Half Hz

    const lfoGain = this.ctx!.createGain();
    lfoGain.gain.value = 400; // Modulate frequency by 400hz
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noiseNode.connect(filter);
    filter.connect(this.gainNode!);
    
    noiseNode.start();
    lfo.start();
    this.activeNodes.push(noiseNode, filter, lfo, lfoGain);
  }

  private playOcean() {
    const noiseNode = this.ctx!.createBufferSource();
    noiseNode.buffer = this.createPinkNoise();
    noiseNode.loop = true;

    // Filter to shape the ocean sound
    const filter = this.ctx!.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 400; 

    // Slow LFO for waves crashing (approx 8s period)
    const lfo = this.ctx!.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.125; 

    const lfoGain = this.ctx!.createGain();
    lfoGain.gain.value = 600; // Sweep filter freq up to +600Hz
    
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    // Also modulate volume slightly with the waves
    const volLfoGain = this.ctx!.createGain();
    volLfoGain.gain.value = 0.5;
    lfo.connect(volLfoGain);
    
    const waveGain = this.ctx!.createGain();
    waveGain.gain.value = 0.5;
    volLfoGain.connect(waveGain.gain);

    noiseNode.connect(filter);
    filter.connect(waveGain);
    waveGain.connect(this.gainNode!);

    noiseNode.start();
    lfo.start();
    this.activeNodes.push(noiseNode, filter, lfo, lfoGain, volLfoGain, waveGain);
  }

  private playBowl() {
    // Singing bowl / flute drone (Zen meditation bowls)
    const frequencies = [220, 222, 329.63, 440]; // A3, Detuned A3, E4, A4
    
    frequencies.forEach((freq, index) => {
      const osc = this.ctx!.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const oscGain = this.ctx!.createGain();
      oscGain.gain.value = index < 2 ? 0.15 : 0.05; // Lower notes slightly louder
      
      // Slow LFO for breath/vibrato/beating
      const lfo = this.ctx!.createOscillator();
      lfo.type = 'sine';
      lfo.frequency.value = 0.1 + (Math.random() * 0.1); 
      
      const lfoGain = this.ctx!.createGain();
      lfoGain.gain.value = 0.05;
      
      lfo.connect(lfoGain);
      lfoGain.connect(oscGain.gain);
      
      osc.connect(oscGain);
      oscGain.connect(this.gainNode!);
      
      osc.start();
      lfo.start();
      this.activeNodes.push(osc, oscGain, lfo, lfoGain);
    });
  }

  public stop() {
    if (!this.isPlaying) return;
    this.activeNodes.forEach(node => {
      try {
        if (node instanceof AudioBufferSourceNode || node instanceof OscillatorNode) {
          node.stop();
        }
        node.disconnect();
      } catch (e) {
        // Ignore disconnect errors
      }
    });
    this.activeNodes = [];
    if (this.gainNode) {
      this.gainNode.disconnect();
    }
    this.isPlaying = false;
  }

  public setVolume(val: number) {
    this.volume = val;
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }
  
  public getIsPlaying() {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioGenerator();
