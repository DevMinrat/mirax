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

  fetch("сities.json")
    .then((response) => response.json())
    .then((responseData) => {
      const myMap = new ymaps.Map("map", {
          center: centerCoords,
          zoom: 10,
          controls: [],
        }),
        objectManager = new ymaps.ObjectManager({
          clusterize: true,
        });

      myMap.geoObjects.add(objectManager);

      sessionStorage.setItem("myMapCenter", JSON.stringify(myMap.getCenter()));

      getCoordinates(
        (coordinates) => {
          myMap.setCenter(coordinates, 10);
        },
        () => {
          console.log("User location is not available.");
        }
      );

      const pointsFeatures = responseData.map(function (point, index) {
        var coords = point.center;
        var name = point.name;
        var content = point.content;
        var email = point.email;
        var address = point.address;
        var phone = point.phone;
        var web = point.web;

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

        return {
          type: "Feature",
          id: index,
          geometry: { type: "Point", coordinates: coords },
          properties: {
            balloonContent: balloonContent,
            clusterCaption: "Еще одна метка",
          },
        };
      });

      const objectsData = {
        type: "FeatureCollection",
        features: pointsFeatures,
      };

      objectManager.add(objectsData);

      function onObjectEvent(e) {
        var objectId = e.get("objectId");
        if (e.get("type") == "mouseenter") {
          // Метод setObjectOptions позволяет задавать опции объекта "на лету".
          objectManager.objects.setObjectOptions(objectId, {
            preset: "islands#yellowIcon",
          });
        } else {
          objectManager.objects.setObjectOptions(objectId, {
            preset: "islands#blueIcon",
          });
        }
      }

      function onClusterEvent(e) {
        var objectId = e.get("objectId");
        if (e.get("type") == "mouseenter") {
          objectManager.clusters.setClusterOptions(objectId, {
            preset: "islands#yellowClusterIcons",
          });
        } else {
          objectManager.clusters.setClusterOptions(objectId, {
            preset: "islands#blueClusterIcons",
          });
        }
      }

      objectManager.objects.events.add(
        ["mouseenter", "mouseleave"],
        onObjectEvent
      );
      objectManager.clusters.events.add(
        ["mouseenter", "mouseleave"],
        onClusterEvent
      );
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });

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
