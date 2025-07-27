#!/bin/bash

# Define bounding box coordinates around germany
# if you change this variables also update it in ./src/poi.ts
south=47
west=5
north=55
east=16

# iterate to generate smaler chunks
for ((i=south; i<=north; i++)); do
    for ((j=west; j<=east; j++)); do

        # Construct bbox string
        bbox="${i}.0,${j}.0,$((i+1)).0,$((j+1)).0"

        echo "${bbox}"

        # Build the Overpass QL query for drinking_water
        query1="[out:json][timeout:90];(\
        node[\"amenity\"=\"drinking_water\"](${bbox});\
        node[\"drinking_water\"=\"yes\"](${bbox});\
        node[\"drinking_water:legal\"=\"yes\"](${bbox});\
        node[\"fountain\"=\"drinking\"](${bbox});\
        node[\"fountain\"=\"bubbler\"](${bbox});\
        node[\"fountain\"=\"bottle_refill\"](${bbox});\
        );out geom;"

        # Build the Overpass QL query for cemetries
        query2="[out:json][timeout:90];(\
        relation[\"landuse\"=\"cemetery\"](${bbox});\
        relation[\"amenity\"=\"grave_yard\"](${bbox});\
        );out geom;"

        # Send the request using curl and save to json
        curl -X POST https://overpass-api.de/api/interpreter \
            -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" \
            --data-urlencode "data=${query1}" \
            -o "./public/data/drinking_water_${i}_${j}.json" &

        # Send the request using curl and save to json
        curl -X POST https://overpass-api.de/api/interpreter \
            -H "Content-Type: application/x-www-form-urlencoded; charset=UTF-8" \
            --data-urlencode "data=${query2}" \
            -o "./public/data/cemetery_${i}_${j}.json"
    done
done

echo "Query completed. Response saved to json files"