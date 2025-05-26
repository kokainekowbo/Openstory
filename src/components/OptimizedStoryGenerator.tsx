import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  useStoryStore,
  useStoryParameters,
  useValidationErrors,
  useIsFormValid,
  useIsGenerating
} from '../store/storyStore';

// Styled Components
const GeneratorContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  padding: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  background: linear-gradient(45deg, #ffd700, #ffed4e, #ffd700);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s ease-in-out infinite;
  
  @keyframes shimmer {
    0%, 100% { background-position: -200% center; }
    50% { background-position: 200% center; }
  }
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const FormContainer = styled.div`
  background: rgba(26, 26, 26, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 25px;
  padding: 3rem;
  border: 1px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 2rem;
    margin: 1rem;
  }
`;

const FormSection = styled.div`
  margin-bottom: 2.5rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-2px);
  }
`;

const SectionTitle = styled.h2`
  color: #ffd700;
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  gap: 1.5rem;
  
  &.two-columns {
    grid-template-columns: 1fr 1fr;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  &.three-columns {
    grid-template-columns: 1fr 1fr 1fr;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
`;

const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #f5f5f5;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Select = styled.select<{ hasError?: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid ${props => props.hasError ? '#dc3545' : 'rgba(255, 255, 255, 0.2)'};
  background: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }
  
  option {
    background: #1a1a2e;
    color: #f5f5f5;
  }
`;

const Input = styled.input<{ hasError?: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid ${props => props.hasError ? '#dc3545' : 'rgba(255, 255, 255, 0.2)'};
  background: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(245, 245, 245, 0.5);
  }
`;

const TextArea = styled.textarea<{ hasError?: boolean }>`
  padding: 1rem;
  border-radius: 12px;
  border: 2px solid ${props => props.hasError ? '#dc3545' : 'rgba(255, 255, 255, 0.2)'};
  background: rgba(255, 255, 255, 0.1);
  color: #f5f5f5;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }
  
  &::placeholder {
    color: rgba(245, 245, 245, 0.5);
  }
`;

const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const CheckboxItem = styled.label`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 215, 0, 0.3);
  }
`;

const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 18px;
  height: 18px;
  accent-color: #ffd700;
  cursor: pointer;
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 1.5rem 2rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #0f0f23;
  background: linear-gradient(45deg, #ffd700, #ffed4e);
  border: none;
  border-radius: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 30px rgba(255, 215, 0, 0.3);
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px rgba(255, 215, 0, 0.4);
    background: linear-gradient(45deg, #ffed4e, #ffd700);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ActionButton = styled.button`
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid #ffd700;
  border-radius: 20px;
  color: #ffd700;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.3);
    transform: translateY(-1px);
  }
`;

// Data options
const genreOptions = [
  '🏰 Fantasy', '🚀 Fantascienza', '🔍 Mistero', '💕 Romance', 
  '⚔️ Avventura', '👻 Horror', '🎭 Drammatico', '😂 Commedia',
  '🕵️ Thriller', '🌟 Slice of Life', '🦸 Supereroi', '🏛️ Storico'
];

const toneOptions = [
  '😊 Leggero e Divertente', '🎭 Serio e Drammatico', '🌟 Epico e Grandioso',
  '🔍 Misterioso e Intrigante', '💕 Romantico e Dolce', '😂 Comico e Sarcastico',
  '👻 Dark e Inquietante', '🌅 Nostalgico e Malinconico', '⚡ Dinamico e Adrenalinico'
];

const lengthOptions = [
  { value: 'synopsis', label: '📄 Sinossi (100-200 parole)' },
  { value: 'short', label: '📖 Racconto breve (500-1000 parole)' },
  { value: 'medium', label: '📚 Racconto lungo (1500-3000 parole)' },
  { value: 'chapter', label: '📝 Capitolo (3000-5000 parole)' },
  { value: 'long', label: '📰 Storia completa (5000+ parole)' },
  { value: 'series', label: '🎬 Inizio serie (con continuazione)' }
];

const protagonistNameOptions = [
  'Aria', 'Zara', 'Kai', 'Luna', 'Orion', 'Nova', 'Sage', 'Phoenix',
  'Raven', 'Atlas', 'Iris', 'Dante', 'Lyra', 'Axel', 'Vera', 'Juno'
];

const protagonistTypeOptions = [
  '🦸 Eroe Coraggioso', '🧙 Mago Potente', '🕵️ Detective Astuto', 
  '👑 Nobile Ribelle', '🗡️ Guerriero Esperto', '🎨 Artista Visionario',
  '🔬 Scienziato Geniale', '🏹 Cacciatore Abile', '📚 Studioso Saggio'
];

const protagonistGoalOptions = [
  '💎 Trovare un tesoro leggendario', '👑 Salvare il regno', '💕 Trovare il vero amore',
  '🔍 Scoprire la verità', '⚔️ Sconfiggere il nemico', '🏠 Tornare a casa',
  '🌟 Realizzare un sogno', '🛡️ Proteggere qualcuno', '🔓 Ottenere la libertà'
];

const antagonistTypeOptions = [
  '👹 Signore Oscuro', '🐉 Drago Antico', '🤖 IA Malvagia', '👑 Tiranno Spietato',
  '🧙‍♂️ Mago Corrotto', '🕷️ Assassino Silenzioso', '👻 Spirito Vendicativo',
  '🦹‍♂️ Supercriminale', '🏢 Corporazione Malvagia'
];

const antagonistMotivationOptions = [
  '👑 Sete di potere', '💰 Avidità estrema', '💔 Vendetta personale',
  '🌍 Dominare il mondo', '🔥 Distruggere tutto', '🧬 Esperimenti folli',
  '⚖️ Giustizia distorta', '😈 Puro sadismo', '🎭 Caos e anarchia'
];

const plotElementOptions = [
  '🗡️ Combattimenti epici', '💕 Storia d\'amore', '🔍 Mistero da risolvere',
  '🏃‍♂️ Inseguimenti mozzafiato', '🎭 Tradimenti inaspettati', '🌟 Magia e incantesimi',
  '🤝 Alleanze improbabili', '⏰ Viaggi nel tempo', '🌍 Mondi paralleli',
  '👻 Elementi soprannaturali', '🎯 Missioni segrete', '🏆 Tornei e competizioni'
];

const storySettingsOptions = [
  { value: 'standard', label: '📖 Storia Standard' },
  { value: 'episodic', label: '📺 Formato Episodico' },
  { value: 'series_start', label: '🎬 Inizio Serie' },
  { value: 'series_continuation', label: '📚 Continuazione Serie' }
];

const OptimizedStoryGenerator: React.FC = () => {
  const navigate = useNavigate();
  
  // Store state
  const parameters = useStoryParameters();
  const validationErrors = useValidationErrors();
  const isFormValid = useIsFormValid();
  const isGenerating = useIsGenerating();
  
  // Actions from store
  const updateParameters = useStoryStore(state => state.updateParameters);
  const generateStory = useStoryStore(state => state.generateStory);
  const validateForm = useStoryStore(state => state.validateForm);

  const handleGenerate = async () => {
    if (validateForm()) {
      await generateStory();
      navigate('/story');
    }
  };

  const getFieldError = (field: string) => {
    return validationErrors.find(error => error.field === field);
  };

  const handlePlotElementChange = (element: string, checked: boolean) => {
    const currentElements = parameters.plotElements || [];
    const newElements = checked
      ? [...currentElements, element]
      : currentElements.filter(e => e !== element);
    
    updateParameters({ plotElements: newElements });
  };

  const generateRandomProtagonist = () => {
    const randomName = protagonistNameOptions[Math.floor(Math.random() * protagonistNameOptions.length)];
    const randomType = protagonistTypeOptions[Math.floor(Math.random() * protagonistTypeOptions.length)];
    const randomGoal = protagonistGoalOptions[Math.floor(Math.random() * protagonistGoalOptions.length)];
    
    updateParameters({
      protagonist: {
        name: randomName,
        type: randomType,
        goal: randomGoal,
        characteristics: parameters.protagonist?.characteristics || []
      }
    });
  };

  const generateRandomAntagonist = () => {
    const randomType = antagonistTypeOptions[Math.floor(Math.random() * antagonistTypeOptions.length)];
    const randomMotivation = antagonistMotivationOptions[Math.floor(Math.random() * antagonistMotivationOptions.length)];
    
    updateParameters({
      antagonist: {
        name: parameters.antagonist?.name,
        type: randomType,
        motivation: randomMotivation,
        characteristics: parameters.antagonist?.characteristics || []
      }
    });
  };

  const updateSetting = (newSetting: Partial<typeof parameters.setting>) => {
    updateParameters({
      setting: {
        place: parameters.setting?.place || '',
        time: parameters.setting?.time || 'present',
        description: parameters.setting?.description || '',
        ...newSetting
      }
    });
  };

  const updateProtagonist = (newProtagonist: Partial<typeof parameters.protagonist>) => {
    updateParameters({
      protagonist: {
        name: parameters.protagonist?.name || '',
        type: parameters.protagonist?.type || '',
        goal: parameters.protagonist?.goal || '',
        characteristics: parameters.protagonist?.characteristics || [],
        ...newProtagonist
      }
    });
  };

  const updateAntagonist = (newAntagonist: Partial<typeof parameters.antagonist>) => {
    updateParameters({
      antagonist: {
        name: parameters.antagonist?.name,
        type: parameters.antagonist?.type || '',
        motivation: parameters.antagonist?.motivation || '',
        characteristics: parameters.antagonist?.characteristics || [],
        ...newAntagonist
      }
    });
  };

  return (
    <GeneratorContainer>
      <ContentWrapper>
        <Title>✨ OpenStory Generator ✨</Title>
        
        <FormContainer>
          {/* Basic Story Settings */}
          <FormSection>
            <SectionTitle>📝 Impostazioni Base</SectionTitle>
            <FormGrid className="three-columns">
              <FormField>
                <Label>Genere</Label>
                <Select
                  value={parameters.genre || ''}
                  onChange={(e) => updateParameters({ genre: e.target.value })}
                  hasError={!!getFieldError('genre')}
                >
                  <option value="">Seleziona un genere...</option>
                  {genreOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
                {getFieldError('genre') && (
                  <ErrorMessage>⚠️ {getFieldError('genre')?.message}</ErrorMessage>
                )}
              </FormField>
              
              <FormField>
                <Label>Tono</Label>
                <Select
                  value={parameters.tone || ''}
                  onChange={(e) => updateParameters({ tone: e.target.value })}
                >
                  <option value="">Seleziona un tono...</option>
                  {toneOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </Select>
              </FormField>
              
              <FormField>
                <Label>Lunghezza della Storia</Label>
                <Select
                  value={parameters.length || ''}
                  onChange={(e) => updateParameters({ length: e.target.value })}
                >
                  <option value="">Seleziona lunghezza...</option>
                  {lengthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </FormGrid>
          </FormSection>

          {/* Setting */}
          <FormSection>
            <SectionTitle>🌍 Ambientazione</SectionTitle>
            <FormGrid className="two-columns">
              <FormField>
                <Label>Luogo</Label>
                <Input
                  type="text"
                  placeholder="es. Tokyo futuristica, piccolo paese italiano..."
                  value={parameters.setting?.place || ''}
                  onChange={(e) => updateSetting({ place: e.target.value })}
                  hasError={!!getFieldError('setting.place')}
                />
                {getFieldError('setting.place') && (
                  <ErrorMessage>⚠️ {getFieldError('setting.place')?.message}</ErrorMessage>
                )}
              </FormField>
              
              <FormField>
                <Label>Epoca</Label>
                <Select
                  value={parameters.setting?.time || ''}
                  onChange={(e) => updateSetting({ time: e.target.value })}
                >
                  <option value="">Seleziona un'epoca...</option>
                  <option value="ancient">⚔️ Antichità</option>
                  <option value="medieval">🏰 Medioevo</option>
                  <option value="renaissance">🎨 Rinascimento</option>
                  <option value="industrial">🏭 Era Industriale</option>
                  <option value="present">🌟 Presente</option>
                  <option value="near_future">🚀 Futuro Prossimo</option>
                  <option value="far_future">🌌 Futuro Remoto</option>
                </Select>
              </FormField>
            </FormGrid>
            
            <FormField>
              <Label>Descrizione Ambientazione</Label>
              <TextArea
                placeholder="Descrivi l'atmosfera e i dettagli dell'ambientazione..."
                value={parameters.setting?.description || ''}
                onChange={(e) => updateSetting({ description: e.target.value })}
              />
            </FormField>
          </FormSection>

          {/* Characters */}
          <FormSection>
            <SectionTitle>👤 Personaggi</SectionTitle>
            
            {/* Protagonist */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#ffd700', margin: 0 }}>Protagonista</h3>
              <ActionButton onClick={generateRandomProtagonist}>
                🎲 Genera Casuale
              </ActionButton>
            </div>
            <FormGrid className="three-columns">
              <FormField>
                <Label>Nome</Label>
                <Select
                  value={parameters.protagonist?.name || ''}
                  onChange={(e) => updateProtagonist({ name: e.target.value })}
                  hasError={!!getFieldError('protagonist.name')}
                >
                  <option value="">Seleziona un nome...</option>
                  {protagonistNameOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">✏️ Inserisci manualmente...</option>
                </Select>
                {parameters.protagonist?.name === 'custom' && (
                  <Input
                    type="text"
                    placeholder="Inserisci nome personalizzato"
                    style={{ marginTop: '0.5rem' }}
                    onChange={(e) => updateProtagonist({ name: e.target.value })}
                  />
                )}
                {getFieldError('protagonist.name') && (
                  <ErrorMessage>⚠️ {getFieldError('protagonist.name')?.message}</ErrorMessage>
                )}
              </FormField>
              
              <FormField>
                <Label>Tipo</Label>
                <Select
                  value={parameters.protagonist?.type || ''}
                  onChange={(e) => updateProtagonist({ type: e.target.value })}
                  hasError={!!getFieldError('protagonist.type')}
                >
                  <option value="">Seleziona un tipo...</option>
                  {protagonistTypeOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">✏️ Inserisci manualmente...</option>
                </Select>
                {parameters.protagonist?.type === 'custom' && (
                  <Input
                    type="text"
                    placeholder="es. Detective, Guerriero, Scienziato..."
                    style={{ marginTop: '0.5rem' }}
                    onChange={(e) => updateProtagonist({ type: e.target.value })}
                  />
                )}
                {getFieldError('protagonist.type') && (
                  <ErrorMessage>⚠️ {getFieldError('protagonist.type')?.message}</ErrorMessage>
                )}
              </FormField>
              
              <FormField>
                <Label>Obiettivo</Label>
                <Select
                  value={parameters.protagonist?.goal || ''}
                  onChange={(e) => updateProtagonist({ goal: e.target.value })}
                  hasError={!!getFieldError('protagonist.goal')}
                >
                  <option value="">Seleziona un obiettivo...</option>
                  {protagonistGoalOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">✏️ Inserisci manualmente...</option>
                </Select>
                {parameters.protagonist?.goal === 'custom' && (
                  <Input
                    type="text"
                    placeholder="Cosa vuole ottenere?"
                    style={{ marginTop: '0.5rem' }}
                    onChange={(e) => updateProtagonist({ goal: e.target.value })}
                  />
                )}
                {getFieldError('protagonist.goal') && (
                  <ErrorMessage>⚠️ {getFieldError('protagonist.goal')?.message}</ErrorMessage>
                )}
              </FormField>
            </FormGrid>
            
            {/* Antagonist */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1rem' }}>
              <h3 style={{ color: '#ffd700', margin: 0 }}>Antagonista</h3>
              <ActionButton onClick={generateRandomAntagonist}>
                🎲 Genera Casuale
              </ActionButton>
            </div>
            <FormGrid className="two-columns">
              <FormField>
                <Label>Tipo</Label>
                <Select
                  value={parameters.antagonist?.type || ''}
                  onChange={(e) => updateAntagonist({ type: e.target.value })}
                  hasError={!!getFieldError('antagonist.type')}
                >
                  <option value="">Seleziona un tipo...</option>
                  {antagonistTypeOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">✏️ Inserisci manualmente...</option>
                </Select>
                {parameters.antagonist?.type === 'custom' && (
                  <Input
                    type="text"
                    placeholder="es. Mago Oscuro, Alieno, Criminale..."
                    style={{ marginTop: '0.5rem' }}
                    onChange={(e) => updateAntagonist({ type: e.target.value })}
                  />
                )}
                {getFieldError('antagonist.type') && (
                  <ErrorMessage>⚠️ {getFieldError('antagonist.type')?.message}</ErrorMessage>
                )}
              </FormField>
              
              <FormField>
                <Label>Motivazione</Label>
                <Select
                  value={parameters.antagonist?.motivation || ''}
                  onChange={(e) => updateAntagonist({ motivation: e.target.value })}
                >
                  <option value="">Seleziona una motivazione...</option>
                  {antagonistMotivationOptions.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                  <option value="custom">✏️ Inserisci manualmente...</option>
                </Select>
                {parameters.antagonist?.motivation === 'custom' && (
                  <Input
                    type="text"
                    placeholder="Cosa lo spinge ad agire?"
                    style={{ marginTop: '0.5rem' }}
                    onChange={(e) => updateAntagonist({ motivation: e.target.value })}
                  />
                )}
              </FormField>
            </FormGrid>
          </FormSection>

          {/* Plot Elements */}
          <FormSection>
            <SectionTitle>📚 Elementi della Trama</SectionTitle>
            <CheckboxGrid>
              {plotElementOptions.map(element => (
                <CheckboxItem key={element}>
                  <Checkbox
                    checked={parameters.plotElements?.includes(element) || false}
                    onChange={(e) => handlePlotElementChange(element, e.target.checked)}
                  />
                  <span style={{ color: '#f5f5f5' }}>{element}</span>
                </CheckboxItem>
              ))}
            </CheckboxGrid>
            {getFieldError('plotElements') && (
              <ErrorMessage style={{ marginTop: '1rem' }}>
                ⚠️ {getFieldError('plotElements')?.message}
              </ErrorMessage>
            )}
          </FormSection>

          {/* Advanced Story Settings */}
          <FormSection>
            <SectionTitle>⚙️ Impostazioni Avanzate Storia</SectionTitle>
            <FormGrid className="two-columns">
              <FormField>
                <Label>Struttura Storia</Label>
                <Select
                  value={parameters.storyType || 'standard'}
                  onChange={(e) => updateParameters({ storyType: e.target.value })}
                >
                  {storySettingsOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>
              
              <FormField>
                <Label>Lunghezza e Dettaglio</Label>
                <Select
                  value={parameters.length || ''}
                  onChange={(e) => updateParameters({ length: e.target.value })}
                >
                  <option value="">Seleziona la lunghezza...</option>
                  {lengthOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </FormField>
            </FormGrid>
            
            <div style={{ marginTop: '1.5rem' }}>
              <Label style={{ marginBottom: '1rem' }}>🎯 Opzioni Specializzate</Label>
              <CheckboxGrid>
                <CheckboxItem>
                  <Checkbox
                    checked={parameters.includeDialogue !== false}
                    onChange={(e) => updateParameters({ includeDialogue: e.target.checked })}
                  />
                  <span style={{ color: '#f5f5f5' }}>💬 Includi dialoghi dettagliati</span>
                </CheckboxItem>
                
                <CheckboxItem>
                  <Checkbox
                    checked={parameters.focusOnAction || false}
                    onChange={(e) => updateParameters({ focusOnAction: e.target.checked })}
                  />
                  <span style={{ color: '#f5f5f5' }}>⚔️ Focus su azione e movimento</span>
                </CheckboxItem>
                
                <CheckboxItem>
                  <Checkbox
                    checked={parameters.emotionalDepth || false}
                    onChange={(e) => updateParameters({ emotionalDepth: e.target.checked })}
                  />
                  <span style={{ color: '#f5f5f5' }}>💝 Profondità emotiva dei personaggi</span>
                </CheckboxItem>
                
                <CheckboxItem>
                  <Checkbox
                    checked={parameters.worldBuilding || false}
                    onChange={(e) => updateParameters({ worldBuilding: e.target.checked })}
                  />
                  <span style={{ color: '#f5f5f5' }}>🌍 World-building dettagliato</span>
                </CheckboxItem>
                
                <CheckboxItem>
                  <Checkbox
                    checked={parameters.mysteryElements || false}
                    onChange={(e) => updateParameters({ mysteryElements: e.target.checked })}
                  />
                  <span style={{ color: '#f5f5f5' }}>🔍 Elementi di mistero e suspense</span>
                </CheckboxItem>
                
                <CheckboxItem>
                  <Checkbox
                    checked={parameters.cinematicStyle || false}
                    onChange={(e) => updateParameters({ cinematicStyle: e.target.checked })}
                  />
                  <span style={{ color: '#f5f5f5' }}>🎬 Stile cinematografico</span>
                </CheckboxItem>
              </CheckboxGrid>
            </div>
            
            {parameters.storyType === 'series_continuation' && (
              <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '10px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <Label>📖 Informazioni Serie (per continuazione)</Label>
                <TextArea
                  value={parameters.seriesContext || ''}
                  onChange={(e) => updateParameters({ seriesContext: e.target.value })}
                  placeholder="Descrivi brevemente cosa è successo negli episodi precedenti, personaggi principali e trama in corso..."
                  style={{ marginTop: '0.5rem' }}
                />
              </div>
            )}
          </FormSection>

          {/* Informazioni OpenRouter */}
          <FormSection>
            <SectionTitle>🌐 Generazione con OpenRouter</SectionTitle>
            <div style={{
              fontSize: '0.9rem',
              color: '#f5f5f5',
              padding: '1.5rem',
              background: 'rgba(0, 150, 255, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 150, 255, 0.3)'
            }}>
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#ffd700' }}>🚀 OpenStory utilizza OpenRouter per la generazione AI</strong>
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                • <strong>Qualità Premium:</strong> Accesso ai migliori modelli AI (GPT-4, Claude, Llama)
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                • <strong>Velocità:</strong> Generazione rapida e affidabile
              </div>
              <div style={{ marginBottom: '0.8rem' }}>
                • <strong>Configurazione:</strong> Richiede API key gratuita da openrouter.ai
              </div>
              <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255, 215, 0, 0.1)', borderRadius: '8px', border: '1px solid rgba(255, 215, 0, 0.3)' }}>
                <strong style={{ color: '#ffd700' }}>💡 Setup Veloce:</strong>
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  1. Vai su <strong>openrouter.ai/keys</strong><br/>
                  2. Crea account gratuito e ottieni API key<br/>
                  3. Crea file <strong>.env</strong> in openstory-app/<br/>
                  4. Aggiungi: <strong>REACT_APP_OPENROUTER_API_KEY=sk-or-v1-la_tua_chiave</strong><br/>
                  5. Riavvia l'app
                </div>
              </div>
            </div>
          </FormSection>

          <GenerateButton
            onClick={handleGenerate}
            disabled={!isFormValid || isGenerating}
          >
            {isGenerating ? '⏳ Generando...' : '✨ Genera la Mia Storia ✨'}
          </GenerateButton>
        </FormContainer>
      </ContentWrapper>
    </GeneratorContainer>
  );
};

export default OptimizedStoryGenerator; 