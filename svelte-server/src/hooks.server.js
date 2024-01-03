// @ts-ignore
import { makeQuery } from "$lib/db";
// sequence
import { sequence } from "@sveltejs/kit/hooks";






const databaseQuery = (async ({ event, resolve }) => {
    if (!event?.url?.pathname?.includes('/api/')) return resolve(event);
    console.log('databaseQuery', event.url.pathname);
    const req = event.url.pathname.split('/api/')[1];


    if (req === 'nodes') {
        let nodes = await makeQuery('SELECT * FROM stops WHERE location_type is NULL LIMIT 1000')
        console.log('nodes', nodes);
        nodes = nodes.map((node, i) => ({
            id: node.stop_id,
            data: {
                label: node.stop_name,
                size: 5,
            },
            position: {
                x: node.stop_lon * 1000,
                y: node.stop_lat * 1000
            }
        }))
        return new Response(JSON.stringify(nodes), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // if (req === 'edges') {
    //     let edges = await makeQuery('SELECT * FROM routes LIMIT 100')
    //     edges = edges.map((edge) => ({ id: edge.route_id, source: edge.route_id, target: edge.route_id }))
    //     return new Response(JSON.stringify(edges), {
    //         headers: { 'Content-Type': 'application/json' },
    //     });
    // }

    return response;
})




export const handle = sequence(...[databaseQuery])
