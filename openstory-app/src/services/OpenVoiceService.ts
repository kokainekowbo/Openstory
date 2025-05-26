// 🎙️ OPENVOICE SERVICE - Servizio per Narrazione Vocale delle Storie
// Integrazione con OpenVoice per sintesi vocale avanzata e voice cloning

import { environment } from '../config/environment';

export interface VoiceOptions {
  voice?: string;
  accent?: 'en-au' | 'en-br' | 'en-default' | 'en-india' | 'en-newest' | 'en-us' | 'es' | 'fr' | 'jp' | 'kr' | 'zh' | 'it' | 'de' | 'pt' | 'ru';
  speed?: number;
  language?: string;
  emotion?: 'default' | 'whispering' | 'shouting' | 'excited' | 'cheerful' | 'terrified' | 'angry' | 'sad' | 'friendly' | 'dramatic' | 'mysterious' | 'romantic' | 'epic' | 'calm' | 'energetic';
  watermark?: string;
  // Nuove opzioni per voci ultra-realistiche
  gender?: 'male' | 'female' | 'auto';
  age?: 'young' | 'adult' | 'mature' | 'auto';
  pitch?: number; // -20 a +20
  breathiness?: number; // 0.0 a 1.0
  roughness?: number; // 0.0 a 1.0
  stability?: number; // 0.0 a 1.0 (più alto = più stabile)
  similarity?: number; // 0.0 a 1.0 (somiglianza alla voce di riferimento)
  style?: number; // 0.0 a 1.0 (intensità dello stile)
  speakerBoost?: boolean; // Migliora la chiarezza del parlato
  useEnhancedModel?: boolean; // Usa modello AI più avanzato
}

export interface NarrationRequest {
  text: string;
  options: VoiceOptions;
  useVoiceCloning?: boolean;
  referenceVoice?: File | string;
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

export interface VoiceProfile {
  id: string;
  name: string;
  description: string;
  language: string;
  gender: 'male' | 'female' | 'neutral';
  accent: string;
  sample?: string;
  isCustom: boolean;
  // Nuove proprietà per voci realistiche
  naturalness?: number; // Livello di naturalezza 0-100
  emotionalRange?: string[]; // Emozioni supportate
  ageRange?: string; // Fascia d'età
  voiceCharacteristics?: {
    pitch: number;
    breathiness: number;
    roughness: number;
    stability: number;
  };
}

export class OpenVoiceService {
  private static readonly API_BASE_URL = environment.openVoiceApiUrl;
  private static readonly FALLBACK_BROWSER_TTS = environment.enableBrowserTTSFallback;
  
  // Configurazioni ottimali per voci ultra-realistiche
  private static readonly ULTRA_REALISTIC_SETTINGS = {
    stability: 0.85,
    similarity: 0.90,
    style: 0.75,
    speakerBoost: true,
    useEnhancedModel: true,
    breathiness: 0.15,
    roughness: 0.05
  };

  // Mappatura lingue per rilevamento automatico
  private static readonly LANGUAGE_PATTERNS = {
    'it': /\b(il|la|di|da|in|con|per|una|uno|che|non|sono|essere|avere|fare|dire|andare|vedere|sapere|dare|stare|volere|dovere|potere|grande|nuovo|primo|ultimo|buono|stesso|molto|tutto|altro|ogni|quale|questo|quello|mio|tuo|suo|nostro|vostro|loro)\b/gi,
    'en': /\b(the|be|to|of|and|a|in|that|have|i|it|for|not|on|with|he|as|you|do|at|this|but|his|by|from|they|she|or|an|will|my|one|all|would|there|their|what|so|up|out|if|about|who|get|which|go|me|when|make|can|like|time|no|just|him|know|take|people|into|year|your|good|some|could|them|see|other|than|then|now|look|only|come|its|over|think|also|back|after|use|two|how|our|work|first|well|way|even|new|want|because|any|these|give|day|most|us)\b/gi,
    'es': /\b(el|la|de|que|y|a|en|un|ser|se|no|te|lo|le|da|su|por|son|con|para|al|una|sobre|todo|pero|más|hacer|muy|puede|tiempo|si|ver|estar|tener|le|ya|me|cuando|mucho|hay|también|donde|porque|antes|bien|bajo|hasta|mientras|sin|entre|durante|tanto|poco|mismo|cada|algo|nada|alguien|nadie|siempre|nunca|aquí|allí|ahora|entonces|después|luego|pronto|tarde|hoy|ayer|mañana)\b/gi,
    'fr': /\b(le|de|et|à|un|il|être|et|en|avoir|que|pour|dans|ce|son|une|sur|avec|ne|se|pas|tout|plus|par|grand|si|me|mais|du|te|nous|comme|vous|les|leur|elle|ses|temps|très|ma|ta|sa|notre|votre|faire|aller|voir|savoir|pouvoir|falloir|venir|dire|prendre|donner|mettre|tenir|sembler|laisser|devenir|rester|tomber|naître|mourir|partir|sortir|entrer|monter|descendre)\b/gi,
    'de': /\b(der|die|und|in|den|von|zu|das|mit|sich|des|auf|für|ist|im|dem|nicht|ein|eine|als|auch|es|an|werden|aus|er|hat|dass|sie|nach|wird|bei|einer|um|am|sind|noch|wie|einem|über|einen|so|zum|war|haben|nur|oder|aber|vor|zur|bis|unter|während|ohne|durch|gegen|zwischen|seit|trotz|wegen|statt|außer|innerhalb|außerhalb|oberhalb|unterhalb|diesseits|jenseits|links|rechts|neben|hinter|vor|über|unter|in|an|auf|zu|nach|von|aus|bei|mit|ohne|durch|für|gegen|um|während|seit|bis|trotz|wegen|statt)\b/gi,
    'pt': /\b(o|a|de|que|e|do|da|em|um|para|com|não|uma|os|no|se|na|por|mais|as|dos|como|mas|foi|ao|ele|das|tem|à|seu|sua|ou|ser|quando|muito|há|nos|já|está|eu|também|só|pelo|pela|até|isso|ela|entre|era|depois|sem|mesmo|aos|ter|seus|suas|numa|pelos|pelas|esse|esses|essa|essas|dele|dela|deles|delas|este|esta|estes|estas|aquele|aquela|aqueles|aquelas|cujo|cuja|cujos|cujas)\b/gi,
    'ru': /\b(в|и|не|на|я|быть|то|он|оно|как|мы|от|ты|из|за|весь|а|по|это|она|так|его|но|да|ты|к|у|же|вы|теперь|когда|даже|ну|вот|только|после|все|время|очень|еще|сейчас|здесь|думать|два|год|говорить|наш|для|об|один|такой|знать|дело|ведь|тут|где|там|чем|более|разный|сам|маленький|большой|хороший|новый|молодой|старый|русский|белый|черный|красный|зеленый|синий|желтый)\b/gi
  };

  // Voci ottimizzate per massimo realismo
  private static readonly ULTRA_REALISTIC_VOICES: VoiceProfile[] = [
    // Voci Italiane Ultra-Realistiche
    {
      id: 'it_marco_neural',
      name: 'Marco - Narratore Italiano Professionale',
      description: 'Voce maschile italiana estremamente naturale, perfetta per narrazioni',
      language: 'it',
      gender: 'male',
      accent: 'it',
      isCustom: false,
      naturalness: 98,
      emotionalRange: ['calm', 'dramatic', 'mysterious', 'epic'],
      ageRange: 'adult',
      voiceCharacteristics: {
        pitch: 0,
        breathiness: 0.12,
        roughness: 0.03,
        stability: 0.92
      }
    },
    {
      id: 'it_sofia_neural',
      name: 'Sofia - Narratrice Italiana Elegante',
      description: 'Voce femminile italiana sofisticata e coinvolgente',
      language: 'it',
      gender: 'female',
      accent: 'it',
      isCustom: false,
      naturalness: 97,
      emotionalRange: ['romantic', 'dramatic', 'cheerful', 'mysterious'],
      ageRange: 'adult',
      voiceCharacteristics: {
        pitch: 5,
        breathiness: 0.18,
        roughness: 0.02,
        stability: 0.89
      }
    },
    // Voci Inglesi Ultra-Realistiche
    {
      id: 'en_david_neural',
      name: 'David - Narratore Inglese Cinematografico',
      description: 'Voce maschile inglese con qualità cinematografica',
      language: 'en',
      gender: 'male',
      accent: 'en-newest',
      isCustom: false,
      naturalness: 99,
      emotionalRange: ['epic', 'dramatic', 'mysterious', 'calm'],
      ageRange: 'mature',
      voiceCharacteristics: {
        pitch: -2,
        breathiness: 0.10,
        roughness: 0.08,
        stability: 0.95
      }
    },
    {
      id: 'en_emma_neural',
      name: 'Emma - Narratrice Inglese Espressiva',
      description: 'Voce femminile inglese incredibilmente espressiva',
      language: 'en',
      gender: 'female',
      accent: 'en-br',
      isCustom: false,
      naturalness: 98,
      emotionalRange: ['cheerful', 'dramatic', 'romantic', 'energetic'],
      ageRange: 'young',
      voiceCharacteristics: {
        pitch: 8,
        breathiness: 0.20,
        roughness: 0.01,
        stability: 0.87
      }
    },
    // Voci Spagnole Ultra-Realistiche
    {
      id: 'es_carlos_neural',
      name: 'Carlos - Narrador Español Apasionado',
      description: 'Voce maschile spagnola calda e appassionata',
      language: 'es',
      gender: 'male',
      accent: 'es',
      isCustom: false,
      naturalness: 96,
      emotionalRange: ['dramatic', 'romantic', 'energetic', 'epic'],
      ageRange: 'adult',
      voiceCharacteristics: {
        pitch: 3,
        breathiness: 0.15,
        roughness: 0.06,
        stability: 0.88
      }
    },
    {
      id: 'es_lucia_neural',
      name: 'Lucía - Narratrice Spagnola Melodiosa',
      description: 'Voce femminile spagnola melodiosa e coinvolgente',
      language: 'es',
      gender: 'female',
      accent: 'es',
      isCustom: false,
      naturalness: 97,
      emotionalRange: ['romantic', 'cheerful', 'dramatic', 'calm'],
      ageRange: 'young',
      voiceCharacteristics: {
        pitch: 7,
        breathiness: 0.22,
        roughness: 0.02,
        stability: 0.85
      }
    },
    // Voci Francesi Ultra-Realistiche
    {
      id: 'fr_pierre_neural',
      name: 'Pierre - Narrateur Français Raffiné',
      description: 'Voce maschile francese raffinata e sofisticata',
      language: 'fr',
      gender: 'male',
      accent: 'fr',
      isCustom: false,
      naturalness: 95,
      emotionalRange: ['romantic', 'dramatic', 'mysterious', 'calm'],
      ageRange: 'mature',
      voiceCharacteristics: {
        pitch: -1,
        breathiness: 0.13,
        roughness: 0.04,
        stability: 0.91
      }
    },
    {
      id: 'fr_marie_neural',
      name: 'Marie - Narratrice Francese Seducente',
      description: 'Voce femminile francese seducente e espressiva',
      language: 'fr',
      gender: 'female',
      accent: 'fr',
      isCustom: false,
      naturalness: 96,
      emotionalRange: ['romantic', 'mysterious', 'cheerful', 'dramatic'],
      ageRange: 'adult',
      voiceCharacteristics: {
        pitch: 6,
        breathiness: 0.25,
        roughness: 0.01,
        stability: 0.83
      }
    }
  ];

  /**
   * Rileva automaticamente la lingua del testo
   */
  static detectLanguage(text: string): string {
    const cleanText = text.toLowerCase().replace(/[^\w\s]/g, ' ');
    const scores: Record<string, number> = {};
    
    for (const [lang, pattern] of Object.entries(this.LANGUAGE_PATTERNS)) {
      const matches = cleanText.match(pattern);
      scores[lang] = matches ? matches.length : 0;
    }
    
    // Trova la lingua con il punteggio più alto
    const detectedLang = Object.entries(scores).reduce((a, b) => 
      scores[a[0]] > scores[b[0]] ? a : b
    )[0];
    
    console.log(`🌍 Lingua rilevata: ${detectedLang} (punteggi: ${JSON.stringify(scores)})`);
    return detectedLang;
  }

  /**
   * Seleziona automaticamente la voce ottimale in base al contenuto
   */
  static selectOptimalVoice(
    text: string, 
    preferredGender: 'male' | 'female' | 'auto' = 'auto',
    storyGenre?: string,
    sectionType?: string
  ): VoiceProfile {
    const language = this.detectLanguage(text);
    const availableVoices = this.ULTRA_REALISTIC_VOICES.filter(v => v.language === language);
    
    if (availableVoices.length === 0) {
      // Fallback a voci inglesi se la lingua non è supportata
      return this.ULTRA_REALISTIC_VOICES.find(v => v.language === 'en' && v.gender === 'male') || this.ULTRA_REALISTIC_VOICES[0];
    }

    // Analisi del contenuto per determinare il genere automaticamente
    let targetGender = preferredGender;
    if (preferredGender === 'auto') {
      targetGender = this.analyzeContentForGender(text, storyGenre);
    }

    // Filtra per genere
    const genderFilteredVoices = availableVoices.filter(v => 
      targetGender === 'auto' ? true : v.gender === targetGender
    );

    // Seleziona in base al tipo di sezione e genere
    const finalVoices = genderFilteredVoices.length > 0 ? genderFilteredVoices : availableVoices;
    
    // Logica di selezione intelligente
    if (sectionType) {
      const sectionPreferences: Record<string, string[]> = {
        'prologo': ['mysterious', 'dramatic', 'calm'],
        'atto1': ['energetic', 'cheerful', 'epic'],
        'atto2': ['dramatic', 'epic', 'mysterious'],
        'atto3': ['epic', 'dramatic', 'energetic'],
        'epilogo': ['calm', 'romantic', 'cheerful']
      };
      
      const preferredEmotions = sectionPreferences[sectionType] || ['dramatic'];
      const emotionalMatch = finalVoices.find(v => 
        v.emotionalRange?.some(emotion => preferredEmotions.includes(emotion))
      );
      
      if (emotionalMatch) return emotionalMatch;
    }

    // Seleziona la voce con naturalezza più alta
    return finalVoices.reduce((best, current) => 
      (current.naturalness || 0) > (best.naturalness || 0) ? current : best
    );
  }

  /**
   * Analizza il contenuto per determinare il genere della voce più appropriato
   */
  private static analyzeContentForGender(text: string, genre?: string): 'male' | 'female' {
    const maleIndicators = /\b(eroe|guerriero|re|principe|cavaliere|soldato|capitano|generale|padre|nonno|fratello|figlio|uomo|maschio|lui|suo|action|avventura|guerra|battaglia|combattimento)\b/gi;
    const femaleIndicators = /\b(eroina|guerriera|regina|principessa|dama|soldatessa|madre|nonna|sorella|figlia|donna|femmina|lei|sua|romance|romantico|amore|famiglia|emozione|sentimento)\b/gi;
    
    const maleMatches = (text.match(maleIndicators) || []).length;
    const femaleMatches = (text.match(femaleIndicators) || []).length;
    
    // Considera anche il genere della storia
    if (genre) {
      const genreMalePreference = /action|thriller|guerra|avventura|fantasy|epico/i.test(genre);
      const genreFemalePreference = /romance|drammatico|famiglia|emotivo|romantico/i.test(genre);
      
      if (genreMalePreference) return 'male';
      if (genreFemalePreference) return 'female';
    }
    
    // Default basato sull'analisi del testo
    return femaleMatches > maleMatches ? 'female' : 'male';
  }

  /**
   * Genera opzioni vocali ottimizzate per massimo realismo
   */
  static generateOptimalVoiceOptions(
    text: string,
    selectedVoice: VoiceProfile,
    sectionType?: string,
    storyGenre?: string,
    customOptions?: Partial<VoiceOptions>
  ): VoiceOptions {
    const baseOptions: VoiceOptions = {
      ...this.ULTRA_REALISTIC_SETTINGS,
      voice: selectedVoice.id,
      language: selectedVoice.language,
      accent: selectedVoice.accent as any,
      gender: selectedVoice.gender === 'neutral' ? 'auto' : selectedVoice.gender,
      ...selectedVoice.voiceCharacteristics
    };

    // Adatta velocità in base alla sezione
    const sectionSpeedMap: Record<string, number> = {
      'prologo': 0.85,
      'atto1': 0.95,
      'atto2': 1.0,
      'atto3': 1.05,
      'epilogo': 0.80
    };
    
    if (sectionType && sectionSpeedMap[sectionType]) {
      baseOptions.speed = sectionSpeedMap[sectionType];
    }

    // Adatta emozione in base al contenuto
    const emotion = this.detectOptimalEmotion(text, sectionType, storyGenre);
    baseOptions.emotion = emotion;

    // Applica personalizzazioni
    return {
      ...baseOptions,
      ...customOptions
    };
  }

  /**
   * Rileva l'emozione ottimale per il testo
   */
  private static detectOptimalEmotion(
    text: string, 
    sectionType?: string, 
    genre?: string
  ): VoiceOptions['emotion'] {
    const emotionKeywords = {
      'dramatic': /drammatico|intenso|conflitto|tensione|crisi|pericolo|minaccia/gi,
      'mysterious': /mistero|segreto|nascosto|ombra|enigma|arcano|inspiegabile/gi,
      'romantic': /amore|cuore|bacio|passione|romantico|dolce|tenerezza/gi,
      'epic': /epico|grandioso|maestoso|leggendario|eroico|glorioso|trionfo/gi,
      'terrified': /paura|terrore|spavento|orrore|incubo|minaccia|pericolo/gi,
      'cheerful': /gioia|felice|allegro|sorriso|risata|festa|celebrazione/gi,
      'sad': /tristezza|dolore|pianto|lutto|perdita|malinconia|sofferenza/gi,
      'angry': /rabbia|furore|ira|collera|indignazione|vendetta|odio/gi,
      'excited': /eccitazione|entusiasmo|energia|vivacità|dinamismo|adrenalina/gi,
      'calm': /calma|pace|serenità|tranquillità|rilassamento|meditazione/gi
    };

    let maxScore = 0;
    let detectedEmotion: VoiceOptions['emotion'] = 'default';

    for (const [emotion, pattern] of Object.entries(emotionKeywords)) {
      const matches = (text.match(pattern) || []).length;
      if (matches > maxScore) {
        maxScore = matches;
        detectedEmotion = emotion as VoiceOptions['emotion'];
      }
    }

    // Considera il tipo di sezione
    if (sectionType && maxScore === 0) {
      const sectionEmotions: Record<string, VoiceOptions['emotion']> = {
        'prologo': 'mysterious',
        'atto1': 'excited',
        'atto2': 'dramatic',
        'atto3': 'epic',
        'epilogo': 'calm'
      };
      detectedEmotion = sectionEmotions[sectionType] || 'default';
    }

    // Considera il genere
    if (genre && maxScore === 0) {
      const genreEmotions: Record<string, VoiceOptions['emotion']> = {
        'horror': 'terrified',
        'thriller': 'mysterious',
        'romance': 'romantic',
        'action': 'excited',
        'drama': 'dramatic',
        'fantasy': 'epic',
        'comedy': 'cheerful'
      };
      
      for (const [genreKey, emotion] of Object.entries(genreEmotions)) {
        if (genre.toLowerCase().includes(genreKey)) {
          detectedEmotion = emotion;
          break;
        }
      }
    }

    console.log(`🎭 Emozione rilevata: ${detectedEmotion} (punteggio: ${maxScore})`);
    return detectedEmotion;
  }

  /**
   * Genera narrazione vocale per una storia completa
   */
  static async narrateStory(
    story: string,
    options: VoiceOptions = {}
  ): Promise<NarrationResponse> {
    console.log('🎙️ Inizio narrazione storia con OpenVoice...');
    
    try {
      // Verifica disponibilità servizio OpenVoice
      const isServiceAvailable = await this.checkServiceAvailability();
      
      if (!isServiceAvailable && this.FALLBACK_BROWSER_TTS) {
        console.log('⚠️ OpenVoice non disponibile, uso TTS browser...');
        return this.fallbackBrowserTTS(story, options);
      }
      
      if (!isServiceAvailable) {
        throw new Error('Servizio OpenVoice non disponibile');
      }

      // Prepara il testo per la narrazione
      const processedText = this.preprocessStoryText(story);
      
      // Chiama API OpenVoice
      const response = await this.callOpenVoiceAPI(processedText, options);
      
      return response;
      
    } catch (error: any) {
      console.error('❌ Errore narrazione OpenVoice:', error);
      
      // Fallback al TTS del browser se abilitato
      if (this.FALLBACK_BROWSER_TTS) {
        console.log('🔄 Fallback a TTS browser...');
        return this.fallbackBrowserTTS(story, options);
      }
      
      return {
        success: false,
        error: error.message || 'Errore durante la narrazione'
      };
    }
  }

  /**
   * Genera narrazione per sezioni specifiche della storia
   */
  static async narrateSection(
    sectionText: string,
    sectionType: 'prologo' | 'atto1' | 'atto2' | 'atto3' | 'epilogo',
    options: VoiceOptions = {}
  ): Promise<NarrationResponse> {
    console.log(`🎙️ Narrazione sezione: ${sectionType}`);
    
    // Adatta le opzioni vocali in base al tipo di sezione
    const adaptedOptions = this.adaptVoiceForSection(sectionType, options);
    
    return this.narrateStory(sectionText, adaptedOptions);
  }

  /**
   * Carica una voce personalizzata
   */
  static async uploadCustomVoice(
    audioFile: File,
    voiceLabel: string
  ): Promise<{ success: boolean; voiceId?: string; error?: string }> {
    try {
      console.log(`🎙️ Caricamento voce personalizzata: ${voiceLabel}`);
      
      const formData = new FormData();
      formData.append('audio_file_label', voiceLabel);
      formData.append('file', audioFile);
      
      const response = await fetch(`${this.API_BASE_URL}/upload_audio/`, {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await response.json();
      
      return {
        success: true,
        voiceId: voiceLabel
      };
      
    } catch (error: any) {
      console.error('❌ Errore caricamento voce:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Ottiene lista delle voci disponibili
   */
  static getAvailableVoices(): VoiceProfile[] {
    // In futuro potremmo chiamare un endpoint per ottenere voci dinamiche
    return [...this.ULTRA_REALISTIC_VOICES];
  }

  /**
   * Genera voce clonata da un file di riferimento
   */
  static async generateClonedVoice(
    text: string,
    referenceAudio: File,
    options: VoiceOptions = {}
  ): Promise<NarrationResponse> {
    try {
      console.log('🎙️ Generazione voce clonata...');
      
      // Prima carica il file di riferimento
      const uploadResult = await this.uploadCustomVoice(
        referenceAudio, 
        `temp_${Date.now()}`
      );
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.error);
      }
      
      // Poi genera la narrazione con la voce clonata
      return this.narrateStory(text, {
        ...options,
        voice: uploadResult.voiceId
      });
      
    } catch (error: any) {
      console.error('❌ Errore voice cloning:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 🔧 METODI PRIVATI

  /**
   * Verifica disponibilità del servizio OpenVoice
   */
  private static async checkServiceAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/health`, {
        method: 'GET',
        timeout: 5000
      } as any);
      
      return response.ok;
    } catch (error) {
      console.warn('⚠️ Servizio OpenVoice non raggiungibile');
      return false;
    }
  }

  /**
   * Chiama l'API OpenVoice per la sintesi vocale con ottimizzazioni italiane
   */
  private static async callOpenVoiceAPI(
    text: string,
    options: VoiceOptions
  ): Promise<NarrationResponse> {
    const startTime = Date.now();
    
    try {
      console.log('🎙️ Chiamata API OpenVoice con opzioni:', options);
      
      // Rileva automaticamente la lingua se non specificata
      const detectedLanguage = options.language || this.detectLanguage(text);
      console.log(`🌍 Lingua rilevata/specificata: ${detectedLanguage}`);
      
      // Seleziona automaticamente la voce ottimale se non specificata
      let selectedVoice = options.voice;
      if (!selectedVoice) {
        const optimalVoice = this.selectOptimalVoice(text, options.gender);
        selectedVoice = optimalVoice.id;
        console.log(`🎭 Voce auto-selezionata: ${optimalVoice.name}`);
      }
      
      // Ottimizza accent per la lingua rilevata
      let optimizedAccent: VoiceOptions['accent'] = options.accent;
      if (!optimizedAccent) {
        const accentMap: Record<string, VoiceOptions['accent']> = {
          'it': 'it',
          'en': 'en-newest',
          'es': 'es',
          'fr': 'fr',
          'de': 'de',
          'pt': 'pt',
          'ru': 'ru'
        };
        optimizedAccent = accentMap[detectedLanguage] || 'it';
      }
      
      console.log(`🗣️ Accent ottimizzato: ${optimizedAccent}`);
      
      // Prepara parametri ottimizzati
      const params = new URLSearchParams();
      params.append('text', text);
      params.append('accent', optimizedAccent || 'it');
      params.append('speed', (options.speed || 0.9).toString()); // Leggermente più lenta per naturalezza
      params.append('watermark', options.watermark || '@OpenStory');
      params.append('language', detectedLanguage);
      
      // Aggiungi parametri avanzati se disponibili
      if (options.emotion && options.emotion !== 'default') {
        params.append('emotion', options.emotion);
      }
      
      if (options.stability !== undefined) {
        params.append('stability', options.stability.toString());
      }
      
      if (options.similarity !== undefined) {
        params.append('similarity', options.similarity.toString());
      }
      
      if (options.style !== undefined) {
        params.append('style', options.style.toString());
      }
      
      if (options.pitch !== undefined && options.pitch !== 0) {
        params.append('pitch', options.pitch.toString());
      }
      
      if (options.breathiness !== undefined) {
        params.append('breathiness', options.breathiness.toString());
      }
      
      if (options.roughness !== undefined) {
        params.append('roughness', options.roughness.toString());
      }
      
      if (options.speakerBoost) {
        params.append('speaker_boost', 'true');
      }
      
      if (options.useEnhancedModel) {
        params.append('enhanced_model', 'true');
      }
      
      // Usa endpoint diverso se è specificata una voce personalizzata
      const endpoint = selectedVoice 
        ? `/synthesize_speech/?${params}&voice=${selectedVoice}`
        : `/base_tts/?${params}`;
      
      console.log(`🔗 Endpoint: ${this.API_BASE_URL}${endpoint}`);
      
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'audio/wav',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Errore API OpenVoice: ${response.status} - ${errorText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
      }
      
      const audioBlob = await response.blob();
      
      if (audioBlob.size === 0) {
        throw new Error('Audio blob vuoto ricevuto dall\'API');
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log(`✅ Audio generato: ${audioBlob.size} bytes`);
      
      // Estrai metadati dalla risposta
      const elapsedTime = response.headers.get('x-elapsed-time');
      const deviceUsed = response.headers.get('x-device-used');
      
      return {
        success: true,
        audioUrl,
        audioBlob,
        duration: await this.getAudioDuration(audioBlob),
        elapsedTime: elapsedTime ? parseFloat(elapsedTime) : (Date.now() - startTime) / 1000,
        deviceUsed: deviceUsed || 'openvoice-api'
      };
      
    } catch (error: any) {
      console.error('❌ Errore dettagliato API OpenVoice:', error);
      throw new Error(`Errore API OpenVoice: ${error.message}`);
    }
  }

  /**
   * Fallback al TTS del browser con ottimizzazioni per voci naturali italiane
   */
  private static async fallbackBrowserTTS(
    text: string,
    options: VoiceOptions
  ): Promise<NarrationResponse> {
    return new Promise((resolve) => {
      try {
        if (!('speechSynthesis' in window)) {
          resolve({
            success: false,
            error: 'TTS non supportato dal browser'
          });
          return;
        }
        
        console.log('🎙️ Usando TTS browser ottimizzato per italiano...');
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Aspetta che le voci siano caricate
        const loadVoices = () => {
          const voices = speechSynthesis.getVoices();
          console.log(`🎭 Voci disponibili: ${voices.length}`);
          
          // Priorità per voci italiane di alta qualità
          const italianVoices = voices.filter(voice => 
            voice.lang.toLowerCase().includes('it') || 
            voice.name.toLowerCase().includes('italian') ||
            voice.name.toLowerCase().includes('italia')
          );
          
          console.log(`🇮🇹 Voci italiane trovate: ${italianVoices.length}`, italianVoices.map(v => v.name));
          
          let selectedVoice = null;
          
          if (italianVoices.length > 0) {
            // Seleziona la migliore voce italiana in base al genere
            const preferredGender = options.gender || 'auto';
            
            if (preferredGender === 'female' || preferredGender === 'auto') {
              selectedVoice = italianVoices.find(voice => 
                voice.name.toLowerCase().includes('female') ||
                voice.name.toLowerCase().includes('donna') ||
                voice.name.toLowerCase().includes('alice') ||
                voice.name.toLowerCase().includes('elsa') ||
                voice.name.toLowerCase().includes('cosimo') === false
              );
            }
            
            if (!selectedVoice && (preferredGender === 'male' || preferredGender === 'auto')) {
              selectedVoice = italianVoices.find(voice => 
                voice.name.toLowerCase().includes('male') ||
                voice.name.toLowerCase().includes('uomo') ||
                voice.name.toLowerCase().includes('cosimo') ||
                voice.name.toLowerCase().includes('luca')
              );
            }
            
            // Fallback alla prima voce italiana disponibile
            if (!selectedVoice) {
              selectedVoice = italianVoices[0];
            }
          } else {
            // Fallback a voci inglesi di qualità se non ci sono voci italiane
            const englishVoices = voices.filter(voice => 
              voice.lang.toLowerCase().includes('en') &&
              (voice.name.toLowerCase().includes('neural') ||
               voice.name.toLowerCase().includes('premium') ||
               voice.name.toLowerCase().includes('enhanced'))
            );
            
            if (englishVoices.length > 0) {
              selectedVoice = englishVoices[0];
              console.log('⚠️ Nessuna voce italiana trovata, uso voce inglese di qualità');
            } else {
              // Ultima risorsa: qualsiasi voce disponibile
              selectedVoice = voices.find(voice => voice.lang.includes('en')) || voices[0];
            }
          }
          
          if (selectedVoice) {
            utterance.voice = selectedVoice;
            console.log(`🎭 Voce selezionata: ${selectedVoice.name} (${selectedVoice.lang})`);
          }
          
          // Ottimizza parametri per naturalezza
          utterance.rate = Math.max(0.1, Math.min(2.0, options.speed || 0.9)); // Leggermente più lenta per naturalezza
          utterance.pitch = 1.0; // Pitch neutro per naturalezza
          utterance.volume = 1.0;
          
          // Applica modifiche per emozioni se supportate
          if (options.emotion) {
            switch (options.emotion) {
              case 'dramatic':
                utterance.rate *= 0.85;
                utterance.pitch = 0.9;
                break;
              case 'mysterious':
                utterance.rate *= 0.75;
                utterance.pitch = 0.8;
                break;
              case 'excited':
                utterance.rate *= 1.15;
                utterance.pitch = 1.1;
                break;
              case 'calm':
                utterance.rate *= 0.8;
                utterance.pitch = 0.95;
                break;
              case 'romantic':
                utterance.rate *= 0.85;
                utterance.pitch = 1.05;
                break;
            }
          }
          
          console.log(`🎛️ Parametri TTS: rate=${utterance.rate}, pitch=${utterance.pitch}`);
        };
        
        // Carica le voci se non sono già disponibili
        if (speechSynthesis.getVoices().length === 0) {
          speechSynthesis.onvoiceschanged = () => {
            loadVoices();
            speechSynthesis.onvoiceschanged = null;
          };
        } else {
          loadVoices();
        }
        
        utterance.onstart = () => {
          console.log('🎙️ Inizio sintesi vocale...');
        };
        
        utterance.onend = () => {
          console.log('✅ Sintesi vocale completata');
          resolve({
            success: true,
            duration: text.length / 12, // Stima più accurata
            elapsedTime: text.length / 12,
            deviceUsed: 'browser-tts-optimized'
          });
        };
        
        utterance.onerror = (error) => {
          console.error('❌ Errore TTS browser:', error);
          resolve({
            success: false,
            error: `Errore TTS browser: ${error.error}`
          });
        };
        
        // Avvia la sintesi
        speechSynthesis.speak(utterance);
        
      } catch (error: any) {
        console.error('❌ Errore generale TTS:', error);
        resolve({
          success: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Preprocessa il testo della storia per la narrazione
   */
  private static preprocessStoryText(story: string): string {
    return story
      // Rimuovi markdown
      .replace(/#{1,6}\s/g, '')
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      // Aggiungi pause per sezioni
      .replace(/PROLOGO/gi, 'Prologo. ')
      .replace(/ATTO\s+(I{1,3}|\d+)/gi, (match) => `${match}. `)
      .replace(/EPILOGO/gi, 'Epilogo. ')
      // Normalizza punteggiatura per pause naturali
      .replace(/\.\s+/g, '. ')
      .replace(/!\s+/g, '! ')
      .replace(/\?\s+/g, '? ')
      // Rimuovi spazi multipli
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Adatta le opzioni vocali in base al tipo di sezione con impostazioni ultra-realistiche
   */
  private static adaptVoiceForSection(
    sectionType: string,
    baseOptions: VoiceOptions
  ): VoiceOptions {
    const adaptations: Record<string, Partial<VoiceOptions>> = {
      prologo: {
        speed: 0.85,
        emotion: 'mysterious',
        stability: 0.90,
        breathiness: 0.20,
        pitch: -1
      },
      atto1: {
        speed: 0.95,
        emotion: 'excited',
        stability: 0.85,
        breathiness: 0.12,
        pitch: 2
      },
      atto2: {
        speed: 1.0,
        emotion: 'dramatic',
        stability: 0.88,
        breathiness: 0.15,
        pitch: 0
      },
      atto3: {
        speed: 1.05,
        emotion: 'epic',
        stability: 0.92,
        breathiness: 0.10,
        pitch: 1
      },
      epilogo: {
        speed: 0.80,
        emotion: 'calm',
        stability: 0.95,
        breathiness: 0.18,
        pitch: -2
      }
    };
    
    return {
      ...this.ULTRA_REALISTIC_SETTINGS,
      ...baseOptions,
      ...adaptations[sectionType]
    };
  }

  /**
   * Calcola la durata di un file audio
   */
  private static async getAudioDuration(audioBlob: Blob): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
      };
      audio.onerror = () => {
        resolve(0);
      };
      audio.src = URL.createObjectURL(audioBlob);
    });
  }

  /**
   * Converte blob audio in base64 per storage
   */
  static async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Scarica file audio
   */
  static downloadAudio(audioBlob: Blob, filename: string = 'narrazione.wav'): void {
    const url = URL.createObjectURL(audioBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}

export default OpenVoiceService; 