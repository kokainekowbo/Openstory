import React from 'react';
import styled from 'styled-components';
import { theme, mixins } from '../../theme/designSystem';
import Button from '../ui/Button';
import VoiceNarrationPanel from './VoiceNarrationPanel';

// 📖 STORY PREVIEW - Componente anteprima storia
// Mostra la storia generata con opzioni di azione

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

interface StoryPreviewProps {
  story: string;
  params: StoryParams;
  onRegenerate: () => void;
  onReset: () => void;
  onNarrationComplete?: (audioUrl: string, audioBlob: Blob) => void;
}

// Styled Components
const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
`;

const PreviewHeader = styled.div`
  text-align: center;
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 2px solid ${theme.colors.border.primary};
`;

const PreviewTitle = styled.h3`
  color: ${theme.colors.text.accent};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
`;

const StoryMetadata = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  
  ${mixins.mobile} {
    grid-template-columns: 1fr;
  }
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
`;

const StoryContent = styled.div`
  background: ${theme.colors.background.glass};
  padding: ${theme.spacing[6]};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border.secondary};
  max-height: 400px;
  overflow-y: auto;
  line-height: ${theme.typography.lineHeight.relaxed};
  
  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${theme.colors.background.tertiary};
    border-radius: ${theme.borderRadius.full};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary[500]};
    border-radius: ${theme.borderRadius.full};
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.primary[600]};
  }
`;

const StoryText = styled.div`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.base};
  line-height: ${theme.typography.lineHeight.relaxed};
  
  /* Formattazione paragrafi */
  p {
    margin-bottom: ${theme.spacing[4]};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  /* Evidenzia dialoghi */
  em, i {
    color: ${theme.colors.text.accent};
    font-style: italic;
  }
  
  /* Evidenzia nomi propri */
  strong, b {
    color: ${theme.colors.text.accent};
    font-weight: ${theme.typography.fontWeight.semibold};
  }
`;

const StoryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]};
  background: ${theme.colors.background.glass};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.secondary};
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.accent};
`;

const StatLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
  margin-top: ${theme.spacing[1]};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  flex-wrap: wrap;
  
  ${mixins.mobile} {
    flex-direction: column;
  }
`;

const QualityIndicator = styled.div<{ quality: 'high' | 'medium' | 'low' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.full};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  
  ${props => {
    switch (props.quality) {
      case 'high':
        return `
          background: rgba(16, 185, 129, 0.1);
          color: ${theme.colors.status.success};
          border: 1px solid ${theme.colors.status.success};
        `;
      case 'medium':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: ${theme.colors.status.warning};
          border: 1px solid ${theme.colors.status.warning};
        `;
      case 'low':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: ${theme.colors.status.error};
          border: 1px solid ${theme.colors.status.error};
        `;
    }
  }}
`;

/**
 * StoryPreview - Componente anteprima storia
 */
const StoryPreview = React.memo<StoryPreviewProps>(({
  story,
  params,
  onRegenerate,
  onReset,
  onNarrationComplete
}) => {
  // Calcola statistiche della storia
  const storyStats = React.useMemo(() => {
    const words = story.split(/\s+/).length;
    const characters = story.length;
    const paragraphs = story.split('\n\n').length;
    const sentences = story.split(/[.!?]+/).length - 1;
    
    // Stima tempo di lettura (200 parole al minuto)
    const readingTime = Math.ceil(words / 200);
    
    return {
      words,
      characters,
      paragraphs,
      sentences,
      readingTime
    };
  }, [story]);

  // Determina qualità della storia
  const storyQuality = React.useMemo(() => {
    const { words, sentences, paragraphs } = storyStats;
    
    // Criteri di qualità semplificati
    if (words >= 800 && sentences >= 20 && paragraphs >= 4) {
      return 'high';
    } else if (words >= 400 && sentences >= 10 && paragraphs >= 2) {
      return 'medium';
    } else {
      return 'low';
    }
  }, [storyStats]);

  // Formatta il testo della storia per la visualizzazione
  const formattedStory = React.useMemo(() => {
    return story
      .split('\n\n')
      .map((paragraph, index) => (
        <p key={index}>{paragraph.trim()}</p>
      ));
  }, [story]);

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case 'high': return '🌟';
      case 'medium': return '⭐';
      case 'low': return '💫';
      default: return '⭐';
    }
  };

  const getQualityText = (quality: string) => {
    switch (quality) {
      case 'high': return 'Qualità Eccellente';
      case 'medium': return 'Qualità Buona';
      case 'low': return 'Qualità da Migliorare';
      default: return 'Qualità Sconosciuta';
    }
  };

  return (
    <PreviewContainer>
      <PreviewHeader>
        <PreviewTitle>
          📖 Storia Generata
        </PreviewTitle>
        
        <StoryMetadata>
          <MetadataItem>
            <span>🎭</span>
            <span>{params.genre}</span>
          </MetadataItem>
          <MetadataItem>
            <span>🎨</span>
            <span>{params.tone}</span>
          </MetadataItem>
          <MetadataItem>
            <span>👤</span>
            <span>{params.protagonistName || 'Protagonista'}</span>
          </MetadataItem>
          <MetadataItem>
            <span>🌍</span>
            <span>{params.setting}</span>
          </MetadataItem>
        </StoryMetadata>
        
        <div style={{ marginTop: theme.spacing[3] }}>
          <QualityIndicator quality={storyQuality}>
            {getQualityIcon(storyQuality)}
            {getQualityText(storyQuality)}
          </QualityIndicator>
        </div>
      </PreviewHeader>

      <StoryContent>
        <StoryText>
          {formattedStory}
        </StoryText>
      </StoryContent>

      <StoryStats>
        <StatItem>
          <StatValue>{storyStats.words}</StatValue>
          <StatLabel>Parole</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{storyStats.sentences}</StatValue>
          <StatLabel>Frasi</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{storyStats.paragraphs}</StatValue>
          <StatLabel>Paragrafi</StatLabel>
        </StatItem>
        <StatItem>
          <StatValue>{storyStats.readingTime}min</StatValue>
          <StatLabel>Lettura</StatLabel>
        </StatItem>
      </StoryStats>

      <ActionButtons>
        <Button
          variant="primary"
          onClick={onRegenerate}
          icon={<span>🔄</span>}
        >
          Rigenera Storia
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => {
            navigator.clipboard.writeText(story);
            // Qui potresti aggiungere un toast di conferma
          }}
          icon={<span>📋</span>}
        >
          Copia Testo
        </Button>
        
        <Button
          variant="secondary"
          onClick={() => {
            const blob = new Blob([story], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `storia-${params.protagonistName || 'generata'}.txt`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          icon={<span>💾</span>}
        >
          Scarica
        </Button>
        
        <Button
          variant="ghost"
          onClick={onReset}
          icon={<span>🗑️</span>}
        >
          Nuova Storia
        </Button>
      </ActionButtons>

      {/* Pannello Narrazione Vocale */}
      <VoiceNarrationPanel
        story={story}
        storyTitle={params.protagonistName ? `La Storia di ${params.protagonistName}` : 'Storia Generata'}
        onNarrationComplete={onNarrationComplete}
      />
    </PreviewContainer>
  );
});

StoryPreview.displayName = 'StoryPreview';

export default StoryPreview; 