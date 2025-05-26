# 📚 OpenStory - Generatore di Storie AI Avanzato

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/kokainekowbo/Openstory)

## 🚀 **VERSIONE 2.8.0 - CONFIGURAZIONE OTTIMIZZATA**

### ✨ **CARATTERISTICHE PRINCIPALI**

#### 🏆 **MODELLI AI DI ULTIMA GENERAZIONE**
- **Gemini 2.0 Flash Experimental** - Velocità TTFT superiore, 1.05M context
- **Llama 4 Scout** - 17B MoE multimodale, 200K context
- **DeepSeek Prover V2** - 671B parametri, specializzato in logica
- **DeepSeek R1T Chimera** - Reasoning avanzato, efficienza token

#### 🔄 **SISTEMA FALLBACK INTELLIGENTE**
1. **OpenRouter** (14 modelli premium) - Qualità massima
2. **DeepSeek** (Backup gratuito) - Reasoning avanzato
3. **Template di emergenza** - Sempre funzionante

#### 🎙️ **NARRAZIONE VOCALE OPENVOICE**
- ✅ Genera narrazioni vocali per ogni sezione
- 🎭 Voci ottimizzate per tipo di sezione
- 🇮🇹 Supporto italiano con accenti personalizzabili
- 💾 Download audio in formato WAV

#### 🎨 **GENERAZIONE PROMPT FOOOCUS**
- ✅ Prompt dettagliati per ogni sezione
- 🖼️ Ottimizzati per Fooocus e altri generatori AI
- 📋 Copia facile negli appunti

---

## 🛠️ **INSTALLAZIONE E CONFIGURAZIONE**

### **1. Clona il Repository**
```bash
git clone https://github.com/your-username/OpenStory.git
cd OpenStory
```

### **2. Installa le Dipendenze**
```bash
cd openstory-app
npm install
```

### **3. Configura le API Keys**
Crea un file `.env` in `openstory-app/` con:

```env
# 🔑 OPENROUTER API KEY (Principale)
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your-key-here

# 🧠 DEEPSEEK API KEY (Backup Gratuito)
REACT_APP_DEEPSEEK_API_KEY=sk-your-deepseek-key-here

# 🎙️ OPENVOICE API URL (Opzionale)
REACT_APP_OPENVOICE_API_URL=http://localhost:8000
```

### **4. Avvia l'Applicazione**
```bash
npm start
```

L'app sarà disponibile su `http://localhost:3002`

---

## 🎯 **COME OTTENERE LE API KEYS**

### **🌐 OpenRouter (Principale)**
1. Vai su [openrouter.ai](https://openrouter.ai/)
2. Crea un account gratuito
3. Vai in "Keys" nel dashboard
4. Genera una nuova API key
5. Copia la chiave (inizia con `sk-or-v1-`)

### **🧠 DeepSeek (Backup Gratuito)**
1. Vai su [platform.deepseek.com](https://platform.deepseek.com/)
2. Registrati per un account gratuito
3. Vai in "API Keys"
4. Genera una nuova chiave
5. Copia la chiave (inizia con `sk-`)

---

## 🎮 **UTILIZZO**

### **📝 Generazione Storie**
1. **Seleziona il genere** dalla lista intelligente
2. **Configura i parametri** (personaggi, ambientazione, trama)
3. **Clicca "Genera Storia"** - Il sistema userà automaticamente il miglior modello disponibile
4. **Attendi la generazione** (30-120 secondi)

### **🎙️ Narrazione Vocale**
1. **Genera prima una storia**
2. **Clicca "Genera Narrazioni"** per tutte le sezioni
3. **Oppure clicca l'icona 🎙️** per singole sezioni
4. **Scarica gli audio** in formato WAV

### **🎨 Prompt per Immagini**
1. **Genera una storia**
2. **Clicca "Genera Prompt Fooocus"**
3. **Copia i prompt** negli appunti
4. **Incolla in Fooocus** per creare le immagini

---

## 🔧 **RISOLUZIONE PROBLEMI**

### **❌ "API Key non valida"**
- Verifica che la chiave OpenRouter sia corretta
- Assicurati che inizi con `sk-or-v1-`
- Controlla che il file `.env` sia nella directory `openstory-app/`

### **❌ "Crediti esauriti"**
- Aggiungi crediti su openrouter.ai
- Il sistema passerà automaticamente a DeepSeek (gratuito)

### **❌ "Generazione fallita"**
- Il sistema proverà automaticamente DeepSeek come backup
- Se tutto fallisce, verrà usato un template di emergenza

---

## 📊 **CARATTERISTICHE TECNICHE**

### **🏗️ Architettura**
- **Frontend**: React 19 + TypeScript
- **Styling**: Styled Components
- **State Management**: React Hooks + Zustand
- **API**: OpenRouter + DeepSeek

### **🎯 Modelli Supportati**
- **OpenRouter**: 14+ modelli premium
- **DeepSeek**: R1, V3, Prover V2, Chimera
- **Fallback**: Template intelligenti

### **🔒 Sicurezza**
- API keys gestite tramite variabili d'ambiente
- Nessun dato sensibile nel codice
- Validazione input lato client

---

## 🚀 **DEPLOYMENT SU VERCEL**

### **1. Prepara il Progetto**
```bash
cd openstory-app
npm run build
```

### **2. Deploy su Vercel**
```bash
npm install -g vercel
vercel --prod
```

### **3. Configura le Variabili d'Ambiente**
Nel dashboard Vercel, aggiungi:
- `REACT_APP_OPENROUTER_API_KEY`
- `REACT_APP_DEEPSEEK_API_KEY`
- `REACT_APP_OPENVOICE_API_URL`

---

## 📈 **ROADMAP**

### **🎯 Prossime Funzionalità**
- [ ] Supporto per più lingue
- [ ] Editor di storie integrato
- [ ] Esportazione in PDF/EPUB
- [ ] Condivisione social
- [ ] Modalità collaborativa

### **🔧 Miglioramenti Tecnici**
- [ ] Cache intelligente
- [ ] Ottimizzazione performance
- [ ] PWA support
- [ ] Modalità offline avanzata

---

## 🤝 **CONTRIBUIRE**

1. Fork il repository
2. Crea un branch per la tua feature
3. Commit le modifiche
4. Push al branch
5. Apri una Pull Request

---

## 📄 **LICENZA**

Questo progetto è rilasciato sotto licenza MIT. Vedi il file `LICENSE` per i dettagli.

---

## 🙏 **RINGRAZIAMENTI**

- **OpenRouter** per l'accesso ai modelli premium
- **DeepSeek** per i modelli gratuiti di alta qualità
- **OpenVoice** per la tecnologia di sintesi vocale
- **Fooocus** per la generazione di immagini AI

---

**🎉 Buona scrittura con OpenStory!** 