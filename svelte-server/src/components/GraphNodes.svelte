<script>
  import { onMount, getContext } from "svelte";

  export let nodes;

  const { getCyInstance } = getContext("graphSharedState");
  const cyInstance = getCyInstance();

  $: {
    console.group("GraphNodes");
    console.time("GraphNodes");
    console.time("map");

    const n = nodes.map((n) => ({ ...n, group: "nodes" }));
    console.timeEnd("map");
    console.time("cyInstance.add");
    cyInstance.add(n);
    console.timeEnd("cyInstance.add");
    console.log(`[GraphNodes] ${nodes.length} nodes added`);
    console.timeEnd("GraphNodes");
    console.groupEnd();
  }
</script>
