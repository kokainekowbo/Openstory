import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  h3 {
    color: #f5f5f5;
    margin-bottom: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const LengthOption = styled.div<{ selected: boolean }>`
  background: ${props => props.selected ? '#333' : '#2a2a2a'};
  border: 1px solid ${props => props.selected ? '#ffd700' : '#333'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: #333;
    border-color: ${props => props.selected ? '#ffd700' : '#444'};
  }
`;

const Title = styled.h4`
  color: #ffd700;
  margin: 0 0 0.5rem 0;
  font-size: 1rem;
`;

const Description = styled.p`
  color: #999;
  font-size: 0.9rem;
  margin: 0;
`;

const WordCount = styled.span`
  display: block;
  color: #666;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

interface LengthSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const lengthOptions = [
  {
    value: 'short',
    title: 'Racconto Breve',
    description: 'Una storia concisa e d\'impatto',
    wordCount: '1.000-5.000 parole'
  },
  {
    value: 'medium',
    title: 'Racconto Medio',
    description: 'Spazio per sviluppare personaggi e trama',
    wordCount: '5.000-15.000 parole'
  },
  {
    value: 'long',
    title: 'Racconto Lungo',
    description: 'Una storia complessa e articolata',
    wordCount: '15.000-30.000 parole'
  },
  {
    value: 'novella',
    title: 'Romanzo Breve',
    description: 'Un\'opera completa ma contenuta',
    wordCount: '30.000-50.000 parole'
  }
];

const LengthSelector: React.FC<LengthSelectorProps> = ({ value, onChange }) => {
  return (
    <Container>
      <h3>Lunghezza della Storia</h3>
      <Grid>
        {lengthOptions.map(option => (
          <LengthOption
            key={option.value}
            selected={value === option.value}
            onClick={() => onChange(option.value)}
          >
            <Title>{option.title}</Title>
            <Description>{option.description}</Description>
            <WordCount>{option.wordCount}</WordCount>
          </LengthOption>
        ))}
      </Grid>
    </Container>
  );
};

export default LengthSelector; 