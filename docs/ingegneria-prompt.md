# Ingegneria dei Prompt - OpenStory

L'ingegneria dei prompt è il cuore dell'applicazione OpenStory. La qualità delle storie generate dipende direttamente dalla qualità dei prompt inviati ai modelli AI.

## Principi Fondamentali

1. **Specificità e Chiarezza**: I prompt devono essere specifici e chiari sullo stile, il tono e gli elementi narrativi richiesti.

2. **Struttura Coerente**: Tutti i prompt seguiranno una struttura simile per facilitare la generazione di storie coerenti.

3. **Arricchimento Contestuale**: Aggiungere dettagli che arricchiscono il contesto ma lasciano spazio alla creatività dell'AI.

4. **Controllo Qualitativo**: Includere istruzioni specifiche sulla qualità attesa (complessità dei personaggi, archi narrativi, dialoghi).

## Struttura Base dei Prompt

```
Genera una [lunghezza_storia] nel genere [genere] con tono [tono] ambientata in [ambientazione].

Il protagonista è [descrizione_protagonista] che vuole [obiettivo_protagonista].
L'antagonista è [descrizione_antagonista] motivato da [motivazione_antagonista].

La storia dovrebbe includere i seguenti elementi:
- [elemento_trama_1]
- [elemento_trama_2]
- [elemento_trama_3]

Usa la struttura narrativa [struttura_narrativa].

Requisiti stilistici:
- Dialoghi vivaci e caratterizzanti
- Descrizioni immersive ma concise
- Sviluppo personaggi complesso
- [altri_requisiti_stilistici]

La storia dovrebbe seguire lo stile di scrittura di film/sceneggiature hollywoodiane commerciali di successo, con tensione narrativa costante e colpi di scena coinvolgenti.
```

## Esempi di Prompt Specifici

### Esempio 1: Thriller d'Azione

```
Genera una sinossi nel genere thriller d'azione con tono cupo ambientata in una Tokyo futuristica del 2085.

Il protagonista è un ex-agente delle forze speciali ora cacciatore di taglie, tormentato dalla perdita della famiglia, che vuole vendicarsi della corporazione responsabile di un attacco terroristico.
L'antagonista è un CEO di una megacorporazione apparentemente filantropo, ma segretamente coinvolto nel traffico di tecnologie illegali, motivato dal desiderio di controllo totale sulla società.

La storia dovrebbe includere i seguenti elementi:
- Una tecnologia sperimentale che altera i ricordi
- Un tradimento da parte di un alleato fidato
- Una corsa contro il tempo per fermare un attacco su scala globale

Usa la struttura narrativa in tre atti con un doppio colpo di scena nel terzo atto.

Requisiti stilistici:
- Dialoghi essenziali e incisivi
- Ambientazione cyberpunk dettagliata ma non eccessiva
- Ritmo narrativo incalzante con momenti di introspezione
- Sottotrama romantica minima ma significativa

La storia dovrebbe seguire lo stile di scrittura di film hollywoodiani commerciali di successo come "John Wick" e "Mission: Impossible", con tensione narrativa costante e colpi di scena coinvolgenti.
```

### Esempio 2: Commedia Romantica

```
Genera un breve racconto nel genere commedia romantica con tono leggero e satirico ambientato in una piccola cittadina costiera italiana.

La protagonista è una chef ambiziosa di New York, workaholic e perfezionista, che vuole aprire un ristorante stellato ma si ritrova bloccata in Italia per un'emergenza familiare.
L'antagonista è il proprietario di un ristorante locale tradizionale, testardo e diffidente verso le innovazioni culinarie, motivato dalla preservazione delle tradizioni familiari.

La storia dovrebbe includere i seguenti elementi:
- Un malinteso culturale comico che diventa ricorrente
- Una gara culinaria decisiva
- Una ricetta segreta di famiglia con un significato emotivo

Usa la struttura narrativa del viaggio dell'eroe con focus sulla trasformazione personale.

Requisiti stilistici:
- Dialoghi brillanti con doppi sensi e umorismo situazionale
- Descrizioni sensoriali del cibo e dell'ambientazione
- Personaggi secondari eccentrici ma credibili
- Sottotesto emotivo sotto la superficie comica

La storia dovrebbe seguire lo stile di scrittura di film hollywoodiani commerciali di successo come "Il diavolo veste Prada" e "Mangia, prega, ama", con situazioni comiche ma profondità emotiva crescente.
```

## Strategie di Ottimizzazione

1. **Test A/B dei Prompt**: Testare diverse formulazioni di prompt per lo stesso scenario e valutare quale produce risultati migliori.

2. **Analisi Qualitativa**: Analizzare criticamente ogni storia generata per identificare punti deboli nei prompt.

3. **Raffinamento Iterativo**: Migliorare costantemente i template dei prompt in base ai feedback e ai risultati.

4. **Personalizzazione per Modello**: Adattare i prompt per funzionare meglio con modelli AI specifici disponibili attraverso OpenRouter.

## Gestione delle Limitazioni

1. **Lunghezza**: Per storie più lunghe, considerare di generare sezioni separate (atti o capitoli) mantenendo la coerenza.

2. **Coerenza Tematica**: Includere elementi chiave ricorrenti nel prompt per mantenere la coerenza tematica.

3. **Controllo Stilistico**: Specificare esplicitamente lo stile di scrittura desiderato con riferimenti a opere/autori conosciuti.

## Metrica di Valutazione

Svilupperemo una rubrica di valutazione con i seguenti criteri:

1. **Coerenza Narrativa**: La storia mantiene una logica interna coerente?
2. **Sviluppo Personaggi**: I personaggi sono complessi e mostrano un arco di sviluppo?
3. **Originalità**: Il contenuto è originale pur rispettando le convenzioni di genere?
4. **Qualità della Scrittura**: La prosa è coinvolgente e appropriata al genere?
5. **Aderenza ai Requisiti**: La storia include tutti gli elementi specifici richiesti nel prompt? 