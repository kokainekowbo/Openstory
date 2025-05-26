# 🎭 OpenStory - Generatore di Storie AI Avanzato

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kokainekowbo/Openstory)

OpenStory è un generatore di storie AI avanzato che utilizza modelli di intelligenza artificiale di ultima generazione per creare racconti coinvolgenti con narrazione vocale integrata.

## ✨ Caratteristiche Principali

- 🤖 **14+ Modelli AI Premium**: GPT-4, Claude-3, Gemini-Pro e molti altri via OpenRouter
- 🆓 **Fallback Gratuito**: DeepSeek R1 e V3 per generazione senza limiti
- 🎙️ **Narrazione Vocale**: Integrazione OpenVoice per voci ultra-realistiche
- 🎨 **Generazione Immagini**: Prompt ottimizzati per Fooocus
- 📚 **Generi Dinamici**: Fantasy, Sci-Fi, Horror, Romance e molti altri
- 🔄 **Auto-Correzione**: Sistema intelligente per storie sempre complete

## 🚀 Deploy Rapido su Vercel

### 1. Deploy Automatico (1 Click)
Clicca il pulsante "Deploy with Vercel" sopra per deployare automaticamente.

### 2. Configurazione Variabili d'Ambiente
Nel dashboard Vercel, aggiungi queste variabili:

```env
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your-key-here
REACT_APP_DEEPSEEK_API_KEY=sk-your-deepseek-key-here
REACT_APP_OPENVOICE_API_URL=http://localhost:8000
```

### 3. Ottieni le Chiavi API

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
git clone https://github.com/kokainekowbo/Openstory.git
cd Openstory/openstory-app
npm install
```

### Configurazione
1. Crea un file `.env` in `openstory-app/`
2. Inserisci le tue chiavi API:

```env
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your-key-here
REACT_APP_DEEPSEEK_API_KEY=sk-your-deepseek-key-here
REACT_APP_OPENVOICE_API_URL=http://localhost:8000
```

### Avvio
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

## 🎯 Funzionalità

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