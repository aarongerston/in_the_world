

function makeInfoPopup(text) {
    
    docHeight = document.getElementById('map').offsetHeight
    docWidth = document.getElementById('map').offsetWidth

    var popupSettings = {className: 'info-popup',
                         autoPan: true,
                         closeButton: true,
                         closeOnClick: true,
                         maxWidth: popupMaxWidth(),
                         maxHeight: docHeight/2,
                         autoclose: false}

    infoPopup = L.popup(popupSettings)
                 .setLatLng(coords)
                 .setContent("<div class='popupHeader'>" + fullQuestion + "</div>" + text);
    // infoPopup._updateLayout()
    
    map.addLayer(infoPopup).fire('popupopen', {
        popup: map._popup
    });

    // hide info box
    info.remove();

    // add info box again on close infoPopup
    infoPopup.on('remove', function() {
        info.addTo(map);
    });
}


function countryClick(event) {

    var clickedCountry = event.target.feature.properties.name
    coords = event.latlng

    if (clickedCountry) {

        if (country in resultsDict && resultsDict[country]["scope"] == scope && resultsDict[country]["question"] == question) {
            // If there are already stored search results for this country, question, scope, return them
            results = resultsDict[country]
            console.log("Found results:");
            console.log(results);

            text = parseSearchResults(results)
            makeInfoPopup(text)
        } else {
            // If results for this country, question, scope aren't yet stored: Google them
            info.update({text: 'Scouring the web... One moment, please.'})
            hoverPopup.setContent('Scouring the web... One moment, please.')

            webSearch()
        }
    } else {
        this._div.innerHTML = '<h4>' + question + ' in ' + scope + '?</h4>' + 'Click to find out';
    }
};