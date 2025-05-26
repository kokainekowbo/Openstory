// 🧠 SISTEMA SUGGERIMENTI INTELLIGENTI - OPENSTORY
// Propone automaticamente elementi narrativi basati sul genere

// import { GENRE_TEMPLATES } from './StoryTemplateEngine'; // Rimosso per evitare warning

export interface IntelligentSuggestion {
  field: string;
  value: string;
  reason: string;
  confidence: number; // 0-100
}

export interface GenreSuggestions {
  protagonists: Array<{ name: string; details: string; archetype: string }>;
  antagonists: Array<{ name: string; details: string; archetype: string }>;
  settings: Array<{ location: string; period: string; atmosphere: string }>;
  conflicts: Array<{ conflict: string; stakes: string; resolution: string }>;
  plotElements: string[];
  tones: string[];
  atmospheres: string[];
}

// 📚 DATABASE SUGGERIMENTI PER GENERE
export const GENRE_SUGGESTIONS: Record<string, GenreSuggestions> = {
  'action_thriller': {
    protagonists: [
      {
        name: 'Jack Sterling',
        details: 'Ex Navy SEAL, esperto in infiltrazioni, lavora come mercenario freelance',
        archetype: 'Soldato d\'élite'
      },
      {
        name: 'Maya Rodriguez',
        details: 'Agente CIA, specialista in tecnologia, abilità di combattimento eccezionali',
        archetype: 'Spia tecnologica'
      }
    ],
    antagonists: [
      {
        name: 'Viktor Kozlov',
        details: 'Ex Spetsnaz, ora terrorista internazionale, rete globale di contatti',
        archetype: 'Terrorista militare'
      },
      {
        name: 'Dr. Helena Voss',
        details: 'Scienziata pazza, armi biologiche, corporation multinazionale',
        archetype: 'Genio malvagio'
      }
    ],
    settings: [
      {
        location: 'Base segreta nelle Alpi',
        period: 'Operazione notturna',
        atmosphere: 'Neve, esplosioni, inseguimenti ad alta velocità'
      },
      {
        location: 'Grattacielo di Tokyo',
        period: 'Infiltrazione urbana',
        atmosphere: 'Neon, tecnologia avanzata, combattimenti acrobatici'
      }
    ],
    conflicts: [
      {
        conflict: 'Fermare attacco terroristico con arma di distruzione di massa',
        stakes: 'Vite di milioni di innocenti',
        resolution: 'Sacrificio eroico dell\'ultimo momento'
      },
      {
        conflict: 'Smascherare tradimento all\'interno dell\'agenzia',
        stakes: 'Sicurezza nazionale e fiducia nelle istituzioni',
        resolution: 'Alleanza improbabile per giustizia'
      }
    ],
    plotElements: ['missione impossibile', 'corsa contro tempo', 'tradimento', 'tecnologia avanzata', 'inseguimenti'],
    tones: ['adrenalinico', 'dinamico', 'eroico', 'spettacolare'],
    atmospheres: ['esplosiva', 'veloce', 'tecnologica', 'militare']
  },

  'crime_noir': {
    protagonists: [
      {
        name: 'Detective Alex Morgan',
        details: '42 anni, tormentato dalla morte della moglie Sarah, beve whisky e fuma troppo',
        archetype: 'Detective tormentato'
      },
      {
        name: 'Investigatore Marcus Kane',
        details: 'Ex poliziotto diventato privato, cicatrici del passato, metodi non ortodossi',
        archetype: 'Investigatore privato'
      }
    ],
    antagonists: [
      {
        name: 'Dr. Marcus Beaumont',
        details: 'Ex professore di arte, crea crimini come opere d\'arte, filosofia distorta',
        archetype: 'Serial killer intellettuale'
      },
      {
        name: 'Vincent Moreau',
        details: 'Boss criminale raffinato, collezionista d\'arte, metodi sofisticati',
        archetype: 'Criminale elegante'
      }
    ],
    settings: [
      {
        location: 'Los Angeles Downtown',
        period: 'Novembre 2024',
        atmosphere: 'Notti piovose, neon che si riflettono sull\'asfalto, ombre lunghe'
      },
      {
        location: 'New York - Lower East Side',
        period: 'Inverno 2024',
        atmosphere: 'Nebbia urbana, luci soffuse, vicoli bui e misteriosi'
      }
    ],
    conflicts: [
      {
        conflict: 'Caccia a serial killer che ricrea opere d\'arte famose',
        stakes: 'Vite innocenti e sanità mentale del detective',
        resolution: 'Confronto psicologico finale'
      },
      {
        conflict: 'Corruzione poliziesca che copre traffico d\'arte',
        stakes: 'Giustizia e carriera del protagonista',
        resolution: 'Scelta tra lealtà e verità'
      }
    ],
    plotElements: ['crimini seriali', 'simboli misteriosi', 'connessione personale', 'passato traumatico'],
    tones: ['cupo', 'teso', 'malinconico', 'inquietante'],
    atmospheres: ['piovosa', 'nebbiosa', 'notturna', 'urbana']
  },

  'fantasy': {
    protagonists: [
      {
        name: 'Lyra Stellavento',
        details: 'Giovane maga con poteri elementali, orfana cresciuta da druidi, destino profetico',
        archetype: 'Maga prescelta'
      },
      {
        name: 'Kael Forgiaspada',
        details: 'Guerriero nano, ultimo della sua stirpe, cerca vendetta contro draghi',
        archetype: 'Guerriero vendicatore'
      }
    ],
    antagonists: [
      {
        name: 'Malachar il Corruttore',
        details: 'Stregone antico, cerca immortalità attraverso magia oscura, esercito di non-morti',
        archetype: 'Signore oscuro'
      },
      {
        name: 'Drago Pyrothane',
        details: 'Drago rosso millenario, custodisce tesori antichi, intelligenza superiore',
        archetype: 'Drago tiranno'
      }
    ],
    settings: [
      {
        location: 'Regno di Aethermoor',
        period: 'Era del Terzo Sole',
        atmosphere: 'Castelli fluttuanti, foreste magiche, cristalli di potere'
      },
      {
        location: 'Terre Desolate di Shadowmere',
        period: 'Dopo la Grande Guerra',
        atmosphere: 'Rovine antiche, magia selvaggia, creature corrotte'
      }
    ],
    conflicts: [
      {
        conflict: 'Profezia antica che predice la fine del mondo',
        stakes: 'Sopravvivenza di tutti i regni',
        resolution: 'Sacrificio eroico per nuovo equilibrio'
      },
      {
        conflict: 'Guerra tra razze per controllo della magia',
        stakes: 'Futuro della magia nel mondo',
        resolution: 'Unione delle razze contro minaccia comune'
      }
    ],
    plotElements: ['profezia antica', 'artefatto magico', 'regno in pericolo', 'potere nascosto'],
    tones: ['epico', 'avventuroso', 'magico', 'eroico'],
    atmospheres: ['magica', 'maestosa', 'misteriosa', 'antica']
  },

  'horror': {
    protagonists: [
      {
        name: 'Dr. Emma Hartwell',
        details: 'Psicologa, recente trauma personale, inizia a dubitare della propria sanità',
        archetype: 'Professionista vulnerabile'
      },
      {
        name: 'Michael Thornton',
        details: 'Scrittore isolato, si trasferisce in casa remota, passato da dimenticare',
        archetype: 'Artista tormentato'
      }
    ],
    antagonists: [
      {
        name: 'La Presenza',
        details: 'Entità invisibile che manipola la realtà, si nutre di paura e dubbi',
        archetype: 'Forza soprannaturale'
      },
      {
        name: 'Dr. Richard Vance',
        details: 'Psichiatra manipolatore, esperimenti illegali, controllo mentale',
        archetype: 'Autorità corrotta'
      }
    ],
    settings: [
      {
        location: 'Casa vittoriana isolata',
        period: 'Inverno 2024',
        atmosphere: 'Silenzio opprimente, ombre che si muovono, freddo penetrante'
      },
      {
        location: 'Ospedale psichiatrico abbandonato',
        period: 'Notti tempestose',
        atmosphere: 'Echi del passato, corridoi infiniti, luci tremolanti'
      }
    ],
    conflicts: [
      {
        conflict: 'Perdita progressiva del contatto con la realtà',
        stakes: 'Sanità mentale e identità personale',
        resolution: 'Accettazione o fuga dalla verità'
      },
      {
        conflict: 'Trauma del passato che torna a perseguitare',
        stakes: 'Pace interiore e relazioni familiari',
        resolution: 'Confronto con i propri demoni'
      }
    ],
    plotElements: ['perdita memoria', 'casa infestata', 'esperimenti passato', 'trauma rimosso'],
    tones: ['inquietante', 'claustrofobico', 'paranoico', 'disturbante'],
    atmospheres: ['silenziosa', 'opprimente', 'fredda', 'isolata']
  },

  'romantic_comedy': {
    protagonists: [
      {
        name: 'Sofia Martinelli',
        details: 'Architetto di successo, workaholic, ha paura di impegnarsi emotivamente',
        archetype: 'Professionista in carriera'
      },
      {
        name: 'David Chen',
        details: 'Musicista sensibile, insegna pianoforte, cerca l\'anima gemella',
        archetype: 'Artista romantico'
      }
    ],
    antagonists: [
      {
        name: 'Richard Blackwood',
        details: 'Ex fidanzato manipolatore, ricco e possessivo, non accetta la fine',
        archetype: 'Ex tossico'
      },
      {
        name: 'Le Circostanze',
        details: 'Distanza, differenze sociali, timing sbagliato, malintesi',
        archetype: 'Destino avverso'
      }
    ],
    settings: [
      {
        location: 'Piccolo borgo toscano',
        period: 'Estate romantica',
        atmosphere: 'Tramonti dorati, vigneti, cene sotto le stelle'
      },
      {
        location: 'New York - Greenwich Village',
        period: 'Primavera urbana',
        atmosphere: 'Caffetterie accoglienti, parchi fioriti, vita di quartiere'
      }
    ],
    conflicts: [
      {
        conflict: 'Amore impossibile tra persone di classi sociali diverse',
        stakes: 'Felicità personale vs aspettative familiari',
        resolution: 'Scelta coraggiosa per l\'amore vero'
      },
      {
        conflict: 'Ricostruire fiducia dopo tradimento del passato',
        stakes: 'Capacità di amare di nuovo',
        resolution: 'Perdono e nuovo inizio'
      }
    ],
    plotElements: ['amore impossibile', 'differenze sociali', 'segreti famiglia', 'scelte difficili'],
    tones: ['emotivo', 'passionale', 'toccante', 'speranzoso'],
    atmospheres: ['romantica', 'intima', 'calda', 'accogliente']
  }
};

// 🧠 MOTORE SUGGERIMENTI INTELLIGENTI
export class IntelligentSuggestionEngine {
  
  /**
   * Genera suggerimenti automatici basati sul genere selezionato
   */
  static generateSuggestions(genre: string): IntelligentSuggestion[] {
    const suggestions: IntelligentSuggestion[] = [];
    const genreKey = this.normalizeGenre(genre);
    const genreSuggestions = GENRE_SUGGESTIONS[genreKey];
    
    if (!genreSuggestions) {
      return this.getDefaultSuggestions();
    }

    // Suggerimenti protagonista
    const protagonist = this.selectRandom(genreSuggestions.protagonists);
    suggestions.push({
      field: 'protagonistName',
      value: protagonist.name,
      reason: `Protagonista tipico per ${genre}: ${protagonist.archetype}`,
      confidence: 85
    });
    
    suggestions.push({
      field: 'protagonistDetails',
      value: protagonist.details,
      reason: `Dettagli che creano profondità narrativa`,
      confidence: 80
    });

    // Suggerimenti antagonista
    const antagonist = this.selectRandom(genreSuggestions.antagonists);
    suggestions.push({
      field: 'antagonistName',
      value: antagonist.name,
      reason: `Antagonista efficace per ${genre}: ${antagonist.archetype}`,
      confidence: 85
    });
    
    suggestions.push({
      field: 'antagonistDetails',
      value: antagonist.details,
      reason: `Motivazioni chiare e comprensibili`,
      confidence: 80
    });

    // Suggerimenti ambientazione
    const setting = this.selectRandom(genreSuggestions.settings);
    suggestions.push({
      field: 'setting',
      value: setting.location,
      reason: `Ambientazione che supporta l'atmosfera del genere`,
      confidence: 75
    });
    
    suggestions.push({
      field: 'timeperiod',
      value: setting.period,
      reason: `Periodo temporale ottimale per la narrazione`,
      confidence: 70
    });
    
    suggestions.push({
      field: 'atmosphere',
      value: setting.atmosphere,
      reason: `Atmosfera che amplifica la tensione narrativa`,
      confidence: 80
    });

    // Suggerimenti conflitto
    const conflict = this.selectRandom(genreSuggestions.conflicts);
    suggestions.push({
      field: 'mainConflict',
      value: conflict.conflict,
      reason: `Conflitto centrale che guida la narrazione`,
      confidence: 90
    });

    // Suggerimenti tono
    const tone = this.selectRandom(genreSuggestions.tones);
    suggestions.push({
      field: 'tone',
      value: tone,
      reason: `Tono che si adatta perfettamente al genere`,
      confidence: 75
    });

    return suggestions;
  }

  /**
   * Normalizza il nome del genere per matching
   */
  private static normalizeGenre(genre: string): string {
    return genre.toLowerCase().replace(/[^a-z]/g, '_');
  }

  /**
   * Seleziona elemento casuale da array
   */
  private static selectRandom<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Suggerimenti di default se il genere non è riconosciuto
   */
  private static getDefaultSuggestions(): IntelligentSuggestion[] {
    return [
      {
        field: 'protagonistName',
        value: 'Alex Morgan',
        reason: 'Nome versatile adatto a molti generi',
        confidence: 60
      },
      {
        field: 'setting',
        value: 'Città moderna',
        reason: 'Ambientazione neutra e flessibile',
        confidence: 50
      },
      {
        field: 'tone',
        value: 'drammatico',
        reason: 'Tono universalmente efficace',
        confidence: 55
      }
    ];
  }
} 