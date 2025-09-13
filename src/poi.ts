import type { Marker } from "./components/Marker";

//if you cahnge this variables als update in build.cache.bash and rebuild data folder
const SOUTH: number = 47;
const WEST: number = 5;
const NORTH: number = 55;
const EAST: number = 16;

export async function fetchPois(south: number, west: number, north: number, east: number, onlyBubblers: boolean): Promise<Marker[]> {
    const southTrunc = Math.trunc(south);
    const westTrunc = Math.trunc(west);
    const nodePromises: Promise<Marker[]>[] = [];
    for (let i = southTrunc; i <= north; i++) {
        for (let j = westTrunc; j <= east; j++) {
            nodePromises.push(loadCachedJson(i, j));
        }
    }
    const arrayOfArrays = await Promise.all(nodePromises);
    const combined = arrayOfArrays.flat();
    const filteredNodes = filterGeograficNodes(combined, south, west, north, east);

    return filterAttributeNodes(filteredNodes, onlyBubblers);
};

function filterGeograficNodes(nodes: Marker[], south: number, west: number, north: number, east: number): Marker[] {
    const filteredNodes = nodes.filter(node =>
        node.lat >= south &&
        node.lat <= north &&
        node.lon >= west &&
        node.lon <= east
    );
    return filteredNodes;
};

//optional filter for pois that are drinking fointains
function filterAttributeNodes(nodes: Marker[], onlyBubblers: boolean): Marker[]{
    const filteredNodes = nodes.filter(node =>
        !onlyBubblers ||
        isBubbler(node)
    );
    return filteredNodes;
}

function isBubbler(marker: Marker): boolean {
    return isTagSet(marker,"fountain", "bubbler")
        || isTagSet(marker,"fountain", "drinking")
        || isTagSet(marker,"man_made", "drinking_fountain");
}

function isTagSet(marker: Marker, key: string, value: string): boolean {
    return marker.tags[key]?.trim() == value;
}

let cache = new Map<string, Marker[]>();
async function loadCachedJson(lat: number, lon: number): Promise<Marker[]> {
    const key = "lat_" + lat + "_lon_" + lon;
    if(cache.has(key)){
        return cache.get(key) ?? [];
    }
    const data = loadJson(lat, lon);
    cache.set(key,await data);
    return data;
}

async function loadJson(lat: number, lon: number): Promise<Marker[]> {
    //early return if out of germany/ pregenerated data
    if (lat < SOUTH || lat > NORTH || lon < WEST || lon > EAST) {
        return [];
    }
    const latTrunc = Math.trunc(lat);
    const lonTrunc = Math.trunc(lon);
    return fetch(`./data/drinking_water_${latTrunc}_${lonTrunc}.json`)
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return { elements: [] };
            }
            return response.json();
        })
        .then(jsonData => jsonData.elements);
}
