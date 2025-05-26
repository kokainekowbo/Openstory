# 🎭 OpenStory - Generatore di Storie AI Avanzato

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/OpenStory)

OpenStory è un generatore di storie AI avanzato che utilizza modelli di intelligenza artificiale di ultima generazione per creare racconti coinvolgenti con narrazione vocale integrata.

## ✨ Caratteristiche Principali

- 🤖 **14+ Modelli AI Premium**: GPT-4, Claude-3, Gemini-Pro e molti altri via OpenRouter
- 🆓 **Fallback Gratuito**: DeepSeek R1 e V3 per generazione senza limiti
- 🎙️ **Narrazione Vocale**: Integrazione OpenVoice per voci ultra-realistiche
- 🎨 **Generazione Immagini**: Prompt ottimizzati per Fooocus
- 📚 **Generi Dinamici**: Fantasy, Sci-Fi, Horror, Romance e molti altri
- 🔄 **Auto-Correzione**: Sistema intelligente per storie sempre complete

## 🚀 Deploy Rapido su Vercel

### 1. Fork del Repository
```bash
git clone https://github.com/YOUR_USERNAME/OpenStory.git
cd OpenStory
```

### 2. Deploy su Vercel
1. Vai su [vercel.com](https://vercel.com)
2. Clicca "New Project"
3. Importa il repository OpenStory
4. Vercel rileverà automaticamente la configurazione React

### 3. Configurazione Variabili d'Ambiente
Nel dashboard Vercel, aggiungi queste variabili:

```env
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your-key-here
REACT_APP_DEEPSEEK_API_KEY=sk-your-deepseek-key-here
REACT_APP_OPENVOICE_API_URL=http://localhost:8000
```

### 4. Ottieni le Chiavi API

#### OpenRouter (Obbligatoria)
1. Vai su [openrouter.ai](https://openrouter.ai/keys)
2. Crea un account e genera una chiave API
3. Aggiungi credito (minimo $5 consigliato)

#### DeepSeek (Gratuita)
1. Vai su [platform.deepseek.com](https://platform.deepseek.com/api_keys)
2. Crea un account e genera una chiave API
3. Ricevi $10 di credito gratuito

## 🛠️ Sviluppo Locale

### Prerequisiti
- Node.js 16+
- npm o yarn

### Installazione
```bash
cd openstory-app
npm install
```

### Configurazione
1. Copia `.env.example` in `.env`
2. Inserisci le tue chiavi API
3. Avvia l'applicazione:

```bash
npm start
```

L'app sarà disponibile su `http://localhost:3002`

## 📁 Struttura del Progetto

```
OpenStory/
├── openstory-app/          # App React principale
│   ├── src/
│   │   ├── components/     # Componenti React
│   │   ├── services/       # Servizi API
│   │   ├── store/          # State management
│   │   └── theme/          # Temi e stili
│   ├── public/             # File statici
│   └── package.json        # Dipendenze
├── docs/                   # Documentazione
├── vercel.json            # Configurazione Vercel
└── README.md              # Questo file
```

## 🎯 Funzionalità Avanzate

### Generazione Storie
- **Modelli Premium**: GPT-4o, Claude-3.5-Sonnet, Gemini-1.5-Pro
- **Fallback Intelligente**: OpenRouter → DeepSeek → Template emergenza
- **Auto-Correzione**: Sistema che garantisce storie sempre complete

### Narrazione Vocale
- **Voci Ultra-Realistiche**: Integrazione OpenVoice
- **Supporto Multilingua**: Italiano, Inglese e altre lingue
- **Controlli Audio**: Play, pausa, velocità personalizzabile

### Generazione Immagini
- **Prompt Fooocus**: Descrizioni ottimizzate per AI art
- **Stili Multipli**: Realistico, artistico, fantasy
- **Integrazione Seamless**: Prompt generati automaticamente

## 🔧 Configurazione Avanzata

### OpenVoice (Opzionale)
Per abilitare la narrazione vocale:

1. Installa OpenVoice localmente
2. Avvia il server su porta 8000
3. Configura `REACT_APP_OPENVOICE_API_URL`

### Personalizzazione Modelli
Modifica `openstory-app/src/services/OpenRouterService.ts` per:
- Aggiungere nuovi modelli
- Modificare parametri di generazione
- Personalizzare prompt

## 📊 Architettura

### Flusso di Generazione
1. **Input Utente**: Genere, lunghezza, stile
2. **Selezione Modello**: Automatica o manuale
3. **Generazione**: OpenRouter → DeepSeek (fallback)
4. **Post-Processing**: Auto-correzione e validazione
5. **Output**: Storia + Narrazione + Prompt immagini

### Servizi Integrati
- **OpenRouterService**: Gestione modelli premium
- **DeepSeekService**: Fallback gratuito e reasoning
- **OpenVoiceService**: Narrazione vocale
- **StoryValidator**: Validazione e correzione

## 🐛 Risoluzione Problemi

### Errori Comuni
- **API Key Invalid**: Verifica le chiavi in Vercel
- **Rate Limit**: Usa DeepSeek come fallback
- **Build Failed**: Controlla le dipendenze in `package.json`

### Debug
1. Controlla i log Vercel
2. Verifica le variabili d'ambiente
3. Testa localmente prima del deploy

## 🤝 Contribuire

1. Fork del repository
2. Crea un branch feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

Questo progetto è sotto licenza MIT. Vedi `LICENSE` per dettagli.

## 🙏 Ringraziamenti

- OpenRouter per l'accesso ai modelli AI
- DeepSeek per il servizio gratuito
- OpenVoice per la sintesi vocale
- Fooocus per la generazione immagini

---

**Creato con ❤️ per la community italiana di AI storytelling** 