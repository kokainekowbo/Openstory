import React, { useEffect, useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  useStoryStore, 
  useCurrentStory, 
  useParsedSections
} from '../store/storyStore';

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  background: rgba(26, 26, 26, 0.8);
  backdrop-filter: blur(15px);
  padding: 2rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const StoryTitle = styled.h1`
  color: #ffd700;
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: pulse 2s ease-in-out infinite alternate;
  
  @keyframes pulse {
    0% { opacity: 0.8; }
    100% { opacity: 1; }
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

// Debug Component
const DebugInfo = styled.div`
  background: rgba(255, 0, 0, 0.1);
  border: 1px solid rgba(255, 0, 0, 0.3);
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  color: #ff6b6b;
  font-family: monospace;
  font-size: 0.8rem;
`;

// Section Components
const SectionContainer = styled.div`
  margin-bottom: 3rem;
  background: rgba(26, 26, 26, 0.95);
  border-radius: 15px;
  padding: 2rem;
  border: 2px solid rgba(255, 215, 0, 0.3);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
`;

const SectionTitle = styled.h2`
  color: #ffd700;
  font-size: 1.8rem;
  font-weight: bold;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 2px;
`;

const SectionContent = styled.div`
  white-space: pre-wrap;
  line-height: 1.8;
  margin-bottom: 2rem;
  color: #f5f5f5;
  font-size: 1.1rem;
`;

// Image Prompt Section
const ImagePromptSection = styled.div`
  background: linear-gradient(135deg, #2d1810 0%, #4a2318 100%);
  border: 3px solid #ff8a00;
  border-radius: 15px;
  padding: 2rem;
  margin-top: 2rem;
`;

const ImageSectionTitle = styled.h3`
  color: #ff8a00;
  font-size: 1.4rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
  
  &::before {
    content: '🎨';
    margin-right: 0.5rem;
    font-size: 1.6rem;
  }
`;

const PromptGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const PromptCard = styled.div`
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 138, 0, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
`;

const PromptTitle = styled.h4`
  color: #ff8a00;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  font-weight: bold;
`;

const PromptText = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1rem;
  color: #f5f5f5;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
  margin-bottom: 1rem;
  max-height: 150px;
  overflow-y: auto;
`;

// Buttons
const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'image' | 'copy' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  ${props => {
    switch(props.variant) {
      case 'primary':
        return `
          background: linear-gradient(45deg, #ffd700, #ffed4e);
          color: #1a1a2e;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
          }
        `;
      case 'image':
        return `
          background: linear-gradient(45deg, #ff8a00, #ff6600);
          color: #fff;
          font-weight: bold;
          width: 100%;
          justify-content: center;
          font-size: 1.1rem;
          padding: 1rem 2rem;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(255, 138, 0, 0.4);
          }
        `;
      case 'copy':
        return `
          background: rgba(255, 138, 0, 0.2);
          color: #ff8a00;
          border: 1px solid #ff8a00;
          font-size: 0.8rem;
          padding: 0.5rem 1rem;
          &:hover {
            background: rgba(255, 138, 0, 0.3);
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: rgba(255, 255, 255, 0.1);
          color: #f5f5f5;
          border: 1px solid rgba(255, 255, 255, 0.2);
          &:hover {
            background: rgba(255, 255, 255, 0.2);
            transform: translateY(-2px);
          }
        `;
    }
  }}
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

// Pannello Impostazioni
const SettingsPanel = styled.div`
  background: rgba(26, 26, 26, 0.95);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const SettingsTitle = styled.h3`
  color: #ffd700;
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '⚙️';
    font-size: 1.3rem;
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const SettingItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f5f5f5;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.2s;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    accent-color: #ffd700;
  }
`;

const ToggleButton = styled.button<{ isVisible: boolean }>`
  background: ${props => props.isVisible ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.isVisible ? '#ffd700' : 'rgba(255, 255, 255, 0.2)'};
  color: ${props => props.isVisible ? '#ffd700' : '#f5f5f5'};
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  
  &:hover {
    background: rgba(255, 215, 0, 0.3);
    color: #ffd700;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 138, 0, 0.2);
  border-radius: 50%;
  border-top-color: #ff8a00;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #c9c9c9;
  
  h3 {
    color: #ffd700;
    margin-bottom: 1rem;
  }
  
  p {
    margin-bottom: 2rem;
  }
`;

// Interfaccia per l'analisi della sezione
interface SectionAnalysis {
  visualElements: string[];
  setting: string;
  characters: string[];
  protagonist: string;
  antagonist: string;
  mood: string;
  actions: string[];
  timeOfDay: string;
  weather: string;
  storyStructure: 'beginning' | 'development' | 'climax' | 'ending' | 'continuation';
}

// Interfaccia per sezioni personalizzate
interface CustomSection {
  id: string;
  title: string;
  content: string;
  isEnding?: boolean;
  isContinuation?: boolean;
}

// Database nomi fantasy comuni
const fantasyNames = {
  protagonists: {
    male: ['Aiden', 'Kai', 'Zander', 'Rylan', 'Damon', 'Orion', 'Atlas', 'Phoenix', 'Blaze', 'Storm', 'Raven', 'Hunter', 'Archer', 'Sage', 'River'],
    female: ['Luna', 'Aurora', 'Seraphina', 'Lyra', 'Nova', 'Aria', 'Ember', 'Iris', 'Celeste', 'Raven', 'Sage', 'River', 'Phoenix', 'Storm', 'Skye'],
    neutral: ['River', 'Sage', 'Phoenix', 'Storm', 'Raven', 'Hunter', 'Archer', 'Rowan', 'Avery', 'Quinn', 'Blake', 'Jordan', 'Alex', 'Morgan', 'Cameron']
  },
  antagonists: {
    male: ['Malachar', 'Vex', 'Draven', 'Nyx', 'Grimm', 'Voidus', 'Shadowbane', 'Darkthorn', 'Blackheart', 'Ravenclaw', 'Nightfall', 'Bloodmoon'],
    female: ['Morgana', 'Lilith', 'Nyx', 'Vex', 'Ravenna', 'Shadowmere', 'Darkspell', 'Nightshade', 'Grimhilde', 'Blackrose', 'Voidess'],
    neutral: ['Shadow', 'Void', 'Darkness', 'Nightmare', 'Eclipse', 'Phantom', 'Specter', 'Wraith', 'Nemesis', 'Chaos']
  }
};

// Parole indicatrici di antagonisti
const antagonistIndicators = [
  'nemico', 'avversario', 'villain', 'cattivo', 'malvagio', 'antagonista',
  'oppositore', 'rivale', 'traditore', 'assassino', 'criminale', 'boss',
  'capo', 'leader', 'signore', 'padrone', 'imperatore', 'tiranno',
  'combatte contro', 'lotta contro', 'sfida', 'minaccia', 'attacca',
  'perseguita', 'insegue', 'tortura', 'uccide', 'rapisce'
];

// Indicatori struttura storia
const storyStructureIndicators = {
  beginning: ['inizia', 'comincia', 'inizio', 'prima volta', 'all\'inizio', 'prologo'],
  development: ['sviluppo', 'continua', 'nel frattempo', 'successivamente', 'poi', 'dopo'],
  climax: ['climax', 'battaglia finale', 'confronto', 'scontro decisivo', 'momento cruciale'],
  ending: ['fine', 'finale', 'conclusione', 'epilogo', 'alla fine', 'finalmente', 'termina'],
  continuation: ['continua', 'to be continued', 'segue', 'prossimo episodio', 'continuerà']
};

// Main Component
const OptimizedStoryDisplayPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Store hooks
  const currentStory = useCurrentStory();
  const sections = useParsedSections();
  
  const { parseStoryContent } = useStoryStore();
  
  // Local state
  const [generatingPrompts, setGeneratingPrompts] = useState<Record<string, boolean>>({});
  const [generatedPrompts, setGeneratedPrompts] = useState<Record<string, any>>({});
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const [showDebug, setShowDebug] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [storySettings, setStorySettings] = useState({
    hasContinuation: false,
    autoDetectCharacters: true,
    useFantasyNames: true,
    includeAntagonist: true
  });

  // Funzione per aggiornare le impostazioni
  const updateSetting = (key: keyof typeof storySettings, value: boolean) => {
    setStorySettings(prev => ({
      ...prev,
      [key]: value
    }));
    
    // Rigenera le sezioni quando cambiano le impostazioni
    if (currentStory?.content) {
      const smartSections = smartParseStory(currentStory.content);
      setCustomSections(smartSections);
    }
  };

  // Rileva personaggi intelligentemente
  const detectCharacters = (content: string): { protagonist: string; antagonist: string; characters: string[] } => {
    let protagonist = '';
    let antagonist = '';
    const characters: string[] = [];
    
    // Cerca nomi propri esistenti nel testo
    const nameMatches = content.match(/\b[A-Z][a-z]+(?:\s[A-Z][a-z]+)?\b/g);
    const existingNames = nameMatches ? [...new Set(nameMatches)] : [];
    
    // Filtra nomi comuni che non sono personaggi
    const commonWords = ['Il', 'La', 'Un', 'Una', 'Quello', 'Quella', 'Questo', 'Questa', 'Tokyo', 'Milano', 'Roma', 'Italia', 'Giappone'];
    const actualNames = existingNames.filter(name => !commonWords.includes(name) && name.length > 2);
    
    if (storySettings.autoDetectCharacters) {
      if (actualNames.length > 0) {
        // Usa nomi esistenti se disponibili
        protagonist = actualNames[0];
        if (actualNames.length > 1) {
          // Cerca l'antagonista tra i nomi rimanenti
          for (let i = 1; i < actualNames.length; i++) {
            const context = content.toLowerCase();
            const nameInContext = actualNames[i].toLowerCase();
            const isAntagonist = antagonistIndicators.some(indicator => 
              context.includes(`${nameInContext} ${indicator}`) || 
              context.includes(`${indicator} ${nameInContext}`)
            );
            if (isAntagonist) {
              antagonist = actualNames[i];
              break;
            }
          }
          if (!antagonist && actualNames.length > 1) {
            antagonist = actualNames[1]; // Fallback al secondo nome
          }
        }
        characters.push(...actualNames.slice(0, 3));
      } else if (storySettings.useFantasyNames) {
        // Genera nomi fantasy se non ci sono nomi nel testo
        const randomProtagonist = fantasyNames.protagonists.neutral[Math.floor(Math.random() * fantasyNames.protagonists.neutral.length)];
        protagonist = randomProtagonist;
        
        if (storySettings.includeAntagonist) {
          const hasAntagonistContext = antagonistIndicators.some(indicator => content.toLowerCase().includes(indicator));
          if (hasAntagonistContext) {
            const randomAntagonist = fantasyNames.antagonists.neutral[Math.floor(Math.random() * fantasyNames.antagonists.neutral.length)];
            antagonist = randomAntagonist;
            characters.push(protagonist, antagonist);
          } else {
            characters.push(protagonist);
          }
        } else {
          characters.push(protagonist);
        }
      }
    }
    
    return { protagonist, antagonist, characters };
  };

  // Rileva struttura della storia
  const detectStoryStructure = (content: string, sectionIndex: number, totalSections: number): 'beginning' | 'development' | 'climax' | 'ending' | 'continuation' => {
    const lowerContent = content.toLowerCase();
    
    // Controlla indicatori di continuazione
    if (storyStructureIndicators.continuation.some(indicator => lowerContent.includes(indicator))) {
      return 'continuation';
    }
    
    // Controlla indicatori specifici
    if (storyStructureIndicators.ending.some(indicator => lowerContent.includes(indicator))) {
      return 'ending';
    }
    
    if (storyStructureIndicators.climax.some(indicator => lowerContent.includes(indicator))) {
      return 'climax';
    }
    
    if (storyStructureIndicators.beginning.some(indicator => lowerContent.includes(indicator))) {
      return 'beginning';
    }
    
    // Fallback basato sulla posizione
    if (sectionIndex === 0) return 'beginning';
    if (sectionIndex === totalSections - 1) return 'ending';
    if (sectionIndex === totalSections - 2 && totalSections > 2) return 'climax';
    
    return 'development';
  };

  // Parsing intelligente della storia migliorato
  const smartParseStory = useCallback((content: string): CustomSection[] => {
    const sections: CustomSection[] = [];
    
    // Prima cerca pattern esistenti (### PROLOGO, ### ATTO I, ecc.)
    const standardPatterns = [
      { regex: /###\s*PROLOGO/i, title: 'Prologo' },
      { regex: /###\s*ATTO\s*I(?:\s|$)/i, title: 'Atto I' },
      { regex: /###\s*ATTO\s*II(?:\s|$)/i, title: 'Atto II' },
      { regex: /###\s*ATTO\s*III(?:\s|$)/i, title: 'Atto III' },
      { regex: /###\s*CAPITOLO\s*\d+/i, title: 'Capitolo' },
      { regex: /###\s*PARTE\s*\d+/i, title: 'Parte' },
      { regex: /###\s*EPILOGO/i, title: 'Epilogo' }
    ];
    
    let foundStandardSections = false;
    
    // Cerca sezioni standard
    const allMatches: Array<{pattern: any, match: RegExpMatchArray, index: number}> = [];
    
    standardPatterns.forEach(pattern => {
      const matches = Array.from(content.matchAll(new RegExp(pattern.regex.source, 'gi')));
      matches.forEach(match => {
        if (match.index !== undefined) {
          allMatches.push({pattern, match, index: match.index});
        }
      });
    });
    
    // Ordina per posizione
    allMatches.sort((a, b) => a.index - b.index);
    
    if (allMatches.length > 0) {
      foundStandardSections = true;
      
      allMatches.forEach((current, i) => {
        const startIndex = current.index;
        const nextMatch = allMatches[i + 1];
        const endIndex = nextMatch ? nextMatch.index : content.length;
        
        const sectionContent = content
          .substring(startIndex, endIndex)
          .replace(current.pattern.regex, '')
          .trim();
        
        if (sectionContent && sectionContent.length > 50) {
          const isEnding = current.pattern.title.toLowerCase().includes('epilogo') || 
                          (i === allMatches.length - 1 && !storySettings.hasContinuation);
          const isContinuation = storyStructureIndicators.continuation.some(indicator => 
            sectionContent.toLowerCase().includes(indicator));
          
          sections.push({
            id: `section-${i}`,
            title: current.pattern.title,
            content: sectionContent,
            isEnding,
            isContinuation
          });
        }
      });
    }
    
    // Se non trova sezioni standard, dividi intelligentemente
    if (!foundStandardSections || sections.length === 0) {
      const paragraphs = content.split('\n\n').filter(p => p.trim().length > 100);
      
      if (paragraphs.length >= 3) {
        const partSize = Math.ceil(paragraphs.length / 3);
        
        sections.push({
          id: 'beginning',
          title: 'Inizio',
          content: paragraphs.slice(0, partSize).join('\n\n'),
          isEnding: false
        });
        
        sections.push({
          id: 'development',
          title: 'Sviluppo',
          content: paragraphs.slice(partSize, partSize * 2).join('\n\n'),
          isEnding: false
        });
        
        const finalContent = paragraphs.slice(partSize * 2).join('\n\n');
        const isContinuation = storyStructureIndicators.continuation.some(indicator => 
          finalContent.toLowerCase().includes(indicator));
        
        sections.push({
          id: 'finale',
          title: isContinuation ? 'Continua...' : 'Finale',
          content: finalContent,
          isEnding: !isContinuation,
          isContinuation
        });
      } else if (paragraphs.length === 2) {
        sections.push({
          id: 'parte1',
          title: 'Prima Parte',
          content: paragraphs[0],
          isEnding: false
        });
        
        const secondContent = paragraphs[1];
        const isContinuation = storyStructureIndicators.continuation.some(indicator => 
          secondContent.toLowerCase().includes(indicator));
        
        sections.push({
          id: 'parte2',
          title: isContinuation ? 'Continua...' : 'Seconda Parte',
          content: secondContent,
          isEnding: !isContinuation,
          isContinuation
        });
      } else {
        // Storia singola - controlla se è completa
        const isContinuation = storyStructureIndicators.continuation.some(indicator => 
          content.toLowerCase().includes(indicator));
        
        sections.push({
          id: 'storia-completa',
          title: isContinuation ? 'Storia - Continua...' : 'Storia Completa',
          content: content.trim(),
          isEnding: !isContinuation,
          isContinuation
        });
      }
    }
    
    return sections.filter(s => s.content.length > 50);
  }, [storySettings.hasContinuation]);

  // Analizza il contenuto di un'intera sezione per estrarre elementi visivi migliorata
  const analyzeSectionContent = (content: string, sectionIndex: number = 0, totalSections: number = 1): SectionAnalysis => {
    const visualElements: string[] = [];
    const actions: string[] = [];
    let setting = '';
    let mood = '';
    let timeOfDay = '';
    let weather = '';
    
    // Rileva personaggi
    const characterData = detectCharacters(content);
    
    // Rileva struttura
    const storyStructure = detectStoryStructure(content, sectionIndex, totalSections);
    
    // Elementi visivi comuni
    const visualKeywords = {
      lighting: ['buio', 'luce', 'ombra', 'sole', 'luna', 'lampada', 'fuoco', 'neon', 'riflesso', 'illuminato'],
      weather: ['pioggia', 'neve', 'nebbia', 'vento', 'tempesta', 'fulmine', 'tuono', 'sereno', 'nuvoloso'],
      colors: ['rosso', 'blu', 'verde', 'giallo', 'nero', 'bianco', 'grigio', 'dorato', 'argentato', 'scuro'],
      objects: ['auto', 'porta', 'finestra', 'strada', 'edificio', 'albero', 'scrivania', 'computer', 'telefono'],
      emotions: ['paura', 'rabbia', 'felicità', 'tristezza', 'ansia', 'tensione', 'sorpresa', 'amore']
    };
    
    // Estrai ambientazione
    const locationKeywords = ['casa', 'ufficio', 'strada', 'parco', 'edificio', 'stanza', 'cucina', 'bagno', 'camera', 'tokyo', 'milano', 'roma', 'città', 'palazzo', 'appartamento'];
    for (const keyword of locationKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        setting = keyword;
        break;
      }
    }
    
    // Estrai momento del giorno
    const timeKeywords = ['mattina', 'giorno', 'pomeriggio', 'sera', 'notte', 'alba', 'tramonto', 'mezzogiorno', 'mezzanotte'];
    for (const keyword of timeKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        timeOfDay = keyword;
        break;
      }
    }
    
    // Estrai tempo atmosferico
    const weatherKeywords = ['pioggia', 'sole', 'neve', 'nebbia', 'vento', 'tempesta', 'sereno'];
    for (const keyword of weatherKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        weather = keyword;
        break;
      }
    }
    
    // Estrai mood/atmosfera basato sulla struttura
    let moodKeywords = ['teso', 'drammatico', 'sereno', 'misterioso', 'romantico', 'action', 'thriller', 'horror', 'suspense', 'emotivo'];
    
    // Aggiungi mood specifici per struttura
    switch (storyStructure) {
      case 'beginning':
        moodKeywords = ['mysterious', 'intriguing', 'atmospheric', ...moodKeywords];
        break;
      case 'climax':
        moodKeywords = ['intense', 'dramatic', 'action-packed', ...moodKeywords];
        break;
      case 'ending':
        moodKeywords = ['conclusive', 'emotional', 'satisfying', ...moodKeywords];
        break;
    }
    
    for (const keyword of moodKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        mood = keyword;
        break;
      }
    }
    
    // Estrai azioni principali
    const actionKeywords = ['corre', 'cammina', 'guarda', 'parla', 'combatte', 'fugge', 'insegue', 'abbraccia', 'grida', 'sussurra', 'salta', 'cadere'];
    actionKeywords.forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        actions.push(keyword);
      }
    });
    
    // Aggiungi elementi visivi trovati
    Object.values(visualKeywords).flat().forEach(keyword => {
      if (content.toLowerCase().includes(keyword)) {
        visualElements.push(keyword);
      }
    });
    
    return {
      visualElements: [...new Set(visualElements)].slice(0, 8),
      characters: characterData.characters,
      protagonist: characterData.protagonist || 'protagonist',
      antagonist: characterData.antagonist || '',
      setting: setting || 'modern urban environment',
      mood: mood || (storyStructure === 'climax' ? 'dramatic' : 'atmospheric'),
      actions: [...new Set(actions)].slice(0, 3),
      timeOfDay: timeOfDay || 'day',
      weather: weather || 'clear',
      storyStructure
    };
  };

  // Parse story from location state OR from store
  useEffect(() => {
    // Prima prova location.state (se arriva dalla navigazione con parametri)
    if (location.state?.story) {
      const { story } = location.state;
      console.log('🔄 Parsing story from location.state:', story.substring(0, 100));
      parseStoryContent(story);
      const smartSections = smartParseStory(story);
      setCustomSections(smartSections);
    } 
    // Altrimenti usa currentStory dallo store
    else if (currentStory?.content) {
      console.log('🔄 Using story from store:', currentStory.content.substring(0, 100));
      parseStoryContent(currentStory.content);
      const smartSections = smartParseStory(currentStory.content);
      setCustomSections(smartSections);
    }
  }, [location.state, currentStory, parseStoryContent, smartParseStory]);

  // Usa le sezioni personalizzate se quelle standard sono vuote o hanno solo una sezione
  const sectionsToUse = (sections.length <= 1) ? customSections : sections.map(s => ({
    id: s.id,
    title: s.title,
    content: s.content
  }));

  // Funzione di traduzione dall'italiano all'inglese
  const translateToEnglish = {
    // Ambientazioni
    settings: {
      'casa': 'house',
      'ufficio': 'office',
      'strada': 'street',
      'parco': 'park',
      'edificio': 'building',
      'stanza': 'room',
      'cucina': 'kitchen',
      'bagno': 'bathroom',
      'camera': 'bedroom',
      'tokyo': 'Tokyo',
      'milano': 'Milan',
      'roma': 'Rome',
      'città': 'city',
      'palazzo': 'palace',
      'appartamento': 'apartment',
      'modern urban environment': 'modern urban environment'
    },
    
    // Mood/Atmosfere
    moods: {
      'teso': 'tense',
      'drammatico': 'dramatic',
      'sereno': 'serene',
      'misterioso': 'mysterious',
      'romantico': 'romantic',
      'action': 'action',
      'thriller': 'thriller',
      'horror': 'horror',
      'suspense': 'suspense',
      'emotivo': 'emotional'
    },
    
    // Momenti del giorno
    timeOfDay: {
      'mattina': 'morning',
      'giorno': 'day',
      'pomeriggio': 'afternoon',
      'sera': 'evening',
      'notte': 'night',
      'alba': 'dawn',
      'tramonto': 'sunset',
      'mezzogiorno': 'noon',
      'mezzanotte': 'midnight'
    },
    
    // Tempo atmosferico
    weather: {
      'pioggia': 'rain',
      'sole': 'sunny',
      'neve': 'snow',
      'nebbia': 'fog',
      'vento': 'windy',
      'tempesta': 'storm',
      'sereno': 'clear'
    },
    
    // Azioni
    actions: {
      'corre': 'running',
      'cammina': 'walking',
      'guarda': 'looking',
      'parla': 'talking',
      'combatte': 'fighting',
      'fugge': 'escaping',
      'insegue': 'chasing',
      'abbraccia': 'hugging',
      'grida': 'shouting',
      'sussurra': 'whispering',
      'salta': 'jumping',
      'cadere': 'falling'
    },
    
    // Elementi visivi
    visual: {
      'buio': 'darkness',
      'luce': 'light',
      'ombra': 'shadow',
      'sole': 'sun',
      'luna': 'moon',
      'lampada': 'lamp',
      'fuoco': 'fire',
      'neon': 'neon',
      'riflesso': 'reflection',
      'illuminato': 'illuminated',
      'pioggia': 'rain',
      'neve': 'snow',
      'nebbia': 'fog',
      'vento': 'wind',
      'tempesta': 'storm',
      'fulmine': 'lightning',
      'tuono': 'thunder',
      'sereno': 'clear',
      'nuvoloso': 'cloudy',
      'rosso': 'red',
      'blu': 'blue',
      'verde': 'green',
      'giallo': 'yellow',
      'nero': 'black',
      'bianco': 'white',
      'grigio': 'gray',
      'dorato': 'golden',
      'argentato': 'silver',
      'scuro': 'dark',
      'auto': 'car',
      'porta': 'door',
      'finestra': 'window',
      'strada': 'street',
      'edificio': 'building',
      'albero': 'tree',
      'scrivania': 'desk',
      'computer': 'computer',
      'telefono': 'phone',
      'paura': 'fear',
      'rabbia': 'anger',
      'felicità': 'happiness',
      'tristezza': 'sadness',
      'ansia': 'anxiety',
      'tensione': 'tension',
      'sorpresa': 'surprise',
      'amore': 'love'
    },
    
    // Stili cinematografici
    cinematicStyles: {
      'cinematic': 'cinematic',
      'film noir': 'film noir',
      'action movie': 'action movie',
      'thriller': 'thriller',
      'romantic drama': 'romantic drama'
    },
    
    // Titoli sezioni
    sectionTitles: {
      'Prologo': 'Prologue',
      'Atto I': 'Act I',
      'Atto II': 'Act II',
      'Atto III': 'Act III',
      'Prima Parte': 'First Part',
      'Seconda Parte': 'Second Part',
      'Inizio': 'Beginning',
      'Sviluppo': 'Development',
      'Finale': 'Finale',
      'Capitolo': 'Chapter',
      'Parte': 'Part',
      'Storia Completa': 'Complete Story'
    }
  };

  // Funzione per tradurre automaticamente un termine
  const translateTerm = (term: string, category: keyof typeof translateToEnglish): string => {
    const translations = translateToEnglish[category] as Record<string, string>;
    return translations[term.toLowerCase()] || term;
  };

  // Funzione per tradurre array di termini
  const translateArray = (terms: string[], category: keyof typeof translateToEnglish): string[] => {
    return terms.map(term => translateTerm(term, category));
  };

  // Funzione per tradurre semplici frasi italiane in inglese
  const translateContent = (italianText: string): string => {
    let englishText = italianText;
    
    // Sostituzioni base per parole comuni
    const basicTranslations = {
      ' e ': ' and ',
      ' con ': ' with ',
      ' per ': ' for ',
      ' sotto ': ' under ',
      ' sopra ': ' above ',
      ' dentro ': ' inside ',
      ' fuori ': ' outside ',
      ' davanti ': ' in front of ',
      ' dietro ': ' behind ',
      ' mentre ': ' while ',
      ' quando ': ' when ',
      ' dove ': ' where ',
      ' come ': ' like ',
      ' molto ': ' very ',
      ' più ': ' more ',
      ' meno ': ' less ',
      ' grande ': ' big ',
      ' piccolo ': ' small ',
      ' veloce ': ' fast ',
      ' lento ': ' slow ',
      ' forte ': ' strong ',
      ' debole ': ' weak ',
      ' alto ': ' tall ',
      ' basso ': ' short ',
      ' nuovo ': ' new ',
      ' vecchio ': ' old ',
      ' bello ': ' beautiful ',
      ' brutto ': ' ugly ',
      ' disperatamente ': ' desperately ',
      ' battente ': ' beating ',
      ' risuonano ': ' echoing ',
      ' bagnato ': ' wet ',
      ' asciutto ': ' dry '
    };
    
    // Applica le traduzioni
    Object.entries(basicTranslations).forEach(([italian, english]) => {
      englishText = englishText.replace(new RegExp(italian, 'gi'), english);
    });
    
    return englishText;
  };

  // Genera prompt specifici per un'intera sezione (IN INGLESE)
  const generateDetailedPrompt = (section: any, platform: string): string => {
    const sectionIndex = sectionsToUse.findIndex(s => s.id === section.id);
    const analysis = analyzeSectionContent(section.content, sectionIndex, sectionsToUse.length);
    
    // Traduci tutti gli elementi in inglese
    const baseElements = {
      protagonist: analysis.protagonist ? translateTerm(analysis.protagonist, 'sectionTitles') : 'protagonist',
      antagonist: analysis.antagonist ? translateTerm(analysis.antagonist, 'sectionTitles') : '',
      characters: analysis.characters.length > 0 ? analysis.characters.join(' and ') : analysis.protagonist,
      setting: translateTerm(analysis.setting, 'settings'),
      mood: translateTerm(analysis.mood, 'moods'),
      actions: translateArray(analysis.actions, 'actions').join(', '),
      visual: translateArray(analysis.visualElements, 'visual').join(', '),
      timeOfDay: translateTerm(analysis.timeOfDay, 'timeOfDay'),
      weather: translateTerm(analysis.weather, 'weather'),
      storyStructure: analysis.storyStructure
    };
    
    // Analizza il contenuto per dettagli specifici
    const content = section.content.toLowerCase();
    
    // Determina stile cinematografico in inglese basato sulla struttura
    let cinematicStyle = 'cinematic';
    
    switch (baseElements.storyStructure) {
      case 'beginning':
        cinematicStyle = content.includes('buio') || content.includes('notte') ? 'atmospheric noir' : 'dramatic opening';
        break;
      case 'climax':
        cinematicStyle = 'intense action';
        if (content.includes('combatte') || content.includes('insegue')) cinematicStyle = 'action movie climax';
        if (content.includes('paura') || content.includes('terrore')) cinematicStyle = 'thriller climax';
        break;
      case 'ending':
        cinematicStyle = 'emotional finale';
        break;
      case 'continuation':
        cinematicStyle = 'suspenseful cliffhanger';
        break;
      default:
        if (content.includes('buio') || content.includes('notte')) cinematicStyle = 'film noir';
        if (content.includes('action') || content.includes('corre') || content.includes('insegue')) cinematicStyle = 'action movie';
        if (content.includes('paura') || content.includes('terrore')) cinematicStyle = 'thriller';
        if (content.includes('amore') || content.includes('romantico')) cinematicStyle = 'romantic drama';
    }
    
    // Estrai momento clou della sezione e traducilo
    const climaxContent = translateContent(section.content.substring(0, 150));
    const englishSectionTitle = translateTerm(section.title, 'sectionTitles');
    
    // Costruisci descrizione personaggi
    let characterDescription = baseElements.protagonist;
    if (baseElements.antagonist && baseElements.storyStructure !== 'beginning') {
      characterDescription += ` confronting ${baseElements.antagonist}`;
    }
    
    // Aggiungi indicatori di struttura nei prompt
    const structurePrompts = {
      beginning: 'opening scene, establishing shot, introduction',
      development: 'story development, character interaction',
      climax: 'climactic moment, intense action, dramatic peak',
      ending: 'final scene, resolution, conclusion',
      continuation: 'cliffhanger moment, suspenseful pause, to be continued'
    };
    
    const structureContext = structurePrompts[baseElements.storyStructure] || '';
    
    // Prompt specifici per piattaforma (TUTTO IN INGLESE)
    switch (platform) {
      case 'fooocus':
        return `${cinematicStyle} ${structureContext} from "${englishSectionTitle}": ${characterDescription} in ${baseElements.setting}, ${baseElements.timeOfDay}, ${baseElements.weather} weather. ${climaxContent}. Actions: ${baseElements.actions}. Mood: ${baseElements.mood}. Visual elements: ${baseElements.visual}. Ultra-realistic, 8K resolution, professional photography, dramatic lighting, film grain, depth of field, masterpiece quality, cinematic composition.`;
        
      case 'dalle':
        return `Professional ${cinematicStyle} photograph, ${structureContext} from "${englishSectionTitle}": ${characterDescription} in ${baseElements.setting}, ${baseElements.timeOfDay} ${baseElements.weather}. ${climaxContent}. ${baseElements.mood} atmosphere, actions: ${baseElements.actions}, visual elements: ${baseElements.visual}. High detail, photorealistic, dramatic composition, professional lighting.`;
        
      case 'midjourney':
        return `${cinematicStyle} ${structureContext} "${englishSectionTitle}", ${characterDescription} in ${baseElements.setting}, ${baseElements.timeOfDay} ${baseElements.weather}, ${climaxContent}, ${baseElements.mood} mood, ${baseElements.actions}, ${baseElements.visual} --ar 16:9 --style cinematic --quality 2 --stylize 750 --realistic`;
        
      case 'stableDiffusion':
        return `${cinematicStyle} ${structureContext} "${englishSectionTitle}", ${characterDescription} in ${baseElements.setting}, ${baseElements.timeOfDay} ${baseElements.weather}, ${climaxContent}, ${baseElements.mood} atmosphere, actions: ${baseElements.actions}, visual: ${baseElements.visual}, ultra realistic, 8k uhd, dslr, high quality, film grain, professional lighting, depth of field, masterpiece, cinematic composition`;
        
      default:
        return translateContent(section.content.substring(0, 200));
    }
  };

  // Genera prompt per immagini di una sezione
  const generateImagePrompts = async (section: any) => {
    const sectionId = section.id;
    setGeneratingPrompts(prev => ({ ...prev, [sectionId]: true }));
    
    try {
      // Simula elaborazione AI
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const prompts = {
        fooocus: generateDetailedPrompt(section, 'fooocus'),
        dalle: generateDetailedPrompt(section, 'dalle'),
        midjourney: generateDetailedPrompt(section, 'midjourney'),
        stableDiffusion: generateDetailedPrompt(section, 'stableDiffusion')
      };
      
      setGeneratedPrompts(prev => ({
        ...prev,
        [sectionId]: prompts
      }));
    } catch (error) {
      console.error('Error generating prompts:', error);
    } finally {
      setGeneratingPrompts(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // Could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Debug info
  const debugInfo = {
    hasLocationState: !!location.state?.story,
    hasCurrentStory: !!currentStory,
    sectionsCount: sections.length,
    customSectionsCount: customSections.length,
    sectionsToUseCount: sectionsToUse.length,
    currentStoryPreview: currentStory?.content?.substring(0, 100) || 'N/A',
    locationStatePreview: location.state?.story?.substring(0, 100) || 'N/A'
  };

  if (!currentStory && sectionsToUse.length === 0) {
    return (
      <PageContainer>
        <ContentContainer>
          {/* Debug Info */}
          {showDebug && (
            <DebugInfo>
              <strong>DEBUG INFO:</strong><br/>
              • Location.state story: {debugInfo.hasLocationState ? 'YES' : 'NO'}<br/>
              • Current story in store: {debugInfo.hasCurrentStory ? 'YES' : 'NO'}<br/>
              • Standard sections: {debugInfo.sectionsCount}<br/>
              • Custom sections: {debugInfo.customSectionsCount}<br/>
              • Sections to use: {debugInfo.sectionsToUseCount}<br/>
              • Story preview: {debugInfo.currentStoryPreview}<br/>
              <button onClick={() => setShowDebug(false)}>Hide Debug</button>
            </DebugInfo>
          )}
          
          <EmptyState>
            <h3>Nessuna storia disponibile</h3>
            <p>Torna alla home page per generare una nuova storia.</p>
            <ActionButton variant="primary" onClick={() => navigate('/')}>
              🏠 Torna alla Home
            </ActionButton>
          </EmptyState>
        </ContentContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <ContentContainer>
        {/* Debug Info */}
        {showDebug && (
          <DebugInfo>
            <strong>DEBUG INFO:</strong><br/>
            • Location.state story: {debugInfo.hasLocationState ? 'YES' : 'NO'}<br/>
            • Current story in store: {debugInfo.hasCurrentStory ? 'YES' : 'NO'}<br/>
            • Standard sections: {debugInfo.sectionsCount}<br/>
            • Custom sections: {debugInfo.customSectionsCount}<br/>
            • Sections to use: {debugInfo.sectionsToUseCount}<br/>
            <button onClick={() => setShowDebug(false)} style={{background: '#ff6b6b', border: 'none', padding: '0.25rem 0.5rem', borderRadius: '4px'}}>Hide Debug</button>
          </DebugInfo>
        )}
        
        {/* Header */}
        <Header>
          <StoryTitle>
            {currentStory?.title || 'La Tua Storia'}
          </StoryTitle>
        </Header>

                        {/* Navigation */}        <ButtonGroup>          <ActionButton onClick={() => navigate('/')}>            🔙 Nuova Storia          </ActionButton>          <ActionButton variant="primary">            💾 Salva Storia          </ActionButton>          <ActionButton>            📄 Esporta          </ActionButton>          <ToggleButton             isVisible={showSettings}            onClick={() => setShowSettings(!showSettings)}          >            ⚙️ {showSettings ? 'Nascondi' : 'Mostra'} Impostazioni          </ToggleButton>        </ButtonGroup>        {/* Settings Panel */}        {showSettings && (          <SettingsPanel>            <SettingsTitle>Impostazioni Generazione Prompt</SettingsTitle>            <SettingsGrid>              <SettingItem>                <input                  type="checkbox"                  checked={storySettings.autoDetectCharacters}                  onChange={(e) => updateSetting('autoDetectCharacters', e.target.checked)}                />                <span>🔍 Rileva automaticamente personaggi</span>              </SettingItem>                            <SettingItem>                <input                  type="checkbox"                  checked={storySettings.useFantasyNames}                  onChange={(e) => updateSetting('useFantasyNames', e.target.checked)}                />                <span>🧙‍♂️ Usa nomi fantasy se non presenti</span>              </SettingItem>                            <SettingItem>                <input                  type="checkbox"                  checked={storySettings.includeAntagonist}                  onChange={(e) => updateSetting('includeAntagonist', e.target.checked)}                />                <span>⚔️ Includi antagonista nei prompt</span>              </SettingItem>                            <SettingItem>                <input                  type="checkbox"                  checked={storySettings.hasContinuation}                  onChange={(e) => updateSetting('hasContinuation', e.target.checked)}                />                <span>📖 Storia con continuazione (no finale)</span>              </SettingItem>            </SettingsGrid>          </SettingsPanel>        )}

        {/* Story Sections */}
        {sectionsToUse.map((section, index) => (
          <SectionContainer key={section.id || `section-${index}`}>
            <SectionHeader>
              <SectionTitle>{section.title}</SectionTitle>
            </SectionHeader>
            
            <SectionContent>
              {section.content}
            </SectionContent>

            {/* Image Prompt Generation for this entire section */}
            <ImagePromptSection>
              <ImageSectionTitle>
                Genera Immagine per {section.title}
              </ImageSectionTitle>
              
              <ActionButton 
                variant="image"
                onClick={() => generateImagePrompts(section)}
                disabled={generatingPrompts[section.id]}
              >
                {generatingPrompts[section.id] && <LoadingSpinner />}
                {generatingPrompts[section.id] ? 'Analizzando contenuto...' : '🎨 Genera Prompt per Immagini AI'}
              </ActionButton>

              {/* Generated Prompts for this section */}
              {generatedPrompts[section.id] && (
                <PromptGrid>
                  <PromptCard>
                    <PromptTitle>🎯 Fooocus</PromptTitle>
                    <PromptText>{generatedPrompts[section.id].fooocus}</PromptText>
                    <ActionButton 
                      variant="copy" 
                      onClick={() => copyToClipboard(generatedPrompts[section.id].fooocus)}
                    >
                      📋 Copia
                    </ActionButton>
                  </PromptCard>

                  <PromptCard>
                    <PromptTitle>🤖 DALL-E</PromptTitle>
                    <PromptText>{generatedPrompts[section.id].dalle}</PromptText>
                    <ActionButton 
                      variant="copy" 
                      onClick={() => copyToClipboard(generatedPrompts[section.id].dalle)}
                    >
                      📋 Copia
                    </ActionButton>
                  </PromptCard>

                  <PromptCard>
                    <PromptTitle>🎭 Midjourney</PromptTitle>
                    <PromptText>{generatedPrompts[section.id].midjourney}</PromptText>
                    <ActionButton 
                      variant="copy" 
                      onClick={() => copyToClipboard(generatedPrompts[section.id].midjourney)}
                    >
                      📋 Copia
                    </ActionButton>
                  </PromptCard>

                  <PromptCard>
                    <PromptTitle>🔥 Stable Diffusion</PromptTitle>
                    <PromptText>{generatedPrompts[section.id].stableDiffusion}</PromptText>
                    <ActionButton 
                      variant="copy" 
                      onClick={() => copyToClipboard(generatedPrompts[section.id].stableDiffusion)}
                    >
                      📋 Copia
                    </ActionButton>
                  </PromptCard>
                </PromptGrid>
              )}
            </ImagePromptSection>
          </SectionContainer>
        ))}
      </ContentContainer>
    </PageContainer>
  );
};

export default OptimizedStoryDisplayPage; 