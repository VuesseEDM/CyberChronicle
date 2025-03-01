import axios from "axios";
import _ from "lodash";
import "../css/style.css";

// evento 'DOMContentLoaded', che viene attivato quando il DOM è caricato 
document.addEventListener("DOMContentLoaded", async function () {
  let newsToLoad = []; //  array per memorizzare gli ID delle news già caricate,in modo tale danon essere riproposte

  // funzione asincrona per recuperare gli ID delle ultime news,fino ad un massimo di 10 notizie
  async function loadNewsIds(startIndex = 0, count = 10) {
    //URL per recuperare gli ID delleultime news da Hacker News API
    const linkApiUrl = "https://hacker-news.firebaseio.com/v0/newstories.json";

    try {
      // richiesta GET per recuperare gli ID delle news
      const response = await axios.get(linkApiUrl);
      // se la risposta è ok
      if (!response.status === 200) {
        // Se la risposta non è ok, genero un errore
        throw new Error("Error retrieving news IDs.");
      }
      // Parse la risposta in formato JSON
      const newsIds = response.data;
      // Restituisc solo un sottoinsieme degli ID delle news
      return _.slice(newsIds, startIndex, startIndex + count);
    } catch (error) {
      // Gestisco gli errori in caso di fallimento della richiesta
      console.error("Error:", error.message);
      throw error;
    }
  }

  // Definisco una funzione asincrona per recuperare i dettagli diuna news dato i suo ID
  async function characteristicsNews(newsId) {
    // Specifico l'URL per recuperare i dettagli di una news specifica da Hacker News API
    const linkApiUrl = `https://hacker-news.firebaseio.com/v0/item/${newsId}.json`;

    try {
      // Effettuo una richiesta GET per recuperare i dettagli della news
      const response = await axios.get(linkApiUrl);
      // Verifico se la risposta è ok
      if (!response.status === 200) {
        // Se la risposta non è ok, genero un errore
        throw new Error(`Error retrieving news details ${newsId}.`);
      }

      // Parse la risposta in formato JSON
      const newsDetails = response.data;
      // Restituisco i dettagli della news
      return newsDetails;
    } catch (error) {
      // Gestisco gli errori in caso i fallimento della richiesta
      console.error("Errore:", error.message);
      throw error;
    }
  }

  // Le funzioni loadNewsIds e characteristicsNews restituiscono entrambe una
  // Promise per far sì che l'applicazione vada avanti nel suo processo
  // per renderla più performante

  // funzione per visualizzare i dettagli di una news nel DOM
  function showNews(newsDetails) {
    const newsContainer = document.getElementById("newsContainer");
    // Creo un nuovo elemento <div> per rappresentare una singola news
    const newsItem = document.createElement("div");
    newsItem.classList.add("newsItem");

    // Creo un elemento <h2> per il titolo della news e imposto il testo
    const titleElement = document.createElement("h2");
    titleElement.textContent = newsDetails.title;
    titleElement.classList.add("newsTitle");

    // elemento <a> per il link alla news e imposto l'URL e il testo
    const linkElement = document.createElement("a");
    linkElement.href = newsDetails.url;
    linkElement.textContent = "Read much more";
    linkElement.classList.add("newsLink");

    // Creo un elemento <p> per la dsta della news e modific la data
    const dateElement = document.createElement("p");
    const newsDate = new Date(newsDetails.time * 1000);
    dateElement.textContent = "Data: " + newsDate.toLocaleString();
    dateElement.classList.add("newsDate");

    // e infine appendo gli elementi al contenitore della news
    newsItem.appendChild(titleElement);
    newsItem.appendChild(linkElement);
    newsItem.appendChild(dateElement);

    newsContainer.appendChild(newsItem);
  }

  // Al caricamento della pagina, carico le prime 10 news
  const firstNewsIds = await loadNewsIds(0, 10);
  // Aggiungo gli ID delle prime 10 news agli ID già caricati
  newsToLoad = newsToLoad.concat(firstNewsIds);
  // in modo che ottengo gliID delle prime 10 news
  for (const newsId of firstNewsIds) {
    const newsDetails = await characteristicsNews(newsId);
    showNews(newsDetails);
  }

  //  funzione per caricare ulteriori news quando l'utente fa clic sul pulsante
  async function loadMoreNews() {
    //  l'indice di partenza per le nuove news da caricare
    const startIndex = newsToLoad.length;
    // Recupero gli ID delle nuove news
    const newsIds = await loadNewsIds(startIndex, 10);
    // Verifico se non ci sono più news da caricare
    if (_.isEmpty(newsIds)) {
      // Nascondo il pulsante se non ci sono più news
      document.getElementById("loadMoreBtn").style.display = "none";
      // e un messaggio indicando che non ci sono più news disponibili
      const noMoreNewsMessage = document.createElement("p");
      noMoreNewsMessage.textContent = "No more news available.";
      document.getElementById("newsContainer").appendChild(noMoreNewsMessage);
      console.log("No more news available");
      return;
    }

    // Aggiungo gli ID delle nuove news agli ID già caricati utilizzando _.concat
    newsToLoad = _.concat(newsToLoad, newsIds);

    // qimdui per ogni ID delle nuove news, ottengo i dettagli e li visualizzo
    _.forEach(newsIds, async function (newsId) {
      const newsDetails = await characteristicsNews(newsId);
      showNews(newsDetails);
    });
  }

  // gestore di eventi al per caricare ulteriori news
  document
    .getElementById("loadMoreBtn")
    .addEventListener("click", loadMoreNews);
});

// riferimento alla descrizione e al bottone
const description = document.getElementById("description");
const toggleDescriptionBtn = document.getElementById("toggleDescriptionBtn");

//  gestore di eventi al bottone
toggleDescriptionBtn.addEventListener("click", function () {
  //per nascondere/mostrare la descrizione
  description.classList.toggle("hidden");

  // Cambio il testo del botto ne in base alla visibilità della descrizione
  if (description.classList.contains("hidden")) {
    toggleDescriptionBtn.textContent = "Show info";
  } else {
    toggleDescriptionBtn.textContent = "Hide info";
  }
});
