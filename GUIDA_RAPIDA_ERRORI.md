# 🚨 GUIDA RAPIDA RISOLUZIONE ERRORI

## ❌ **ERRORE PIÙ COMUNE**: npm start fallisce

### 🔍 **CAUSA**: Directory sbagliata
```
npm error code ENOENT
npm error path C:\...\OpenStory\package.json
```

### ✅ **SOLUZIONE**:
1. **SEMPRE** entrare nella directory corretta:
   ```bash
   cd openstory-app
   npm start
   ```

2. **MAI** fare `npm start` dalla directory root `OpenStory/`

---

## 🔧 **ERRORI TYPESCRIPT COMUNI**

### ❌ **userPrompt does not exist**
- **RISOLTO** ✅ - Ora usa `userPromptTemplate`

### ❌ **Parameter implicitly has 'any' type**
- **RISOLTO** ✅ - Tipi espliciti aggiunti

---

## 🌐 **COME AVVIARE CORRETTAMENTE**

### 📁 **METODO 1: Batch File**
```bash
# Clicca su AVVIA_OPENSTORY.bat (dalla cartella principale)
```

### 💻 **METODO 2: Terminal**
```bash
cd openstory-app
npm start
```

### 🌍 **METODO 3: PowerShell**
```powershell
Set-Location openstory-app
npm start
```

---

## 🔑 **CONFIGURAZIONE API KEY**

### ❌ **Se API non funziona**:
1. Verifica file `.env` in `openstory-app/.env`
2. Controlla che contenga:
   ```env
   REACT_APP_OPENROUTER_API_KEY=sk-or-v1-TUA_CHIAVE_QUI
   REACT_APP_API_TIMEOUT=120000
   ```

### 🧪 **Test API**:
- Vai su `http://localhost:3001/test`
- Clicca "Testa Connessione"

---

## 📍 **URLS IMPORTANTI**

- **🏠 Home**: `http://localhost:3001/`
- **🎬 Demo**: `http://localhost:3001/demo`  
- **🔧 Test**: `http://localhost:3001/test`
- **ℹ️ Info**: `http://localhost:3001/about`

---

## 🚀 **RISOLUZIONE RAPIDA**

Se qualcosa non funziona:

1. **Ctrl+C** per fermare il server
2. `cd openstory-app` (assicurati di essere nella directory giusta)
3. `npm start` per riavviare
4. Vai su `http://localhost:3001`

---

## 🆘 **DEBUG AVANZATO**

### 🔍 **Se l'app non si apre**:
```bash
# Verifica che il server sia in esecuzione
netstat -an | findstr :3001
```

### 🔄 **Se ci sono errori di compilazione**:
```bash
# Pulisci e riavvia
npm run build
npm start
```

### 🧹 **Reset completo**:
```bash
cd openstory-app
rm -rf node_modules
npm install
npm start
```

---

## ✅ **CHECKLIST FUNZIONAMENTO**

- [ ] Sono nella directory `openstory-app/`
- [ ] File `.env` configurato con API key
- [ ] `npm start` eseguito senza errori
- [ ] Browser aperto su `localhost:3001`
- [ ] Interfaccia caricata correttamente

**🎯 Se tutti i punti sono ✅, l'app dovrebbe funzionare perfettamente!** 