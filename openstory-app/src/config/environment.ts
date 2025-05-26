// 🔧 CONFIGURAZIONE AMBIENTE - OPENSTORY
// Gestione centralizzata delle variabili d'ambiente

export interface EnvironmentConfig {
  // API Keys
  openRouterApiKey?: string;
  groqApiKey?: string;
  
  // Service URLs
  openVoiceApiUrl: string;
  
  // Feature Flags
  enableOpenVoice: boolean;
  enableVoiceCloning: boolean;
  enableBrowserTTSFallback: boolean;
  enableDebugMode: boolean;
  enableAnalytics: boolean;
  
  // Performance Settings
  openVoiceTimeout: number;
  maxAudioFileSize: number;
  defaultVoiceSpeed: number;
}

/**
 * Configurazione ambiente con valori di default
 */
export const environment: EnvironmentConfig = {
  // API Keys (opzionali)
  openRouterApiKey: process.env.REACT_APP_OPENROUTER_API_KEY,
  groqApiKey: process.env.REACT_APP_GROQ_API_KEY,
  
  // Service URLs
  openVoiceApiUrl: process.env.REACT_APP_OPENVOICE_API_URL || 'http://localhost:8000',
  
  // Feature Flags
  enableOpenVoice: process.env.REACT_APP_ENABLE_OPENVOICE !== 'false',
  enableVoiceCloning: process.env.REACT_APP_ENABLE_VOICE_CLONING !== 'false',
  enableBrowserTTSFallback: process.env.REACT_APP_ENABLE_BROWSER_TTS_FALLBACK !== 'false',
  enableDebugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
  enableAnalytics: process.env.REACT_APP_ENABLE_ANALYTICS === 'true',
  
  // Performance Settings
  openVoiceTimeout: parseInt(process.env.REACT_APP_OPENVOICE_TIMEOUT || '90000'),
  maxAudioFileSize: parseInt(process.env.REACT_APP_MAX_AUDIO_FILE_SIZE || '10485760'), // 10MB
  defaultVoiceSpeed: parseFloat(process.env.REACT_APP_DEFAULT_VOICE_SPEED || '1.0')
};

/**
 * Validazione configurazione
 */
export const validateEnvironment = (): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Verifica URL OpenVoice
  if (environment.enableOpenVoice) {
    try {
      new URL(environment.openVoiceApiUrl);
    } catch {
      errors.push('REACT_APP_OPENVOICE_API_URL non è un URL valido');
    }
  }
  
  // Verifica timeout
  if (environment.openVoiceTimeout < 5000) {
    errors.push('REACT_APP_OPENVOICE_TIMEOUT deve essere almeno 5000ms');
  }
  
  // Verifica dimensione file
  if (environment.maxAudioFileSize < 1048576) { // 1MB
    errors.push('REACT_APP_MAX_AUDIO_FILE_SIZE deve essere almeno 1MB');
  }
  
  // Verifica velocità voce
  if (environment.defaultVoiceSpeed < 0.5 || environment.defaultVoiceSpeed > 2.0) {
    errors.push('REACT_APP_DEFAULT_VOICE_SPEED deve essere tra 0.5 e 2.0');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Log configurazione (solo in debug mode)
 */
export const logEnvironmentConfig = (): void => {
  if (!environment.enableDebugMode) return;
  
  console.group('🔧 Configurazione OpenStory');
  console.log('OpenVoice URL:', environment.openVoiceApiUrl);
  console.log('OpenVoice abilitato:', environment.enableOpenVoice);
  console.log('Voice Cloning abilitato:', environment.enableVoiceCloning);
  console.log('Browser TTS Fallback:', environment.enableBrowserTTSFallback);
  console.log('Timeout OpenVoice:', environment.openVoiceTimeout + 'ms');
  console.log('Max file size:', (environment.maxAudioFileSize / 1048576).toFixed(1) + 'MB');
  console.log('Velocità voce default:', environment.defaultVoiceSpeed + 'x');
  
  // Verifica API keys (senza mostrarle)
  console.log('OpenRouter API Key:', environment.openRouterApiKey ? '✅ Configurata' : '❌ Mancante');
  console.log('Groq API Key:', environment.groqApiKey ? '✅ Configurata' : '❌ Mancante');
  
  const validation = validateEnvironment();
  if (!validation.isValid) {
    console.warn('⚠️ Errori configurazione:', validation.errors);
  } else {
    console.log('✅ Configurazione valida');
  }
  console.groupEnd();
};

/**
 * Utility per feature flags
 */
export const isFeatureEnabled = (feature: keyof EnvironmentConfig): boolean => {
  return Boolean(environment[feature]);
};

/**
 * Utility per ottenere URL servizi
 */
export const getServiceUrl = (service: 'openvoice'): string => {
  switch (service) {
    case 'openvoice':
      return environment.openVoiceApiUrl;
    default:
      throw new Error(`Servizio sconosciuto: ${service}`);
  }
};

/**
 * Inizializzazione ambiente
 */
export const initializeEnvironment = (): void => {
  // Log configurazione se debug abilitato
  logEnvironmentConfig();
  
  // Valida configurazione
  const validation = validateEnvironment();
  if (!validation.isValid) {
    console.error('❌ Errori nella configurazione ambiente:', validation.errors);
    
    // In produzione, potresti voler disabilitare alcune funzionalità
    if (process.env.NODE_ENV === 'production') {
      console.warn('🔧 Alcune funzionalità potrebbero essere disabilitate');
    }
  }
  
  // Imposta handler per errori non gestiti
  if (environment.enableDebugMode) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('🚨 Promise rejection non gestita:', event.reason);
    });
  }
};

export default environment; 