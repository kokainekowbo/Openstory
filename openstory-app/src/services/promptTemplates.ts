// Sistema avanzato di template per prompt ottimizzati
export interface PromptTemplate {
  genre: string;
  tone: string;
  systemPrompt: string;
  structure: {
    prologo: PromptSection;
    atto1: PromptSection;
    atto2: PromptSection;
    atto3: PromptSection;
  };
  guidelines: string[];
  examples: string[];
}

export interface PromptSection {
  name: string;
  description: string;
  systemPrompt: string;
  userPromptTemplate: string;
  maxTokens: number;
  temperature: number;
  constraints: string[];
}

// Template per Action/Thriller
const actionThrillerTemplate: PromptTemplate = {
  genre: 'action_thriller',
  tone: 'intense',
  systemPrompt: `Sei un esperto sceneggiatore specializzato in thriller d'azione stile Hollywood. 
  Crea storie con ritmo incalzante, personaggi determinati, dialoghi essenziali e colpi di scena mozzafiato. 
  Le tue storie seguono la struttura classica a tre atti con tensione costante e risoluzione esplosiva.`,
  
  structure: {
    prologo: {
      name: 'Prologo',
      description: 'Hook iniziale che stabilisce il tono e anticipa il conflitto',
      systemPrompt: `Crea un prologo che catturi immediatamente l'attenzione. Deve mostrare il protagonista 
      in azione o in una situazione che rivela il suo carattere. Non più di 200 parole, ogni frase deve 
      essere essenziale e visuale.`,
      userPromptTemplate: `Scrivi il prologo per un thriller d'azione con:
      - Protagonista: {{protagonist.name}}, {{protagonist.type}}
      - Ambientazione: {{setting.place}}, {{setting.time}}
      - Tono: {{tone}}
      - Conflitto centrale: {{mainConflict}}
      
      Il prologo deve essere cinematico, con azione visuale e dialoghi minimi.
      Massimo 200 parole.`,
      maxTokens: 400,
      temperature: 0.7,
      constraints: [
        'Massimo 200 parole',
        'Focus su azione e movimento',
        'Dialoghi essenziali',
        'Stabilisce il protagonista come competente'
      ]
    },
    
    atto1: {
      name: 'Atto I - Setup',
      description: 'Stabilisce il mondo, i personaggi e il conflitto principale',
      systemPrompt: `Crea l'Atto I che stabilisce chiaramente le motivazioni del protagonista e presenta 
      la minaccia principale. Includi l'evento scatenante che mette in moto la storia. Ritmo veloce 
      ma con momenti per caratterizzare i personaggi.`,
      userPromptTemplate: `Scrivi l'Atto I basato su:
      - Prologo: {{previousSections}}
      - Protagonista: {{protagonist.name}} vuole {{protagonist.goal}}
      - Antagonista: {{antagonist.type}} motivato da {{antagonist.motivation}}
      - Evento scatenante: {{incitingIncident}}
      - Ambientazione: {{setting.description}}
      
      Includi il punto di non ritorno per il protagonista.
      Massimo 400 parole.`,
      maxTokens: 600,
      temperature: 0.6,
      constraints: [
        'Massimo 400 parole',
        'Evento scatenante chiaro',
        'Stabilisce le motivazioni',
        'Introduce l\'antagonista'
      ]
    },
    
    atto2: {
      name: 'Atto II - Confronto',
      description: 'Intensifica il conflitto con ostacoli crescenti e complicazioni',
      systemPrompt: `Crea l'Atto II che intensifica drammaticamente la tensione. Il protagonista deve 
      affrontare ostacoli sempre più difficili. Includi un tradimento o colpo di scena che cambia tutto. 
      Termina con il momento più buio per il protagonista.`,
      userPromptTemplate: `Scrivi l'Atto II che continua da:
      {{previousSections}}
      
      Includi:
      - Ostacoli crescenti per {{protagonist.name}}
      - Azioni dell'antagonista {{antagonist.type}}
      - Elementi di trama: {{plotElements}}
      - Un grande colpo di scena o tradimento
      - Il momento più buio per il protagonista
      
      Mantieni il ritmo incalzante. Massimo 450 parole.`,
      maxTokens: 700,
      temperature: 0.6,
      constraints: [
        'Massimo 450 parole',
        'Tensione crescente',
        'Include colpo di scena',
        'Momento più buio'
      ]
    },
    
    atto3: {
      name: 'Atto III - Risoluzione',
      description: 'Climax esplosivo e risoluzione definitiva del conflitto',
      systemPrompt: `Crea l'Atto III con il climax più intenso possibile. Il protagonista deve superare 
      le sue paure e affrontare l'antagonista in uno scontro definitivo. Risoluzione soddisfacente ma 
      realistica. Ogni elemento deve convergere per un finale esplosivo.`,
      userPromptTemplate: `Scrivi l'Atto III finale basato su:
      {{previousSections}}
      
      Deve includere:
      - Il protagonista {{protagonist.name}} supera il momento più buio
      - Scontro finale con {{antagonist.type}}
      - Risoluzione di {{plotElements}}
      - Finale soddisfacente ma realistico
      
      Climax esplosivo e risoluzione definitiva. Massimo 400 parole.`,
      maxTokens: 600,
      temperature: 0.5,
      constraints: [
        'Massimo 400 parole',
        'Climax esplosivo',
        'Risoluzione definitiva',
        'Finale soddisfacente'
      ]
    }
  },
  
  guidelines: [
    'Mantieni il ritmo sempre alto',
    'Usa dialoghi brevi e incisivi',
    'Descrizioni visuali e cinematiche',
    'Ogni scena deve avanzare la trama',
    'Mostra, non raccontare',
    'Conflitto in ogni scena'
  ],
  
  examples: [
    'Riferimenti: Mission Impossible, John Wick, Fast & Furious',
    'Tone: Serio ma con momenti di sollievo',
    'Personaggi: Competenti, determinati, con debolezze umane'
  ]
};

// Template per Romantic Comedy
const romanticComedyTemplate: PromptTemplate = {
  genre: 'romantic_comedy',
  tone: 'light',
  systemPrompt: `Sei un esperto scrittore di commedie romantiche. Crea storie che bilanciano 
  perfettamente umorismo e romanticismo, con personaggi adorabili, situazioni divertenti ma credibili, 
  e un finale che scalda il cuore. Le tue storie hanno sempre dialoghi brillanti e chimica palpabile.`,
  
  structure: {
    prologo: {
      name: 'Prologo',
      description: 'Presenta i protagonisti in modo adorabile e stabilisce il conflitto romantico',
      systemPrompt: `Crea un prologo che mostri i protagonisti nelle loro vite normali prima di incontrarsi. 
      Deve far capire al lettore perché dovrebbe tifare per loro. Include dettagli che mostrino 
      le loro personalità e aspirazioni.`,
      userPromptTemplate: `Scrivi il prologo per una commedia romantica con:
      - Protagonista: {{protagonist.name}}, {{protagonist.type}}
      - Personalità: {{protagonist.characteristics}}
      - Ambientazione: {{setting.place}}, {{setting.time}}
      - Tono: Leggero, divertente, ottimista
      
      Mostra il protagonista nella sua vita quotidiana con un tocco di umorismo.
      Massimo 250 parole.`,
      maxTokens: 400,
      temperature: 0.8,
      constraints: [
        'Massimo 250 parole',
        'Tono leggero e ottimista',
        'Stabilisce il carattere del protagonista',
        'Include elementi di umorismo'
      ]
    },
    
    atto1: {
      name: 'Atto I - Il Meet-Cute',
      description: 'I protagonisti si incontrano in modo adorabile ma inizia il conflitto',
      systemPrompt: `Crea l'Atto I con un meet-cute memorabile tra i protagonisti. Il loro primo 
      incontro deve essere divertente ma anche mostrare la chimica. Stabilisci il conflitto 
      che li terrà separati inizialmente.`,
      userPromptTemplate: `Scrivi l'Atto I che continua da:
      {{previousSections}}
      
      Includi:
      - Meet-cute tra {{protagonist.name}} e il love interest
      - Conflitto iniziale: {{conflictReason}}
      - Chimica evidente ma complicata
      - Ambientazione: {{setting.description}}
      - Elemento comico ricorrente
      
      Massimo 400 parole.`,
      maxTokens: 600,
      temperature: 0.8,
      constraints: [
        'Massimo 400 parole',
        'Meet-cute memorabile',
        'Stabilisce il conflitto romantico',
        'Dialoghi brillanti'
      ]
    },
    
    atto2: {
      name: 'Atto II - Avvicinamento',
      description: 'I protagonisti si avvicinano nonostante i malintesi',
      systemPrompt: `Crea l'Atto II dove i protagonisti sono costretti a passare tempo insieme 
      e scoprono di amarsi nonostante le differenze. Include malintesi comici e momenti 
      romantici che costruiscono la tensione.`,
      userPromptTemplate: `Scrivi l'Atto II che continua da:
      {{previousSections}}
      
      Sviluppa:
      - Avvicinamento graduale tra i protagonisti
      - Malintesi comici ma non forzati
      - Momenti romantici crescenti
      - Ostacoli: {{romanticObstacles}}
      - Crescita dei personaggi
      
      Massimo 450 parole.`,
      maxTokens: 700,
      temperature: 0.8,
      constraints: [
        'Massimo 450 parole',
        'Bilanciare commedia e romanticismo',
        'Sviluppo relazione credibile',
        'Crescita dei personaggi'
      ]
    },
    
    atto3: {
      name: 'Atto III - Dichiarazione',
      description: 'Grande gesto romantico e finale felice',
      systemPrompt: `Crea l'Atto III con il grande malinteso che separa i protagonisti, seguito 
      dal grande gesto romantico che risolve tutto. Il finale deve essere soddisfacente, 
      romantico ma credibile.`,
      userPromptTemplate: `Scrivi l'Atto III finale basato su:
      {{previousSections}}
      
      Deve includere:
      - Grande malinteso che li separa
      - Realizzazione dell'amore reciproco
      - Grande gesto romantico di {{protagonist.name}}
      - Dichiarazione d'amore sincera
      - Finale felice e soddisfacente
      
      Massimo 400 parole.`,
      maxTokens: 600,
      temperature: 0.7,
      constraints: [
        'Massimo 400 parole',
        'Grande gesto romantico',
        'Finale soddisfacente',
        'Risoluzione emotiva'
      ]
    }
  },
  
  guidelines: [
    'Bilanciare umorismo e romanticismo',
    'Dialoghi brillanti con doppi sensi',
    'Personaggi imperfetti ma adorabili',
    'Situazioni comiche credibili',
    'Chimica palpabile tra i protagonisti',
    'Crescita emotiva realistica'
  ],
  
  examples: [
    'Riferimenti: When Harry Met Sally, The Princess Bride, Crazy Rich Asians',
    'Tone: Leggero, ottimista, emotivamente soddisfacente',
    'Personaggi: Imperfetti, vulnerabili, spiritosi'
  ]
};

// Template per Horror
const horrorTemplate: PromptTemplate = {
  genre: 'horror',
  tone: 'dark',
  systemPrompt: `Sei un maestro dell'horror psicologico. Crei storie che terrorizzano attraverso 
  l'atmosfera, la tensione psicologica e l'ignoto piuttosto che la violenza gratuita. 
  Le tue storie giocano con le paure primordiali e lasciano molto all'immaginazione del lettore.`,
  
  structure: {
    prologo: {
      name: 'Prologo',
      description: 'Stabilisce un\'atmosfera inquietante e introduce il soprannaturale',
      systemPrompt: `Crea un prologo che instilli immediatamente un senso di disagio. Qualcosa 
      non è giusto, ma non è chiaro cosa. Usa dettagli sensoriali e atmosferici per creare tensione.`,
      userPromptTemplate: `Scrivi il prologo per una storia horror con:
      - Ambientazione: {{setting.place}}, {{setting.time}}
      - Elemento soprannaturale: {{supernaturalElement}}
      - Atmosfera: Inquietante, misteriosa
      - Focus su: Tensione psicologica, non violenza
      
      Stabilisci un'atmosfera oppressiva usando dettagli sensoriali.
      Massimo 250 parole.`,
      maxTokens: 400,
      temperature: 0.6,
      constraints: [
        'Massimo 250 parole',
        'Atmosfera oppressiva',
        'Dettagli sensoriali',
        'Tensione psicologica'
      ]
    },
    
    atto1: {
      name: 'Atto I - L\'Inquietudine',
      description: 'I protagonisti entrano nella situazione pericolosa',
      systemPrompt: `Presenta i protagonisti come persone normali che entrano inconsapevolmente 
      in una situazione terrificante. I primi segni che qualcosa non va dovrebbero essere sottili 
      ma crescenti.`,
      userPromptTemplate: `Scrivi l'Atto I che continua da:
      {{previousSections}}
      
      Sviluppa:
      - Protagonisti: {{protagonist.name}} e {{supportingCharacters}}
      - Entrano in {{setting.place}} per {{reason}}
      - Primi segni inquietanti: {{earlyWarnings}}
      - Crescente senso di disagio
      - Isolamento crescente
      
      Massimo 400 parole.`,
      maxTokens: 600,
      temperature: 0.6,
      constraints: [
        'Massimo 400 parole',
        'Protagonisti relatable',
        'Segni sottili di pericolo',
        'Isolamento crescente'
      ]
    },
    
    atto2: {
      name: 'Atto II - Il Terrore',
      description: 'La minaccia si rivela e la situazione degenera',
      systemPrompt: `Intensifica drammaticamente la tensione. La vera natura della minaccia 
      inizia a rivelarsi. I protagonisti realizzano di essere in pericolo mortale. 
      L'horror deve essere psicologico, non splatter.`,
      userPromptTemplate: `Scrivi l'Atto II che continua da:
      {{previousSections}}
      
      Intensifica:
      - La minaccia {{horrorThreat}} si rivela
      - I protagonisti realizzano il pericolo
      - Tentativi di fuga falliti
      - Perdita di {{lossElement}}
      - Climax di terrore psicologico
      
      Massimo 450 parole.`,
      maxTokens: 700,
      temperature: 0.5,
      constraints: [
        'Massimo 450 parole',
        'Terrore psicologico',
        'Tensione crescente',
        'Minaccia sempre più chiara'
      ]
    },
    
    atto3: {
      name: 'Atto III - La Rivelazione',
      description: 'Confronto finale e risoluzione ambigua',
      systemPrompt: `Porta la storia al climax finale. Il protagonista deve affrontare la 
      minaccia, ma la vittoria deve venire a caro prezzo. Il finale può essere ambiguo, 
      lasciando alcune domande aperte.`,
      userPromptTemplate: `Scrivi l'Atto III finale basato su:
      {{previousSections}}
      
      Risolvi:
      - Confronto finale con {{horrorThreat}}
      - {{protagonist.name}} trova il coraggio/la soluzione
      - Vittoria a caro prezzo
      - Rivelazione finale su {{mysteryElement}}
      - Finale ambiguo che lascia dubbi
      
      Massimo 400 parole.`,
      maxTokens: 600,
      temperature: 0.5,
      constraints: [
        'Massimo 400 parole',
        'Confronto finale intenso',
        'Vittoria a caro prezzo',
        'Finale ambiguo'
      ]
    }
  },
  
  guidelines: [
    'Privilegiare tensione psicologica su violenza',
    'Usare atmosfera e dettagli sensoriali',
    'Paure primordiali e universali',
    'L\'ignoto è più terrificante del visibile',
    'Protagonisti realistici e vulnerabili',
    'Finale che lascia qualche dubbio'
  ],
  
  examples: [
    'Riferimenti: The Haunting of Hill House, The Turn of the Screw, Rosemary\'s Baby',
    'Tone: Inquietante, oppressivo, psicologicamente disturbante',
    'Focus: Atmosfera, tensione, terrore dell\'ignoto'
  ]
};

// Factory per selezionare il template appropriato
export class PromptTemplateEngine {
  private templates = new Map<string, PromptTemplate>([
    ['action_thriller', actionThrillerTemplate],
    ['romantic_comedy', romanticComedyTemplate],
    ['horror', horrorTemplate]
  ]);
  
  getTemplate(genre: string, tone: string): PromptTemplate {
    const key = `${genre}_${tone}`;
    return this.templates.get(key) || this.templates.get(genre) || actionThrillerTemplate;
  }
  
  buildSectionPrompt(
    template: PromptTemplate,
    section: keyof PromptTemplate['structure'],
    parameters: any,
    previousSections = ''
  ): { systemPrompt: string; userPrompt: string; maxTokens: number; temperature: number } {
    const sectionTemplate = template.structure[section];
    
    // Interpola il template utente con i parametri
    let userPrompt = sectionTemplate.userPromptTemplate;
    
    // Sostituzioni base
    userPrompt = userPrompt.replace(/\{\{previousSections\}\}/g, previousSections);
    userPrompt = userPrompt.replace(/\{\{protagonist\.name\}\}/g, parameters.protagonist?.name || 'il protagonista');
    userPrompt = userPrompt.replace(/\{\{protagonist\.type\}\}/g, parameters.protagonist?.type || 'personaggio');
    userPrompt = userPrompt.replace(/\{\{protagonist\.goal\}\}/g, parameters.protagonist?.goal || 'raggiungere il suo obiettivo');
    userPrompt = userPrompt.replace(/\{\{protagonist\.characteristics\}\}/g, parameters.protagonist?.characteristics?.join(', ') || 'determinato');
    
    userPrompt = userPrompt.replace(/\{\{antagonist\.type\}\}/g, parameters.antagonist?.type || 'antagonista');
    userPrompt = userPrompt.replace(/\{\{antagonist\.motivation\}\}/g, parameters.antagonist?.motivation || 'potere');
    
    userPrompt = userPrompt.replace(/\{\{setting\.place\}\}/g, parameters.setting?.place || 'una città moderna');
    userPrompt = userPrompt.replace(/\{\{setting\.time\}\}/g, parameters.setting?.time || 'ai giorni nostri');
    userPrompt = userPrompt.replace(/\{\{setting\.description\}\}/g, parameters.setting?.description || 'un ambiente urbano');
    
    userPrompt = userPrompt.replace(/\{\{tone\}\}/g, parameters.tone || 'drammatico');
    userPrompt = userPrompt.replace(/\{\{plotElements\}\}/g, parameters.plotElements?.join(', ') || 'elementi di suspense');
    
    return {
      systemPrompt: sectionTemplate.systemPrompt,
      userPrompt,
      maxTokens: sectionTemplate.maxTokens,
      temperature: sectionTemplate.temperature
    };
  }
  
  getAvailableGenres(): string[] {
    return Array.from(this.templates.keys());
  }
  
  addTemplate(key: string, template: PromptTemplate): void {
    this.templates.set(key, template);
  }
}

export const promptTemplateEngine = new PromptTemplateEngine(); 