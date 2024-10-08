import allTags  from "./all_html_tags.js"

// TODO: add Safari warning (safari doesn't support extending core elements)

// create hooked versions of all builtin html tags
const html = {}
for (const eachTag of allTags) {
    // doesn't work for some reason
    if (eachTag == "svg") {
        continue
    }
    const tagEscaped = JSON.stringify(eachTag)
    eval(`
        html.${eachTag} = class extends (document.createElement(${tagEscaped}).constructor) {
            static tag = ${tagEscaped}+"-"
            constructor() {super()}
            connectedCallback() {this.onMount&&this.onMount()}
            disconnectedCallback() {(typeof this.onUnmount=='function')&&this.onMount()}
            adoptedCallback() {(typeof this.onAdopt=='function')&&this.onAdopt()}
        }
        try {
            customElements.define(html.${eachTag}.tag,html.${eachTag},{extends:${tagEscaped}})
        } catch (error) {
            html.${eachTag}.tag = ${tagEscaped}+"-${Math.random().toString(36).slice(2)}"
            try {
                customElements.define(html.${eachTag}.tag,html.${eachTag},{extends:${tagEscaped}})
            } catch (e) {
                console.error("error creating ${eachTag}")
            }
        }
    `)
}

export default html