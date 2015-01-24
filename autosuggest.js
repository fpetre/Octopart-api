document.addEventListener('DOMContentLoaded', function () {
  if (typeof AutoSuggest === "undefined") {
    window.AutoSuggest = {};
  }

  var OCTOPART_API_KEY = "a3691cb7"; // in a production enviroment there would be a backend server and this would be hidden
  var url = "http://octopart.com/api/v3/parts/search";
  url += "?callback=AutoSuggest.parseResponse";


  var searchInput = document.querySelector(".parts-search-suggestions-input > input");
  var searchForm = document.querySelector(".parts-search-form");

  //autosuggest
  searchInput.addEventListener("keyup", function (event){
    var dataSrc = document.createElement('script');
    var searchQuery = event.target.value;
    var searchUrl = url + "&apikey=" + OCTOPART_API_KEY + "&q=" + searchQuery;
    dataSrc.src = searchUrl;
    AutoSuggest.parseResponse = function (search_response) {
      var searchSuggestionsEl = document.querySelector(".parts-search-suggestions > ul");
      
      searchSuggestionsEl.innerHTML = "";
      for (var i = 0; i < 5; i++) {
        if (searchQuery.length < 2) {break};
        var searchResultEl = document.createElement("li");
        var item = search_response.results[i].item;
        searchResultEl.innerHTML = item.mpn;
        searchSuggestionsEl.appendChild(searchResultEl);
      };
    };

    document.querySelector(".test").appendChild(dataSrc);

  });


  //submit search
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
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

        for (var j = 0; j < 4; j++) {
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
