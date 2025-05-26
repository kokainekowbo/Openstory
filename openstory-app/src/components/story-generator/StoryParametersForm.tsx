import React from 'react';
import styled from 'styled-components';
import { theme, mixins } from '../../theme/designSystem';
import Button from '../ui/Button';
import { Input, TextArea } from '../ui/Input';
import { DynamicFormEngine, type GenreFormStructure } from '../story-templates/DynamicFormEngine';

// 📝 STORY PARAMETERS FORM - Form parametri ottimizzato
// Componente modulare estratto dal monolitico WorkingStoryGenerator.tsx

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

interface StoryParametersFormProps {
  params: StoryParams;
  onParamsChange: (field: keyof StoryParams, value: string | string[]) => void;
  genreStructure: GenreFormStructure | null;
  compatibilityScore: number;
  isFormValid: boolean;
  onGenerate: () => void;
  isGenerating: boolean;
}

// Styled Components
const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const SectionTitle = styled.h3`
  color: ${theme.colors.text.accent};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  border-bottom: 2px solid ${theme.colors.border.primary};
  padding-bottom: ${theme.spacing[2]};
`;

const FormSection = styled.section`
  background: ${theme.colors.background.glass};
  padding: ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border.secondary};
  transition: ${theme.animations.smooth};
  
  &:hover {
    background: ${theme.colors.background.glassHover};
    transform: translateY(-2px);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${theme.spacing[4]};
`;

const CompatibilityIndicator = styled.div<{ score: number }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  
  ${props => {
    if (props.score >= 80) {
      return `
        background: rgba(16, 185, 129, 0.1);
        border: 1px solid ${theme.colors.status.success};
        color: ${theme.colors.status.success};
      `;
    } else if (props.score >= 60) {
      return `
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid ${theme.colors.status.warning};
        color: ${theme.colors.status.warning};
      `;
    } else {
      return `
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid ${theme.colors.status.error};
        color: ${theme.colors.status.error};
      `;
    }
  }}
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${theme.spacing[3]};
`;

const GenreCard = styled.button<{ selected: boolean }>`
  ${mixins.button}
  padding: ${theme.spacing[4]};
  text-align: left;
  background: ${props => props.selected ? 
    'rgba(255, 215, 0, 0.2)' : 
    theme.colors.background.glass
  };
  border: 2px solid ${props => props.selected ? 
    theme.colors.border.focus : 
    theme.colors.border.secondary
  };
  
  &:hover:not(:disabled) {
    background: ${props => props.selected ? 
      'rgba(255, 215, 0, 0.3)' : 
      theme.colors.background.glassHover
    };
    border-color: ${theme.colors.border.hover};
  }
`;

const GenreIcon = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  margin-bottom: ${theme.spacing[2]};
`;

const GenreTitle = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[1]};
`;

const GenreDescription = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.muted};
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${theme.spacing[2]};
  margin-top: ${theme.spacing[2]};
`;

const Tag = styled.button<{ selected: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  cursor: pointer;
  transition: ${theme.animations.smooth};
  border: 2px solid ${props => props.selected ? 
    theme.colors.border.focus : 
    theme.colors.border.secondary
  };
  background: ${props => props.selected ? 
    'rgba(255, 215, 0, 0.2)' : 
    theme.colors.background.glass
  };
  color: ${props => props.selected ? 
    theme.colors.text.accent : 
    theme.colors.text.secondary
  };

  &:hover {
    border-color: ${theme.colors.border.hover};
    background: ${theme.colors.background.glassHover};
  }
`;

/**
 * StoryParametersForm - Form parametri modulare e ottimizzato
 */
const StoryParametersForm = React.memo<StoryParametersFormProps>(({
  params,
  onParamsChange,
  genreStructure,
  compatibilityScore,
  isFormValid,
  onGenerate,
  isGenerating
}) => {
  // Opzioni per i vari campi
  const genreOptions = React.useMemo(() => 
    DynamicFormEngine.getAllGenreStructures(), []
  );

  const plotElementOptions = [
    'colpo_di_scena', 'flashback', 'profezia', 'tradimento', 
    'sacrificio', 'redenzione', 'vendetta', 'amore_perduto',
    'segreto_famiglia', 'potere_nascosto', 'alleanza_inaspettata'
  ];

  const handlePlotElementToggle = React.useCallback((element: string) => {
    const currentElements = params.plotElements || [];
    const newElements = currentElements.includes(element)
      ? currentElements.filter(e => e !== element)
      : [...currentElements, element];
    
    onParamsChange('plotElements', newElements);
  }, [params.plotElements, onParamsChange]);

  return (
    <FormContainer>
      {/* Compatibilità Score */}
      {genreStructure && (
        <CompatibilityIndicator score={compatibilityScore}>
          {compatibilityScore >= 80 ? '✅' : compatibilityScore >= 60 ? '⚠️' : '❌'}
          Compatibilità: {compatibilityScore}%
          {compatibilityScore >= 80 ? ' - Ottimale' : 
           compatibilityScore >= 60 ? ' - Buona' : ' - Migliorabile'}
        </CompatibilityIndicator>
      )}

      {/* Selezione Genere */}
      <FormSection>
        <SectionTitle>
          🎭 Genere Storia
        </SectionTitle>
        <GenreGrid>
          {genreOptions.map(genre => (
            <GenreCard
              key={genre.genre}
              selected={params.genre === genre.genre}
              onClick={() => onParamsChange('genre', genre.genre)}
              type="button"
            >
              <GenreIcon>{genre.icon}</GenreIcon>
              <GenreTitle>{genre.displayName}</GenreTitle>
              <GenreDescription>{genre.description}</GenreDescription>
            </GenreCard>
          ))}
        </GenreGrid>
      </FormSection>

      {/* Parametri Base */}
      <FormSection>
        <SectionTitle>
          ⚙️ Parametri Base
        </SectionTitle>
        <Grid>
          <Input
            label="Tono"
            value={params.tone}
            onChange={(e) => onParamsChange('tone', e.target.value)}
            placeholder="es. Avventuroso, Misterioso..."
            fullWidth
          />
          <Input
            label="Lunghezza"
            value={params.length}
            onChange={(e) => onParamsChange('length', e.target.value)}
            placeholder="es. Breve, Medio, Lungo"
            fullWidth
          />
          <Input
            label="Stile Narrativo"
            value={params.narrativeStyle}
            onChange={(e) => onParamsChange('narrativeStyle', e.target.value)}
            placeholder="es. Prima persona, Terza persona"
            fullWidth
          />
          <Input
            label="Stile di Scrittura"
            value={params.writingStyle}
            onChange={(e) => onParamsChange('writingStyle', e.target.value)}
            placeholder="es. Descrittivo, Dialogico"
            fullWidth
          />
        </Grid>
      </FormSection>

      {/* Personaggi */}
      <FormSection>
        <SectionTitle>
          👥 Personaggi
        </SectionTitle>
        <Grid>
          <Input
            label="Nome Protagonista"
            value={params.protagonistName}
            onChange={(e) => onParamsChange('protagonistName', e.target.value)}
            placeholder="Nome del personaggio principale"
            required
            fullWidth
          />
          <Input
            label="Nome Antagonista"
            value={params.antagonistName}
            onChange={(e) => onParamsChange('antagonistName', e.target.value)}
            placeholder="Nome dell'antagonista"
            fullWidth
          />
        </Grid>
        <Grid style={{ marginTop: theme.spacing[4] }}>
          <TextArea
            label="Dettagli Protagonista"
            value={params.protagonistDetails}
            onChange={(e) => onParamsChange('protagonistDetails', e.target.value)}
            placeholder="Descrivi il protagonista: aspetto, personalità, background..."
            rows={4}
            fullWidth
          />
          <TextArea
            label="Dettagli Antagonista"
            value={params.antagonistDetails}
            onChange={(e) => onParamsChange('antagonistDetails', e.target.value)}
            placeholder="Descrivi l'antagonista: motivazioni, poteri, obiettivi..."
            rows={4}
            fullWidth
          />
        </Grid>
      </FormSection>

      {/* Ambientazione */}
      <FormSection>
        <SectionTitle>
          🌍 Ambientazione
        </SectionTitle>
        <Grid>
          <Input
            label="Ambientazione"
            value={params.setting}
            onChange={(e) => onParamsChange('setting', e.target.value)}
            placeholder="Dove si svolge la storia"
            required
            fullWidth
          />
          <Input
            label="Periodo Temporale"
            value={params.timeperiod}
            onChange={(e) => onParamsChange('timeperiod', e.target.value)}
            placeholder="es. Medievale, Moderno, Futuristico"
            fullWidth
          />
          <Input
            label="Atmosfera"
            value={params.atmosphere}
            onChange={(e) => onParamsChange('atmosphere', e.target.value)}
            placeholder="es. Epica, Misteriosa, Romantica"
            fullWidth
          />
          <Input
            label="Conflitto Principale"
            value={params.mainConflict}
            onChange={(e) => onParamsChange('mainConflict', e.target.value)}
            placeholder="Il conflitto centrale della storia"
            required
            fullWidth
          />
        </Grid>
      </FormSection>

      {/* Elementi di Trama */}
      <FormSection>
        <SectionTitle>
          📚 Elementi di Trama
        </SectionTitle>
        <TagsContainer>
          {plotElementOptions.map(element => (
            <Tag
              key={element}
              selected={params.plotElements.includes(element)}
              onClick={() => handlePlotElementToggle(element)}
              type="button"
            >
              {element.replace(/_/g, ' ')}
            </Tag>
          ))}
        </TagsContainer>
      </FormSection>

      {/* Richieste Speciali */}
      <FormSection>
        <SectionTitle>
          ✨ Richieste Speciali
        </SectionTitle>
        <TextArea
          label="Note Aggiuntive"
          value={params.specialRequests}
          onChange={(e) => onParamsChange('specialRequests', e.target.value)}
          placeholder="Aggiungi dettagli specifici, stile particolare, elementi da includere..."
          rows={4}
          fullWidth
        />
      </FormSection>

      {/* Pulsante Generazione */}
      <Button
        variant="primary"
        size="lg"
        fullWidth
        loading={isGenerating}
        disabled={!isFormValid}
        onClick={onGenerate}
        icon={<span>✨</span>}
      >
        {isGenerating ? 'Generando Storia...' : 'Genera la Mia Storia'}
      </Button>
    </FormContainer>
  );
});

StoryParametersForm.displayName = 'StoryParametersForm';

export default StoryParametersForm; 