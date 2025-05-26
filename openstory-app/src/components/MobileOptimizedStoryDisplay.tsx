import React, { useState } from 'react';
import styled from 'styled-components';
import { theme, mixins } from '../theme/designSystem';

interface StorySection {
  id: string;
  title: string;
  content: string;
  type: 'prologo' | 'atto1' | 'atto2' | 'atto3' | 'epilogo';
}

interface MobileOptimizedStoryDisplayProps {
  story: {
    title: string;
    sections: StorySection[];
    metadata?: {
      genre?: string;
      length?: string;
      tone?: string;
    };
  };
}

// Styled Components Mobile-First
const Container = styled.div`
  ${mixins.mobileContainer}
  background: ${theme.colors.background.card};
  border-radius: ${theme.borderRadius['2xl']};
  border: 1px solid ${theme.colors.border.primary};
  box-shadow: ${theme.shadows.lg};
  
  ${mixins.minLg} {
    padding: ${theme.spacing[8]};
    margin: ${theme.spacing[6]};
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: ${theme.spacing[6]};
  padding-bottom: ${theme.spacing[4]};
  border-bottom: 2px solid ${theme.colors.border.primary};
  
  ${mixins.md} {
    margin-bottom: ${theme.spacing[4]};
    padding-bottom: ${theme.spacing[3]};
  }
`;

const StoryTitle = styled.h1`
  color: ${theme.colors.text.accent};
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing[3]};
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
  
  ${mixins.md} {
    font-size: ${theme.typography.fontSize['2xl']};
    margin-bottom: ${theme.spacing[2]};
  }
  
  ${mixins.sm} {
    font-size: ${theme.typography.fontSize.xl};
  }
`;

const MetadataContainer = styled.div`
  ${mixins.mobileGrid}
  margin-bottom: ${theme.spacing[4]};
  
  ${mixins.minMd} {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const MetadataItem = styled.div`
  background: ${theme.colors.background.glass};
  padding: ${theme.spacing[3]};
  border-radius: ${theme.borderRadius.lg};
  text-align: center;
  border: 1px solid ${theme.colors.border.secondary};
  
  ${mixins.sm} {
    padding: ${theme.spacing[2]};
  }
`;

const MetadataLabel = styled.span`
  color: ${theme.colors.text.muted};
  font-size: ${theme.typography.fontSize.sm};
  display: block;
  margin-bottom: ${theme.spacing[1]};
`;

const MetadataValue = styled.span`
  color: ${theme.colors.text.accent};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-size: ${theme.typography.fontSize.base};
  
  ${mixins.sm} {
    font-size: ${theme.typography.fontSize.sm};
  }
`;

const SectionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[6]};
  
  ${mixins.md} {
    gap: ${theme.spacing[4]};
  }
`;

const SectionCard = styled.div<{ isExpanded: boolean }>`
  background: ${theme.colors.background.glass};
  border-radius: ${theme.borderRadius.xl};
  border: 1px solid ${theme.colors.border.secondary};
  overflow: hidden;
  transition: ${theme.animations.smooth};
  
  &:hover {
    border-color: ${theme.colors.border.hover};
    box-shadow: ${theme.shadows.glow};
  }
`;

const SectionHeader = styled.div`
  padding: ${theme.spacing[4]};
  background: ${theme.colors.background.tertiary};
  border-bottom: 1px solid ${theme.colors.border.secondary};
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mixins.touchOptimized}
  
  ${mixins.sm} {
    padding: ${theme.spacing[3]};
  }
`;

const SectionTitle = styled.h3`
  color: ${theme.colors.text.accent};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  margin: 0;
  
  ${mixins.sm} {
    font-size: ${theme.typography.fontSize.base};
  }
`;

const ExpandIcon = styled.span<{ isExpanded: boolean }>`
  color: ${theme.colors.text.accent};
  font-size: ${theme.typography.fontSize.xl};
  transition: ${theme.animations.smooth};
  transform: ${props => props.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
  
  ${mixins.sm} {
    font-size: ${theme.typography.fontSize.lg};
  }
`;

const SectionContent = styled.div<{ isExpanded: boolean }>`
  padding: ${props => props.isExpanded ? theme.spacing[4] : '0'};
  max-height: ${props => props.isExpanded ? '1000px' : '0'};
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${props => props.isExpanded ? '1' : '0'};
  
  ${mixins.sm} {
    padding: ${props => props.isExpanded ? theme.spacing[3] : '0'};
  }
`;

const SectionText = styled.div`
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeight.relaxed};
  font-size: ${theme.typography.fontSize.base};
  white-space: pre-wrap;
  
  ${mixins.sm} {
    font-size: ${theme.typography.fontSize.sm};
  }
  
  p {
    margin-bottom: ${theme.spacing[4]};
    text-indent: ${theme.spacing[6]};
    
    ${mixins.sm} {
      margin-bottom: ${theme.spacing[3]};
      text-indent: ${theme.spacing[4]};
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${theme.spacing[3]};
  margin-top: ${theme.spacing[6]};
  flex-wrap: wrap;
  
  ${mixins.md} {
    flex-direction: column;
    gap: ${theme.spacing[2]};
  }
`;

const ActionButton = styled.button`
  ${mixins.mobileButton}
  background: ${theme.gradients.primary};
  color: #1a1a2e;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.glowHover};
  }
  
  ${mixins.mobileOnly} {
    &:active:not(:disabled) {
      transform: scale(0.98);
      box-shadow: ${theme.shadows.glow};
    }
  }
`;

const SecondaryButton = styled(ActionButton)`
  background: ${theme.colors.background.glass};
  color: ${theme.colors.text.primary};
  border: 1px solid ${theme.colors.border.secondary};
  
  &:hover:not(:disabled) {
    background: ${theme.colors.background.glassHover};
    border-color: ${theme.colors.border.hover};
  }
`;

const MobileOptimizedStoryDisplay: React.FC<MobileOptimizedStoryDisplayProps> = ({ story }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const expandAll = () => {
    setExpandedSections(new Set(story.sections.map(s => s.id)));
  };

  const collapseAll = () => {
    setExpandedSections(new Set());
  };

  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'prologo': return '🎭';
      case 'atto1': return '🎬';
      case 'atto2': return '⚡';
      case 'atto3': return '🎯';
      case 'epilogo': return '🎊';
      default: return '📖';
    }
  };

  return (
    <Container>
      <Header>
        <StoryTitle>{story.title}</StoryTitle>
        
        {story.metadata && (
          <MetadataContainer>
            {story.metadata.genre && (
              <MetadataItem>
                <MetadataLabel>Genere</MetadataLabel>
                <MetadataValue>{story.metadata.genre}</MetadataValue>
              </MetadataItem>
            )}
            {story.metadata.length && (
              <MetadataItem>
                <MetadataLabel>Lunghezza</MetadataLabel>
                <MetadataValue>{story.metadata.length}</MetadataValue>
              </MetadataItem>
            )}
            {story.metadata.tone && (
              <MetadataItem>
                <MetadataLabel>Tono</MetadataLabel>
                <MetadataValue>{story.metadata.tone}</MetadataValue>
              </MetadataItem>
            )}
          </MetadataContainer>
        )}
        
        <ActionButtons>
          <ActionButton onClick={expandAll}>
            📖 Espandi Tutto
          </ActionButton>
          <SecondaryButton onClick={collapseAll}>
            📋 Comprimi Tutto
          </SecondaryButton>
        </ActionButtons>
      </Header>

      <SectionsContainer>
        {story.sections.map((section) => (
          <SectionCard 
            key={section.id} 
            isExpanded={expandedSections.has(section.id)}
          >
            <SectionHeader onClick={() => toggleSection(section.id)}>
              <SectionTitle>
                {getSectionIcon(section.type)} {section.title}
              </SectionTitle>
              <ExpandIcon isExpanded={expandedSections.has(section.id)}>
                ▼
              </ExpandIcon>
            </SectionHeader>
            
            <SectionContent isExpanded={expandedSections.has(section.id)}>
              <SectionText>
                {section.content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </SectionText>
            </SectionContent>
          </SectionCard>
        ))}
      </SectionsContainer>
    </Container>
  );
};

export default MobileOptimizedStoryDisplay; 