import { toString, indent } from "https://deno.land/x/good@1.13.2.0/string.js"
// import { toString, indent } from "/Users/jeffhykin/repos/good-js/source/string.js"
import { allKeyDescriptions, } from 'https://deno.land/x/good@1.13.2.0/value.js'
    // minimized xhtm from: https://github.com/dy/xhtm
    const FIELD = "\ue000",
        QUOTES = "\ue001"

    function htm(statics) {
        let h = this,
            prev = 0,
            current = [null],
            field = 0,
            args,
            name,
            value,
            quotes = [],
            quote = 0,
            last,
            level = 0,
            pre = false

        const evaluate = (str, parts = [], raw) => {
            let i = 0
            str = !raw && str === QUOTES ? quotes[quote++].slice(1, -1) : str.replace(/\ue001/g, (m) => quotes[quote++])

            if (!str) return str
            str.replace(/\ue000/g, (match, idx) => {
                if (idx) parts.push(str.slice(i, idx))
                i = idx + 1
                return parts.push(arguments[++field])
            })
            if (i < str.length) parts.push(str.slice(i))
            return parts.length > 1 ? parts : parts[0]
        }

        // close level
        const up = () => {
            // console.log('-level', current);
            ;[current, last, ...args] = current
            current.push(h(last, ...args))
            if (pre === level--) pre = false // reset <pre>
        }

        let str = statics
            .join(FIELD)
            .replace(/<!--[^]*?-->/g, "")
            .replace(/<!\[CDATA\[[^]*\]\]>/g, "")
            .replace(/('|")[^\1]*?\1/g, (match) => (quotes.push(match), QUOTES))

        // ...>text<... sequence
        str.replace(/(?:^|>)((?:[^<]|<[^\w\ue000\/?!>])*)(?:$|<)/g, (match, text, idx, str) => {
            let tag, close

            if (idx) {
                str.slice(prev, idx)
                    // <abc/> → <abc />
                    .replace(/(\S)\/$/, "$1 /")
                    .split(/\s+/)
                    .map((part, i) => {
                        // </tag>, </> .../>
                        if (part[0] === "/") {
                            part = part.slice(1)
                            // ignore duplicate empty closers </input>
                            if (EMPTY[part]) return
                            // ignore pairing self-closing tags
                            close = tag || part || 1
                            // skip </input>
                        }
                        // <tag
                        else if (!i) {
                            tag = evaluate(part)
                            // <p>abc<p>def, <tr><td>x<tr>
                            if (typeof tag === "string") {
                                while (CLOSE[current[1] + tag]) up()
                            }
                            current = [current, tag, null]
                            level++
                            if (!pre && PRE[tag]) pre = level
                            // console.log('+level', tag)
                            if (EMPTY[tag]) close = tag
                        }
                        // attr=...
                        else if (part) {
                            let props = current[2] || (current[2] = {})
                            if (part.slice(0, 3) === "...") {
                                Object.assign(props, arguments[++field])
                            } else {
                                ;[name, value] = part.split("=")
                                Array.isArray((value = props[evaluate(name)] = value ? evaluate(value) : true)) &&
                                    // if prop value is array - make sure it serializes as string without csv
                                    (value.toString = value.join.bind(value, ""))
                            }
                        }
                    })
            }

            if (close) {
                if (!current[0]) err(`Wrong close tag \`${close}\``)
                up()
                // if last child is optionally closable - close it too
                while (last !== close && CLOSE[last]) up()
            }
            prev = idx + match.length

            // fix text indentation
            if (!pre) text = text.replace(/\s*\n\s*/g, "").replace(/\s+/g, " ")

            if (text) evaluate(((last = 0), text), current, true)
        })

        if (current[0] && CLOSE[current[1]]) up()

        if (level) err(`Unclosed \`${current[1]}\`.`)

        return current.length < 3 ? current[1] : (current.shift(), current)
    }

    const err = (msg) => {
        throw SyntaxError(msg)
    }

    // self-closing elements
    const EMPTY = (htm.empty = {})

    // optional closing elements
    const CLOSE = (htm.close = {})

    // preformatted text elements
    const PRE = (htm.pre = {})

    // https://github.com/wooorm/html-void-elements/blob/main/index.js
    "area base basefont bgsound br col command embed frame hr image img input keygen link meta param source track wbr ! !doctype ? ?xml".split(" ").map((v) => (htm.empty[v] = true))

    // https://html.spec.whatwg.org/multipage/syntax.html#optional-tags
    // closed by the corresponding tag or end of parent content
    let close = {
        li: "",
        dt: "dd",
        dd: "dt",
        p: "address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table",
        rt: "rp",
        rp: "rt",
        optgroup: "",
        option: "optgroup",
        caption: "tbody thead tfoot tr colgroup",
        colgroup: "thead tbody tfoot tr caption",
        thead: "tbody tfoot caption",
        tbody: "tfoot caption",
        tfoot: "caption",
        tr: "tbody tfoot",
        td: "th tr",
        th: "td tr tbody",
    }
    for (let tag in close) {
        for (let closer of [...close[tag].split(" "), tag]) htm.close[tag] = htm.close[tag + closer] = true
    }

    "pre textarea".split(" ").map((v) => (htm.pre[v] = true))
    const xhtm = htm

// 
// actual elemental
// 
const validStyleAttribute = Object.freeze(new Set(["accent-color","align-content","align-items","align-self","align-tracks","all","animation","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timeline","animation-timing-function","appearance","ascent-override","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","bleed","block-overflow","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","color","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","content","content-visibility","counter-increment","counter-reset","counter-set","cursor","length","angle","descent-override","direction","display","resolution","empty-cells","fallback","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","flex_value","float","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-size","font-size-adjust","font-stretch","font-style","font-synthesis","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","frequency","hanging-punctuation","height","hyphenate-character","hyphens","image-orientation","image-rendering","image-resolution","inherit","inherits","initial","initial-letter","initial-letter-align","initial-value","inline-size","input-security","inset","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","justify-tracks","left","letter-spacing","line-break","line-clamp","line-gap-override","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-style","max-block-size","max-height","max-inline-size","max-lines","max-width","max-zoom","min-block-size","min-height","min-inline-size","min-width","min-zoom","mix-blend-mode","time","negative","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orientation","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","Pseudo-classes","Pseudo-elements","pad","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page-break-after","page-break-before","page-break-inside","paint-order","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","prefix","print-color-adjust","quotes","range","resize","revert","right","rotate","row-gap","ruby-align","ruby-merge","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","size","size-adjust","speak-as","src","suffix","symbols","syntax","system","tab-size","table-layout","text-align","text-align-last","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","unset","user-select","user-zoom","vertical-align","viewport-fit","visibility","white-space","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","z-index","zoom"]))
const validNonCallbackHtmlAttributes = Object.freeze(new Set([ "class", "style", "value", "id", "contenteditable", "href", "hidden", "autofocus", "src", "name", "accept", "accesskey", "action", "align", "alt", "async", "autocomplete", "autoplay", "border", "charset", "checked", "cite", "cols", "colspan", "content", "controls", "coords", "data", "datetime", "default", "defer", "dir", "dirname", "disabled", "download", "draggable", "enctype", "for", "form", "formaction", "headers", "high", "hreflang", "http", "ismap", "kind", "label", "lang", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "multiple", "muted", "novalidate", "open", "optimum", "pattern", "placeholder", "poster", "preload", "readonly", "rel", "required", "reversed", "rows", "rowspan", "sandbox", "scope", "selected", "shape", "size", "sizes", "span", "spellcheck", "srcdoc", "srclang", "srcset", "start", "step", "tabindex", "target", "title", "translate", "type", "usemap", "wrap", "bgcolor", "width", "color", "height", ]))
const isValidStyleAttribute = (key)=>key.startsWith('-')||validStyleAttribute.has(key)
const kebabCase = (string)=>string.replace(/[a-z]([A-Z])(?=[a-z])/g, (each)=>`${each[0]}-${each.slice(1).toLowerCase()}`)
const isConstructor = (obj)=>!!obj.prototype && !!obj.prototype.constructor.name
const attachProperties = (source, target)=> {
    // attach all the static attributes
    const attributes = allKeyDescriptions(source)
    const propertiesDefition = {}
    for (const [key, value] of Object.entries(attributes)) {
        // skip the special keys
        if (['constructor', 'prototype','length',].includes(key)) {
            continue
        }
        propertiesDefition[key] = {
            get: ()=>source[key],
        }
    }
    Object.defineProperties(target, propertiesDefition)
    return target
}

export const toHtmlElement = Symbol.for("toHtmlElement")
class ElementalClass {
    constructor(components={}, options={}) {
        const {middleware, errorComponentFactory, defaultPlaceholderFactory} = options||{}
        this.components = components||{}
        this.middleware = middleware||{}
        this.defaultPlaceholderFactory = defaultPlaceholderFactory||(()=>document.createElement("div"))
        this.errorComponentFactory = errorComponentFactory||defaultErrorComponentFactory
        this.html = this.createElement.bind(this) // alias
        this.xhtm = xhtm.bind((...args)=>this.createElement(...args)) // bind is "when xhtm is done parsing, how should the element be handed" callback
    }

    static debug = false
    static allTags = Symbol.for("allTags")
    static exclusivelySvgElements = new Set(["svg", "animate", "animateMotion", "animateTransform", "circle", "clipPath", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g", "hatch", "hatchpath", "image", "line", "linearGradient", "marker", "mask", "mesh", "meshgradient", "meshpatch", "meshrow", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "set", "stop", "switch", "symbol", "text", "textPath", "tspan", "unknown", "use", "view",])
    static randomId = (name)=>`${name}${Math.random()}`.replace(".","")
    static makeHtmlElement = function(element) {
        if (element instanceof Node || element instanceof Element || element instanceof HTMLDocument) {
            return element
        // coerce when possible
        } else {
            if (element == null) {
                return new window.Text("")
            } else if (typeof element == 'string') {
                return new window.Text(element)
            } else if (typeof element == 'symbol') {
                // symbols throw errors for: `${symbol}`
                return new window.Text(element.toString())
            } else if (!(element instanceof Object)) {
                return new window.Text(`${element}`)
            } else if (element[toHtmlElement] != null) {
                return ElementalClass.makeHtmlElement(element[toHtmlElement])
            } else {
                let className 
                try {
                    className = Object.getPrototypeOf(element).constructor.name 
                    className = className && `class ${JSON.stringify(className)}`
                } catch (error) {}
                throw Error(`Cannot coerce ${className||element} into an html element\n`, element)
            }
        }
    }
    static appendChildren = function(element, ...children) {
        const { element: altElement, insertBefore } = element
        let primitiveAppend = (child)=>element.appendChild(child)
        if (insertBefore && !(insertBefore instanceof Function)) {
            element = altElement
            primitiveAppend = (child)=>element.insertBefore(insertBefore, child)
        }
        for (const each of children) {
            if (each instanceof Array) {
                // effectively flattens nested arrays
                ElementalClass.appendChildren(element, ...each)
            } else if (each instanceof Function) {
                // recursively
                ElementalClass.appendChildren(element, each())
            } else if (each instanceof Promise) {
                const elementPromise = each
                const placeholder = elementPromise.placeholder || document.createElement("div") // TODO: appendChildren needs to NOT be a static function so that this can use this.defaultPlaceholderFactory()
                primitiveAppend(placeholder)
                setTimeout(async () => {
                    try {
                        const result = await elementPromise
                        if (!(result instanceof Array)) {
                            const htmlElement = ElementalClass.makeHtmlElement(result)
                            placeholder.replaceWith(htmlElement)
                        // if array output
                        } else {
                            // TODO: needs a cleaner solution, but it will require a major refactor 
                            let parentElement = placeholder.parentElement
                            if (!parentElement) {
                                parentElement = await new Promise((resolve, reject)=>{
                                    let intervalId = setInterval(() => {
                                        if (placeholder.parentElement) {
                                            resolve(placeholder.parentElement)
                                            clearInterval(intervalId)
                                        }
                                    }, 70)
                                })
                            }
                            // add all the children
                            for (const each of result) {
                                try {
                                    // recursive so that nested arrays of promises still work
                                    ElementalClass.appendChildren({
                                        element: parentElement,
                                        insertBefore: placeholder,
                                    }, each)
                                } catch (error) {
                                    parentElement.insertBefore(placeholder, createErrorElement(`When async component ${toString(element)} resolved, it created an array. One of those elements in the array caused an error when it tried to be added as a child:\n ${toString(error)}`))
                                }
                            }
                        }
                    } catch (error) {
                        placeholder.replaceWith(
                            defaultErrorComponentFactory({...properties, children}, key, error)
                        )
                    }
                }, 0)
            } else {
                primitiveAppend(ElementalClass.makeHtmlElement(each))
            }
        }
        return element
    }
    static css = function(first, ...args) {
        if (typeof first == 'string') {
            return first
        } else if (first == null) {
            return ""
        // templated string
        } else if (first instanceof Array) {
            const strings = first
            const values = args
            let finalString = ""
            for (const each of strings) {
                finalString += each
                if (values.length > 0) {
                    const value = values.shift()
                    if (value instanceof Object) {
                        // recursion but always a depth of only +1 from this point
                        finalString += Elemental.css(value)
                    } else {
                        finalString += `${value}`
                    }
                }
            }
            return finalString
        } else if (first instanceof Object) {
            let finalString = ""
            for (const [key, value] of Object.entries(first)) {
                if (value != null) {
                    finalString += `${kebabCase(key)}: ${value};`
                }
            }
            return finalString
        } else {
            return first
        }
    }
    static combineClasses = (...classes) => {
        classes = classes.filter(each=>each!=null)
        let classesFinalList = []
        for (let eachEntry of classes) {
            // handle strings
            if (typeof eachEntry == 'string') {
                eachEntry = eachEntry.split(" ")
            }
            // handle lists
            if (eachEntry instanceof Array) {
                eachEntry = eachEntry.flat(Infinity)
                for (let eachName of eachEntry) {
                    classesFinalList.push(eachName)
                }
            // handle objects
            } else if (eachEntry instanceof Object) {
                for (const [className, enabled] of Object.entries(eachEntry)) {
                    if (enabled) {
                        classesFinalList.push(className)
                    }
                }
            }
        }
        return classesFinalList
    }

    createElement(...args) {
        // template call
        if (args[0] instanceof Array) {
            return this.xhtm(...args)
        // jsx call
        } else {
            ElementalClass.debug && console.debug(`args is:`,args)

            // run middleware
            for (const middleware of (this.middleware[ElementalClass.allTags]||[]).concat((this.middleware[args[0]]||[]))) {
                try {
                    args = eachMiddleWare(args)
                } catch (error) {
                    console.error("[ElementalClass] one of the middleware functions failed:", eachMiddleWare, args)
                }
                // TODO: handle middleware creating invalid arguments
            }
            
            let [ key, properties, ...children ] = args
            ElementalClass.debug && console.debug(`key, properties, children is:`,key, properties, children)
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
                    const placeholder = elementPromise.placeholder || this.defaultPlaceholderFactory(output)
                    setTimeout(async () =>{
                        try {
                            const result = await elementPromise
                            if (!(result instanceof Array)) {
                                const htmlElement = ElementalClass.makeHtmlElement(result)
                                placeholder.replaceWith(htmlElement)
                            // if array output
                            } else {
                                // TODO: needs a cleaner solution, but it will require a major refactor
                                let parentElement = placeholder.parentElement
                                if (!parentElement) {
                                    parentElement = await new Promise((resolve, reject)=>{
                                        let intervalId = setInterval(() => {
                                            if (placeholder.parentElement) {
                                                resolve(placeholder.parentElement)
                                                clearInterval(intervalId)
                                            }
                                        }, 70)
                                    })
                                }
                                // add all the children
                                for (const each of result) {
                                    try {
                                        // recursive so that nested arrays of promises still work
                                        ElementalClass.appendChildren({
                                            element: parentElement,
                                            insertBefore: placeholder,
                                        }, each)
                                    } catch (error) {
                                        parentElement.insertBefore(placeholder, createErrorElement(`Something returned a promise, which resolved to an array, and then something tried to append those to an element (this element: ${element}). One of the items in the array ${each} caused an error when it tried to be added as a child:\n ${toString(error)}`))
                                    }
                                }
                            }
                        } catch (error) {
                            placeholder.replaceWith(
                                this.errorComponentFactory({...properties, children}, key, error)
                            )
                        }
                    }, 0)
                    return placeholder
                } else {
                    return output
                }
            }
            // create either an html element or an svg element
            const isSvg = ElementalClass.exclusivelySvgElements.has(key)
            let element
            // this if is only because of: https://stackoverflow.com/questions/821359/reload-an-iframe-without-adding-to-the-history
            if (key == "iframe" && properties.src) {
                // so stupid
                const helper = document.createElement("div")
                helper.innerHTML = `<iframe src=${JSON.stringify(properties.src)}></iframe>`
                element = helper.children[0]
                delete properties.src
            } else if (isSvg) {
                element = document.createElementNS('http://www.w3.org/2000/svg', key)
            } else {
                element = document.createElement(key)
            }
            let styleString = ""
            if (properties instanceof Object) {
                for (let [key, value] of Object.entries(properties)) {
                    // 
                    // styles
                    // 
                    if (key == 'style') {
                        // styles are done at the end in a batch
                        styleString +=  ElementalClass.css(value)
                        continue
                    }

                    // 
                    // events
                    // 
                    if (key.slice(0,2) == 'on' && (key.slice(2,3).toLowerCase() !== key.slice(2,3)) && value instanceof Function) {
                        element.addEventListener(key.slice(2).toLowerCase(), value)
                    }

                    // 
                    // css classes
                    // 
                    if (key ==  'class') {
                        if (value instanceof Array) {
                            value = value.join(" ")
                        } else if (value instanceof Object) {
                            let newValue = ""
                            for (const [classString, enable] of Object.entries(value)) {
                                if (enable) {
                                    newValue += classString
                                }
                            }
                            value = newValue
                        }
                    }
                    
                    // 
                    // svgs
                    // 
                    if (isSvg) {
                        if (value instanceof Array) {
                            value = value.join(" ")
                        }
                        element.setAttribute(kebabCase(key), value)
                        continue
                    }
                    
                    // 
                    // direct html attributes
                    // 
                    if (value != null && !(value instanceof Object) && validNonCallbackHtmlAttributes.has(key)) {
                        element.setAttribute(key, value)
                    }

                    // 
                    // the object property
                    // 
                    try {
                        element[key] = value
                    } catch (error) {
                        
                    }

                    // 
                    // lazy styles
                    // 
                    if (isValidStyleAttribute(key)) {
                        styleString += `;${key}: ${value};`
                    }
                }
            }

            if (styleString) {
                // set all styles at once
                element.setAttribute("style", styleString)
            }
            return ElementalClass.appendChildren(element, ...children)
        }
    }

    extend(additionalComponents={}, options={}) {
        const {middleware, ...other} = options||{}
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
// a wrapper so that ElementalClass can pretend to be a function
//    e.g. Elemental() returns a function, but that function behaves like an instance of new ElementalClass()
// 
export const Elemental = (...args) => {
    const elementalObject = new ElementalClass(...args)
    const createElementFunction = elementalObject.createElement.bind(elementalObject)
    // attach static and normal attributes
    attachProperties(ElementalClass, createElementFunction)
    attachProperties(elementalObject, createElementFunction)
    return createElementFunction
}
attachProperties(ElementalClass, Elemental)

function createErrorElement(error) {
    const element = document.createElement("div")
    element.setAttribute('style', `
        all:              unset;
        display:          flex;
        flex-direction:   column;
        padding:          1.5rem;
        background-color: #f5a5a8;
        color:            white;
        font-family:      -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        font-size:        18px;
        font-weight:      400;
        overflow:         auto;
    `)
    element.innerHTML = `I'm sorry, there was an error when loading this part of the page 🙁.<br>Here's the error message: ${ Option(toString(error!=null&&error.message||error)).innerHTML}`

}
function defaultErrorComponentFactory({children, ...properties}, key, error) {
    const element = document.createElement("div")
    const errorDetails = document.createElement("div")
    const childContainer = document.createElement("div")
    
    // 
    // error body
    // 
    element.setAttribute('style', `
        all:              unset;
        display:          flex;
        flex-direction:   column;
        padding:          1.5rem;
        background-color: #f5a5a8;
        color:            white;
        font-family:      -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;
        font-size:        18px;
        font-weight:      400;
        overflow:         auto;
    `)
    element.innerHTML = `I'm sorry, there was an error when loading this part of the page 🙁 `
    
    // 
    // error details
    // 
    let errorElementPart
    if (typeof key == 'string') {
        errorElementPart = `&lt;${key} />`
    } else {
        try {
            // classes
            errorElementPart = `&lt;${key.prototype.constructor.name} />`
        } catch (error) {
            try {
                // functions
                errorElementPart = `&lt;${key.name} />`
            } catch (error) {
                // unknown
                errorElementPart = `&lt;${key} />`
            }
        }
    }
    let errorJsonObject = {}
    for (const [key, value] of Object.entries(properties)) {
        try {
            errorJsonObject[key] = JSON.parse(JSON.stringify(value))
        } catch (error) {
            if (typeof value == 'symbol') {
                errorJsonObject[key] = value.toString()
            } else {
                errorJsonObject[key] = `${value}`
            }
        }
    }
    
    errorDetails.innerHTML = `<span>error: ${`${error}`.replace(/\n/, "<br>")}<br>location:<br>${indent({string:error.stack, by:"    "}).replace(/\n/, "<br>")}</span><br><span>tag: ${errorElementPart}</span><br><div>properties:<br><code style="max-height: 12rem; overflow: auto;">${JSON.stringify(errorJsonObject,0,4)}</code></div>`
    errorDetails.setAttribute('style', `
        padding: 1rem;
        background-color: #161b22;
        color: #789896;
        white-space: pre;
        max-width: 85vw;
        overflow: auto;
    `)
    element.appendChild(errorDetails)
    // 
    // children
    // 
    childContainer.setAttribute('style', `
        all: unset
        display: flex
        flex-direction: column
        margin-top: 1.3rem
    `)
    for (const each of (children||[])) {
        try {
            ElementalClass.appendChildren(childContainer, [each])
        } catch (error) {
        }
    }
    element.appendChild(childContainer)
    return element
}

// 
// protect document head by monkey patching it (this is the only monkeypatch)
// 
try {
    const originalHead = document.head
    Object.defineProperty(document,"head", { 
        set: (element) => ElementalClass.appendChildren(originalHead, ...element.childNodes),
        get: ()=>originalHead,
        writable: true,
    })
} catch (error) {
    
}

export const passAlongProps = (element, properties, {isSvg=false}={}) => {
    let styleString = ""
    if (properties instanceof Object) {
        for (let [key, value] of Object.entries(properties)) {
            // 
            // styles
            // 
            if (key == 'style') {
                // styles are done at the end in a batch
                styleString +=  ElementalClass.css(value)
                continue
            }

            // 
            // events
            // 
            if (key.slice(0,2) == 'on' && (key.slice(2,3).toLowerCase() !== key.slice(2,3)) && value instanceof Function) {
                element.addEventListener(key.slice(2).toLowerCase(), value)
            }

            // 
            // css classes
            // 
            if (key ==  'class') {
                if (value instanceof Array) {
                    value = value.join(" ")
                } else if (value instanceof Object) {
                    let newValue = ""
                    for (const [classString, enable] of Object.entries(value)) {
                        if (enable) {
                            newValue += classString
                        }
                    }
                    value = newValue
                }
            }
            
            // 
            // svgs
            // 
            if (isSvg) {
                if (value instanceof Array) {
                    value = value.join(" ")
                }
                element.setAttribute(kebabCase(key), value)
                continue
            }
            
            // 
            // direct html attributes
            // 
            if (value != null && !(value instanceof Object) && validNonCallbackHtmlAttributes.has(key)) {
                element.setAttribute(key, value)
            }

            // 
            // the object property
            // 
            try {
                element[key] = value
            } catch (error) {
                
            }

            // 
            // lazy styles
            // 
            if (isValidStyleAttribute(key)) {
                styleString += `;${key}: ${value};`
            }
        }
    }
    
    if (styleString) {
        // set all styles at once
        element.setAttribute("style", `${element.getAttribute("style")||""};${styleString}`)
    }
    if (properties.children) {
        ElementalClass.appendChildren(element, ...properties.children)
    }
    return element
}

export const combineClasses = ElementalClass.combineClasses
export const html = Elemental()
export const css = ElementalClass.css
export const allTags = ElementalClass.allTags
export default {
    Elemental,
    html,
    css,
    allTags,
    combineClasses,
}