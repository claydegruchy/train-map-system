<script>
  import { onMount, setContext } from "svelte";
  import cytoscape from "cytoscape";
  import dagre from "cytoscape-dagre";
  import GraphStyles from "./GraphStyles.js";

  setContext("graphSharedState", {
    getCyInstance: () => cyInstance,
  });

  let refElement = null;
  let cyInstance = null;

  onMount(() => {
    console.log("mounting");
    cytoscape.use(dagre);
    console.log("defining cyInstance");

    cyInstance = cytoscape({
      container: refElement,
      style: GraphStyles,
    });

    cyInstance.on("add", () => {
      cyInstance
        .makeLayout({
          name: "dagre",
          rankDir: "TB",
          nodeSep: 150,
        })
        .run();
    });

    cyInstance.ready(() => {
      console.log("cyInstance ready");
    });
  });
</script>

<div class="graph" bind:this={refElement}>
  {#if cyInstance}
    <slot />
  {/if}
</div>
