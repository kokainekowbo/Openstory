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

const CharacterCard = styled.div`
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

const Input = styled.input`
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

interface SupportingCharacter {
  id: string;
  name: string;
  type: string;
  description: string;
  characteristics: string[];
}

interface SupportingCharactersProps {
  characters: SupportingCharacter[];
  onChange: (characters: SupportingCharacter[]) => void;
}

const SupportingCharacters: React.FC<SupportingCharactersProps> = ({ characters, onChange }) => {
  const [newCharacter, setNewCharacter] = useState<SupportingCharacter>({
    id: '',
    name: '',
    type: '',
    description: '',
    characteristics: []
  });

  const addCharacter = () => {
    if (newCharacter.name && newCharacter.type) {
      const character = {
        ...newCharacter,
        id: Date.now().toString()
      };
      onChange([...characters, character]);
      setNewCharacter({
        id: '',
        name: '',
      type: '',
        description: '',
      characteristics: []
      });
    }
  };
  
  const removeCharacter = (id: string) => {
    onChange(characters.filter(c => c.id !== id));
  };
  
  const updateCharacter = (id: string, field: keyof SupportingCharacter, value: string) => {
    onChange(characters.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };
  
  return (
    <Container>
      <h3>Personaggi di Supporto</h3>
      <Grid>
        {characters.map(character => (
          <CharacterCard key={character.id}>
            <DeleteButton onClick={() => removeCharacter(character.id)}>×</DeleteButton>
            
            <Label>Nome</Label>
            <Input
              type="text"
              value={character.name}
              onChange={(e) => updateCharacter(character.id, 'name', e.target.value)}
            />

            <Label>Tipo</Label>
            <Input
              type="text"
              value={character.type}
              onChange={(e) => updateCharacter(character.id, 'type', e.target.value)}
            />

            <Label>Descrizione</Label>
            <TextArea
              value={character.description}
              onChange={(e) => updateCharacter(character.id, 'description', e.target.value)}
              placeholder="Breve descrizione del personaggio..."
            />
          </CharacterCard>
        ))}

        <CharacterCard>
          <Label>Nome</Label>
          <Input
            type="text"
            value={newCharacter.name}
            onChange={(e) => setNewCharacter({ ...newCharacter, name: e.target.value })}
            placeholder="Nome del nuovo personaggio"
          />

          <Label>Tipo</Label>
          <Input
            type="text"
            value={newCharacter.type}
            onChange={(e) => setNewCharacter({ ...newCharacter, type: e.target.value })}
            placeholder="Es: Confidente, Antagonista Secondario, Aiutante..."
          />

          <Label>Descrizione</Label>
          <TextArea
            value={newCharacter.description}
            onChange={(e) => setNewCharacter({ ...newCharacter, description: e.target.value })}
            placeholder="Breve descrizione del personaggio..."
          />
      
      <AddButton onClick={addCharacter}>
            Aggiungi Personaggio
      </AddButton>
        </CharacterCard>
      </Grid>
    </Container>
  );
};

export default SupportingCharacters; 