# 🚀 Guida Setup Completo OpenStory

Questa guida ti aiuterà a configurare e testare completamente l'applicazione OpenStory.

## 📋 Prerequisiti

- ✅ Node.js (versione 16 o superiore)
- ✅ npm o yarn
- ✅ Connessione internet
- ✅ Account OpenRouter (gratuito)

## 🔧 Step 1: Configurazione API Key

### 1.1 Ottieni API Key OpenRouter
1. Vai su https://openrouter.ai/
2. Registrati gratuitamente
3. Vai in "API Keys" nel dashboard
4. Crea una nuova API key
5. Copia la chiave (inizia con `sk-or-v1-...`)

### 1.2 Configura il file .env
Nella directory `openstory-app/`, crea un file chiamato `.env`:

```env
# Configurazione OpenRouter per OpenStory
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-your-actual-api-key-here

# Configurazioni opzionali
REACT_APP_APP_NAME=OpenStory
REACT_APP_VERSION=1.0.0
```

**⚠️ IMPORTANTE:** Sostituisci `sk-or-v1-your-actual-api-key-here` con la tua API key reale!

## 🏃‍♂️ Step 2: Avvio Applicazione

### Opzione A: Usando il file batch (Consigliato)
```cmd
# Dalla directory principale del progetto
AVVIA_OPENSTORY.bat
```

### Opzione B: Manuale
```cmd
# Naviga nella directory dell'app
cd openstory-app

# Avvia l'applicazione
npm start
```

L'applicazione si aprirà automaticamente su `http://localhost:3001`

## 🧪 Step 3: Test delle API

### Test Rapido dalla Console Browser
1. Apri l'applicazione nel browser (`http://localhost:3001`)
2. Apri gli strumenti sviluppatore (F12)
3. Vai nella console
4. Esegui questo comando:

```javascript
// Test rapido configurazione
testOpenStory();
```

### Test Manuale Completo

#### 3.1 Test Configurazione
Verifica che l'API key sia configurata correttamente:
- L'app dovrebbe caricarsi senza errori di configurazione
- Non dovrebbero apparire messaggi di "API key mancante"

#### 3.2 Test Connessione
Prova a generare una storia breve:
1. Compila il form con parametri semplici:
   - **Genere:** Action/Thriller
   - **Protagonista:** Nome e tipo
   - **Ambientazione:** Luogo e tempo
   - **Lunghezza:** Breve

2. Clicca "Genera Storia"

#### 3.3 Risultati Attesi
✅ **Successo:** La storia viene generata senza errori
✅ **Progresso:** Vedi indicatori di progresso durante la generazione
✅ **Contenuto:** Storia con almeno 500 caratteri

❌ **Errori Comuni:**
- "API Key non valida" → Verifica la chiave nel file .env
- "Connessione fallita" → Verifica internet e firewall
- "Crediti esauriti" → Account OpenRouter senza crediti

## 📊 Step 4: Monitoring e Debug

### Console Browser (F12)
Monitora questi log durante l'uso:
```
🎯 Modello selezionato: [nome-modello]
🔗 Chiamando OpenRouter con modello: [nome-modello]
✅ Risposta OpenRouter ricevuta (200)
📝 Generazione sezione: prologo (1/4)
✅ Sezione prologo generata con successo
```

### Errori da Risolvere
```
❌ API Key OpenRouter non valida
→ Soluzione: Verifica il file .env

❌ Crediti OpenRouter esauriti
→ Soluzione: Aggiungi crediti su openrouter.ai

❌ Troppi requests OpenRouter
→ Soluzione: Aspetta qualche minuto prima di riprovare
```

## 🎮 Step 5: Test Funzionalità Avanzate

### Test Generazione Multi-Sezione
1. Imposta lunghezza "Media" o "Lunga"
2. Osserva la generazione sezione per sezione:
   - Prologo
   - Atto I
   - Atto II  
   - Atto III

### Test Diversi Generi
Prova tutti i generi disponibili:
- ✅ Action/Thriller
- ✅ Romantic Comedy
- ✅ Horror
- ✅ Fantasy
- ✅ Science Fiction

### Test Personalizzazioni
- Personaggi multipli
- Ambientazioni dettagliate
- Elementi di trama specifici
- Diverse lunghezze

## 🚨 Risoluzione Problemi

### Problema: App non si avvia
**Sintomi:** Errore `package.json not found`
**Soluzione:** 
```cmd
# Assicurati di essere nella directory corretta
cd openstory-app
npm start
```

### Problema: Pagina bianca
**Sintomi:** Browser si apre ma pagina vuota
**Soluzione:**
1. Verifica che l'app giri sulla porta corretta (3001)
2. Vai manualmente su `http://localhost:3001`
3. Controlla la console browser per errori

### Problema: Storia non genera
**Sintomi:** Form si invia ma nessuna storia
**Soluzione:**
1. Verifica file `.env` con API key corretta
2. Controlla crediti OpenRouter su openrouter.ai
3. Verifica connessione internet

### Problema: Errori TypeScript
**Sintomi:** Warning nell'app ma funziona
**Soluzione:** Ignorare, sono warning di sviluppo non critici

## ✅ Checklist Finale

Prima di usare l'app in produzione:

- [ ] ✅ File `.env` creato con API key valida
- [ ] ✅ App si avvia senza errori su porta 3001
- [ ] ✅ Test connessione OpenRouter riuscito
- [ ] ✅ Generazione storia breve funziona
- [ ] ✅ Tutti i generi testati
- [ ] ✅ Nessun errore critico nella console

## 🎉 Successo!

Se tutti i test passano, OpenStory è configurato correttamente e pronto per l'uso!

**Per supporto:** Controlla i log della console browser e verifica la configurazione.

---

*OpenStory v1.0 - Generatore di Storie AI* 