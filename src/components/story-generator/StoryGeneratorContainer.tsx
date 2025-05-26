import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { theme, mixins } from '../../theme/designSystem';
import Button from '../ui/Button';
import { StoryTemplateEngine } from '../story-templates/StoryTemplateEngine';
import { DynamicFormEngine, type GenreFormStructure } from '../story-templates/DynamicFormEngine';
import { StoryQualityEngine } from '../story-templates/StoryQualityEngine';
import { initializeEnvironment } from '../../config/environment';

// 🏗️ STORY GENERATOR CONTAINER - Container principale ottimizzato
// Sostituisce il monolitico WorkingStoryGenerator.tsx con architettura modulare

// Lazy loading dei componenti pesanti
const StoryParametersForm = React.lazy(() => import('./StoryParametersForm'));
const GenerationProgress = React.lazy(() => import('./GenerationProgress'));
const StoryPreview = React.lazy(() => import('./StoryPreview'));

// Interfaces
interface StoryParams {
  genre: string;
  tone: string;
  length: string;
  protagonistName: string;
  protagonistDetails: string;
  antagonistName: string;
  antagonistDetails: string;
  setting: string;
  timeperiod: string;
  atmosphere: string;
  mainConflict: string;
  plotElements: string[];
  narrativeStyle: string;
  writingStyle: string;
  specialRequests: string;
}

interface GenerationState {
  isGenerating: boolean;
  currentStep: string;
  progress: number;
  error: string | null;
  story: string | null;
}

// Styled Components ottimizzati
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${theme.spacing[8]};
  background: ${theme.gradients.background};
  border-radius: ${theme.borderRadius['3xl']};
  color: ${theme.colors.text.primary};
  box-shadow: ${theme.shadows['2xl']};
  
  ${mixins.mobile} {
    padding: ${theme.spacing[4]};
    margin: ${theme.spacing[4]};
  }
`;

const Title = styled.h1`
  color: ${theme.colors.text.accent};
  text-align: center;
  font-size: ${theme.typography.fontSize['5xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing[8]};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  animation: pulse 2s ease-in-out infinite;
  
  ${theme.animations.keyframes.pulse}
  
  ${mixins.mobile} {
    font-size: ${theme.typography.fontSize['3xl']};
    margin-bottom: ${theme.spacing[6]};
  }
`;

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${theme.spacing[8]};
  
  ${mixins.desktop} {
    grid-template-columns: 2fr 1fr;
  }
`;

const FormSection = styled.section`
  ${mixins.card}
  padding: ${theme.spacing[8]};
  
  ${mixins.mobile} {
    padding: ${theme.spacing[4]};
  }
`;

const PreviewSection = styled.section`
  ${mixins.card}
  padding: ${theme.spacing[6]};
  position: sticky;
  top: ${theme.spacing[8]};
  max-height: 80vh;
  overflow-y: auto;
  
  ${mixins.mobile} {
    position: static;
    max-height: none;
    padding: ${theme.spacing[4]};
  }
`;

const ErrorBoundary = styled.div`
  padding: ${theme.spacing[6]};
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid ${theme.colors.status.error};
  border-radius: ${theme.borderRadius.lg};
  color: ${theme.colors.status.error};
  text-align: center;
`;

// Loading fallback
const LoadingFallback = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing[8]};
  color: ${theme.colors.text.muted};
  
  &::before {
    content: '';
    width: 2rem;
    height: 2rem;
    border: 2px solid ${theme.colors.primary[500]};
    border-radius: 50%;
    border-top-color: transparent;
    animation: spin 1s linear infinite;
    margin-right: ${theme.spacing[3]};
  }
  
  ${theme.animations.keyframes.spin}
`;

/**
 * StoryGeneratorContainer - Container principale ottimizzato
 * Gestisce lo stato globale e coordina i componenti modulari
 */
const StoryGeneratorContainer: React.FC = () => {
  // 🎯 STATE MANAGEMENT OTTIMIZZATO
  const [params, setParams] = useState<StoryParams>({
    genre: 'fantasy',
    tone: 'avventuroso',
    length: 'medio',
    protagonistName: '',
    protagonistDetails: '',
    antagonistName: '',
    antagonistDetails: '',
    setting: 'regno_magico',
    timeperiod: 'medievale',
    atmosphere: 'epica',
    mainConflict: 'bene_vs_male',
    plotElements: [],
    narrativeStyle: 'terza_persona',
    writingStyle: 'descrittivo',
    specialRequests: ''
  });

  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    currentStep: '',
    progress: 0,
    error: null,
    story: null
  });

  const [currentGenreStructure, setCurrentGenreStructure] = useState<GenreFormStructure | null>(null);
  const [compatibilityScore, setCompatibilityScore] = useState<number>(0);
  const [narrationAudio, setNarrationAudio] = useState<{
    url: string;
    blob: Blob;
  } | null>(null);

  // 🎛️ MEMOIZED VALUES per performance
  const genreStructure = useMemo(() => 
    DynamicFormEngine.getFormStructure(params.genre), 
    [params.genre]
  );

  const isFormValid = useMemo(() => {
    return params.protagonistName.length > 0 && 
           params.setting.length > 0 && 
           params.mainConflict.length > 0;
  }, [params.protagonistName, params.setting, params.mainConflict]);

  const storyPreview = useMemo(() => {
    if (!params.protagonistName) return null;
    
    return {
      title: `La Storia di ${params.protagonistName}`,
      genre: params.genre,
      setting: params.setting,
      conflict: params.mainConflict,
      tone: params.tone
    };
  }, [params.protagonistName, params.genre, params.setting, params.mainConflict, params.tone]);

  // 🔄 CALLBACKS OTTIMIZZATI
  const handleParamsChange = useCallback((field: keyof StoryParams, value: string | string[]) => {
    setParams(prev => ({
      ...prev,
      [field]: value
    }));

    // Aggiorna compatibilità se cambia il genere
    if (field === 'genre') {
      const newGenreStructure = DynamicFormEngine.getFormStructure(value as string);
      setCurrentGenreStructure(newGenreStructure);
      
      // Applica impostazioni raccomandate automaticamente
      const recommendedSettings = DynamicFormEngine.getRecommendedSettings(value as string);
      setParams(prev => ({
        ...prev,
        ...recommendedSettings
      }));
    }
  }, []);

  const updateCompatibilityScore = useCallback(() => {
    if (!currentGenreStructure) return;
    
    const paramsRecord: Record<string, string> = {
      genre: params.genre,
      tone: params.tone,
      length: params.length,
      narrativeStyle: params.narrativeStyle,
      writingStyle: params.writingStyle,
      timeperiod: params.timeperiod,
      atmosphere: params.atmosphere
    };
    
    const suggestions = DynamicFormEngine.getSuggestions(params.genre, paramsRecord);
    setCompatibilityScore(suggestions.score);
  }, [currentGenreStructure, params]);

  const generateStory = useCallback(async () => {
    if (!isFormValid) return;

    setGenerationState({
      isGenerating: true,
      currentStep: 'Inizializzazione...',
      progress: 0,
      error: null,
      story: null
    });

    try {
      // Simula generazione con step progressivi
      const steps = [
        'Analisi parametri...',
        'Costruzione prompt...',
        'Generazione storia...',
        'Validazione qualità...',
        'Finalizzazione...'
      ];

      for (let i = 0; i < steps.length; i++) {
        setGenerationState(prev => ({
          ...prev,
          currentStep: steps[i],
          progress: ((i + 1) / steps.length) * 100
        }));
        
        // Simula tempo di elaborazione
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // Qui andrebbe la logica di generazione reale
      // Per ora generiamo una storia di esempio
      const generatedStory = `
PROLOGO

In un regno lontano, dove la magia scorreva come fiumi dorati attraverso le terre di ${params.setting}, viveva ${params.protagonistName}, un giovane ${params.protagonistDetails || 'avventuriero'} dal destino straordinario.

ATTO I - L'INIZIO DELL'AVVENTURA

${params.protagonistName} non sapeva ancora che la sua vita stava per cambiare per sempre. Il conflitto di ${params.mainConflict} si stava avvicinando, e solo lui poteva fare la differenza.

L'atmosfera ${params.atmosphere} del regno nascondeva segreti antichi, e quando ${params.antagonistName || 'il nemico'} apparve all'orizzonte, tutto ebbe inizio.

ATTO II - IL CONFLITTO

La battaglia tra il bene e il male raggiunse il suo apice. ${params.protagonistName} dovette affrontare le sue paure più profonde e scoprire poteri che non sapeva di possedere.

${params.plotElements.length > 0 ? `Durante il viaggio, si verificarono eventi incredibili: ${params.plotElements.join(', ')}.` : ''}

ATTO III - LA RISOLUZIONE

Alla fine, ${params.protagonistName} riuscì a superare ogni ostacolo. Il ${params.mainConflict} fu risolto, e il regno tornò in pace.

La storia si concluse con una lezione importante: il coraggio e la determinazione possono superare qualsiasi avversità.

EPILOGO

E così, ${params.protagonistName} divenne una leggenda, ricordato per sempre come l'eroe che salvò ${params.setting}.
      `.trim();
      
      // Validazione qualità
      const qualityAnalysis = StoryQualityEngine.analyzeStoryQuality(generatedStory);
      
      if (!qualityAnalysis.isValid) {
        const improvedStory = await StoryQualityEngine.autoFixStory(generatedStory, [params.genre]);
        setGenerationState(prev => ({
          ...prev,
          isGenerating: false,
          story: improvedStory,
          currentStep: 'Completato con auto-correzione'
        }));
      } else {
        setGenerationState(prev => ({
          ...prev,
          isGenerating: false,
          story: generatedStory,
          currentStep: 'Completato'
        }));
      }

    } catch (error: any) {
      setGenerationState(prev => ({
        ...prev,
        isGenerating: false,
        error: error.message || 'Errore durante la generazione',
        currentStep: 'Errore'
      }));
    }
  }, [isFormValid, params]);

  const resetGeneration = useCallback(() => {
    setGenerationState({
      isGenerating: false,
      currentStep: '',
      progress: 0,
      error: null,
      story: null
    });
    setNarrationAudio(null);
  }, []);

  const handleNarrationComplete = useCallback((audioUrl: string, audioBlob: Blob) => {
    setNarrationAudio({ url: audioUrl, blob: audioBlob });
    console.log('🎙️ Narrazione completata e salvata');
  }, []);

  // 🎯 EFFECTS OTTIMIZZATI
  React.useEffect(() => {
    // Inizializza ambiente al primo caricamento
    initializeEnvironment();
    
    const structure = DynamicFormEngine.getFormStructure(params.genre);
    setCurrentGenreStructure(structure);
    updateCompatibilityScore();
  }, [params.genre, updateCompatibilityScore]);

  // 🎨 ERROR BOUNDARY
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    const handleError = () => setHasError(true);
    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <Container>
        <ErrorBoundary>
          <h2>🚨 Errore nell'applicazione</h2>
          <p>Si è verificato un errore imprevisto. Ricarica la pagina per continuare.</p>
          <Button variant="primary" onClick={() => window.location.reload()}>
            🔄 Ricarica Pagina
          </Button>
        </ErrorBoundary>
      </Container>
    );
  }

  return (
    <Container>
      <Title>✨ OpenStory AI Generator ✨</Title>
      
      <MainContent>
        <FormSection>
          <React.Suspense fallback={<LoadingFallback>Caricamento form...</LoadingFallback>}>
            <StoryParametersForm
              params={params}
              onParamsChange={handleParamsChange}
              genreStructure={currentGenreStructure}
              compatibilityScore={compatibilityScore}
              isFormValid={isFormValid}
              onGenerate={generateStory}
              isGenerating={generationState.isGenerating}
            />
          </React.Suspense>
        </FormSection>

        <PreviewSection>
          {generationState.isGenerating ? (
            <React.Suspense fallback={<LoadingFallback>Caricamento...</LoadingFallback>}>
              <GenerationProgress
                currentStep={generationState.currentStep}
                progress={generationState.progress}
                onCancel={resetGeneration}
              />
            </React.Suspense>
          ) : generationState.story ? (
            <React.Suspense fallback={<LoadingFallback>Caricamento storia...</LoadingFallback>}>
                          <StoryPreview
              story={generationState.story}
              params={params}
              onRegenerate={generateStory}
              onReset={resetGeneration}
              onNarrationComplete={handleNarrationComplete}
            />
            </React.Suspense>
          ) : (
            <div style={{ 
              textAlign: 'center', 
              color: theme.colors.text.muted,
              padding: theme.spacing[8]
            }}>
              <h3>📖 Anteprima Storia</h3>
              {storyPreview ? (
                <div>
                  <p><strong>Titolo:</strong> {storyPreview.title}</p>
                  <p><strong>Genere:</strong> {storyPreview.genre}</p>
                  <p><strong>Ambientazione:</strong> {storyPreview.setting}</p>
                  <p><strong>Conflitto:</strong> {storyPreview.conflict}</p>
                </div>
              ) : (
                <p>Compila i parametri per vedere l'anteprima</p>
              )}
            </div>
          )}
        </PreviewSection>
      </MainContent>
    </Container>
  );
};

export default React.memo(StoryGeneratorContainer); 