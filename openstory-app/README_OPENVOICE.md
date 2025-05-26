# 🎙️ INTEGRAZIONE OPENVOICE - OPENSTORY
## Narrazione Vocale Avanzata per le Storie Generate

### 📋 PANORAMICA
OpenStory ora include un sistema completo di **narrazione vocale** basato su **OpenVoice**, che permette di:
- **Convertire storie in audio** con voci professionali
- **Clonare voci personalizzate** da file audio di riferimento
- **Controllare emozioni e velocità** della narrazione
- **Fallback automatico** al TTS del browser se OpenVoice non è disponibile

---

## 🚀 SETUP RAPIDO

### **Opzione 1: Server Locale (Raccomandato)**
```bash
# 1. Clona OpenVoice Server
git clone https://github.com/ValyrianTech/OpenVoice_server.git
cd OpenVoice_server

# 2. Installa dipendenze
pip install -r requirements.txt

# 3. Avvia il server
uvicorn openvoice_server:app --host 0.0.0.0 --port 8000

# 4. Configura OpenStory
# Aggiungi al file .env di openstory-app:
REACT_APP_OPENVOICE_API_URL=http://localhost:8000
```

### **Opzione 2: Servizio Cloud**
```bash
# Usa template Runpod.io (più semplice)
# OpenVoice V2: https://runpod.io/console/deploy?template=qo8v6w92q2&ref=2vdt3dn9

# Configura URL del servizio
REACT_APP_OPENVOICE_API_URL=https://your-runpod-url.com
```

---

## 🎯 FUNZIONALITÀ IMPLEMENTATE

### **1. Narrazione Automatica**
- **TTS Base**: Converte testo in audio con voci predefinite
- **Voice Cloning**: Clona voci da file audio di riferimento
- **Preprocessing Intelligente**: Ottimizza il testo per la narrazione
- **Fallback Browser**: Usa TTS nativo se OpenVoice non disponibile

### **2. Voci Predefinite**
```typescript
const voices = [
  {
    id: 'example_reference',
    name: 'Narratore Classico',
    description: 'Voce professionale per narrazioni',
    gender: 'neutral',
    accent: 'en-newest'
  },
  {
    id: 'demo_speaker0',
    name: 'Voce Maschile Giovane',
    description: 'Voce energica per avventure',
    gender: 'male',
    accent: 'en-us'
  },
  {
    id: 'demo_speaker1',
    name: 'Voce Femminile Elegante',
    description: 'Voce sofisticata per drammi',
    gender: 'female',
    accent: 'en-br'
  },
  {
    id: 'demo_speaker2',
    name: 'Voce Misteriosa',
    description: 'Perfetta per thriller e horror',
    gender: 'neutral',
    accent: 'en-default'
  }
];
```

### **3. Controlli Avanzati**
- **Accenti**: 11 accenti disponibili (EN, ES, FR, IT, etc.)
- **Velocità**: 0.5x - 2.0x (regolabile con slider)
- **Emozioni**: 8 emozioni (normale, eccitato, allegro, triste, etc.)
- **Voice Cloning**: Upload file audio per clonare voci

### **4. Interfaccia Utente**
- **Selezione Voce**: Cards interattive per ogni voce
- **Upload Drag&Drop**: Trascina file audio per voice cloning
- **Player Integrato**: Controlli play/pause/download
- **Progresso Real-time**: Barra di progresso durante generazione
- **Statistiche Audio**: Durata, tempo di generazione, device usato

---

## 🔧 ARCHITETTURA TECNICA

### **Servizio OpenVoice (`OpenVoiceService.ts`)**
```typescript
// Funzioni principali
OpenVoiceService.narrateStory(story, options)     // Narrazione completa
OpenVoiceService.narrateSection(text, type)       // Narrazione per sezione
OpenVoiceService.generateClonedVoice(text, file)  // Voice cloning
OpenVoiceService.uploadCustomVoice(file, label)   // Upload voce personalizzata

// Utilità
OpenVoiceService.downloadAudio(blob, filename)    // Download file audio
OpenVoiceService.blobToBase64(blob)               // Conversione per storage
```

### **Componente UI (`VoiceNarrationPanel.tsx`)**
- **Selezione Voce**: Grid di cards per voci predefinite
- **Upload Personalizzato**: Area drag&drop per file audio
- **Controlli**: Sliders e selettori per opzioni vocali
- **Player Audio**: Controlli integrati per riproduzione
- **Status**: Messaggi di stato e barre di progresso

### **Integrazione Container**
```typescript
// Nel StoryGeneratorContainer.tsx
const [narrationAudio, setNarrationAudio] = useState(null);

const handleNarrationComplete = useCallback((audioUrl, audioBlob) => {
  setNarrationAudio({ url: audioUrl, blob: audioBlob });
}, []);

// Passa callback al StoryPreview
<StoryPreview onNarrationComplete={handleNarrationComplete} />
```

---

## 🎨 ESPERIENZA UTENTE

### **Flusso Narrazione**
1. **Genera Storia** → OpenStory crea la storia
2. **Seleziona Voce** → Scegli tra voci predefinite o carica la tua
3. **Configura Opzioni** → Imposta accento, velocità, emozione
4. **Genera Audio** → OpenVoice processa il testo
5. **Riproduci/Scarica** → Ascolta o salva il file audio

### **Voice Cloning**
1. **Carica File Audio** → Trascina file MP3/WAV (min 10 secondi)
2. **Elaborazione** → OpenVoice estrae caratteristiche vocali
3. **Generazione** → Applica voce clonata alla storia
4. **Risultato** → Audio con la voce personalizzata

### **Fallback Intelligente**
```typescript
// Se OpenVoice non disponibile
if (!isServiceAvailable && FALLBACK_BROWSER_TTS) {
  return fallbackBrowserTTS(story, options);
}

// Usa TTS nativo del browser
const utterance = new SpeechSynthesisUtterance(text);
utterance.rate = options.speed || 1.0;
speechSynthesis.speak(utterance);
```

---

## 📊 PERFORMANCE E OTTIMIZZAZIONI

### **Preprocessing Testo**
```typescript
// Ottimizza testo per narrazione
const processedText = story
  .replace(/#{1,6}\s/g, '')           // Rimuovi markdown
  .replace(/\*\*(.*?)\*\*/g, '$1')    // Rimuovi grassetto
  .replace(/PROLOGO/gi, 'Prologo. ')  // Aggiungi pause
  .replace(/ATTO\s+(I{1,3}|\d+)/gi, (match) => `${match}. `)
  .replace(/\.\s+/g, '. ')            // Normalizza punteggiatura
  .trim();
```

### **Adattamento per Sezioni**
```typescript
// Velocità e emozioni diverse per sezione
const adaptations = {
  prologo: { speed: 0.9, emotion: 'default' },
  atto1: { speed: 1.0, emotion: 'excited' },
  atto2: { speed: 1.1, emotion: 'default' },
  atto3: { speed: 1.0, emotion: 'cheerful' },
  epilogo: { speed: 0.8, emotion: 'friendly' }
};
```

### **Gestione Errori**
- **Timeout**: 90 secondi per generazione
- **Retry Logic**: Fallback automatico a TTS browser
- **Validazione File**: Controllo formato audio per upload
- **Status Feedback**: Messaggi di errore user-friendly

---

## 🔍 TESTING E DEBUG

### **Test Locale**
```bash
# 1. Avvia OpenVoice server
uvicorn openvoice_server:app --host 0.0.0.0 --port 8000

# 2. Testa endpoint
curl -X GET "http://localhost:8000/base_tts/?text=Hello%20world&accent=en-newest&speed=1.0"

# 3. Avvia OpenStory
cd openstory-app
npm start
```

### **Debug Console**
```javascript
// Nel browser, controlla i log
🎙️ Inizio narrazione storia con OpenVoice...
🎙️ Servizio OpenVoice disponibile
🎙️ Preprocessing testo completato
🎙️ Chiamata API OpenVoice...
✅ Narrazione completata in 15.2s usando cuda:0
```

### **Fallback Testing**
```typescript
// Simula OpenVoice offline
REACT_APP_OPENVOICE_API_URL=http://localhost:9999

// Dovrebbe automaticamente usare TTS browser
⚠️ OpenVoice non disponibile, uso TTS browser...
🔄 Fallback a TTS browser...
✅ Narrazione completata usando browser-tts
```

---

## 🌟 ESEMPI D'USO

### **Narrazione Base**
```typescript
const result = await OpenVoiceService.narrateStory(story, {
  accent: 'en-newest',
  speed: 1.0,
  emotion: 'default'
});

if (result.success) {
  // Riproduci audio
  const audio = new Audio(result.audioUrl);
  audio.play();
}
```

### **Voice Cloning**
```typescript
const audioFile = new File([audioData], 'voice.mp3');
const result = await OpenVoiceService.generateClonedVoice(
  story, 
  audioFile, 
  { speed: 1.2, emotion: 'excited' }
);
```

### **Narrazione per Sezioni**
```typescript
const sections = ['prologo', 'atto1', 'atto2', 'atto3', 'epilogo'];

for (const section of sections) {
  const result = await OpenVoiceService.narrateSection(
    sectionText, 
    section, 
    { voice: 'demo_speaker1' }
  );
}
```

---

## 🚨 RISOLUZIONE PROBLEMI

### **OpenVoice non si connette**
```bash
# Verifica che il server sia attivo
curl http://localhost:8000/health

# Controlla i log del server
uvicorn openvoice_server:app --host 0.0.0.0 --port 8000 --log-level debug

# Verifica firewall/porte
netstat -an | grep 8000
```

### **Errore "CUDA out of memory"**
```bash
# Riduci batch size o usa CPU
export CUDA_VISIBLE_DEVICES=""

# Oppure usa modello più piccolo
# Modifica openvoice_server per usare modelli più leggeri
```

### **Voice cloning non funziona**
- **File troppo corto**: Usa audio di almeno 10 secondi
- **Formato non supportato**: Converti in MP3 o WAV
- **Qualità bassa**: Usa audio pulito senza rumore di fondo

### **TTS browser non funziona**
```javascript
// Verifica supporto browser
if ('speechSynthesis' in window) {
  console.log('TTS supportato');
} else {
  console.log('TTS non supportato');
}

// Carica voci
speechSynthesis.getVoices();
```

---

## 🎉 CONCLUSIONE

L'integrazione OpenVoice trasforma OpenStory da un semplice generatore di testi a una **piattaforma completa di storytelling multimediale**. Gli utenti possono ora:

1. **Generare storie** con AI avanzata
2. **Convertire in audio** con voci professionali  
3. **Personalizzare narrazione** con voice cloning
4. **Condividere contenuti** in formato audio/video

**Risultato**: Un'esperienza di storytelling immersiva e accessibile che combina il meglio dell'AI testuale e vocale.

---

*Integrazione completata - OpenStory v2.6 con OpenVoice*
*Data implementazione: Gennaio 2025* 