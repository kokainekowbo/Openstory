# Interfaccia Utente - OpenStory

Questo documento descrive l'architettura dell'interfaccia utente di OpenStory, i componenti React principali e la struttura delle pagine.

## Principi di Design

1. **Semplicità**: Interfaccia pulita e intuitiva che si concentra sulla generazione di storie
2. **Feedback immediato**: Visualizzazione in tempo reale delle scelte dell'utente
3. **Personalizzazione progressiva**: Mostrare opzioni avanzate solo quando necessario
4. **Estetica cinematografica**: Ispirazione visiva dal mondo del cinema e della narrativa
5. **Responsività**: Esperienza ottimale su tutti i dispositivi

## Struttura delle Pagine

### 1. Home / Landing Page

- Introduzione all'app
- Call-to-action principale ("Crea la tua storia")
- Esempi di storie generate
- Spiegazione del funzionamento

### 2. Pagina di Generazione Storia

- Form principale con tutte le opzioni di personalizzazione
- Anteprima in tempo reale delle selezioni
- Pulsante di generazione
- Area di visualizzazione della storia generata

### 3. Libreria Storie (per utenti registrati)

- Elenco delle storie salvate
- Funzionalità di filtro e ricerca
- Opzioni di modifica e cancellazione
- Funzionalità di esportazione

### 4. Profilo Utente (per utenti registrati)

- Informazioni account
- Statistiche di utilizzo
- Gestione abbonamento (se applicabile)
- Preferenze di generazione predefinite

## Componenti React

### Layout

```jsx
// Layout.tsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
```

### Form di Generazione Storia

```jsx
// StoryGeneratorForm.tsx
import React, { useState } from 'react';
import GenreSelector from './form-components/GenreSelector';
import ToneSelector from './form-components/ToneSelector';
import SettingSelector from './form-components/SettingSelector';
import CharacterBuilder from './form-components/CharacterBuilder';
import PlotElementsSelector from './form-components/PlotElementsSelector';
import NarrativeStructureSelector from './form-components/NarrativeStructureSelector';
import LengthSelector from './form-components/LengthSelector';

interface StoryParameters {
  genre: string;
  tone: string;
  setting: {
    time: string;
    place: string;
    description: string;
  };
  protagonist: {
    type: string;
    goal: string;
    characteristics: string[];
  };
  antagonist: {
    type: string;
    motivation: string;
    characteristics: string[];
  };
  plotElements: string[];
  narrativeStructure: string;
  length: string;
}

interface StoryGeneratorFormProps {
  onGenerate: (parameters: StoryParameters) => void;
  isGenerating: boolean;
}

const StoryGeneratorForm: React.FC<StoryGeneratorFormProps> = ({ 
  onGenerate, 
  isGenerating 
}) => {
  const [parameters, setParameters] = useState<StoryParameters>({
    genre: '',
    tone: '',
    setting: { time: '', place: '', description: '' },
    protagonist: { type: '', goal: '', characteristics: [] },
    antagonist: { type: '', motivation: '', characteristics: [] },
    plotElements: [],
    narrativeStructure: '',
    length: 'synopsis'
  });

  const updateParameters = (key: string, value: any) => {
    setParameters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(parameters);
  };

  return (
    <form onSubmit={handleSubmit} className="generator-form">
      <div className="form-section">
        <h3>Elementi Fondamentali</h3>
        <div className="form-row">
          <GenreSelector
            value={parameters.genre}
            onChange={(value) => updateParameters('genre', value)}
          />
          <ToneSelector
            value={parameters.tone}
            onChange={(value) => updateParameters('tone', value)}
          />
        </div>
        
        <SettingSelector
          value={parameters.setting}
          onChange={(value) => updateParameters('setting', value)}
        />
      </div>

      <div className="form-section">
        <h3>Personaggi</h3>
        <CharacterBuilder
          type="protagonist"
          value={parameters.protagonist}
          onChange={(value) => updateParameters('protagonist', value)}
        />
        
        <CharacterBuilder
          type="antagonist"
          value={parameters.antagonist}
          onChange={(value) => updateParameters('antagonist', value)}
        />
      </div>

      <div className="form-section">
        <h3>Struttura Narrativa</h3>
        <PlotElementsSelector
          value={parameters.plotElements}
          onChange={(value) => updateParameters('plotElements', value)}
        />
        
        <NarrativeStructureSelector
          value={parameters.narrativeStructure}
          onChange={(value) => updateParameters('narrativeStructure', value)}
        />
      </div>

      <div className="form-section">
        <h3>Output</h3>
        <LengthSelector
          value={parameters.length}
          onChange={(value) => updateParameters('length', value)}
        />
      </div>

      <div className="form-actions">
        <button 
          type="submit" 
          className="generate-button"
          disabled={isGenerating}
        >
          {isGenerating ? 'Generando...' : 'Genera Storia'}
        </button>
      </div>
    </form>
  );
};

export default StoryGeneratorForm;
```

### Visualizzatore Storia

```jsx
// StoryViewer.tsx
import React from 'react';

interface StoryViewerProps {
  content: string;
  isLoading: boolean;
  error?: string;
  onSave?: () => void;
  onExport?: () => void;
  onRegenerate?: () => void;
}

const StoryViewer: React.FC<StoryViewerProps> = ({
  content,
  isLoading,
  error,
  onSave,
  onExport,
  onRegenerate
}) => {
  if (isLoading) {
    return (
      <div className="story-viewer loading">
        <div className="loader">
          <span>Creando il tuo capolavoro...</span>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="story-viewer error">
        <h3>Ops! Qualcosa è andato storto</h3>
        <p>{error}</p>
        <button onClick={onRegenerate}>Riprova</button>
      </div>
    );
  }

  if (!content) {
    return (
      <div className="story-viewer empty">
        <p>La tua storia apparirà qui dopo la generazione</p>
      </div>
    );
  }

  return (
    <div className="story-viewer">
      <div className="story-content">
        {content.split('\n').map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      
      <div className="story-actions">
        {onSave && (
          <button onClick={onSave} className="save-button">
            Salva Storia
          </button>
        )}
        
        {onExport && (
          <button onClick={onExport} className="export-button">
            Esporta
          </button>
        )}
        
        {onRegenerate && (
          <button onClick={onRegenerate} className="regenerate-button">
            Rigenera
          </button>
        )}
      </div>
    </div>
  );
};

export default StoryViewer;
```

## Selettori di Opzioni

Per ogni elemento della storia (genere, tono, ambientazione, ecc.), creeremo componenti riutilizzabili:

### Esempio: GenreSelector

```jsx
// GenreSelector.tsx
import React from 'react';

interface GenreSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const GENRES = [
  { id: 'action', label: 'Azione' },
  { id: 'comedy', label: 'Commedia' },
  { id: 'drama', label: 'Dramma' },
  { id: 'sci-fi', label: 'Fantascienza' },
  { id: 'fantasy', label: 'Fantasy' },
  { id: 'thriller', label: 'Thriller' },
  { id: 'horror', label: 'Horror' },
  { id: 'romance', label: 'Romantico' },
  { id: 'mystery', label: 'Mistero' },
  { id: 'adventure', label: 'Avventura' },
  { id: 'western', label: 'Western' },
  { id: 'noir', label: 'Noir' }
];

const GenreSelector: React.FC<GenreSelectorProps> = ({ value, onChange }) => {
  return (
    <div className="form-field genre-selector">
      <label htmlFor="genre">Genere</label>
      <select 
        id="genre" 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        required
      >
        <option value="" disabled>Seleziona un genere</option>
        {GENRES.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.label}
          </option>
        ))}
      </select>
      <p className="field-description">
        Il genere determinerà il tono generale e le convenzioni della tua storia.
      </p>
    </div>
  );
};

export default GenreSelector;
```

## Pagina Principale

```jsx
// GeneratorPage.tsx
import React, { useState } from 'react';
import Layout from '../components/Layout';
import StoryGeneratorForm from '../components/StoryGeneratorForm';
import StoryViewer from '../components/StoryViewer';
import { generateStory } from '../api/storyApi';

const GeneratorPage: React.FC = () => {
  const [storyContent, setStoryContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (parameters) => {
    setIsGenerating(true);
    setError('');
    
    try {
      const response = await generateStory(parameters);
      setStoryContent(response.content);
    } catch (err) {
      setError('Si è verificato un errore durante la generazione della storia. Riprova più tardi.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    // Implementazione del salvataggio
  };

  const handleExport = () => {
    // Implementazione dell'esportazione
  };

  const handleRegenerate = () => {
    // Implementazione della rigenerazione
  };

  return (
    <Layout>
      <div className="generator-container">
        <div className="generator-header">
          <h1>Generatore di Storie</h1>
          <p>Crea la tua storia unica in stile Hollywood in pochi click</p>
        </div>
        
        <div className="generator-content">
          <div className="generator-form-container">
            <StoryGeneratorForm 
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
          
          <div className="generator-output-container">
            <StoryViewer
              content={storyContent}
              isLoading={isGenerating}
              error={error}
              onSave={handleSave}
              onExport={handleExport}
              onRegenerate={handleRegenerate}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GeneratorPage;
```

## Responsive Design

L'interfaccia sarà progettata con un approccio mobile-first, usando media queries per adattarsi a diverse dimensioni dello schermo:

```css
/* Estratto da styles/generator.css */

.generator-content {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .generator-content {
    flex-direction: row;
  }
  
  .generator-form-container {
    width: 50%;
    padding-right: 1rem;
  }
  
  .generator-output-container {
    width: 50%;
    padding-left: 1rem;
  }
}

@media (min-width: 1200px) {
  .generator-form-container {
    width: 40%;
  }
  
  .generator-output-container {
    width: 60%;
  }
}
```

## Tema e Stile

L'interfaccia utilizzerà un tema ispirato al cinema con:

- Palette di colori scuri con accenti dorati
- Tipografia ispirata ai titoli cinematografici
- Transizioni ed effetti che richiamano l'esperienza cinematografica
- Icone e elementi visivi legati alla narrazione e al cinema 