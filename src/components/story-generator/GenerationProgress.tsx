import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../theme/designSystem';
import Button from '../ui/Button';

// 📊 GENERATION PROGRESS - Componente progresso generazione
// Mostra step corrente, barra di progresso e opzione di cancellazione

interface GenerationProgressProps {
  currentStep: string;
  progress: number; // 0-100
  onCancel: () => void;
}

// Animazioni
const progressAnimation = keyframes`
  0% { transform: translateX(-100%); }
  100% { transform: translateX(0%); }
`;

const pulseAnimation = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

const spinAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

// Styled Components
const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  padding: ${theme.spacing[8]};
  text-align: center;
`;

const ProgressTitle = styled.h3`
  color: ${theme.colors.text.accent};
  font-size: ${theme.typography.fontSize.xl};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin-bottom: ${theme.spacing[2]};
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${theme.spacing[2]};
`;

const ProgressIcon = styled.div`
  font-size: ${theme.typography.fontSize['2xl']};
  animation: ${spinAnimation} 2s linear infinite;
`;

const CurrentStep = styled.div`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.medium};
  animation: ${pulseAnimation} 1.5s ease-in-out infinite;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 12px;
  background: ${theme.colors.background.tertiary};
  border-radius: ${theme.borderRadius.full};
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const ProgressBar = styled.div<{ progress: number }>`
  height: 100%;
  width: ${props => props.progress}%;
  background: ${theme.gradients.primary};
  border-radius: ${theme.borderRadius.full};
  transition: width 0.5s ease-out;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${theme.gradients.shimmer};
    background-size: 200% 100%;
    animation: ${progressAnimation} 2s ease-in-out infinite;
  }
`;

const ProgressText = styled.div`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  margin-top: ${theme.spacing[2]};
`;

const StepsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${theme.spacing[4]} 0;
  position: relative;
`;

const StepIndicator = styled.div<{ active: boolean; completed: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.sm};
  position: relative;
  z-index: 2;
  transition: ${theme.animations.smooth};
  
  ${props => {
    if (props.completed) {
      return `
        background: ${theme.colors.status.success};
        color: white;
        box-shadow: ${theme.shadows.glow};
      `;
    } else if (props.active) {
      return `
        background: ${theme.gradients.primary};
        color: #1a1a2e;
        animation: ${pulseAnimation} 1s ease-in-out infinite;
        box-shadow: ${theme.shadows.glowHover};
      `;
    } else {
      return `
        background: ${theme.colors.background.tertiary};
        color: ${theme.colors.text.muted};
        border: 2px solid ${theme.colors.border.secondary};
      `;
    }
  }}
`;

const StepConnector = styled.div<{ completed: boolean }>`
  flex: 1;
  height: 2px;
  background: ${props => props.completed ? 
    theme.colors.status.success : 
    theme.colors.background.tertiary
  };
  margin: 0 ${theme.spacing[2]};
  transition: ${theme.animations.smooth};
`;

const CancelButton = styled.div`
  margin-top: ${theme.spacing[6]};
`;

const EstimatedTime = styled.div`
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.sm};
  margin-top: ${theme.spacing[4]};
  padding: ${theme.spacing[3]};
  background: ${theme.colors.background.glass};
  border-radius: ${theme.borderRadius.lg};
  border: 1px solid ${theme.colors.border.secondary};
`;

/**
 * GenerationProgress - Componente progresso generazione
 */
const GenerationProgress = React.memo<GenerationProgressProps>(({
  currentStep,
  progress,
  onCancel
}) => {
  // Steps della generazione
  const steps = [
    { id: 1, label: 'Analisi', icon: '🔍' },
    { id: 2, label: 'Prompt', icon: '📝' },
    { id: 3, label: 'AI', icon: '🤖' },
    { id: 4, label: 'Qualità', icon: '✨' },
    { id: 5, label: 'Fine', icon: '🎉' }
  ];

  // Calcola step corrente basato sul progresso
  const currentStepIndex = Math.floor((progress / 100) * steps.length);
  
  // Stima tempo rimanente
  const estimatedTimeRemaining = React.useMemo(() => {
    const totalEstimatedTime = 30; // 30 secondi
    const remainingTime = Math.max(0, totalEstimatedTime * (1 - progress / 100));
    return Math.ceil(remainingTime);
  }, [progress]);

  return (
    <ProgressContainer>
      <ProgressTitle>
        <ProgressIcon>⚡</ProgressIcon>
        Generazione in Corso
      </ProgressTitle>
      
      <CurrentStep>
        {currentStep}
      </CurrentStep>
      
      {/* Barra di progresso principale */}
      <div>
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
        <ProgressText>
          {Math.round(progress)}% completato
        </ProgressText>
      </div>
      
      {/* Indicatori step */}
      <StepsContainer>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepIndicator
              active={index === currentStepIndex}
              completed={index < currentStepIndex}
              title={step.label}
            >
              {index < currentStepIndex ? '✓' : step.icon}
            </StepIndicator>
            
            {index < steps.length - 1 && (
              <StepConnector completed={index < currentStepIndex} />
            )}
          </React.Fragment>
        ))}
      </StepsContainer>
      
      {/* Tempo stimato */}
      <EstimatedTime>
        ⏱️ Tempo stimato rimanente: {estimatedTimeRemaining} secondi
      </EstimatedTime>
      
      {/* Pulsante cancellazione */}
      <CancelButton>
        <Button
          variant="secondary"
          size="sm"
          onClick={onCancel}
          icon={<span>❌</span>}
        >
          Annulla Generazione
        </Button>
      </CancelButton>
    </ProgressContainer>
  );
});

GenerationProgress.displayName = 'GenerationProgress';

export default GenerationProgress; 