var q=[Uint16Array,Uint32Array,Uint8Array,Uint8ClampedArray,Int16Array,Int32Array,Int8Array,Float32Array,Float64Array,globalThis.BigInt64Array,globalThis.BigUint64Array].filter(e=>e),ne=function(e){let r=[];if(e==null)return[];for(e instanceof Object||(e=Object.getPrototypeOf(e));e;)r=r.concat(Reflect.ownKeys(e)),e=Object.getPrototypeOf(e);return r},ie=Object.getOwnPropertyDescriptors,$=function(e,r={includingBuiltin:!1}){var{includingBuiltin:o}={...r};let t=[];if(e==null)return{};e instanceof Object||(e=Object.getPrototypeOf(e));let n=Object.getPrototypeOf({}),a;for(;e&&e!=a&&!(!o&&e==n);)t=t.concat(Object.entries(Object.getOwnPropertyDescriptors(e))),a=e,e=Object.getPrototypeOf(e);return t.reverse(),Object.fromEntries(t)},K=Object.getPrototypeOf(new Map().keys()),R=Object.getPrototypeOf(new Set().keys()),T=class{},D=class{};try{T=eval("((function*(){})()).constructor"),D=eval("((async function*(){})()).constructor")}catch(e){}var W=e=>{if(e instanceof Object){let r=Object.getPrototypeOf(e);if(r==K||r==R)return!0;let o=e.constructor;return o==T||o==D}return!1},F=Symbol.for("deepCopy"),se=Symbol(),I=Symbol();Object.getPrototypeOf(function(){})[I]=function(){return this};function S(e,r=[],o=new Map){if(r.push(e),e==null||!(e instanceof Object))return e;if(o.has(e))return o.get(e);if(e[F]instanceof Function){let i=e[F]();return o.set(e,i),i}if(W(e))throw Error(`Sadly built-in generators cannot be deep copied.
And I found a generator along this path:
${r.reverse().map(i=>`${i},
`)}`);let t,n,a;e instanceof Date?t=new Date(e.getTime()):e instanceof RegExp?t=new RegExp(e):e instanceof Function?(n=e[I](),t=function(...i){return e.apply(a,i)}):q.includes(e.constructor)?t=new e.constructor([...e]):e instanceof Array?t=[]:e instanceof Set?t=new Set:e instanceof Map&&(t=new Map),o.set(e,t),t instanceof Function&&(a=S(n,r,o));let c=t;try{c.constructor=e.constructor}catch{}Object.setPrototypeOf(c,Object.getPrototypeOf(e));let l={};for(let[i,s]of Object.entries(Object.getOwnPropertyDescriptors(e))){let{value:d,get:m,set:u,...k}=s,x=m instanceof Function,z=u instanceof Function;if(x||z)l[i]={...k,get:m?function(...f){return m.apply(c,f)}:void 0,set:u?function(...f){return u.apply(c,f)}:void 0};else{if(i=="length"&&c instanceof Array)continue;l[i]={...k,value:S(d,r,o)}}}return Object.defineProperties(c,l),c}var ae=e=>S(e),le=e=>Object.keys(e).sort().reduce((r,o)=>(r[o]=e[o],r),{}),A=(e,r=new Map)=>{if(e instanceof Object){if(r.has(e))return r.get(e);if(e instanceof Array){let o=[];r.set(e,o);for(let t of e)o.push(A(t,r));return o}else{let o={};r.set(e,o);for(let t of Object.keys(e).sort())o[t]=A(e[t],r);return o}}else return e},ce=(e,...r)=>JSON.stringify(A(e),...r);var H="\uE000",M="\uE001";function w(e){let r=this,o=0,t=[null],n=0,a,c,l,i=[],s=0,d,m=0,u=!1,k=(f,g=[],j)=>{let O=0;return f=!j&&f===M?i[s++].slice(1,-1):f.replace(/\ue001/g,p=>i[s++]),f&&(f.replace(/\ue000/g,(p,h)=>(h&&g.push(f.slice(O,h)),O=h+1,g.push(arguments[++n]))),O<f.length&&g.push(f.slice(O)),g.length>1?g:g[0])},x=()=>{[t,d,...a]=t,t.push(r(d,...a)),u===m--&&(u=!1)};return e.join(H).replace(/<!--[^]*?-->/g,"").replace(/<!\[CDATA\[[^]*\]\]>/g,"").replace(/('|")[^\1]*?\1/g,f=>(i.push(f),M)).replace(/(?:^|>)((?:[^<]|<[^\w\ue000\/?!>])*)(?:$|<)/g,(f,g,j,O)=>{let p,h;if(j&&O.slice(o,j).replace(/(\S)\/$/,"$1 /").split(/\s+/).map((y,G)=>{if(y[0]==="/"){if(y=y.slice(1),N[y])return;h=p||y||1}else if(G){if(y){let E=t[2]||(t[2]={});y.slice(0,3)==="..."?Object.assign(E,arguments[++n]):([c,l]=y.split("="),Array.isArray(l=E[k(c)]=l?k(l):!0)&&(l.toString=l.join.bind(l,"")))}}else{if(p=k(y),typeof p=="string")for(p=p.toLowerCase();C[t[1]+p];)x();t=[t,p,null],m++,!u&&J[p]&&(u=m),N[p]&&(h=p)}}),h)for(t[0]||L(`Wrong close tag \`${h}\``),x();d!==h&&C[d];)x();o=j+f.length,u||(g=g.replace(/\s*\n\s*/g,"").replace(/\s+/g," ")),g&&k((d=0,g),t,!0)}),t[0]&&C[t[1]]&&x(),m&&L(`Unclosed \`${t[1]}\`.`),t.length<3?t[1]:(t.shift(),t)}var L=e=>{throw SyntaxError(e)},N=w.empty={},C=w.close={},J=w.pre={};"area base basefont bgsound br col command embed frame hr image img input keygen link meta param source track wbr ! !doctype ? ?xml".split(" ").map(e=>w.empty[e]=!0);var U={li:"",dt:"dd",dd:"dt",p:"address article aside blockquote details div dl fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 header hgroup hr main menu nav ol pre section table",rt:"rp",rp:"rt",optgroup:"",option:"optgroup",caption:"tbody thead tfoot tr colgroup",colgroup:"thead tbody tfoot tr caption",thead:"tbody tfoot caption",tbody:"tfoot caption",tfoot:"caption",tr:"tbody tfoot",td:"th tr",th:"td tr tbody"};for(let e in U)for(let r of[...U[e].split(" "),e])w.close[e]=w.close[e+r]=!0;"pre textarea".split(" ").map(e=>w.pre[e]=!0);var V=w,Q=Object.freeze(new Set(["accent-color","align-content","align-items","align-self","align-tracks","all","animation","animation-delay","animation-direction","animation-duration","animation-fill-mode","animation-iteration-count","animation-name","animation-play-state","animation-timeline","animation-timing-function","appearance","ascent-override","aspect-ratio","backdrop-filter","backface-visibility","background","background-attachment","background-blend-mode","background-clip","background-color","background-image","background-origin","background-position","background-position-x","background-position-y","background-repeat","background-size","bleed","block-overflow","block-size","border","border-block","border-block-color","border-block-end","border-block-end-color","border-block-end-style","border-block-end-width","border-block-start","border-block-start-color","border-block-start-style","border-block-start-width","border-block-style","border-block-width","border-bottom","border-bottom-color","border-bottom-left-radius","border-bottom-right-radius","border-bottom-style","border-bottom-width","border-collapse","border-color","border-end-end-radius","border-end-start-radius","border-image","border-image-outset","border-image-repeat","border-image-slice","border-image-source","border-image-width","border-inline","border-inline-color","border-inline-end","border-inline-end-color","border-inline-end-style","border-inline-end-width","border-inline-start","border-inline-start-color","border-inline-start-style","border-inline-start-width","border-inline-style","border-inline-width","border-left","border-left-color","border-left-style","border-left-width","border-radius","border-right","border-right-color","border-right-style","border-right-width","border-spacing","border-start-end-radius","border-start-start-radius","border-style","border-top","border-top-color","border-top-left-radius","border-top-right-radius","border-top-style","border-top-width","border-width","bottom","box-decoration-break","box-shadow","box-sizing","break-after","break-before","break-inside","caption-side","caret-color","clear","clip","clip-path","color","color-scheme","column-count","column-fill","column-gap","column-rule","column-rule-color","column-rule-style","column-rule-width","column-span","column-width","columns","contain","content","content-visibility","counter-increment","counter-reset","counter-set","cursor","length","angle","descent-override","direction","display","resolution","empty-cells","fallback","filter","flex","flex-basis","flex-direction","flex-flow","flex-grow","flex-shrink","flex-wrap","flex_value","float","font","font-display","font-family","font-feature-settings","font-kerning","font-language-override","font-optical-sizing","font-size","font-size-adjust","font-stretch","font-style","font-synthesis","font-variant","font-variant-alternates","font-variant-caps","font-variant-east-asian","font-variant-ligatures","font-variant-numeric","font-variant-position","font-variation-settings","font-weight","forced-color-adjust","gap","grid","grid-area","grid-auto-columns","grid-auto-flow","grid-auto-rows","grid-column","grid-column-end","grid-column-start","grid-row","grid-row-end","grid-row-start","grid-template","grid-template-areas","grid-template-columns","grid-template-rows","frequency","hanging-punctuation","height","hyphenate-character","hyphens","image-orientation","image-rendering","image-resolution","inherit","inherits","initial","initial-letter","initial-letter-align","initial-value","inline-size","input-security","inset","inset-block","inset-block-end","inset-block-start","inset-inline","inset-inline-end","inset-inline-start","isolation","justify-content","justify-items","justify-self","justify-tracks","left","letter-spacing","line-break","line-clamp","line-gap-override","line-height","line-height-step","list-style","list-style-image","list-style-position","list-style-type","margin","margin-block","margin-block-end","margin-block-start","margin-bottom","margin-inline","margin-inline-end","margin-inline-start","margin-left","margin-right","margin-top","margin-trim","marks","mask","mask-border","mask-border-mode","mask-border-outset","mask-border-repeat","mask-border-slice","mask-border-source","mask-border-width","mask-clip","mask-composite","mask-image","mask-mode","mask-origin","mask-position","mask-repeat","mask-size","mask-type","masonry-auto-flow","math-style","max-block-size","max-height","max-inline-size","max-lines","max-width","max-zoom","min-block-size","min-height","min-inline-size","min-width","min-zoom","mix-blend-mode","time","negative","object-fit","object-position","offset","offset-anchor","offset-distance","offset-path","offset-position","offset-rotate","opacity","order","orientation","orphans","outline","outline-color","outline-offset","outline-style","outline-width","overflow","overflow-anchor","overflow-block","overflow-clip-margin","overflow-inline","overflow-wrap","overflow-x","overflow-y","overscroll-behavior","overscroll-behavior-block","overscroll-behavior-inline","overscroll-behavior-x","overscroll-behavior-y","Pseudo-classes","Pseudo-elements","pad","padding","padding-block","padding-block-end","padding-block-start","padding-bottom","padding-inline","padding-inline-end","padding-inline-start","padding-left","padding-right","padding-top","page-break-after","page-break-before","page-break-inside","paint-order","perspective","perspective-origin","place-content","place-items","place-self","pointer-events","position","prefix","print-color-adjust","quotes","range","resize","revert","right","rotate","row-gap","ruby-align","ruby-merge","ruby-position","scale","scroll-behavior","scroll-margin","scroll-margin-block","scroll-margin-block-end","scroll-margin-block-start","scroll-margin-bottom","scroll-margin-inline","scroll-margin-inline-end","scroll-margin-inline-start","scroll-margin-left","scroll-margin-right","scroll-margin-top","scroll-padding","scroll-padding-block","scroll-padding-block-end","scroll-padding-block-start","scroll-padding-bottom","scroll-padding-inline","scroll-padding-inline-end","scroll-padding-inline-start","scroll-padding-left","scroll-padding-right","scroll-padding-top","scroll-snap-align","scroll-snap-stop","scroll-snap-type","scrollbar-color","scrollbar-gutter","scrollbar-width","shape-image-threshold","shape-margin","shape-outside","size","size-adjust","speak-as","src","suffix","symbols","syntax","system","tab-size","table-layout","text-align","text-align-last","text-combine-upright","text-decoration","text-decoration-color","text-decoration-line","text-decoration-skip","text-decoration-skip-ink","text-decoration-style","text-decoration-thickness","text-emphasis","text-emphasis-color","text-emphasis-position","text-emphasis-style","text-indent","text-justify","text-orientation","text-overflow","text-rendering","text-shadow","text-size-adjust","text-transform","text-underline-offset","text-underline-position","top","touch-action","transform","transform-box","transform-origin","transform-style","transition","transition-delay","transition-duration","transition-property","transition-timing-function","translate","unicode-bidi","unicode-range","unset","user-select","user-zoom","vertical-align","viewport-fit","visibility","white-space","widows","width","will-change","word-break","word-spacing","word-wrap","writing-mode","z-index","zoom"])),Y=Object.freeze(new Set(["class","style","value","id","contenteditable","href","hidden","autofocus","src","name","accept","accesskey","action","align","alt","async","autocomplete","autoplay","border","charset","checked","cite","cols","colspan","content","controls","coords","data","datetime","default","defer","dir","dirname","disabled","download","draggable","enctype","for","form","formaction","headers","high","hreflang","http","ismap","kind","label","lang","list","loop","low","max","maxlength","media","method","min","multiple","muted","novalidate","open","optimum","pattern","placeholder","poster","preload","readonly","rel","required","reversed","rows","rowspan","sandbox","scope","selected","shape","size","sizes","span","spellcheck","srcdoc","srclang","srcset","start","step","tabindex","target","title","translate","type","usemap","wrap","bgcolor","width","color","height"])),Z=e=>e.startsWith("-")||Q.has(e),B=e=>e.replace(/[a-z]([A-Z])(?=[a-z])/g,r=>`${r[0]}-${r.slice(1).toLowerCase()}`),X=e=>!!e.prototype&&!!e.prototype.constructor.name,P=(e,r)=>{let o=$(e),t={};for(let[n,a]of Object.entries(o))["constructor","prototype","length"].includes(n)||(t[n]={get:()=>e[n]});return Object.defineProperties(r,t),r},b=class e{constructor(r={},o={}){let{middleware:t,errorComponentFactory:n}=o||{};this.components=r||{},this.middleware=t||{},this.errorComponentFactory=n||_,this.html=this.createElement,this.xhtm=V.bind((...a)=>this.createElement(...a))}static debug=!1;static allTags=Symbol.for("allTags");static exclusivelySvgElements=new Set(["svg","animate","animateMotion","animateTransform","circle","clipPath","defs","desc","discard","ellipse","feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feDropShadow","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence","filter","foreignObject","g","hatch","hatchpath","image","line","linearGradient","marker","mask","mesh","meshgradient","meshpatch","meshrow","metadata","mpath","path","pattern","polygon","polyline","radialGradient","rect","set","stop","switch","symbol","text","textPath","tspan","unknown","use","view"]);static randomId=r=>`${r}${Math.random()}`.replace(".","");static appendChildren=function(r,...o){for(let t of o)if(typeof t=="string")r.appendChild(new window.Text(t));else if(t==null)r.appendChild(new window.Text(""));else if(!(t instanceof Object))r.appendChild(new window.Text(`${t}`));else if(t instanceof Node)r.appendChild(t);else if(t instanceof Array)e.appendChildren(r,...t);else if(t instanceof Function)e.appendChildren(r,t());else if(t instanceof Promise){let n=t,a=n.placeholder||document.createElement("div");setTimeout(async()=>a.replaceWith(await n),0),r.appendChild(a)}else t!=null&&t instanceof Object&&r.appendChild(t);return r};static css=function(r,...o){if(typeof r=="string")return r;if(r==null)return"";if(r instanceof Array){let t=r,n=o,a="";for(let c of t)if(a+=c,n.length>0){let l=n.shift();l instanceof Object?a+=v.css(l):a+=`${l}`}return a}else if(r instanceof Object){let t="";for(let[n,a]of Object.entries(r))a!=null&&(t+=`${B(n)}: ${a};`);return t}else return r};static combineClasses=(...r)=>{r=r.filter(t=>t!=null);let o=[];for(let t of r)if(typeof t=="string"&&(t=t.split(" ")),t instanceof Array){t=t.flat(1/0);for(let n of t)o.push(n)}else if(t instanceof Object)for(let[n,a]of Object.entries(t))a&&o.push(n);return o};createElement(...r){if(r[0]instanceof Array)return this.xhtm(...r);{e.debug&&console.debug("args is:",r);for(let i of(this.middleware[e.allTags]||[]).concat(this.middleware[r[0]]||[]))try{r=eachMiddleWare(r)}catch{console.error("[ElementalClass] one of the middleware functions failed:",eachMiddleWare,r)}let[o,t,...n]=r;if(e.debug&&console.debug("key, properties, children is:",o,t,n),this.components[o]instanceof Function&&(o=this.components[o]),o instanceof Function){let i;try{i=X(o)?new o({...t,children:n}):o({...t,children:n})}catch(s){return this.errorComponentFactory({...t,children:n},o,s)}if(i instanceof Promise){let s=i,d=s.placeholder||document.createElement("div");return setTimeout(async()=>d.replaceWith(await s),0),d}else return i}let a=e.exclusivelySvgElements.has(o),c=a?document.createElementNS("http://www.w3.org/2000/svg",o):document.createElement(o),l="";if(t instanceof Object)for(let[i,s]of Object.entries(t)){if(i=="style"){l+=e.css(s);continue}if(i.slice(0,2)=="on"&&s instanceof Function&&c.addEventListener(i.slice(2).toLowerCase(),s),i=="class"){if(s instanceof Array)s=s.join(" ");else if(s instanceof Object){let d="";for(let[m,u]of Object.entries(s))u&&(d+=m);s=d}}if(a){s instanceof Array&&(s=s.join(" ")),c.setAttribute(B(i),s);continue}s!=null&&!(s instanceof Object)&&Y.has(i)&&c.setAttribute(i,s);try{c[i]=s}catch{}Z(i)&&(l+=`;${i}: ${s};`)}return l&&c.setAttribute("style",l),e.appendChildren(c,...n)}}extend(r={},o={}){let{middleware:t,...n}=o||{};return v({...this.components,...r},{middleware:{...this.middleware,...t},...n})}},v=(...e)=>{let r=new b(...e),o=r.createElement.bind(r);return P(b,o),P(r,o),o};P(b,v);function _({children:e,...r},o,t){let n=document.createElement("div"),a=document.createElement("code"),c=document.createElement("div");n.setAttribute("style",`
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
    `),n.innerHTML="I'm sorry, there was an error when loading this part of the page \u{1F641} ";let l;if(typeof o=="string")l=`<${o} />`;else try{l=`<${o.prototype.constructor.name} />`}catch{try{l=`<${o.name} />`}catch{l=`<${o} />`}}let i={};for(let[s,d]of Object.entries(r))try{i[s]=JSON.parse(JSON.stringify(d))}catch{i[s]=`${d}`}return a.innerHTML=`tag: ${l}
properties: ${JSON.stringify(i,0,4)}
error: ${t}`,a.setAttribute("style",`
        padding: 1rem;
        background-color: #161b22;
        color: #789896;
        white-space: pre;
        max-width: 85vw;
        overflow: auto;
    `),n.appendChild(a),c.setAttribute("style",`
        all: unset
        display: flex
        flex-direction: column
        margin-top: 1.3rem
    `),b.appendChildren(c,e),n.appendChild(c),n}try{let e=document.head;Object.defineProperty(document,"head",{set:r=>b.appendChildren(e,...r.childNodes),get:()=>e,writable:!0})}catch{}var ee=b.combineClasses,te=v(),re=b.css,oe=b.allTags,ue={Elemental:v,html:te,css:re,allTags:oe,combineClasses:ee};export{v as Elemental,oe as allTags,ee as combineClasses,re as css,ue as default,te as html};
