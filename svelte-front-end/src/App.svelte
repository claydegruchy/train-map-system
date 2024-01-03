<script>
  import Graph from "./components/Graph.svelte";
  import GraphNode from "./components/GraphNode.svelte";
  import GraphEdge from "./components/GraphEdge.svelte";

  import { onMount } from "svelte";
  import mysql from "mysql";

  let data = [];

  onMount(async () => {
    const connection = mysql.createConnection({
      host: "localhost:5432",
      user: "user",
      password: "pw",
      database: "gtfs_database",
    });

    connection.connect();

    connection.query("SELECT * FROM agency", (error, results) => {
      if (error) {
        console.error(error);
      } else {
        data = results;
      }
    });

    connection.end();
  });

  const nodes = [
    { id: "N1", label: "Start" },
    { id: "N2", label: "4" },
    { id: "N4", label: "8" },
    { id: "N5", label: "15" },
    { id: "N3", label: "16" },
    { id: "N6", label: "23" },
    { id: "N7", label: "42" },
    { id: "N8", label: "End" },
  ];

  const edges = [
    { id: "E1", source: "N1", target: "N2" },
    { id: "E2", source: "N2", target: "N3" },
    { id: "E3", source: "N3", target: "N6" },
    { id: "E4", source: "N2", target: "N4" },
    { id: "E5", source: "N4", target: "N5" },
    { id: "E6", source: "N5", target: "N4", label: "2" },
    { id: "E7", source: "N5", target: "N6" },
    { id: "E8", source: "N6", target: "N7" },
    { id: "E9", source: "N7", target: "N7", label: "3" },
    { id: "E10", source: "N7", target: "N8" },
  ];
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
