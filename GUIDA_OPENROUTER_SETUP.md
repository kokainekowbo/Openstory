# 🌐 GUIDA CONFIGURAZIONE OPENROUTER - OpenStory

## ❌ **PROBLEMA RISOLTO: "Non genera correttamente con OpenRouter"**

Abbiamo identificato e risolto i problemi principali con la generazione OpenRouter!

---

## 🔧 **CORREZIONI IMPLEMENTATE**

### **1. Logica di Fallback Corretta**
- ✅ **Prima**: Logica errata che saltava sempre a offline 
- ✅ **Dopo**: Sistema corretto Auto → Online → Offline → Template

### **2. Gestione Errori Migliorata**  
- ✅ **API Key non valida**: Messaggio chiaro all'utente
- ✅ **Crediti esauriti**: Indicazione precisa del problema
- ✅ **Rate limiting**: Gestione automatica dei limiti
- ✅ **Connessione**: Diagnosi problemi di rete

### **3. Logging Dettagliato**
- ✅ **Debug OpenRouter**: Log completi per diagnosi
- ✅ **Parametri chiamata**: Verifica modello e parametri
- ✅ **Response tracking**: Monitoraggio risposta API

---

## 🚀 **COME CONFIGURARE OPENROUTER**

### **Passo 1: Ottieni API Key**
1. Vai su [openrouter.ai](https://openrouter.ai/)
2. Crea un account gratuito
3. Vai in "Keys" nel dashboard
4. Genera una nuova API key
5. Copia la chiave (inizia con `sk-or-v1-`)

### **Passo 2: Configura OpenStory**
Crea un file `.env` in `openstory-app/` e aggiungi:
```
REACT_APP_OPENROUTER_API_KEY=sk-or-v1-la_tua_chiave_qui
```

### **Passo 3: Riavvia l'App**
```bash
cd openstory-app
npm start
```

---

## 🔍 **TESTING E DIAGNOSI**

### **Console Browser (F12)**
OpenStory ora fornisce log dettagliati:

```
🔑 OpenRouter API Key configurata: ✅
🌐 Tentativo generazione online (OpenRouter) - modalità automatica  
🎯 Modello selezionato: openai/gpt-4o-mini
🔗 Chiamando OpenRouter con modello: openai/gpt-4o-mini
📊 Parametri: maxTokens=400, temperature=0.7
✅ Risposta OpenRouter ricevuta (200)
🚀 Generando prologo...
✅ prologo completato (245 caratteri)
```

### **Errori Comuni e Soluzioni**

#### **❌ "API Key OpenRouter non valida"**
- **Causa**: API key errata o mancante
- **Soluzione**: Verifica la chiave nel file `.env`
- **Test**: La chiave deve iniziare con `sk-or-v1-`

#### **❌ "Crediti OpenRouter esauriti"**  
- **Causa**: Account senza crediti
- **Soluzione**: Aggiungi crediti su openrouter.ai
- **Alternativa**: Usa modalità offline gratuita

#### **❌ "Troppi requests OpenRouter"**
- **Causa**: Rate limiting API
- **Soluzione**: Attendi 1-2 minuti e riprova
- **Prevenzione**: Usa modalità auto per fallback

#### **❌ "Servizio OpenRouter temporaneamente non disponibile"**
- **Causa**: Manutenzione server OpenRouter
- **Soluzione**: Modalità automatica passa offline automaticamente

---

## ⚙️ **MODALITÀ DI GENERAZIONE**

### **🤖 Automatico (Consigliato)**
```
Prova OpenRouter → Se fallisce → Groq Offline → Template Emergenza
```
- ✅ **Massima affidabilità**
- ✅ **Qualità ottimale quando possibile**
- ✅ **Sempre una storia garantita**

### **🌐 Solo Online**  
```
Solo OpenRouter → Se fallisce → Errore
```
- ✅ **Massima qualità**
- ❌ **Richiede API key e crediti**
- ❌ **Può fallire**

### **⚡ Solo Offline**
```
Solo Groq → Se fallisce → Template Emergenza  
```
- ✅ **Sempre funziona**
- ✅ **Veloce (10-30s)**
- ✅ **Gratuito**
- ⭐ **Qualità buona ma non eccellente**

---

## 🔧 **PROBLEMI AVANZATI**

### **OpenRouter Lento**
- **Causa**: Modello complesso selezionato
- **Soluzione**: OpenStory sceglie automaticamente il modello migliore
- **Dettagli**: Claude per creatività, GPT-4o-mini per bilanciato

### **Storie Incomplete**
- **Causa**: Timeout o interruzione
- **Soluzione**: Sistema retry automatico (3 tentativi)
- **Fallback**: Modalità auto passa offline se necessario

### **Qualità Bassa**
- **Causa**: Parametri non ottimali
- **Soluzione**: Usa i template ottimizzati integrati
- **Controllo**: Validazione qualità automatica

---

## 📊 **PERFORMANCE ATTESE**

| Modalità | Tempo | Qualità | Affidabilità | Costo |
|----------|-------|---------|--------------|-------|
| **OpenRouter** | 30-90s | ⭐⭐⭐⭐⭐ | Alta* | $0.01-0.05 |
| **Groq Offline** | 10-30s | ⭐⭐⭐⭐ | Massima | Gratuito |
| **Template** | <1s | ⭐⭐⭐ | Massima | Gratuito |

*Dipende da crediti e connessione

---

## 🎯 **RISOLUZIONE RAPIDA**

### **OpenRouter Non Funziona?**
1. ✅ **Controlla console browser** (F12)
2. ✅ **Verifica API key** nel file `.env`
3. ✅ **Controlla crediti** su openrouter.ai
4. ✅ **Usa modalità Auto** per fallback automatico
5. ✅ **Prova modalità Offline** come test

### **Tutto Fallisce?**
- L'app **garantisce sempre una storia** con il template di emergenza
- Anche senza API key l'app funziona in modalità offline
- Il sistema è progettato per **non fallire mai**

---

## 💡 **SUGGERIMENTI PRO**

1. **Usa modalità Auto** per massima affidabilità
2. **Monitora console** per diagnostica
3. **Tieni crediti OpenRouter** per qualità massima  
4. **Groq come backup** sempre disponibile
5. **Template emergenza** garantisce sempre risultato

**L'app ora dovrebbe generare storie correttamente con OpenRouter!** 🚀 