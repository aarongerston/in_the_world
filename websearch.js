/* GENERAL */

const searchEngine = 'Contextual'
// const searchEngine = 'Google'

function webSearch() {

    console.log("Scouring the web with " + searchEngine);

    fullQuestion = question + ' in ' + country + '?'
    fullURI = encodeURIComponent(fullQuestion).replace("'", "%27")
    
    if (searchEngine == 'Contextual') {

        contextualSearch(fullURI)

    } else if (searchEngine == 'Google') {

        // // Convert question to URI
        // var questionURI = encodeURIComponent(question).replace("'", "%27")
        // var countryURI = encodeURIComponent(clickedCountry).replace("'", "%27")
        // var fullURI = questionURI + '%20in%2' + countryURI + '%3F'

        var googleURL = "https://www.googleapis.com/customsearch/v1?key=" + GoogleAPIKey + "&cx=" + GoogleProjectKey + "&q=" + fullURI + "&num=5&callback=GoogleSearchHandler"
        GoogleSearch(googleURL)
    } else {
        console.log("Search engine not found.");
    }
}

function resultsHandler(results) {

    // Add Google results to results dict
    resultsDict[country] = results
    resultsDict[country]["scope"] = scope
    resultsDict[country]["question"] = question

    // add popup
    text = parseSearchResults(results)
    makeInfoPopup(text)

    // update info box
    info.update({infoCountry: country, text: ''})

    console.log(searchEngine + ' search success!');
}

function parseSearchResults(resultsObject) {
    if (searchEngine == "Google") {
        return parseGoogleResults(resultsObject)
    } else if (searchEngine == "Contextual") {
        return parseContextualResults(resultsObject)
    } else {
        console.log('Cannot find parser for '+searchEngine+'!');
        return "Oh no :(<br/>I'm having difficulties parsing the search results!"
    }
}


/* CONTEXTUAL */

function contextualSearch(qURI) {

    pageNumber = 1;
    pageSize = 5;
    URL = "https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/search/NewsSearchAPI?q=" +
          qURI + "&pageNumber=" + pageNumber + "&pageSize=" + pageSize + "&autoCorrect=false&fromPublishedDate=null&toPublishedDate=null"
            
    try {
        $(document).ready(function () {
            $.ajax(contextualSearchSettings(URL)).done(contextualSearchHandler);
        });
    } catch (err) {
        alert(err)
    }
}

const contextualSearchSettings = function(fullURL) {
    return {
        // "async": false,
        "timeout": 10000,
        "error": function(jqXHR, textStatus, errorThrown) {alert("Error! " + textStatus)},
        "crossDomain": true,
        "url": fullURL,
        "method": "GET",
        "headers": {
            "x-rapidapi-key": "62fd8f4dc6msh903481034dac164p1cab13jsn38dffd9f752b",
            "x-rapidapi-host": "contextualwebsearch-websearch-v1.p.rapidapi.com"
        }
    }
};

function contextualSearchHandler(response) {
    // Check if error

    // if no error:
    resultsHandler(response)
}

parseContextualResults = function(contextualResultsObject) {

    mainText = ''
    nItems = Math.min(contextualResultsObject.value.length, 5)
    if (nItems > 0) {
        mainText += "<ol class='hovered'>"
        for (i = 0; i < nItems; i++) {
            item = contextualResultsObject.value[i]
            mainText += "<span class='popupBold'>" + "<li><a id='popupAnchor' href=" + item.url + " target='_blank'>" + item.title + "</a></span>" +
                        "<span class='popupText'>" + "<br/><a id='popupAnchor' href=" + item.url + " target='_blank'>" + item.description + "</a><br/>"
            if (isMobile()) {
                mainText += "<br/>"
            } else {
                mainText += "<span class='popupLink'><a id='popupAnchor' href=" + item.url + " target='_blank'>" + item.url + "</a></span><br/><br/>"
            }
        }
        mainText += '</ol>'
        if (isMobile()) {
            mainText += "<br/>"
        }
    }

    return mainText
}


/* GOOGLE */

function GoogleSearch(URL) {
    console.log("Googling: " + URL);				
    
    // Prepare Google search script
    var jsElm = document.createElement(id="script"); // DOM: Create the script element
    jsElm.type = "application/javascript";
    jsElm.async = true;
    jsElm.src = URL; // make the script element load file

    // Insert the element to the body element in order to load the script
    document.body.appendChild(jsElm);
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(jsElm, s);
}

function GoogleSearchHandler(response) {

    try {
        var code = response.error.code
        if (code == 429) {
            console.log("Google Search error:")
            console.log(response.error)
            alert('Unfortunately In The World has reached its quota of Google queries per day :(\n\n'+
                  'If you\'d like to support this website and the use and development thereof, please consider making a small financial contribution to the developer!\n' +
                  'Every $5 pays for 1000 more Google queries!\n\n' +
                  'patreon.com/aarongerston')
        } 
    } catch (err) {
        console.log('No Google error.')

        resultsHandler(response)
    }
}

function parseGoogleResults(googleResultsObject) {

    mainText = ''
    nItems = Math.min(googleResultsObject.items.length, 5)
    if (nItems > 0) {
        mainText += '<ol class="hovered"><br\>'
        for (i = 0; i < nItems; i++) {
            item = googleResultsObject.items[i]
            mainText += "<span class='popupBold'>" + "<li><a id='popupAnchor' href=" + item.link + " target='_blank'>" + item.title + "</a></span>" +
                        "<span class='popupText'>" + "<br\><a id='popupAnchor' href=" + item.link + " target='_blank'>" + item.snippet + "</a><br>" +
                        "<span class='popupLink'><a id='popupAnchor' href=" + item.link + " target='_blank'>" + item.displayLink + "</a></span><br\><br\>"
        }
        mainText += '</ol>'
    }

    return mainText
}