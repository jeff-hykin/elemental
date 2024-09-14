// import { toRepresentation } from "./utils.js"
import { toRepresentation } from "https://deno.land/x/good@1.8.0.1/string.js"

export const toHtmlElementSymbol = Symbol.for("toHtmlElement")
export const primitiveToHtmlElement = function(value) {
    // needs to be before the custom-check to prevent infinite loop (accidentally putting toHtmlElementSymbol on an element)
    if (value instanceof Node || value instanceof Element || value instanceof HTMLDocument) {
        return value
    }
    // null, undefined (needs to be ahead of the custom-check)
    if (value == null) { 
        return new window.Text("")
    }
    
    // probably most common case
    if (value instanceof Array) {
        const fragment = document.createDocumentFragment()
        fragment.append(
            value.map(each=>primitiveToHtmlElement(each))
        )
        return fragment
    }
    // symbol, function, string, number, boolean, bigint
    if (typeof value != 'object') {
        return new window.Text(String(value))
    }
    // date
    if (value instanceof Date) {
        return new window.Text(value.toLocaleString())
    }
    // everything else
    const errorId = Math.random().toString(36).slice(2)
    try {
        throw new Error(`[Elemental.primitiveToHtmlElement] unable to convert the value into html elements (unsupported type/class)\nValue is: ${toRepresentation(value)}\nErrorId: ${errorId}`)
    } catch (error) {
        console.error(error.stack)
    }
    return new window.Text(`[Error: if you're a programmer, see console error with ErrorId: ${errorId}]`)
}
export const toHtmlElement = function(value, options={debug:false, coercers:{}, accumulatedInfo:{}, }) {
    // 
    // coercers stuff
    // 
    options.rootCallId = options.rootCallId || Math.random().toString(36).slice(2)
    options.accumulatedInfo = options.accumulatedInfo || {}
    for (const [key, func] of Object.entries(options.coercers||{}).reverse()) {
        const info = { debug: options.debug, accumulatedInfo: options.accumulatedInfo[key], rootCallId: options.rootCallId, key }
        const result = func(value, info)
        const activated = result instanceof Array
        if (activated) {
            const [ output, newAccumulatedInfo ] = result
            options.accumulatedInfo[key] = newAccumulatedInfo
            return primitiveToHtmlElement(output, options)
        }
    }
    
    // 
    // normal stuff
    // 

    // needs to be before the custom-check to prevent infinite loop (accidentally putting toHtmlElementSymbol on an element)
    if (value instanceof Node || value instanceof Element || value instanceof HTMLDocument) {
        return value
    }
    // null, undefined (needs to be ahead of the custom-check)
    if (value == null) { 
        return new window.Text("")
    }
    // custom conversion
    if (value[toHtmlElementSymbol] != null) {
        let result
        if (debug) {
            try {
                result = value[toHtmlElementSymbol]
            } catch (error) {
                console.error(`[Elemental.toHtmlElement] an object had the toHtmlElementSymbol property, but trying to access it threw an error\n\n${error?.stack}\nThe object was: ${toRepresentation(value)}\n`)
            }
        } else {
            result = value[toHtmlElementSymbol]
        }
        // for example, if the value is a string or a promise, it will need to be converted
        return toHtmlElement(result, options)
    }
    // probably most common case
    if (value instanceof Array) {
        const fragment = document.createDocumentFragment()
        fragment.append(
            value.map(each=>toHtmlElement(each))
        )
        return fragment
    }
    return primitiveToHtmlElement(value)
}

export function setProperties(element, properties) {
    for (const [key, value] of Object.entries(properties)) {
        if (key == 'style' && value instanceof Object) {
            Object.assign(element.style, value)
            continue
        }
        if (key.startsWith('on')) {
            element.addEventListener(key.slice(2).toLowerCase(), value)
        } else if (htmlAttributes.includes(key)) {
            element.setAttribute(key, value)
        } else {
            // note: could cause unexpected behavior on custom elements
            element[key] = value
        }
    }
}

export const escapeHTML = (str)=>
    str.replace(
        /[&<>'"]/g,
        tag =>(
            {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]
        )
    )

export const preMiddleware = Symbol("preMiddleware")
export const middleware = Symbol("middleware")
export const postMiddleware = Symbol("postMiddleware")
export const Elemental = (...args) => new ElementalClass(...args)
class ElementalClass {
    constructor({
        customComponents={},
        preMiddleware={},
        middleware={},
        postMiddleware={},
        coercers={},
        logLevel=1,
    }={}) {
        this.customComponents =  customComponents
        this.preMiddleware =  preMiddleware
        this.middleware =  middleware
        this.postMiddleware =  postMiddleware
        this.coercers =  coercers
        this.logLevel = logLevel
    }

    extend({
        customComponents={},
        preMiddleware={},
        middleware={},
        postMiddleware={},
        coercers={},
        logLevel=null,
    }={}) {
        return new ElementalClass(
            {...this.customComponents, ...customComponents},
            {...this.preMiddleware, ...preMiddleware},
            {...this.middleware, ...middleware},
            {...this.postMiddleware, ...postMiddleware},
            {...this.coercers, ...coercers},
            logLevel: logLevel == null ? this.logLevel : 1,
        )
    }
    
    toHtmlElement(value, options={}) {
        return toHtmlElement(value, {debug: this.logLevel > 1, coercers: this.coercers, accumulatedInfo: {}, ...options})
    }

    buildElement(tag, properties, children, extraInfo) {
        if (typeof tag == 'function') {
            properties.children = children
            element = this.toHtmlElement(tag(properties))
        } else if (this.customComponents[tag]) {
            properties.children = children
            element = this.toHtmlElement(this.customComponents[tag](properties))
        } else {
            // caveat for iframes
            if (tag == 'iframe' && typeof properties.src == 'string') {
                // so stupid, but necessary
                const helper = document.createElement("div")
                helper.innerHTML = `<iframe src=${escapeHTML(properties.src)}></iframe>`
                element = helper.children[0]
                delete properties.src
            } else {
                element = document.createElement(tag)
                setProperties(element, properties)
            }
        }
        const childrenAsElement = this.toHtmlElement(children)
        element.appendChild(childrenAsElement)
        return element
    }

    createElement(tag, properties, ...children) {
        // FIXME: error handling and add a middleware API that can handle the errors
        const preMiddleware = properties[preMiddleware] || this.preMiddleware
        const middleware = properties[middleware] || this.middleware
        const postMiddleware = properties[postMiddleware] || this.postMiddleware
        var extraInfo = {}
        for (const [middlewareName, middlewareFunc] of Object.entries(preMiddleware).reverse()) {
            const result = middlewareFunc.apply(this, [tag, properties, children, extraInfo])
            if (result instanceof Array) {
                var [ tag, properties, children, extraInfo ] = result
            }
        }
        let element
        for (const [middlewareName, middlewareFunc] of Object.entries(middleware).reverse()) {
            element = middlewareFunc.apply(this, [tag, properties, children, extraInfo])
            if (element != null) {
                break
            }
        }
        if (!element) {
            element = this.buildElement(tag, properties, children, extraInfo)
        }
        for (const [middlewareName, middlewareFunc] of Object.entries(postMiddleware).reverse()) {
            element = middlewareFunc(tag, properties, children, extraInfo, element)
        }
        
        return element
    }
}

// 
// middleware goals
// 
    // svg
    // async components
    // error components
    // css class value as an array
    // css class name mangling
// var html = Elemental({
//     coercers: {
//         asyncPlaceholder(value, { debug, accumulatedInfo, rootCallId, key}) {
//             if (value instanceof Promise) {
//                 const placeholder = document.createElement("div")
//                 value.then(result=>{
//                     const realElement = html.toHtmlElement(result)
//                     // FIXME: theres a problem here, which is if "placeholder" is not attached to the DOM, then the replaceWith will do nothing and then later 
//                     // when placeholder is attached to the DOM, it will simply stay as the placeholder
//                     // this needs a whenAttachedToDom listener
//                     placeholder.replaceWith(realElement)
//                 })
//                 // FIXME: better error component
//                 value.catch(error=>{
//                     console.error(`[Elemental.coercers.asyncPlaceholder] an async placeholder failed to resolve:\n${toRepresentation(error)}\nThe placeholder was: ${toRepresentation(value)}`)
//                 })
//                 return [ element, accumulatedInfo ]
//             }
//         },
//     },
//     preMiddleware: {
//         tailwind: (tag, properties, children, extraInfo) => {
//             for (const each of properties) {
//                 if (isTailwindClass(each)) {
//                     properties.class.push(each)
//                     delete properties[each]
//                 }
//             }
//             if (extraInfo.isBuiltinElement) {
                
//             }
//         },
//         classNameMangle: (tag, properties, children, extraInfo) => {
//             properties.class.map(each=>importedClasses[each]||each)
//         },
//         classesAsArrays: (tag, properties, children, extraInfo) => {
//             if (!properties.class) {
//                 properties.class = []
//             } else if (typeof properties.class == 'string') {
//                 properties.class = properties.class.split(" ")
//             } else if (properties.class instanceof Object) {
//                 const object = properties.class
//                 properties.class = []
//                 for (const [key, value] of Object.entries(object)) {
//                     if (value) {
//                         properties.class.push(key)
//                     }
//                 }
//             }
//         },
//         classNameConvert: (tag, properties, children, extraInfo) => {
//             properties.class = properties.class || properties.className
//         },
//     },
//     middleware: {
//         asyncr(tag, properties, children, extraInfo) {
//             if (typeof tag == 'function') {
//                 properties.children = children
//                 let result = tag(properties)
//                 let element
//                 if (result instanceof Promise) {
//                     const placeholder = document.createElement("div")
//                     element = placeholder
//                     result.then(result=>{
//                         const realElement = this.toHtmlElement(result)
//                         // FIXME: theres a problem here, which is if "placeholder" is not attached to the DOM, then the replaceWith will do nothing and then later 
//                         // when placeholder is attached to the DOM, it will simply stay as the placeholder
//                         // this needs a whenAttachedToDom listener
//                         placeholder.replaceWith(realElement)
//                     })
//                 } else {
//                     element = result
//                 }
//                 return element
//             }
//         },
//         svg(tag, properties, children, extraInfo) {
//             element.setAttribute(kebabCase(key), value)
//             if (svgNames.includes(tag)) {
//                 element = document.createElementNS('http://www.w3.org/2000/svg', key)
//             }
//             return remainngMiddleware(tag, properties, children)
//         },
//         classConvert(tag, properties, children, extraInfo) {
//             if (builtinHtmlElements.includes(tag)) {
//                 if (properties.class instanceof Array) {
//                     properties.class = properties.class.join(" ")
//                 }
//             }
//         },
//     }
// })