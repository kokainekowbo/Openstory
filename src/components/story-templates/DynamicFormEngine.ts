// 🎛️ MOTORE FORM DINAMICO - OPENSTORY
// Struttura le impostazioni in base al genere per garantire storie corrette

export interface DynamicOption {
  value: string;
  label: string;
  description?: string;
  recommended?: boolean;
  compatibility: number; // 0-100 compatibilità con il genere
}

export interface DynamicField {
  field: string;
  label: string;
  type: 'select' | 'multiselect' | 'textarea';
  options: DynamicOption[];
  required: boolean;
  helpText?: string;
  autoSelect?: string; // Valore da selezionare automaticamente
}

export interface GenreFormStructure {
  genre: string;
  displayName: string;
  description: string;
  icon: string;
  fields: DynamicField[];
  recommendedSettings: Record<string, string>;
  incompatibleSettings: string[];
}

// 📚 STRUTTURE FORM PER GENERE
export const GENRE_FORM_STRUCTURES: Record<string, GenreFormStructure> = {
  'action_thriller': {
    genre: 'action_thriller',
    displayName: 'Action/Thriller',
    description: 'Storie ad alta tensione con azione, suspense e ritmo incalzante',
    icon: '💥',
    fields: [
      {
        field: 'tone',
        label: 'Tono Narrativo',
        type: 'select',
        required: true,
        helpText: 'Il tono determina l\'atmosfera generale della storia',
        options: [
          { value: 'intense', label: 'Intenso e Drammatico', compatibility: 95, recommended: true },
          { value: 'gritty', label: 'Crudo e Realistico', compatibility: 90 },
          { value: 'suspenseful', label: 'Pieno di Suspense', compatibility: 85 },
          { value: 'epic', label: 'Epico e Grandioso', compatibility: 80 },
          { value: 'dark', label: 'Cupo e Misterioso', compatibility: 70 },
          { value: 'light', label: 'Leggero e Ottimista', compatibility: 30 }
        ],
        autoSelect: 'intense'
      },
      {
        field: 'length',
        label: 'Lunghezza Storia',
        type: 'select',
        required: true,
        helpText: 'Action/Thriller funziona meglio con ritmo serrato',
        options: [
          { value: 'medium', label: 'Media (3000-4500 parole)', compatibility: 95, recommended: true },
          { value: 'long', label: 'Lunga (4500-6000 parole)', compatibility: 85 },
          { value: 'short', label: 'Breve (2000-3000 parole)', compatibility: 70 },
          { value: 'epic', label: 'Epica (6000-8000 parole)', compatibility: 60 }
        ],
        autoSelect: 'medium'
      },
      {
        field: 'narrativeStyle',
        label: 'Stile Narrativo',
        type: 'select',
        required: true,
        helpText: 'Lo stile influenza il coinvolgimento del lettore',
        options: [
          { value: 'third_person', label: 'Terza Persona (Cinematografico)', compatibility: 95, recommended: true },
          { value: 'first_person', label: 'Prima Persona (Immersivo)', compatibility: 80 },
          { value: 'multiple_pov', label: 'Punti di Vista Multipli', compatibility: 70 },
          { value: 'omniscient', label: 'Narratore Onnisciente', compatibility: 50 }
        ],
        autoSelect: 'third_person'
      },
      {
        field: 'writingStyle',
        label: 'Stile di Scrittura',
        type: 'select',
        required: true,
        options: [
          { value: 'cinematic', label: 'Cinematografico (Visuale)', compatibility: 95, recommended: true },
          { value: 'commercial', label: 'Commerciale (Bestseller)', compatibility: 90 },
          { value: 'pulp', label: 'Pulp (Azione e Ritmo)', compatibility: 85 },
          { value: 'hardboiled', label: 'Hard-boiled (Crudo)', compatibility: 80 }
        ],
        autoSelect: 'cinematic'
      },
      {
        field: 'timeperiod',
        label: 'Periodo Temporale',
        type: 'select',
        required: true,
        options: [
          { value: 'contemporary', label: 'Contemporaneo', compatibility: 95, recommended: true },
          { value: 'near_future', label: 'Futuro Prossimo', compatibility: 85 },
          { value: 'early_20th', label: 'Inizio XX Secolo', compatibility: 70 },
          { value: '19th_century', label: 'XIX Secolo', compatibility: 50 }
        ],
        autoSelect: 'contemporary'
      },
      {
        field: 'atmosphere',
        label: 'Atmosfera',
        type: 'select',
        required: true,
        options: [
          { value: 'urban_noir', label: 'Urban Noir', compatibility: 90, recommended: true },
          { value: 'military_action', label: 'Azione Militare', compatibility: 95 },
          { value: 'corporate_thriller', label: 'Thriller Aziendale', compatibility: 85 },
          { value: 'futuristic_tech', label: 'Tecnologico Futuristico', compatibility: 80 }
        ],
        autoSelect: 'military_action'
      }
    ],
    recommendedSettings: {
      tone: 'intense',
      length: 'medium',
      narrativeStyle: 'third_person',
      writingStyle: 'cinematic',
      timeperiod: 'contemporary',
      atmosphere: 'military_action'
    },
    incompatibleSettings: ['light', 'romantic_tension', 'cozy_mystery']
  },

  'crime_noir': {
    genre: 'crime_noir',
    displayName: 'Crime Noir',
    description: 'Storie criminali atmosferiche con detective tormentati e misteri urbani',
    icon: '🕵️',
    fields: [
      {
        field: 'tone',
        label: 'Tono Narrativo',
        type: 'select',
        required: true,
        options: [
          { value: 'dark', label: 'Cupo e Misterioso', compatibility: 95, recommended: true },
          { value: 'melancholic', label: 'Malinconico e Riflessivo', compatibility: 90 },
          { value: 'gritty', label: 'Crudo e Realistico', compatibility: 85 },
          { value: 'suspenseful', label: 'Pieno di Suspense', compatibility: 80 }
        ],
        autoSelect: 'dark'
      },
      {
        field: 'length',
        label: 'Lunghezza Storia',
        type: 'select',
        required: true,
        options: [
          { value: 'medium', label: 'Media (3000-4500 parole)', compatibility: 90, recommended: true },
          { value: 'long', label: 'Lunga (4500-6000 parole)', compatibility: 95 },
          { value: 'short', label: 'Breve (2000-3000 parole)', compatibility: 70 }
        ],
        autoSelect: 'medium'
      },
      {
        field: 'narrativeStyle',
        label: 'Stile Narrativo',
        type: 'select',
        required: true,
        options: [
          { value: 'first_person', label: 'Prima Persona (Detective)', compatibility: 95, recommended: true },
          { value: 'third_person', label: 'Terza Persona', compatibility: 85 },
          { value: 'multiple_pov', label: 'Punti di Vista Multipli', compatibility: 75 }
        ],
        autoSelect: 'first_person'
      },
      {
        field: 'writingStyle',
        label: 'Stile di Scrittura',
        type: 'select',
        required: true,
        options: [
          { value: 'noir', label: 'Noir (Oscuro e Stilizzato)', compatibility: 95, recommended: true },
          { value: 'hardboiled', label: 'Hard-boiled (Crudo e Diretto)', compatibility: 90 },
          { value: 'literary', label: 'Letterario', compatibility: 80 },
          { value: 'commercial', label: 'Commerciale', compatibility: 70 }
        ],
        autoSelect: 'noir'
      },
      {
        field: 'timeperiod',
        label: 'Periodo Temporale',
        type: 'select',
        required: true,
        options: [
          { value: 'contemporary', label: 'Contemporaneo', compatibility: 90, recommended: true },
          { value: 'early_20th', label: 'Inizio XX Secolo', compatibility: 95 },
          { value: '19th_century', label: 'XIX Secolo', compatibility: 80 }
        ],
        autoSelect: 'contemporary'
      },
      {
        field: 'atmosphere',
        label: 'Atmosfera',
        type: 'select',
        required: true,
        options: [
          { value: 'urban_noir', label: 'Urban Noir', compatibility: 95, recommended: true },
          { value: 'gritty_realistic', label: 'Crudo Realistico', compatibility: 90 },
          { value: 'gothic_horror', label: 'Gotico Oscuro', compatibility: 75 }
        ],
        autoSelect: 'urban_noir'
      }
    ],
    recommendedSettings: {
      tone: 'dark',
      length: 'medium',
      narrativeStyle: 'first_person',
      writingStyle: 'noir',
      timeperiod: 'contemporary',
      atmosphere: 'urban_noir'
    },
    incompatibleSettings: ['light', 'humorous', 'romantic_tension']
  },

  'fantasy': {
    genre: 'fantasy',
    displayName: 'Fantasy',
    description: 'Mondi magici con eroi, creature fantastiche e avventure epiche',
    icon: '🧙‍♂️',
    fields: [
      {
        field: 'tone',
        label: 'Tono Narrativo',
        type: 'select',
        required: true,
        options: [
          { value: 'epic', label: 'Epico e Grandioso', compatibility: 95, recommended: true },
          { value: 'adventure', label: 'Avventuroso', compatibility: 90 },
          { value: 'mystical', label: 'Mistico e Magico', compatibility: 85 },
          { value: 'dark', label: 'Dark Fantasy', compatibility: 80 }
        ],
        autoSelect: 'epic'
      },
      {
        field: 'length',
        label: 'Lunghezza Storia',
        type: 'select',
        required: true,
        options: [
          { value: 'long', label: 'Lunga (4500-6000 parole)', compatibility: 95, recommended: true },
          { value: 'epic', label: 'Epica (6000-8000 parole)', compatibility: 90 },
          { value: 'medium', label: 'Media (3000-4500 parole)', compatibility: 75 }
        ],
        autoSelect: 'long'
      },
      {
        field: 'narrativeStyle',
        label: 'Stile Narrativo',
        type: 'select',
        required: true,
        options: [
          { value: 'third_person', label: 'Terza Persona (Epico)', compatibility: 95, recommended: true },
          { value: 'omniscient', label: 'Narratore Onnisciente', compatibility: 90 },
          { value: 'multiple_pov', label: 'Punti di Vista Multipli', compatibility: 85 }
        ],
        autoSelect: 'third_person'
      },
      {
        field: 'writingStyle',
        label: 'Stile di Scrittura',
        type: 'select',
        required: true,
        options: [
          { value: 'epic', label: 'Epico (Alta Fantasia)', compatibility: 95, recommended: true },
          { value: 'descriptive', label: 'Descrittivo (Ricco di Dettagli)', compatibility: 90 },
          { value: 'literary', label: 'Letterario', compatibility: 80 }
        ],
        autoSelect: 'epic'
      },
      {
        field: 'timeperiod',
        label: 'Periodo Temporale',
        type: 'select',
        required: true,
        options: [
          { value: 'medieval', label: 'Medievale', compatibility: 95, recommended: true },
          { value: 'ancient', label: 'Antico', compatibility: 90 },
          { value: 'renaissance', label: 'Rinascimento', compatibility: 80 }
        ],
        autoSelect: 'medieval'
      },
      {
        field: 'atmosphere',
        label: 'Atmosfera',
        type: 'select',
        required: true,
        options: [
          { value: 'magical_realms', label: 'Regni Magici', compatibility: 95, recommended: true },
          { value: 'epic_adventure', label: 'Avventura Epica', compatibility: 90 },
          { value: 'mystical_forest', label: 'Foreste Mistiche', compatibility: 85 }
        ],
        autoSelect: 'magical_realms'
      }
    ],
    recommendedSettings: {
      tone: 'epic',
      length: 'long',
      narrativeStyle: 'third_person',
      writingStyle: 'epic',
      timeperiod: 'medieval',
      atmosphere: 'magical_realms'
    },
    incompatibleSettings: ['contemporary', 'urban_noir', 'corporate_thriller']
  },

  'horror': {
    genre: 'horror',
    displayName: 'Horror',
    description: 'Storie che esplorano la paura, il soprannaturale e l\'ignoto',
    icon: '👻',
    fields: [
      {
        field: 'tone',
        label: 'Tono Narrativo',
        type: 'select',
        required: true,
        options: [
          { value: 'dark', label: 'Cupo e Misterioso', compatibility: 95, recommended: true },
          { value: 'suspenseful', label: 'Pieno di Suspense', compatibility: 90 },
          { value: 'psychological', label: 'Psicologico', compatibility: 85 },
          { value: 'gothic', label: 'Gotico', compatibility: 80 }
        ],
        autoSelect: 'dark'
      },
      {
        field: 'length',
        label: 'Lunghezza Storia',
        type: 'select',
        required: true,
        options: [
          { value: 'medium', label: 'Media (3000-4500 parole)', compatibility: 95, recommended: true },
          { value: 'short', label: 'Breve (2000-3000 parole)', compatibility: 90 },
          { value: 'long', label: 'Lunga (4500-6000 parole)', compatibility: 80 }
        ],
        autoSelect: 'medium'
      },
      {
        field: 'narrativeStyle',
        label: 'Stile Narrativo',
        type: 'select',
        required: true,
        options: [
          { value: 'first_person', label: 'Prima Persona (Immersivo)', compatibility: 95, recommended: true },
          { value: 'third_person', label: 'Terza Persona', compatibility: 85 },
          { value: 'stream_consciousness', label: 'Flusso di Coscienza', compatibility: 80 }
        ],
        autoSelect: 'first_person'
      },
      {
        field: 'writingStyle',
        label: 'Stile di Scrittura',
        type: 'select',
        required: true,
        options: [
          { value: 'gothic', label: 'Gotico (Atmosferico)', compatibility: 95, recommended: true },
          { value: 'psychological', label: 'Psicologico', compatibility: 90 },
          { value: 'literary', label: 'Letterario', compatibility: 80 }
        ],
        autoSelect: 'gothic'
      },
      {
        field: 'atmosphere',
        label: 'Atmosfera',
        type: 'select',
        required: true,
        options: [
          { value: 'supernatural_dark', label: 'Soprannaturale Oscuro', compatibility: 95, recommended: true },
          { value: 'gothic_horror', label: 'Horror Gotico', compatibility: 90 },
          { value: 'psychological_mind', label: 'Psicologico Mentale', compatibility: 85 }
        ],
        autoSelect: 'supernatural_dark'
      }
    ],
    recommendedSettings: {
      tone: 'dark',
      length: 'medium',
      narrativeStyle: 'first_person',
      writingStyle: 'gothic',
      atmosphere: 'supernatural_dark'
    },
    incompatibleSettings: ['light', 'humorous', 'romantic_tension']
  },

  'romantic_comedy': {
    genre: 'romantic_comedy',
    displayName: 'Commedia Romantica',
    description: 'Storie d\'amore leggere con umorismo e lieto fine',
    icon: '💕',
    fields: [
      {
        field: 'tone',
        label: 'Tono Narrativo',
        type: 'select',
        required: true,
        options: [
          { value: 'light', label: 'Leggero e Ottimista', compatibility: 95, recommended: true },
          { value: 'humorous', label: 'Spiritoso e Ironico', compatibility: 90 },
          { value: 'romantic', label: 'Romantico e Passionale', compatibility: 85 },
          { value: 'intimate', label: 'Intimo e Personale', compatibility: 80 }
        ],
        autoSelect: 'light'
      },
      {
        field: 'length',
        label: 'Lunghezza Storia',
        type: 'select',
        required: true,
        options: [
          { value: 'medium', label: 'Media (3000-4500 parole)', compatibility: 95, recommended: true },
          { value: 'short', label: 'Breve (2000-3000 parole)', compatibility: 85 },
          { value: 'long', label: 'Lunga (4500-6000 parole)', compatibility: 80 }
        ],
        autoSelect: 'medium'
      },
      {
        field: 'narrativeStyle',
        label: 'Stile Narrativo',
        type: 'select',
        required: true,
        options: [
          { value: 'third_person', label: 'Terza Persona', compatibility: 90, recommended: true },
          { value: 'multiple_pov', label: 'Punti di Vista Multipli', compatibility: 95 },
          { value: 'first_person', label: 'Prima Persona', compatibility: 80 }
        ],
        autoSelect: 'multiple_pov'
      },
      {
        field: 'writingStyle',
        label: 'Stile di Scrittura',
        type: 'select',
        required: true,
        options: [
          { value: 'commercial', label: 'Commerciale (Accessibile)', compatibility: 95, recommended: true },
          { value: 'popular', label: 'Popolare', compatibility: 90 },
          { value: 'cinematic', label: 'Cinematografico', compatibility: 85 }
        ],
        autoSelect: 'commercial'
      },
      {
        field: 'atmosphere',
        label: 'Atmosfera',
        type: 'select',
        required: true,
        options: [
          { value: 'romantic_tension', label: 'Tensione Romantica', compatibility: 95, recommended: true },
          { value: 'cozy_mystery', label: 'Accogliente e Intima', compatibility: 90 },
          { value: 'tropical_paradise', label: 'Paradiso Tropicale', compatibility: 85 }
        ],
        autoSelect: 'romantic_tension'
      }
    ],
    recommendedSettings: {
      tone: 'light',
      length: 'medium',
      narrativeStyle: 'multiple_pov',
      writingStyle: 'commercial',
      atmosphere: 'romantic_tension'
    },
    incompatibleSettings: ['dark', 'gritty', 'horror', 'supernatural_dark']
  }
};

// 🎛️ MOTORE FORM DINAMICO
export class DynamicFormEngine {
  
  /**
   * Ottiene la struttura del form per un genere specifico
   */
  static getFormStructure(genre: string): GenreFormStructure | null {
    const normalizedGenre = genre.toLowerCase().replace(/[^a-z]/g, '_');
    return GENRE_FORM_STRUCTURES[normalizedGenre] || null;
  }

  /**
   * Ottiene tutte le strutture disponibili
   */
  static getAllGenreStructures(): GenreFormStructure[] {
    return Object.values(GENRE_FORM_STRUCTURES);
  }

  /**
   * Applica automaticamente le impostazioni raccomandate per un genere
   */
  static getRecommendedSettings(genre: string): Record<string, string> {
    const structure = this.getFormStructure(genre);
    return structure?.recommendedSettings || {};
  }

  /**
   * Verifica la compatibilità di un'impostazione con il genere
   */
  static checkCompatibility(genre: string, field: string, value: string): {
    compatible: boolean;
    compatibility: number;
    suggestion?: string;
  } {
    const structure = this.getFormStructure(genre);
    if (!structure) {
      return { compatible: true, compatibility: 50 };
    }

    // Verifica se è nelle impostazioni incompatibili
    if (structure.incompatibleSettings.includes(value)) {
      return {
        compatible: false,
        compatibility: 0,
        suggestion: `"${value}" non è compatibile con ${structure.displayName}. Prova: ${Object.values(structure.recommendedSettings).join(', ')}`
      };
    }

    // Trova il campo e l'opzione
    const fieldConfig = structure.fields.find(f => f.field === field);
    if (!fieldConfig) {
      return { compatible: true, compatibility: 50 };
    }

    const option = fieldConfig.options.find(opt => opt.value === value);
    if (!option) {
      return { compatible: true, compatibility: 50 };
    }

    return {
      compatible: option.compatibility >= 60,
      compatibility: option.compatibility,
      suggestion: option.compatibility < 60 ? 
        `Considera opzioni più compatibili per ${structure.displayName}` : undefined
    };
  }

  /**
   * Ottiene suggerimenti per migliorare la compatibilità
   */
  static getSuggestions(genre: string, currentSettings: Record<string, string>): {
    score: number;
    suggestions: string[];
    warnings: string[];
  } {
    const structure = this.getFormStructure(genre);
    if (!structure) {
      return { score: 50, suggestions: [], warnings: [] };
    }

    const suggestions: string[] = [];
    const warnings: string[] = [];
    let totalScore = 0;
    let fieldCount = 0;

    // Analizza ogni campo
    structure.fields.forEach(field => {
      const currentValue = currentSettings[field.field];
      if (currentValue) {
        const compatibility = this.checkCompatibility(genre, field.field, currentValue);
        totalScore += compatibility.compatibility;
        fieldCount++;

        if (compatibility.compatibility < 60) {
          warnings.push(`${field.label}: "${currentValue}" ha bassa compatibilità (${compatibility.compatibility}%)`);
        }

        if (compatibility.suggestion) {
          suggestions.push(compatibility.suggestion);
        }
      }

      // Suggerisci impostazione raccomandata se non impostata
      if (!currentValue && field.autoSelect) {
        suggestions.push(`Imposta ${field.label} su "${field.autoSelect}" (raccomandato per ${structure.displayName})`);
      }
    });

    const averageScore = fieldCount > 0 ? Math.round(totalScore / fieldCount) : 50;

    return {
      score: averageScore,
      suggestions,
      warnings
    };
  }

  /**
   * Ottiene le opzioni filtrate per un campo basate sul genere
   */
  static getFilteredOptions(genre: string, field: string): DynamicOption[] {
    const structure = this.getFormStructure(genre);
    if (!structure) return [];

    const fieldConfig = structure.fields.find(f => f.field === field);
    if (!fieldConfig) return [];

    // Ordina per compatibilità (più compatibili prima)
    return fieldConfig.options.sort((a, b) => b.compatibility - a.compatibility);
  }

  /**
   * Valida tutte le impostazioni per un genere
   */
  static validateSettings(genre: string, settings: Record<string, string>): {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    score: number;
  } {
    const structure = this.getFormStructure(genre);
    if (!structure) {
      return { isValid: false, errors: ['Genere non riconosciuto'], warnings: [], score: 0 };
    }

    const errors: string[] = [];
    const warnings: string[] = [];
    let totalCompatibility = 0;
    let fieldCount = 0;

    // Verifica campi obbligatori
    structure.fields.forEach(field => {
      if (field.required && !settings[field.field]) {
        errors.push(`${field.label} è obbligatorio per ${structure.displayName}`);
      }

      if (settings[field.field]) {
        const compatibility = this.checkCompatibility(genre, field.field, settings[field.field]);
        totalCompatibility += compatibility.compatibility;
        fieldCount++;

        if (!compatibility.compatible) {
          errors.push(`${field.label}: "${settings[field.field]}" non è compatibile con ${structure.displayName}`);
        } else if (compatibility.compatibility < 70) {
          warnings.push(`${field.label}: "${settings[field.field]}" ha compatibilità limitata (${compatibility.compatibility}%)`);
        }
      }
    });

    const score = fieldCount > 0 ? Math.round(totalCompatibility / fieldCount) : 0;
    const isValid = errors.length === 0 && score >= 60;

    return { isValid, errors, warnings, score };
  }
} 