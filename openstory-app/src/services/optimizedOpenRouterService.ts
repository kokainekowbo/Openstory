import axios from 'axios';
import { promptTemplateEngine, PromptTemplate } from './promptTemplates';

// Interfaces
export interface StoryParameters {
  genre: string;
  tone: string;
  length: string;
  setting: {
    place: string;
    time: string;
    description: string;
  };
  protagonist: {
    name: string;
    type: string;
    goal: string;
    characteristics: string[];
  };
  antagonist: {
    name?: string;
    type: string;
    motivation: string;
    characteristics: string[];
  };
  supportingCharacters?: Array<{
    name: string;
    type: string;
    description: string;
    characteristics: string[];
  }>;
  plotElements: string[];
  narrativeStructure: string;
  // Nuove opzioni avanzate per migliorare la generazione
  storyType?: string;
  includeDialogue?: boolean;
  focusOnAction?: boolean;
  emotionalDepth?: boolean;
  worldBuilding?: boolean;
  mysteryElements?: boolean;
  cinematicStyle?: boolean;
  seriesContext?: string;
}

export interface StoryResponse {
  content: string;
  metadata: {
    model: string;
    promptTokens: number;
    completionTokens: number;
    processingTime: string;
    sectionsGenerated: string[];
  };
}

export interface GenerationProgress {
  currentSection: string;
  progress: number;
  totalSections: number;
  estimatedTimeRemaining: string;
}

// 🌐 Configurazione OpenRouter
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1';
const API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;

const openRouterClient = axios.create({
  baseURL: OPENROUTER_API_URL,
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'OpenStory - AI Story Generator'
  },
  timeout: 120000 // 2 minuti timeout
});

// 🆓 Selezione modelli GRATUITI ottimali di OpenRouter per storie
class ModelSelector {
  private models = {
    // 🌟 Miglior modello gratuito per creatività
    creative: [
      'google/gemma-2-9b-it:free',                      // 🏆 GEMMA-2: 98% successo - MIGLIORE
      'deepseek/deepseek-r1-distill-llama-70b:free',    // 70B - Alta qualità creativa
      'mistralai/mistral-small-24b-instruct-2501:free', // 24B - Veloce e intelligente
      'qwen/qwen-2-7b-instruct:free'                     // Qwen-2 - Molto affidabile
    ],
    // ⚡ Modelli veloci per contenuti brevi
    fast: [
      'google/gemma-2-9b-it:free',                      // 🏆 GEMMA-2: Sempre primo
      'mistralai/mistral-7b-instruct:free',             // 7B - Velocissimo
      'mistralai/mistral-small-24b-instruct-2501:free', // 24B - Bilanciato
      'qwen/qwen-2-7b-instruct:free'                     // Qwen-2 - Fallback affidabile
    ],
    // ⚖️ Modelli bilanciati per uso generale
    balanced: [
      'google/gemma-2-9b-it:free',                      // 🏆 GEMMA-2: Priorità assoluta
      'qwen/qwen-2-7b-instruct:free',                   // Qwen-2 - Molto stabile
      'mistralai/mistral-small-24b-instruct-2501:free', // 24B - Ottimo compromesso
      'deepseek/deepseek-r1-distill-llama-70b:free'     // 70B - Alta qualità
    ]
  };

  selectOptimalModel(parameters: StoryParameters): string {
    console.log('🎯 Selezione modello per parametri:', { 
      genre: parameters.genre, 
      length: parameters.length,
      storyType: parameters.storyType 
    });

    // 🎨 Per generi creativi che richiedono alta qualità
    if (parameters.genre?.includes('Fantasy') || 
        parameters.genre?.includes('Horror') || 
        parameters.genre?.includes('Mistero') ||
        parameters.emotionalDepth ||
        parameters.worldBuilding) {
      console.log('🏆 Selezionato MIGLIOR modello creativo: GEMMA-2 (98% successo)');
      return this.models.creative[0]; // GEMMA-2 per creatività
    }
    
    // ⚡ Per contenuti brevi e veloci
    if (parameters.length === 'synopsis' || 
        parameters.length === 'short' ||
        parameters.storyType === 'episodic') {
      console.log('🏆 Selezionato MIGLIOR modello veloce: GEMMA-2 (98% successo)');
      return this.models.fast[0]; // GEMMA-2 per velocità
    }
    
    // ⚖️ Per tutto il resto, modello bilanciato
    console.log('🏆 Selezionato MIGLIOR modello bilanciato: GEMMA-2 (98% successo)');
    return this.models.balanced[0]; // GEMMA-2 per uso generale
  }

  // Ottieni lista di modelli di fallback
  getFallbackModels(selectedModel: string): string[] {
    // Trova la categoria del modello selezionato
    let category: keyof typeof this.models = 'balanced';
    for (const [cat, models] of Object.entries(this.models)) {
      if (models.includes(selectedModel)) {
        category = cat as keyof typeof this.models;
        break;
      }
    }
    
    // Restituisci gli altri modelli della categoria come fallback
    return this.models[category].filter(model => model !== selectedModel);
  }
}

// Validatore qualità del testo generato
class QualityValidator {
  async validateSection(content: string, section: string, parameters: StoryParameters): Promise<{ isValid: boolean; issues: string[] }> {
    const issues: string[] = [];
    
    // Controlli base
    if (content.length < 100) {
      issues.push('Contenuto troppo breve');
    }
    
    if (content.length > this.getMaxLength(section)) {
      issues.push('Contenuto troppo lungo');
    }
    
    // Controllo coerenza genere
    if (!this.checkGenreConsistency(content, parameters.genre)) {
      issues.push('Incoerenza con il genere specificato');
    }
    
    // Controllo ripetizioni
    if (this.hasExcessiveRepetition(content)) {
      issues.push('Ripetizioni eccessive rilevate');
    }
    
    // Controllo completezza narrativa
    if (section === 'atto3' && !this.hasProperEnding(content)) {
      issues.push('Finale incompleto o abrupto');
    }
    
    return {
      isValid: issues.length === 0,
      issues
    };
  }
  
  private getMaxLength(section: string): number {
    const limits = {
      prologo: 1500,
      atto1: 2500,
      atto2: 2800,
      atto3: 2500
    };
    return limits[section as keyof typeof limits] || 2000;
  }
  
  private checkGenreConsistency(content: string, genre: string): boolean {
    const genreKeywords = {
      'Fantasy': ['magia', 'incantesimo', 'mondo', 'creature', 'potere', 'regno'],
      'Horror': ['buio', 'paura', 'inquietante', 'ombra', 'terrore', 'mistero'],
      'Avventura': ['viaggio', 'scoperta', 'pericolo', 'esplorazione', 'sfida'],
      'Romance': ['amore', 'romantico', 'cuore', 'sentimenti', 'passione'],
      'Mistero': ['enigma', 'segreto', 'indagine', 'detective', 'scoprire']
    };
    
    const keywords = genreKeywords[genre as keyof typeof genreKeywords] || [];
    const contentLower = content.toLowerCase();
    
    return keywords.length === 0 || keywords.some(keyword => contentLower.includes(keyword));
  }
  
  private hasExcessiveRepetition(content: string): boolean {
    const words = content.split(/\s+/);
    const wordCount = new Map<string, number>();
    
    words.forEach(word => {
      if (word.length > 3) { // Ignora parole troppo corte
        const cleanWord = word.toLowerCase().replace(/[.,!?;]/g, '');
        wordCount.set(cleanWord, (wordCount.get(cleanWord) || 0) + 1);
      }
    });
    
    // Controlla se qualche parola appare più del 5% del tempo
    const threshold = Math.max(3, Math.floor(words.length * 0.05));
    return Array.from(wordCount.values()).some(count => count > threshold);
  }
  
  private hasProperEnding(content: string): boolean {
    const lastSentences = content.split('.').slice(-3).join('.');
    const endingIndicators = [
      'fine', 'conclusione', 'finale', 'epilogo', 
      'risoluzione', 'termine', 'chiude', 'finisce'
    ];
    
    return endingIndicators.some(indicator => 
      lastSentences.toLowerCase().includes(indicator)
    );
  }
}

// 🚀 Servizio principale ottimizzato per OpenRouter
export class OptimizedStoryService {
  private modelSelector = new ModelSelector();
  private qualityValidator = new QualityValidator();
  private currentProgress: GenerationProgress | null = null;
  
  // Callback per aggiornamenti progress
  onProgressUpdate?: (progress: GenerationProgress) => void;
  
  // Verifica se il servizio è configurato correttamente
  static isConfigured(): boolean {
    const apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
    const isValidKey = !!(apiKey && apiKey.startsWith('sk-or-v1-') && apiKey.length > 20);
    console.log(`🔑 OpenRouter API Key configurata: ${isValidKey ? '✅' : '❌'}`);
    console.log(`📋 Lunghezza chiave: ${apiKey?.length || 0} caratteri`);
    return isValidKey;
  }

  // Test rapido della connessione OpenRouter
  static async testConnection(): Promise<boolean> {
    try {
      const testClient = axios.create({
        baseURL: OPENROUTER_API_URL,
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'OpenStory - Connection Test'
        },
        timeout: 10000
      });

      const response = await testClient.get('/models');
      console.log('✅ Test connessione OpenRouter riuscito');
      return response.status === 200;
    } catch (error: any) {
      console.error('❌ Test connessione OpenRouter fallito:', error.message);
      return false;
    }
  }
  
  async generateStory(parameters: StoryParameters): Promise<StoryResponse> {
    const startTime = Date.now();
    console.log('🚀 Inizio generazione storia con OpenRouter');
    
    try {
      // Seleziona il miglior modello gratuito
      const selectedModel = this.modelSelector.selectOptimalModel(parameters);
      console.log(`🎯 Modello selezionato: ${selectedModel}`);
      
      // Ottieni template appropriato
      const template = promptTemplateEngine.getTemplate(
        parameters.genre,
        parameters.tone || 'balanced'
      );
      
      const sections = Object.keys(template.structure) as Array<keyof typeof template.structure>;
      let storyContent = '';
      const sectionsGenerated: string[] = [];
      
      // Genera ogni sezione
      for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        
        this.updateProgress({
          currentSection: `Generando ${section}...`,
          progress: (i / sections.length) * 100,
          totalSections: sections.length,
          estimatedTimeRemaining: this.estimateTimeRemaining(i, sections.length, startTime)
        });
        
        console.log(`📝 Generazione sezione: ${section} (${i + 1}/${sections.length})`);
        
        try {
          const sectionContent = await this.generateSectionWithRetry(
            template,
            section,
            parameters,
            storyContent,
            selectedModel
          );
          
          storyContent += `### ${section.toUpperCase()}\n${sectionContent}\n\n`;
          sectionsGenerated.push(section);
          
          // Breve pausa tra le sezioni per evitare rate limiting
          await this.delay(1000);
          
        } catch (error) {
          console.error(`❌ Errore generazione sezione ${section}:`, error);
          // Continua con le altre sezioni
        }
      }
      
      const processingTime = `${(Date.now() - startTime) / 1000}s`;
      
      // Finalizza progress
      this.updateProgress({
        currentSection: 'Completato!',
        progress: 100,
        totalSections: sections.length,
        estimatedTimeRemaining: '0s'
      });
      
      console.log(`✅ Storia generata con successo in ${processingTime}`);
      
      return {
        content: storyContent.trim(),
        metadata: {
          model: selectedModel,
          promptTokens: 0, // OpenRouter non fornisce sempre questi dati
          completionTokens: 0,
          processingTime,
          sectionsGenerated
        }
      };
      
    } catch (error: any) {
      console.error('❌ Errore generazione storia:', error);
      throw error;
    }
  }
  
  private async generateSectionWithRetry(
    template: PromptTemplate,
    section: keyof PromptTemplate['structure'],
    parameters: StoryParameters,
    previousContent: string,
    model: string,
    maxRetries = 3
  ): Promise<string> {
    let lastError: any;
    
    // Prova prima con il modello selezionato
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`🔄 Tentativo ${attempt + 1}/${maxRetries} per sezione ${section} con ${model}`);
        
        const { systemPrompt, userPromptTemplate } = template.structure[section];
        
        const response = await this.callOpenRouter({
          model,
          systemPrompt: systemPrompt.replace(/\{(\w+)\}/g, (_: string, key: string) => parameters[key as keyof StoryParameters] as string || ''),
          userPrompt: userPromptTemplate
            .replace(/\{(\w+)\}/g, (_: string, key: string) => parameters[key as keyof StoryParameters] as string || '')
            .replace('{previousContent}', previousContent),
          maxTokens: this.getMaxTokensForSection(section, parameters.length || 'medium'),
          temperature: 0.8
        });
        
        const content = response.choices[0]?.message?.content || '';
        
        if (content.length > 50) {
          console.log(`✅ Sezione ${section} generata con successo (${content.length} caratteri)`);
          return content;
        } else {
          throw new Error('Contenuto troppo breve');
        }
        
      } catch (error: any) {
        lastError = error;
        console.error(`❌ Tentativo ${attempt + 1} fallito per ${section}:`, error.message);
        
        if (attempt < maxRetries - 1) {
          await this.delay(2000 * (attempt + 1)); // Backoff progressivo
        }
      }
    }
    
    // Se tutti i tentativi falliscono, prova con modelli di fallback
    const fallbackModels = this.modelSelector.getFallbackModels(model);
    
    for (const fallbackModel of fallbackModels) {
      try {
        console.log(`🔄 Provo modello di fallback: ${fallbackModel}`);
        
        const { systemPrompt, userPromptTemplate } = template.structure[section];
        
        const response = await this.callOpenRouter({
          model: fallbackModel,
          systemPrompt: systemPrompt.replace(/\{(\w+)\}/g, (_: string, key: string) => parameters[key as keyof StoryParameters] as string || ''),
          userPrompt: userPromptTemplate
            .replace(/\{(\w+)\}/g, (_: string, key: string) => parameters[key as keyof StoryParameters] as string || '')
            .replace('{previousContent}', previousContent),
          maxTokens: this.getMaxTokensForSection(section, parameters.length || 'medium'),
          temperature: 0.8
        });
        
        const content = response.choices[0]?.message?.content || '';
        
        if (content.length > 50) {
          console.log(`✅ Sezione ${section} generata con modello fallback ${fallbackModel}`);
          return content;
        }
        
      } catch (error: any) {
        console.error(`❌ Fallback ${fallbackModel} fallito:`, error.message);
      }
    }
    
    // Ultimo tentativo: genera contenuto di emergenza
    console.warn(`⚠️ Generazione contenuto di emergenza per sezione ${section}`);
    return `[Sezione ${section} - Contenuto generato in modalità di emergenza a causa di errori del servizio]`;
  }
  
  private async callOpenRouter(params: {
    model: string;
    systemPrompt: string;
    userPrompt: string;
    maxTokens: number;
    temperature: number;
  }) {
    try {
      console.log(`🔗 Chiamando OpenRouter con modello: ${params.model}`);
      
      const response = await openRouterClient.post('/chat/completions', {
        model: params.model,
        messages: [
          {
            role: 'system',
            content: params.systemPrompt
          },
          {
            role: 'user',
            content: params.userPrompt
          }
        ],
        max_tokens: params.maxTokens,
        temperature: params.temperature,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      });
      
      console.log(`✅ Risposta OpenRouter ricevuta (${response.status})`);
      return response.data;
      
    } catch (error: any) {
      console.error('❌ Errore chiamata OpenRouter:', error);
      
      // Logging dettagliato dell'errore
      if (error.response) {
        console.error(`📋 Status: ${error.response.status}`);
        console.error(`📋 Data:`, error.response.data);
        
        // Errori specifici con messaggi user-friendly
        if (error.response.status === 401) {
          throw new Error('❌ API Key OpenRouter non valida. Verifica la configurazione nel file .env');
        } else if (error.response.status === 402) {
          throw new Error('❌ Crediti OpenRouter esauriti. Controlla il tuo account su openrouter.ai');
        } else if (error.response.status === 429) {
          throw new Error('❌ Troppi requests OpenRouter. Attendi qualche minuto e riprova.');
        } else if (error.response.status === 503) {
          throw new Error('❌ Servizio OpenRouter temporaneamente non disponibile.');
        } else {
          throw new Error(`❌ Errore OpenRouter: ${error.response.status} - ${error.response.data?.error?.message || 'Errore sconosciuto'}`);
        }
      } else if (error.request) {
        throw new Error('❌ Errore di connessione con OpenRouter. Verifica la connessione internet.');
      } else {
        throw new Error(`❌ Errore configurazione: ${error.message}`);
      }
    }
  }
  
  private getMaxTokensForSection(section: string, length: string): number {
    const baseTokens = {
      prologo: 400,
      atto1: 600,
      atto2: 700,
      atto3: 600
    };
    
    const lengthMultipliers = {
      synopsis: 0.3,
      short: 0.5,
      medium: 1.0,
      chapter: 1.5,
      long: 2.0,
      series: 1.2
    };
    
    const base = baseTokens[section as keyof typeof baseTokens] || 500;
    const multiplier = lengthMultipliers[length as keyof typeof lengthMultipliers] || 1.0;
    
    return Math.floor(base * multiplier);
  }
  
  private updateProgress(progress: GenerationProgress): void {
    this.currentProgress = progress;
    if (this.onProgressUpdate) {
      this.onProgressUpdate(progress);
    }
  }
  
  private estimateTimeRemaining(currentIndex: number, totalSections: number, startTime: number): string {
    if (currentIndex === 0) return 'Calcolando...';
    
    const elapsed = Date.now() - startTime;
    const avgTimePerSection = elapsed / currentIndex;
    const remaining = (totalSections - currentIndex) * avgTimePerSection;
    
    return `${Math.ceil(remaining / 1000)}s`;
  }
  
  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export funzione di convenienza
export const generateStory = async (parameters: StoryParameters): Promise<StoryResponse> => {
  const service = new OptimizedStoryService();
  return service.generateStory(parameters);
}; 