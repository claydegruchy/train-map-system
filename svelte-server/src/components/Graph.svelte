<script>
  import { onMount, setContext } from "svelte";
  import cytoscape from "cytoscape";
  import dagre from "cytoscape-dagre";
  import GraphStyles from "./GraphStyles.js";

  function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  setContext("graphSharedState", {
    getCyInstance: () => cyInstance,
  });

  let refElement = null;
  let cyInstance = null;

  let viewportNodes = [];

  onMount(() => {
    console.log("mounting");
    cytoscape.use(dagre);
    console.log("defining cyInstance");

    cyInstance = cytoscape({
      container: refElement,
      style: GraphStyles,
    });

    // callServerFunction("/api/nodes").then((data) => {
    //   nodes = data;
    //   console.log("[+page] returned callServerFunction");
    // });

    const debouncedLayoutUpdate = debounce((n) => {
      console.log("debouncedLayoutUpdate");
      cyInstance
        .makeLayout({
          name: "preset",
          rankDir: "TB",
          nodeSep: 150,
        })
        .run();
    }, 10);

    cyInstance.on("add", debouncedLayoutUpdate);

    cyInstance.ready(() => {
      cyInstance.elements().remove();
      console.log("cyInstance ready");
    });

    const debouncedViewportUpdates = debounce((n) => {
      // get the nodes in the current viewport

      const viewportBb = cyInstance.extent();
      viewportNodes = cyInstance.nodes().forEach((node) => {
        const nodeBb = node.boundingBox();
        if (
          nodeBb.x1 >= viewportBb.x1 &&
          nodeBb.x2 <= viewportBb.x2 &&
          nodeBb.y1 >= viewportBb.y1 &&
          nodeBb.y2 <= viewportBb.y2
        )
          node.addClass("in-viewport");
        else node.removeClass("in-viewport");
      });
      const niv = cyInstance.nodes(".in-viewport");
      if (niv.length < 100) {
        niv.addClass("display-details");
      } else {
        niv.removeClass("display-details");
      }
    }, 300);

    cyInstance.on("zoom", function () {
      let defaultNodeSize = 8;
      let defaultEdgeSize = 2;
      let currentZoom = cyInstance.zoom();
      let zoomFactor = 1 / currentZoom;
      let nodeSize = zoomFactor * defaultNodeSize;
      let edgeSize = zoomFactor * defaultEdgeSize;
      let fontSize = nodeSize * 1.6;

      cyInstance
        .style()
        .resetToDefault()
        .selector("edge")
        .style("width", edgeSize)
        .selector("node")
        .style("width", nodeSize)
        .style("height", nodeSize)
        .style("font-size", fontSize)
        .style("text-valign", "center")
        .style("text-halign", "center")
        .style("label", "data(id)")
        .update();
    });

    // when viewport updated
    cyInstance.on("pan zoom resize", debouncedViewportUpdates);
  });
</script>

<div class="graph" bind:this={refElement}>
  {#if cyInstance}
    <slot />
  {/if}
</div>
