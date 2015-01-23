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
        var part = result.item;
        var brandName = part.brand.name;
        var partMpn = part.mpn;
        var partSnippet = result.snippet;
        var resultsTemplate = document.getElementById("results-template").innerHTML;


        resultsTemplate = resultsTemplate.replace("{ {brandName} }", brandName);
        resultsTemplate = resultsTemplate.replace("{ {partMpn} }", partMpn);
        resultsTemplate = resultsTemplate.replace("{ {partSnippet} }", partSnippet);

        resultsTable.innerHTML += resultsTemplate;




      });
    };

    document.querySelector(".test").appendChild(dataSrc);


  });

});
