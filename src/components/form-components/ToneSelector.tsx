import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  h3 {
    color: #f5f5f5;
    margin-bottom: 1rem;
  }
`;

const RequiredAsterisk = styled.span`
  color: #ff4d4d;
  margin-left: 0.25rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.8rem;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #f5f5f5;
  font-size: 1rem;
  
  &:focus {
    border-color: #ffd700;
    outline: none;
  }
`;

const Description = styled.p`
  color: #999;
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

interface ToneSelectorProps {
  value: string;
  onChange: (value: string) => void;
  isRequired?: boolean;
}

const tones = [
  { value: 'dark', label: 'Cupo', description: 'Atmosfera tesa e inquietante' },
  { value: 'light', label: 'Leggero', description: 'Atmosfera spensierata e ottimista' },
  { value: 'dramatic', label: 'Drammatico', description: 'Emozioni intense e conflitti profondi' },
  { value: 'humorous', label: 'Umoristico', description: 'Situazioni divertenti e battute' },
  { value: 'epic', label: 'Epico', description: 'Eventi grandiosi e temi universali' },
  { value: 'mysterious', label: 'Misterioso', description: 'Suspense e rivelazioni graduali' },
  { value: 'romantic', label: 'Romantico', description: 'Sentimenti e relazioni al centro' },
  { value: 'satirical', label: 'Satirico', description: 'Critica sociale attraverso l\'ironia' },
  { value: 'philosophical', label: 'Filosofico', description: 'Riflessioni profonde sulla vita' },
  { value: 'nostalgic', label: 'Nostalgico', description: 'Ricordi e atmosfere del passato' }
];

const ToneSelector: React.FC<ToneSelectorProps> = ({ value, onChange, isRequired }) => {
  return (
    <Container>
      <h3>
        Tono
        {isRequired && <RequiredAsterisk>*</RequiredAsterisk>}
      </h3>
      <Select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="">Seleziona il tono</option>
        {tones.map(tone => (
          <option key={tone.value} value={tone.value}>
            {tone.label}
          </option>
        ))}
      </Select>
      {value && (
      <Description>
          {tones.find(t => t.value === value)?.description}
      </Description>
      )}
    </Container>
  );
};

export default ToneSelector; 