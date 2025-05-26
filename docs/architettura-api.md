# Architettura API - OpenStory

Questo documento descrive l'architettura dell'API backend che gestirà la comunicazione tra il frontend e i servizi di AI tramite OpenRouter.

## Panoramica

L'API di OpenStory è un'interfaccia RESTful costruita con Node.js e Express che gestisce:

1. L'elaborazione delle richieste dal frontend
2. La costruzione dei prompt per l'AI
3. La comunicazione con OpenRouter
4. La gestione delle risposte e la formattazione dei risultati

## Endpoint API

### Generazione di Storie

```
POST /api/generate
```

**Richiede autenticazione:** Sì (JWT)

**Payload della richiesta:**

```json
{
  "genre": "action",
  "tone": "dark",
  "setting": {
    "time": "future",
    "place": "tokyo",
    "description": "Una metropoli futuristica dominata da grattacieli e neon"
  },
  "protagonist": {
    "type": "ex-special-forces",
    "goal": "revenge",
    "characteristics": ["determined", "skilled", "troubled-past"]
  },
  "antagonist": {
    "type": "corporate-ceo",
    "motivation": "power",
    "characteristics": ["manipulative", "charismatic", "ruthless"]
  },
  "plotElements": [
    "memory-altering technology",
    "betrayal",
    "time-critical mission"
  ],
  "narrativeStructure": "three-act",
  "length": "synopsis"
}
```

**Risposta:**

```json
{
  "id": "story_12345",
  "content": "Nel 2085, le strade al neon di Tokyo...",
  "metadata": {
    "model": "mixtral-8x7b",
    "promptTokens": 320,
    "completionTokens": 1024,
    "processingTime": "3.2s"
  }
}
```

### Salvataggio Storie

```
POST /api/stories
```

**Richiede autenticazione:** Sì (JWT)

**Payload della richiesta:**

```json
{
  "title": "Vendetta a Tokyo",
  "content": "Nel 2085, le strade al neon di Tokyo...",
  "parameters": {
    "genre": "action",
    "tone": "dark",
    "setting": {
      "time": "future",
      "place": "tokyo"
    },
    // Altri parametri...
  }
}
```

**Risposta:**

```json
{
  "id": "story_12345",
  "title": "Vendetta a Tokyo",
  "createdAt": "2023-08-15T14:23:45.000Z"
}
```

### Recupero Storie

```
GET /api/stories
```

**Richiede autenticazione:** Sì (JWT)

**Parametri Query:**
- `page` (default: 1)
- `limit` (default: 10)
- `sort` (default: "createdAt:desc")

**Risposta:**

```json
{
  "stories": [
    {
      "id": "story_12345",
      "title": "Vendetta a Tokyo",
      "createdAt": "2023-08-15T14:23:45.000Z",
      "excerpt": "Nel 2085, le strade al neon di Tokyo..."
    },
    // Altri risultati...
  ],
  "pagination": {
    "totalItems": 42,
    "totalPages": 5,
    "currentPage": 1,
    "limit": 10
  }
}
```

### Recupero Storia Singola

```
GET /api/stories/:id
```

**Richiede autenticazione:** Sì (JWT)

**Risposta:**

```json
{
  "id": "story_12345",
  "title": "Vendetta a Tokyo",
  "content": "Nel 2085, le strade al neon di Tokyo...",
  "parameters": {
    "genre": "action",
    "tone": "dark",
    // Altri parametri...
  },
  "createdAt": "2023-08-15T14:23:45.000Z",
  "updatedAt": "2023-08-15T14:23:45.000Z"
}
```

## Integrazione con OpenRouter

L'integrazione con OpenRouter avviene tramite un servizio dedicato che:

1. Costruisce i prompt basati sui parametri utente
2. Seleziona il modello appropriato
3. Gestisce le chiamate API ad OpenRouter
4. Gestisce le risposte e gli errori

```javascript
// Esempio di integrazione con OpenRouter
const generateStory = async (parameters) => {
  // Costruzione del prompt
  const prompt = buildPrompt(parameters);
  
  // Selezione del modello
  const model = selectAppropriateModel(parameters);
  
  // Chiamata ad OpenRouter
  const response = await openrouterClient.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: "Sei un narratore esperto specializzato nella creazione di storie in stile hollywoodiano."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: calculateMaxTokens(parameters.length)
  });
  
  return {
    content: response.choices[0].message.content,
    metadata: {
      model: model,
      promptTokens: response.usage.prompt_tokens,
      completionTokens: response.usage.completion_tokens,
      processingTime: calculateProcessingTime()
    }
  };
};
```

## Gestione delle Rate Limit e Caching

Per ottimizzare l'uso dell'API OpenRouter e ridurre i costi:

1. **Rate Limiting**: Limitazione delle richieste per utente (es. 10 generazioni/ora per utenti free)
2. **Caching**: Cache delle risposte per combinazioni identiche di parametri
3. **Tokenizzazione**: Stima preventiva del numero di token per evitare richieste troppo costose

## Sicurezza

1. **Autenticazione**: JWT per autenticare le richieste API
2. **Validazione Input**: Validazione completa di tutti i parametri in ingresso
3. **Sanitizzazione**: Sanitizzazione degli input per evitare prompt injection
4. **Rate Limiting**: Protezione contro attacchi di forza bruta
5. **API Key Rotation**: Rotazione periodica delle chiavi API di OpenRouter

## Estensibilità

L'architettura è progettata per supportare future estensioni:

1. **Modelli multipli**: Supporto per diversi modelli AI con selezione automatica o manuale
2. **Funzionalità aggiuntive**: Generazione di immagini, analisi sentimentale, etc.
3. **Integrazione con altri servizi**: Export in diversi formati, condivisione social, etc. 