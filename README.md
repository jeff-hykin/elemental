# Try this library in the Browser Console on [Deno.land](https://deno.land/x/elementalist)!

For VS Code use [this extension](https://marketplace.visualstudio.com/items?itemName=pushqrdx.inline-html) to get syntax highlighting.

```js
var { html } = await import("https://esm.sh/gh/jeff-hykin/elemental@0.6.5/main/deno.js")
// create a custom component
const myAsyncCustomComponent = async ({ style, children, ...props }) => {
    // load a big'ole depenency like d3
    const d3 = await import('https://cdn.skypack.dev/d3')
    return html`<div style=${style}>
        Do you even Async?
        Keys of the d3 library: ${JSON.stringify(Object.keys(d3))}
    </div>`
}

// add it to the local scope
html = html.extend({myAsyncCustomComponent})

// change some elements
document.body = html`<body style="padding:1rem;">
    Hello World (I render Immediately)
    <br>
    <myAsyncCustomComponent style='background: darkgray; color: white; padding: 1rem; border-radius: 1rem; margin: 0.3rem;' />
    <br>
    this ^ takes a second to render cause it has a massive async depenency
</body>`

```

You can also use it with JSX:

```jsx
/** @jsx html */
var { html } = await import("https://esm.sh/gh/jeff-hykin/elemental@0.6.5")

// create a custom component
const myAsyncCustomComponent = async ({ style, children, ...props }) => {
    // load a big'ole depenency like d3
    const d3 = await import('https://cdn.skypack.dev/d3')
    return <div style={style}>
        Do you even Async?
        Keys of the d3 library: {JSON.stringify(Object.keys(d3))}
    </div>
}

// change some elements
document.body = <body style="padding:1rem;">
    Hello World (I render Immediately)
    <br>
    <myAsyncCustomComponent style='background: darkgray; color: white; padding: 1rem; border-radius: 1rem; margin: 0.3rem;' />
    <br>
    this ^ takes a second to render cause it has a massive async depenency
</body>

```
