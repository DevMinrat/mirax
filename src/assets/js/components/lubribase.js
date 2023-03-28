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

makeApiCall(
  "getCategories",
  "GET",
  {},
  function (success) {
    console.log(success);
  },
  function (error) {
    console.log(error);
  }
);

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

$("#categories, #categories_left").change(function () {
  if (initialLoading) return false;
  $(
    "#recomendation,#manufacturers,#manufacturers_left, #model_series,#model_series_left, #models,#models_left"
  ).empty();
  $(
    "#manufacturers,#manufacturers_left,#model_series,#model_series_left, #models,#models_left"
  ).append(
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
      console.log(response);
      populateSelect(
        $("#manufacturers").is(":visible")
          ? "manufacturers"
          : "manufacturers_left",
        response.results
      );
    },
    function (error) {
      console.log(error);
    }
  );
});

// When the "Manufacturers" select input changes
$("#manufacturers,#manufacturers_left").change(function () {
  if (initialLoading) return false;
  $(
    "#recomendation,#model_series,#model_series_left, #models,#models_left"
  ).empty();
  $("#model_series,#model_series_left, #models,#models_left").append(
    $('<option value="0" selected disabled>Выберите из списка</option>')
  );
  $("#go-to-selection").attr("disabled", true);
  var categoryId =
    $("#categories:visible").val() || $("#categories_left:visible").val();
  var manufacturerId = $(this).val();

  // Make an API call to get the model series for the selected manufacturer
  makeApiCall(
    "getModelSeries",
    "GET",
    { categoryId: categoryId, manufacturerId: manufacturerId },
    function (response) {
      // Populate the select input with the data
      populateSelect(
        $("#model_series").is(":visible")
          ? "model_series"
          : "model_series_left",
        response.results
      );
    },
    function (error) {
      console.log(error);
    }
  );
});

$("#model_series,#model_series_left").change(function () {
  if (initialLoading) return false;
  //	$('#recomendation,#models,#models_left').empty();
  $("#models,#models_left").append(
    $('<option value="0" selected disabled>Выберите из списка</option>')
  );
  $("#go-to-selection").attr("disabled", true);
  var categoryId =
    $("#categories:visible").val() || $("#categories_left:visible").val();
  var manufacturerId =
    $("#manufacturers:visible").val() || $("#manufacturers_left:visible").val();
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
      populateSelect(
        $("#models").is(":visible") ? "models" : "models_left",
        response.results
      );
    },
    function (error) {
      console.log(error);
    }
  );
});
$("#models").change(function () {
  var modelId = $(this).val();
  if (modelId) {
    var categoryId =
      $("#categories:visible").val() || $("#categories_left:visible").val();
    var manufacturerId =
      $("#manufacturers:visible").val() ||
      $("#manufacturers_left:visible").val();
    var modelSeriesId =
      $("#model_series:visible").val() || $("#model_series_left:visible").val();
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

$("#models_left").change(function () {
  var modelId = $(this).val();
  if (modelId) {
    makeApiCall(
      "getEquipment",
      "GET",
      {
        modelId: modelId,
      },
      function (response) {
        $("#recomendation").html(response);
      },
      function (error) {
        console.log(error);
      }
    );
  }
});

var loadValues = function (
  categoryId,
  manufacturerId,
  modelSeriesId,
  modelId,
  modelName
) {
  var initialLoading = true;
  makeApiCall(
    "getCategories",
    "GET",
    {},
    function (response) {
      populateSelect("categories_left", response.results, categoryId);

      makeApiCall(
        "getManufacturers",
        "GET",
        { categoryId: categoryId },
        function (response) {
          populateSelect(
            "manufacturers_left",
            response.results,
            manufacturerId
          );

          makeApiCall(
            "getModelSeries",
            "GET",
            { categoryId: categoryId, manufacturerId: manufacturerId },
            function (response) {
              populateSelect(
                "model_series_left",
                response.results,
                modelSeriesId
              );
              makeApiCall(
                "getModels",
                "GET",
                {
                  categoryId: categoryId,
                  manufacturerId: manufacturerId,
                  modelSeriesId: modelSeriesId,
                },
                function (response) {
                  populateSelect(
                    "models_left",
                    response.results,
                    modelId,
                    modelName
                  );
                  setTimeout(() => {
                    initialLoading = false;

                    /*$('#models_left option').each((i, el)=>{
													if ($(el).attr('data-model') == modelName){
														$('#models_left').val(el.value);
													}
												});*/
                    setTimeout(() => {
                      $("#models_left").change();
                    }, 0);
                  }, 500);
                },
                function (error) {
                  console.log(error);
                }
              );
            },
            function (error) {
              console.log(error);
            }
          );
        },
        function (error) {
          console.log(error);
        }
      );
    },
    function (error) {
      console.log(error);
    }
  );
};
