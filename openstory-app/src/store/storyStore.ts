import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { StoryParameters, StoryResponse, GenerationProgress, OptimizedStoryService } from '../services/optimizedOpenRouterService';

// Types
export interface Story {
  id: string;
  title: string;
  content: string;
  parameters: StoryParameters;
  metadata: StoryResponse['metadata'];
  createdAt: Date;
  updatedAt: Date;
}

export interface StorySection {
  id: string;
  title: string;
  content: string;
  type: 'prologo' | 'atto1' | 'atto2' | 'atto3';
}

export interface ValidationError {
  field: string;
  message: string;
}

// Store interface
interface StoryStore {
  // Current story generation
  currentStory: Story | null;
  parsedSections: StorySection[];
  generationProgress: GenerationProgress | null;
  
  // Form state
  storyParameters: Partial<StoryParameters>;
  validationErrors: ValidationError[];
  isFormValid: boolean;
  
  // UI state
  isGenerating: boolean;
  activeSection: string;
  viewMode: 'all' | 'single';
  showAdvancedOptions: boolean;
  
  // Stories library
  savedStories: Story[];
  
  // Actions - Form Management
  updateParameters: (params: Partial<StoryParameters>) => void;
  resetParameters: () => void;
  validateForm: () => boolean;
  
  // Actions - Story Generation
  generateStory: () => Promise<void>;
  regenerateSection: (sectionId: string) => Promise<void>;
  cancelGeneration: () => void;
  
  // Actions - Story Management
  saveStory: (title: string) => void;
  deleteStory: (id: string) => void;
  loadStory: (id: string) => void;
  
  // Actions - UI
  setActiveSection: (sectionId: string) => void;
  setViewMode: (mode: 'all' | 'single') => void;
  toggleAdvancedOptions: () => void;
  
  // Actions - Parsing
  parseStoryContent: (content: string) => void;
}

// Default parameters
const defaultParameters: Partial<StoryParameters> = {
  genre: '',
  tone: '',
  length: '',
  setting: {
    place: '',
    time: 'present',
    description: ''
  },
  protagonist: {
    name: '',
    type: '',
    goal: '',
    characteristics: []
  },
  antagonist: {
    name: '',
    type: '',
    motivation: '',
    characteristics: []
  },
  plotElements: [],
  supportingCharacters: [],
  narrativeStructure: 'three_act',
  // Nuove opzioni avanzate per migliorare la generazione
  storyType: 'standard',
  includeDialogue: true,
  focusOnAction: false,
  emotionalDepth: false,
  worldBuilding: false,
  mysteryElements: false,
  cinematicStyle: false,
  seriesContext: ''
};

// Create service instance
const optimizedStoryService = new OptimizedStoryService();

// Validation rules
const validateParameters = (params: Partial<StoryParameters>): ValidationError[] => {
  const errors: ValidationError[] = [];
  
  if (!params.genre) {
    errors.push({ field: 'genre', message: 'Seleziona un genere' });
  }
  
  if (!params.setting?.place?.trim()) {
    errors.push({ field: 'setting.place', message: 'Inserisci un\'ambientazione' });
  }
  
  if (!params.protagonist?.name?.trim()) {
    errors.push({ field: 'protagonist.name', message: 'Inserisci il nome del protagonista' });
  }
  
  if (!params.protagonist?.type?.trim()) {
    errors.push({ field: 'protagonist.type', message: 'Seleziona il tipo di protagonista' });
  }
  
  if (!params.protagonist?.goal?.trim()) {
    errors.push({ field: 'protagonist.goal', message: 'Inserisci l\'obiettivo del protagonista' });
  }
  
  if (!params.antagonist?.type?.trim()) {
    errors.push({ field: 'antagonist.type', message: 'Seleziona il tipo di antagonista' });
  }
  
  if (!params.plotElements || params.plotElements.length === 0) {
    errors.push({ field: 'plotElements', message: 'Seleziona almeno un elemento della trama' });
  }
  
  return errors;
};

// Story parsing function
const parseStoryContent = (content: string): StorySection[] => {
  const sections: StorySection[] = [];
  
  // Regex patterns for sections
  const sectionPatterns = [
    { type: 'prologo' as const, regex: /###\s*PROLOGO/i, title: 'Prologo' },
    { type: 'atto1' as const, regex: /###\s*ATTO\s*I/i, title: 'Atto I' },
    { type: 'atto2' as const, regex: /###\s*ATTO\s*II/i, title: 'Atto II' },
    { type: 'atto3' as const, regex: /###\s*ATTO\s*III/i, title: 'Atto III' }
  ];
  
  let remainingContent = content;
  
  sectionPatterns.forEach((pattern, index) => {
    const match = remainingContent.match(pattern.regex);
    if (match && match.index !== undefined) {
      const startIndex = match.index;
      
      // Find next section or end of content
      let endIndex = remainingContent.length;
      for (let i = index + 1; i < sectionPatterns.length; i++) {
        const nextMatch = remainingContent.match(sectionPatterns[i].regex);
        if (nextMatch && nextMatch.index !== undefined && nextMatch.index > startIndex) {
          endIndex = nextMatch.index;
          break;
        }
      }
      
      const sectionContent = remainingContent
        .substring(startIndex, endIndex)
        .replace(pattern.regex, '')
        .trim();
      
      if (sectionContent) {
        sections.push({
          id: pattern.type,
          title: pattern.title,
          content: sectionContent,
          type: pattern.type
        });
      }
    }
  });
  
  // If no sections found, treat as single section
  if (sections.length === 0 && content.trim()) {
    sections.push({
      id: 'story-complete',
      title: 'Storia Completa',
      content: content.trim(),
      type: 'prologo'
    });
  }
  
  return sections;
};

// Store implementation
export const useStoryStore = create<StoryStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        currentStory: null,
        parsedSections: [],
        generationProgress: null,
        storyParameters: defaultParameters,
        validationErrors: [],
        isFormValid: false,
        isGenerating: false,
        activeSection: '',
        viewMode: 'all',
        showAdvancedOptions: false,
        savedStories: [],

        // Form Management Actions
        updateParameters: (params) => {
          const newParams = { ...get().storyParameters, ...params };
          const errors = validateParameters(newParams);
          
          set({
            storyParameters: newParams,
            validationErrors: errors,
            isFormValid: errors.length === 0
          });
        },

        resetParameters: () => set({ 
          storyParameters: defaultParameters,
          validationErrors: [],
          isFormValid: false
        }),

        validateForm: () => {
          const { storyParameters } = get();
          const errors = validateParameters(storyParameters);
          
          set({
            validationErrors: errors,
            isFormValid: errors.length === 0
          });
          
          return errors.length === 0;
        },
        
        // 🌐 Story Generation - Solo OpenRouter Online
        generateStory: async () => {
          const { storyParameters, validateForm } = get();
          
          if (!validateForm()) {
            console.warn('❌ Validazione form fallita');
            return;
          }
          
          set({ 
            isGenerating: true, 
            generationProgress: {
              currentSection: 'Inizializzazione...',
              progress: 0,
              totalSections: 4,
              estimatedTimeRemaining: 'Calcolando...'
            }
          });
          
          console.log('🌐 OpenStory - Modalità Solo Online (OpenRouter)');
          console.log('🔍 Verifica configurazione OpenRouter...');
          
          // Test configurazione OpenRouter
          const isOpenRouterConfigured = OptimizedStoryService.isConfigured();
          console.log(`🔑 OpenRouter configurato: ${isOpenRouterConfigured ? '✅' : '❌'}`);
          
          if (!isOpenRouterConfigured) {
            console.error('❌ OpenRouter non configurato! Configura la tua API key.');
            set({
              isGenerating: false,
              generationProgress: null
            });
            alert('⚠️ OpenRouter non configurato!\n\nPer usare OpenStory devi:\n1. Creare file .env nella cartella openstory-app\n2. Aggiungere: REACT_APP_OPENROUTER_API_KEY=sk-or-v1-la_tua_chiave\n3. Ottenere API key gratuita su openrouter.ai/keys\n4. Riavviare l\'applicazione');
            return;
          }
          
          try {
            console.log('🧪 Test connessione OpenRouter...');
            
            // Test connessione prima di procedere
            const connectionOk = await OptimizedStoryService.testConnection();
            console.log(`🔗 Test connessione risultato: ${connectionOk ? '✅' : '❌'}`);
            
            if (!connectionOk) {
              throw new Error('❌ Test connessione OpenRouter fallito. Verifica API key e connessione internet.');
            }
            
            // Setup progress callback per OpenRouter
            optimizedStoryService.onProgressUpdate = (progress: GenerationProgress) => {
              set({ generationProgress: progress });
            };
            
            console.log('🚀 Inizio generazione storia con OpenRouter...');
            const response = await optimizedStoryService.generateStory(
              storyParameters as StoryParameters
            );
            
            console.log('✅ Storia generata con successo!');
            
            if (response) {
              const story: Story = {
                id: `story-${Date.now()}`,
                title: `Storia ${new Date().toLocaleDateString()}`,
                content: response.content,
                parameters: storyParameters as StoryParameters,
                metadata: response.metadata,
                createdAt: new Date(),
                updatedAt: new Date()
              };
              
              const parsedSections = parseStoryContent(response.content);
              
              set({
                currentStory: story,
                parsedSections,
                activeSection: parsedSections.length > 0 ? parsedSections[0].id : '',
                isGenerating: false,
                generationProgress: null
              });
              
              console.log('✅ Storia salvata e pronta per la visualizzazione!');
            }
          } catch (error: any) {
            console.error('❌ Errore generazione storia:', error);
            set({
              isGenerating: false,
              generationProgress: null
            });
            
            // Mostra errore specifico all'utente
            let errorMessage = 'Errore durante la generazione della storia.';
            if (error?.message) {
              if (error.message.includes('401')) {
                errorMessage = '❌ API Key OpenRouter non valida. Verifica la configurazione nel file .env';
              } else if (error.message.includes('402')) {
                errorMessage = '❌ Crediti OpenRouter esauriti. Ricarica il tuo account su openrouter.ai';
              } else if (error.message.includes('429')) {
                errorMessage = '❌ Troppi requests. Attendi qualche minuto e riprova.';
              } else if (error.message.includes('503')) {
                errorMessage = '❌ Servizio OpenRouter temporaneamente non disponibile. Riprova più tardi.';
              } else {
                errorMessage = `❌ ${error.message}`;
              }
            }
            
            alert(errorMessage);
          }
        },
        
        regenerateSection: async (sectionId) => {
          const { currentStory, parsedSections } = get();
          if (!currentStory) return;
          
          set({ isGenerating: true });
          
          try {
            // Find section to regenerate
            const sectionIndex = parsedSections.findIndex(s => s.id === sectionId);
            if (sectionIndex === -1) return;
            
            // TODO: Implement section regeneration logic
            // For now, just simulate regeneration
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            const newContent = `${parsedSections[sectionIndex].content}\n\n[Rigenerato il ${new Date().toLocaleTimeString()}]`;
            
            const updatedSections = [...parsedSections];
            updatedSections[sectionIndex] = {
              ...updatedSections[sectionIndex],
              content: newContent
            };
            
            const updatedStoryContent = updatedSections
              .map(s => `### ${s.title.toUpperCase()}\n${s.content}`)
              .join('\n\n');
            
            const updatedStory = {
              ...currentStory,
              content: updatedStoryContent,
              updatedAt: new Date()
            };
            
            set({
              currentStory: updatedStory,
              parsedSections: updatedSections,
              isGenerating: false
            });
            
          } catch (error) {
            console.error('Section regeneration failed:', error);
            set({ isGenerating: false });
          }
        },
        
        cancelGeneration: () => {
          set({
            isGenerating: false,
            generationProgress: null
          });
        },
        
        // Story Management Actions
        saveStory: (title) => {
          const { currentStory, savedStories } = get();
          if (!currentStory) return;
          
          const updatedStory = {
            ...currentStory,
            title,
            updatedAt: new Date()
          };
          
          const updatedStories = [
            updatedStory,
            ...savedStories.filter(s => s.id !== currentStory.id)
          ];
          
          set({
            currentStory: updatedStory,
            savedStories: updatedStories
          });
        },
        
        deleteStory: (id) => set((state) => ({
          savedStories: state.savedStories.filter(s => s.id !== id)
        })),
        
        loadStory: (id) => {
          const { savedStories } = get();
          const story = savedStories.find(s => s.id === id);
          
          if (story) {
            const parsedSections = parseStoryContent(story.content);
            
            set({
              currentStory: story,
              parsedSections,
              storyParameters: story.parameters,
              activeSection: parsedSections.length > 0 ? parsedSections[0].id : ''
            });
          }
        },
        
        // UI Actions
        setActiveSection: (sectionId: string) => set({ activeSection: sectionId }),
        
        setViewMode: (mode: 'all' | 'single') => set({ viewMode: mode }),
        
        toggleAdvancedOptions: () => set((state) => ({
          showAdvancedOptions: !state.showAdvancedOptions
        })),
        
        // Parsing Actions
        parseStoryContent: (content) => {
          const parsedSections = parseStoryContent(content);
          set({
            parsedSections,
            activeSection: parsedSections.length > 0 ? parsedSections[0].id : ''
          });
        }
      }),
      {
        name: 'openstory-storage',
        partialize: (state) => ({
          savedStories: state.savedStories,
          storyParameters: state.storyParameters,
          viewMode: state.viewMode,
          showAdvancedOptions: state.showAdvancedOptions
        })
      }
    ),
    { name: 'OpenStory Store' }
  )
);

// Selectors for better performance
export const useStoryParameters = () => useStoryStore(state => state.storyParameters);
export const useValidationErrors = () => useStoryStore(state => state.validationErrors);
export const useIsFormValid = () => useStoryStore(state => state.isFormValid);
export const useCurrentStory = () => useStoryStore(state => state.currentStory);
export const useParsedSections = () => useStoryStore(state => state.parsedSections);
export const useIsGenerating = () => useStoryStore(state => state.isGenerating);
export const useGenerationProgress = () => useStoryStore(state => state.generationProgress);
export const useSavedStories = () => useStoryStore(state => state.savedStories);
export const useActiveSection = () => useStoryStore(state => state.activeSection);
export const useViewMode = () => useStoryStore(state => state.viewMode); 