import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  h3 {
    color: #f5f5f5;
    margin-bottom: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1.5rem;
`;

const ElementCard = styled.div`
  background: #2a2a2a;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 1rem;
  position: relative;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 0.2rem 0.5rem;
  
  &:hover {
    color: #ff6666;
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
  margin-bottom: 1rem;
  
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
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    border-color: #ffd700;
    outline: none;
  }
`;

const AddButton = styled.button`
  background: #2a2a2a;
  color: #ffd700;
  border: 1px solid #ffd700;
  padding: 0.8rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  margin-top: 1rem;
  
  &:hover {
    background: #333;
  }
`;

const Label = styled.label`
  display: block;
  color: #f5f5f5;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
`;

interface PlotElement {
  id: string;
  type: string;
  description: string;
}

interface PlotElementsSelectorProps {
  value: PlotElement[];
  onChange: (elements: PlotElement[]) => void;
}

const plotElementTypes = [
  { value: 'conflict', label: 'Conflitto', description: 'Una sfida o opposizione che il protagonista deve affrontare' },
  { value: 'twist', label: 'Colpo di Scena', description: 'Un evento inaspettato che cambia il corso della storia' },
  { value: 'revelation', label: 'Rivelazione', description: 'Una verità nascosta viene alla luce' },
  { value: 'obstacle', label: 'Ostacolo', description: 'Una difficoltà che impedisce al protagonista di raggiungere il suo obiettivo' },
  { value: 'decision', label: 'Decisione Cruciale', description: 'Una scelta importante che influenza il corso della storia' },
  { value: 'subplot', label: 'Sottotrama', description: 'Una storia secondaria che si intreccia con quella principale' },
  { value: 'flashback', label: 'Flashback', description: 'Un ricordo o evento del passato rilevante per la storia' },
  { value: 'foreshadowing', label: 'Anticipazione', description: 'Un indizio o suggerimento di eventi futuri' },
  { value: 'climax', label: 'Climax', description: 'Il momento di massima tensione della storia' },
  { value: 'resolution', label: 'Risoluzione', description: 'Come si conclude un arco narrativo o conflitto' }
];

const PlotElementsSelector: React.FC<PlotElementsSelectorProps> = ({ value, onChange }) => {
  const [newElement, setNewElement] = useState<PlotElement>({
    id: '',
    type: '',
    description: ''
  });
  
  const addElement = () => {
    if (newElement.type && newElement.description) {
      const element = {
        ...newElement,
        id: Date.now().toString()
      };
      onChange([...value, element]);
      setNewElement({
        id: '',
        type: '',
        description: ''
      });
    }
  };

  const removeElement = (id: string) => {
    onChange(value.filter(e => e.id !== id));
  };
  
  const updateElement = (id: string, field: keyof PlotElement, newValue: string) => {
    onChange(value.map(e => 
      e.id === id ? { ...e, [field]: newValue } : e
    ));
  };
  
  return (
    <Container>
      <h3>Elementi della Trama</h3>
      <Grid>
        {value.map(element => (
          <ElementCard key={element.id}>
            <DeleteButton onClick={() => removeElement(element.id)}>×</DeleteButton>
            
            <Label>Tipo di Elemento</Label>
            <Select
              value={element.type}
              onChange={(e) => updateElement(element.id, 'type', e.target.value)}
            >
              <option value="">Seleziona un tipo</option>
              {plotElementTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
        ))}
            </Select>
      
            <Label>Descrizione</Label>
            <TextArea
              value={element.description}
              onChange={(e) => updateElement(element.id, 'description', e.target.value)}
              placeholder="Descrivi questo elemento della trama..."
            />
          </ElementCard>
        ))}

        <ElementCard>
          <Label>Tipo di Elemento</Label>
          <Select
            value={newElement.type}
            onChange={(e) => setNewElement({ ...newElement, type: e.target.value })}
          >
            <option value="">Seleziona un tipo</option>
            {plotElementTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))} 
          </Select>

          <Label>Descrizione</Label>
          <TextArea
            value={newElement.description}
            onChange={(e) => setNewElement({ ...newElement, description: e.target.value })}
            placeholder="Descrivi il nuovo elemento della trama..."
          />

          <AddButton onClick={addElement}>
            Aggiungi Elemento
          </AddButton>
        </ElementCard>
      </Grid>
    </Container>
  );
};

export default PlotElementsSelector; 