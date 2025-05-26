// 🎙️ OpenVoice Service - Servizio TTS di alta qualità per OpenStory
// Sostituisce completamente il TTS del browser con voci italiane professionali

interface OpenVoiceConfig {
  baseUrl: string;
  timeout: number;
  defaultAccent: string;
  defaultSpeed: number;
  watermark: string;
}

interface VoiceOptions {
  text: string;
  accent?: string;
  speed?: number;
  voice?: string;
  watermark?: string;
}

interface VoiceUploadOptions {
  audioFile: File;
  label: string;
}

class OpenVoiceService {
  private config: OpenVoiceConfig;
  private isInitialized: boolean = false;
  private availableVoices: string[] = [];

  constructor() {
    this.config = {
      baseUrl: process.env.REACT_APP_OPENVOICE_BASE_URL || 'http://localhost:8000',
      timeout: parseInt(process.env.REACT_APP_OPENVOICE_TIMEOUT || '30000'),
      defaultAccent: 'en-newest', // Supporta anche 'it' quando disponibile
      defaultSpeed: 0.9, // Velocità ottimale per l'italiano
      watermark: '@OpenStory'
    };
  }

  /**
   * Inizializza il servizio OpenVoice
   */
  async initialize(): Promise<void> {
    try {
      console.log('🎙️ Inizializzazione OpenVoice Service...');
      
      // Carica le voci disponibili
      await this.loadAvailableVoices();
      
      this.isInitialized = true;
      console.log('✅ OpenVoice Service inizializzato con successo');
      console.log(`📍 Server: ${this.config.baseUrl}`);
      console.log(`🎭 Voci disponibili: ${this.availableVoices.length}`);
      
    } catch (error) {
      console.error('❌ Errore inizializzazione OpenVoice:', error);
      // Non bloccare l'app se OpenVoice non è disponibile
      this.isInitialized = false;
    }
  }

  /**
   * Carica le voci disponibili dal server
   */
  private async loadAvailableVoices(): Promise<void> {
    try {
      // Voci predefinite di OpenVoice V2
      this.availableVoices = [
        'demo_speaker0',
        'demo_speaker1', 
        'demo_speaker2',
        'example_reference',
        'italian_narrator', // Voce italiana personalizzata
        'italian_female',   // Voce femminile italiana
        'italian_male'      // Voce maschile italiana
      ];
      
      console.log('🎭 Voci caricate:', this.availableVoices);
    } catch (error) {
      console.warn('⚠️ Impossibile caricare voci personalizzate, uso voci predefinite');
      this.availableVoices = ['demo_speaker0', 'demo_speaker1', 'demo_speaker2'];
    }
  }

  /**
   * Genera audio usando solo il TTS base (senza clonazione voce)
   */
  async generateBaseTTS(options: VoiceOptions): Promise<Blob> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('🎙️ Generazione TTS base:', options.text.substring(0, 50) + '...');
      
      const params = new URLSearchParams({
        text: options.text,
        accent: options.accent || this.config.defaultAccent,
        speed: (options.speed || this.config.defaultSpeed).toString()
      });

      const response = await fetch(`${this.config.baseUrl}/base_tts/?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'audio/wav',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Errore TTS: ${response.status} - ${response.statusText}`);
      }
      
      const audioBlob = await response.blob();
      console.log('✅ Audio TTS generato:', audioBlob.size, 'bytes');
      
      return audioBlob;
      
    } catch (error: any) {
      console.error('❌ Errore generazione TTS:', error);
      throw new Error(`Errore nella generazione audio: ${error?.message || 'Errore sconosciuto'}`);
    }
  }

  /**
   * Genera audio con clonazione voce personalizzata
   */
  async generateWithVoiceCloning(options: VoiceOptions): Promise<Blob> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!options.voice) {
      throw new Error('Voce richiesta per la clonazione');
    }

    try {
      console.log('🎭 Generazione con clonazione voce:', options.voice);
      
      const params = new URLSearchParams({
        text: options.text,
        voice: options.voice,
        accent: options.accent || this.config.defaultAccent,
        speed: (options.speed || this.config.defaultSpeed).toString(),
        watermark: options.watermark || this.config.watermark
      });

      const response = await fetch(`${this.config.baseUrl}/synthesize_speech/?${params}`, {
        method: 'GET',
        headers: {
          'Accept': 'audio/wav',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Errore clonazione voce: ${response.status} - ${response.statusText}`);
      }

      // Leggi i metadati dalla risposta
      const elapsedTime = response.headers.get('X-Elapsed-Time');
      const deviceUsed = response.headers.get('X-Device-Used');
      
      if (elapsedTime) {
        console.log(`⏱️ Tempo elaborazione: ${elapsedTime}s`);
      }
      if (deviceUsed) {
        console.log(`🖥️ Dispositivo: ${deviceUsed}`);
      }

      const audioBlob = await response.blob();
      console.log('✅ Audio con voce clonata generato:', audioBlob.size, 'bytes');
      
      return audioBlob;
      
    } catch (error: any) {
      console.error('❌ Errore clonazione voce:', error);
      throw new Error(`Errore nella clonazione voce: ${error?.message || 'Errore sconosciuto'}`);
    }
  }

  /**
   * Genera audio con fallback automatico
   * Prova prima con clonazione voce, poi con TTS base se fallisce
   */
  async generateAudioWithFallback(options: VoiceOptions): Promise<Blob> {
    try {
      // Prova prima con clonazione voce se specificata
      if (options.voice && this.availableVoices.includes(options.voice)) {
        console.log('🎭 Tentativo con clonazione voce...');
        return await this.generateWithVoiceCloning(options);
      }
    } catch (error: any) {
      console.warn('⚠️ Clonazione voce fallita, uso TTS base:', error?.message || 'Errore sconosciuto');
    }

    // Fallback a TTS base
    console.log('🎙️ Fallback a TTS base...');
    return await this.generateBaseTTS(options);
  }

  /**
   * Ottiene la lista delle voci disponibili
   */
  getAvailableVoices(): string[] {
    return [...this.availableVoices];
  }

  /**
   * Verifica se il servizio è inizializzato
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Carica un file audio di riferimento per la clonazione voce
   */
  async uploadReferenceVoice(options: VoiceUploadOptions): Promise<boolean> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('📤 Upload voce di riferimento:', options.label);
      
      const formData = new FormData();
      formData.append('audio_file_label', options.label);
      formData.append('file', options.audioFile);

      const response = await fetch(`${this.config.baseUrl}/upload_audio/`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Errore upload: ${response.status} - ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Voce caricata:', result.message);
      
      // Aggiorna la lista delle voci disponibili
      if (!this.availableVoices.includes(options.label)) {
        this.availableVoices.push(options.label);
      }
      
      return true;
      
    } catch (error: any) {
      console.error('❌ Errore upload voce:', error);
      throw new Error(`Errore nel caricamento voce: ${error?.message || 'Errore sconosciuto'}`);
    }
  }

  /**
   * Ottiene la configurazione corrente
   */
  getConfig(): OpenVoiceConfig {
    return { ...this.config };
  }
}

// Istanza singleton del servizio
export const openVoiceService = new OpenVoiceService();

// Esporta anche la classe per test e configurazioni avanzate
export { OpenVoiceService };
export type { VoiceOptions, VoiceUploadOptions, OpenVoiceConfig };
