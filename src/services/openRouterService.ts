import axios from 'axios';

// Chiave API OpenRouter (in produzione, usare variabili d'ambiente)
// NOTA: Questa chiave API potrebbe essere scaduta. Se la generazione fallisce,
// registrati su https://openrouter.ai per ottenere una nuova chiave API gratuita
const API_KEY = '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';

// Configurazione base per le richieste API
const openRouterClient = axios.create({
  baseURL: 'https://openrouter.ai/api/v1',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': window.location.origin,
    'X-Title': 'OpenStory'
  }
});

// Database di storie predefinite per il fallback, divise per genere
const storyTemplates = {
  fantasy: {
    title: "Il Regno Perduto",
    beginning: "Le antiche foreste di Eldoria nascondevano segreti millenari. Quando il giovane apprendista mago Thorn trovò un amuleto sepolto tra le radici di un albero secolare, non immaginava che avrebbe risvegliato poteri dormienti da secoli. L'equilibrio del regno, già precario, stava per essere messo alla prova come mai prima d'ora.",
    middle: "Il Concilio dei Maghi non credette alle parole di Thorn quando parlò della minaccia che incombeva sul regno. Solo la principessa Lyra, con il suo intuito affinato, decise di dargli ascolto. Insieme intrapresero un viaggio verso le montagne proibite, dove si diceva dimorasse l'ultimo dei draghi saggi. Durante il loro cammino, affrontarono creature oscure e scoprirono verità nascoste sulla storia del regno.",
    end: "La battaglia finale si combatté nelle rovine dell'antica capitale. Quando il potere dell'amuleto si fuse con il coraggio di Thorn e la saggezza del drago, l'oscurità che aveva avvolto il regno per secoli iniziò a dissolversi. Ma la vittoria ebbe un prezzo: Thorn dovette accettare il ruolo di Guardiano dell'Equilibrio, un compito che lo avrebbe legato per sempre alle forze primordiali di Eldoria.",
    moral: "A volte il più grande potere non risiede negli incantesimi o nelle armi, ma nel credere in se stessi anche quando nessun altro lo fa. E spesso, il vero coraggio sta nell'accettare le responsabilità che vengono con il potere."
  },
  fantasy_dark: {
    title: "Ombre dell'Abisso",
    beginning: "Nel regno di Karnath, dove il sole splendeva sempre più fioco ogni giorno, il cacciatore di demoni Darian era l'ultimo baluardo contro l'invasione delle creature dell'Abisso. I suoi occhi, che avevano visto troppi orrori, non mostravano più emozioni.",
    middle: "La chiesa dei Sette Martiri lo aveva tradito, offrendolo in sacrificio agli stessi demoni che lui aveva combattuto. Sopravvissuto per miracolo, Darian si alleò con Syreth, una strega esiliata che conosceva i segreti proibiti per sigillare le porte dell'Abisso.",
    end: "Nelle profondità della cattedrale corrotta, Darian scoprì che il Gran Sacerdote era posseduto dal signore dei demoni. Lo scontro devastò l'edificio sacro, e solo il sacrificio di Syreth permise di chiudere il portale. Darian rimase solo, metà uomo e metà demone, condannato a vagare tra i due mondi.",
    moral: "I confini tra luce e oscurità sono spesso sfumati, e a volte dobbiamo abbracciare parte dell'oscurità per poterla sconfiggere."
  },
  sci_fi: {
    title: "L'Ultimo Avamposto",
    beginning: `La colonia di Proxima B era l'ultimo avamposto dell'umanità dopo che la Terra era diventata inabitabile. Il comandante Elara Chen gestiva con rigore le risorse sempre più scarse, mentre tensioni crescenti minacciavano la fragile pace. 

I sensori atmosferici mostravano anomalie inspiegabili, e i coloni più anziani parlavano di strani suoni provenienti dalle zone inesplorate del pianeta. La verità era che non erano soli su quel mondo alieno, e presto avrebbero scoperto che il loro arrivo non era stato casuale.

Le divisioni nella colonia si facevano sempre più evidenti: i Conservatori volevano mantenere le rigide regole terrestri, mentre i Progressisti sognavano di adattarsi al nuovo mondo. Elara si trovava nel mezzo, cercando di mantenere unita una società sull'orlo del collasso.`,
    
    middle: `Quando le sonde automatiche rilevarono un segnale alieno proveniente dal lato oscuro del pianeta, il consiglio coloniale si divise. Elara e un piccolo team di scienziati disobbedirono agli ordini e partirono per investigare, scoprendo un'antica struttura di origine non umana. 

All'interno trovarono non solo tecnologia avanzata, ma anche prove che la loro presenza su Proxima B non era casuale: un'antica civiltà aveva guidato l'umanità verso questo pianeta, preparando il terreno per il loro arrivo secoli prima.

Le registrazioni aliene rivelavano una verità sconcertante: la Terra non era stata la prima civiltà a distruggere il proprio mondo. La razza aliena aveva seguito lo stesso percorso, ma aveva trovato un modo per preservare la propria conoscenza, nella speranza che altri potessero imparare dai loro errori.`,
    
    end: `La tecnologia aliena conteneva la chiave per terraformare il pianeta, ma anche un avvertimento: la civiltà che l'aveva creata si era autodistrutta proprio come stava facendo l'umanità. 

Elara dovette affrontare una scelta impossibile: rivelare la verità alla colonia rischiando il caos, o mantenere il segreto e guidare gradualmente il cambiamento. Scelse la verità, ma in un modo inaspettato: invece di annunciare la scoperta, creò un percorso che permise ai coloni di scoprirla gradualmente da soli.

Il processo di terraformazione iniziò, non come un progetto imposto dall'alto, ma come uno sforzo collaborativo dell'intera colonia. Richiederà generazioni per completarsi, ma per la prima volta, l'umanità ha un piano che va oltre la mera sopravvivenza: evolversi in qualcosa di migliore, imparando dagli errori di due civiltà.`,
    
    moral: "Il progresso tecnologico senza saggezza è una strada verso l'estinzione. Solo imparando dagli errori del passato e lavorando insieme possiamo costruire un futuro migliore. La vera evoluzione non è solo tecnologica, ma anche sociale e spirituale."
  },
  thriller: {
    title: "Ombre nella Nebbia",
    beginning: `Il detective Marco Ferretti tornò nella sua città natale dopo quindici anni di assenza per indagare su un omicidio che ricalcava esattamente un caso irrisolto del passato. Le stesse modalità, lo stesso luogo, persino lo stesso messaggio criptico lasciato accanto al corpo.

La vittima era collegata a una serie di sparizioni mai risolte che avevano terrorizzato la città negli anni '90, casi che il padre di Marco, anche lui detective, non era riuscito a risolvere prima di togliersi la vita. L'aria pesante della provincia nascondeva segreti che nessuno voleva riportare alla luce.

I vecchi abitanti del quartiere ancora sussurravano storie su quei casi irrisolti, e il ritorno di Marco aveva risvegliato memorie che molti avrebbero preferito dimenticare. Specialmente il sindaco, che negli anni '90 era un giovane e ambizioso procuratore.`,

    middle: `Ogni indizio riportava Marco a eventi sepolti della sua adolescenza e al trauma che lo aveva spinto ad andarsene. Il sindaco, ora un potente politico, faceva pressioni per chiudere il caso rapidamente, ma Marco scoprì collegamenti inquietanti: tutte le vittime erano legate a un orfanotrofio chiuso decenni prima.

Scavando più a fondo, emerse una rete di corruzione che coinvolgeva le più alte sfere della città. Documenti scomparsi, testimoni che cambiavano versione, e una serie di "incidenti" che avevano eliminato chiunque si fosse avvicinato troppo alla verità. Il suicidio di suo padre improvvisamente assunse un nuovo, terribile significato.

La svolta arrivò quando Marco trovò un diario nascosto nell'ufficio di suo padre, protetto da un codice che solo lui poteva comprendere. Le pagine rivelavano una cospirazione che andava ben oltre i singoli omicidi: l'orfanotrofio era stato il centro di un traffico di minori che coinvolgeva alcune delle famiglie più potenti della città.`,

    end: `La rivelazione che l'assassino era il figlio della prima vittima, cresciuto nell'ombra e alimentato dal desiderio di vendetta, fu solo l'inizio. L'uomo aveva scoperto che suo padre era stato ucciso per aver minacciato di rivelare il traffico di minori, e ora stava metodicamente eliminando tutti i coinvolti.

Marco si trovò di fronte a un dilemma morale: l'assassino stava facendo giustizia a modo suo, eliminando persone che erano sfuggite alla legge per decenni. Ma il prezzo della vendetta stava diventando troppo alto, e nuovi innocenti rischiavano di essere coinvolti.

Alla fine, Marco riuscì a fermare l'assassino, ma scelse di usare le prove raccolte per portare alla luce l'intera verità. Il sindaco e i suoi complici furono arrestati, ma il prezzo della giustizia fu alto: Marco dovette accettare che anche suo padre aveva fatto parte del sistema corrotto, anche se alla fine aveva cercato di redimersi con il sacrificio supremo.`,

    moral: "I segreti del passato non restano mai sepolti per sempre, e la giustizia, per quanto lenta, alla fine trova sempre la sua strada. Ma la verità può essere più dolorosa dell'ignoranza, e a volte la redenzione significa accettare che anche chi amiamo può aver fatto scelte sbagliate."
  },
  horror: {
    title: "La Casa dei Sussurri",
    beginning: `La famiglia Ricci acquistò Villa Mornese a un prezzo sorprendentemente basso, ignorando le leggende che circondavano l'antica dimora. La figlia minore, Sofia, fu la prima a sentire i sussurri provenienti dalle pareti, voci che chiamavano il suo nome nelle ore più buie della notte.

Gli incubi di Sofia iniziarono a mostrare scene di un passato dimenticato: donne in abiti d'epoca che si riunivano in segreto nei sotterranei della villa, rituali antichi sussurrati in lingue morte, e sempre quella figura, l'antenata bruciata come strega, che la guardava attraverso le fiamme con i suoi stessi occhi.

Le ricerche di Sofia nella biblioteca comunale rivelarono una verità inquietante: la sua famiglia aveva vissuto in quella villa secoli prima, e il cognome Ricci non era una coincidenza. Sua madre aveva sempre saputo, e il loro ritorno era stato tutto tranne che casuale.`,

    middle: `Mentre i fenomeni inquietanti aumentavano, i genitori di Sofia cominciarono a mostrare comportamenti sempre più strani. L'anziano giardiniere, unico a conoscere la vera storia della villa, cercò di avvertire la ragazza: ogni cent'anni, la casa reclamava nuove anime per placare una maledizione antica.

La verità emerse gradualmente attraverso documenti nascosti e visioni sempre più vivide: la sua antenata non era stata solo una strega, ma una guardiana, parte di una linea di donne che mantenevano l'equilibrio tra il mondo dei vivi e quello dei morti. La sua esecuzione aveva spezzato quell'equilibrio, e ora la villa era diventata un portale instabile tra i due mondi.

Sofia scoprì che sua madre aveva sempre saputo della connessione ed era tornata deliberatamente per completare un rituale iniziato generazioni prima. Ma il piano aveva un prezzo terribile: il sacrificio di un'anima innocente per ripristinare la linea delle guardiane.`,

    end: `Nella notte del solstizio d'inverno, quando il velo tra i mondi era più sottile, Sofia scoprì la verità completa: i suoi genitori erano stati completamente posseduti dallo spirito vendicativo della sua antenata. Il rituale che stavano preparando non avrebbe solo chiuso il portale, ma avrebbe permesso agli spiriti di attraversarlo permanentemente.

Con l'aiuto degli antichi grimori trovati nella biblioteca della villa e il sacrificio involontario dei suoi genitori già posseduti, Sofia riuscì a modificare il rituale. Invece di chiudere il portale o permettere agli spiriti di attraversarlo liberamente, creò un nuovo tipo di equilibrio.

Ma il prezzo fu terribile: per mantenere questo nuovo equilibrio, Sofia dovette prendere il posto della sua antenata come guardiana della villa. Ora vive tra i due mondi, né completamente viva né completamente morta, proteggendo entrambi i regni da future infrazioni. I sussurri continuano, ma ora è lei a controllarli.`,

    moral: "A volte, per salvare ciò che amiamo dobbiamo fare sacrifici che ci cambiano per sempre. Il vero orrore non sta nei fantasmi o nelle maledizioni, ma nelle scelte impossibili che siamo costretti a fare quando il passato reclama il suo debito. E forse, la vera maledizione è la conoscenza che alcune porte, una volta aperte, non possono più essere chiuse."
  },
  romance: {
    title: "Lettere dall'Altra Parte del Mare",
    beginning: `Elena trovò le lettere d'amore nel sottotetto della casa dei nonni: corrispondenze appassionate tra sua nonna Sofia e un uomo di nome Alessandro, di cui non aveva mai sentito parlare. Le lettere si interrompevano bruscamente nell'autunno del 1952, senza spiegazione.

Tra le pagine ingiallite, Elena scoprì una storia d'amore che attraversava non solo il mare, ma anche le barriere sociali e culturali dell'Italia del dopoguerra. Alessandro era un marinaio con sogni di diventare scrittore, Sofia una giovane insegnante di una famiglia benestante. Il loro amore era sbocciato durante le lezioni segrete di letteratura che lei gli dava al porto.

Le lettere rivelavano un mondo di promesse infrante e sogni rimandati, ma anche di una passione che sembrava trascendere il tempo stesso. L'ultima lettera conteneva un biglietto per una nave che non fu mai preso, e una promessa di incontrarsi che non fu mai mantenuta.`,

    middle: `Spinta dalla curiosità e da un senso di dovere verso questa storia incompiuta, Elena iniziò a ricostruire il passato. Le sue ricerche la portarono a Marco, nipote di Alessandro, un professore di letteratura che aveva ereditato i manoscritti mai pubblicati del nonno.

Insieme, scoprirono che le loro famiglie erano state divise non solo dal destino, ma anche da inganni e pregiudizi dell'epoca. Le lettere rivelavano un piano segreto per fuggire insieme, un appuntamento al porto di Napoli che avrebbe dovuto cambiare le loro vite. Ma qualcuno aveva intercettato l'ultima lettera di Sofia, dove cambiava il luogo dell'incontro.

Mentre Elena e Marco ricostruivano la storia, tra loro cresceva un legame sempre più forte. Nei caffè di Napoli, tra archivi polverosi e vecchie fotografie, si ritrovarono a rivivere l'eco di quell'amore perduto, come se il destino stesse offrendo una seconda possibilità attraverso di loro.`,

    end: `Attraverso diari e documenti dell'epoca, Elena e Marco scoprirono la verità completa: Alessandro non era morto nella tempesta come tutti credevano, ma era stato costretto a emigrare in America dalla sua famiglia, che disapprovava l'unione con una donna di classe superiore. Sofia, ignara della verità e credendo di essere stata abbandonata, aveva ceduto alle pressioni familiari sposando un uomo che non avrebbe mai veramente amato.

Alessandro aveva continuato a scrivere per tutta la vita, riempiendo quaderni di poesie e racconti dedicati a Sofia, mai pubblicati. Sofia aveva conservato ogni ritaglio di giornale che parlava di marinai dispersi, sperando e temendo di trovare il suo nome.

Elena e Marco decisero di pubblicare le lettere e i manoscritti in un libro, "Lettere dall'Altra Parte del Mare", dando finalmente voce a quell'amore silenzioso. Il libro divenne un successo inaspettato, toccando il cuore di chi credeva ancora nel potere dell'amore di attraversare il tempo. E nel processo di dare giustizia a questa storia d'amore perduta, trovarono il coraggio di non ripetere gli errori del passato, scegliendo di stare insieme nonostante le differenze delle loro vite.`,

    moral: "L'amore vero non conosce il tempo e talvolta trova modi inaspettati per completare il suo corso, anche attraverso generazioni diverse. Le storie del passato non sono solo lezioni da imparare, ma anche opportunità per redimere scelte mai fatte e promesse mai mantenute. E a volte, il destino ci offre una seconda possibilità per correggere gli errori di chi è venuto prima di noi."
  },
  action: {
    title: "Codice Rosso",
    beginning: `L'ex agente speciale Lorenzo Vega era in pensione da tre anni quando il suo ex capo lo contattò per un'ultima missione: recuperare un'arma biologica rubata da un laboratorio governativo segreto. Ma c'era di più: il virus era solo una parte di un piano più grande, e le impronte digitali del suo ex partner, ora capo di un'organizzazione criminale, erano ovunque.

Il briefing rivelò dettagli inquietanti: il virus era stato originariamente sviluppato come cura per una malattia rara, ma le sue proprietà lo rendevano anche un'arma devastante. Le telecamere di sicurezza mostravano il volto di un fantasma: Adrian Torres, l'uomo che Lorenzo aveva addestrato personalmente e che credeva morto in un'operazione andata male due anni prima.

Lorenzo sapeva che questa missione era personale: aveva addestrato lui stesso il traditore, e ora doveva fermarlo prima che milioni di vite venissero sacrificate. Ma qualcosa non quadrava: Adrian era sempre stato un idealista, non un mercenario. C'era una storia più profonda da scoprire.`,

    middle: `La caccia lo portò da Milano a Istanbul, poi a Bangkok, dove ogni indizio rivelava un piano sempre più complesso. Lo scontro nel mercato affollato mise Lorenzo faccia a faccia con la sua più grande debolezza: la sua lealtà verso un amico ormai perduto.

La verità emerse gradualmente: Adrian non aveva rubato il virus per venderlo, ma per salvare sua figlia, malata terminale della stessa malattia per cui il virus era stato originariamente sviluppato. Il governo aveva interrotto il progetto quando si erano resi conto del potenziale militare, condannando a morte non solo la figlia di Adrian, ma centinaia di altri pazienti.

Mentre si addentrava sempre più nella cospirazione, Lorenzo scoprì che c'era un terzo giocatore: una corporazione farmaceutica che aveva orchestrato il furto per ottenere sia il virus che la cura, pianificando di creare prima la domanda e poi vendere la soluzione al miglior offerente.`,

    end: `Nello scontro finale su un cargo in mezzo al Mar Cinese, Lorenzo si trovò di fronte a una scelta impossibile. Adrian aveva già sintetizzato la cura per sua figlia, ma la corporazione stava per ottenere il virus. Il tempo stava per scadere, e non c'era modo di salvare tutti.

In un momento di lucida disperazione, Lorenzo capì che c'era solo una soluzione: aiutare Adrian a salvare sua figlia, ma distruggere il virus e tutte le ricerche, impedendo che potesse essere mai usato come arma. La decisione costò la vita ad Adrian, che si sacrificò per assicurarsi che il virus venisse distrutto completamente.

Tornato alla base, Lorenzo rifiutò di riprendere servizio permanente. Invece, usando le prove raccolte durante la missione, fece in modo che la ricerca sulla cura originale venisse ripresa pubblicamente, questa volta sotto la supervisione di un'organizzazione internazionale. La figlia di Adrian fu la prima di molti pazienti a ricevere la cura, e Lorenzo si assicurò che la sua storia, e il sacrificio di suo padre, non venissero dimenticati.`,

    moral: "Anche nelle situazioni più disperate, le nostre scelte definiscono chi siamo veramente. La vera giustizia non sta solo nel fare ciò che è legalmente corretto, ma nel trovare un equilibrio tra dovere e compassione, anche quando sembra impossibile. E a volte, il più grande atto di eroismo è saper perdonare e redimere chi ha sbagliato per le giuste ragioni."
  },
  drama: {
    title: "Le Stagioni del Cuore",
    beginning: `La famiglia Conti si riunì per la prima volta dopo dieci anni in occasione del settantesimo compleanno del patriarca Antonio. I tre fratelli, ognuno con la propria vita e i propri segreti, tornarono nella vecchia casa di campagna toscana dove erano cresciuti.

Maria, la primogenita, un'affermata chirurga a Milano, arrivò per prima. Dietro la sua carriera di successo si nascondeva un matrimonio in frantumi e un figlio adolescente che non le parlava più. Paolo, il figlio di mezzo, un artista bohémien a Parigi, portava con sé non solo le sue tele incompiute, ma anche il peso di una decisione che aveva cambiato il destino della famiglia. E Lucia, la più giovane, non aveva mai lasciato il paese, gestendo il ristorante di famiglia con la stessa determinazione con cui soffocava i suoi sogni mai realizzati.

La vecchia casa, con il suo giardino trascurato e le persiane cigolanti, sembrava un testimone silenzioso di tutte le parole non dette e le promesse infrante che avevano separato questa famiglia un tempo unita.`,

    middle: `Durante il fine settimana, vecchi rancori e verità nascoste emersero tra bicchieri di vino e ricordi condivisi. La malattia terminale di Antonio, tenuta nascosta fino all'ultimo momento, costrinse tutti a confrontarsi con il limitato tempo rimasto e con le ferite mai davvero rimarginate.

Maria dovette affrontare il fallimento del suo matrimonio e la scelta di anteporre la carriera alla famiglia, realizzando che la sua ricerca della perfezione professionale era stata un modo per fuggire dalle imperfezioni della sua vita personale. Paolo rivelò di aver venduto in segreto alcuni terreni di famiglia per finanziare la sua arte, una decisione che aveva salvato la sua anima ma tradito la fiducia del padre. Lucia confessò di aver sempre vissuto all'ombra delle aspettative paterne, sacrificando i suoi sogni di viaggiare e studiare per mantenere viva una tradizione che forse non aveva più senso.

Le tensioni raggiunsero il culmine durante una cena tempestosa, dove Antonio, indebolito dalla malattia ma non nello spirito, finalmente rivelò il suo più grande rimpianto: aver permesso che il suo sogno di una dinastia familiare perfetta avesse soffocato i sogni individuali dei suoi figli.`,

    end: `Prima di morire, Antonio riuscì a vedere i suoi figli riconciliarsi, non attraverso grandi gesti o dichiarazioni drammatiche, ma nei piccoli momenti di comprensione e perdono. Nel suo testamento, invece di dividere la proprietà in parti uguali come tutti si aspettavano, lasciò a ciascuno esattamente ciò di cui aveva bisogno per guarire.

Maria decise di aprire una clinica nel paese, combinando la sua expertise con il bisogno di riconnettersi con le sue radici. Il suo figlio, affascinato dalla vita di campagna, iniziò a passare più tempo con lei, riscoprendo lentamente il legame perduto. Paolo trasformò il fienile abbandonato in una galleria d'arte, creando uno spazio dove tradizione e modernità potevano coesistere, e dove i giovani artisti locali trovarono una voce. Lucia, finalmente libera dal peso delle aspettative, rinnovò il ristorante seguendo la sua visione, incorporando le influenze dei suoi tanto desiderati viaggi, che ora finalmente si permetteva di fare.

La casa di famiglia, che Antonio voleva vendere, diventò invece un luogo di ritrovo annuale, non più un museo di rimpianti ma un laboratorio vivente dove tre diverse visioni della vita potevano intrecciarsi e arricchirsi a vicenda.`,

    moral: "Le famiglie sono ecosistemi complessi di amore, dolore e memoria condivisa. A volte è necessario allontanarsi per capire quanto sia prezioso ciò che abbiamo, e il vero legame familiare non sta nel vivere le stesse esperienze, ma nel trovare il modo di rimanere uniti nonostante le differenze. La vera eredità non è nei beni materiali, ma nella capacità di perdonare e reinventarsi, mantenendo vivo il legame anche quando le strade si dividono."
  }
};

// Funzione per generare una storia fittizia per scopi di test/fallback
const generateFallbackStory = (parameters: any): { content: string, metadata: any } => {
  const { genre, tone, setting, protagonist, antagonist, plotElements } = parameters;
  
  console.log('Generazione fallback attivata - usando storia predefinita in italiano');
  
  // Scegliamo un template appropriato in base al genere e al tono
  let template;
  const genreLower = (genre || '').toLowerCase();
  const toneLower = (tone || '').toLowerCase();
  
  if (genreLower.includes('fantasy') && (toneLower.includes('dark') || toneLower.includes('oscuro'))) {
    template = storyTemplates.fantasy_dark;
  } else if (genreLower.includes('fantasy')) {
    template = storyTemplates.fantasy;
  } else if (genreLower.includes('sci') || genreLower.includes('fantascienza')) {
    template = storyTemplates.sci_fi;
  } else if (genreLower.includes('thriller') || genreLower.includes('mystery')) {
    template = storyTemplates.thriller;
  } else if (genreLower.includes('horror') || genreLower.includes('terror')) {
    template = storyTemplates.horror;
  } else if (genreLower.includes('romance') || genreLower.includes('romantico') || genreLower.includes('amore')) {
    template = storyTemplates.romance;
  } else if (genreLower.includes('action') || genreLower.includes('azione')) {
    template = storyTemplates.action;
  } else if (genreLower.includes('drama') || genreLower.includes('dramma')) {
    template = storyTemplates.drama;
  } else {
    // Default a fantasy se il genere non è riconosciuto
    template = storyTemplates.fantasy;
  }
  
  // Adattiamo alcuni elementi della storia in base ai parametri dell'utente
  const settingDesc = setting && setting.place ? 
    `in ${setting.place}${setting.time ? ` durante ${setting.time}` : ''}` :
    "in un luogo misterioso";
  
  const protagonistDesc = protagonist && protagonist.type ?
    `${protagonist.type}${protagonist.goal ? ` il cui obiettivo è ${protagonist.goal}` : ''}` :
    "un eroe improbabile";
  
  const antagonistDesc = antagonist && antagonist.type ?
    `${antagonist.type}${antagonist.motivation ? ` motivato da ${antagonist.motivation}` : ''}` :
    "un avversario temibile";
  
  // Elementi di trama personalizzati
  let plotDesc = "";
  if (plotElements && plotElements.length > 0) {
    plotDesc = `\n\nNella storia si sviluppano elementi cruciali come: ${plotElements.join(', ')}.`;
  }
  
  // Costruiamo la storia completa
  const storyContent = `
# ${template.title}

## Prologo - Il Mondo e i suoi Abitanti

### L'Ambientazione
In ${settingDesc}, dove le tradizioni e la storia si intrecciano con il presente, l'atmosfera è ${setting.description || 'carica di possibilità'}. È qui che i destini dei nostri personaggi stanno per intrecciarsi in modi inaspettati.

### I Protagonisti
In questo mondo troviamo ${protagonistDesc}, una figura destinata a lasciare un segno indelebile. Le sue azioni e decisioni saranno il catalizzatore di eventi che cambieranno per sempre questo luogo.

### Le Forze in Gioco
Nel cuore di questa storia emerge anche ${antagonistDesc}, una presenza la cui storia personale e le cui motivazioni sono profondamente radicate nel tessuto di questa realtà.${plotDesc}

## Atto I - L'Inizio del Viaggio

### La Situazione Iniziale
${template.beginning.replace("Eldoria", setting.place || "Eldoria")}

### Il Catalizzatore
Un evento inaspettato sconvolge l'equilibrio esistente, costringendo ${protagonist.type} ad agire.

### La Chiamata all'Avventura
Le prime decisioni cruciali vengono prese, stabilendo il corso degli eventi futuri.

## Atto II - Il Cuore del Conflitto

### Le Prime Sfide
${template.middle}

### La Crescita
${protagonist.type} affronta ostacoli sempre più impegnativi, scoprendo nuove verità su se stesso e sul mondo.

### Il Momento Più Buio
Le forze dell'antagonista sembrano prevalere, portando la situazione al punto di massima tensione.

## Atto III - La Risoluzione

### Lo Scontro Decisivo
${template.end}

### Le Conseguenze
Le azioni dei personaggi hanno cambiato irreversibilmente il mondo della storia.

### L'Eredità
I personaggi sono trasformati dalle loro esperienze, lasciando un segno duraturo.

## Epilogo - Riflessioni Finali

### La Morale
${template.moral}

### I Temi Esplorati
${plotElements && plotElements.length > 0 ? 
  plotElements.map((element: string) => `- ${element}: Come ha influenzato la storia e i personaggi`).join('\n')
  : 'I temi principali si intrecciano per creare un messaggio profondo e significativo'}

[Questa storia è stata generata localmente come backup. Per storie completamente personalizzate, aggiorna la chiave API di OpenRouter nel file "openRouterService.ts".]
`;

  return {
    content: storyContent,
    metadata: {
      model: "Generatore locale italiano (template)",
      promptTokens: 0,
      completionTokens: storyContent.length,
      processingTime: "0.1s (generazione locale)"
    }
  };
};

// Funzione per generare una sezione specifica della storia
const generateStorySection = async (parameters: any, section: string, model: string, previousSections: string = ""): Promise<string> => {
  try {
    let systemPrompt = '';
    let userPrompt = '';
    let maxTokens = 0;
    let temperature = 0.4; // Default temperature più bassa per tutti
    
    // Configurazione specifica per ogni sezione
    switch(section) {
      case 'prologo':
        systemPrompt = `Sei un eccellente scrittore italiano specializzato in prologhi introduttivi. Il tuo compito è creare un prologo conciso (massimo 250 parole) che introduca SOLO il mondo, i personaggi principali e la premessa della storia. 

LINEE GUIDA:
- IL PROLOGO DEVE SOLAMENTE INTRODURRE l'ambientazione, i personaggi e il conflitto iniziale
- NON anticipare eventi o risoluzioni che accadranno più avanti nella storia
- NON rivelare il finale o l'esito dell'indagine
- Fornire solo le informazioni di base necessarie per iniziare la storia
- Usa un linguaggio chiaro e preciso
- Mantieni paragrafi brevi (3-4 frasi al massimo)
- Verifica che ogni frase sia completa e ben formata`;

        userPrompt = `Scrivi SOLO il prologo introduttivo per una storia basata sul seguente schema. Il prologo deve limitarsi a presentare l'ambientazione, i personaggi principali e il conflitto centrale senza anticipare sviluppi futuri della trama.

--- SCHEMA DELLA STORIA ---
${buildSchema(parameters)}
--- FINE SCHEMA ---

IMPORTANTE: Non anticipare risoluzioni o sviluppi futuri! Il prologo deve solo preparare il terreno per la storia e creare interesse. NON rivelare come si concluderà la storia.

Scrivi SOLO il prologo con intestazione "### PROLOGO" (massimo 250 parole):`;
        
        maxTokens = 600;
        temperature = 0.35;
        break;
        
      case 'atto1':
        systemPrompt = `Sei un eccellente scrittore italiano specializzato nella creazione del primo atto di storie. Il tuo compito è scrivere l'Atto I (massimo 450 parole) che espone il conflitto e la situazione iniziale.

LINEE GUIDA:
- Espandi la situazione presentata nel prologo
- Introduci eventi che mettono in moto la trama
- Mostra i personaggi in azione
- Mantieni la coerenza con l'ambientazione e l'epoca storica
- Usa paragrafi brevi (3-4 frasi al massimo)
- Evita anticipazioni di eventi futuri o risoluzioni
- Assicurati che il testo sia coerente e fluido
- Mantieni un tono narrativo costante`;

        userPrompt = `Basandoti sul seguente schema e sul prologo già scritto, crea l'ATTO I della storia che espone il conflitto e la situazione iniziale.

--- SCHEMA DELLA STORIA ---
${buildSchema(parameters)}
--- FINE SCHEMA ---

--- PROLOGO GIÀ SCRITTO ---
${previousSections}
--- FINE PROLOGO ---

IMPORTANTE:
- Continua la narrazione in modo coerente con l'ambientazione e i personaggi descritti nel prologo
- Non anticipare la conclusione della storia
- Mantieni la coerenza temporale e storica dell'ambientazione
- Usa un linguaggio appropriato all'epoca in cui è ambientata la storia

Scrivi SOLO l'Atto I con intestazione "### ATTO I - [titolo appropriato]" (massimo 450 parole):`;
        
        maxTokens = 900;
        temperature = 0.4;
        break;
        
      case 'atto2':
        systemPrompt = `Sei un eccellente scrittore italiano specializzato nella creazione del secondo atto di storie. Il tuo compito è scrivere l'Atto II (massimo 450 parole) che sviluppa il conflitto e presenta complicazioni.

LINEE GUIDA:
- Continua la narrativa stabilita nel primo atto in modo coerente
- Introduci ostacoli e complicazioni per i personaggi
- Intensifica il conflitto centrale
- Mantieni la continuità dei personaggi e delle loro motivazioni
- Rispetta l'ambientazione storica e il periodo temporale
- Usa dialoghi naturali e significativi
- Mantieni un linguaggio appropriato all'epoca della storia
- Mantieni un tono narrativo costante
- Assicurati che il testo sia fluido e ben strutturato`;

        userPrompt = `Basandoti sul seguente schema e sulle parti già scritte della storia, crea l'ATTO II che sviluppa il conflitto e introduce complicazioni.

--- SCHEMA DELLA STORIA ---
${buildSchema(parameters)}
--- FINE SCHEMA ---

--- PARTI GIÀ SCRITTE ---
${previousSections}
--- FINE PARTI GIÀ SCRITTE ---

IMPORTANTE:
- Mantieni assoluta coerenza con quanto già narrato
- Rispetta l'ambientazione storica e temporale
- Non introdurre anacronismi o elementi fuori contesto
- Il linguaggio deve rimanere appropriato per l'epoca della storia

Scrivi SOLO l'Atto II con intestazione "### ATTO II - [titolo appropriato]" (massimo 450 parole):`;
        
        maxTokens = 900;
        temperature = 0.4;
        break;
        
      case 'atto3':
        systemPrompt = `Sei un eccellente scrittore italiano specializzato nella creazione del terzo atto e conclusioni di storie. Il tuo compito è scrivere l'Atto III (massimo 450 parole) che risolve il conflitto centrale in modo soddisfacente.

LINEE GUIDA CRITICHE:
- Porta a conclusione l'arco narrativo principale in modo logico
- Risolvi i conflitti presentati negli atti precedenti
- Fornisci un finale che rispetti il tono e l'ambientazione della storia
- Mantieni coerenza con i personaggi e le loro motivazioni
- EVITA ASSOLUTAMENTE degenerazioni del testo o ripetizioni
- MANTIENI RIGOROSA COERENZA con l'epoca storica
- NON INTRODURRE elementi futuri o anacronistici
- Usa un linguaggio chiaro, preciso e appropriato all'epoca
- Usa paragrafi brevi (3-4 frasi)
- Concludi in modo definitivo senza divagazioni
- Verifica ogni frase per assicurarti che sia completa e ben formata
- Termina la storia in modo netto e soddisfacente senza ripetizioni`;

        userPrompt = `Basandoti sul seguente schema e sulle parti già scritte della storia, crea l'ATTO III che risolve il conflitto centrale in modo soddisfacente.

--- SCHEMA DELLA STORIA ---
${buildSchema(parameters)}
--- FINE SCHEMA ---

--- PARTI GIÀ SCRITTE ---
${previousSections}
--- FINE PARTI GIÀ SCRITTE ---

ISTRUZIONI CRUCIALI:
- Mantieni assoluta coerenza temporale e storica con l'ambientazione
- Il finale deve chiudere la storia in modo soddisfacente
- NON fare riferimenti a tempi moderni o elementi futuri
- Evita ASSOLUTAMENTE ripetizioni o frasi senza senso alla fine
- Termina la storia in modo chiaro e definitivo
- Assicurati che ogni frase abbia senso compiuto
- Usa un linguaggio appropriato all'epoca della storia

Scrivi SOLO l'Atto III con intestazione "### ATTO III - [titolo appropriato]" (massimo 450 parole):`;
        
        maxTokens = 800;
        temperature = 0.3; // Temperatura ancora più bassa per l'atto finale per evitare degenerazioni
        break;
        
      default:
        throw new Error(`Sezione ${section} non riconosciuta`);
    }
    
    // Chiamata all'API OpenRouter per la sezione specifica
    const response = await openRouterClient.post('/chat/completions', {
      model: model,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: userPrompt
        }
      ],
      temperature: temperature,
      max_tokens: maxTokens,
      top_p: 0.8,
      presence_penalty: 0.6,
      frequency_penalty: 1.0 // Massimizzato per evitare ripetizioni
    });
    
    // Verifica che la risposta contenga i dati attesi
    if (!response.data || !response.data.choices || !response.data.choices.length || !response.data.choices[0].message) {
      throw new Error('La risposta API non contiene i dati attesi');
    }
    
    // Verifica se ci sono degenerazioni nel testo
    const generatedText = response.data.choices[0].message.content;
    if (section === 'atto3') {
      // Verifica pattern di ripetizione alla fine
      const endOfText = generatedText.slice(-100);
      const words = endOfText.split(/\s+/);
      
      // Cerchiamo pattern di ripetizione
      const repeatingPattern = words.some((word: string, index: number, array: string[]) => {
        if (index > 0 && index < array.length - 2) {
          return word === array[index - 1] && word === array[index + 1];
        }
        return false;
      });
      
      if (repeatingPattern) {
        console.warn("Rilevata ripetizione nella fine dell'Atto III. Tentativo di rigenerazione...");
        // Prova a rigenerare con temperatura ancora più bassa
        return await generateStorySection(parameters, section, model, previousSections);
      }
    }
    
    return generatedText;
  } catch (error) {
    console.error(`Errore nella generazione della sezione ${section}:`, error);
    return `### ${section.toUpperCase()}\n\nErrore nella generazione di questa sezione. Si prega di riprovare.`;
  }
};

// Function to check and clean generated text
const cleanGeneratedText = (text: string): string => {
  // Remove repeating patterns at the end
  let cleanedText = text;
  
  // Check for repeating words or phrases
  const words = text.split(/\s+/);
  if (words.length > 10) {
    const lastWords = words.slice(-10);
    
    // Check for repetitions in the last 10 words
    const uniqueLastWords = new Set(lastWords);
    if (uniqueLastWords.size < lastWords.length / 2) {
      // If there are repetitions, trim the text
      const goodContent = words.slice(0, -10).join(' ');
      cleanedText = goodContent + '.';
    }
  }
  
  // Replace multiple exclamation marks with single ones
  cleanedText = cleanedText.replace(/!{2,}/g, '!');
  
  // Fix potential spacing issues
  cleanedText = cleanedText.replace(/([.!?])([A-Z])/g, '$1 $2');
  
  return cleanedText;
};

// Funzione per generare una storia basata sui parametri dell'utente
export const generateStory = async (parameters: any) => {
  try {
    // Modello da utilizzare
    const model = "deepseek/deepseek-prover-v2:free";
    console.log('Modello selezionato:', model);
    
    try {
      console.log('Iniziando la generazione della storia in più fasi...');
      
      // 1. Genera il prologo
      console.log('Generazione del prologo...');
      let prologo = await generateStorySection(parameters, 'prologo', model);
      prologo = cleanGeneratedText(prologo);
      console.log('Prologo generato con successo');
      
      // 2. Genera l'atto I
      console.log('Generazione dell\'Atto I...');
      let atto1 = await generateStorySection(parameters, 'atto1', model, prologo);
      atto1 = cleanGeneratedText(atto1);
      console.log('Atto I generato con successo');
      
      // 3. Genera l'atto II
      console.log('Generazione dell\'Atto II...');
      let atto2 = await generateStorySection(parameters, 'atto2', model, `${prologo}\n\n${atto1}`);
      atto2 = cleanGeneratedText(atto2);
      console.log('Atto II generato con successo');
      
      // 4. Genera l'atto III
      console.log('Generazione dell\'Atto III...');
      let atto3 = await generateStorySection(parameters, 'atto3', model, `${prologo}\n\n${atto1}\n\n${atto2}`);
      atto3 = cleanGeneratedText(atto3);
      console.log('Atto III generato con successo');
      
      // Unisce tutte le sezioni per formare la storia completa
      const storyContent = `${prologo}\n\n${atto1}\n\n${atto2}\n\n${atto3}`;
      
      return {
        content: storyContent,
        metadata: {
          model: model,
          promptTokens: 0, // Non abbiamo i token esatti in questo approccio
          completionTokens: storyContent.length / 4, // Stima approssimativa
          processingTime: "Generazione multi-fase"
        }
      };
    } catch (apiError: any) {
      console.error('Errore durante la generazione multi-fase:', apiError);
      
      // Se siamo in modalità di sviluppo o test, usa la generazione fallback
      if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
        console.warn('Usando la generazione fallback poiché siamo in ambiente di sviluppo');
        return generateFallbackStory(parameters);
      }
      
      // Altrimenti rilancia l'errore
      throw apiError;
    }
  } catch (error: any) {
    console.error('Errore durante la generazione della storia:', error);
    
    // Log dettagliati per diagnosticare il problema
    if (error.response) {
      console.error('Dettagli errore API:', {
        status: error.response.status,
        headers: error.response.headers,
        data: error.response.data
      });
      
      // Errori comuni di OpenRouter
      if (error.response.status === 401 || error.response.status === 403) {
        throw new Error('Errore di autenticazione: la chiave API potrebbe essere scaduta o non valida');
      } else if (error.response.status === 404) {
        throw new Error('Il modello richiesto non è disponibile');
      } else if (error.response.status === 429) {
        throw new Error('Limite di richieste raggiunto. Riprova più tardi');
      }
    } else if (error.request) {
      console.error('Nessuna risposta ricevuta:', error.request);
      throw new Error('Nessuna risposta dal server. Verifica la tua connessione di rete');
    } else {
      console.error('Errore di configurazione della richiesta:', error.message);
    }
    
    throw new Error(error.response?.data?.error || error.message || 'Errore sconosciuto nella chiamata API');
  }
};

// Funzione che crea uno schema della storia dai parametri
const buildSchema = (parameters: any): string => {
  const { title, genre, tone, setting, protagonist, antagonist, supportingCharacters, plotElements, narrativeStructure, chapters, length } = parameters;
  
  let schema = "";
  
  // Assembla lo schema dettagliato della storia dai parametri individuali
  schema += `TITOLO: "${title || 'Storia Senza Titolo'}"\n\n`;
  schema += `GENERE: ${genre || 'Non specificato'}\n`;
  schema += `TONO: ${tone || 'Non specificato'}\n`;
  schema += `LUNGHEZZA RICHIESTA: ${length || 'Non specificata'}\n\n`;

  if (setting) {
    schema += `AMBIENTAZIONE:\n`;
    schema += `${setting.place ? `Luogo principale: ${setting.place}\n` : ''}`;
    schema += `${setting.time ? `Periodo storico/temporale: ${setting.time}\n` : ''}`;
    schema += `${setting.description ? `Atmosfera e dettagli: ${setting.description}\n` : ''}`;
    schema += `\n`;
  }

  if (protagonist) {
    schema += `PROTAGONISTA:\n`;
    schema += `Tipo: ${protagonist.type || 'Non specificato'}\n`;
    if (protagonist.name) schema += `Nome: ${protagonist.name}\n`;
    schema += `Obiettivi: ${protagonist.goal || 'Non specificato'}\n`;
    if (protagonist.characteristics) schema += `Caratteristiche: ${protagonist.characteristics.join(', ')}\n`;
    schema += `\n`;
  }

  if (antagonist) {
    schema += `ANTAGONISTA:\n`;
    schema += `Tipo: ${antagonist.type || 'Non specificato'}\n`;
    if (antagonist.name) schema += `Nome: ${antagonist.name}\n`;
    schema += `Motivazioni: ${antagonist.motivation || 'Non specificato'}\n`;
    schema += `\n`;
  }

  if (supportingCharacters && supportingCharacters.length > 0) {
    schema += `PERSONAGGI DI SUPPORTO:\n`;
    schema += supportingCharacters.map((char: any) => 
      `- ${char.name || 'Personaggio'} (${char.type || 'Non specificato'}): ${char.description || 'Non specificato'}`
    ).join('\n') + '\n\n';
  }

  if (chapters && chapters.length > 0) {
    schema += `STRUTTURA:\n`;
    schema += chapters.map((chapter: any) => {
      let chapterString = `${chapter.title || 'Titolo Atto/Capitolo'}\n`;
      chapterString += `  Descrizione: ${chapter.description || 'Non specificato'}\n`;
      return chapterString;
    }).join('\n') + '\n\n';
  }

  if (plotElements && plotElements.length > 0) {
    schema += `ELEMENTI CHIAVE DELLA TRAMA:\n`;
    if (Array.isArray(plotElements)) {
        schema += plotElements.map((element: string) => `- ${element}`).join('\n') + '\n\n';
    } else {
        schema += `${plotElements}\n\n`;
    }
  }

  if (narrativeStructure) {
      schema += `TECNICHE NARRATIVE: ${narrativeStructure}\n\n`;
  }
  
  return schema.trim();
};

// Crea un oggetto API da esportare
const openRouterService = {
  generateStory
};

export default openRouterService; 