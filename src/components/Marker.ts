

export type Marker = {
    type: string;
    id: number;
    lat: number;
    lon: number;
    tags: {
    [key: string]: string;
    }
    geometry ?: Marker[];
}