import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

interface ChapterTemplate {
  id: string;
  title: string;
  description: string;
}

interface NarrativeStructure {
  id: string;
  label: string;
  description: string;
  chapters: ChapterTemplate[];
}

interface NarrativeStructureSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onChaptersChange: (chapters: ChapterTemplate[]) => void;
}

// Lista di strutture narrative comuni
const NARRATIVE_STRUCTURES: NarrativeStructure[] = [
  {
    id: 'three-act',
    label: 'Struttura in Tre Atti',
    description: 'La classica struttura narrativa con inizio, svolgimento e conclusione.',
    chapters: [
      { id: 'act1', title: 'Atto I - Esposizione', description: 'Presentazione dei personaggi, dell\'ambientazione e del conflitto principale.' },
      { id: 'act2', title: 'Atto II - Confronto', description: 'Sviluppo del conflitto, ostacoli crescenti e momenti di crisi per il protagonista.' },
      { id: 'act3', title: 'Atto III - Risoluzione', description: 'Climax finale, risoluzione del conflitto e conclusione della storia.' }
    ]
  },
  {
    id: 'hero-journey',
    label: 'Viaggio dell\'Eroe',
    description: 'Una struttura in 12 fasi basata sul monomito di Joseph Campbell.',
    chapters: [
      { id: 'ordinary-world', title: 'Il Mondo Ordinario', description: 'Presentazione dell\'eroe nel suo ambiente quotidiano.' },
      { id: 'call-to-adventure', title: 'La Chiamata all\'Avventura', description: 'L\'eroe riceve una sfida o un invito al cambiamento.' },
      { id: 'refusal', title: 'Il Rifiuto della Chiamata', description: 'Iniziale esitazione o rifiuto dell\'eroe.' },
      { id: 'mentor', title: 'Incontro con il Mentore', description: 'Un saggio consigliere fornisce guida e motivazione.' },
      { id: 'threshold', title: 'Attraversamento della Soglia', description: 'L\'eroe lascia il mondo ordinario ed entra nel mondo dell\'avventura.' },
      { id: 'tests', title: 'Prove, Alleati e Nemici', description: 'L\'eroe affronta sfide, trova alleati e incontra nemici.' },
      { id: 'approach', title: 'Avvicinamento alla Caverna Più Profonda', description: 'Preparazione alla sfida principale.' },
      { id: 'ordeal', title: 'La Prova Centrale', description: 'La sfida più grande che porta a una "morte" simbolica e rinascita.' },
      { id: 'reward', title: 'La Ricompensa', description: 'L\'eroe ottiene ciò che cercava.' },
      { id: 'road-back', title: 'La Via del Ritorno', description: 'L\'eroe inizia il viaggio di ritorno al mondo ordinario.' },
      { id: 'resurrection', title: 'La Resurrezione', description: 'La sfida finale che dimostra la trasformazione dell\'eroe.' },
      { id: 'return', title: 'Ritorno con l\'Elisir', description: 'L\'eroe torna con qualcosa di prezioso per il suo mondo.' }
    ]
  },
  {
    id: 'five-act',
    label: 'Struttura in Cinque Atti',
    description: 'Struttura drammatica classica, spesso usata in opere teatrali.',
    chapters: [
      { id: 'exposition', title: 'Esposizione', description: 'Introduzione dei personaggi e dell\'ambientazione.' },
      { id: 'rising-action', title: 'Azione Crescente', description: 'Sviluppo del conflitto e complicazioni.' },
      { id: 'climax', title: 'Climax', description: 'Il punto di svolta principale della storia.' },
      { id: 'falling-action', title: 'Azione Calante', description: 'Le conseguenze del climax si dispiegano.' },
      { id: 'resolution', title: 'Risoluzione', description: 'Conclusione finale della storia.' }
    ]
  },
  {
    id: 'seven-point',
    label: 'Struttura a Sette Punti',
    description: 'Una struttura narrativa flessibile con sette elementi chiave.',
    chapters: [
      { id: 'hook', title: 'Gancio', description: 'Cattura l\'attenzione del pubblico e introduce il protagonista.' },
      { id: 'plot-turn-1', title: 'Svolta 1', description: 'Il protagonista decide di agire invece di reagire.' },
      { id: 'pinch-1', title: 'Pressione 1', description: 'Prima grande difficoltà che spinge il protagonista avanti.' },
      { id: 'midpoint', title: 'Punto Centrale', description: 'Cambiamento da reattivo a proattivo per il protagonista.' },
      { id: 'pinch-2', title: 'Pressione 2', description: 'Tutto sembra perduto, la situazione peggiora.' },
      { id: 'plot-turn-2', title: 'Svolta 2', description: 'Il protagonista ottiene gli strumenti finali per vincere.' },
      { id: 'resolution', title: 'Risoluzione', description: 'Confronto finale e conclusione.' }
    ]
  },
  {
    id: 'save-the-cat',
    label: 'Save the Cat',
    description: 'Popolare struttura per sceneggiature con 15 "battute" chiave.',
    chapters: [
      { id: 'opening-image', title: 'Immagine di Apertura', description: 'Prima impressione della storia e del mondo.' },
      { id: 'theme-stated', title: 'Tema Dichiarato', description: 'La tesi della storia viene suggerita.' },
      { id: 'setup', title: 'Setup', description: 'Introduzione ai personaggi e al mondo prima del cambiamento.' },
      { id: 'catalyst', title: 'Catalizzatore', description: 'Evento che mette in moto la storia.' },
      { id: 'debate', title: 'Dibattito', description: 'Il protagonista resiste al cambiamento.' },
      { id: 'break-into-2', title: 'Passaggio all\'Atto 2', description: 'Il protagonista decide di intraprendere un nuovo percorso.' },
      { id: 'b-story', title: 'Storia Secondaria', description: 'Introduzione di una sottotrama, spesso romantica.' },
      { id: 'fun-and-games', title: 'Divertimento e Giochi', description: 'La "promessa della premessa" viene realizzata.' },
      { id: 'midpoint', title: 'Punto Centrale', description: 'Una vittoria falsa o una sconfitta falsa.' },
      { id: 'bad-guys-close-in', title: 'I Cattivi si Avvicinano', description: 'La pressione aumenta, i nemici guadagnano terreno.' },
      { id: 'all-is-lost', title: 'Tutto è Perduto', description: 'Il momento più buio per il protagonista.' },
      { id: 'dark-night-of-soul', title: 'Notte Oscura dell\'Anima', description: 'La disperazione del protagonista raggiunge il culmine.' },
      { id: 'break-into-3', title: 'Passaggio all\'Atto 3', description: 'Una nuova idea o soluzione emerge.' },
      { id: 'finale', title: 'Finale', description: 'Il protagonista affronta il nemico e risolve il conflitto.' },
      { id: 'final-image', title: 'Immagine Finale', description: 'L\'opposto dell\'immagine di apertura, mostra il cambiamento.' }
    ]
  },
  {
    id: 'custom',
    label: 'Struttura Personalizzata',
    description: 'Crea la tua struttura narrativa personalizzata.',
    chapters: [
      { id: 'chapter-1', title: 'Capitolo 1', description: 'Primo capitolo della tua storia.' }
    ]
  }
];

// Stili
const FormSection = styled.div`
  margin-bottom: 2.5rem;
  background-color: #252525;
  border-radius: 8px;
  padding: 1.5rem;
`;

const SectionTitle = styled.h3`
  color: #ffd700;
  margin-top: 0;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #333;
  padding-bottom: 0.75rem;
  font-size: 1.2rem;
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
  margin-bottom: 1rem;
  
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
  margin-bottom: 1.5rem;
`;

const ChaptersContainer = styled.div`
  margin-top: 1.5rem;
`;

const ChaptersTitle = styled.h4`
  color: #f5f5f5;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const ChaptersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ChapterItem = styled.div`
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 1rem;
`;

const ChapterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const ChapterTitle = styled.h5`
  color: #ffd700;
  margin: 0;
  font-size: 1rem;
`;

const ChapterDescription = styled.p`
  color: #f5f5f5;
  font-size: 0.9rem;
  margin: 0;
`;

const EditableChaptersContainer = styled.div`
  margin-top: 1.5rem;
`;

const EditableChapterItem = styled.div`
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const ChapterForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
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
  
  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  background-color: #2c2c2c;
  color: #f5f5f5;
  border: 1px solid #444;
  font-size: 1rem;
  outline: none;
  min-height: 80px;
  resize: vertical;
  
  &:focus {
    border-color: #ffd700;
    box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.1);
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
`;

const AddButton = styled.button`
  background-color: #2c8a44;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #36a454;
  }
`;

const RemoveButton = styled.button`
  background-color: #8a2c2c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #a43636;
  }
`;

const MoveButton = styled.button`
  background-color: #444;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: #555;
  }
`;

const NarrativeStructureSelector: React.FC<NarrativeStructureSelectorProps> = ({ 
  value, 
  onChange,
  onChaptersChange
}) => {
  const [customChapters, setCustomChapters] = useState<ChapterTemplate[]>([]);
  
  // Trova la struttura narrativa selezionata
  const selectedStructure = NARRATIVE_STRUCTURES.find(structure => structure.id === value) || NARRATIVE_STRUCTURES[0];
  
  // Inizializza i capitoli quando cambia la struttura
  useEffect(() => {
    // Evitiamo aggiornamenti non necessari
    const currentChapters = value === 'custom' ? customChapters : selectedStructure?.chapters || [];
    const shouldInitializeCustom = value === 'custom' && customChapters.length === 0;
    
    if (shouldInitializeCustom) {
      const initialChapter = { 
        id: `chapter-${Date.now()}`, 
        title: 'Capitolo 1', 
        description: 'Primo capitolo della tua storia.' 
      };
      setCustomChapters([initialChapter]);
      onChaptersChange([initialChapter]);
    } else {
      onChaptersChange(currentChapters);
      if (value !== 'custom') {
        setCustomChapters([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, selectedStructure]);
  
  // Aggiorna i capitoli personalizzati quando vengono modificati
  useEffect(() => {
    // Aggiorniamo solo se siamo in modalità personalizzata e i capitoli sono cambiati
    if (value === 'custom') {
      onChaptersChange(customChapters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customChapters]);
  
  const handleStructureChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };
  
  const addChapter = () => {
    const newChapter: ChapterTemplate = {
      id: `chapter-${Date.now()}`,
      title: `Capitolo ${customChapters.length + 1}`,
      description: ''
    };
    
    setCustomChapters([...customChapters, newChapter]);
  };
  
  const removeChapter = (id: string) => {
    if (customChapters.length <= 1) return;
    setCustomChapters(customChapters.filter(chapter => chapter.id !== id));
  };
  
  const updateChapter = (id: string, field: keyof ChapterTemplate, value: string) => {
    setCustomChapters(
      customChapters.map(chapter => 
        chapter.id === id ? { ...chapter, [field]: value } : chapter
      )
    );
  };
  
  const moveChapter = (id: string, direction: 'up' | 'down') => {
    const index = customChapters.findIndex(chapter => chapter.id === id);
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === customChapters.length - 1)
    ) {
      return;
    }
    
    const newChapters = [...customChapters];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newChapters[index], newChapters[targetIndex]] = [newChapters[targetIndex], newChapters[index]];
    
    setCustomChapters(newChapters);
  };
  
  return (
    <FormSection>
      <SectionTitle>Struttura Narrativa</SectionTitle>
      
      <Select 
        value={value}
        onChange={handleStructureChange}
      >
        <option value="" disabled>Seleziona una struttura</option>
        {NARRATIVE_STRUCTURES.map((structure) => (
          <option key={structure.id} value={structure.id}>
            {structure.label}
          </option>
        ))}
      </Select>
      
      <Description>
        {selectedStructure?.description}
      </Description>
      
      {value === 'custom' ? (
        <EditableChaptersContainer>
          <ChaptersTitle>I Tuoi Capitoli</ChaptersTitle>
          
          {customChapters.map((chapter, index) => (
            <EditableChapterItem key={chapter.id}>
              <ChapterForm>
                <Input
                  type="text"
                  value={chapter.title}
                  onChange={(e) => updateChapter(chapter.id, 'title', e.target.value)}
                  placeholder="Titolo del capitolo"
                  required
                />
                
                <Textarea
                  value={chapter.description}
                  onChange={(e) => updateChapter(chapter.id, 'description', e.target.value)}
                  placeholder="Descrizione o note sul capitolo"
                />
                
                <ButtonsContainer>
                  <MoveButton 
                    onClick={() => moveChapter(chapter.id, 'up')}
                    disabled={index === 0}
                    style={{ opacity: index === 0 ? 0.5 : 1 }}
                  >
                    ↑
                  </MoveButton>
                  
                  <MoveButton 
                    onClick={() => moveChapter(chapter.id, 'down')}
                    disabled={index === customChapters.length - 1}
                    style={{ opacity: index === customChapters.length - 1 ? 0.5 : 1 }}
                  >
                    ↓
                  </MoveButton>
                  
                  <RemoveButton 
                    onClick={() => removeChapter(chapter.id)}
                    disabled={customChapters.length <= 1}
                  >
                    Rimuovi
                  </RemoveButton>
                </ButtonsContainer>
              </ChapterForm>
            </EditableChapterItem>
          ))}
          
          <AddButton onClick={addChapter}>
            Aggiungi Capitolo
          </AddButton>
        </EditableChaptersContainer>
      ) : (
        <ChaptersContainer>
          <ChaptersTitle>Capitoli</ChaptersTitle>
          
          <ChaptersList>
            {selectedStructure?.chapters.map((chapter) => (
              <ChapterItem key={chapter.id}>
                <ChapterHeader>
                  <ChapterTitle>{chapter.title}</ChapterTitle>
                </ChapterHeader>
                <ChapterDescription>{chapter.description}</ChapterDescription>
              </ChapterItem>
            ))}
          </ChaptersList>
        </ChaptersContainer>
      )}
    </FormSection>
  );
};

export default NarrativeStructureSelector; 
 