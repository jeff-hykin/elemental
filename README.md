# Usage (browser, no bundler required)

```js
var { Elemental, html } = await import("https://cdn.skypack.dev/@!!!!!/elemental@0.0.13")

// example 1
document.body = html`<body>
    Hello World
</body>`

// example 2
const myAsyncCustomComponent = async ({ style, children, ...props }) => {
    // load a big'ole depenency like d3
    const d3 = await import('https://cdn.skypack.dev/d3')
    return html`<span style=${style}>
        Do you even Async?
        ${JSON.stringify(Object.keys(d3))}
    </span>`
}
document.body = html`<body>
    Hello World
    <br>
    <${myAsyncCustomComponent} />
</body>`


// example 3
html = html.extend({myAsyncCustomComponent})
document.body = html`<body>
    Hello World
    <br>
    <myAsyncCustomComponent />
</body>`

```


# Setup

Everything is detailed in the `documentation/setup.md`!