import { GoogleGenerativeAI } from '@google/generative-ai';

// Configurazione di Gemini
// NOTA: In produzione, questa chiave dovrebbe essere in un file .env
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Configurazione del modello
const MODEL_NAME = 'gemini-pro';

export interface GeminiParameters {
  genre: string;
  tone: string;
  setting: {
    place: string;
    time: string;
    description: string;
  };
  protagonist: {
    type: string;
    name: string;
    goal: string;
    characteristics: string[];
  };
  antagonist: {
    type: string;
    name: string;
    motivation: string;
    characteristics: string[];
  };
  supportingCharacters: Array<{
    id: string;
    name: string;
    type: string;
    description: string;
    characteristics: string[];
  }>;
  plotElements: string[];
  narrativeStructure: {
    type: string;
    chapters: Array<{
      id: string;
      title: string;
      description: string;
    }>;
  };
  length: string;
}

interface GeminiResponse {
  content: string;
  metadata: {
    model: string;
    promptTokens: number;
    completionTokens: number;
    processingTime: string;
  };
}

// Costruisce il prompt per Gemini
const buildGeminiPrompt = (parameters: GeminiParameters): string => {
  let prompt = `Genera una ${parameters.length || 'storia'} nel genere ${parameters.genre || 'generale'} `;
  prompt += `con tono ${parameters.tone || 'neutro'}. `;

  if (parameters.setting) {
    const { place, time, description } = parameters.setting;
    prompt += `\nAmbientazione: ${place || 'non specificato'}`;
    if (time) prompt += `, durante ${time}`;
    if (description) prompt += `. ${description}`;
  }

  if (parameters.protagonist) {
    const { type, name, goal, characteristics } = parameters.protagonist;
    prompt += `\n\nProtagonista: ${type || 'non specificato'}`;
    if (name) prompt += ` di nome ${name}`;
    if (goal) prompt += ` che vuole ${goal}`;
    if (characteristics?.length) {
      prompt += `\nCaratteristiche: ${characteristics.join(', ')}`;
    }
  }

  if (parameters.antagonist) {
    const { type, name, motivation, characteristics } = parameters.antagonist;
    prompt += `\n\nAntagonista: ${type || 'non specificato'}`;
    if (name) prompt += ` di nome ${name}`;
    if (motivation) prompt += ` motivato da ${motivation}`;
    if (characteristics?.length) {
      prompt += `\nCaratteristiche: ${characteristics.join(', ')}`;
    }
  }

  if (parameters.supportingCharacters?.length) {
    prompt += '\n\nPersonaggi di supporto:';
    parameters.supportingCharacters.forEach(char => {
      prompt += `\n- ${char.type || 'Personaggio'}`;
      if (char.name) prompt += ` di nome ${char.name}`;
      if (char.description) prompt += `: ${char.description}`;
      if (char.characteristics?.length) {
        prompt += `\n  Caratteristiche: ${char.characteristics.join(', ')}`;
      }
    });
  }

  if (parameters.plotElements?.length) {
    prompt += '\n\nElementi della trama da includere:';
    parameters.plotElements.forEach(element => {
      prompt += `\n- ${element}`;
    });
  }

  if (parameters.narrativeStructure) {
    prompt += `\n\nStruttura narrativa: ${parameters.narrativeStructure.type}`;
    if (parameters.narrativeStructure.chapters?.length) {
      prompt += '\nCapitoli:';
      parameters.narrativeStructure.chapters.forEach(chapter => {
        prompt += `\n- ${chapter.title}: ${chapter.description}`;
      });
    }
  }

  prompt += `\n\nGenerare una storia in italiano, strutturata in prologo e tre atti, 
  con particolare attenzione alla caratterizzazione dei personaggi e allo sviluppo della trama.
  La storia deve essere coinvolgente e seguire lo stile della narrativa moderna.`;

  return prompt;
};

// Funzione principale per generare la storia
export const generateStoryWithGemini = async (parameters: GeminiParameters): Promise<GeminiResponse> => {
  try {
    const startTime = Date.now();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
    
    const prompt = buildGeminiPrompt(parameters);
    console.log('Prompt per Gemini:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const processingTime = `${((Date.now() - startTime) / 1000).toFixed(1)}s`;

    return {
      content: text,
      metadata: {
        model: MODEL_NAME,
        promptTokens: 0, // Gemini non fornisce questi dati
        completionTokens: 0, // Gemini non fornisce questi dati
        processingTime
      }
    };
  } catch (error: any) {
    console.error('Errore durante la generazione con Gemini:', error);
    
    if (error.response) {
      console.error('Dettagli errore:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    throw new Error(error.message || 'Errore durante la generazione della storia con Gemini');
  }
};

// Esporta il servizio
const geminiService = {
  generateStory: generateStoryWithGemini
};

export default geminiService; 