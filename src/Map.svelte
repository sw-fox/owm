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
    import Banner from "./components/Banner.svelte";

   let { lat = 48.783, lon = 9.183, zoom = 13, onlyBubblers = false, showCemetries = false } = $props();

    const marker_image = L.icon(MarkerImageConfig);

    //list of markers on the map to be regularly cleaned up
    let leafletMarkers = $state([]);

    let showPoi = $state(false);

    let map: { on: (arg0: string, arg1: { (): void; (): void; }) => void; };

    function createMap(container: HTMLDivElement) {
        map = L.map(container).setView([lat, lon], zoom);
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

        leafletMarkers = L.layerGroup().addTo(map);

        map.on("dragend", function onDragEnd() {
            moveMap(map);
        });
        map.on("zoom", function onZoomEnd() {
            moveMap(map);
        });
        updateMarkersOnScreen(map);
    }

    function moveMap(map) {
        lat = map.getCenter().lat.toFixed(3);
        lon = map.getCenter().lng.toFixed(3);
        zoom = map.getZoom();
        window.history.pushState(
            "",
            "open water map",
            "?lat=" + lat + "&lon=" + lon + "&zoom=" + Math.trunc(zoom),
        );
        updateMarkersOnScreen(map);
    }

    function updateMarkersOnScreen(map) {
        showPoi = zoom > 10;
        if (showPoi) {
            let east = map.getBounds().getEast();
            let west = map.getBounds().getWest();
            let north = map.getBounds().getNorth();
            let south = map.getBounds().getSouth();

            const markersPromise: Promise<Marker[]> = fetchPois(
                south,
                west,
                north,
                east,
                onlyBubblers,
                showCemetries,
            );

            markersPromise.then((markers) => {
                map.eachLayer((layer) => {
                    //remove all previous markers for performance reasons
                    leafletMarkers.clearLayers();
                });
                markers.forEach((m: Marker) => {
                    if (m.tags.drinking_water == "no") {
                        return; //skip if explicitly no drinking water
                    }
                    if (m.type == "node") {
                        //render if element is point
                        L.marker([m.lat, m.lon], {
                                icon: marker_image,
                            })
                            .addTo(leafletMarkers)
                            .bindPopup(renderPopup(m));
                    }else if((m.type == "way" || m.type == "relation") && m.center != undefined){
                        //render areas with center
                        L.marker([m.center.lat, m.center.lon], {
                                icon: marker_image,
                            })
                            .addTo(leafletMarkers)
                            .bindPopup(renderPopup(m));

                    }
                });
            });
        }else{
            //remove all markers if too much zoomed out
            leafletMarkers.clearLayers();
        }
    }

    $effect(() => {
        updateMarkersOnScreen(map);
    });
</script>

<div class="map" use:createMap></div>
<Banner message="Zoom in to see markers" show={!showPoi}/>

<style>
    .map {
        height: 100vh;
        width: 100%;
        overflow: hidden;
    }
</style>
