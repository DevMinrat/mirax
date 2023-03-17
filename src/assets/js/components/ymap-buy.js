function initMap() {
  var myMap = new ymaps.Map("map", {
    center: [55.76, 37.64],
    zoom: 7,
    type: "yandex#map",
    controls: [],
  });

  var placemarks = [];

  document
    .querySelector(".selection__filter-btn")
    .addEventListener("click", function () {
      e.preventDefault();

      var region = document.querySelector(
        "div.select-region .current"
      ).textContent;
      var city = document.querySelector(
        ".div.select-city .current"
      ).textContent;

      ymaps.geocode(city).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);
        var cityCoords = firstGeoObject.geometry.getCoordinates();
        ymaps.geocode(region + " " + city).then(function (res) {
          var geoObjects = res.geoObjects.toArray();
          for (var i = 0; i < geoObjects.length; i++) {
            var coords = geoObjects[i].geometry.getCoordinates();
            var name = geoObjects[i].properties.get("name");
            var placemark = new ymaps.Placemark(coords, {
              balloonContent: name,
            });
            placemarks.push(placemark);
          }
          myMap.geoObjects.add(placemarks);
          myMap.setCenter(cityCoords, 12);
        });
      });
    });
}
ymaps.ready(initMap);
