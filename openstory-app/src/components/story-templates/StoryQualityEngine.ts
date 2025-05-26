// 🎯 MOTORE QUALITÀ STORIA - OPENSTORY
// Sistema avanzato per garantire storie sempre complete e di alta qualità

export interface QualityMetrics {
  wordCount: number;
  sectionCount: number;
  dialoguePercentage: number;
  structureScore: number;
  contentQuality: number;
  overallScore: number;
}

export interface QualityValidation {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  autoFixAvailable: boolean;
  metrics: QualityMetrics;
}

export interface StorySection {
  title: string;
  content: string;
  wordCount: number;
  hasDialogue: boolean;
  qualityScore: number;
}

export class StoryQualityEngine {
  
  // 🎛️ CONFIGURAZIONE SOGLIE QUALITÀ (modificabili)
  private static readonly QUALITY_THRESHOLDS = {
    MINIMUM_SCORE: 25,        // Soglia minima per accettare una storia
    AUTO_FIX_THRESHOLD: 25,   // Soglia sotto cui non tentare auto-correzione
    REGENERATION_THRESHOLD: 25, // Soglia per rigenerazione automatica
    VALIDATION_THRESHOLD: 80,   // Soglia per considerare una storia "valida"
    WORD_COUNT_RATIO: 0.7      // Rapporto minimo parole (70% delle attese)
  };
  
  /**
   * 🎛️ CONFIGURA SOGLIE QUALITÀ
   * Permette di modificare dinamicamente le soglie di qualità
   */
  static configureThresholds(newThresholds: Partial<typeof StoryQualityEngine.QUALITY_THRESHOLDS>) {
    Object.assign(this.QUALITY_THRESHOLDS, newThresholds);
    console.log('🎛️ Soglie qualità aggiornate:', this.QUALITY_THRESHOLDS);
  }
  
  /**
   * 🔍 OTTIENI SOGLIE CORRENTI
   */
  static getCurrentThresholds() {
    return { ...this.QUALITY_THRESHOLDS };
  }
  
  /**
   * 🔍 ANALISI COMPLETA DELLA STORIA
   * Analizza tutti gli aspetti qualitativi della storia generata
   */
  static analyzeStoryQuality(story: string, expectedWords: number = 3750): QualityValidation {
    console.log('🔍 Avvio analisi qualità storia...');
    
    const metrics = this.calculateMetrics(story, expectedWords);
    
    const issues: string[] = [];
    const suggestions: string[] = [];
    let autoFixAvailable = false;

    // 📊 VALIDAZIONE LUNGHEZZA
    if (metrics.wordCount < expectedWords * this.QUALITY_THRESHOLDS.WORD_COUNT_RATIO) {
      issues.push(`Storia troppo breve: ${metrics.wordCount} parole vs ${expectedWords} attese`);
      suggestions.push('Espandi le descrizioni e aggiungi più dialoghi');
      autoFixAvailable = true;
    }

    // 📋 VALIDAZIONE STRUTTURA
    if (metrics.sectionCount < 4) {
      const missingSections = this.findMissingSections(story);
      issues.push(`Mancano sezioni: ${missingSections.join(', ')}`);
      suggestions.push('Rigenera la storia con template più specifico');
      autoFixAvailable = true;
    }

    // 💬 VALIDAZIONE DIALOGHI
    if (metrics.dialoguePercentage < 30) {
      issues.push(`Pochi dialoghi: ${metrics.dialoguePercentage.toFixed(1)}% vs 55% attesi`);
      suggestions.push('Aggiungi più conversazioni tra personaggi');
      autoFixAvailable = true;
    }

    // 🎯 VALIDAZIONE CONTENUTO
    if (metrics.contentQuality < 70) {
      issues.push('Qualità del contenuto migliorabile');
      suggestions.push('Arricchisci descrizioni e sviluppa meglio i personaggi');
      autoFixAvailable = true;
    }

    // 🚫 VALIDAZIONE RIGOROSA: Blocca storie di qualità troppo bassa
    if (metrics.overallScore < this.QUALITY_THRESHOLDS.MINIMUM_SCORE) {
      issues.push(`Qualità troppo bassa: ${metrics.overallScore}% (minimo ${this.QUALITY_THRESHOLDS.MINIMUM_SCORE}%)`);
      suggestions.push('Rigenera completamente la storia con prompt migliorato');
      autoFixAvailable = false; // Non tentare auto-correzione su storie troppo scadenti
    }
    
    // 🚫 BLOCCO CONTENUTO MISTO LINGUE
    const hasEnglishContent = /\b(Let's|What|Once|I'm|you're|we|can|start|help|write|story|character|plot)\b/i.test(story);
    if (hasEnglishContent) {
      issues.push('Contenuto misto italiano/inglese rilevato');
      suggestions.push('Rigenera la storia specificando "solo in italiano"');
      autoFixAvailable = false;
    }
    
    // 🚫 BLOCCO CONTENUTO FRAMMENTATO
    const hasFragmentedContent = story.includes('**SEZIONE**') || 
                                story.split('**').length > 10 || 
                                /\*\*[^*]*\*\*\s*\*\*[^*]*\*\*/.test(story);
    if (hasFragmentedContent) {
      issues.push('Struttura frammentata o corrotta rilevata');
      suggestions.push('Rigenera la storia con template più stabile');
      autoFixAvailable = false;
    }

    const isValid = issues.length === 0 && metrics.overallScore >= this.QUALITY_THRESHOLDS.VALIDATION_THRESHOLD;

    return {
      isValid,
      issues,
      suggestions,
      autoFixAvailable,
      metrics
    };
  }

  /**
   * 📊 CALCOLO METRICHE DETTAGLIATE
   */
  private static calculateMetrics(story: string, expectedWords: number): QualityMetrics {
    const words = story.trim().split(/\s+/);
    const wordCount = words.length;
    
    // Conta sezioni
    const sectionPatterns = [
      /\*\*PROLOGO\*\*/gi,
      /\*\*ATTO\s*I/gi,
      /\*\*ATTO\s*II/gi,
      /\*\*ATTO\s*III/gi
    ];
    
    const sectionCount = sectionPatterns.reduce((count, pattern) => {
      return count + (story.match(pattern) || []).length;
    }, 0);

    // Calcola percentuale dialoghi
    const dialogueMatches = story.match(/"[^"]*"/g) || [];
    const dialogueWords = dialogueMatches.join(' ').split(/\s+/).length;
    const dialoguePercentage = wordCount > 0 ? (dialogueWords / wordCount) * 100 : 0;

    // Punteggio struttura (0-100)
    const structureScore = Math.min(100, (sectionCount / 4) * 100);

    // Qualità contenuto basata su vari fattori
    const contentQuality = this.assessContentQuality(story);

    // Punteggio complessivo
    const lengthScore = Math.min(100, (wordCount / expectedWords) * 100);
    const overallScore = Math.round(
      (lengthScore * 0.3) + 
      (structureScore * 0.3) + 
      (Math.min(100, dialoguePercentage * 1.8) * 0.2) + 
      (contentQuality * 0.2)
    );

    return {
      wordCount,
      sectionCount,
      dialoguePercentage,
      structureScore,
      contentQuality,
      overallScore
    };
  }

  /**
   * 🏗️ ANALISI STRUTTURA NARRATIVA
   */
  private static analyzeStructure(story: string): StorySection[] {
    const sections: StorySection[] = [];
    
    // Dividi la storia in sezioni
    const sectionRegex = /\*\*([^*]+)\*\*([\s\S]*?)(?=\*\*|$)/g;
    let match;
    
    while ((match = sectionRegex.exec(story)) !== null) {
      const title = match[1].trim();
      const content = match[2].trim();
      const wordCount = content.split(/\s+/).length;
      const hasDialogue = /"[^"]*"/.test(content);
      const qualityScore = this.assessSectionQuality(content);
      
      sections.push({
        title,
        content,
        wordCount,
        hasDialogue,
        qualityScore
      });
    }
    
    return sections;
  }

  /**
   * 📝 VALUTAZIONE QUALITÀ CONTENUTO
   */
  private static assessContentQuality(story: string): number {
    let score = 50; // Base score
    
    // Bonus per varietà lessicale
    const uniqueWords = new Set(story.toLowerCase().match(/\b\w+\b/g) || []);
    const totalWords = (story.match(/\b\w+\b/g) || []).length;
    const lexicalVariety = uniqueWords.size / totalWords;
    score += Math.min(20, lexicalVariety * 100);
    
    // Bonus per descrizioni dettagliate
    const descriptiveWords = ['dettagliatamente', 'accuratamente', 'precisamente', 'chiaramente'];
    const descriptiveCount = descriptiveWords.reduce((count, word) => 
      count + (story.toLowerCase().split(word).length - 1), 0);
    score += Math.min(10, descriptiveCount * 2);
    
    // Bonus per emozioni e sensazioni
    const emotionalWords = ['sentiva', 'provava', 'emozione', 'paura', 'gioia', 'rabbia', 'tristezza'];
    const emotionalCount = emotionalWords.reduce((count, word) => 
      count + (story.toLowerCase().split(word).length - 1), 0);
    score += Math.min(15, emotionalCount * 1.5);
    
    // Penalità per ripetizioni eccessive
    const sentences = story.split(/[.!?]+/);
    const repetitionPenalty = this.calculateRepetitionPenalty(sentences);
    score -= repetitionPenalty;
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * 📖 VALUTAZIONE QUALITÀ SEZIONE
   */
  private static assessSectionQuality(content: string): number {
    let score = 50;
    
    const wordCount = content.split(/\s+/).length;
    
    // Bonus per lunghezza appropriata
    if (wordCount >= 300) score += 20;
    else if (wordCount >= 200) score += 10;
    
    // Bonus per presenza dialoghi
    if (/"[^"]*"/.test(content)) score += 15;
    
    // Bonus per azioni concrete
    const actionWords = ['afferrò', 'corse', 'guardò', 'disse', 'rispose', 'camminò'];
    const actionCount = actionWords.reduce((count, word) => 
      count + (content.toLowerCase().split(word).length - 1), 0);
    score += Math.min(15, actionCount * 3);
    
    return Math.max(0, Math.min(100, score));
  }

  /**
   * 🔍 TROVA SEZIONI MANCANTI
   */
  private static findMissingSections(story: string): string[] {
    const requiredSections = ['PROLOGO', 'ATTO I', 'ATTO II', 'ATTO III'];
    const missingSections: string[] = [];
    
    requiredSections.forEach(section => {
      const patterns = [
        new RegExp(`\\*\\*.*${section}.*\\*\\*`, 'i'),
        new RegExp(`${section}:`, 'i'),
        new RegExp(`${section}\\s*\n`, 'i')
      ];
      
      const found = patterns.some(pattern => pattern.test(story));
      if (!found) {
        missingSections.push(section);
      }
    });
    
    return missingSections;
  }

  /**
   * 🔄 AUTO-CORREZIONE INTELLIGENTE
   * Corregge automaticamente i problemi più comuni
   */
  static async autoFixStory(story: string, issues: string[]): Promise<string> {
    console.log('🔧 Avvio auto-correzione intelligente...');
    
    // 🚫 BLOCCO AUTO-CORREZIONE per storie troppo corrotte
    const qualityCheck = this.analyzeStoryQuality(story, 3750);
    if (qualityCheck.metrics.overallScore < this.QUALITY_THRESHOLDS.AUTO_FIX_THRESHOLD) {
      console.error('🚫 Storia troppo corrotta per auto-correzione:', qualityCheck.metrics.overallScore + '%');
      throw new Error(`Storia troppo corrotta per auto-correzione (qualità: ${qualityCheck.metrics.overallScore}%). Usa "🚀 Rigenera Storia Ottimizzata" invece.`);
    }
    
    // 🚫 BLOCCO per contenuto misto lingue
    const hasEnglishContent = /\b(Let's|What|Once|I'm|you're|we|can|start|help|write|story|character|plot)\b/i.test(story);
    if (hasEnglishContent) {
      console.error('🚫 Contenuto misto italiano/inglese rilevato');
      throw new Error('Contenuto misto italiano/inglese rilevato. Usa "🚀 Rigenera Storia Ottimizzata" per una storia completamente in italiano.');
    }
    
    let fixedStory = story;
    
    // Fix 1: Solo pulizia base del contenuto corrotto
    fixedStory = this.cleanCorruptedContent(fixedStory);
    
    // DISABILITATO: Fix 2: Aggiungi sezioni mancanti (causava duplicazioni)
    // const missingSections = this.findMissingSections(fixedStory);
    // if (missingSections.length > 0 && fixedStory.length > 500) {
    //   fixedStory = await this.addMissingSections(fixedStory, missingSections);
    // }
    
    // DISABILITATO: Fix 3: Espandi sezioni troppo brevi (causava confusione)
    // if (!fixedStory.includes('**SEZIONE**')) {
    //   fixedStory = this.expandShortSections(fixedStory);
    // }
    
    // DISABILITATO: Fix 4: Aggiungi dialoghi se mancanti (causava ripetizioni)
    // if (this.calculateMetrics(fixedStory, 3750).dialoguePercentage < 30) {
    //   fixedStory = this.enhanceDialogues(fixedStory);
    // }
    
    // DISABILITATO: Fix 5: Migliora qualità generale (causava sostituzioni eccessive)
    // fixedStory = this.improveOverallQualitySafe(fixedStory);
    
    console.log('✅ Auto-correzione completata (solo pulizia base)');
    return fixedStory;
  }

  /**
   * 🧹 PULISCI CONTENUTO CORROTTO
   */
  private static cleanCorruptedContent(story: string): string {
    let cleanedStory = story;
    
    // Rimuovi testo inglese misto
    cleanedStory = cleanedStory.replace(/\b(Let's|What|Once|I'm|you're|we|can|start|help|write|story|character|plot)\b[^.!?]*[.!?]/gi, '');
    
    // Rimuovi sezioni duplicate o corrotte
    cleanedStory = cleanedStory.replace(/\*\*SEZIONE\*\*/g, '');
    
    // Rimuovi frasi incomplete o corrotte
    cleanedStory = cleanedStory.replace(/\b[A-Z][a-z]*\s*\*[^*]*$/gm, '');
    
    // Pulisci spazi multipli
    cleanedStory = cleanedStory.replace(/\s+/g, ' ').trim();
    
    return cleanedStory;
  }

  /**
   * 🔄 RIMUOVI RIPETIZIONI
   */
  private static removeExcessiveRepetitions(story: string): string {
    const sentences = story.split(/[.!?]+/);
    const uniqueSentences = [];
    const seenSentences = new Set();
    
    for (const sentence of sentences) {
      const normalized = sentence.trim().toLowerCase();
      if (normalized.length > 10 && !seenSentences.has(normalized)) {
        uniqueSentences.push(sentence);
        seenSentences.add(normalized);
      } else if (normalized.length <= 10) {
        uniqueSentences.push(sentence);
      }
    }
    
    return uniqueSentences.join('. ').replace(/\.\s*\./g, '.');
  }

  /**
   * 📊 CALCOLA PENALITÀ RIPETIZIONI
   */
  private static calculateRepetitionPenalty(sentences: string[]): number {
    const sentenceMap = new Map<string, number>();
    
    sentences.forEach(sentence => {
      const normalized = sentence.trim().toLowerCase();
      if (normalized.length > 10) {
        sentenceMap.set(normalized, (sentenceMap.get(normalized) || 0) + 1);
      }
    });
    
    let penalty = 0;
    sentenceMap.forEach(count => {
      if (count > 1) {
        penalty += (count - 1) * 5;
      }
    });
    
    return Math.min(30, penalty);
  }

  /**
   * 🎯 GENERA PROMPT OTTIMIZZATO
   * Crea un prompt specifico per correggere problemi identificati
   */
  static generateOptimizedPrompt(originalStory: string, issues: string[]): string {
    const problemAreas = issues.join(', ');
    
    return `MIGLIORA QUESTA STORIA RISOLVENDO I SEGUENTI PROBLEMI: ${problemAreas}

STORIA ORIGINALE:
${originalStory}

ISTRUZIONI SPECIFICHE:
1. MANTIENI la trama e i personaggi esistenti
2. ESPANDI le sezioni troppo brevi a minimo 400 parole ciascuna
3. AGGIUNGI dialoghi realistici se mancanti (target: 55% del testo)
4. COMPLETA le sezioni mancanti con titoli in grassetto
5. MIGLIORA la qualità narrativa con descrizioni dettagliate
6. ASSICURATI che ogni sezione sia collegata alla successiva

FORMATO RICHIESTO:
**PROLOGO** (500+ parole)
**ATTO I - SETUP** (800+ parole)  
**ATTO II - SVILUPPO** (1000+ parole)
**ATTO III - RISOLUZIONE** (800+ parole)

SCRIVI LA STORIA MIGLIORATA COMPLETA:`;
  }
} 