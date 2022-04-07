// minimized xhtm from: https://github.com/dy/xhtm
var e="",t="";function o(r){var p,a,l,s,c=arguments,i=this,n=0,d=[],h=0,u=[],f=0;d.root=!0;var g=function(e,o,r){void 0===o&&(o=[]);var p=0;return(e=r||e!==t?e.replace(/\ue001/g,e=>u[f++]):u[f++].slice(1,-1))?(e.replace(/\ue000/g,(t,r)=>(r&&o.push(e.slice(p,r)),p=r+1,o.push(c[++h]))),p<e.length&&o.push(e.slice(p)),o.length>1?o:o[0]):e},m=()=>{[d,s,...p]=d,d.push(i(s,...p))};return r.join(e).replace(/<!--[^]*-->/g,"").replace(/<!\[CDATA\[[^]*\]\]>/g,"").replace(/('|")[^\1]*?\1/g,e=>(u.push(e),t)).replace(/\s+/g," ").replace(/(?:^|>)([^<]*)(?:$|<)/g,(e,t,r,p)=>{var c,i;if(r&&p.slice(n,r).replace(/(\S)\/$/,"$1 /").split(" ").map((e,t)=>{if("/"===e[0])c=i||e.slice(1)||1;else if(t){if(e){var r=d[2]||(d[2]={});"..."===e.slice(0,3)?Object.assign(r,arguments[++h]):([a,l]=e.split("="),r[g(a)]=!l||g(l))}}else{for(i=g(e);o.close[d[1]+i];)m();d=[d,i,null],o.empty[i]&&(c=i)}}),c)for(m();s!==c&&o.close[s];)m();n=r+e.length,t&&" "!==t&&g((s=0,t),d,!0)}),d.root||m(),d.length>1?d:d[0]}o.empty={},o.close={},"area base br col command embed hr img input keygen link meta param source track wbr ! !doctype ? ?xml".split(" ").map(e=>o.empty[e]=o.empty[e.toUpperCase()]=!0);var r={li:"",dt:"dd",dd:"dt",p:"address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table",rt:"rp",rp:"rt",optgroup:"",option:"optgroup",caption:"tbody thead tfoot tr colgroup",colgroup:"thead tbody tfoot tr caption",thead:"tbody tfoot caption",tbody:"tfoot caption",tfoot:"caption",tr:"tbody tfoot",td:"th tr",th:"td tr tbody"},p=function(e){[...r[e].split(" "),e].map(t=>{o.close[e]=o.close[e.toUpperCase()]=o.close[e+t]=o.close[e.toUpperCase()+t]=o.close[e+t.toUpperCase()]=o.close[e.toUpperCase()+t.toUpperCase()]=!0})};for(var a in r)p(a);
const xhtm = o

const ElementalSymbol = Symbol.for("Elemental")
export class ElementalClass {
    constructor(components={}, options={}) {
        const {middleware, errorComponentFactory} = options
        this.components = components||{}
        this.middleware = middleware||{}
        this.errorComponentFactory = errorComponentFactory||defaultErrorComponentFactory
        this.html = xhtm.bind((...args)=>this.createElement(...args))
        this.html[ElementalSymbol] = this
        this.css = Elemental.css
    }

    createElement(...args) {
        Elemental.debug && console.debug(`args is:`,args)

        // run middleware
        for (const middleware of (this.middleware[Elemental.allTags]||[]).concat((this.middleware[args[0]]||[]))) {
            try {
                args = eachMiddleWare(args)
            } catch (error) {
                console.error("[ElementalClass] one of the middleware functions failed:", eachMiddleWare, args)
            }
            // TODO: handle middleware creating invalid arguments
        }
        
        let [ key, properties, ...children ] = args
        Elemental.debug && console.debug(`key, properties, children is:`,key, properties, children)
        // lookup custom components
        if (this.components[key] instanceof Function) {
            key = this.components[key]
        }
        // run custom components
        if (key instanceof Function) {
            let output
            try {
                output = isConstructor(key) ? new key({...properties, children}) : key({...properties, children})
            } catch (error) {
                return this.errorComponentFactory({...properties, children}, key, error)
            }
            // allow async components
            if (output instanceof Promise) {
                const elementPromise = output
                const placeholder = elementPromise.placeholder || document.createElement("div")
                setTimeout(async () => placeholder.replaceWith(await elementPromise), 0)
                return placeholder
            } else {
                return output
            }
        }
        // create either an html element or an svg element
        const isSvg = Elemental.exclusivelySvgElements.has(key)
        const element = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', key) : document.createElement(key)
        if (properties instanceof Object) {
            for (const [key, value] of Object.entries(properties)) {
                try {
                    if (isSvg) {
                        const kebabCase = key.replace(/(?<=[a-z])([A-Z])(?=[a-z])/g, (each)=>`-${each.toLowerCase()}`)
                        element.setAttribute(kebabCase, value)
                    } else {
                        element.setAttribute(key.toLowerCase(), value)
                    }
                } catch (error) {
                }
                try {
                    element[key] = value
                } catch (error) {}
            }
        }
        return appendChildren(element, ...children)
    }

    extend(additionalComponents={}, options={}) {
        const {middleware, ...other} = options
        return Elemental(
            {...this.components, ...additionalComponents},
            {
                middleware:{...this.middleware, ...middleware},
                ...other
            }
        )
    }
}

// 
// This wrapper does two things
//     const html = Elemental()
//     1. html() (the function call) behaves like (new ElementalClass()).html()
//     2. html.something (methods/attributes) behaves like (new ElementalClass()).something
// 
const proxySymbol = Symbol.for('Proxy')
export const Elemental = (...args) => {
    const originalThing = (new ElementalClass(...args)).html
    const proxyObject = new Proxy(originalThing, {
        // Object.keys
        ownKeys(original) { return Reflect.ownKeys(original[ElementalSymbol]) },
        // function call (original value needs to be a function)
        // apply(original, context, ...args) { console.log(args) },
        get(original, key) {
            if (key == proxySymbol) {return true}
            const originalValue = original[ElementalSymbol][key]
            if (originalValue) {
                return originalValue
            }
            return Reflect.get(original, key, ...args)
        },
    })
    return proxyObject
}

Elemental.allTags = Symbol.for("allTags")
Elemental.exclusivelySvgElements = new Set(["svg", "animate", "animateMotion", "animateTransform", "circle", "clipPath", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g", "hatch", "hatchpath", "image", "line", "linearGradient", "marker", "mask", "mesh", "meshgradient", "meshpatch", "meshrow", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "set", "stop", "switch", "symbol", "text", "textPath", "tspan", "unknown", "use", "view",])
Elemental.css = function(...args) {
    const element = document.createElement("div")
    if (args.length == 1) {
        if (args instanceof Object) {
            Object.assign(element.style, args)
        }
    // string case
    } else if (args.length > 1) {
        const [strings, ...values] = args
        let finalString = ""
        for (const each of strings) {
            finalString += each
            if (values.length > 0) {
                finalString += `${values.shift()}`
            }
        }
        element.style = finalString
    }
    return element.style
}

function appendChildren(element, ...children) {
    for (const each of children) {
        if (typeof each == 'string') {
            element.appendChild(new window.Text(each))
        } else if (each == null) {
            // empty node
            element.appendChild(new window.Text(""))
        } else if (!(each instanceof Object)) {
            element.appendChild(new window.Text(`${each}`))
        } else if (each instanceof Node) {
            element.appendChild(each)
        } else if (each instanceof Array) {
            appendChildren(element, ...each)
        } else if (each instanceof Function) {
            // recursively
            appendChildren(element, each())
        } else if (each instanceof Promise) {
            const elementPromise = each
            const placeholder = elementPromise.placeholder || document.createElement("div")
            setTimeout(async () => placeholder.replaceWith(await elementPromise), 0)
            element.appendChild(placeholder)
        // some elements are not HTML nodes and are still valid
        } else if (each != null && each instanceof Object) {
            element.appendChild(each)
        }
    }
    return element
}

function defaultErrorComponentFactory({children, ...properties}, key, error) {
    const element = document.createElement("div")
    const errorDetails = document.createElement("code")
    const childContainer = document.createElement("div")
    
    // 
    // error body
    // 
    element.style.all = "unset"
    element.style.display = "flex"
    element.style.flexDirection = "column"
    element.style.padding = "1.5rem"
    element.style.backgroundColor = "#f5a5a8"
    element.style.color = "white"
    element.style.fontFamily = '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif'
    element.style.fontSize = '18px'
    element.style.fontWeight = '400'
    element.style.overflow = 'auto'
    element.innerHTML = `I'm sorry, there was an error when loading this part of the page 🙁 `
    
    // 
    // error details
    // 
    let errorElementPart
    if (typeof key == 'string') {
        errorElementPart = `<${key} />`
    } else {
        try {
            errorElementPart = `<${key.prototype.constructor.name} />`
        } catch (error) {
            errorElementPart = `<${key} />`
        }
    }
    let errorJsonObject = {}
    for (const [key, value] of Object.entries(properties)) {
        try {
            errorJsonObject[key] = JSON.parse(JSON.stringify(value))
        } catch (error) {
            errorJsonObject[key] = `${value}`
        }
    }
    errorDetails.innerHTML = `tag: ${errorElementPart}\nproperties: ${JSON.stringify(errorJsonObject)}\nerror: ${error}`
    errorDetails.style.padding = "1rem"
    errorDetails.style.backgroundColor = "#161b22"
    errorDetails.style.color = "#789896"
    element.appendChild(errorDetails)
    // 
    // children
    // 
    childContainer.style.all = "unset"
    childContainer.style.display = "flex"
    childContainer.style.flexDirection = "column"
    childContainer.style.marginTop = "1.3rem"
    if (children instanceof Array) {
        for (const [key, value] of Object.entries(children)) {
            if (typeof each == 'string') {
                childContainer.appendChild(new window.Text(value))
            } else if (value instanceof Node) {
                childContainer.appendChild(value)
            }
        }
    }
    element.appendChild(childContainer)
    return element
}

function isConstructor(obj) {
    return !!obj.prototype && !!obj.prototype.constructor.name;
}

// 
// protect document head by monkey patching it (this is the only monkeypatch)
// 
try {
    const originalHead = document.head
    Object.defineProperty(document,"head", { 
        set: (element) => appendChildren(originalHead, ...element.childNodes),
        get: ()=>originalHead,
        writable: true,
    })
} catch (error) {
    
}

export const html = Elemental()
export const css = Elemental.css
export const allTags = Elemental.allTags
export default {
    Elemental,
    html,
    css,
    allTags,
}