<script lang="ts">
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";  //needs to be imported for proper rendering!
    import "leaflet.locatecontrol";
    import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"; // Import styles
    import { LocateControl } from "leaflet.locatecontrol";

    export var lat=48.783;
	export var lon=9.183;
	export var zoom=13;

    const marker_image = L.icon({
        iconUrl: 'images/marker-icon.png',
        shadowUrl: 'images/marker-shadow.png',

        iconSize:     [25, 41], // size of the icon
        shadowSize:   [41, 41], // size of the shadow
        iconAnchor:   [14, 41], // point of the icon which will correspond to marker's location
        shadowAnchor: [14, 40],  // the same for the shadow
        popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
    });

    function createMap(container: HTMLDivElement){
        var map = L.map(container).setView([lat, lon], zoom);
        map.locate({setView: true, maxZoom: 16}); //manual go to user location
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        let lc = new LocateControl({
            flyTo: true,
            keepCurrentZoomLevel: true,
            showCompass: true, // optional
            strings: {
                title: "Standort anzeigen"
            },
            }).addTo(map);

        map.on('dragend', function onDragEnd(){
            fetchOverpass(map);
        });
        map.on('zoom', function onZoomEnd(){
            fetchOverpass(map);
        });
        fetchOverpass(map);

    }
    async function fetchOverpass(map){
        lat = map.getCenter().lat.toFixed(3);
        lon = map.getCenter().lng.toFixed(3);
        zoom = map.getZoom();
        window.history.pushState("object or string", "Title", "?lat=" + lat + "&lon=" + lon + "&zoom=" + zoom);
        var showPoi = zoom > 10;
        if(showPoi){
            var east = map.getBounds().getEast();
            var west = map.getBounds().getWest();
            var north = map.getBounds().getNorth();
            var south = map.getBounds().getSouth();

            var bbox = south +","+ west +","+ north +","+ east;
            var query = '[out:json][timeout:25];(nwr["amenity"="drinking_water"]('+bbox+');' +
                'nwr["drinking_water"="yes"]('+bbox+');' +
                'nwr["drinking_water:legal"="yes"]('+bbox+');' +
                'nwr["fountain"="drinking"]('+bbox+');' +
                'nwr["fountain"="bubbler"]('+bbox+');' +
                'nwr["fountain"="bottle_refill"]('+bbox+');' +
                'nwr["natural"="spring"]('+bbox+');' +
                'nwr["man_made"="water_well"]('+bbox+');' +
                'way["landuse"="cemetery"]('+bbox+');' +
                'relation["landuse"="cemetery"]('+bbox+');' +
                'way["amenity"="grave_yard"]('+bbox+');' +
                'relation["amenity"="grave_yard"]('+bbox+');' +
                ');+out+geom;';
            const response = await fetch('https://overpass-api.de/api/interpreter', {
                method: 'POST',
                headers:{'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                body: "data=" + query
            });

            response.json().then(parsedResponse => {
                map.eachLayer((layer) => {  //remove all previous markers for performance reasons
                    if (layer instanceof L.Marker) {
                        layer.remove();
                    }
                });
                parsedResponse.elements.forEach(element => {
                    if(element.tags.drinking_water == "no"){
                        return; //skip if no drinking water
                    }
                    if(element.type == "node"){    //render if element is point
                        var marker = L.marker([element.lat, element.lon], {icon: marker_image}).addTo(map)
                        .bindPopup(renderPopup(element));
                    }else if(element.type == "way"){
                        var marker = L.marker([element.geometry[0].lat, element.geometry[0].lon], {icon: marker_image}).addTo(map)
                        .bindPopup(renderPopup(element));
                    }
                });
            });
        }
    };

function renderPopup(element){
    return renderPopupLine("name", element.tags.name) +
    renderPopupLine("amenity", element.tags.amenity) +
    renderPopupLine("drinking_water", element.tags.drinking_water) +
    renderPopupLine("fountain", element.tags.fountain) +
    renderPopupLine("tourism", element.tags.tourism) +
    renderPopupLine("man_made", element.tags.man_made) +
    renderPopupLine("natural", element.tags.natural) +
    renderPopupLine("description", element.tags.description) +
    renderWikidataLink( element.tags.wikidata) +
    renderLink( element.tags.website);
}

function renderPopupLine(label:string, value:string){
    if(value){
        return label + ": " + value + "<br/>"
    }
    return "";
}

function renderWikidataLink( value:string){
    if(value){
        return "wikidata: <a href='https://www.wikidata.org/wiki/" + value + "' target='_blanc'>Link</a><br/>"
    }
    return "";
}

function renderLink( value: string ){
    if(value){
        return "website: <a href='" + value + "' target='_blanc'>Link</a><br/>"
    }
    return "";
}

</script>


<div class="map" use:createMap ></div>

<style>
.map{
    height: 100vh;
    width: 100%;
    overflow: hidden;
}
</style>