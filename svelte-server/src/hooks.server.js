// @ts-ignore
import { makeQuery } from "$lib/db";
// sequence
import { sequence } from "@sveltejs/kit/hooks";




const db = {
    nodes: [
        { id: "N1", label: "Start" },
        { id: "N2", label: "4" },
        { id: "N4", label: "8" },
        { id: "N5", label: "15" },
        { id: "N3", label: "16" },
        { id: "N6", label: "23" },
        { id: "N7", label: "42" },
        { id: "N8", label: "End" },
    ],

    edges: [
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
    ]
}





const databaseQuery = (async ({ event, resolve }) => {
    if (!event?.url?.pathname?.includes('/api/')) return resolve(event);
    console.log('databaseQuery', event.url.pathname);
    const req = event.url.pathname.split('/api/')[1];


    if (req === 'nodes') {
        let nodes = await makeQuery('SELECT * FROM stops LIMIT 100')
        nodes = nodes.map((node) => ({ id: node.stop_id, label: node.stop_name }))
        return new Response(JSON.stringify(nodes), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (req === 'edges') {
        let edges = await makeQuery('SELECT * FROM routes LIMIT 100')
        edges = edges.map((edge) => ({ id: edge.route_id, source: edge.route_id, target: edge.route_id }))
        return new Response(JSON.stringify(edges), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return response;
})




export const handle = sequence(...[databaseQuery])
