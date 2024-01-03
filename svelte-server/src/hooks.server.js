// @ts-ignore
import { connectToDB } from "$lib/db";
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

    return new Response(JSON.stringify(db[req]), {
        headers: { 'Content-Type': 'application/json' },
    });

    const dbconn = await connectToDB();
    event.locals = { dbconn };

    const response = await resolve(event);
    dbconn.release();

    return response;
})




export const handle = sequence(...[databaseQuery])
