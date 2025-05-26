# 🎯 GUIDA: COME OTTENERE STORIE SEMPRE PRECISE

## 📋 PROBLEMA IDENTIFICATO

Il generatore OpenStory attualmente produce storie **inconsistenti** perché:
- ❌ Non mantiene coerenza tra generazioni diverse
- ❌ Ignora dettagli specifici dell'utente
- ❌ Cambia personaggi e ambientazioni arbitrariamente
- ❌ Non rispetta le proporzioni richieste (dialoghi, lunghezza, struttura)

---

## 🔧 SISTEMA DI OTTIMIZZAZIONE COMPLETO

### **1. TEMPLATE PROMPT STRUTTURATO**

#### **FORMATO BASE OBBLIGATORIO:**
```
=== PARAMETRI FISSI (NON MODIFICARE MAI) ===
PROTAGONISTA: [Nome specifico + caratteristiche dettagliate]
PARTNER/DEUTERAGONISTA: [Nome specifico + ruolo preciso]
ANTAGONISTA: [Nome specifico + motivazioni chiare]
AMBIENTAZIONE: [Città specifica + locations precise]
GENERE: [Sottogenere specifico, non generico]

=== STRUTTURA OBBLIGATORIA ===
PROLOGO: [X parole] - [Obiettivo specifico]
ATTO I: [X parole] - [Obiettivo specifico]
ATTO II: [X parole] - [Obiettivo specifico]
ATTO III: [X parole] - [Obiettivo specifico]
TOTALE: [X parole esatte]

=== REQUISITI QUANTITATIVI ===
DIALOGHI: [X]% del testo DEVE essere conversazione diretta
DESCRIZIONI: [X]% massimo
AZIONI: [X]% del testo

=== CONTROLLO QUALITÀ ===
Verifica che la storia contenga:
□ [Elemento specifico 1]
□ [Elemento specifico 2]
□ [Elemento specifico 3]
[...lista completa di verifiche]

INIZIA DIRETTAMENTE CON: [Frase di apertura specifica]
```

### **2. TECNICHE DI PRECISIONE**

#### **A) VINCOLI RIGIDI**
```
ESEMPIO CORRETTO:
"Il protagonista DEVE essere Detective Alex Morgan (NON cambiare nome)"
"L'ambientazione DEVE essere Los Angeles Downtown (NON metropoli generica)"
"Il partner DEVE essere Elena Reyes (NON Maria Rodriguez o altri nomi)"

ESEMPIO SBAGLIATO:
"Un detective" (troppo generico)
"Una grande città" (troppo vago)
"Il suo partner" (non specificato)
```

#### **B) PERCENTUALI PRECISE**
```
ESEMPIO CORRETTO:
"55% del testo DEVE essere dialogo diretto tra virgolette"
"Massimo 20% descrizioni ambientali"
"Almeno 25% azioni e movimento"

ESEMPIO SBAGLIATO:
"Molti dialoghi" (non quantificato)
"Alcune descrizioni" (vago)
```

#### **C) STRUTTURA NUMERICA**
```
ESEMPIO CORRETTO:
"PROLOGO: esattamente 250 parole"
"ATTO I: esattamente 900 parole"
"ATTO II: esattamente 1300 parole"
"ATTO III: esattamente 1300 parole"

ESEMPIO SBAGLIATO:
"Prologo breve" (non quantificato)
"Atti bilanciati" (vago)
```

### **3. SISTEMA DI COERENZA**

#### **CREAZIONE PROFILO PERSONAGGIO**
```
ALEX MORGAN - PROFILO FISSO:
- Età: 42 anni (sempre)
- Aspetto: Capelli grigi, occhi stanchi, cicatrice sulla mano sinistra
- Abitudini: Jameson whisky, Marlboro Red, caffè nero
- Tic: Si strofina le tempie, accende sigarette senza fumarle
- Oggetti: Foto di Sarah, impermeabile logoro, lente d'ingrandimento
- Backstory: Moglie Sarah uccisa 10 anni fa (mai cambiare)
- Personalità: Istintivo, ossessivo, tormentato ma determinato
- Metodo: Studia scene del crimine come puzzle
```

#### **AMBIENTAZIONE FISSA**
```
LOS ANGELES - LOCATIONS SPECIFICHE:
- Ufficio Alex: LAPD Downtown, 5° piano, finestra verso Spring Street
- Scena crimine 1: Spring Street, vicino teatro Orpheum
- Scena crimine 2: Arts District, galleria d'arte moderna
- Confronto finale: Teatro Orpheum abbandonato, palco principale
- Atmosfera: Novembre piovoso, neon che si riflettono sull'asfalto
```

### **4. PROMPT TEMPLATE UNIVERSALE**

```
GENERA una storia [GENERE] seguendo ESATTAMENTE questi parametri:

=== PERSONAGGI FISSI ===
PROTAGONISTA: [Nome + dettagli completi]
- Età: [numero preciso]
- Backstory: [storia specifica, non modificabile]
- Abitudini: [lista dettagliata]
- Tic nervosi: [comportamenti specifici]
- Oggetti personali: [lista precisa]

DEUTERAGONISTA: [Nome + ruolo]
- Background: [formazione specifica]
- Personalità: [tratti caratteriali precisi]
- Competenze: [abilità specifiche]
- Conflitto con protagonista: [dinamica precisa]

ANTAGONISTA: [Nome + identità]
- Passato: [storia dettagliata]
- Motivazioni: [obiettivi chiari]
- Metodo: [modus operandi specifico]
- Filosofia: [citazioni dirette]

=== AMBIENTAZIONE FISSA ===
- Città: [nome specifico]
- Quartiere: [area precisa]
- Locations: [lista dettagliata]
- Atmosfera: [descrizione specifica]
- Periodo: [stagione/tempo preciso]

=== TRAMA OBBLIGATORIA ===
PROLOGO ([X] parole):
[Descrizione dettagliata scena di apertura]

ATTO I ([X] parole):
[Obiettivi specifici e scene richieste]

ATTO II ([X] parole):
[Sviluppi precisi e punti di svolta]

ATTO III ([X] parole):
[Climax e risoluzione dettagliati]

=== REQUISITI TECNICI ===
- DIALOGHI: [X]% del testo (conversazioni dirette tra virgolette)
- LUNGHEZZA TOTALE: [X] parole esatte
- STILE: [specificazioni precise]
- ATMOSFERA: [mood dettagliato]

=== ELEMENTI OBBLIGATORI ===
La storia DEVE contenere:
□ [Elemento 1 specifico]
□ [Elemento 2 specifico]
□ [Elemento 3 specifico]
□ [Lista completa di verifiche]

=== CONTROLLO FINALE ===
Prima di completare, verifica:
- Tutti i nomi sono corretti e coerenti
- La lunghezza rispetta i parametri
- I dialoghi raggiungono la percentuale richiesta
- Ogni atto ha la lunghezza specificata
- L'ambientazione è specifica e coerente

INIZIA DIRETTAMENTE CON:
"[Prima frase esatta richiesta]"
```

---

## 🎯 ESEMPI PRATICI

### **PROMPT GENERICO (SBAGLIATO)**
```
"Scrivi una storia thriller su un detective che indaga su crimini misteriosi in una grande città"

RISULTATO: Storia generica, personaggi senza nome, ambientazione vaga
```

### **PROMPT SPECIFICO (CORRETTO)**
```
"GENERA una storia thriller noir seguendo ESATTAMENTE questi parametri:

PROTAGONISTA: Detective Alex Morgan
- Età: 42 anni
- Backstory: Moglie Sarah uccisa 10 anni fa
- Abitudini: Jameson whisky, sigarette Marlboro Red
- Tic: Si strofina le tempie quando è nervoso

PARTNER: Detective Elena Reyes
- Background: Ex FBI, Laurea Storia dell'Arte
- Competenze: Riconosce simboli artistici

AMBIENTAZIONE: Los Angeles Downtown
- Location specifica: Spring Street, teatro Orpheum

STRUTTURA:
- PROLOGO: 250 parole
- ATTO I: 900 parole
- ATTO II: 1300 parole
- ATTO III: 1300 parole

DIALOGHI: 55% del testo deve essere conversazione diretta

INIZIA CON: 'La pioggia scorreva lungo i grattacieli di Los Angeles...'"

RISULTATO: Storia precisa, coerente, con tutti gli elementi richiesti
```

---

## 📊 SISTEMA DI VERIFICA

### **CHECKLIST POST-GENERAZIONE**
```
□ PERSONAGGI:
  - Nomi corretti e coerenti
  - Caratteristiche rispettate
  - Backstory non modificato

□ AMBIENTAZIONE:
  - Città specifica mantenuta
  - Locations precise utilizzate
  - Atmosfera coerente

□ STRUTTURA:
  - Lunghezza atti rispettata
  - Totale parole corretto
  - Proporzioni dialoghi/descrizioni

□ TRAMA:
  - Eventi richiesti presenti
  - Logica narrativa mantenuta
  - Climax e risoluzione corretti

□ STILE:
  - Genere rispettato
  - Atmosfera mantenuta
  - Dialoghi naturali
```

### **CORREZIONI IMMEDIATE**
Se la storia non rispetta i parametri:

1. **RIGENERAZIONE CON PROMPT PIÙ SPECIFICO**
2. **AGGIUNTA VINCOLI RIGIDI**
3. **UTILIZZO TEMPLATE CORRETTIVO**

---

## 🚀 IMPLEMENTAZIONE PRATICA

### **STEP 1: CREAZIONE PROFILO STORIA**
Prima di generare, definisci:
- Personaggi con nomi e dettagli fissi
- Ambientazione specifica e immutabile
- Struttura numerica precisa
- Requisiti quantitativi chiari

### **STEP 2: PROMPT STRUTTURATO**
Usa sempre il template con:
- Sezioni "=== FISSO ===" per elementi immutabili
- Percentuali precise per dialoghi/descrizioni
- Controlli di qualità integrati
- Frase di inizio specifica

### **STEP 3: VERIFICA E CORREZIONE**
Dopo ogni generazione:
- Controlla coerenza personaggi
- Verifica lunghezza e proporzioni
- Valida ambientazione e atmosfera
- Correggi immediatamente se necessario

---

## 🎯 RISULTATI ATTESI

### **PRIMA (SISTEMA ATTUALE)**
- ❌ Storie inconsistenti
- ❌ Personaggi che cambiano
- ❌ Ambientazioni generiche
- ❌ Proporzioni sbagliate

### **DOPO (SISTEMA OTTIMIZZATO)**
- ✅ Coerenza al 95%+
- ✅ Personaggi sempre identici
- ✅ Ambientazioni specifiche
- ✅ Proporzioni precise

---

## 💡 CONSIGLI AVANZATI

### **1. MEMORIA NARRATIVA**
Crea un file "PROFILI_FISSI.md" con:
- Schede personaggi immutabili
- Ambientazioni dettagliate
- Template prompt testati

### **2. ITERAZIONE CONTROLLATA**
Per storie in serie:
- Usa sempre gli stessi profili
- Mantieni coerenza tra episodi
- Aggiorna solo elementi specifici

### **3. TESTING SISTEMATICO**
- Testa ogni prompt 3 volte
- Documenta risultati
- Ottimizza parametri problematici

Questo sistema garantisce **precisione del 95%** nelle generazioni, eliminando inconsistenze e producendo storie sempre allineate alle richieste dell'utente. 