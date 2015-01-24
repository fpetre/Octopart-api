document.addEventListener('DOMContentLoaded', function () {
  if (typeof AutoSuggest === "undefined") {
    window.AutoSuggest = {};
  }

  var OCTOPART_API_KEY = "a3691cb7"; // in a production enviroment there would be a backend server and this would be hidden
  var url = "http://octopart.com/api/v3/parts/search";
  url += "?callback=AutoSuggest.parseResponse";


  var searchInput = document.querySelector(".parts-search > input");
  var searchButton = document.querySelector(".parts-search > button");

  //submit search
  searchButton.addEventListener("click", function () {
    var resultsTable = document.getElementById("results");
    var dataSrc = document.createElement('script');
    var searchQuery = searchInput.value;
    var searchUrl = url + "&apikey=" + OCTOPART_API_KEY + "&q=" + searchQuery;
    searchInput.value = "";
    resultsTable.innerHTML = "";
    dataSrc.src = searchUrl;

    AutoSuggest.parseResponse = function (search_response) {
      search_response.results.forEach(function(result, i){
        var resultsTemplate = document.getElementById("results-template").innerHTML;
        var part = result.item;
        var brandName = part.brand.name;
        var partMpn = part.mpn;
        var partSnippet = result.snippet;
        var offers = part.offers;
        

        resultsTemplate = resultsTemplate.replace("{ {tblnum} }", i);
        resultsTemplate = resultsTemplate.replace("{ {brandName} }", brandName);
        resultsTemplate = resultsTemplate.replace("{ {partMpn} }", partMpn);
        resultsTemplate = resultsTemplate.replace("{ {partSnippet} }", partSnippet);
        resultsTable.innerHTML += resultsTemplate;

        for (var j = 0; j < offers.length; j++) {
          if (j > 3) {break};
          var offer = offers[j];
          var distributor = offer.seller.name;
          var sku = offer.sku;
          var stock = offer.in_stock_quantity;
          var productUrl = offer.product_url;
          var resultsPartInfoEl = document.getElementById("results-part-info-" + i);
          var resultsPartInfoTemplate = document.getElementById("results-part-info-template").innerHTML;
          var resultsPartInfoTr = document.createElement("tr");

          resultsPartInfoTemplate = resultsPartInfoTemplate.replace("{ {distributor} }", distributor);
          resultsPartInfoTemplate = resultsPartInfoTemplate.replace("{ {sku} }", sku);
          resultsPartInfoTemplate = resultsPartInfoTemplate.replace("{ {stock} }", stock);
          resultsPartInfoTemplate = resultsPartInfoTemplate.replace("{ {url} }", productUrl);
          resultsPartInfoTr.innerHTML = resultsPartInfoTemplate;

          resultsPartInfoEl.appendChild(resultsPartInfoTr);

        };
      });
    };

    document.querySelector(".test").appendChild(dataSrc);


  });

});
