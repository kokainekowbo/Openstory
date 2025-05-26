import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

interface ActDetailGeneratorProps {
  act: number;
  actTitle: string;
  actContent: string;
  storyGenre: string;
  storyTone: string;
  storyParams: any;
}

const Container = styled.div`
  margin: 1.5rem 0;
  padding: 1.5rem;
  background-color: #1a1a1a;
  border-radius: 12px;
  border-left: 3px solid #ffd700;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
`;

const ActTitle = styled.h3`
  color: #ffd700;
  margin-bottom: 1rem;
  font-size: 1.3rem;
`;

const ActContent = styled.div`
  margin-bottom: 1.5rem;
  line-height: 1.6;
  color: #f5f5f5;
  background-color: #222;
  padding: 1rem;
  border-radius: 8px;
`;

const Button = styled.button`
  background-color: #1a1a1a;
  color: #ffd700;
  border: 1px solid #ffd700;
  padding: 0.7rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  margin-right: 1rem;
  margin-bottom: 0.7rem;
  
  &:hover {
    background-color: #ffd700;
    color: #1a1a1a;
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(255, 215, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImagePromptButton = styled(Button)`
  background-color: #2d1810;
  border: 2px solid #ff8a00;
  color: #ff8a00;
  font-weight: bold;
  position: relative;
  
  &:hover {
    background-color: #ff8a00;
    color: #1a1a1a;
    box-shadow: 0 4px 15px rgba(255, 138, 0, 0.4);
  }
  
  &::before {
    content: '🎨';
    margin-right: 0.5rem;
  }
`;

const ButtonSection = styled.div`
  margin-bottom: 1rem;
`;

const ImagePromptSection = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2a1a1a;
  border-radius: 8px;
  border: 1px solid #ff8a00;
`;

const SectionTitle = styled.h4`
  color: #ff8a00;
  margin-bottom: 1rem;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  
  &::before {
    content: '🖼️';
    margin-right: 0.5rem;
  }
`;

const DetailContainer = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #222;
  border-radius: 6px;
  white-space: pre-line;
`;

const LoadingIndicator = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem 0;
  
  span {
    margin-left: 0.5rem;
  }
`;

const Spinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 215, 0, 0.2);
  border-radius: 50%;
  border-top-color: #ffd700;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const CopyButton = styled.button`
  background-color: #333;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  margin-left: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #555;
    transform: translateY(-1px);
  }
`;

const CopyPromptButton = styled(CopyButton)`
  background-color: #ff8a00;
  color: #1a1a1a;
  font-weight: bold;
  border: 2px solid #ff8a00;
  
  &:hover {
    background-color: #ff6600;
    color: #fff;
    box-shadow: 0 4px 15px rgba(255, 138, 0, 0.3);
  }
  
  &::before {
    content: '📋 ';
  }
`;

// Generatori di dettagli predefiniti
const detailTemplates = {
  scene: {
    title: "Descrizione dettagliata della scena",
    prompt: (act: number, content: string, genre: string, tone: string) => {
      return `Basandoti sul seguente contenuto dell'Atto ${act}, genera una descrizione dettagliata della scena principale, includendo ambientazione, atmosfera, illuminazione, suoni e sensazioni. Stile: ${genre}, tono: ${tone}.\n\nContenuto dell'atto:\n${content}`;
    }
  },
  characters: {
    title: "Approfondimento sui personaggi",
    prompt: (act: number, content: string, genre: string, tone: string) => {
      return `Basandoti sul seguente contenuto dell'Atto ${act}, genera un approfondimento sui personaggi presenti, descrivendo il loro aspetto fisico, abbigliamento, postura, espressioni facciali, linguaggio del corpo e tono di voce. Stile: ${genre}, tono: ${tone}.\n\nContenuto dell'atto:\n${content}`;
    }
  },
  dialogues: {
    title: "Dialoghi estesi",
    prompt: (act: number, content: string, genre: string, tone: string) => {
      return `Basandoti sul seguente contenuto dell'Atto ${act}, espandi i dialoghi tra i personaggi presenti, mantenendo la loro personalità e le dinamiche di potere. Aggiungi dettagli sul tono di voce, pause e gestualità. Stile: ${genre}, tono: ${tone}.\n\nContenuto dell'atto:\n${content}`;
    }
  },
  emotions: {
    title: "Emozioni e pensieri interiori",
    prompt: (act: number, content: string, genre: string, tone: string) => {
      return `Basandoti sul seguente contenuto dell'Atto ${act}, descrivi i pensieri interiori e le emozioni dei personaggi, creando un approfondimento psicologico che mostri le loro motivazioni e conflitti. Stile: ${genre}, tono: ${tone}.\n\nContenuto dell'atto:\n${content}`;
    }
  },
  imagePrompt: {
    title: "Prompt visivo per generatori AI",
    prompt: (act: number, content: string, genre: string, tone: string) => {
      return `ISTRUZIONI: Crea un prompt visivo dettagliato e ottimizzato per generatori di immagini AI (Fooocus, DALL-E, Midjourney, Stable Diffusion) basato sull'Atto ${act} della storia.

CONTENUTO DELL'ATTO:
${content}

STILE: ${genre}
TONO: ${tone}

Il prompt deve includere:
1. SCENA PRINCIPALE: Descrivi la scena più importante dell'atto
2. PERSONAGGI: Aspetto fisico, abbigliamento, posture ed espressioni
3. AMBIENTAZIONE: Luogo, architettura, oggetti di scena
4. ATMOSFERA: Illuminazione, colori, condizioni meteorologiche
5. STILE ARTISTICO: Tecnica fotografica/pittorica appropriata al genere
6. QUALITÀ TECNICA: Dettagli per ottenere immagini di alta qualità

Formatta il prompt in modo che sia immediatamente copiabile e utilizzabile. Usa termini specifici per l'AI art e mantieni il testo in inglese per massima compatibilità con i generatori internazionali.`;
    }
  }
};

// API_KEY di OpenRouter (in produzione, usare variabili d'ambiente)
const API_KEY = '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';

const ActDetailGenerator: React.FC<ActDetailGeneratorProps> = ({ 
  act, 
  actTitle, 
  actContent, 
  storyGenre, 
  storyTone,
  storyParams
}) => {
  const [detailType, setDetailType] = useState<string | null>(null);
  const [detailContent, setDetailContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState<string>('');
  
  // Funzione per generare un dettaglio usando OpenRouter
  const generateDetail = async (type: string) => {
    setDetailType(type);
    setIsLoading(true);
    setError(null);
    setCopySuccess('');
    
    const template = detailTemplates[type as keyof typeof detailTemplates];
    const prompt = template.prompt(act, actContent, storyGenre, storyTone);
    
    try {
      // Utente su dispositivo mobile potrebbe non avere accesso alla rete
      if (window.navigator.onLine === false) {
        throw new Error("Impossibile connettersi al servizio. Verifica la tua connessione internet.");
      }
      
      // Chiamata all'API di OpenRouter
      const response = await axios.post('https://openrouter.ai/api/v1/chat/completions', {
        model: 'qwen/qwen3-235b-a22b:free',
        messages: [
          {
            role: "system",
            content: "Sei un assistente specializzato nella generazione di contenuti creativi per storie. Rispondi sempre in italiano con contenuti ricchi di dettagli e adatti al genere e tono richiesti."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 800
      }, {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'OpenStory'
        }
      });
      
      // Estrai il contenuto generato
      if (response.data && response.data.choices && response.data.choices.length > 0) {
        setDetailContent(response.data.choices[0].message.content);
      } else {
        throw new Error("Risposta API non valida");
      }
    } catch (err: any) {
      console.error("Errore durante la generazione del dettaglio:", err);
      
      // Genera una risposta locale in caso di errore
      setDetailContent(generateFallbackDetail(type, act, actContent, storyGenre, storyTone));
      
      if (err.response) {
        setError(`Errore API (${err.response.status}): ${err.response.data?.error || 'Errore sconosciuto'}`);
      } else if (err.request) {
        setError("Nessuna risposta dal server. Verifica la tua connessione internet.");
      } else {
        setError(err.message || "Errore sconosciuto durante la generazione.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Funzione per copiare il prompt negli appunti
  const copyToClipboard = () => {
    navigator.clipboard.writeText(detailContent)
      .then(() => {
        setCopySuccess('Copiato!');
        setTimeout(() => setCopySuccess(''), 2000);
      })
      .catch(err => {
        console.error('Errore durante la copia:', err);
        setCopySuccess('Errore');
      });
  };

  // Genera un dettaglio di fallback in locale
  const generateFallbackDetail = (type: string, act: number, content: string, genre: string, tone: string): string => {
    const getRandomElement = (arr: string[]): string => arr[Math.floor(Math.random() * arr.length)];
    
    // Template per ambientazioni
    const sceneTemplates = {
      "fantasy": [
        "La luce dorata filtrava attraverso le maestose volte della sala del trono. Archi di pietra antica, decorati con rune luminescenti, sostenevano il soffitto altissimo. L'aria profumava di incenso e magia antica.",
        "La foresta incantata era avvolta nella nebbia, gli alberi millenari si ergevano come guardiani silenziosi. Luci fatate danzavano tra le foglie, mentre sussurri di creature invisibili riempivano l'aria umida e carica di mistero."
      ],
      "sci-fi": [
        "Il corridoio della stazione spaziale era illuminato da luci al neon blu e viola. Attraverso gli oblò si poteva vedere la vastità dello spazio e la nebulosa che avvolgeva il sistema stellare con i suoi colori vivaci.",
        "I grattacieli della metropoli futuristica si innalzavano verso il cielo inquinato, mentre veicoli volanti sfrecciavano tra di essi. Insegne olografiche proiettavano messaggi pubblicitari che si riflettevano sulle superfici di vetro e metallo."
      ],
      "thriller": [
        "La stanza era immersa nella penombra, illuminata solo dalla luce fioca di una lampada da tavolo. La pioggia batteva contro le finestre, creando ombre inquietanti sulle pareti scrostate. Un orologio ticchettava, scandendo il tempo con precisione implacabile.",
        "Il vicolo era stretto e buio, i muri dei palazzi si ergevano minacciosi ai lati. L'umidità della notte si mescolava con l'odore acre dei rifiuti. In lontananza, il suono delle sirene della polizia ricordava che la città non dormiva mai."
      ]
    };
    
    // Template per personaggi
    const characterTemplates = {
      "fantasy": [
        "Il mago anziano aveva una lunga barba argentata che contrastava con la sua veste blu notte ricamata con simboli arcani. I suoi occhi, di un azzurro quasi soprannaturale, sembravano contenere la saggezza di secoli.",
        "La guerriera elfica si muoveva con grazia felina, la sua armatura di cuoio e metallo leggero non limitava i suoi movimenti fluidi. I capelli ramati erano intrecciati con perle e piume, e la cicatrice sulla guancia raccontava di battaglie passate."
      ],
      "sci-fi": [
        "Il capitano della nave stellare indossava un'uniforme grigia con inserti luminosi che ne indicavano il rango. Il suo volto segnato dalle radiazioni cosmiche era impassibile, ma gli occhi tradivano la preoccupazione per l'equipaggio.",
        "L'androide aveva sembianze umane quasi perfette, tradite solo dal leggero bagliore blu che emanava dalle pupille. I movimenti, pur fluidi, avevano una precisione meccanica che nessun umano avrebbe potuto replicare."
      ],
      "thriller": [
        "Il detective aveva un volto scavato dalle notti insonni e dalle troppe sigarette. Il suo impermeabile logoro aveva visto giorni migliori, proprio come lui. Le mani, sempre leggermente tremanti, tradivano la sua dipendenza dal whisky.",
        "La testimone si tormentava nervosamente i capelli mentre parlava. Gli occhi, costantemente in movimento, scrutavano ogni angolo della stanza come se cercassero una via di fuga. Il rossetto rosso evidenziava il tremito delle labbra."
      ]
    };
    
    // Template per prompt visivi
    const imagePromptTemplates = {
      "fantasy": [
        `**PROMPT AI OTTIMIZZATO - ATTO ${act}**

Medieval fantasy scene, ancient stone throne room with luminescent runes carved into gothic arches, golden sunlight filtering through stained glass windows, ornate architectural details, mystical atmosphere, dramatic lighting, cinematic composition, photorealistic rendering, high detail, 4K quality, fantasy art style, ambient magical glow

Camera: Wide angle shot, dramatic perspective
Lighting: Warm golden hour light, volumetric rays
Style: Epic fantasy, detailed medieval architecture
Quality: Professional photography, sharp focus, high resolution`,

        `**PROMPT AI OTTIMIZZATO - ATTO ${act}**

Enchanted forest shrouded in mist, ancient twisted trees with glowing fairy lights dancing among branches, mysterious magical atmosphere, emerald and azure color palette, ethereal lighting filtering through foliage, cinematic depth of field, photorealistic quality, fantasy illustration style

Camera: Medium shot with shallow depth of field
Lighting: Soft ethereal glow, dappled forest light
Style: Magical realism, detailed nature photography
Quality: High resolution, crisp detail, professional composition`
      ],
      "sci-fi": [
        `**PROMPT AI OTTIMIZZATO - ATTO ${act}**

Futuristic space station corridor with blue and purple neon lighting, large windows showing colorful nebula in space, sleek metallic surfaces with reflective details, minimalist hi-tech design, atmospheric depth, cinematic sci-fi composition, photorealistic rendering, 4K quality

Camera: Point of view shot down corridor
Lighting: Neon ambiance, space lighting through windows
Style: Modern sci-fi, clean futuristic aesthetic
Quality: Sharp focus, high detail, professional photography`,

        `**PROMPT AI OTTIMIZZATO - ATTO ${act}**

Cyberpunk metropolis aerial view, towering skyscrapers piercing through industrial smog, flying vehicles with light trails, colorful holographic billboards, rain reflecting neon lights, dark technological atmosphere, contrasted lighting, cinematic composition, photorealistic quality

Camera: High angle aerial shot
Lighting: Neon reflections, dramatic contrast
Style: Cyberpunk aesthetic, urban photography
Quality: High resolution, detailed cityscape, professional composition`
      ],
      "thriller": [
        `**PROMPT AI OTTIMIZZADO - ATTO ${act}**

Dimly lit room with single table lamp, rain beating against windows creating ominous shadows on peeling wallpaper, vintage clock in foreground, tense claustrophobic atmosphere, desaturated color palette, noir style lighting, dramatic shadows, cinematic composition, photorealistic quality

Camera: Close-up with selective focus
Lighting: Single source dramatic lighting, high contrast
Style: Film noir, psychological thriller aesthetic
Quality: Sharp detail, moody atmosphere, professional photography`,

        `**PROMPT AI OTTIMIZZATO - ATTO ${act}**

Dark narrow urban alley at night, wet brick walls reflecting distant streetlights, puddles creating light reflections, light fog, threatening atmosphere, cold color palette with red accents, strong contrast, cinematic noir style, photorealistic quality

Camera: Low angle perspective shot
Lighting: Street lighting with dramatic shadows
Style: Urban thriller, noir photography
Quality: High contrast, detailed textures, professional composition`
      ]
    };
    
    switch (type) {
      case 'scene':
        const sceneGenre = genre.toLowerCase().includes('fantasy') ? 'fantasy' : 
                          genre.toLowerCase().includes('sci') ? 'sci-fi' : 'thriller';
        return `**Descrizione della Scena - Atto ${act}**\n\n${getRandomElement(sceneTemplates[sceneGenre as keyof typeof sceneTemplates])}\n\n[Nota: Questo è un contenuto generato localmente come fallback a causa di problemi con l'API.]`;
      
      case 'characters':
        const charGenre = genre.toLowerCase().includes('fantasy') ? 'fantasy' : 
                         genre.toLowerCase().includes('sci') ? 'sci-fi' : 'thriller';
        return `**Dettagli sui Personaggi - Atto ${act}**\n\n${getRandomElement(characterTemplates[charGenre as keyof typeof characterTemplates])}\n\n[Nota: Questo è un contenuto generato localmente come fallback a causa di problemi con l'API.]`;
      
      case 'dialogues':
        return `**Dialoghi Estesi - Atto ${act}**\n\nPersonaggio 1: "Non avevo mai immaginato che saremmo arrivati a questo punto. Credi davvero che ci sia ancora una possibilità di successo?"\n\nPersonaggio 2: *con tono risoluto* "Finché siamo qui, a combattere, c'è sempre speranza. Non è la forza che ci definisce, ma la volontà di continuare quando tutto sembra perduto."\n\n[Nota: Questo è un contenuto generato localmente come fallback a causa di problemi con l'API.]`;
      
      case 'emotions':
        return `**Emozioni e Pensieri - Atto ${act}**\n\nIl conflitto interiore cresceva ad ogni passo. Da un lato, il senso del dovere e la responsabilità verso chi contava su di lui; dall'altro, la paura del fallimento e il peso delle conseguenze. I ricordi del passato si intrecciavano con le incertezze del presente, rendendo ogni decisione un tormento.\n\n[Nota: Questo è un contenuto generato localmente come fallback a causa di problemi con l'API.]`;
      
      case 'imagePrompt':
        const promptGenre = genre.toLowerCase().includes('fantasy') ? 'fantasy' : 
                           genre.toLowerCase().includes('sci') ? 'sci-fi' : 'thriller';
        return `${getRandomElement(imagePromptTemplates[promptGenre as keyof typeof imagePromptTemplates])}\n\n**ISTRUZIONI D'USO:**\n• Copia il prompt sopra e incollalo nel tuo generatore AI preferito\n• Per Fooocus: usa le impostazioni "Realistic" o "Cinematic"\n• Per DALL-E: rimuovi i parametri tecnici se necessario\n• Per Midjourney: aggiungi --ar 16:9 per formato cinematografico\n\n[Contenuto generato offline - per prompt personalizzati connettiti a internet]`;
      
      default:
        return `Impossibile generare dettaglio di tipo "${type}" in modalità offline. Riprova quando sarai connesso a internet.`;
    }
  };
  
  return (
    <Container>
      <ActTitle>{actTitle}</ActTitle>
      <ActContent>{actContent}</ActContent>
      
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        <ButtonSection>
        <Button onClick={() => generateDetail('scene')}>
            📝 Descrizione Scena
        </Button>
        <Button onClick={() => generateDetail('characters')}>
            👥 Dettagli Personaggi
        </Button>
        <Button onClick={() => generateDetail('dialogues')}>
            💬 Dialoghi Estesi
        </Button>
        <Button onClick={() => generateDetail('emotions')}>
            💭 Emozioni e Pensieri
        </Button>
        </ButtonSection>
      </div>
      
      <ImagePromptSection>
        <SectionTitle>Generazione Immagini AI</SectionTitle>
        <p style={{ color: '#ccc', marginBottom: '1rem', fontSize: '0.9rem' }}>
          Crea un prompt dettagliato ottimizzato per Fooocus, DALL-E, Midjourney e altri generatori di immagini AI
        </p>
        <ImagePromptButton onClick={() => generateDetail('imagePrompt')}>
          Genera Prompt per Immagini
        </ImagePromptButton>
      </ImagePromptSection>
      
      {isLoading && (
        <LoadingIndicator>
          <Spinner />
          <span>Generando dettagli...</span>
        </LoadingIndicator>
      )}
      
      {error && <p style={{ color: '#ff4d4d', marginTop: '1rem' }}>{error}</p>}
      
      {detailType && detailContent && !isLoading && (
        <DetailContainer>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ color: '#ffd700', margin: 0 }}>
              {detailTemplates[detailType as keyof typeof detailTemplates].title}
            </h4>
            {detailType === 'imagePrompt' && (
              <div>
                <CopyPromptButton onClick={copyToClipboard}>
                  {copySuccess || 'Copia Prompt AI'}
                </CopyPromptButton>
              </div>
            )}
            {detailType !== 'imagePrompt' && (
              <div>
                <CopyButton onClick={copyToClipboard}>
                  {copySuccess || 'Copia testo'}
                </CopyButton>
              </div>
            )}
          </div>
          {detailContent}
        </DetailContainer>
      )}
    </Container>
  );
};

export default ActDetailGenerator; 