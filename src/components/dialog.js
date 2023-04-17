import Vue from 'vue'
const state = Vue.observable({
    active: false,
    cancelText: 'Cancel',
    html: false,
    inputRequired:true,
    inputType: 'text',
    label: '',
    selectContent:[],
    message: '',
    okText: 'Ok',
    title: '',
    type: 'alert',
})

// -----------------------------------
// Private Methods
// -----------------------------------
let close // will hold our promise resolve function
const dialogPromise = () => new Promise((resolve) => (close = resolve))
const open = (message) => {
    state.message = message
    state.active = true
    return dialogPromise()
}
const reset = () => {
    state.active = false
    state.cancelText = 'Cancel'
    state.html = false
    state.selectContent = []
    state.inputRequired = true
    state.inputType = 'text'
    state.label = ''
    state.message = ''
    state.okText = 'Ok'
    state.title = ''
    state.type = 'alert'
}

// -----------------------------------
// Public interface
// -----------------------------------

const dialog = {
    get state() {
        return state
    },
    title(title) {
        state.title = title
        return this
    },
    okText(text) {
        state.okText = text
        return this
    },
    label(text){
        state.label = text
        return this
    },
    cancelText(text) {
        state.cancelText = text
        return this
    },
    inputType(type) {
        state.inputType = type
        return this
    },
    inputRequired(required){
        state.inputRequired = required
        return this
    },
    html(enabled = true) {
        state.html = enabled
        return this
    },
    alert(message) {
        state.type = 'alert'
        return open(message)
    },
    confirm(message) {
        state.type = 'confirm'
        return open(message)
    },
    prompt(message) {
        state.type = 'prompt'
        return open(message)
    },
    cancel() {
        close(false)
        reset()
    },
    ok(input = true) {
        input = state.type === 'prompt' ? input : true
        close(input)
        reset()
    },
    selectContent(content){
        state.selectContent = content
        return this
    }
}

export default dialog