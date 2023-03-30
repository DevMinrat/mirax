const selectionBtn = document.querySelector(".selection__filter-btn");

function makeApiCall(action, method, data, success, error) {
  $.ajax({
    url: "/lubribase_api.php",
    method: method,
    data: { action: action, ...data },
    success: success,
    error: error,

    statusCode: {
      404: function () {
        alert("page not found");
      },
    },
  });
}

function getModelText(data) {
  let driveType = "";
  if (data.drive_types && data.drive_types.length == 1) {
    if (data.model.indexOf(data.drive_types[0]) == -1) {
      driveType = " " + data.drive_types[0];
    }
  }
  return data.mid
    ? data.model +
        driveType +
        " (" +
        (data.engine_output_hp ? data.engine_output_hp + " л.с., " : "") +
        data.year_from +
        "-" +
        (data.year_to ? data.year_to : "н.в.") +
        ")"
    : data.name;
}
// Create the function to populate the select input
function populateSelect(selectId, data, value, modelName) {
  selectId = "#" + selectId;
  // Clear the select input

  $(selectId).empty();
  if (selectId.indexOf("categories") == -1) {
    $(selectId).append(
      $('<option value="0" selected disabled>Выберите из списка</option>')
    );
  }
  $(selectId).parent().addClass("with-value");
  for (var i = 0; i < data.length; i++) {
    let selected = value == (data[i].mid ? data[i].mid : data[i].id);
    if (modelName && modelName == getModelText(data[i])) {
      selected = true;
    }
    $(selectId).append(
      $("<option>", {
        "data-model": data[i].model ? getModelText(data[i]) : "",
        value: data[i].mid ? data[i].mid : data[i].id,
        text: getModelText(data[i]),
        selected: selected,
      })
    );
  }
  if (!value && selectId.indexOf("categories") > -1) {
    $(selectId).change();
  }
}

var initialLoading = false;

$("#categories").change(function () {
  if (initialLoading) return false;
  $("#recomendation,#manufacturers, #model_series, #models").empty();
  $("#manufacturers,#model_series, #models").append(
    $('<option value="0" selected disabled>Выберите из списка</option>')
  );
  $("#go-to-selection").attr("disabled", true);
  // Get the selected category id
  var categoryId = $(this).val();
  if (!categoryId) return;

  makeApiCall(
    "getManufacturers",
    "GET",
    { categoryId: categoryId },
    function (response) {
      console.log(1);

      populateSelect("manufacturers", response.results);
      $(".nice-select").niceSelect("update");
    },
    function (error) {
      console.log(error);
    }
  );
});

// When the "Manufacturers" select input changes
$("#manufacturers").change(function () {
  if (initialLoading) return false;
  $("#recomendation,#model_series, #models").empty();
  $("#model_series, #models").append(
    $('<option value="0" selected disabled>Выберите из списка</option>')
  );
  $("#go-to-selection").attr("disabled", true);
  var categoryId = $("#categories").val();
  var manufacturerId = $(this).val();

  // Make an API call to get the model series for the selected manufacturer

  console.log(categoryId, manufacturerId);
  makeApiCall(
    "getModelSeries",
    "GET",
    { categoryId: categoryId, manufacturerId: manufacturerId },
    function (response) {
      console.log(response);
      // Populate the select input with the data
      populateSelect("model_series", response.results);
      console.log(2);
      $(".nice-select").niceSelect("update");
    },
    function (error) {
      console.log(error);
    }
  );
});

$("#model_series").change(function () {
  if (initialLoading) return false;
  //	$('#recomendation,#models').empty();
  $("#models").append(
    $('<option value="0" selected disabled>Выберите из списка</option>')
  );
  $("#go-to-selection").attr("disabled", true);
  var categoryId = $("#categories").val();
  var manufacturerId = $("#manufacturers").val();
  var modelSeriesId = $(this).val();

  // Make an API call to get the models for the selected category, manufacturer, and model series
  makeApiCall(
    "getModels",
    "GET",
    {
      categoryId: categoryId,
      manufacturerId: manufacturerId,
      modelSeriesId: modelSeriesId,
    },
    function (response) {
      populateSelect("models", response.results);
      console.log(3);
      $(".nice-select").niceSelect("update");
    },
    function (error) {
      console.log(error);
    }
  );
});
$("#models").change(function () {
  var modelId = $(this).val();
  if (modelId) {
    var categoryId = $("#categories").val();
    var manufacturerId = $("#manufacturers").val();
    var modelSeriesId = $("#model_series").val();
    $("#go-to-selection").attr("disabled", false);

    $("#category-id").val(categoryId);
    $("#manufacturer-id").val(manufacturerId);
    $("#model-series-id").val(modelSeriesId);
    $("#model-id").val(modelId);
    $("#model-name").val($("#models option:selected").attr("data-model"));
  } else {
    $("#go-to-selection").attr("disabled", true);
  }
});

if (selectionBtn) {
  selectionBtn.addEventListener("click", (e) => {
    e.preventDefault();

    var modelId = $("#models").val();
    if (modelId) {
      makeApiCall(
        "getEquipment",
        "GET",
        {
          modelId: modelId,
        },
        function (response) {
          console.log(modelId);
          console.log(response);
          $("#recomendation").html(response);
        },
        function (error) {
          console.log(error);
        }
      );
    }
  });

  makeApiCall(
    "getCategories",
    "GET",
    {},
    function (response) {
      populateSelect("categories", response.results, 2);
      $("#categories").change();
      console.log(0);
      $(".nice-select").niceSelect("update");
    },
    function (error) {
      console.log(error);
    }
  );
}
