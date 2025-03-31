<script lang="ts">
  import { onMount } from "svelte";
  import {
    DefaultMarker,
    LineLayer,
    MapLibre,
    Marker,
    Popup,
    GeoJSON,
    ZoomRange,
  } from "svelte-maplibre";

  import db from "./lib/db.json";
  import loc from "./lib/loc.json";

  async function getCoordinates(town) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(town)}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data.length > 0) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)]; // [lng, lat]
    }
    return null; // 否 results found
  }

  async function download() {
    let locations = {};
    for (const route of db) {
      console.log(route);

      for (const { Stops } of route.SplitRoutes) {
        for (const stop of Stops) {
          if (stop == "non-stop") continue;
          if (locations[stop]) continue;
          console.log(stop);
          locations[stop] = true;
        }
      }
    }

    for (const loc of Object.keys(locations)) {
      locations[loc] = await getCoordinates(loc);
      console.log(locations);
    }
    console.log(locations);
  }

  function generateLine(route) {
    console.log(route);

    const data: Feature = {
      type: "Feature",
      properties: {
        name: route.Itinerary,
      },
      geometry: {
        type: "LineString",
        coordinates: route.SplitRoutes[0].Stops.map((s) => s.lngLat),
      },
    };
    console.log(JSON.stringify(data));

    return data;
  }

  let locations = {};
  onMount(async () => {
    for (const route of db) {
      route.SplitRoutes = route.Route.split("<br><br>").map((r) => ({
        RouteName: r.split(": ")[0],
        Stops: r
          .split(": ")[1]
          .split(" - ")
          .map((n) => ({ name: n, lngLat: null })),
      }));
      route.stops = 0;
      route.stations = [];
      for (const { Stops } of route.SplitRoutes) {
        route.stops = Stops.length;

        for (const stop of Stops) {
          if (stop == "non-stop") continue;
          route.stations.push(stop.name);
          // console.log(stop.name, loc[stop.name]);

          if (!loc[stop.name]) console.warn("stop coords not found", stop.name);
          locations[stop.name] = stop;
          stop.lngLat = loc[stop.name];
        }
      }
    }

    console.log(db);
  });

  function stringToAscii(str) {
    return str.split("").map((char) => char.charCodeAt(0));
  }
  function selectColor(number) {
    const hue = number * 137.508; // use golden angle approximation
    return `hsl(${hue},50%,75%)`;
  }
  const randomColour = () => {
    let n = (Math.random() * 0xfffff * 1000000).toString(16);
    return "#" + n.slice(0, 6);
  };

  let selectedRoute = null;
  let selectedStation = null;
</script>

<MapLibre
  center={[-0.118092, 51.509865]}
  zoom={3}
  class="map"
  standardControls
  style="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
>
  {#each db as route}
    <GeoJSON id={route.Itinerary} data={generateLine(route)}>
      <LineLayer
        layout={{ "line-cap": "round", "line-join": "round" }}
        paint={{
          "line-width":
            selectedRoute && selectedRoute != route.Itinerary ? 1 : 5,
          "line-color":
            selectedRoute == route.Itinerary ? "red" : randomColour(),
          "line-opacity":
            selectedStation && !route.stations.includes(selectedStation)
              ? 0.0
              : 0.8,
        }}
      >
        <Popup
          offset={[0, -10]}
          on:open={(e) => (selectedRoute = route.Itinerary)}
          on:close={(e) => (selectedRoute = null)}
        >
          <div>
            <h3>{route.Itinerary}</h3>
            <div>{route.stops} stops</div>
            {@html route["More details"]}
          </div>
        </Popup>
      </LineLayer>
    </GeoJSON>
  {/each}
  <ZoomRange minzoom={7 + (selectedStation ? -3 : 0)} enforce>
    {#each Object.entries(locations) as [k, { name, lngLat }]}
      {#if lngLat}
        {#if !selectedRoute || db.filter((r) => r.Itinerary == selectedRoute && r.stations.includes(name)).length > 0}
          <Marker {lngLat}>
            <div class="marker">{name}</div>
            <Popup
              offset={[0, -10]}
              on:open={(e) => (selectedStation = name)}
              on:close={(e) => (selectedStation = null)}
            >
              <h3>{name}</h3>
              <div>
                <ul>
                  {#each db.filter( (r) => r.stations.includes(name) ) as connectedRoute}
                    <div>
                      {connectedRoute.Itinerary}
                      {@html connectedRoute["More details"]}
                    </div>
                  {/each}
                </ul>
              </div>
            </Popup>
          </Marker>
        {/if}
      {/if}
    {/each}
  </ZoomRange>
</MapLibre>

<style>
  .marker {
    background-color: white;
    border: 2px solid black;
  }
  :global(.map) {
    height: 100%;
    width: 100%;
  }
</style>
