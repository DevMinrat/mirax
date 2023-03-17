function initMap() {
  var myMap = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 4,
    type: "yandex#map",
    controls: [],
  });

  var pointsData = [
    {
      coordinates: [55.76, 37.64],
      name: "Точка 1",
      region: "Московская область",
      city: "Москва",
    },
    {
      coordinates: [56.01, 92.87],
      name: "Точка 2",
      region: "Красноярский край",
      city: "Красноярск",
    },
    {
      coordinates: [60.61, 56.84],
      name: "Точка 3",
      region: "Республика Коми",
      city: "Сыктывкар",
    },
    {
      coordinates: [43.11, 131.91],
      name: "Точка 4",
      region: "Приморский край",
      city: "Владивосток",
    },
    {
      coordinates: [51.54, 46.02],
      name: "Точка 5",
      region: "Волгоградская область",
      city: "Волгоград",
    },
  ];

  // Отрисовываем точки на карте
  for (var i = 0; i < pointsData.length; i++) {
    var coords = pointsData[i].coordinates;
    var name = pointsData[i].name;
    var placemark = new ymaps.Placemark(coords, { balloonContent: name });
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
      console.log(city);
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

ymaps.ready(initMap);
