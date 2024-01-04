<script>
    import "../app.css";

    import Graph from "../components/Graph.svelte";
    import GraphNodes from "../components/GraphNodes.svelte";
    import GraphEdge from "../components/GraphEdge.svelte";
    import { onMount } from "svelte";

    let nodes = [];

    let edges = [];

    async function callServerFunction(endpoint) {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Error calling server function:", error);
        }
    }

    onMount(() => {
        console.log("[+page] called callServerFunction...");
        callServerFunction("/api/nodes").then((data) => {
            nodes = data;
            console.log("[+page] returned callServerFunction");
        });

        // callServerFunction("/api/edges").then((data) => {
        //     edges = data;
        // });
    });
</script>

<body>
    <h1>Graph</h1>

    <Graph>
        <GraphNodes {nodes} />

        <!-- {#each edges as edge}
            <GraphEdge {edge} />
        {/each} -->
    </Graph>
</body>
