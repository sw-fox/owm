<script>
	import Map from "./Map.svelte";

	const queryString = window.location.search;
	const urlParams = new URLSearchParams(queryString);
	const url_lat = urlParams.get('lat')
	const url_lon = urlParams.get('lon')
	const url_zoom = urlParams.get('zoom')

	//init with fallback
	var lat=48.783;
	var lon=9.183;
	var zoom=13;

	//set variables from url
	if(url_lat && url_lon && url_zoom){
		lat=url_lat;
		lon=url_lon;
		zoom=url_zoom;
	}
	
</script>

<Map {lat} {lon} {zoom}/>
