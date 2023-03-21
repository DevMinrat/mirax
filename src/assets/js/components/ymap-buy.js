function getCoordinates(successCallback, errorCallback) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      successCallback([latitude, longitude]);
    },
    () => {
      errorCallback();
    }
  );
}

function initMap() {
  const presetCoords = [55.76, 37.64];

  const mapCenter = sessionStorage.getItem("myMapCenter");
  let centerCoords;

  if (mapCenter) {
    centerCoords = JSON.parse(mapCenter);
  } else {
    centerCoords = presetCoords;
  }

  const myMap = new ymaps.Map("map", {
    center: centerCoords,
    zoom: 10,
    controls: [],
  });

  sessionStorage.setItem("myMapCenter", JSON.stringify(myMap.getCenter()));

  getCoordinates(
    (coordinates) => {
      myMap.setCenter(coordinates, 10);
    },
    () => {
      console.log("User location is not available.");
    }
  );

  var pointsData = [
    {
      city: "1",
      region: "22",
      name: "1 STH Earth Co., LTD",
      center: [55.76, 37.64],
      content: "",
      email: "moscow@test.by",
      address: "Москва, улица Уборевича, 176",
      phone: "+375-17-111-11-11",
      web: null,
    },
    {
      city: "2",
      region: "22",
      name: "2 STH Earth Co., LTD",
      center: [56.01, 92.87],
      content: "",
      email: null,
      address: "Красноярск, улица Красноярск, 126",
      phone: "+375-17-222-22-22",
      web: null,
    },
    {
      city: "3",
      region: "22",
      name: "3 STH Earth Co., LTD",
      center: [60.61, 56.84],
      content: "",
      email: "sict@test.by",
      address: "Сыктывкар, улица Сыктывкар, 176",
      phone: "+375-17-333-33-33",
      web: "sict.ru",
    },
    {
      city: "4",
      region: "22",
      name: "4 STH Earth Co., LTD",
      center: [43.11, 131.91],
      content: "",
      email: "vladik@test.by",
      address: "Владивосток, улица Владивосток, 176",
      phone: "+375-17-444-34-34",
      web: "vladik.ru",
    },
    {
      city: "5",
      region: "22",
      name: "5 STH Earth Co., LTD",
      center: [51.54, 46.02],
      content: "",
      email: null,
      address: "Владивосток, улица Владивосток, 176",
      phone: null,
      web: null,
    },
  ];

  // Отрисовываем точки на карте
  for (var i = 0; i < pointsData.length; i++) {
    var coords = pointsData[i].center;
    var name = pointsData[i].name;
    var content = pointsData[i].content;
    var email = pointsData[i].email;
    var address = pointsData[i].address;
    var phone = pointsData[i].phone;
    var web = pointsData[i].web;

    var balloonContent = `<b>${name}</b><br>`;
    if (content !== "") {
      balloonContent += `${content}<br>`;
    }
    if (address !== null) {
      balloonContent += `Адрес: ${address}<br>`;
    }
    if (email !== null) {
      balloonContent += `Email: <a href="mailto:${email}">${email}</a><br>`;
    }

    if (phone !== null) {
      balloonContent += `Телефон: <a href="tel:${phone}">${phone}</a><br>`;
    }
    if (web !== null) {
      balloonContent += `Сайт: <a href="${web}" target="_blank">${web}</a>`;
    }

    var placemark = new ymaps.Placemark(coords, {
      balloonContent: balloonContent,
    });
    myMap.geoObjects.add(placemark);
  }

  document
    .querySelector(".selection__filter-btn")
    .addEventListener("click", function (e) {
      e.preventDefault();

      var region = document.querySelector(
        ".select-region option:checked"
      ).textContent;
      var city = document.querySelector(".select-city option:checked").value;
      var searchQuery = region;
      if (city) {
        searchQuery += " " + city;
      }

      // Получаем результаты геокодирования выбранного пользователем населенного пункта
      ymaps.geocode(searchQuery).then(function (res) {
        // Поиск первого найденного объекта и его координат
        var firstGeoObject = res.geoObjects.get(0);
        var cityCoords = firstGeoObject.geometry.getCoordinates();

        // Устанавливаем границы карты для отображения всей области/объекта
        var objectBounds = firstGeoObject.properties.get("boundedBy");
        myMap.setBounds(objectBounds);
      });
    });
}

if (document.querySelector(".buy-offline__map")) {
  const regionOptions = document.querySelectorAll("div.select-region .option");
  const citySelect = document.querySelector(".select-city");

  const citiesByRegions = {
    "Московская область": [
      "Москва",
      "Клин",
      "Дмитров",
      "Сергиев Посад",
      "Люберцы",
    ],
    "Брянская область": ["Брянск", "Клинцы", "Злынка", "Стародуб", "Унеча"],
    "Владимирская область": [
      "Владимир",
      "Гусь-Хрустальный",
      "Ковров",
      "Кольчугино",
      "Петушки",
    ],
    "Кировская область": [
      "Киров",
      "Слободской",
      "Омутнинск",
      "Котельнич",
      "Яранск",
    ],
    "Санкт-Петербург": [
      "Санкт-Петербург",
      "Кронштадт",
      "Колпино",
      "Сестрорецк",
      "Павловск",
    ],
  };

  regionOptions.forEach((region) => {
    region.addEventListener("click", function () {
      const selectedRegion = region.dataset.value;

      citySelect.innerHTML = "";

      if (!selectedRegion) {
        const placeholderOption = document.createElement("option");
        placeholderOption.value = "";
        placeholderOption.text = "Город";
        citySelect.appendChild(placeholderOption);

        $(citySelect).niceSelect("update");
        return;
      }

      const cities = citiesByRegions[selectedRegion];

      const placeholderOption = document.createElement("option");
      placeholderOption.value = "";
      placeholderOption.text = "Город";
      citySelect.appendChild(placeholderOption);

      for (let i = 0; i < cities.length; i++) {
        const option = document.createElement("option");
        option.value = cities[i];
        option.text = cities[i];
        citySelect.appendChild(option);
      }
      $(citySelect).niceSelect("update");
    });
  });

  ymaps.ready(initMap);
}
