import axios from 'axios';

// 🚀 Servizio Semplificato per OpenStory
export interface SimpleStoryParams {
  genre: string;
  protagonist: string;
  setting: string;
  length: string;
}

export interface SimpleStoryResponse {
  content: string;
  success: boolean;
  error?: string;
}

class QuickStoryService {
  private apiKey = process.env.REACT_APP_OPENROUTER_API_KEY;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor() {
    console.log('🔧 QuickStoryService inizializzato');
    console.log('🔑 API Key presente:', !!this.apiKey);
  }

  async generateQuickStory(params: SimpleStoryParams): Promise<SimpleStoryResponse> {
    console.log('🚀 Inizio generazione storia rapida...');
    
    try {
      // Verifica API key
      if (!this.apiKey || !this.apiKey.startsWith('sk-or-v1-')) {
        throw new Error('API Key OpenRouter non configurata. Crea un file .env con REACT_APP_OPENROUTER_API_KEY=la-tua-chiave');
      }

      // Prompt semplificato
      const prompt = this.buildSimplePrompt(params);
      console.log('📝 Prompt creato:', prompt.substring(0, 100) + '...');

      // Chiamata API
      const response = await this.callOpenRouter(prompt);
      console.log('✅ Risposta ricevuta');

      const content = response.data?.choices?.[0]?.message?.content || 'Errore nella generazione';

      if (content.length < 50) {
        throw new Error('Storia generata troppo breve');
      }

      console.log(`📖 Storia generata: ${content.length} caratteri`);
      
      return {
        success: true,
        content: content
      };

    } catch (error: any) {
      console.error('❌ Errore generazione:', error);
      return {
        success: false,
        content: '',
        error: error.message
      };
    }
  }

  private buildSimplePrompt(params: SimpleStoryParams): string {
    const promptMap: { [key: string]: string } = {
      'action_thriller': 'Crea un thriller d\'azione intenso e avvincente',
      'romantic_comedy': 'Crea una commedia romantica leggera e divertente',
      'horror': 'Crea una storia horror inquietante e spaventosa',
      'fantasy': 'Crea una storia fantasy epica con magia e avventura',
      'sci_fi': 'Crea una storia di fantascienza futuristica'
    };

    const genrePrompt = promptMap[params.genre] || 'Crea una storia avvincente';
    
    return `${genrePrompt} con le seguenti caratteristiche:

PROTAGONISTA: ${params.protagonist}
AMBIENTAZIONE: ${params.setting}
LUNGHEZZA: ${params.length === 'short' ? 'Storia breve (300-500 parole)' : 'Storia media (500-800 parole)'}

ISTRUZIONI:
- Crea una storia completa con inizio, sviluppo e conclusione
- Usa un linguaggio coinvolgente e descrittivo
- Includi dialoghi realistici
- Mantieni il lettore interessato dall'inizio alla fine
- Scrivi in italiano

STORIA:`;
  }

  private async callOpenRouter(prompt: string) {
    const client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'OpenStory Quick Generator'
      },
      timeout: 60000
    });

    console.log('🔗 Chiamando OpenRouter...');

    return await client.post('/chat/completions', {
      model: 'mistralai/mistral-7b-instruct:free',
      messages: [
        {
          role: 'system',
          content: 'Sei un esperto scrittore di storie. Crea narrazioni coinvolgenti, ben strutturate e in perfetto italiano.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 800,
      temperature: 0.8,
      top_p: 0.9
    });
  }

  // Test rapido
  async testConnection(): Promise<boolean> {
    try {
      if (!this.apiKey) {
        console.log('❌ API Key mancante');
        return false;
      }

      console.log('🧪 Test connessione OpenRouter...');
      
      const testResponse = await this.callOpenRouter('Scrivi solo "Test connessione riuscito" in italiano.');
      const testContent = testResponse.data?.choices?.[0]?.message?.content || '';
      
      console.log('✅ Test completato:', testContent.substring(0, 50));
      return testContent.length > 0;
    } catch (error: any) {
      console.error('❌ Test fallito:', error.message);
      return false;
    }
  }
}

// Esporta istanza
export const quickStoryService = new QuickStoryService();

// Funzione di convenienza
export const generateStoryQuick = async (params: SimpleStoryParams): Promise<SimpleStoryResponse> => {
  return await quickStoryService.generateQuickStory(params);
};

// Test globale per console browser
declare global {
  interface Window {
    testQuickStory: () => Promise<void>;
    generateTestStory: () => Promise<void>;
  }
}

// Aggiungi al window per test
if (typeof window !== 'undefined') {
  window.testQuickStory = async () => {
    console.log('🧪 Test rapido QuickStory...');
    const success = await quickStoryService.testConnection();
    console.log(success ? '✅ Test riuscito!' : '❌ Test fallito!');
  };

  window.generateTestStory = async () => {
    console.log('📖 Generazione storia di test...');
    const result = await generateStoryQuick({
      genre: 'action_thriller',
      protagonist: 'Marco, detective coraggioso',
      setting: 'Roma moderna, di notte',
      length: 'short'
    });
    
    if (result.success) {
      console.log('✅ Storia generata!');
      console.log('📖 Contenuto:', result.content);
    } else {
      console.log('❌ Errore:', result.error);
    }
  };
} 