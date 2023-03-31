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

let myMap;

function initMap() {
  const presetCoords = [55.76, 37.64];

  const mapCenter = sessionStorage.getItem("myMapCenter");
  let centerCoords;

  if (mapCenter) {
    centerCoords = JSON.parse(mapCenter);
  } else {
    centerCoords = presetCoords;
  }

  fetch("/ajax/map_points.php")
    .then((response) => response.json())
    .then((responseData) => {
      (myMap = new ymaps.Map("map", {
        center: centerCoords,
        zoom: 10,
        controls: [],
      })),
        (objectManager = new ymaps.ObjectManager({
          clusterize: true,
        }));

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
    .querySelector(".map__filter-btn")
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

      ymaps.geocode(searchQuery).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);
        var cityCoords = firstGeoObject.geometry.getCoordinates();

        var objectBounds = firstGeoObject.properties.get("boundedBy");
        myMap.setBounds(objectBounds);
      });
    });
}

if (document.querySelector(".buy-offline__map")) {
  const regionSelect = document.querySelector(".select-region");
  const citySelect = document.querySelector(".select-city");

  fetch("/ajax/map_points.php")
    .then((response) => response.json())
    .then((responseData) => {
      let filteredData = {};

      responseData.forEach((item) => {
        if (item.city && item.region) {
          if (!Object.keys(filteredData).includes(item.region)) {
            filteredData[item.region] = [item.city];
          } else if (!filteredData[item.region].includes(item.city)) {
            filteredData[item.region].push(item.city);
          }
        }
      });

      const regions = [];

      for (let key in filteredData) {
        regions.push(key);
      }

      regions.forEach((el) => {
        const option = document.createElement("option");
        option.value = el;
        option.text = el;
        regionSelect.appendChild(option);
      });

      $(regionSelect).niceSelect("update");

      $(".select-region").change(function () {
        const selectedRegion = $(this).val();

        $(citySelect).empty();
        $(citySelect).append($('<option value="" selected>Город</option>'));
        $(citySelect).niceSelect("update");

        const cities = filteredData[selectedRegion];

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
