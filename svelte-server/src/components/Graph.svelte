<script>
  import { onMount, setContext } from "svelte";
  import cytoscape from "cytoscape";
  import dagre from "cytoscape-dagre";
  import GraphStyles from "./GraphStyles.js";

  // generic debounce function
  // usage: const debouncedFunction = debounce(() => { ... }, 300);
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

    cyInstance.on("add", ({ target }) => {
      cyInstance
        .makeLayout({
          name: "preset",
          rankDir: "TB",
          nodeSep: 150,
        })
        .run();
    });

    cyInstance.ready(() => {
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

    // when viewport updated
    cyInstance.on("pan zoom resize", debouncedViewportUpdates);
  });
</script>

<div class="graph" bind:this={refElement}>
  {#if cyInstance}
    <slot />
  {/if}
</div>
