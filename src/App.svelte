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
  import Dialog from "./lib/Blocks/Dialog.svelte";

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

<nav class="top right">
  <Dialog>
    <div slot="button">What is this?</div>
    <div slot="content">
      <h2>What is this?</h2>
      <p>
        This is a map of all night trains in europe as assembled by <a
          href="back-on-track.eu">back-on-track.eu</a
        >. All work for the data behind this map goes to back-on-track (I just
        reprocessed it into a map that I find easier to use)
      </p>
      <h3>How do I use this?</h3>
      <div>
        <ul>
          <li>
            Clicking on a <b>route</b> will isolate it and show info about the route
            and it's stops.
          </li>
          <li>
            Clicking on a <b>station</b> will isolate it and show all routes leaving
            from that stop.
          </li>
        </ul>
      </div>
      <h3>Why did you make this?</h3>
      <p>
        I found the map layout of back-on-track to be hard to navigate, as the
        london tube style of train map doesn't scale as geographic relativity
        becomes more important
      </p>
      <h3>
        Do I really need to go to south america to get from Tarbes to Paris?
      </h3>
      <p>Some coordinates didn't map properly, they'll be sorted out soon.</p>
      <h3>I think this looks like shit</h3>
      <p>well thats just your opinion, man</p>
    </div>
  </Dialog>
</nav>
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
        hoverCursor="pointer"
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
  <ZoomRange minzoom={7 + (selectedStation ? -7 : 0)} enforce>
    {#each Object.entries(locations) as [k, { name, lngLat }]}
      {#if lngLat}
        {#if !selectedRoute || (selectedRoute && db.filter((r) => r.Itinerary == selectedRoute && r.stations.includes(name)).length > 0) || (selectedStation && db.filter((r) => r.stations.includes(selectedStation) && r.stations.includes(name))) > 0}
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
