import React, { useState, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { theme, mixins } from '../../theme/designSystem';
import Button from '../ui/Button';
import { Input } from '../ui/Input';
import OpenVoiceService, { VoiceOptions, VoiceProfile, NarrationResponse } from '../../services/OpenVoiceService';

// 🎙️ VOICE NARRATION PANEL - Pannello per narrazione vocale delle storie
// Integrazione completa con OpenVoice per TTS e voice cloning

interface VoiceNarrationPanelProps {
  story: string;
  storyTitle?: string;
  onNarrationComplete?: (audioUrl: string, audioBlob: Blob) => void;
}

// Styled Components
const PanelContainer = styled.div`
  ${mixins.card}
  padding: ${theme.spacing[6]};
  margin-top: ${theme.spacing[6]};
`;

const PanelTitle = styled.h3`
  color: ${theme.colors.text.accent};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing[4]};
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${theme.spacing[4]};
  margin-bottom: ${theme.spacing[6]};
`;

const VoiceSelector = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[2]};
`;

const VoiceCard = styled.button<{ selected: boolean }>`
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

const VoiceInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[1]};
`;

const VoiceName = styled.div`
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
`;

const VoiceDescription = styled.div`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.muted};
`;

const VoiceDetails = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.secondary};
  display: flex;
  gap: ${theme.spacing[2]};
`;

const CustomVoiceUpload = styled.div`
  border: 2px dashed ${theme.colors.border.secondary};
  border-radius: ${theme.borderRadius.lg};
  padding: ${theme.spacing[6]};
  text-align: center;
  transition: ${theme.animations.smooth};
  cursor: pointer;
  
  &:hover {
    border-color: ${theme.colors.border.hover};
    background: ${theme.colors.background.glass};
  }
  
  &.dragover {
    border-color: ${theme.colors.border.focus};
    background: rgba(255, 215, 0, 0.1);
  }
`;

const AudioPlayer = styled.div`
  ${mixins.card}
  padding: ${theme.spacing[4]};
  margin-top: ${theme.spacing[4]};
  background: ${theme.colors.background.glass};
`;

const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 8px;
  background: ${theme.colors.background.tertiary};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  margin: ${theme.spacing[3]} 0;
  
  &::after {
    content: '';
    display: block;
    width: ${props => props.progress}%;
    height: 100%;
    background: ${theme.gradients.primary};
    transition: width 0.3s ease;
  }
`;

const StatusMessage = styled.div<{ type: 'info' | 'success' | 'error' | 'warning' }>`
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.lg};
  margin: ${theme.spacing[3]} 0;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  
  ${props => {
    switch (props.type) {
      case 'success':
        return `
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid ${theme.colors.status.success};
          color: ${theme.colors.status.success};
        `;
      case 'error':
        return `
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid ${theme.colors.status.error};
          color: ${theme.colors.status.error};
        `;
      case 'warning':
        return `
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid ${theme.colors.status.warning};
          color: ${theme.colors.status.warning};
        `;
      default:
        return `
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid ${theme.colors.status.info};
          color: ${theme.colors.status.info};
        `;
    }
  }}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  flex-wrap: wrap;
  margin-top: ${theme.spacing[4]};
`;

/**
 * VoiceNarrationPanel - Pannello per narrazione vocale delle storie
 */
const VoiceNarrationPanel: React.FC<VoiceNarrationPanelProps> = ({
  story,
  storyTitle = 'Storia',
  onNarrationComplete
}) => {
  // 🎯 STATE MANAGEMENT
  const [selectedVoice, setSelectedVoice] = useState<string>('example_reference');
  const [voiceOptions, setVoiceOptions] = useState<VoiceOptions>({
    accent: 'en-newest',
    speed: 1.0,
    emotion: 'default'
  });
  const [customVoiceFile, setCustomVoiceFile] = useState<File | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [narrationResult, setNarrationResult] = useState<NarrationResponse | null>(null);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'info' | 'success' | 'error' | 'warning';
    text: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // 🎙️ VOICE PROFILES
  const availableVoices = OpenVoiceService.getAvailableVoices();

  // 🔄 CALLBACKS
  const handleVoiceSelect = useCallback((voiceId: string) => {
    setSelectedVoice(voiceId);
    setCustomVoiceFile(null);
  }, []);

  const handleCustomVoiceUpload = useCallback((file: File) => {
    if (file.type.startsWith('audio/')) {
      setCustomVoiceFile(file);
      setSelectedVoice('custom');
      setStatusMessage({
        type: 'info',
        text: `File audio caricato: ${file.name}`
      });
    } else {
      setStatusMessage({
        type: 'error',
        text: 'Formato file non supportato. Usa file audio (MP3, WAV, etc.)'
      });
    }
  }, []);

  const handleFileInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleCustomVoiceUpload(file);
    }
  }, [handleCustomVoiceUpload]);

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.add('dragover');
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
  }, []);

  const handleDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.currentTarget.classList.remove('dragover');
    
    const file = event.dataTransfer.files[0];
    if (file) {
      handleCustomVoiceUpload(file);
    }
  }, [handleCustomVoiceUpload]);

  const generateNarration = useCallback(async () => {
    if (!story.trim()) {
      setStatusMessage({
        type: 'error',
        text: 'Nessuna storia da narrare'
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setStatusMessage({
      type: 'info',
      text: 'Generazione narrazione in corso...'
    });

    try {
      // Simula progresso
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      let result: NarrationResponse;

      if (selectedVoice === 'custom' && customVoiceFile) {
        // Voice cloning
        result = await OpenVoiceService.generateClonedVoice(
          story,
          customVoiceFile,
          voiceOptions
        );
      } else {
        // TTS normale
        result = await OpenVoiceService.narrateStory(story, {
          ...voiceOptions,
          voice: selectedVoice !== 'custom' ? selectedVoice : undefined
        });
      }

      clearInterval(progressInterval);
      setProgress(100);

      if (result.success) {
        setNarrationResult(result);
        setStatusMessage({
          type: 'success',
          text: `Narrazione completata in ${result.elapsedTime?.toFixed(1)}s usando ${result.deviceUsed}`
        });

        if (result.audioUrl && result.audioBlob && onNarrationComplete) {
          onNarrationComplete(result.audioUrl, result.audioBlob);
        }
      } else {
        throw new Error(result.error || 'Errore sconosciuto');
      }

    } catch (error: any) {
      console.error('❌ Errore generazione narrazione:', error);
      setStatusMessage({
        type: 'error',
        text: error.message || 'Errore durante la generazione'
      });
    } finally {
      setIsGenerating(false);
    }
  }, [story, selectedVoice, customVoiceFile, voiceOptions, onNarrationComplete]);

  const downloadAudio = useCallback(() => {
    if (narrationResult?.audioBlob) {
      const filename = `${storyTitle.replace(/[^a-zA-Z0-9]/g, '_')}_narrazione.wav`;
      OpenVoiceService.downloadAudio(narrationResult.audioBlob, filename);
    }
  }, [narrationResult, storyTitle]);

  const playAudio = useCallback(() => {
    if (audioRef.current && narrationResult?.audioUrl) {
      audioRef.current.play();
    }
  }, [narrationResult]);

  const pauseAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  return (
    <PanelContainer>
      <PanelTitle>
        🎙️ Narrazione Vocale
      </PanelTitle>

      {/* Selezione Voce */}
      <VoiceSelector>
        <h4 style={{ color: theme.colors.text.primary, marginBottom: theme.spacing[3] }}>
          Seleziona Voce
        </h4>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing[3] }}>
          {availableVoices.map(voice => (
            <VoiceCard
              key={voice.id}
              selected={selectedVoice === voice.id}
              onClick={() => handleVoiceSelect(voice.id)}
              type="button"
            >
              <VoiceInfo>
                <VoiceName>{voice.name}</VoiceName>
                <VoiceDescription>{voice.description}</VoiceDescription>
                <VoiceDetails>
                  <span>{voice.gender}</span>
                  <span>•</span>
                  <span>{voice.accent}</span>
                </VoiceDetails>
              </VoiceInfo>
            </VoiceCard>
          ))}
        </div>

        {/* Upload Voce Personalizzata */}
        <CustomVoiceUpload
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div style={{ fontSize: theme.typography.fontSize.lg, marginBottom: theme.spacing[2] }}>
            🎤 Voce Personalizzata
          </div>
          <div style={{ color: theme.colors.text.muted, fontSize: theme.typography.fontSize.sm }}>
            {customVoiceFile 
              ? `File caricato: ${customVoiceFile.name}`
              : 'Trascina un file audio o clicca per caricare'
            }
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
          />
        </CustomVoiceUpload>
      </VoiceSelector>

      {/* Opzioni Vocali */}
      <OptionsGrid>
        <div>
          <label style={{ color: theme.colors.text.accent, fontWeight: theme.typography.fontWeight.semibold }}>
            Accento
          </label>
          <select
            value={voiceOptions.accent}
            onChange={(e) => setVoiceOptions(prev => ({ ...prev, accent: e.target.value as any }))}
            style={{
              width: '100%',
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.lg,
              border: `2px solid ${theme.colors.border.secondary}`,
              background: theme.colors.background.glass,
              color: theme.colors.text.primary,
              marginTop: theme.spacing[2]
            }}
          >
            <option value="en-newest">Inglese Moderno</option>
            <option value="en-us">Inglese Americano</option>
            <option value="en-br">Inglese Britannico</option>
            <option value="en-au">Inglese Australiano</option>
            <option value="es">Spagnolo</option>
            <option value="fr">Francese</option>
            <option value="it">Italiano</option>
          </select>
        </div>

        <Input
          label="Velocità"
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value={voiceOptions.speed?.toString() || '1.0'}
          onChange={(e) => setVoiceOptions(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
          hint={`Velocità: ${voiceOptions.speed?.toFixed(1)}x`}
          fullWidth
        />

        <div>
          <label style={{ color: theme.colors.text.accent, fontWeight: theme.typography.fontWeight.semibold }}>
            Emozione
          </label>
          <select
            value={voiceOptions.emotion}
            onChange={(e) => setVoiceOptions(prev => ({ ...prev, emotion: e.target.value as any }))}
            style={{
              width: '100%',
              padding: theme.spacing[3],
              borderRadius: theme.borderRadius.lg,
              border: `2px solid ${theme.colors.border.secondary}`,
              background: theme.colors.background.glass,
              color: theme.colors.text.primary,
              marginTop: theme.spacing[2]
            }}
          >
            <option value="default">Normale</option>
            <option value="excited">Eccitato</option>
            <option value="cheerful">Allegro</option>
            <option value="friendly">Amichevole</option>
            <option value="sad">Triste</option>
            <option value="angry">Arrabbiato</option>
            <option value="whispering">Sussurrato</option>
            <option value="shouting">Gridato</option>
          </select>
        </div>
      </OptionsGrid>

      {/* Status e Progresso */}
      {statusMessage && (
        <StatusMessage type={statusMessage.type}>
          {statusMessage.type === 'success' && '✅'}
          {statusMessage.type === 'error' && '❌'}
          {statusMessage.type === 'warning' && '⚠️'}
          {statusMessage.type === 'info' && 'ℹ️'}
          {statusMessage.text}
        </StatusMessage>
      )}

      {isGenerating && (
        <ProgressBar progress={progress} />
      )}

      {/* Player Audio */}
      {narrationResult?.audioUrl && (
        <AudioPlayer>
          <audio
            ref={audioRef}
            src={narrationResult.audioUrl}
            controls
            style={{ width: '100%' }}
          />
          <div style={{ 
            marginTop: theme.spacing[3], 
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.muted 
          }}>
            Durata: {narrationResult.duration?.toFixed(1)}s | 
            Generato in: {narrationResult.elapsedTime?.toFixed(1)}s
          </div>
        </AudioPlayer>
      )}

      {/* Pulsanti Azione */}
      <ActionButtons>
        <Button
          variant="primary"
          size="lg"
          loading={isGenerating}
          disabled={!story.trim()}
          onClick={generateNarration}
          icon={<span>🎙️</span>}
        >
          {isGenerating ? 'Generando...' : 'Genera Narrazione'}
        </Button>

        {narrationResult?.audioUrl && (
          <>
            <Button
              variant="secondary"
              onClick={playAudio}
              icon={<span>▶️</span>}
            >
              Riproduci
            </Button>

            <Button
              variant="secondary"
              onClick={pauseAudio}
              icon={<span>⏸️</span>}
            >
              Pausa
            </Button>

            <Button
              variant="secondary"
              onClick={downloadAudio}
              icon={<span>💾</span>}
            >
              Scarica Audio
            </Button>
          </>
        )}
      </ActionButtons>
    </PanelContainer>
  );
};

export default React.memo(VoiceNarrationPanel); 