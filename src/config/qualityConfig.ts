/**
 * 🎛️ CONFIGURAZIONE QUALITÀ OPENSTORY
 * 
 * Questo file permette di regolare le soglie di qualità del sistema.
 * Modifica questi valori per rendere il sistema più o meno rigido.
 */

export interface QualityConfig {
  // 📊 SOGLIE PRINCIPALI
  MINIMUM_SCORE: number;        // Soglia minima per accettare una storia (0-100)
  AUTO_FIX_THRESHOLD: number;   // Soglia sotto cui non tentare auto-correzione (0-100)
  REGENERATION_THRESHOLD: number; // Soglia per rigenerazione automatica (0-100)
  VALIDATION_THRESHOLD: number;   // Soglia per considerare una storia "valida" (0-100)
  
  // 📏 PARAMETRI LUNGHEZZA
  WORD_COUNT_RATIO: number;     // Rapporto minimo parole (0.0-1.0, es. 0.7 = 70%)
  MIN_DIALOGUE_PERCENTAGE: number; // Percentuale minima dialoghi (0-100)
  MIN_SECTIONS: number;         // Numero minimo sezioni richieste
  
  // 🔄 RIGENERAZIONE
  MAX_REGENERATION_ATTEMPTS: number; // Massimo tentativi di rigenerazione automatica
  
  // 🎯 MODALITÀ
  STRICT_MODE: boolean;         // Modalità rigorosa (più controlli)
  DEBUG_MODE: boolean;          // Modalità debug (più log)
}

/**
 * 🎛️ CONFIGURAZIONE PREDEFINITA
 * 
 * MODALITÀ BILANCIATA - Raccomandata per la maggior parte degli utenti
 */
export const DEFAULT_QUALITY_CONFIG: QualityConfig = {
  // 📊 SOGLIE PRINCIPALI (più permissive)
  MINIMUM_SCORE: 25,           // Era 40, ora 25 (meno rigido)
  AUTO_FIX_THRESHOLD: 25,      // Era 40, ora 25 (più auto-correzioni)
  REGENERATION_THRESHOLD: 25,  // Era 40, ora 25 (meno rigenerazioni)
  VALIDATION_THRESHOLD: 70,    // Era 80, ora 70 (più storie accettate)
  
  // 📏 PARAMETRI LUNGHEZZA (più flessibili)
  WORD_COUNT_RATIO: 0.6,       // Era 0.7, ora 0.6 (60% delle parole attese)
  MIN_DIALOGUE_PERCENTAGE: 20, // Era 30, ora 20 (meno dialoghi richiesti)
  MIN_SECTIONS: 3,             // Era 4, ora 3 (meno sezioni richieste)
  
  // 🔄 RIGENERAZIONE
  MAX_REGENERATION_ATTEMPTS: 2, // Massimo 2 tentativi automatici
  
  // 🎯 MODALITÀ
  STRICT_MODE: false,          // Modalità permissiva
  DEBUG_MODE: false            // Log normali
};

/**
 * 🔥 CONFIGURAZIONE RIGOROSA
 * 
 * Per utenti che vogliono solo storie di altissima qualità
 */
export const STRICT_QUALITY_CONFIG: QualityConfig = {
  MINIMUM_SCORE: 50,
  AUTO_FIX_THRESHOLD: 40,
  REGENERATION_THRESHOLD: 45,
  VALIDATION_THRESHOLD: 85,
  WORD_COUNT_RATIO: 0.8,
  MIN_DIALOGUE_PERCENTAGE: 40,
  MIN_SECTIONS: 4,
  MAX_REGENERATION_ATTEMPTS: 3,
  STRICT_MODE: true,
  DEBUG_MODE: true
};

/**
 * 🚀 CONFIGURAZIONE VELOCE
 * 
 * Per generazione rapida con controlli minimi
 */
export const FAST_QUALITY_CONFIG: QualityConfig = {
  MINIMUM_SCORE: 15,
  AUTO_FIX_THRESHOLD: 15,
  REGENERATION_THRESHOLD: 15,
  VALIDATION_THRESHOLD: 50,
  WORD_COUNT_RATIO: 0.4,
  MIN_DIALOGUE_PERCENTAGE: 10,
  MIN_SECTIONS: 2,
  MAX_REGENERATION_ATTEMPTS: 1,
  STRICT_MODE: false,
  DEBUG_MODE: false
};

/**
 * 🎛️ APPLICA CONFIGURAZIONE
 * 
 * Funzione helper per applicare una configurazione al motore di qualità
 */
export function applyQualityConfig(config: QualityConfig) {
  // Questa funzione sarà implementata per aggiornare il motore di qualità
  console.log('🎛️ Applicando configurazione qualità:', config);
  
  // TODO: Implementare l'integrazione con StoryQualityEngine
  // StoryQualityEngine.configureThresholds(config);
}

/**
 * 📋 GUIDA CONFIGURAZIONE
 */
export const QUALITY_CONFIG_GUIDE = {
  title: "🎛️ Guida Configurazione Qualità",
  description: "Come regolare le impostazioni per ottenere i risultati desiderati",
  
  tips: [
    "🔽 MINIMUM_SCORE più basso = meno rigenerazioni automatiche",
    "🔼 VALIDATION_THRESHOLD più alto = solo storie eccellenti accettate",
    "📏 WORD_COUNT_RATIO più basso = storie più brevi accettate",
    "💬 MIN_DIALOGUE_PERCENTAGE più basso = meno dialoghi richiesti",
    "🚀 FAST_CONFIG per test rapidi, STRICT_CONFIG per qualità massima"
  ],
  
  troubleshooting: [
    "❌ Troppe rigenerazioni? → Abbassa REGENERATION_THRESHOLD",
    "⏱️ Generazione troppo lenta? → Usa FAST_QUALITY_CONFIG",
    "📝 Storie troppo brevi? → Abbassa WORD_COUNT_RATIO",
    "🗣️ Pochi dialoghi? → Abbassa MIN_DIALOGUE_PERCENTAGE"
  ]
}; 