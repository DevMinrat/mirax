const byOnlineSites = [
  {
    siteName: "Ozon",
    siteUrl: "https://ozon.ru/",
    imageUrl: "assets/images/buy/buy-online-1.png",
  },
  {
    siteName: "Ozonator",
    siteUrl: "https://ozonator.ru/",
    imageUrl: "assets/images/buy/buy-online-1.png",
  },
  {
    siteName: "Wildberries",
    siteUrl: "https://www.wildberries.ru/",
    imageUrl: "assets/images/buy/buy-online-2.png",
  },
  {
    siteName: "Yandex.Market",
    siteUrl: "https://market.yandex.ru/",
    imageUrl: "assets/images/buy/buy-online-4.png",
  },
];

const buyOnlineBtn = document.querySelector(".buy-online__filter-btn");
const buyOnlineInput = document.querySelector("#buy-online__input");

if (buyOnlineBtn) {
  buyOnlineBtn.addEventListener("click", (e) => {
    e.preventDefault();

    if (buyOnlineInput.value.length < 2) return;

    renderResults(byOnlineSites);
  });
}

function renderResults(results) {
  let resultSection = document.querySelector(".buy-online__content");

  resultSection.innerHTML = "";

  // получаем значение поля фильтра
  const filterValue = buyOnlineInput.value.toLowerCase();

  for (let site of results) {
    const siteName = site.siteName.toLowerCase();

    // проверяем, подходит ли результат под фильтр
    if (siteName.includes(filterValue) && filterValue.length >= 2) {
      let link = document.createElement("a");
      link.classList.add("buy-online__link");
      link.href = site.siteUrl;

      let image = document.createElement("img");
      image.src = site.imageUrl;
      image.alt = site.siteName;

      link.appendChild(image);
      resultSection.appendChild(link);
    }
  }
}
