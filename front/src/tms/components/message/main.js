import Vue from 'vue'
import Main from './Main.vue'

let MessageConstructor = Vue.extend(Main)
let instance
let instances = []
let seed = 1

const Message = (options = {}) => {
    if (typeof options === 'object')
        if (!options.message || typeof options.message !== 'string')
            options.message = JSON.stringify(options.message)
    else if (typeof options === 'string')
        options = {
            message: options
        }

    let userOnClose = options.onClose
    let id = 'message_' + seed++
    options.onClose = function() {
        Message.close(id, userOnClose)
    }
    // 为了支持单元测试
    if (options.mount && typeof options.mount === 'function') {
        instance = options.mount(Main)
        delete options.mount
        instance.setData(options)
    } else {
        instance = new MessageConstructor({
            data: options
        })

        instance.vm = instance.$mount()
        document.body.appendChild(instance.vm.$el)

        instance.vm.visible = true
        instance.dom = instance.vm.$el
        instance.dom.style.zIndex = 999
    }

    instance.id = id
    instances.push(instance)

    return instance
}

['success', 'warning', 'info', 'error'].forEach(type => {
    Message[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options
            }
        }
        options.type = type
        return Message(options)
    }
})

Message.close = function(id, userOnClose) {
    for (let i = 0, len = instances.length; i < len; i++) {
        if (id === instances[i].id) {
            if (typeof userOnClose === 'function') {
                userOnClose(instances[i])
            }
            instances.splice(i, 1)
            break
        }
    }
}

Message.closeAll = function() {
    for (let i = instances.length - 1; i >= 0; i--) {
        instances[i].close()
    }
}


export default Message