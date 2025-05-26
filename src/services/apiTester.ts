import { OptimizedStoryService, StoryParameters } from '../services/optimizedOpenRouterService';

// 🧪 Test delle API OpenRouter
export class OpenRouterAPITester {
  private storyService = new OptimizedStoryService();

  // Test di base della configurazione
  async testConfiguration(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔧 Test configurazione OpenRouter...');
      
      const isConfigured = OptimizedStoryService.isConfigured();
      
      if (!isConfigured) {
        return {
          success: false,
          message: '❌ API Key OpenRouter non configurata. Crea un file .env con REACT_APP_OPENROUTER_API_KEY=la-tua-chiave'
        };
      }

      return {
        success: true,
        message: '✅ Configurazione OpenRouter OK'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `❌ Errore configurazione: ${error.message}`
      };
    }
  }

  // Test connessione al servizio
  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🌐 Test connessione OpenRouter...');
      
      const isConnected = await OptimizedStoryService.testConnection();
      
      if (!isConnected) {
        return {
          success: false,
          message: '❌ Impossibile connettersi a OpenRouter. Verifica la tua connessione internet e API key.'
        };
      }

      return {
        success: true,
        message: '✅ Connessione OpenRouter OK'
      };
    } catch (error: any) {
      return {
        success: false,
        message: `❌ Errore connessione: ${error.message}`
      };
    }
  }

  // Test generazione storia breve
  async testStoryGeneration(): Promise<{ success: boolean; message: string; story?: string }> {
    try {
      console.log('📖 Test generazione storia...');
      
      // Parametri di test per una storia breve
      const testParameters: StoryParameters = {
        genre: 'action_thriller',
        tone: 'intense',
        length: 'short',
        setting: {
          place: 'Roma moderna',
          time: 'Presente',
          description: 'Una metropoli piena di segreti e pericoli'
        },
        protagonist: {
          name: 'Marco',
          type: 'Detective privato',
          goal: 'Scoprire la verità',
          characteristics: ['Coraggioso', 'Intelligente', 'Determinato']
        },
        antagonist: {
          name: 'Il Burattinaio',
          type: 'Criminale misterioso',
          motivation: 'Controllo del potere',
          characteristics: ['Spietato', 'Astuto', 'Ombra']
        },
        plotElements: ['Inseguimento', 'Colpo di scena', 'Scontro finale'],
        narrativeStructure: 'tre_atti'
      };

      this.storyService.onProgressUpdate = (progress) => {
        console.log(`📊 Progresso: ${progress.currentSection} (${Math.round(progress.progress)}%)`);
      };

      const result = await this.storyService.generateStory(testParameters);
      
      if (!result.content || result.content.length < 100) {
        return {
          success: false,
          message: '❌ Storia generata troppo breve o vuota'
        };
      }

      return {
        success: true,
        message: `✅ Storia generata con successo! Lunghezza: ${result.content.length} caratteri, Modello: ${result.metadata.model}`,
        story: result.content
      };
    } catch (error: any) {
      return {
        success: false,
        message: `❌ Errore generazione storia: ${error.message}`
      };
    }
  }

  // Esegui tutti i test
  async runAllTests(): Promise<{ 
    configuration: { success: boolean; message: string };
    connection: { success: boolean; message: string };
    generation: { success: boolean; message: string; story?: string };
    overall: boolean;
  }> {
    console.log('🚀 Avvio test completo OpenRouter API...\n');

    const configTest = await this.testConfiguration();
    console.log(configTest.message);

    let connectionTest = { success: false, message: 'Saltato a causa di errore configurazione' };
    let generationTest: { success: boolean; message: string; story?: string } = { 
      success: false, 
      message: 'Saltato a causa di errore precedente' 
    };

    if (configTest.success) {
      connectionTest = await this.testConnection();
      console.log(connectionTest.message);

      if (connectionTest.success) {
        generationTest = await this.testStoryGeneration();
        console.log(generationTest.message);
      }
    }

    const overall = configTest.success && connectionTest.success && generationTest.success;

    console.log('\n📋 Risultati Test:');
    console.log(`🔧 Configurazione: ${configTest.success ? '✅' : '❌'}`);
    console.log(`🌐 Connessione: ${connectionTest.success ? '✅' : '❌'}`);
    console.log(`📖 Generazione: ${generationTest.success ? '✅' : '❌'}`);
    console.log(`🎯 Test Complessivo: ${overall ? '✅ SUCCESSO' : '❌ FALLITO'}`);

    return {
      configuration: configTest,
      connection: connectionTest,
      generation: generationTest,
      overall
    };
  }
}

// Funzione di utilità per test rapido
export const testOpenRouterAPI = async (): Promise<boolean> => {
  const tester = new OpenRouterAPITester();
  const results = await tester.runAllTests();
  return results.overall;
};

// Test demo che può essere chiamato dal browser
export const runDemoTest = async (): Promise<void> => {
  console.log('🎬 Avvio test demo OpenStory...');
  
  try {
    const tester = new OpenRouterAPITester();
    const results = await tester.runAllTests();
    
    if (results.overall) {
      console.log('🎉 Tutti i test sono passati! OpenStory è pronto per l\'uso.');
      if (results.generation.story) {
        console.log('\n📖 Storia di esempio generata:');
        console.log('='.repeat(50));
        console.log(results.generation.story.substring(0, 500) + '...');
        console.log('='.repeat(50));
      }
    } else {
      console.log('⚠️ Alcuni test sono falliti. Verifica la configurazione.');
    }
  } catch (error) {
    console.error('💥 Errore durante il test:', error);
  }
};

// Rendi disponibile globalmente per test da console browser
declare global {
  interface Window {
    testOpenStory: () => Promise<void>;
  }
}

// Esporta per uso in window
if (typeof window !== 'undefined') {
  window.testOpenStory = runDemoTest;
} 