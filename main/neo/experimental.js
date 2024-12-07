import core, { isHooked } from "./hooked_core.js"

// caveats for core:
    // all functions are bound to the element
    // @ is special, by defaults does a .addEventListener()
    //   for @mount @unmount is uses hooks
    // $ is special, it evals the function once and sets the result without the $
    // 

const ExpandingTextBox = ({ value, type, allowHtmlPaste=false, ...other})=>{
    return core.span({
        input: true,
        contenteditable: true,
        inputmode: type || "text",
        whiteSpace: "pre",
        display: "block",
        minHeight: "1.05em",
        minWidth: "1.05em",
        overflow: "auto",
        scrollbarWidth: "none",
        ...other,
        select() {
            this.focus()
            var range, selection
            if (document.body.createTextRange) {
                range = document.body.createTextRange()
                range.moveToElementText(this)
                range.select()
            } else if (window.getSelection) {
                selection = window.getSelection()
                range = document.createRange()
                range.selectNodeContents(this)
                selection.removeAllRanges()
                selection.addRange(range)
            }
        },
        get value() {
            return [...this.childNodes].map(each=>each?.data ?? each?.innerText ?? "").join("")
        },
        set value(newValue) {
            this.innerText = newValue+"\n"
        },
        ["@paste"](eventObject) {
            if (allowHtmlPaste) {
                eventObject.preventDefault()
                document.execCommand("insertText", false, eventObject.clipboardData.getData("text"))
            }
        },
    })
}

const JsonValue = (
    {
        onEdit=(path, newValue)=>0,
        initialValue="null",
        getParentPath=()=>[],
        notify=(message)=>console.log(message),
        root=null,
        parent=null,
        constraints=[],
    }
) => {
    const jsonType = (value)=>{
        value = value.trimStart()
        if (value.startsWith("{")) {
            return "object"
        } else if (value.startsWith("[")) {
            return "array"
        } else if (value.startsWith("\"")) {
            return "string"
        } else if (value.match(/^[0-9\-\.]/)) {
            return "number"
        } else if (value.startsWith("t") || value.startsWith("f")) {
            return "boolean"
        } else if (value == "null") {
            return "null"
        } else {
            return "invalid"
        }
    }
    // 
    // value editors
    // 
        const JsonBoolean = ({ jsonValue })=>core.span({
            jsonValue: jsonValue,
            toggle() {
                console.debug(`this is:`,this)
                if (this.jsonValue.startsWith("t")) {
                    this.jsonValue = "false"
                } else {
                    this.jsonValue = "true"
                }
                this.messageElement.innerHTML = this.jsonValue
                onEdit(getParentPath(), this.jsonValue) 
            },
            inputKeyDown(eventObject) {
                if (eventObject.key == "Tab") {
                    element.focusOnNext(this.$element)
                }
                if (eventObject.key == "Enter" || eventObject.key == " ") {
                    eventObject.preventDefault()
                    this.toggle()
                    this.inputElement.checked = this.jsonValue.startsWith("t")
                }
            },
            ["@click"]() {
                this.toggle()
            },
            ["@focus"]() {
                this.inputElement.focus()
            },
            $inputElement: self=>(
                html`<input
                    type="checkbox"
                    checked=${jsonValue}
                    onchange=${self.toggle}
                    onkeydown=${self.inputKeyDown}
                />`
            ),
            $messageElement: self=>(
                html`<span margin-left="0.3em" margin-right="0.5em">
                    ${self.jsonValue}
                </span>`
            ),
            $children: self=>[
                self.inputElement,
                self.messageElement,
                nullifyButton,
            ],
        })
        
        
        const jsonNumberPattern = /^-?\d+(\.\d+)?([eE]\d+)?$/
        const JsonNumber = ({ jsonValue })=>attachToElement({
            jsonValue: !jsonValue.match(jsonNumberPattern) ? "0" : jsonValue,
            workingValue: jsonValue,
            backspacedOnEmptyCount: 0,
            onBeforeInput(eventObject) {
                // no newlines
                if (eventObject.inputType == "insertParagraph") {
                    eventObject.preventDefault()
                }
                // prevent non-numeric characters from being entered
                if (eventObject?.data && eventObject?.data.match(/[^0-9\.\-eE]/)) {
                    eventObject.preventDefault()
                }
            },
            onPaste(eventObject) {
                eventObject.preventDefault()
                document.execCommand("insertText", false, eventObject.clipboardData.getData("text").replace(/[^0-9\.\-eE]/g, ""))
            },
            onInput(eventObject) {
                this.workingValue = eventObject.target.value
                if (this.workingValue.match(jsonNumberPattern)) {
                    this.jsonValue = this.workingValue
                    onEdit(getParentPath(), this.workingValue)
                } else {
                    this.workingValue = this.workingValue.replace(/[^0-9\.\-eE]/g, "")
                    const isNegative = this.workingValue.startsWith("-")
                    let decimalIndex = this.workingValue.replace(/[^0-9\.]/g, "").indexOf(".")
                    let eIndex = this.workingValue.replace(/[^0-9eE]/g, "").match(/e/i)?.index
                    let simpleNumber = [...this.workingValue.replace(/[^0-9]/g, "")]
                    if (isNegative) {
                        simpleNumber.unshift("-")
                    }
                    if (decimalIndex > -1) {
                        decimalIndex+=isNegative
                        simpleNumber.splice(decimalIndex, 0, ".")
                    }
                    if (eIndex != null && eIndex > -1) {
                        eIndex+=isNegative
                        eIndex+=decimalIndex+1
                        if (eIndex > decimalIndex+1 && eIndex < simpleNumber.length-1) {
                            simpleNumber.splice(eIndex, 0, "e")
                        }
                    }
                    this.jsonValue = simpleNumber.join("")
                }
                if (this.workingValue != "") {
                    this.backspacedOnEmptyCount = 0
                }
            },
            // always make valid on blur
            onBlur() {
                try {
                    JSON.parse(this.workingValue)
                } catch (error) {
                    this.workingValue = this.jsonValue
                    this.inputElement.value = this.jsonValue
                }
            },
            onFocus(eventObject) {
                this.inputElement.select()
            },
            onKeydown(eventObject) {
                if (eventObject.key == "Tab" || eventObject.key == "Enter") {
                    if (element.focusOnNext(this.$element) != "top") {
                        eventObject.preventDefault()
                    }
                }
                if (eventObject.key == "Backspace") {
                    if (this.workingValue == "") {
                        this.backspacedOnEmptyCount++
                        
                        if (this.backspacedOnEmptyCount == 1) {
                            notify("Press backspace one more time to nullify")
                        }
                        if (this.backspacedOnEmptyCount >= 2) {
                            element.nullify()
                        }
                        eventObject.preventDefault()
                    }
                }
            },
            
            $element() {
                this.inputElement = ExpandingTextBox({
                    value: this.workingValue,
                    oninput: this.onInput,
                    onbeforeinput: this.onBeforeInput,
                    onkeydown: this.onKeydown,
                    onblur: this.onBlur,
                    style: `text-align: right;`,
                    onpaste: this.onPaste,
                    allowHtmlPaste: true,
                })
                return html`
                    <div onfocus=${this.onFocus}>
                        ${this.inputElement}
                        ${nullifyButton}
                    </div>
                `
            },
        })
        const JsonString = ({ jsonValue })=>attachToElement({
            jsonValue: jsonValue,
            backspacedOnEmptyCount: 0,
            onBeforeInput(eventObject) {
                // newlines as \n not <br>
                if (eventObject.inputType == "insertParagraph") {
                    eventObject.preventDefault()
                    document.execCommand("insertText", false, "\n")
                }
            },
            onInput(eventObject) {
                this.jsonValue = JSON.stringify(eventObject.target.value)
                if (this.jsonValue != '""') {
                    this.backspacedOnEmptyCount = 0
                }
            },
            onFocus(eventObject) {
                this.inputElement.select()
            },
            onKeydown(eventObject) {
                if (eventObject.key == "Tab") {
                    if (element.focusOnNext(this.$element) != "top") {
                        eventObject.preventDefault()
                    }
                }
                console.debug(`this.jsonValue is:`,this.jsonValue)
                console.debug(`this.jsonValue.length is:`,JSON.parse(this.jsonValue).length)
                if (eventObject.key == "Backspace") {
                    if (this.jsonValue.length == 3) {
                        this.inputElement.value = ""
                        this.jsonValue = '""'
                    } else {
                        if (this.jsonValue == '""') {
                            this.backspacedOnEmptyCount++
                            if (this.backspacedOnEmptyCount == 1) {
                                notify("Press backspace one more time to nullify")
                            }
                            if (this.backspacedOnEmptyCount >= 2) {
                                element.nullify()
                            }
                            eventObject.preventDefault()
                        }
                    }
                }
            },
            
            $element() {
                this.inputElement = ExpandingTextBox({
                    value: JSON.parse(this.jsonValue),
                    oninput: this.onInput,
                    onbeforeinput: this.onBeforeInput,
                    onkeydown: this.onKeydown,
                    style: `text-align: left; margin-right: 1em; max-width: 15rem;`,
                })
                return html`
                    <div onfocus=${this.onFocus}>
                        ${this.inputElement}
                        ${nullifyButton}
                    </div>
                `
            },
        })
        const JsonArray = ({ jsonValue })=>{
            const InsertButton = ({getIndex, style})=>html`
                <button
                    style="
                        transition: all 0.25s ease-in-out 0s;
                        padding: 1px calc(20% + 10px);
                        border: none;
                        border-radius: 1em; 
                        background: var(--green, darkcyan);
                        color: var(--white, white);
                        font-size: 0.8em;
                        width: 70%;
                        height: fit-content;
                        align-self: center;
                        display: flex;
                        justify-content: center;
                        margin-top: 0.5em;
                        margin-bottom: 0;
                        opacity: 0;
                        max-height: 0;
                        margin-button: 0;
                        ${style}
                    "
                    onclick=${()=>{
                        element.insertValue({ 
                            index: getIndex? getIndex():0, 
                            value: null 
                        })
                    }}
                    tabindex="-1"
                    >
                        insert
                </button>
            `
            
            const ItemEntry = ({index, value})=>{
                const arrayObject = element
                const insertedObject = attachToElement({
                    index,
                    removed: false,
                    get value() {
                        return arrayObject.value[this.index]
                    },
                    getParentPath() {
                        return [...getParentPath(), this.index]
                    },
                    onEdit(parentPath, newValue) {
                        arrayObject.value[this.index] = newValue
                        onEdit(getParentPath(), arrayObject.value)
                    },
                    remove() {
                        // prevent multiple removals (fast clicks)
                        if (this.removed) {
                            return
                        }
                        this.removed = true
                        arrayObject.value.splice(this.index, 1)
                        arrayObject.removeChild(this.$element)
                        arrayObject.afterElementChange()
                        // triggers a parent edit
                        onEdit(getParentPath(), arrayObject.value)
                    },
                    attachFocus() {
                        focusOn(this.editorElement)
                    },
                    
                    editorElement: null,
                    removeElement: null,
                    insertButton: null,
                    
                    $element() {
                        return html`<div style="position: relative; display: flex; flex-direction: column; gap: 0em;">
                            <div style="position: relative; display: flex; flex-direction: row; align-items: center;">
                                ${this.removeElement = RemoveButton({
                                    onclick: this.remove,
                                    onkeydown: (e)=>(e.key == "Enter")&&this.remove(),
                                    children: html`X`,
                                })}
                                
                                ${this.editorElement = JsonValue({
                                    onEdit: this.onEdit,
                                    getParentPath: this.getParentPath,
                                    value,
                                    notify,
                                    root,
                                })}
                            </div>
                            
                            ${this.insertButton = InsertButton({
                                getIndex:()=>this.index+1
                            })}
                        </div>`
                    }
                })
                
                addDynamicStyleFlags({
                    element: insertedObject,
                    styleFunc: (element)=>{
                        let show = element.isFocused || element.isHovered
                        insertedObject.insertButton.style.opacity = show ? 1 : 0
                        insertedObject.insertButton.style.maxHeight = show ? "2.1em" : "0"
                        insertedObject.insertButton.style.marginBottom = show ? "0.5em" : "0"
                        insertedObject.removeElement.style.opacity = show ? 1 : 0
                    },
                    flagKeys: {
                        isHovered: [ "mouseover", "mouseout" ],
                        isFocused: [ "focus", "blur" ],
                    }
                })
                
                return insertedObject
            }
            
            const element = attachToElement({
                value: JSON.parse(jsonValue),
                prefixedElementCount: 2,
                get jsonValue() {
                    return JSON.stringify(this.value)
                },
                updateEmptyMessage() {
                    if (this.value.length == 0) {
                        this.emptyMessageElement.innerHTML = "[empty list]"
                    } else {
                        this.emptyMessageElement.innerHTML = ""
                    }
                },
                refreshIndicies() {
                    let elementIndex = 0
                    for (const each of this.$element.children) {
                        if (each.object) {
                            each.object.index = elementIndex++
                        }
                    }
                },
                afterElementChange() {
                    this.refreshIndicies()
                    this.updateEmptyMessage()
                },
                focusOnNext(from) {
                    // FIXME:
                },
                assignTo(list) {
                    let elementIndex = -1
                    for (const each of list) {
                        elementIndex++
                        element.insertValue({ index: elementIndex, value: each })
                    }
                    onEdit(getParentPath(), list)
                    this.afterElementChange()
                },
                insertValue({index, value}) {
                    if (index < 0) {
                        throw Error(`index cannot be negative`)
                    }
                    const insertedObject = ItemEntry({ index, value })
                    
                    // insertion logic
                    if (insertedObject.index >= this.value.length) {
                        insertedObject.index = this.value.length
                        this.value.push(value)
                        this.$element.appendChild(insertedObject)
                    } else {
                        this.value.splice(insertedObject.index+1, 0, value)
                        this.$element.insertBefore(insertedObject, this.$element.children[this.prefixedElementCount+(insertedObject.index)])
                    }
                    this.afterElementChange()
                    
                    insertedObject.attachFocus()
                },
                
                $element() {
                    return html`
                        <div name="list" style="position: relative; display: flex; flex-direction: column; gap: 0em;">
                            ${this.emptyMessageElement = html`<span style="color: var(--gray, gray); width: 100%; text-align: center;"></span>`}
                            ${this.rootInsertButtonElement = InsertButton({ style: `margin-bottom: 0.5em; min-height: fit-content; max-height: fit-content;` })}
                            ${nullifyButton}
                        </div>
                    `
                }
            })
            
            addDynamicStyleFlags({
                element: element,
                styleFunc: (element)=>{
                    let show = element.isFocused || element.isHovered
                    element.rootInsertButtonElement.style.opacity = show ? 1 : 0
                    element.rootInsertButtonElement.style.opacity = show ? 1 : 0
                },
                flagKeys: {
                    isHovered: [ "mouseover", "mouseout" ],
                    isFocused: [ "focus", "blur" ],
                }
            })
            
            // init children
            element.assignTo(element.value)
            
            return element
        }
        const JsonObject = ({ jsonValue })=>attachToElement({ $element() { return html`<span>not implemented</span>` }}) // TODO: needs .focusOnNext(from)
    
    // 
    // value editor 
    // 
    const element = attachToElement({
        isNull: initialValue == "null",
        onEdit,
        getParentPath,
        constraints,
        get root() {
            if (root == null) {
                return this
            } else {
                return root
            }
        },
        get jsonValue() {
            if (this.isNull) {
                return `null`
            } else {
                return this.valueElement.jsonValue
            }
        },
        set jsonValue(newValue) {
            // newValue needs to be a string because we need to handle the start-of-a-number e.g. "-" or "." which is 
            // not a valid value, but is something that can be rendered
            // also some values have multiple forms eg: 1.0 and 1 are the same value but different forms
            if (typeof newValue != "string") {
                throw Error(`jsonValue must be a string (json or partial-json string)`)
            }
            newValue = newValue.trimStart()
            if (newValue.startsWith("{")) {
                this.isNull = false
                this.valueElement = JsonObject({ jsonValue: `{}` })
                this.$element.innerHTML = ""
                this.$element.appendChild(this.valueElement)
            } else if (newValue.startsWith("[")) {
                this.isNull = false
                this.valueElement = JsonArray({ jsonValue: `[]` })
                this.$element.innerHTML = ""
                this.$element.appendChild(this.valueElement)
            } else if (newValue.startsWith("\"")) {
                this.isNull = false
                this.valueElement = JsonString({ jsonValue: '""' })
                this.$element.innerHTML = ""
                this.$element.appendChild(this.valueElement)
            } else if (newValue.match(/^[0-9\-\.]/)) {
                this.isNull = false
                this.valueElement = JsonNumber({ jsonValue: newValue })
                this.$element.innerHTML = ""
                this.$element.appendChild(this.valueElement)
            } else if (newValue.startsWith("t") || newValue.startsWith("f")) {
                console.debug(`newValue.startsWith("t") is:`,newValue.startsWith("t"))
                console.debug(`newValue.startsWith("t") ? "true" : "false" is:`,newValue.startsWith("t") ? "true" : "false")
                this.isNull = false
                this.valueElement = JsonBoolean({ jsonValue: newValue.startsWith("t") ? "true" : "false" })
                this.$element.innerHTML = ""
                this.$element.appendChild(this.valueElement)
            } else if (newValue == "null") {
                this.nullify()
            } else {
                console.warn(`provided with invalid json value: ${JSON.stringify(newValue)}`)
            }
        },
        get isPrimitive() {
            const type = jsonType(this.jsonValue)
            return type != "object" && type != "array"
        },
        nullify() {
            this.isNull = true
            this.$element.innerHTML = "null"
            this.valueElement = null
        },
        onKeydown(eventObject) {
            console.debug(`JsonValue.onKeydown eventObject is:`,eventObject)
            if (this.isNull) {
                let valueWasSet = false
                console.debug(`eventObject.key is:`,eventObject.key)
                if (eventObject.key=="{") {
                    valueWasSet = true
                    this.jsonValue = `{}`
                } else if (eventObject.key=="[") {
                    valueWasSet = true
                    this.jsonValue = `[]`
                } else if (eventObject.key=="\"" || eventObject.key=="'") {
                    valueWasSet = true
                    this.jsonValue = '""'
                    eventObject.preventDefault()
                } else if (eventObject.key.match(/^[0-9\-\.]/)) {
                    valueWasSet = true
                    this.jsonValue = eventObject.key // note: this allows invalid JSON, e.g. "-."
                } else if (eventObject.key == "t" || eventObject.key == "f") {
                    valueWasSet = true
                    this.jsonValue = eventObject.key == "t" ? "true" : "false" 
                }
                if (valueWasSet) {
                    onEdit(getParentPath(), this.jsonValue)
                    focusOn(this.valueElement)
                }
            }
        },
        focusOnNext(from) {
            // top level cant go to next
            if (this.parent == null) {
                return "top"
            }
            // if isPrimitive we have to go up and over (e.g. ask the parent to focus on the next)
            if (this.isPrimitive) {
                this.parent.focusOnNext(this.$element)
            // if not primitive then we will ask the inner element to focus on the next
            } else {
                this.valueElement.focusOnNext(from)
            }
        },
        
        $element() {
            return html`
                <div
                    tabindex="-1"
                    name="JsonEditor"
                    onkeydown=${this.onKeydown}
                    isRoot=${this.isRoot}
                    style=${`
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        gap: 0em;
                        box-shadow: 0 4px 5px 0 rgba(0,0,0,0.10),0 1px 10px 0 rgba(0,0,0,0.08),0 2px 4px -1px rgba(0,0,0,0.24);
                        width: fit-content;
                        border-radius: 1em;
                        padding: 0.5em 1em;
                        background: var(--card-background, white);
                        position: relative;
                        margin: ${this.isRoot?"0.5em":"0"};
                    `}
                    >
                        null
                </div>
            `
        }
    })
    const nullifyButton = NullifyButton({ action: ()=>element.nullify() })
    addDynamicStyleFlags({
        element: element,
        styleFunc: (element)=>{
            let show = element.isFocused || element.isHovered
            nullifyButton.style.opacity = show ? 1 : 0
        },
        flagKeys: {
            isHovered: [ "mouseover", "mouseout" ],
            isFocused: [ "focus", "blur" ],
        },
    })
    
    element.jsonValue = initialValue
    return element
}