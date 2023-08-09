// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

[
    Uint16Array,
    Uint32Array,
    Uint8Array,
    Uint8ClampedArray,
    Int16Array,
    Int32Array,
    Int8Array,
    Float32Array,
    Float64Array,
    globalThis.BigInt64Array,
    globalThis.BigUint64Array
].filter((each)=>each
);
Object.getOwnPropertyDescriptors;
const allKeyDescriptions = function(value, options = {
    includingBuiltin: false
}) {
    var { includingBuiltin  } = {
        ...options
    };
    let descriptions = [];
    if (value == null) {
        return {};
    }
    if (!(value instanceof Object)) {
        value = Object.getPrototypeOf(value);
    }
    const rootPrototype = Object.getPrototypeOf({});
    let prevObj;
    while(value && value != prevObj){
        if (!includingBuiltin && value == rootPrototype) {
            break;
        }
        descriptions = descriptions.concat(Object.entries(Object.getOwnPropertyDescriptors(value)));
        prevObj = value;
        value = Object.getPrototypeOf(value);
    }
    descriptions.reverse();
    return Object.fromEntries(descriptions);
};
Object.getPrototypeOf(new Map().keys());
Object.getPrototypeOf(new Set().keys());
let GeneratorFunction = class {
};
let AsyncGeneratorFunction = class {
};
try {
    GeneratorFunction = eval("((function*(){})()).constructor");
    AsyncGeneratorFunction = eval("((async function*(){})()).constructor");
} catch (error) {}
Symbol.for("deepCopy");
Symbol();
const getThis = Symbol();
Object.getPrototypeOf(function() {})[getThis] = function() {
    return this;
};
const deepSortObject = (obj, seen = new Map())=>{
    if (!(obj instanceof Object)) {
        return obj;
    } else if (seen.has(obj)) {
        return seen.get(obj);
    } else {
        if (obj instanceof Array) {
            const sortedChildren = [];
            seen.set(obj, sortedChildren);
            for (const each of obj){
                sortedChildren.push(deepSortObject(each, seen));
            }
            return sortedChildren;
        } else {
            const sorted = {};
            seen.set(obj, sorted);
            for (const eachKey of Object.keys(obj).sort()){
                sorted[eachKey] = deepSortObject(obj[eachKey], seen);
            }
            return sorted;
        }
    }
};
var e = "", t = "";
function o(r1) {
    var p1, a1, l, s, c1 = arguments, i1 = this, n = 0, d = [], h = 0, u = [], f = 0;
    d.root = !0;
    var g = function(e1, o1, r2) {
        void 0 === o1 && (o1 = []);
        var p2 = 0;
        return (e1 = r2 || e1 !== t ? e1.replace(/\ue001/g, (e)=>u[f++]
        ) : u[f++].slice(1, -1)) ? (e1.replace(/\ue000/g, (t, r3)=>(r3 && o1.push(e1.slice(p2, r3)), p2 = r3 + 1, o1.push(c1[++h]))
        ), p2 < e1.length && o1.push(e1.slice(p2)), o1.length > 1 ? o1 : o1[0]) : e1;
    }, m = ()=>{
        [d, s, ...p1] = d, d.push(i1(s, ...p1));
    };
    return r1.join(e).replace(/<!--[^]*-->/g, "").replace(/<!\[CDATA\[[^]*\]\]>/g, "").replace(/('|")[^\1]*?\1/g, (e2)=>(u.push(e2), t)
    ).replace(/\s+/g, " ").replace(/(?:^|>)([^<]*)(?:$|<)/g, (e3, t1, r4, p3)=>{
        var c, i;
        if (r4 && p3.slice(n, r4).replace(/(\S)\/$/, "$1 /").split(" ").map((e4, t2)=>{
            if ("/" === e4[0]) c = i || e4.slice(1) || 1;
            else if (t2) {
                if (e4) {
                    var r5 = d[2] || (d[2] = {});
                    "..." === e4.slice(0, 3) ? Object.assign(r5, arguments[++h]) : ([a1, l] = e4.split("="), r5[g(a1)] = !l || g(l));
                }
            } else {
                for(i = g(e4); o.close[d[1] + i];)m();
                d = [
                    d,
                    i,
                    null
                ], o.empty[i] && (c = i);
            }
        }), c) for(m(); s !== c && o.close[s];)m();
        n = r4 + e3.length, t1 && " " !== t1 && g((s = 0, t1), d, !0);
    }), d.root || m(), d.length > 1 ? d : d[0];
}
o.empty = {}, o.close = {}, "area base br col command embed hr img input keygen link meta param source track wbr ! !doctype ? ?xml".split(" ").map((e5)=>o.empty[e5] = o.empty[e5.toUpperCase()] = !0
);
var r = {
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
    th: "td tr tbody"
}, p = function(e6) {
    [
        ...r[e6].split(" "),
        e6
    ].map((t3)=>{
        o.close[e6] = o.close[e6.toUpperCase()] = o.close[e6 + t3] = o.close[e6.toUpperCase() + t3] = o.close[e6 + t3.toUpperCase()] = o.close[e6.toUpperCase() + t3.toUpperCase()] = !0;
    });
};
for(var a in r)p(a);
const xhtm = o;
const validStyleAttribute = Object.freeze(new Set([
    "accent-color",
    "align-content",
    "align-items",
    "align-self",
    "align-tracks",
    "all",
    "animation",
    "animation-delay",
    "animation-direction",
    "animation-duration",
    "animation-fill-mode",
    "animation-iteration-count",
    "animation-name",
    "animation-play-state",
    "animation-timeline",
    "animation-timing-function",
    "appearance",
    "ascent-override",
    "aspect-ratio",
    "backdrop-filter",
    "backface-visibility",
    "background",
    "background-attachment",
    "background-blend-mode",
    "background-clip",
    "background-color",
    "background-image",
    "background-origin",
    "background-position",
    "background-position-x",
    "background-position-y",
    "background-repeat",
    "background-size",
    "bleed",
    "block-overflow",
    "block-size",
    "border",
    "border-block",
    "border-block-color",
    "border-block-end",
    "border-block-end-color",
    "border-block-end-style",
    "border-block-end-width",
    "border-block-start",
    "border-block-start-color",
    "border-block-start-style",
    "border-block-start-width",
    "border-block-style",
    "border-block-width",
    "border-bottom",
    "border-bottom-color",
    "border-bottom-left-radius",
    "border-bottom-right-radius",
    "border-bottom-style",
    "border-bottom-width",
    "border-collapse",
    "border-color",
    "border-end-end-radius",
    "border-end-start-radius",
    "border-image",
    "border-image-outset",
    "border-image-repeat",
    "border-image-slice",
    "border-image-source",
    "border-image-width",
    "border-inline",
    "border-inline-color",
    "border-inline-end",
    "border-inline-end-color",
    "border-inline-end-style",
    "border-inline-end-width",
    "border-inline-start",
    "border-inline-start-color",
    "border-inline-start-style",
    "border-inline-start-width",
    "border-inline-style",
    "border-inline-width",
    "border-left",
    "border-left-color",
    "border-left-style",
    "border-left-width",
    "border-radius",
    "border-right",
    "border-right-color",
    "border-right-style",
    "border-right-width",
    "border-spacing",
    "border-start-end-radius",
    "border-start-start-radius",
    "border-style",
    "border-top",
    "border-top-color",
    "border-top-left-radius",
    "border-top-right-radius",
    "border-top-style",
    "border-top-width",
    "border-width",
    "bottom",
    "box-decoration-break",
    "box-shadow",
    "box-sizing",
    "break-after",
    "break-before",
    "break-inside",
    "caption-side",
    "caret-color",
    "clear",
    "clip",
    "clip-path",
    "color",
    "color-scheme",
    "column-count",
    "column-fill",
    "column-gap",
    "column-rule",
    "column-rule-color",
    "column-rule-style",
    "column-rule-width",
    "column-span",
    "column-width",
    "columns",
    "contain",
    "content",
    "content-visibility",
    "counter-increment",
    "counter-reset",
    "counter-set",
    "cursor",
    "length",
    "angle",
    "descent-override",
    "direction",
    "display",
    "resolution",
    "empty-cells",
    "fallback",
    "filter",
    "flex",
    "flex-basis",
    "flex-direction",
    "flex-flow",
    "flex-grow",
    "flex-shrink",
    "flex-wrap",
    "flex_value",
    "float",
    "font",
    "font-display",
    "font-family",
    "font-feature-settings",
    "font-kerning",
    "font-language-override",
    "font-optical-sizing",
    "font-size",
    "font-size-adjust",
    "font-stretch",
    "font-style",
    "font-synthesis",
    "font-variant",
    "font-variant-alternates",
    "font-variant-caps",
    "font-variant-east-asian",
    "font-variant-ligatures",
    "font-variant-numeric",
    "font-variant-position",
    "font-variation-settings",
    "font-weight",
    "forced-color-adjust",
    "gap",
    "grid",
    "grid-area",
    "grid-auto-columns",
    "grid-auto-flow",
    "grid-auto-rows",
    "grid-column",
    "grid-column-end",
    "grid-column-start",
    "grid-row",
    "grid-row-end",
    "grid-row-start",
    "grid-template",
    "grid-template-areas",
    "grid-template-columns",
    "grid-template-rows",
    "frequency",
    "hanging-punctuation",
    "height",
    "hyphenate-character",
    "hyphens",
    "image-orientation",
    "image-rendering",
    "image-resolution",
    "inherit",
    "inherits",
    "initial",
    "initial-letter",
    "initial-letter-align",
    "initial-value",
    "inline-size",
    "input-security",
    "inset",
    "inset-block",
    "inset-block-end",
    "inset-block-start",
    "inset-inline",
    "inset-inline-end",
    "inset-inline-start",
    "isolation",
    "justify-content",
    "justify-items",
    "justify-self",
    "justify-tracks",
    "left",
    "letter-spacing",
    "line-break",
    "line-clamp",
    "line-gap-override",
    "line-height",
    "line-height-step",
    "list-style",
    "list-style-image",
    "list-style-position",
    "list-style-type",
    "margin",
    "margin-block",
    "margin-block-end",
    "margin-block-start",
    "margin-bottom",
    "margin-inline",
    "margin-inline-end",
    "margin-inline-start",
    "margin-left",
    "margin-right",
    "margin-top",
    "margin-trim",
    "marks",
    "mask",
    "mask-border",
    "mask-border-mode",
    "mask-border-outset",
    "mask-border-repeat",
    "mask-border-slice",
    "mask-border-source",
    "mask-border-width",
    "mask-clip",
    "mask-composite",
    "mask-image",
    "mask-mode",
    "mask-origin",
    "mask-position",
    "mask-repeat",
    "mask-size",
    "mask-type",
    "masonry-auto-flow",
    "math-style",
    "max-block-size",
    "max-height",
    "max-inline-size",
    "max-lines",
    "max-width",
    "max-zoom",
    "min-block-size",
    "min-height",
    "min-inline-size",
    "min-width",
    "min-zoom",
    "mix-blend-mode",
    "time",
    "negative",
    "object-fit",
    "object-position",
    "offset",
    "offset-anchor",
    "offset-distance",
    "offset-path",
    "offset-position",
    "offset-rotate",
    "opacity",
    "order",
    "orientation",
    "orphans",
    "outline",
    "outline-color",
    "outline-offset",
    "outline-style",
    "outline-width",
    "overflow",
    "overflow-anchor",
    "overflow-block",
    "overflow-clip-margin",
    "overflow-inline",
    "overflow-wrap",
    "overflow-x",
    "overflow-y",
    "overscroll-behavior",
    "overscroll-behavior-block",
    "overscroll-behavior-inline",
    "overscroll-behavior-x",
    "overscroll-behavior-y",
    "Pseudo-classes",
    "Pseudo-elements",
    "pad",
    "padding",
    "padding-block",
    "padding-block-end",
    "padding-block-start",
    "padding-bottom",
    "padding-inline",
    "padding-inline-end",
    "padding-inline-start",
    "padding-left",
    "padding-right",
    "padding-top",
    "page-break-after",
    "page-break-before",
    "page-break-inside",
    "paint-order",
    "perspective",
    "perspective-origin",
    "place-content",
    "place-items",
    "place-self",
    "pointer-events",
    "position",
    "prefix",
    "print-color-adjust",
    "quotes",
    "range",
    "resize",
    "revert",
    "right",
    "rotate",
    "row-gap",
    "ruby-align",
    "ruby-merge",
    "ruby-position",
    "scale",
    "scroll-behavior",
    "scroll-margin",
    "scroll-margin-block",
    "scroll-margin-block-end",
    "scroll-margin-block-start",
    "scroll-margin-bottom",
    "scroll-margin-inline",
    "scroll-margin-inline-end",
    "scroll-margin-inline-start",
    "scroll-margin-left",
    "scroll-margin-right",
    "scroll-margin-top",
    "scroll-padding",
    "scroll-padding-block",
    "scroll-padding-block-end",
    "scroll-padding-block-start",
    "scroll-padding-bottom",
    "scroll-padding-inline",
    "scroll-padding-inline-end",
    "scroll-padding-inline-start",
    "scroll-padding-left",
    "scroll-padding-right",
    "scroll-padding-top",
    "scroll-snap-align",
    "scroll-snap-stop",
    "scroll-snap-type",
    "scrollbar-color",
    "scrollbar-gutter",
    "scrollbar-width",
    "shape-image-threshold",
    "shape-margin",
    "shape-outside",
    "size",
    "size-adjust",
    "speak-as",
    "src",
    "suffix",
    "symbols",
    "syntax",
    "system",
    "tab-size",
    "table-layout",
    "text-align",
    "text-align-last",
    "text-combine-upright",
    "text-decoration",
    "text-decoration-color",
    "text-decoration-line",
    "text-decoration-skip",
    "text-decoration-skip-ink",
    "text-decoration-style",
    "text-decoration-thickness",
    "text-emphasis",
    "text-emphasis-color",
    "text-emphasis-position",
    "text-emphasis-style",
    "text-indent",
    "text-justify",
    "text-orientation",
    "text-overflow",
    "text-rendering",
    "text-shadow",
    "text-size-adjust",
    "text-transform",
    "text-underline-offset",
    "text-underline-position",
    "top",
    "touch-action",
    "transform",
    "transform-box",
    "transform-origin",
    "transform-style",
    "transition",
    "transition-delay",
    "transition-duration",
    "transition-property",
    "transition-timing-function",
    "translate",
    "unicode-bidi",
    "unicode-range",
    "unset",
    "user-select",
    "user-zoom",
    "vertical-align",
    "viewport-fit",
    "visibility",
    "white-space",
    "widows",
    "width",
    "will-change",
    "word-break",
    "word-spacing",
    "word-wrap",
    "writing-mode",
    "z-index",
    "zoom"
]));
const validNonCallbackHtmlAttributes = Object.freeze(new Set([
    "class",
    "style",
    "value",
    "id",
    "contenteditable",
    "href",
    "hidden",
    "autofocus",
    "src",
    "name",
    "accept",
    "accesskey",
    "action",
    "align",
    "alt",
    "async",
    "autocomplete",
    "autoplay",
    "border",
    "charset",
    "checked",
    "cite",
    "cols",
    "colspan",
    "content",
    "controls",
    "coords",
    "data",
    "datetime",
    "default",
    "defer",
    "dir",
    "dirname",
    "disabled",
    "download",
    "draggable",
    "enctype",
    "for",
    "form",
    "formaction",
    "headers",
    "high",
    "hreflang",
    "http",
    "ismap",
    "kind",
    "label",
    "lang",
    "list",
    "loop",
    "low",
    "max",
    "maxlength",
    "media",
    "method",
    "min",
    "multiple",
    "muted",
    "novalidate",
    "open",
    "optimum",
    "pattern",
    "placeholder",
    "poster",
    "preload",
    "readonly",
    "rel",
    "required",
    "reversed",
    "rows",
    "rowspan",
    "sandbox",
    "scope",
    "selected",
    "shape",
    "size",
    "sizes",
    "span",
    "spellcheck",
    "srcdoc",
    "srclang",
    "srcset",
    "start",
    "step",
    "tabindex",
    "target",
    "title",
    "translate",
    "type",
    "usemap",
    "wrap",
    "bgcolor",
    "width",
    "color",
    "height", 
]));
const isValidStyleAttribute = (key)=>key.startsWith('-') || validStyleAttribute.has(key)
;
const kebabCase = (string)=>string.replace(/[a-z]([A-Z])(?=[a-z])/g, (each)=>`${each[0]}-${each.slice(1).toLowerCase()}`
    )
;
const isConstructor = (obj)=>!!obj.prototype && !!obj.prototype.constructor.name
;
const attachProperties = (source, target)=>{
    const attributes = allKeyDescriptions(source);
    const propertiesDefition = {};
    for (const [key, value] of Object.entries(attributes)){
        if ([
            'constructor',
            'prototype',
            'length', 
        ].includes(key)) {
            continue;
        }
        propertiesDefition[key] = {
            get: ()=>source[key]
        };
    }
    Object.defineProperties(target, propertiesDefition);
    return target;
};
class ElementalClass {
    constructor(components = {}, options = {}){
        const { middleware , errorComponentFactory  } = options || {};
        this.components = components || {};
        this.middleware = middleware || {};
        this.errorComponentFactory = errorComponentFactory || defaultErrorComponentFactory;
        this.html = this.createElement;
        this.xhtm = xhtm.bind((...args)=>this.createElement(...args)
        );
    }
    static debug = false;
    static allTags = Symbol.for("allTags");
    static exclusivelySvgElements = new Set([
        "svg",
        "animate",
        "animateMotion",
        "animateTransform",
        "circle",
        "clipPath",
        "defs",
        "desc",
        "discard",
        "ellipse",
        "feBlend",
        "feColorMatrix",
        "feComponentTransfer",
        "feComposite",
        "feConvolveMatrix",
        "feDiffuseLighting",
        "feDisplacementMap",
        "feDistantLight",
        "feDropShadow",
        "feFlood",
        "feFuncA",
        "feFuncB",
        "feFuncG",
        "feFuncR",
        "feGaussianBlur",
        "feImage",
        "feMerge",
        "feMergeNode",
        "feMorphology",
        "feOffset",
        "fePointLight",
        "feSpecularLighting",
        "feSpotLight",
        "feTile",
        "feTurbulence",
        "filter",
        "foreignObject",
        "g",
        "hatch",
        "hatchpath",
        "image",
        "line",
        "linearGradient",
        "marker",
        "mask",
        "mesh",
        "meshgradient",
        "meshpatch",
        "meshrow",
        "metadata",
        "mpath",
        "path",
        "pattern",
        "polygon",
        "polyline",
        "radialGradient",
        "rect",
        "set",
        "stop",
        "switch",
        "symbol",
        "text",
        "textPath",
        "tspan",
        "unknown",
        "use",
        "view", 
    ]);
    static randomId = (name)=>`${name}${Math.random()}`.replace(".", "")
    ;
    static appendChildren = function(element, ...children) {
        for (const each of children){
            if (typeof each == 'string') {
                element.appendChild(new window.Text(each));
            } else if (each == null) {
                element.appendChild(new window.Text(""));
            } else if (!(each instanceof Object)) {
                element.appendChild(new window.Text(`${each}`));
            } else if (each instanceof Node) {
                element.appendChild(each);
            } else if (each instanceof Array) {
                ElementalClass.appendChildren(element, ...each);
            } else if (each instanceof Function) {
                ElementalClass.appendChildren(element, each());
            } else if (each instanceof Promise) {
                const elementPromise = each;
                const placeholder = elementPromise.placeholder || document.createElement("div");
                setTimeout(async ()=>placeholder.replaceWith(await elementPromise)
                , 0);
                element.appendChild(placeholder);
            } else if (each != null && each instanceof Object) {
                element.appendChild(each);
            }
        }
        return element;
    };
    static css = function(first, ...args) {
        if (typeof first == 'string') {
            return first;
        } else if (first == null) {
            return "";
        } else if (first instanceof Array) {
            const strings = first;
            const values = args;
            let finalString = "";
            for (const each of strings){
                finalString += each;
                if (values.length > 0) {
                    const value = values.shift();
                    if (value instanceof Object) {
                        finalString += Elemental.css(value);
                    } else {
                        finalString += `${value}`;
                    }
                }
            }
            return finalString;
        } else if (first instanceof Object) {
            let finalString = "";
            for (const [key, value] of Object.entries(first)){
                if (value != null) {
                    finalString += `${kebabCase(key)}: ${value};`;
                }
            }
            return finalString;
        } else {
            return first;
        }
    };
    static combineClasses = (...classes)=>{
        classes = classes.filter((each)=>each != null
        );
        let classesFinalList = [];
        for (let eachEntry of classes){
            if (typeof eachEntry == 'string') {
                eachEntry = eachEntry.split(" ");
            }
            if (eachEntry instanceof Array) {
                eachEntry = eachEntry.flat(Infinity);
                for (let eachName of eachEntry){
                    classesFinalList.push(eachName);
                }
            } else if (eachEntry instanceof Object) {
                for (const [className, enabled] of Object.entries(eachEntry)){
                    if (enabled) {
                        classesFinalList.push(className);
                    }
                }
            }
        }
        return classesFinalList;
    };
    createElement(...args) {
        if (args[0] instanceof Array) {
            return this.xhtm(...args);
        } else {
            ElementalClass.debug && console.debug(`args is:`, args);
            for (const middleware of (this.middleware[ElementalClass.allTags] || []).concat(this.middleware[args[0]] || [])){
                try {
                    args = eachMiddleWare(args);
                } catch (error) {
                    console.error("[ElementalClass] one of the middleware functions failed:", eachMiddleWare, args);
                }
            }
            let [key, properties, ...children] = args;
            ElementalClass.debug && console.debug(`key, properties, children is:`, key, properties, children);
            if (this.components[key] instanceof Function) {
                key = this.components[key];
            }
            if (key instanceof Function) {
                let output;
                try {
                    output = isConstructor(key) ? new key({
                        ...properties,
                        children
                    }) : key({
                        ...properties,
                        children
                    });
                } catch (error1) {
                    return this.errorComponentFactory({
                        ...properties,
                        children
                    }, key, error1);
                }
                if (output instanceof Promise) {
                    const elementPromise = output;
                    const placeholder = elementPromise.placeholder || document.createElement("div");
                    setTimeout(async ()=>placeholder.replaceWith(await elementPromise)
                    , 0);
                    return placeholder;
                } else {
                    return output;
                }
            }
            const isSvg = ElementalClass.exclusivelySvgElements.has(key);
            const element = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', key) : document.createElement(key);
            let styleString = "";
            if (properties instanceof Object) {
                for (let [key, value] of Object.entries(properties)){
                    if (key == 'style') {
                        styleString += ElementalClass.css(value);
                        continue;
                    }
                    if (key.slice(0, 2) == 'on' && value instanceof Function) {
                        element.addEventListener(key.slice(2).toLowerCase(), value);
                    }
                    if (key == 'class') {
                        if (value instanceof Array) {
                            value = value.join(" ");
                        } else if (value instanceof Object) {
                            let newValue = "";
                            for (const [classString, enable] of Object.entries(value)){
                                if (enable) {
                                    newValue += classString;
                                }
                            }
                            value = newValue;
                        }
                    }
                    if (isSvg) {
                        if (value instanceof Array) {
                            value = value.join(" ");
                        }
                        element.setAttribute(kebabCase(key), value);
                        continue;
                    }
                    if (value != null && !(value instanceof Object) && validNonCallbackHtmlAttributes.has(key)) {
                        element.setAttribute(key, value);
                    }
                    try {
                        element[key] = value;
                    } catch (error) {}
                    if (isValidStyleAttribute(key)) {
                        styleString += `;${key}: ${value};`;
                    }
                }
            }
            if (styleString) {
                element.setAttribute("style", styleString);
            }
            return ElementalClass.appendChildren(element, ...children);
        }
    }
    extend(additionalComponents = {}, options = {}) {
        const { middleware , ...other } = options || {};
        return Elemental({
            ...this.components,
            ...additionalComponents
        }, {
            middleware: {
                ...this.middleware,
                ...middleware
            },
            ...other
        });
    }
}
const Elemental = (...args)=>{
    const elementalObject = new ElementalClass(...args);
    const createElementFunction = elementalObject.createElement.bind(elementalObject);
    attachProperties(ElementalClass, createElementFunction);
    attachProperties(elementalObject, createElementFunction);
    return createElementFunction;
};
attachProperties(ElementalClass, Elemental);
function defaultErrorComponentFactory({ children , ...properties }, key, error2) {
    const element = document.createElement("div");
    const errorDetails = document.createElement("code");
    const childContainer = document.createElement("div");
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
    `);
    element.innerHTML = `I'm sorry, there was an error when loading this part of the page 🙁 `;
    let errorElementPart;
    if (typeof key == 'string') {
        errorElementPart = `<${key} />`;
    } else {
        try {
            errorElementPart = `<${key.prototype.constructor.name} />`;
        } catch (error) {
            try {
                errorElementPart = `<${key.name} />`;
            } catch (error) {
                errorElementPart = `<${key} />`;
            }
        }
    }
    let errorJsonObject = {};
    for (const [key1, value] of Object.entries(properties)){
        try {
            errorJsonObject[key1] = JSON.parse(JSON.stringify(value));
        } catch (error) {
            errorJsonObject[key1] = `${value}`;
        }
    }
    errorDetails.innerHTML = `tag: ${errorElementPart}\nproperties: ${JSON.stringify(errorJsonObject, 0, 4)}\nerror: ${error2}`;
    errorDetails.setAttribute('style', `
        padding: 1rem;
        background-color: #161b22;
        color: #789896;
        white-space: pre;
        max-width: 85vw;
        overflow: auto;
    `);
    element.appendChild(errorDetails);
    childContainer.setAttribute('style', `
        all: unset
        display: flex
        flex-direction: column
        margin-top: 1.3rem
    `);
    ElementalClass.appendChildren(childContainer, children);
    element.appendChild(childContainer);
    return element;
}
try {
    const originalHead = document.head;
    Object.defineProperty(document, "head", {
        set: (element)=>ElementalClass.appendChildren(originalHead, ...element.childNodes)
        ,
        get: ()=>originalHead
        ,
        writable: true
    });
} catch (error3) {}
const combineClasses = ElementalClass.combineClasses;
const html = Elemental();
const css = ElementalClass.css;
const allTags = ElementalClass.allTags;
const __default = {
    Elemental,
    html,
    css,
    allTags,
    combineClasses
};
export { __default as default,  };
export { Elemental as Elemental };
export { combineClasses as combineClasses };
export { html as html };
export { css as css };
export { allTags as allTags };

