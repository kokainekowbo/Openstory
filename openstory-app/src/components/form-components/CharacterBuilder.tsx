import React, { useState } from 'react';
import styled from 'styled-components';

// Tipi di personaggi
interface CharacterProps {
  type: string;
  name: string;
  goal?: string;
  motivation?: string;
  characteristics: string[];
  visualDescription?: string;
}

interface CharacterBuilderProps {
  type: 'protagonist' | 'antagonist' | 'supporting';
  value: CharacterProps;
  onChange: (value: CharacterProps) => void;
}

// Lista di possibili caratteristiche per i personaggi
const CHARACTER_CHARACTERISTICS = [
  { id: 'determined', label: 'Determinato' },
  { id: 'intelligent', label: 'Intelligente' },
  { id: 'brave', label: 'Coraggioso' },
  { id: 'ambitious', label: 'Ambizioso' },
  { id: 'loyal', label: 'Leale' },
  { id: 'cunning', label: 'Astuto' },
  { id: 'charismatic', label: 'Carismatico' },
  { id: 'ruthless', label: 'Spietato' },
  { id: 'compassionate', label: 'Compassionevole' },
  { id: 'mysterious', label: 'Misterioso' },
  { id: 'wise', label: 'Saggio' },
  { id: 'naive', label: 'Ingenuo' },
  { id: 'funny', label: 'Divertente' },
  { id: 'tragic', label: 'Tragico' },
  { id: 'manipulative', label: 'Manipolatore' },
];

// Database nomi fantasy per personaggi
const FANTASY_NAMES = {
  protagonists: {
    male: ['Aiden', 'Kai', 'Zander', 'Rylan', 'Damon', 'Orion', 'Atlas', 'Phoenix', 'Blaze', 'Storm', 'Raven', 'Hunter', 'Archer', 'Sage', 'River'],
    female: ['Luna', 'Aurora', 'Seraphina', 'Lyra', 'Nova', 'Aria', 'Ember', 'Iris', 'Celeste', 'Raven', 'Sage', 'River', 'Phoenix', 'Storm', 'Skye'],
    neutral: ['River', 'Sage', 'Phoenix', 'Storm', 'Raven', 'Hunter', 'Archer', 'Rowan', 'Avery', 'Quinn', 'Blake', 'Jordan', 'Alex', 'Morgan', 'Cameron']
  },
  antagonists: {
    male: ['Malachar', 'Vex', 'Draven', 'Nyx', 'Grimm', 'Voidus', 'Shadowbane', 'Darkthorn', 'Blackheart', 'Ravenclaw', 'Nightfall', 'Bloodmoon'],
    female: ['Morgana', 'Lilith', 'Nyx', 'Vex', 'Ravenna', 'Shadowmere', 'Darkspell', 'Nightshade', 'Grimhilde', 'Blackrose', 'Voidess'],
    neutral: ['Shadow', 'Void', 'Darkness', 'Nightmare', 'Eclipse', 'Phantom', 'Specter', 'Wraith', 'Nemesis', 'Chaos']
  },
  supporting: {
    male: ['Ethan', 'Lucas', 'Marcus', 'Adrian', 'Kieran', 'Tristan', 'Jasper', 'Felix', 'Dorian', 'Sebastian'],
    female: ['Vera', 'Maya', 'Zara', 'Ivy', 'Nora', 'Stella', 'Elena', 'Mira', 'Jade', 'Vale'],
    neutral: ['Sam', 'Casey', 'Drew', 'Kai', 'Lane', 'Ash', 'Sage', 'River', 'Sky', 'Nova']
  }
};

// Motivazioni comuni per antagonisti
const ANTAGONIST_MOTIVATIONS = [
  { id: 'power', label: 'Sete di potere' },
  { id: 'revenge', label: 'Vendetta personale' },
  { id: 'control', label: 'Controllo totale' },
  { id: 'wealth', label: 'Avidità di ricchezza' },
  { id: 'ideology', label: 'Ideologia estremista' },
  { id: 'survival', label: 'Sopravvivenza' },
  { id: 'jealousy', label: 'Gelosia/Invidia' },
  { id: 'madness', label: 'Follia' },
  { id: 'duty', label: 'Senso del dovere distorto' },
  { id: 'fear', label: 'Paura del cambiamento' },
  { id: 'custom', label: 'Personalizzata...' }
];

// Obiettivi comuni per protagonisti
const PROTAGONIST_GOALS = [
  { id: 'save_world', label: 'Salvare il mondo' },
  { id: 'save_family', label: 'Salvare la famiglia' },
  { id: 'find_truth', label: 'Scoprire la verità' },
  { id: 'revenge', label: 'Vendetta giusta' },
  { id: 'escape', label: 'Fuggire da una situazione' },
  { id: 'protect_others', label: 'Proteggere gli innocenti' },
  { id: 'find_love', label: 'Trovare l\'amore' },
  { id: 'redemption', label: 'Redenzione personale' },
  { id: 'freedom', label: 'Libertà' },
  { id: 'peace', label: 'Pace e riconciliazione' },
  { id: 'custom', label: 'Personalizzato...' }
];

// Lista di tipi di personaggi comuni
const PROTAGONIST_TYPES = [
  { id: 'detective', label: 'Detective' },
  { id: 'soldier', label: 'Soldato' },
  { id: 'scientist', label: 'Scienziato' },
  { id: 'artist', label: 'Artista' },
  { id: 'student', label: 'Studente' },
  { id: 'parent', label: 'Genitore' },
  { id: 'adventurer', label: 'Avventuriero' },
  { id: 'visionary', label: 'Visionario' },
  { id: 'criminal', label: 'Criminale' },
  { id: 'ordinary_person', label: 'Persona ordinaria' },
  { id: 'hero', label: 'Eroe' },
  { id: 'anti_hero', label: 'Anti-eroe' },
  { id: 'rebel', label: 'Ribelle' },
  { id: 'outcast', label: 'Emarginato' },
  { id: 'leader', label: 'Leader' },
  { id: 'custom', label: 'Personalizzato...' }
];

const ANTAGONIST_TYPES = [
  { id: 'villain', label: 'Cattivo classico' },
  { id: 'criminal_mastermind', label: 'Genio criminale' },
  { id: 'corrupt_official', label: 'Funzionario corrotto' },
  { id: 'rival', label: 'Rivale' },
  { id: 'monster', label: 'Mostro' },
  { id: 'organization', label: 'Organizzazione' },
  { id: 'system', label: 'Sistema oppressivo' },
  { id: 'former_ally', label: 'Ex alleato' },
  { id: 'shadow_self', label: 'Lato oscuro del protagonista' },
  { id: 'nature', label: 'Forza della natura' },
  { id: 'technology', label: 'Tecnologia fuori controllo' },
  { id: 'custom', label: 'Personalizzato...' }
];

const SUPPORTING_TYPES = [
  { id: 'mentor', label: 'Mentore' },
  { id: 'sidekick', label: 'Aiutante' },
  { id: 'love_interest', label: 'Interesse amoroso' },
  { id: 'ally', label: 'Alleato' },
  { id: 'family_member', label: 'Familiare' },
  { id: 'comic_relief', label: 'Personaggio comico' },
  { id: 'expert', label: 'Esperto' },
  { id: 'custom', label: 'Personalizzato...' }
];

// Stili
const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #f5f5f5;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #f5f5f5;
  border: 1px solid #444;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #f5f5f5;
  border: 1px solid #444;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s;
  
  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }
  
  option {
    background-color: #2c2c2c;
  }
`;

const Description = styled.p`
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.5rem;
`;

const MultiSelectContainer = styled.div`
  border: 1px solid #444;
  border-radius: 4px;
  background-color: #2c2c2c;
  padding: 0.5rem;
  max-height: 180px;
  overflow-y: auto;
`;

const CheckboxItem = styled.div`
  padding: 0.5rem;
  
  &:not(:last-child) {
    border-bottom: 1px solid #333;
  }
  
  &:hover {
    background-color: #333;
  }
  
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    input {
      margin-right: 0.5rem;
    }
  }
`;

const VisualPromptButton = styled.button`
  background-color: #3a2f7d;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: 1rem;
  
  &:hover {
    background-color: #4a3f8d;
  }
  
  svg {
    margin-right: 0.5rem;
  }
`;

const VisualPromptResult = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  font-style: italic;
`;

const FantasyNameButton = styled.button`
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  color: #1a1a2e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  margin-left: 0.5rem;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const NameSection = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  .name-input-container {
    flex: 1;
  }
`;

const SettingsPanel = styled.div`
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const SettingsTitle = styled.h4`
  color: #ffd700;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::before {
    content: '⚙️';
    font-size: 1.1rem;
  }
`;

const SettingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const SettingItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f5f5f5;
  cursor: pointer;
  font-size: 0.9rem;
  
  input[type="checkbox"] {
    accent-color: #ffd700;
  }
`;

const Container = styled.div`
  h3 {
    color: #f5f5f5;
    margin-bottom: 1rem;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1rem;
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
  
  &:focus {
    border-color: #ffd700;
    outline: none;
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.div`
  background: #333;
  color: #f5f5f5;
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  button {
    background: none;
    border: none;
    color: #ff4d4d;
    cursor: pointer;
    padding: 0;
    font-size: 1.2rem;
    line-height: 1;
    
    &:hover {
      color: #ff6666;
    }
  }
`;

const AddButton = styled.button`
  background: #2a2a2a;
  color: #ffd700;
  border: 1px solid #ffd700;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  
  &:hover {
    background: #333;
  }
`;

const CharacterBuilder: React.FC<CharacterBuilderProps> = ({ type, value, onChange }) => {
  const [showVisualPrompt, setShowVisualPrompt] = useState(false);
  const [visualPrompt, setVisualPrompt] = useState('');
  const [isCustomType, setIsCustomType] = useState(value.type === 'custom');
  const [newCharacteristic, setNewCharacteristic] = useState('');
  
  // Nuove impostazioni
  const [settings, setSettings] = useState({
    useFantasyNames: true,
    autoGenerateAntagonist: true,
    includeMotivation: true,
    showAdvancedOptions: false
  });
  
  // Seleziona i tipi appropriati in base al tipo di personaggio
  const getTypeOptions = () => {
    switch (type) {
      case 'protagonist':
        return PROTAGONIST_TYPES;
      case 'antagonist':
        return ANTAGONIST_TYPES;
      case 'supporting':
        return SUPPORTING_TYPES;
      default:
        return PROTAGONIST_TYPES;
    }
  };
  
  // Titoli e descrizioni specifici per ogni tipo di personaggio
  const getSpecificLabels = () => {
    switch (type) {
      case 'protagonist':
        return {
          title: 'Protagonista',
          typeLabel: 'Tipo di Protagonista',
          typeDescription: 'Il personaggio principale della storia.',
          goalLabel: 'Obiettivo',
          goalDescription: 'Cosa vuole ottenere il protagonista?'
        };
      case 'antagonist':
        return {
          title: 'Antagonista',
          typeLabel: 'Tipo di Antagonista',
          typeDescription: 'L\'oppositore principale del protagonista.',
          goalLabel: 'Motivazione',
          goalDescription: 'Cosa motiva l\'antagonista?'
        };
      case 'supporting':
        return {
          title: 'Personaggio di Supporto',
          typeLabel: 'Tipo di Personaggio',
          typeDescription: 'Un personaggio secondario ma importante.',
          goalLabel: 'Ruolo',
          goalDescription: 'Quale ruolo ha questo personaggio nella storia?'
        };
      default:
        return {
          title: 'Personaggio',
          typeLabel: 'Tipo',
          typeDescription: 'Che tipo di personaggio è?',
          goalLabel: 'Obiettivo/Motivazione',
          goalDescription: 'Cosa motiva questo personaggio?'
        };
    }
  };
  
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setIsCustomType(newType === 'custom');
    
    onChange({
      ...value,
      type: newType
    });
  };

  const handleCustomTypeChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    onChange({
      ...value,
      type: e.target.value
    });
  };
  
  const handleGoalChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    const fieldName = type === 'antagonist' ? 'motivation' : 'goal';
    
    onChange({
      ...value,
      [fieldName]: e.target.value
    });
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      name: e.target.value
    });
  };
  
  const handleCharacteristicToggle = (characteristic: string) => {
    const isSelected = value.characteristics.includes(characteristic);
    let newCharacteristics;
    
    if (isSelected) {
      newCharacteristics = value.characteristics.filter(c => c !== characteristic);
    } else {
      newCharacteristics = [...value.characteristics, characteristic];
    }
    
    onChange({
      ...value,
      characteristics: newCharacteristics
    });
  };
  
  // Genera un prompt visivo per il personaggio
  const generateVisualPrompt = () => {
    const characterType = value.type;
    const characteristics = value.characteristics.join(', ');
    
    // Costruisci un prompt visivo per il personaggio
    let prompt = `Immagine fotorealistica e cinematografica di un ${characterType}`;
    
    if (characteristics) {
      prompt += ` con queste caratteristiche: ${characteristics}`;
    }
    
    if (type === 'protagonist') {
      prompt += `. Protagonista di una storia che vuole ${value.goal}.`;
    } else if (type === 'antagonist') {
      prompt += `. Antagonista motivato da ${value.motivation}.`;
    }
    
    prompt += ' Stile cinematografico, illuminazione drammatica, alta qualità, dettagliato.';
    
    setVisualPrompt(prompt);
    setShowVisualPrompt(true);
  };

  const addCharacteristic = () => {
    if (newCharacteristic.trim() && !value.characteristics.includes(newCharacteristic.trim())) {
      onChange({
        ...value,
        characteristics: [...value.characteristics, newCharacteristic.trim()]
      });
      setNewCharacteristic('');
    }
  };

  const removeCharacteristic = (characteristic: string) => {
    onChange({
      ...value,
      characteristics: value.characteristics.filter(c => c !== characteristic)
    });
  };

  // Nuove funzioni per nomi fantasy
  const generateFantasyName = () => {
    const categoryKey = type as keyof typeof FANTASY_NAMES;
    const namesCategory = FANTASY_NAMES[categoryKey];
    
    if (namesCategory) {
      // Seleziona casualmente tra male, female, neutral
      const genderOptions = ['male', 'female', 'neutral'];
      const randomGender = genderOptions[Math.floor(Math.random() * genderOptions.length)] as keyof typeof namesCategory;
      const namesList = namesCategory[randomGender];
      const randomName = namesList[Math.floor(Math.random() * namesList.length)];
      
      onChange({
        ...value,
        name: randomName
      });
    }
  };

  const generateRandomGoal = () => {
    if (type === 'protagonist') {
      const goals = PROTAGONIST_GOALS.filter(g => g.id !== 'custom');
      const randomGoal = goals[Math.floor(Math.random() * goals.length)];
      onChange({
        ...value,
        goal: randomGoal.label
      });
    } else if (type === 'antagonist') {
      const motivations = ANTAGONIST_MOTIVATIONS.filter(m => m.id !== 'custom');
      const randomMotivation = motivations[Math.floor(Math.random() * motivations.length)];
      onChange({
        ...value,
        motivation: randomMotivation.label
      });
    }
  };

  const generateCompleteCharacter = () => {
    generateFantasyName();
    generateRandomGoal();
    
    // Genera 2-3 caratteristiche casuali
    const randomCharacteristics = CHARACTER_CHARACTERISTICS
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 2)
      .map(c => c.id);
    
    onChange({
      ...value,
      characteristics: randomCharacteristics
    });
  };
  
  return (
    <Container>
      <h3>{type === 'protagonist' ? 'Protagonista' : type === 'antagonist' ? 'Antagonista' : 'Personaggio di Supporto'}</h3>
      
      {/* Pannello Impostazioni Fantasy */}
      <SettingsPanel>
        <SettingsTitle>Impostazioni Personaggio</SettingsTitle>
        <SettingsGrid>
          <SettingItem>
            <input
              type="checkbox"
              checked={settings.useFantasyNames}
              onChange={(e) => setSettings(prev => ({ ...prev, useFantasyNames: e.target.checked }))}
            />
            <span>🧙‍♂️ Usa nomi fantasy</span>
          </SettingItem>
          
          <SettingItem>
            <input
              type="checkbox"
              checked={settings.includeMotivation}
              onChange={(e) => setSettings(prev => ({ ...prev, includeMotivation: e.target.checked }))}
            />
            <span>🎯 Includi motivazioni dettagliate</span>
          </SettingItem>
          
          <SettingItem>
            <input
              type="checkbox"
              checked={settings.showAdvancedOptions}
              onChange={(e) => setSettings(prev => ({ ...prev, showAdvancedOptions: e.target.checked }))}
            />
            <span>⚙️ Opzioni avanzate</span>
          </SettingItem>
        </SettingsGrid>
        
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <FantasyNameButton onClick={generateFantasyName}>
            🎭 Nome Fantasy
          </FantasyNameButton>
          <FantasyNameButton onClick={generateRandomGoal}>
            🎯 {type === 'antagonist' ? 'Motivazione' : 'Obiettivo'} Casuale
          </FantasyNameButton>
          <FantasyNameButton onClick={generateCompleteCharacter} style={{ background: 'linear-gradient(45deg, #ff8a00, #ffd700)' }}>
            ✨ Genera Tutto
          </FantasyNameButton>
        </div>
      </SettingsPanel>
      
      <Grid>
        <div>
          <Label>Tipo di {type === 'protagonist' ? 'Protagonista' : type === 'antagonist' ? 'Antagonista' : 'Personaggio'}</Label>
          <Select 
            value={isCustomType ? 'custom' : value.type}
            onChange={(e) => {
              handleTypeChange(e);
              handleCustomTypeChange(e);
            }}
            required
          >
            <option value="">Seleziona un tipo</option>
            {getTypeOptions().map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
        
        {isCustomType && (
          <div>
            <Label>Tipo Personalizzato</Label>
            <Input 
              type="text"
              value={value.type !== 'custom' ? value.type : ''}
              onChange={(e) => handleCustomTypeChange(e)}
              placeholder="Inserisci un tipo personalizzato..."
              required={isCustomType}
            />
          </div>
        )}
        
        <div>
          <NameSection>
            <div className="name-input-container">
              <Label>Nome</Label>
              <Input 
                type="text"
                value={value.name}
                onChange={handleNameChange}
                placeholder={settings.useFantasyNames ? 
                  `Nome fantasy per ${type}...` : 
                  "Nome del personaggio"
                }
              />
            </div>
            <FantasyNameButton onClick={generateFantasyName}>
              🎲
            </FantasyNameButton>
          </NameSection>
          
          {settings.useFantasyNames && !value.name && (
            <Description>
              💡 Suggerimenti: {FANTASY_NAMES[type as keyof typeof FANTASY_NAMES]?.neutral.slice(0, 3).join(', ')}...
            </Description>
          )}
        </div>

        <div>
          <Label>{type === 'protagonist' ? 'Obiettivo' : type === 'antagonist' ? 'Motivazione' : 'Ruolo'}</Label>
          <TextArea
            value={type === 'protagonist' ? value.goal : type === 'antagonist' ? value.motivation : value.goal}
            onChange={(e) => handleGoalChange(e)}
            placeholder={type === 'protagonist' ? 'Cosa vuole ottenere?' : type === 'antagonist' ? 'Cosa lo spinge ad agire?' : 'Quale ruolo ha questo personaggio nella storia?'}
          />
        </div>
      
        <div>
          <Label>Caratteristiche</Label>
        <MultiSelectContainer>
            {CHARACTER_CHARACTERISTICS.map(characteristic => (
            <CheckboxItem key={characteristic.id}>
              <label>
                <input 
                  type="checkbox"
                  checked={value.characteristics.includes(characteristic.id)}
                  onChange={() => handleCharacteristicToggle(characteristic.id)}
                />
                {characteristic.label}
              </label>
            </CheckboxItem>
          ))}
        </MultiSelectContainer>
          
          <Input
            type="text"
            value={newCharacteristic}
            onChange={(e) => setNewCharacteristic(e.target.value)}
            placeholder="Aggiungi una caratteristica personalizzata"
            onKeyPress={(e) => e.key === 'Enter' && addCharacteristic()}
          />
          <AddButton type="button" onClick={addCharacteristic}>
            Aggiungi Caratteristica
          </AddButton>
          
          <TagsContainer>
            {value.characteristics.map((characteristic, index) => {
              const predefinedChar = CHARACTER_CHARACTERISTICS.find(c => c.id === characteristic);
              return (
                <Tag key={index}>
                  {predefinedChar ? predefinedChar.label : characteristic}
                  <button type="button" onClick={() => removeCharacteristic(characteristic)}>
                    ×
                  </button>
                </Tag>
              );
            })}
          </TagsContainer>
        </div>
      </Grid>
      
      <VisualPromptButton onClick={generateVisualPrompt}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM13 7H11V13H17V11H13V7Z" fill="currentColor"/>
        </svg>
        Genera Prompt Visivo
      </VisualPromptButton>
      
      {showVisualPrompt && (
        <VisualPromptResult>
          <p><strong>Prompt per immagine:</strong> {visualPrompt}</p>
        </VisualPromptResult>
      )}
    </Container>
  );
};

export default CharacterBuilder; 