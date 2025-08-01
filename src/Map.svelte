<script lang="ts">
    import L from "leaflet";
    import "leaflet/dist/leaflet.css";  //needs to be imported for proper rendering!
    import "leaflet.locatecontrol";
    import "leaflet.locatecontrol/dist/L.Control.Locate.min.css"; // Import styles
    import { LocateControl } from "leaflet.locatecontrol";
    import { renderPopup } from "./components/Popup";
    import type { Marker } from "./components/Marker";
    import { fetchPois } from "./poi";
    import { MarkerImageConfig } from "./components/MarkerImageConfig";

    export var lat = 48.783;
    export var lon = 9.183;
    export var zoom = 13;

    const marker_image = L.icon(MarkerImageConfig);

    var markerList = [];

    function createMap(container: HTMLDivElement) {
        var map = L.map(container).setView([lat, lon], zoom);
        //map.locate({ setView: true, maxZoom: 16 }); //jump to user location on reload
        L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
                '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }).addTo(map);

        let lc = new LocateControl({
            flyTo: true,
            keepCurrentZoomLevel: false,
            showCompass: true, // optional
            locateOptions: {
                maxZoom: 15
            },
            strings: {
                title: "Standort anzeigen",
            },
        }).addTo(map);

        L.control
            .scale({
                position: "bottomleft",
                metric: true, // use metric scale
                imperial: false,
                maxWidth: 200,
            })
            .addTo(map);

        map.on("dragend", function onDragEnd() {
            fetchOverpass(map);
        });
        map.on("zoom", function onZoomEnd() {
            fetchOverpass(map);
        });
        fetchOverpass(map);
    }
    async function fetchOverpass(map) {
        lat = map.getCenter().lat.toFixed(3);
        lon = map.getCenter().lng.toFixed(3);
        zoom = map.getZoom();
        window.history.pushState(
            "",
            "open water map",
            "?lat=" + lat + "&lon=" + lon + "&zoom=" + Math.trunc(zoom),
        );
        var showPoi = zoom > 10;
        if (showPoi) {
            var east = map.getBounds().getEast();
            var west = map.getBounds().getWest();
            var north = map.getBounds().getNorth();
            var south = map.getBounds().getSouth();

            const markersPromise: Promise<Marker[]> = fetchPois(
                south,
                west,
                north,
                east,
            );

            markersPromise.then((markers) => {
                map.eachLayer((layer) => {
                    //remove all previous markers for performance reasons
                    markerList.forEach(m => map.removeLayer(m));
                    markerList = [];
                });
                markers.forEach((m: Marker) => {
                    if (m.tags.drinking_water == "no") {
                        return; //skip if no drinking water
                    }
                    if (m.type == "node") {
                        //render if element is point
                        var marker = L.marker([m.lat, m.lon], {
                                icon: marker_image,
                            })
                            .addTo(map)
                            .bindPopup(renderPopup(m));
                        markerList.push(marker);
                    }
                });
            });
        }
    }
</script>

<div class="map" use:createMap></div>

<style>
    .map {
        height: 100vh;
        width: 100%;
        overflow: hidden;
    }
</style>
