// - import this file
// - call a function, giving it a nearby main.jsx file
// - the main.jsx imports elemental.createElement as html
// - use deno's bundler to convert all the JSX into regular JS
// - wrap the output inside of an index.html
// - optionally start a server
    // - serve the index.html
    // - allow accessing the local .jsx files (bundle/convert to JS on the fly with caching)



// example main.jsx
    // /** @jsx html */
    // /// <reference no-default-lib="true"/>
    // /// <reference lib="dom" />
    // /// <reference lib="dom.asynciterable" />
    // /// <reference lib="deno.ns" />


    // import { serve } from "https://deno.land/std@0.140.0/http/server.ts"
    // const html = (...args)=>args.toString()

    // serve(request => new Response(
    //         <html>
    //             Howdy
    //         </html>, 
    //         { headers: { "content-type": "text/html", },}
    //     )
    // )
