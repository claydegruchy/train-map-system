<script>
    import "../app.css";

    import Graph from "../components/Graph.svelte";
    import GraphNode from "../components/GraphNode.svelte";
    import GraphEdge from "../components/GraphEdge.svelte";
    import { onMount } from "svelte";

    let nodes = [];

    let edges = [];

    async function callServerFunction(endpoint) {
        try {
            const response = await fetch(endpoint);
            const data = await response.json();
            console.log(data); // Output the server response
            return data;
        } catch (error) {
            console.error("Error calling server function:", error);
        }
    }

    onMount(() => {
        callServerFunction("/api/nodes").then((data) => {
            nodes = data;
        });

        callServerFunction("/api/edges").then((data) => {
            edges = data;
        });
    });
</script>

<body>
    <h1>Graph</h1>

    <Graph>
        {#each nodes as node}
            <GraphNode {node} />
        {/each}

        {#each edges as edge}
            <GraphEdge {edge} />
        {/each}
    </Graph>
</body>
