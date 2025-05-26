import React, { useState } from 'react';
import styled from 'styled-components';

const SectionContainer = styled.div`
  background: linear-gradient(145deg, #1e1e1e, #242424);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid #383838;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #ffd700;
    box-shadow: 0 6px 25px rgba(255, 215, 0, 0.15);
    transform: translateY(-2px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: #ffd700;
    opacity: 0.7;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid rgba(255, 215, 0, 0.1);
  padding-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  color: #ffd700;
  font-family: 'Playfair Display', serif;
  margin: 0;
  font-size: 2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 12px;
`;

const SectionContent = styled.div<{ isVisible: boolean }>`
  color: #e0e0e0;
  font-size: 1.2rem;
  line-height: 1.9;
  white-space: pre-wrap;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  max-height: ${props => props.isVisible ? '10000px' : '0'};
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isVisible ? '1' : '0'};
  transform: translateY(${props => props.isVisible ? '0' : '-20px'});

  p {
    margin-bottom: 1.5rem;
    text-indent: 2rem;
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ControlsContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const IconButton = styled.button<{ active?: boolean }>`
  background: ${props => props.active ? 'rgba(255, 215, 0, 0.1)' : 'transparent'};
  color: #ffd700;
  border: 1px solid ${props => props.active ? '#ffd700' : 'transparent'};
  border-radius: 8px;
  font-size: 1.1rem;
  padding: 8px 12px;
  cursor: pointer;
  opacity: 0.8;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  
  &:hover {
    opacity: 1;
    transform: scale(1.05);
    background: rgba(255, 215, 0, 0.1);
  }

  span {
    font-size: 0.9rem;
    font-weight: 500;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  background-color: ${props => props.variant === 'primary' ? '#ffd700' : '#333'};
  color: ${props => props.variant === 'primary' ? '#1a1a1a' : '#ffd700'};
  border: 1px solid #ffd700;
  border-radius: 8px;
  padding: 0.7rem 1.2rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.variant === 'primary' ? '#ffed4a' : '#444'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const CopyNotification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: rgba(76, 175, 80, 0.9);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(${props => props.className?.includes('visible') ? '0' : '100px'});
  opacity: ${props => props.className?.includes('visible') ? '1' : '0'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 2px solid rgba(255, 215, 0, 0.1);
`;

const DetailsContainer = styled.div`
  background: rgba(42, 42, 42, 0.5);
  backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1.5rem 0;
  border-left: 3px solid #ffd700;
  animation: slideDown 0.3s ease;
  
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DetailItem = styled.div`
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
  
  strong {
    color: #ffd700;
    font-weight: 600;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const LoadingSpinner = styled.div`
  width: 20px;
  height: 20px;
  border: 2px solid #ffd700;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const StatsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 1rem;
  font-size: 0.9rem;
  color: #888;
`;

const StatItem = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  
  strong {
    color: #ffd700;
  }
`;

interface StorySectionProps {
  title: string;
  content: string;
  sectionId: string;
  onRegenerate?: (sectionId: string) => Promise<void> | void;
}

const StorySection: React.FC<StorySectionProps> = ({ title, content, sectionId, onRegenerate }) => {
  const [copySuccess, setCopySuccess] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const wordCount = content.split(/\\s+/).filter(Boolean).length;
  const readTimeMinutes = Math.ceil(wordCount / 200);
  const paragraphs = content.trim().split(/\\n\\s*\\n/).map((p, i) => (
    <p key={`${sectionId}-p-${i}`}>{p.trim()}</p>
  ));
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleToggleDetails = () => {
    setShowDetails(!showDetails);
  };
  
  const handleRegenerate = async () => {
    if (onRegenerate) {
      setIsRegenerating(true);
      try {
        await onRegenerate(sectionId);
      } catch (error) {
        console.error("Errore durante la rigenerazione:", error);
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  return (
    <SectionContainer id={`story-section-${sectionId}`}>
      <SectionHeader>
        <SectionTitle>
          {title}
          {isRegenerating && <LoadingSpinner />}
        </SectionTitle>
        <ControlsContainer>
          <IconButton 
            onClick={handleToggleDetails}
            active={showDetails}
            title="Mostra dettagli"
          >
            📋 <span>Dettagli</span>
          </IconButton>
          <IconButton 
            onClick={() => setIsContentVisible(!isContentVisible)}
            title={isContentVisible ? "Comprimi sezione" : "Espandi sezione"}
          >
            {isContentVisible ? '🔼' : '🔽'} <span>{isContentVisible ? 'Comprimi' : 'Espandi'}</span>
          </IconButton>
        </ControlsContainer>
      </SectionHeader>

      {showDetails && (
        <DetailsContainer>
          <DetailItem>
            <strong>📊 Statistiche:</strong>
          </DetailItem>
          <DetailItem>
            Parole: {wordCount} | Tempo di lettura: ~{readTimeMinutes} min
          </DetailItem>
          <DetailItem>
            <strong>🎯 Azioni disponibili:</strong>
          </DetailItem>
          <DetailItem>
            • Copia il testo
            • Rigenera la sezione
            • Espandi/Comprimi
          </DetailItem>
        </DetailsContainer>
      )}

      <SectionContent isVisible={isContentVisible}>
        {paragraphs}
      </SectionContent>

      <ActionsBar>
        <StatsContainer>
          <StatItem>
            <strong>📝</strong> {wordCount} parole
          </StatItem>
          <StatItem>
            <strong>⏱️</strong> ~{readTimeMinutes} min
          </StatItem>
        </StatsContainer>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <ActionButton onClick={copyToClipboard}>
            📋 Copia Testo
          </ActionButton>
          <ActionButton 
            variant="primary"
            onClick={handleRegenerate}
            disabled={isRegenerating || !onRegenerate}
          >
            {isRegenerating ? <LoadingSpinner /> : '🔄'} Rigenera
          </ActionButton>
        </div>
      </ActionsBar>

      <CopyNotification className={copySuccess ? 'visible' : ''}>
        ✓ Testo copiato negli appunti!
      </CopyNotification>
    </SectionContainer>
  );
};

export default StorySection; 