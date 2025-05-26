// 🧠 DEEPSEEK SERVICE - Servizio AI Gratuito Potente
// Integrazione con DeepSeek API per generazione storie quando OpenRouter non funziona

import axios from 'axios';

export interface DeepSeekProvider {
  name: string;
  model: string;
  description: string;
  quality: number; // 1-10
  speed: number; // 1-10
  reliability: number; // 1-10
  maxTokens: number;
  contextWindow: number;
}

export interface DeepSeekResponse {
  success: boolean;
  content: string;
  provider: string;
  model: string;
  tokensUsed?: number;
  elapsedTime?: number;
  error?: string;
}

export class DeepSeekService {
  private static readonly API_KEY = 'sk-14e5d9e25a764e67ac1c618bb275e6b3';
  private static readonly API_BASE_URL = 'https://api.deepseek.com/v1';
  
  // 🧠 Modelli DeepSeek disponibili (tutti gratuiti con limiti generosi)
  private static readonly PROVIDERS: DeepSeekProvider[] = [
    {
      name: 'DeepSeek Chat',
      model: 'deepseek-chat',
      description: 'Modello conversazionale generale, ottimo per narrativa',
      quality: 9,
      speed: 8,
      reliability: 9,
      maxTokens: 4096,
      contextWindow: 32768
    },
    {
      name: 'DeepSeek Coder',
      model: 'deepseek-coder',
      description: 'Specializzato in codice ma eccellente anche per storie strutturate',
      quality: 8,
      speed: 9,
      reliability: 9,
      maxTokens: 4096,
      contextWindow: 16384
    },
    {
      name: 'DeepSeek Reasoner',
      model: 'deepseek-reasoner',
      description: 'Modello di ragionamento avanzato per trame complesse',
      quality: 10,
      speed: 7,
      reliability: 8,
      maxTokens: 8192,
      contextWindow: 65536
    }
  ];

  /**
   * Client axios configurato per DeepSeek
   */
  private static getClient() {
    return axios.create({
      baseURL: this.API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${this.API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'OpenStory/1.0'
      },
      timeout: 120000 // 2 minuti timeout
    });
  }

  /**
   * Genera una storia usando DeepSeek come backup potente e gratuito
   */
  static async generateStory(prompt: string): Promise<DeepSeekResponse> {
    console.log('🧠 Tentando generazione con DeepSeek (modelli potenti gratuiti)...');
    
    // Ordina i provider per qualità e affidabilità
    const sortedProviders = [...this.PROVIDERS].sort((a, b) => 
      (b.quality + b.reliability) - (a.quality + a.reliability)
    );

    // 🎯 PRIMO TENTATIVO: Provider principali
    for (const provider of sortedProviders) {
      try {
        console.log(`🔄 Tentando con ${provider.name} (${provider.model})...`);
        console.log(`📊 Qualità: ${provider.quality}/10, Velocità: ${provider.speed}/10, Affidabilità: ${provider.reliability}/10`);
        
        const response = await this.callDeepSeekProvider(provider, prompt);
        
        if (response.success && response.content.length > 500) {
          console.log(`✅ Successo con ${provider.name}! Lunghezza: ${response.content.length} caratteri`);
          console.log(`⚡ Tempo impiegato: ${response.elapsedTime}s, Token usati: ${response.tokensUsed}`);
          return response;
        } else {
          console.warn(`⚠️ ${provider.name} ha restituito contenuto insufficiente: ${response.content.length} caratteri`);
        }
        
      } catch (error: any) {
        console.error(`❌ Errore con ${provider.name}:`, error.message);
        continue;
      }
    }

    // 🔄 SECONDO TENTATIVO: Prompt semplificato per massima compatibilità
    console.log('🔄 Tentando con prompt semplificato per DeepSeek...');
    const simplePrompt = `Scrivi una storia completa in italiano di circa 1000 parole. 
Tema: avventura e mistero. 
Struttura: introduzione, sviluppo, climax, conclusione.
Includi dialoghi e descrizioni vivide.
Inizia subito con la storia senza introduzioni.`;
    
    for (const provider of sortedProviders.slice(0, 2)) { // Solo i migliori 2
      try {
        console.log(`🔄 Tentativo semplificato con ${provider.name}...`);
        
        const response = await this.callDeepSeekProvider(provider, simplePrompt);
        
        if (response.success && response.content.length > 300) {
          console.log(`✅ Successo semplificato con ${provider.name}! Lunghezza: ${response.content.length}`);
          return response;
        }
        
      } catch (error: any) {
        console.error(`❌ Errore tentativo semplificato con ${provider.name}:`, error.message);
        continue;
      }
    }

    // 🆘 FALLIMENTO COMPLETO
    console.error('❌ Tutti i provider DeepSeek non disponibili');
    
    return {
      success: false,
      content: '',
      provider: 'none',
      model: 'none',
      error: 'Servizi DeepSeek temporaneamente non disponibili. Tutti i modelli hanno raggiunto i limiti o sono in manutenzione.'
    };
  }

  /**
   * Chiama un provider DeepSeek specifico
   */
  private static async callDeepSeekProvider(provider: DeepSeekProvider, prompt: string): Promise<DeepSeekResponse> {
    const startTime = Date.now();
    
    try {
      console.log(`🔄 Chiamando DeepSeek API con ${provider.model}`);
      
      const client = this.getClient();
      
      const response = await client.post('/chat/completions', {
        model: provider.model,
        messages: [
          {
            role: 'system',
            content: 'Sei un narratore professionista italiano. Scrivi SOLO storie complete, coinvolgenti e ben strutturate in italiano. Includi sempre personaggi, dialoghi, descrizioni vivide e una trama avvincente. NON dare consigli di scrittura o meta-commenti.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: provider.maxTokens,
        temperature: 0.8,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1,
        stream: false
      });

      const content = response.data.choices?.[0]?.message?.content || '';
      const tokensUsed = response.data.usage?.total_tokens || 0;
      const elapsedTime = (Date.now() - startTime) / 1000;

      if (!content || content.length < 100) {
        throw new Error(`Contenuto insufficiente: ${content.length} caratteri`);
      }

      // Verifica qualità del contenuto
      if (!this.validateStoryContent(content)) {
        throw new Error('Contenuto non valido: non sembra una storia completa');
      }

      return {
        success: true,
        content: content.trim(),
        provider: provider.name,
        model: provider.model,
        tokensUsed,
        elapsedTime
      };

    } catch (error: any) {
      const elapsedTime = (Date.now() - startTime) / 1000;
      
      // Gestione errori specifici DeepSeek
      let errorMessage = error.message;
      
      if (error.response) {
        const status = error.response.status;
        const data = error.response.data;
        
        switch (status) {
          case 401:
            errorMessage = 'API Key DeepSeek non valida o scaduta';
            break;
          case 402:
            errorMessage = 'Crediti DeepSeek esauriti per oggi';
            break;
          case 429:
            errorMessage = 'Limite di richieste DeepSeek raggiunto, riprova tra qualche minuto';
            break;
          case 503:
            errorMessage = 'Servizio DeepSeek temporaneamente non disponibile';
            break;
          default:
            errorMessage = `Errore DeepSeek ${status}: ${data?.error?.message || 'Errore sconosciuto'}`;
        }
      }
      
      return {
        success: false,
        content: '',
        provider: provider.name,
        model: provider.model,
        elapsedTime,
        error: errorMessage
      };
    }
  }

  /**
   * Valida che il contenuto sia effettivamente una storia
   */
  private static validateStoryContent(content: string): boolean {
    // Controlli di base per validare una storia
    const hasDialogue = /["«»""]/.test(content) || /disse|rispose|esclamò|sussurrò/i.test(content);
    const hasNarrative = /\b(era|furono|aveva|mentre|quando|dopo|prima)\b/i.test(content);
    const hasCharacters = /\b(protagonista|personaggio|uomo|donna|ragazzo|ragazza|eroe|eroina)\b/i.test(content);
    const hasAction = /\b(andò|corse|guardò|vide|sentì|aprì|chiuse|entrò|uscì)\b/i.test(content);
    
    const minLength = content.length > 300;
    const hasStructure = content.split('\n').length > 3;
    
    return minLength && hasStructure && (hasDialogue || hasNarrative || hasCharacters || hasAction);
  }

  /**
   * Verifica disponibilità del servizio DeepSeek
   */
  static async checkServiceAvailability(): Promise<boolean> {
    try {
      const client = this.getClient();
      
      const response = await client.get('/models', {
        timeout: 10000
      });
      
      return response.status === 200;
    } catch (error) {
      console.warn('⚠️ Servizio DeepSeek non raggiungibile');
      return false;
    }
  }

  /**
   * Ottieni informazioni sui modelli disponibili
   */
  static async getAvailableModels(): Promise<DeepSeekProvider[]> {
    try {
      const isAvailable = await this.checkServiceAvailability();
      
      if (!isAvailable) {
        return [];
      }
      
      return [...this.PROVIDERS];
    } catch (error) {
      console.error('❌ Errore recupero modelli DeepSeek:', error);
      return [];
    }
  }

  /**
   * Ottieni il miglior provider disponibile
   */
  static getBestProvider(): DeepSeekProvider {
    return this.PROVIDERS.reduce((best, current) => 
      (current.quality + current.reliability) > (best.quality + best.reliability) 
        ? current 
        : best
    );
  }

  /**
   * Ottieni statistiche sui provider
   */
  static getProviderStats() {
    return {
      totalProviders: this.PROVIDERS.length,
      bestQuality: Math.max(...this.PROVIDERS.map(p => p.quality)),
      averageReliability: this.PROVIDERS.reduce((sum, p) => sum + p.reliability, 0) / this.PROVIDERS.length,
      models: this.PROVIDERS.map(p => p.model),
      totalContextWindow: Math.max(...this.PROVIDERS.map(p => p.contextWindow)),
      totalMaxTokens: Math.max(...this.PROVIDERS.map(p => p.maxTokens))
    };
  }

  /**
   * Test di connessione rapido
   */
  static async testConnection(): Promise<{ success: boolean; latency?: number; error?: string }> {
    const startTime = Date.now();
    
    try {
      const client = this.getClient();
      
      const response = await client.post('/chat/completions', {
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: 'Rispondi solo con "OK" per testare la connessione.'
          }
        ],
        max_tokens: 10,
        temperature: 0
      });
      
      const latency = Date.now() - startTime;
      const content = response.data.choices?.[0]?.message?.content || '';
      
      return {
        success: content.toLowerCase().includes('ok'),
        latency
      };
      
    } catch (error: any) {
      return {
        success: false,
        latency: Date.now() - startTime,
        error: error.message
      };
    }
  }
}

export default DeepSeekService; 