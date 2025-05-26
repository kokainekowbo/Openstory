// 🎙️ Voice Service - Servizio unificato per narrazione vocale
// Sostituisce completamente il TTS del browser con OpenVoice

import { openVoiceService, VoiceOptions as OpenVoiceOptions } from './OpenVoiceService';

// Interfacce per compatibilità con il sistema esistente
export interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  language: string;
  isCustom?: boolean;
}

export interface VoiceOptions {
  voice?: string;
  accent?: 'en-newest' | 'en-us' | 'en-br' | 'en-au' | 'es' | 'fr' | 'it';
  speed?: number;
  emotion?: 'default' | 'excited' | 'cheerful' | 'friendly' | 'sad' | 'angry' | 'whispering' | 'shouting' | 'dramatic' | 'mysterious' | 'calm' | 'romantic';
  language?: string;
  gender?: 'male' | 'female' | 'auto';
  watermark?: string;
  stability?: number;
  similarity?: number;
  style?: number;
  pitch?: number;
  breathiness?: number;
  roughness?: number;
  speakerBoost?: boolean;
  useEnhancedModel?: boolean;
}

export interface NarrationResponse {
  success: boolean;
  audioUrl?: string;
  audioBlob?: Blob;
  duration?: number;
  elapsedTime?: number;
  deviceUsed?: string;
  error?: string;
}

class VoiceService {
  private static instance: VoiceService;
  private isInitialized: boolean = false;
  private availableVoices: VoiceProfile[] = [];

  private constructor() {}

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  /**
   * Inizializza il servizio vocale
   */
  async initialize(): Promise<void> {
    try {
      console.log('🎙️ Inizializzazione Voice Service...');
      
      // Inizializza OpenVoice
      await openVoiceService.initialize();
      
      // Carica le voci disponibili
      await this.loadVoiceProfiles();
      
      this.isInitialized = true;
      console.log('✅ Voice Service inizializzato con successo');
      console.log(`🎭 Profili vocali disponibili: ${this.availableVoices.length}`);
      
    } catch (error: any) {
      console.error('❌ Errore inizializzazione Voice Service:', error);
      // Carica almeno le voci di fallback
      this.loadFallbackVoices();
      this.isInitialized = true;
    }
  }

  /**
   * Carica i profili vocali disponibili
   */
  private async loadVoiceProfiles(): Promise<void> {
    try {
      const openVoiceVoices = openVoiceService.getAvailableVoices();
      
      this.availableVoices = [
        {
          id: 'demo_speaker0',
          name: 'Narratore Professionale',
          description: 'Voce maschile professionale per narrazioni',
          gender: 'male',
          accent: 'en-newest',
          language: 'en'
        },
        {
          id: 'demo_speaker1',
          name: 'Narratrice Elegante',
          description: 'Voce femminile elegante e chiara',
          gender: 'female',
          accent: 'en-newest',
          language: 'en'
        },
        {
          id: 'demo_speaker2',
          name: 'Voce Drammatica',
          description: 'Voce espressiva per storie drammatiche',
          gender: 'neutral',
          accent: 'en-newest',
          language: 'en'
        },
        {
          id: 'italian_narrator',
          name: 'Narratore Italiano',
          description: 'Voce italiana maschile naturale',
          gender: 'male',
          accent: 'it',
          language: 'it'
        },
        {
          id: 'italian_female',
          name: 'Narratrice Italiana',
          description: 'Voce italiana femminile dolce',
          gender: 'female',
          accent: 'it',
          language: 'it'
        },
        {
          id: 'italian_male',
          name: 'Voce Italiana Profonda',
          description: 'Voce italiana maschile profonda',
          gender: 'male',
          accent: 'it',
          language: 'it'
        },
        {
          id: 'example_reference',
          name: 'Voce di Riferimento',
          description: 'Voce di esempio per test',
          gender: 'neutral',
          accent: 'en-newest',
          language: 'en'
        }
      ];

      console.log('🎭 Profili vocali caricati:', this.availableVoices.length);
      
    } catch (error: any) {
      console.warn('⚠️ Errore caricamento profili vocali:', error?.message);
      this.loadFallbackVoices();
    }
  }

  /**
   * Carica voci di fallback se OpenVoice non è disponibile
   */
  private loadFallbackVoices(): void {
    this.availableVoices = [
      {
        id: 'fallback_narrator',
        name: 'Narratore di Base',
        description: 'Voce di fallback per narrazioni',
        gender: 'neutral',
        accent: 'en-newest',
        language: 'en'
      }
    ];
    console.log('🔄 Voci di fallback caricate');
  }

  /**
   * Genera narrazione vocale per una storia
   */
  async narrateStory(text: string, options: VoiceOptions = {}): Promise<NarrationResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      console.log('🎙️ Inizio narrazione storia...');
      console.log(`📝 Testo: ${text.substring(0, 100)}...`);
      console.log('🎛️ Opzioni:', options);

      // Prepara le opzioni per OpenVoice
      const openVoiceOptions: OpenVoiceOptions = {
        text: this.preprocessText(text),
        accent: options.accent || 'it', // Default italiano
        speed: options.speed || 0.9, // Leggermente più lenta per naturalezza
        voice: options.voice,
        watermark: options.watermark || '@OpenStory'
      };

      // Genera audio con OpenVoice
      let audioBlob: Blob;
      
      if (openVoiceService.isReady()) {
        audioBlob = await openVoiceService.generateAudioWithFallback(openVoiceOptions);
      } else {
        throw new Error('OpenVoice non disponibile');
      }

      // Crea URL per l'audio
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const elapsedTime = (Date.now() - startTime) / 1000;
      const duration = this.estimateAudioDuration(text, options.speed || 0.9);

      console.log(`✅ Narrazione completata in ${elapsedTime.toFixed(1)}s`);
      console.log(`🎵 Audio generato: ${audioBlob.size} bytes`);

      return {
        success: true,
        audioUrl,
        audioBlob,
        duration,
        elapsedTime,
        deviceUsed: 'OpenVoice-Server'
      };

    } catch (error: any) {
      console.error('❌ Errore narrazione:', error);
      
      const elapsedTime = (Date.now() - startTime) / 1000;
      
      return {
        success: false,
        error: error?.message || 'Errore durante la narrazione',
        elapsedTime
      };
    }
  }

  /**
   * Genera voce clonata da file audio di riferimento
   */
  async generateClonedVoice(
    text: string, 
    referenceAudioFile: File, 
    options: VoiceOptions = {}
  ): Promise<NarrationResponse> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const startTime = Date.now();

    try {
      console.log('🎭 Inizio clonazione voce...');
      console.log(`📁 File di riferimento: ${referenceAudioFile.name}`);

      if (!openVoiceService.isReady()) {
        throw new Error('OpenVoice non disponibile per clonazione voce');
      }

      // Carica il file di riferimento
      const voiceLabel = `custom_voice_${Date.now()}`;
      await openVoiceService.uploadReferenceVoice({
        audioFile: referenceAudioFile,
        label: voiceLabel
      });

      // Genera audio con voce clonata
      const openVoiceOptions: OpenVoiceOptions = {
        text: this.preprocessText(text),
        accent: options.accent || 'it',
        speed: options.speed || 0.9,
        voice: voiceLabel,
        watermark: options.watermark || '@OpenStory'
      };

      const audioBlob = await openVoiceService.generateWithVoiceCloning(openVoiceOptions);
      const audioUrl = URL.createObjectURL(audioBlob);
      
      const elapsedTime = (Date.now() - startTime) / 1000;
      const duration = this.estimateAudioDuration(text, options.speed || 0.9);

      console.log(`✅ Clonazione voce completata in ${elapsedTime.toFixed(1)}s`);

      return {
        success: true,
        audioUrl,
        audioBlob,
        duration,
        elapsedTime,
        deviceUsed: 'OpenVoice-Cloning'
      };

    } catch (error: any) {
      console.error('❌ Errore clonazione voce:', error);
      
      const elapsedTime = (Date.now() - startTime) / 1000;
      
      return {
        success: false,
        error: error?.message || 'Errore durante la clonazione voce',
        elapsedTime
      };
    }
  }

  /**
   * Preprocessa il testo per ottimizzare la narrazione
   */
  private preprocessText(text: string): string {
    return text
      // Rimuove caratteri speciali che potrebbero causare problemi
      .replace(/[^\w\s\.,!?;:'"()-]/g, '')
      // Normalizza spazi multipli
      .replace(/\s+/g, ' ')
      // Aggiunge pause naturali
      .replace(/\./g, '. ')
      .replace(/,/g, ', ')
      .replace(/;/g, '; ')
      .replace(/:/g, ': ')
      .replace(/!/g, '! ')
      .replace(/\?/g, '? ')
      // Rimuove spazi extra
      .trim();
  }

  /**
   * Stima la durata dell'audio basata sul testo
   */
  private estimateAudioDuration(text: string, speed: number = 1.0): number {
    // Stima: circa 150 parole al minuto per velocità normale
    const wordsPerMinute = 150 * speed;
    const wordCount = text.split(/\s+/).length;
    return (wordCount / wordsPerMinute) * 60; // Durata in secondi
  }

  /**
   * Scarica un file audio
   */
  downloadAudio(audioBlob: Blob, filename: string): void {
    try {
      const url = URL.createObjectURL(audioBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log(`📥 Audio scaricato: ${filename}`);
    } catch (error: any) {
      console.error('❌ Errore download audio:', error);
    }
  }

  /**
   * Ottiene i profili vocali disponibili
   */
  getAvailableVoices(): VoiceProfile[] {
    return [...this.availableVoices];
  }

  /**
   * Verifica se il servizio è pronto
   */
  isReady(): boolean {
    return this.isInitialized;
  }

  /**
   * Ottiene informazioni sullo stato del servizio
   */
  getServiceStatus(): {
    isReady: boolean;
    openVoiceReady: boolean;
    voicesCount: number;
  } {
    return {
      isReady: this.isInitialized,
      openVoiceReady: openVoiceService.isReady(),
      voicesCount: this.availableVoices.length
    };
  }
}

// Istanza singleton
const voiceService = VoiceService.getInstance();

// Esporta il servizio e le interfacce
export default voiceService;
export { VoiceService };

// Compatibilità con il vecchio OpenVoiceService
export const OpenVoiceService = {
  narrateStory: (text: string, options: VoiceOptions = {}) => voiceService.narrateStory(text, options),
  generateClonedVoice: (text: string, file: File, options: VoiceOptions = {}) => voiceService.generateClonedVoice(text, file, options),
  downloadAudio: (blob: Blob, filename: string) => voiceService.downloadAudio(blob, filename),
  getAvailableVoices: () => voiceService.getAvailableVoices(),
  isReady: () => voiceService.isReady()
}; 