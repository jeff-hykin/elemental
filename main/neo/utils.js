/**
 * indent
 *
 * @param arg1.string - the string to indent
 * @param arg1.by - the string to use as a form of indentation (e.g. spaces or tabs)
 * @param arg1.noLead - when true only newlines will be indented, not the first line
 * @returns {String} output
 *
 * @example
 * ```js
 *     indentedString = indent({string: "blah\n    blah\nblah", by: "\t", noLead: false })
 * ```
 */
export const indent = ({ string, by="    ", noLead=false }) => (noLead?"":by) + string.replace(/\n/g, "\n" + by)

const reprSymbol = Symbol.for("representation")
const denoInspectSymbol = Symbol.for("Deno.customInspect")
/**
 * python's repr() for JS
 *
 */
export const toRepresentation = (item, {alreadySeen=new Set()}={})=>{
    const recursionWrapper = (item)=>{
        // prevent infinite recursion
        if (item instanceof Object) {
            if (alreadySeen.has(item)) {
                return `[Self Reference]`
            } else {
                alreadySeen.add(item)
            }
        }
        
        let output
        if (item == null || typeof item == 'function' || typeof item == 'number' || typeof item == 'boolean' || item instanceof RegExp) {
            output = String(item)
        } else if (typeof item == 'string') {
            output = JSON.stringify(item)
        } else if (typeof item == 'symbol') {
            if (!item.description) {
                output = "Symbol()"
            } else {
                const globalVersion = Symbol.for(item.description)
                if (globalVersion == item) {
                    output = `Symbol.for(${JSON.stringify(item.description)})`
                } else {
                    output = `Symbol(${JSON.stringify(item.description)})`
                }
            }
        } else if (item instanceof BigInt) {
            output = `BigInt(${item.toString()})`
        } else if (item instanceof Date) {
            output = `new Date(${item.getTime()})`
        } else if (item instanceof Array) {
            output = `[${item.map(each=>recursionWrapper(each)).join(",")}]`
        } else if (item instanceof Set) {
            output = `new Set([${([...item]).map(each=>recursionWrapper(each)).join(",")}])`
        // pure object
        } else if (item instanceof Object && item.constructor == Object) {
            output = pureObjectRepr(item)
        // map
        } else if (item instanceof Map) {
            let string = "new Map("
            for (const [key, value] of item.entries()) {
                const stringKey = recursionWrapper(key)
                const stringValue = recursionWrapper(value)
                if (!stringKey.match(/\n/g)) {
                    string += `\n  [${stringKey}, ${indent({string:stringValue, by:"  ", noLead:true})}],`
                // multiline key
                } else {
                    string += `\n  [${indent({string:stringKey, by:"  ", noLead:true})},\n  ${indent({string:stringValue, by:"    ", noLead:true})}],`
                }
            }
            string += "\n)"
            output = string
        } else {
            // if custom object has a repr, use it
            if (item[reprSymbol] instanceof Function) {
                try {
                    output = item[reprSymbol]()
                    return output
                } catch (error) {}
            }
            // fallback on inspect methods 
            if (item[denoInspectSymbol] instanceof Function) {
                try {
                    output = item[denoInspectSymbol]()
                    return output
                } catch (error) {}
            }
            
            if (item?.constructor == Error) {
                output = `new Error(${JSON.stringify(item.message)})`
                return output
            }

            // fallback on rendering with prototype as pure object
            try {
                if (item.constructor instanceof Function && typeof item.constructor.name == 'string') {
                    output = `new ${item.constructor.name}(${pureObjectRepr(item)})`
                    return output
                }
            } catch (error) {
                
            }
            console.log(`here4`)
            
            // fallback on rendering with prototype as pure object
            try {
                if (item.constructor instanceof Function && item.prototype && typeof item.name == 'string') {
                    output = `class ${item.name} { /*...*/ }`
                    return output
                }
            } catch (error) {
                
            }
            
            // fallback on toString()
            try {
                output = item.toString()
                if (output !== "[object Object]") {
                    return output
                }
            } catch (error) {}
            
            // absolute fallback on treating as pure item
            return pureObjectRepr(item)
        }
        
        return output
    }
    const pureObjectRepr = (item)=>{
        let string = "{"
        for (const [key, value] of Object.entries(item)) {
            const stringKey = recursionWrapper(key)
            const stringValue = recursionWrapper(value)
            string += `\n  ${stringKey}: ${indent({string:stringValue, by:"  ", noLead:true})},`
        }
        string += "\n}"
        return string
    }
    
    try {
        return recursionWrapper(item)
    } catch (error) {
        return String(item)
    }
}