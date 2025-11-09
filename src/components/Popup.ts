import type { Marker } from "./Marker";

export function renderPopup(element: Marker){
    return renderPopupLine("name", element.tags.name) +
    renderPopupLine("amenity", element.tags.amenity) +
    renderPopupLine("drinking_water", element.tags.drinking_water) +
    renderPopupLine("fountain", element.tags.fountain) +
    renderPopupLine("tourism", element.tags.tourism) +
    renderPopupLine("man_made", element.tags.man_made) +
    renderPopupLine("natural", element.tags.natural) +
    renderPopupLine("description", element.tags.description) +
    renderPopupLine("landuse", element.tags.landuse) +
    renderPopupLine("amenity", element.tags.amenity) +
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