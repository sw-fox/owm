import type { Marker } from "./components/Marker";

//if you cahnge this variables als update in build.cache.bash and rebuild data folder
const SOUTH: number = 47;
const WEST: number = 5;
const NORTH: number = 55;
const EAST: number = 16;

export async function fetchPois(south: number, west: number, north: number, east: number): Promise<Marker[]> {
    const southTrunc = Math.trunc(south);
    const westTrunc = Math.trunc(west);
    const nodePromises: Promise<Marker[]>[] = [];
    for (let i = southTrunc; i <= north; i++) {
        for (let j = westTrunc; j <= east; j++) {
            nodePromises.push(loadJson(i, j));
        }
    }
    const arrayOfArrays = await Promise.all(nodePromises);
    const combined = arrayOfArrays.flat();
    const filteredNodes = filterNodes(combined, south, west, north, east);

    return filteredNodes;
};

function filterNodes(nodes: Marker[], south: number, west: number, north: number, east: number): Marker[] {
    const filteredNodes = nodes.filter(node =>
        node.lat >= south &&
        node.lat <= north &&
        node.lon >= west &&
        node.lon <= east
    );
    return filteredNodes;
};

async function loadJson(lat: number, lon: number): Promise<Marker[]> {
    //early return if out of germany/ pregenerated data
    if (lat < SOUTH || lat > NORTH || lon < WEST || lon > EAST) {
        return [];
    }
    const latTrunc = Math.trunc(lat);
    const lonTrunc = Math.trunc(lon);
    return fetch(`/data/drinking_water_${latTrunc}_${lonTrunc}.json`)
        .then(response => {
            if (!response.ok) {
                console.error(`HTTP error! status: ${response.status}`);
                return { elements: [] };
            }
            return response.json();
        })
        .then(jsonData => jsonData.elements);
}
