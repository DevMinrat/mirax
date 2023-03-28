const byOnlineSites = [
  {
    siteName: "Ozon",
    synonyms: "ozon, azon, озон, азон",
    siteUrl: "https://ozon.ru/",
    imageUrl: "assets/images/buy/buy-online-1.png",
  },
  {
    siteName: "Ozonator",
    synonyms: "Ozonator ozonat azon озон азон",
    siteUrl: "https://ozonator.ru/",
    imageUrl: "assets/images/buy/buy-online-1.png",
  },
  {
    siteName: "Wildberries",
    synonyms: "Wildberriesвилдберизвайлдбериез",
    siteUrl: "https://www.wildberries.ru/",
    imageUrl: "assets/images/buy/buy-online-2.png",
  },
  {
    siteName: "Yandex.Market",
    synonyms: "Yandex.Market яндекс маркет",
    siteUrl: "https://market.yandex.ru/",
    imageUrl: "assets/images/buy/buy-online-4.png",
  },
];

const buyOnlineBtn = document.querySelector(".buy-online__filter-btn");
const buyOnlineInput = document.querySelector("#buy-online__input");

window.sit =
  '[{"ID":"26","~ID":"26","NAME":"ozon","~NAME":"ozon","PREVIEW_TEXT":"https://ozon.ru/","~PREVIEW_TEXT":"https://ozon.ru/","PREVIEW_PICTURE":"52","~PREVIEW_PICTURE":"52","PREVIEW_TEXT_TYPE":"html","~PREVIEW_TEXT_TYPE":"html","PREVIEW":"/upload/iblock/90b/hzwtozcokqbujf2jjezqo7d68k62qied/buy-online-1.png"},{"ID":"27","~ID":"27","NAME":"Wildberries","~NAME":"Wildberries","PREVIEW_TEXT":"https://www.wildberries.ru/","~PREVIEW_TEXT":"https://www.wildberries.ru/","PREVIEW_PICTURE":"53","~PREVIEW_PICTURE":"53","PREVIEW_TEXT_TYPE":"html","~PREVIEW_TEXT_TYPE":"html","PREVIEW":"/upload/iblock/8e9/qt2hl9rkbws8mkyc4ury99g1mrehaooz/buy-online-2.png"},{"ID":"28","~ID":"28","NAME":"\u0421\u0431\u0435\u0440 \u043c\u0430\u0440\u043a\u0435\u0442","~NAME":"\u0421\u0431\u0435\u0440 \u043c\u0430\u0440\u043a\u0435\u0442","PREVIEW_TEXT":"https://sbermarket.ru/","~PREVIEW_TEXT":"https://sbermarket.ru/","PREVIEW_PICTURE":"54","~PREVIEW_PICTURE":"54","PREVIEW_TEXT_TYPE":"html","~PREVIEW_TEXT_TYPE":"html","PREVIEW":"/upload/iblock/30a/60lx8307tg1m8hwqgiwxgrlqjlq74cg6/buy-online-3.png"},{"ID":"29","~ID":"29","NAME":"Yandex.Market","~NAME":"Yandex.Market","PREVIEW_TEXT":"https://market.yandex.ru/","~PREVIEW_TEXT":"https://market.yandex.ru/","PREVIEW_PICTURE":"55","~PREVIEW_PICTURE":"55","PREVIEW_TEXT_TYPE":"html","~PREVIEW_TEXT_TYPE":"html","PREVIEW":"/upload/iblock/1e0/q087fb49v2uqlpyqdnk8wf20njkb0pvt/buy-online-4.png"},{"ID":"30","~ID":"30","NAME":"autodoc","~NAME":"autodoc","PREVIEW_TEXT":"https://www.autodoc.ru/","~PREVIEW_TEXT":"https://www.autodoc.ru/","PREVIEW_PICTURE":"56","~PREVIEW_PICTURE":"56","PREVIEW_TEXT_TYPE":"html","~PREVIEW_TEXT_TYPE":"html","PREVIEW":"/upload/iblock/ccb/qf9yyqq87igo534hna40k5k6gtt7y14c/buy-online-5.png"}]';

// console.log(JSON.parse(window.sit));

if (buyOnlineBtn) {
  buyOnlineBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (buyOnlineInput.value.length < 2) return;

    renderResults(JSON.parse(window.sit));
  });
}

function renderResults(results) {
  console.log(results);

  let resultSection = document.querySelector(".buy-online__content");

  resultSection.innerHTML = "";

  const filterValue = buyOnlineInput.value.toLowerCase();

  for (let site of results) {
    const siteName = site.NAME.toLowerCase();

    console.log(siteName);

    if (siteName.includes(filterValue) && filterValue.length >= 2) {
      let link = document.createElement("a");
      link.classList.add("buy-online__link");
      link.href = site.PREVIEW_TEXT;

      let image = document.createElement("img");
      image.src = site.PREVIEW;
      image.alt = siteName;

      link.appendChild(image);
      resultSection.appendChild(link);
    }
  }
}
