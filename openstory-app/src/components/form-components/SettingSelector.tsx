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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
`;

const Input = styled.input`
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

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 4px;
  color: #f5f5f5;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  grid-column: 1 / -1;
  
  &:focus {
    border-color: #ffd700;
    outline: none;
  }
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

const Label = styled.label`
  display: block;
  color: #f5f5f5;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

const RequiredAsterisk = styled.span`
  color: #ff4d4d;
  margin-left: 0.25rem;
`;

interface SettingSelectorProps {
  value: {
    place: string;
    time: string;
    description: string;
  };
  onChange: (value: SettingSelectorProps['value']) => void;
  isPlaceRequired?: boolean;
}

const timePeriods = [
  { value: 'ancient', label: 'Antichità', description: 'Prima del 500 d.C.' },
  { value: 'medieval', label: 'Medioevo', description: '500-1500 d.C.' },
  { value: 'renaissance', label: 'Rinascimento', description: '1400-1600' },
  { value: 'modern', label: 'Età Moderna', description: '1600-1945' },
  { value: 'contemporary', label: 'Contemporaneo', description: '1945-oggi' },
  { value: 'near-future', label: 'Futuro Prossimo', description: 'Prossimi 50-100 anni' },
  { value: 'far-future', label: 'Futuro Remoto', description: 'Centinaia/migliaia di anni nel futuro' },
  { value: 'alternate', label: 'Storia Alternativa', description: 'Timeline divergente' },
  { value: 'timeless', label: 'Senza Tempo', description: 'Periodo non specificato' }
];

const SettingSelector: React.FC<SettingSelectorProps> = ({ value, onChange, isPlaceRequired }) => {
  const handleChange = (field: keyof SettingSelectorProps['value'], newValue: string) => {
    onChange({
      ...value,
      [field]: newValue
    });
  };

  return (
    <Container>
      <h3>Ambientazione</h3>
      <Grid>
        <div>
          <Label>
            Luogo
            {isPlaceRequired && <RequiredAsterisk>*</RequiredAsterisk>}
          </Label>
          <Input
            type="text"
            value={value.place} 
            onChange={(e) => handleChange('place', e.target.value)}
            placeholder="Es: Una fortezza sperduta tra le montagne innevate, un mercato affollato in una metropoli cyberpunk..."
            required={isPlaceRequired}
          />
        </div>
        
        <div>
          <Label>Periodo Storico</Label>
          <Select 
            value={value.time} 
            onChange={(e) => handleChange('time', e.target.value)}
          >
            <option value="">Seleziona un periodo</option>
            {timePeriods.map(period => (
              <option key={period.value} value={period.value}>
                {period.label}
              </option>
            ))}
          </Select>
        </div>

        <div style={{ gridColumn: '1 / -1' }}>
          <Label>Descrizione Dettagliata dell'Ambientazione</Label>
        <TextArea 
          value={value.description} 
          onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Come appare questo luogo? Che odori si sentono? Qual è l'atmosfera generale? Ci sono elementi unici o particolari?"
        />
          <DescriptionText>
            Fornisci dettagli su elementi visivi, sonori, olfattivi, l'atmosfera, il clima, la cultura, la tecnologia e qualsiasi altro aspetto rilevante per creare un'immagine vivida dell'ambientazione.
          </DescriptionText>
        </div>
      </Grid>
    </Container>
  );
};

const DescriptionText = styled.p`
  color: #777;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

export default SettingSelector; 