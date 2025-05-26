/**
 * 🚀 CONFIGURAZIONE RAPIDA OPENSTORY
 * 
 * Questo file contiene impostazioni per risolvere rapidamente
 * i problemi di generazione delle storie confuse.
 */

// 🎛️ IMPOSTAZIONI QUALITÀ ULTRA-PERMISSIVE
export const ULTRA_PERMISSIVE_CONFIG = {
  MINIMUM_SCORE: 10,           // Accetta quasi tutto
  AUTO_FIX_THRESHOLD: 5,       // Nessuna auto-correzione
  REGENERATION_THRESHOLD: 10,  // Pochissime rigenerazioni
  VALIDATION_THRESHOLD: 30,    // Standard molto bassi
  WORD_COUNT_RATIO: 0.3,       // Solo 30% delle parole richieste
  MIN_DIALOGUE_PERCENTAGE: 5,  // Dialoghi minimi
  MIN_SECTIONS: 1,             // Anche una sola sezione va bene
  MAX_REGENERATION_ATTEMPTS: 0, // Nessuna rigenerazione automatica
  STRICT_MODE: false,
  DEBUG_MODE: false
};

// 🔧 FUNZIONE PER APPLICARE LA CONFIGURAZIONE RAPIDA
export function applyQuickFix() {
  console.log('🚀 Applicando configurazione ultra-permissiva...');
  
  // Applica le impostazioni al motore di qualità se disponibile
  if (typeof window !== 'undefined' && (window as any).StoryQualityEngine) {
    (window as any).StoryQualityEngine.configureThresholds(ULTRA_PERMISSIVE_CONFIG);
    console.log('✅ Configurazione applicata al motore di qualità');
  }
  
  // Disabilita completamente l'auto-correzione
  if (typeof window !== 'undefined') {
    (window as any).DISABLE_AUTO_CORRECTION = true;
    console.log('✅ Auto-correzione disabilitata');
  }
  
  return true;
}

// 🎯 PARAMETRI CONSIGLIATI PER STORIE SEMPLICI
export const SIMPLE_STORY_PARAMS = {
  genre: 'Fantasy',
  protagonistName: 'Marco',
  protagonistDetails: 'Un giovane coraggioso',
  antagonistName: 'Il Nemico',
  antagonistDetails: 'Una forza oscura',
  setting: 'Un regno magico',
  timeperiod: 'Epoca medievale',
  atmosphere: 'Misteriosa',
  mainConflict: 'Salvare il regno',
  plotElements: ['Una profezia', 'Un artefatto magico'],
  narrativeStyle: 'Descrittivo',
  writingStyle: 'Commerciale',
  specialRequests: ''
};

// 📋 ISTRUZIONI RAPIDE
export const QUICK_INSTRUCTIONS = {
  title: "🚀 Risoluzione Rapida Storie Confuse",
  steps: [
    "1. Apri la console del browser (F12)",
    "2. Digita: applyQuickFix()",
    "3. Ricarica la pagina",
    "4. Usa parametri semplici",
    "5. Genera la storia"
  ],
  tips: [
    "✅ Usa nomi semplici (Marco, Elena, etc.)",
    "✅ Scegli generi sicuri (Fantasy, Adventure)",
    "✅ Evita richieste speciali complesse",
    "✅ Preferisci lunghezza Media invece di Epica"
  ]
};

// 🔄 RESET ALLE IMPOSTAZIONI NORMALI
export function resetToNormal() {
  console.log('🔄 Ripristinando impostazioni normali...');
  
  if (typeof window !== 'undefined' && (window as any).StoryQualityEngine) {
    (window as any).StoryQualityEngine.configureThresholds({
      MINIMUM_SCORE: 25,
      AUTO_FIX_THRESHOLD: 25,
      REGENERATION_THRESHOLD: 25,
      VALIDATION_THRESHOLD: 80,
      WORD_COUNT_RATIO: 0.7,
      MIN_DIALOGUE_PERCENTAGE: 30,
      MIN_SECTIONS: 4,
      MAX_REGENERATION_ATTEMPTS: 2,
      STRICT_MODE: false,
      DEBUG_MODE: false
    });
  }
  
  if (typeof window !== 'undefined') {
    delete (window as any).DISABLE_AUTO_CORRECTION;
  }
  
  console.log('✅ Impostazioni normali ripristinate');
  return true;
}

// 🌐 ESPONI LE FUNZIONI GLOBALMENTE
if (typeof window !== 'undefined') {
  (window as any).applyQuickFix = applyQuickFix;
  (window as any).resetToNormal = resetToNormal;
  (window as any).ULTRA_PERMISSIVE_CONFIG = ULTRA_PERMISSIVE_CONFIG;
  (window as any).SIMPLE_STORY_PARAMS = SIMPLE_STORY_PARAMS;
} 