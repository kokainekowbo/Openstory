// 🎯 MOTORE TEMPLATE INTELLIGENTE - OPENSTORY
// Sistema automatico per generare storie strutturate correttamente

export interface StoryParams {
  // Base
  genre: string;
  tone: string;
  length: string;
  
  // Personaggi
  protagonistName: string;
  protagonistDetails: string;
  antagonistName: string;
  antagonistDetails: string;
  
  // Ambientazione
  setting: string;
  timeperiod: string;
  atmosphere: string;
  
  // Trama
  mainConflict: string;
  plotElements: string[];
  
  // Stile
  narrativeStyle: string;
  writingStyle: string;
  
  // Extra
  specialRequests: string;
}

export interface StoryStructure {
  prologo: { words: number; objective: string; elements: string[] };
  atto1: { words: number; objective: string; elements: string[] };
  atto2: { words: number; objective: string; elements: string[] };
  atto3: { words: number; objective: string; elements: string[] };
  totalWords: number;
  dialoguePercentage: number;
}

export interface GenreTemplate {
  name: string;
  structure: StoryStructure;
  characterTypes: {
    protagonist: string[];
    antagonist: string[];
    supporting: string[];
  };
  plotElements: string[];
  atmosphereKeywords: string[];
  writingStyle: string;
  commonConflicts: string[];
}

// 📚 DATABASE TEMPLATE PER GENERE
export const GENRE_TEMPLATES: Record<string, GenreTemplate> = {
  'thriller_noir': {
    name: 'Thriller Noir',
    structure: {
      prologo: {
        words: 250,
        objective: 'Introdurre atmosfera noir e prima scena del crimine',
        elements: ['scena del crimine', 'atmosfera cupa', 'detective protagonista', 'mistero iniziale']
      },
      atto1: {
        words: 900,
        objective: 'Setup emotivo del protagonista e secondo evento',
        elements: ['backstory protagonista', 'routine investigativa', 'partner introduction', 'primo indizio']
      },
      atto2: {
        words: 1300,
        objective: 'Sviluppo indagine e complicazioni',
        elements: ['analisi indizi', 'confronto con antagonista', 'escalation', 'rivelazione parziale']
      },
      atto3: {
        words: 1300,
        objective: 'Confronto finale e risoluzione',
        elements: ['confronto psicologico', 'climax emotivo', 'risoluzione', 'conseguenze personali']
      },
      totalWords: 3750,
      dialoguePercentage: 55
    },
    characterTypes: {
      protagonist: ['detective tormentato', 'investigatore privato', 'agente FBI'],
      antagonist: ['serial killer intelligente', 'criminale raffinato', 'corrotto di sistema'],
      supporting: ['partner metodico', 'informatore', 'vittima sopravvissuta']
    },
    plotElements: ['crimini seriali', 'simboli misteriosi', 'connessione personale', 'passato traumatico'],
    atmosphereKeywords: ['pioggia', 'neon', 'ombre', 'vicoli', 'notte urbana'],
    writingStyle: 'cinematografico',
    commonConflicts: ['caccia al serial killer', 'corruzione poliziesca', 'vendetta personale']
  },

  'fantasy_epico': {
    name: 'Fantasy Epico',
    structure: {
      prologo: {
        words: 300,
        objective: 'Worldbuilding e profezia/evento scatenante',
        elements: ['mondo fantastico', 'magia/potere', 'profezia', 'minaccia antica']
      },
      atto1: {
        words: 1000,
        objective: 'Eroe riluttante e chiamata all\'avventura',
        elements: ['vita ordinaria eroe', 'scoperta potere', 'mentore', 'partenza']
      },
      atto2: {
        words: 1400,
        objective: 'Viaggio e prove crescenti',
        elements: ['alleati e nemici', 'prove magiche', 'rivelazione origine', 'perdita importante']
      },
      atto3: {
        words: 1300,
        objective: 'Battaglia finale e trasformazione',
        elements: ['battaglia epica', 'sacrificio', 'vittoria', 'nuovo equilibrio']
      },
      totalWords: 4000,
      dialoguePercentage: 45
    },
    characterTypes: {
      protagonist: ['eroe riluttante', 'mago giovane', 'guerriero scelto'],
      antagonist: ['signore oscuro', 'mago corrotto', 'drago antico'],
      supporting: ['mentore saggio', 'compagno fedele', 'principessa guerriera']
    },
    plotElements: ['profezia antica', 'artefatto magico', 'regno in pericolo', 'potere nascosto'],
    atmosphereKeywords: ['castelli', 'foreste magiche', 'montagne', 'creature fantastiche'],
    writingStyle: 'epico',
    commonConflicts: ['bene vs male', 'destino vs libero arbitrio', 'potere e responsabilità']
  },

  'horror_psicologico': {
    name: 'Horror Psicologico',
    structure: {
      prologo: {
        words: 200,
        objective: 'Normalità inquietante e primo segnale',
        elements: ['vita normale', 'dettaglio inquietante', 'sensazione sbagliata', 'primo evento']
      },
      atto1: {
        words: 800,
        objective: 'Escalation sottile e dubbi sulla realtà',
        elements: ['eventi strani', 'isolamento', 'dubbi sanità mentale', 'ricerca risposte']
      },
      atto2: {
        words: 1200,
        objective: 'Paranoia crescente e rivelazioni disturbanti',
        elements: ['paranoia', 'rivelazioni shock', 'perdita controllo', 'alleati diventano nemici']
      },
      atto3: {
        words: 1000,
        objective: 'Confronto con la verità e risoluzione ambigua',
        elements: ['verità terribile', 'confronto finale', 'ambiguità', 'nuovo equilibrio precario']
      },
      totalWords: 3200,
      dialoguePercentage: 40
    },
    characterTypes: {
      protagonist: ['persona ordinaria', 'scrittore isolato', 'genitore protettivo'],
      antagonist: ['presenza invisibile', 'manipolatore psicologico', 'se stesso'],
      supporting: ['psicologo', 'vicino sospetto', 'familiare preoccupato']
    },
    plotElements: ['perdita memoria', 'casa infestata', 'esperimenti passato', 'trauma rimosso'],
    atmosphereKeywords: ['silenzio', 'ombre', 'freddo', 'isolamento', 'suoni strani'],
    writingStyle: 'introspettivo',
    commonConflicts: ['realtà vs immaginazione', 'passato vs presente', 'sanità mentale']
  },

  'avventura_azione': {
    name: 'Avventura Azione',
    structure: {
      prologo: {
        words: 250,
        objective: 'Azione immediata e presentazione eroe',
        elements: ['sequenza azione', 'abilità protagonista', 'missione fallita', 'nuovo obiettivo']
      },
      atto1: {
        words: 850,
        objective: 'Nuova missione e formazione squadra',
        elements: ['briefing missione', 'reclutamento alleati', 'preparazione', 'primo ostacolo']
      },
      atto2: {
        words: 1300,
        objective: 'Infiltrazione e complicazioni',
        elements: ['infiltrazione', 'tradimento', 'inseguimenti', 'perdita alleato']
      },
      atto3: {
        words: 1100,
        objective: 'Confronto finale e vittoria',
        elements: ['battaglia finale', 'sacrificio eroico', 'vittoria', 'epilogo']
      },
      totalWords: 3500,
      dialoguePercentage: 50
    },
    characterTypes: {
      protagonist: ['agente segreto', 'mercenario', 'soldato elite'],
      antagonist: ['terrorista', 'signore della guerra', 'corporation malvagia'],
      supporting: ['hacker geniale', 'esperto esplosivi', 'infiltrata']
    },
    plotElements: ['missione impossibile', 'corsa contro tempo', 'tradimento', 'tecnologia avanzata'],
    atmosphereKeywords: ['esplosioni', 'inseguimenti', 'gadget', 'locations esotiche'],
    writingStyle: 'dinamico',
    commonConflicts: ['bene vs male', 'lealtà vs dovere', 'sacrificio personale']
  },

  'romantico_drammatico': {
    name: 'Romantico Drammatico',
    structure: {
      prologo: {
        words: 200,
        objective: 'Presentazione protagonisti separati',
        elements: ['vita protagonista A', 'vita protagonista B', 'insoddisfazione', 'destino']
      },
      atto1: {
        words: 900,
        objective: 'Incontro e attrazione iniziale',
        elements: ['primo incontro', 'attrazione', 'ostacoli iniziali', 'avvicinamento']
      },
      atto2: {
        words: 1200,
        objective: 'Sviluppo relazione e complicazioni',
        elements: ['approfondimento', 'ostacoli esterni', 'malintesi', 'separazione']
      },
      atto3: {
        words: 900,
        objective: 'Risoluzione e unione/separazione definitiva',
        elements: ['chiarimento', 'scelta difficile', 'gesto romantico', 'epilogo']
      },
      totalWords: 3200,
      dialoguePercentage: 65
    },
    characterTypes: {
      protagonist: ['professionista carriera', 'artista sensibile', 'genitore single'],
      antagonist: ['ex partner', 'famiglia disapprovante', 'circostanze'],
      supporting: ['migliore amico', 'confidente', 'rivale romantico']
    },
    plotElements: ['amore impossibile', 'differenze sociali', 'segreti famiglia', 'scelte difficili'],
    atmosphereKeywords: ['intimità', 'tensione emotiva', 'luoghi romantici', 'momenti privati'],
    writingStyle: 'emotivo',
    commonConflicts: ['amore vs dovere', 'passato vs futuro', 'cuore vs ragione']
  }
};

// 🎯 MOTORE INTELLIGENTE DI GENERAZIONE PROMPT
export class StoryTemplateEngine {
  
  /**
   * Genera automaticamente un prompt strutturato basato sui parametri utente
   */
  static generateIntelligentPrompt(params: StoryParams): string {
    const template = this.selectBestTemplate(params);
    const structure = this.calculateOptimalStructure(params, template);
    const characterProfiles = this.generateCharacterProfiles(params, template);
    const plotOutline = this.generatePlotOutline(params, template);
    
    return this.buildStructuredPrompt({
      params,
      template,
      structure,
      characterProfiles,
      plotOutline
    });
  }

  /**
   * Seleziona il template migliore basato sul genere e parametri
   */
  private static selectBestTemplate(params: StoryParams): GenreTemplate {
    // Normalizza il genere per matching
    const genreKey = params.genre.toLowerCase().replace(/[^a-z]/g, '_');
    
    // Cerca match esatto
    if (GENRE_TEMPLATES[genreKey]) {
      return GENRE_TEMPLATES[genreKey];
    }
    
    // Cerca match parziale
    for (const [key, template] of Object.entries(GENRE_TEMPLATES)) {
      if (genreKey.includes(key.split('_')[0]) || key.includes(genreKey.split('_')[0])) {
        return template;
      }
    }
    
    // Default: thriller noir (più versatile)
    return GENRE_TEMPLATES['thriller_noir'];
  }

  /**
   * Calcola la struttura ottimale basata su lunghezza richiesta
   */
  private static calculateOptimalStructure(params: StoryParams, template: GenreTemplate): StoryStructure {
    const baseStructure = { ...template.structure };
    
    // Adatta lunghezza basata su parametro utente
    const lengthMultiplier = this.getLengthMultiplier(params.length);
    
    baseStructure.prologo.words = Math.round(baseStructure.prologo.words * lengthMultiplier);
    baseStructure.atto1.words = Math.round(baseStructure.atto1.words * lengthMultiplier);
    baseStructure.atto2.words = Math.round(baseStructure.atto2.words * lengthMultiplier);
    baseStructure.atto3.words = Math.round(baseStructure.atto3.words * lengthMultiplier);
    baseStructure.totalWords = Math.round(baseStructure.totalWords * lengthMultiplier);
    
    // Adatta percentuale dialoghi basata su stile narrativo
    if (params.narrativeStyle === 'cinematografico') {
      baseStructure.dialoguePercentage += 10;
    } else if (params.narrativeStyle === 'descrittivo') {
      baseStructure.dialoguePercentage -= 10;
    }
    
    return baseStructure;
  }

  /**
   * Genera profili dettagliati dei personaggi
   */
  private static generateCharacterProfiles(params: StoryParams, template: GenreTemplate): string {
    return `
=== PERSONAGGI FISSI (NON MODIFICARE) ===
PROTAGONISTA: ${params.protagonistName}
- Dettagli: ${params.protagonistDetails}
- Tipo: ${template.characterTypes.protagonist[0]}
- Personalità: Determinato, complesso, con conflitti interni
- Obiettivo: Risolvere il conflitto principale
- Arco narrativo: Da incertezza a risoluzione

ANTAGONISTA: ${params.antagonistName}
- Dettagli: ${params.antagonistDetails}
- Tipo: ${template.characterTypes.antagonist[0]}
- Motivazioni: Chiare e comprensibili (anche se sbagliate)
- Metodo: Intelligente e metodico
- Filosofia: Opposta a quella del protagonista

PERSONAGGI SUPPORTO:
- Partner/Alleato: ${template.characterTypes.supporting[0]}
- Ruolo: Contrasto e supporto al protagonista
- Funzione: Far emergere lati diversi del protagonista`;
  }

  /**
   * Genera outline dettagliato della trama
   */
  private static generatePlotOutline(params: StoryParams, template: GenreTemplate): string {
    const selectedElements = params.plotElements.length > 0 
      ? params.plotElements 
      : template.plotElements.slice(0, 3);

    return `
=== TRAMA OBBLIGATORIA ===
CONFLITTO CENTRALE: ${params.mainConflict}
ELEMENTI TRAMA: ${selectedElements.join(', ')}

PROLOGO (${template.structure.prologo.words} parole):
- Obiettivo: ${template.structure.prologo.objective}
- Elementi: ${template.structure.prologo.elements.join(', ')}
- Atmosfera: ${params.atmosphere}

ATTO I (${template.structure.atto1.words} parole):
- Obiettivo: ${template.structure.atto1.objective}
- Elementi: ${template.structure.atto1.elements.join(', ')}
- Evento scatenante: Collegato al conflitto principale

ATTO II (${template.structure.atto2.words} parole):
- Obiettivo: ${template.structure.atto2.objective}
- Elementi: ${template.structure.atto2.elements.join(', ')}
- Complicazioni: Escalation del conflitto

ATTO III (${template.structure.atto3.words} parole):
- Obiettivo: ${template.structure.atto3.objective}
- Elementi: ${template.structure.atto3.elements.join(', ')}
- Risoluzione: Definitiva e soddisfacente`;
  }

  /**
   * Costruisce il prompt finale strutturato
   */
  private static buildStructuredPrompt(config: {
    params: StoryParams;
    template: GenreTemplate;
    structure: StoryStructure;
    characterProfiles: string;
    plotOutline: string;
  }): string {
    const { params, template, structure, characterProfiles, plotOutline } = config;

    return `SCRIVI UNA STORIA COMPLETA IN ITALIANO. NON dare consigli, NON spiegare come scrivere, SCRIVI DIRETTAMENTE LA STORIA.

${characterProfiles}

=== AMBIENTAZIONE FISSA ===
- Luogo: ${params.setting}
- Periodo: ${params.timeperiod}
- Atmosfera: ${params.atmosphere}
- Parole chiave: ${template.atmosphereKeywords.join(', ')}

${plotOutline}

=== REQUISITI TECNICI OBBLIGATORI ===
- DIALOGHI: ${structure.dialoguePercentage}% del testo (conversazioni dirette tra virgolette)
- LUNGHEZZA TOTALE: ${structure.totalWords} parole
- STILE: ${template.writingStyle}, ${params.writingStyle}
- TONO: ${params.tone}
- NARRATIVA: ${params.narrativeStyle}

=== FORMATO RICHIESTO ===

**PROLOGO**
[Esattamente ${structure.prologo.words} parole - ${structure.prologo.objective}]

**ATTO I - SETUP**
[Esattamente ${structure.atto1.words} parole - ${structure.atto1.objective}]

**ATTO II - SVILUPPO**
[Esattamente ${structure.atto2.words} parole - ${structure.atto2.objective}]

**ATTO III - RISOLUZIONE**
[Esattamente ${structure.atto3.words} parole - ${structure.atto3.objective}]

=== REGOLE FERREE ===
1. SCRIVI SOLO LA STORIA - nessuna spiegazione o meta-commento
2. USA dialoghi realistici: "Ciao," disse Marco.
3. DESCRIVI azioni concrete e specifiche
4. MANTIENI coerenza di genere ${template.name}
5. OGNI sezione collegata alla successiva
6. FINALE definitivo e soddisfacente
7. RISPETTA esattamente le lunghezze indicate
8. INCLUDI tutti gli elementi richiesti per ogni atto

${params.specialRequests ? `
=== RICHIESTE SPECIALI ===
${params.specialRequests}
` : ''}

=== CONTROLLO QUALITÀ ===
Prima di completare, verifica:
□ Ogni sezione ha la lunghezza corretta
□ Dialoghi raggiungono ${structure.dialoguePercentage}% del testo
□ Tutti i personaggi sono coerenti
□ Ambientazione mantenuta costante
□ Conflitto risolto in modo soddisfacente

INIZIA SUBITO CON IL PROLOGO - SCRIVI SOLO LA STORIA:`;
  }

  /**
   * Calcola moltiplicatore lunghezza basato su parametro utente
   */
  private static getLengthMultiplier(length: string): number {
    switch (length.toLowerCase()) {
      case 'breve':
      case 'short':
        return 0.7;
      case 'media':
      case 'medium':
        return 1.0;
      case 'lunga':
      case 'long':
        return 1.3;
      case 'epica':
      case 'epic':
        return 1.6;
      default:
        return 1.0;
    }
  }

  /**
   * Valida la struttura della storia generata
   */
  static validateGeneratedStory(story: string, expectedStructure: StoryStructure): {
    isValid: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Verifica sezioni
    const requiredSections = ['PROLOGO', 'ATTO I', 'ATTO II', 'ATTO III'];
    const foundSections = requiredSections.filter(section => 
      new RegExp(`\\*\\*.*${section}.*\\*\\*`, 'i').test(story)
    );

    if (foundSections.length < 4) {
      issues.push(`Mancano sezioni: ${requiredSections.filter(s => !foundSections.includes(s)).join(', ')}`);
      suggestions.push('Rigenera la storia con template più specifico');
    }

    // Verifica lunghezza
    const wordCount = story.split(/\s+/).length;
    const expectedWords = expectedStructure.totalWords;
    const tolerance = 0.2; // 20% tolleranza

    if (wordCount < expectedWords * (1 - tolerance)) {
      issues.push(`Storia troppo breve: ${wordCount} parole vs ${expectedWords} attese`);
      suggestions.push('Aumenta dettagli e dialoghi');
    } else if (wordCount > expectedWords * (1 + tolerance)) {
      issues.push(`Storia troppo lunga: ${wordCount} parole vs ${expectedWords} attese`);
      suggestions.push('Riduci descrizioni eccessive');
    }

    // Verifica dialoghi
    const dialogueMatches = story.match(/"[^"]*"/g) || [];
    const dialogueWords = dialogueMatches.join(' ').split(/\s+/).length;
    const dialoguePercentage = (dialogueWords / wordCount) * 100;

    if (dialoguePercentage < expectedStructure.dialoguePercentage - 10) {
      issues.push(`Pochi dialoghi: ${dialoguePercentage.toFixed(1)}% vs ${expectedStructure.dialoguePercentage}% attesi`);
      suggestions.push('Aggiungi più conversazioni tra personaggi');
    }

    return {
      isValid: issues.length === 0,
      issues,
      suggestions
    };
  }
} 