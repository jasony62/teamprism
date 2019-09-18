<template>
    <transition name="message-fade">
        <div
            :class="[
            'message',
            type && !iconClass ? `message-${ type }` : '',
            center ? 'center' : '',
            showClose ? 'closable' : '',
            customClass
          ]"
            v-show="visible"
            @mouseenter="clearTimer"
            @mouseleave="startTimer"
        >
            <i :class="iconClass" v-if="iconClass"></i>
            <i :class="typeClass" v-else></i>
            <slot>
                <p v-if="!dangerouslyUseHTMLString" class="message-content">{{ message }}</p>
                <p v-else v-html="message" class="message-content"></p>
            </slot>
            <button v-if="showClose" class="message-close-btn" @click="close">关闭</button>
        </div>
    </transition>
</template>

<script>
const typeMap = {
    success: 'success',
    info: 'info',
    warning: 'warning',
    error: 'error'
}
export default {
    data() {
        return {
            visible: false,
            message: '',
            duration: 1000,
            type: 'info',
            iconClass: '',
            customClass: '',
            onClose: null,
            showClose: false,
            closed: false,
            timer: null,
            dangerouslyUseHTMLString: false,
            center: false
        }
    },
    computed: {
        typeClass() {
            return this.type && !this.iconClass
                ? `message-icon icon-${typeMap[this.type]}`
                : ''
        }
    },
    watch: {
        closed(newVal) {
            if (newVal) {
                this.visible = false
                this.$el.addEventListener('transitionend', this.destroyElement)
            }
        }
    },
    methods: {
        destroyElement() {
            this.$el.removeEventListener('transitionend', this.destroyElement)
            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
        },
        close() {
            this.closed = true
            if (typeof this.onClose === 'function') {
                this.onClose(this)
            }
        },
        clearTimer() {
            clearTimeout(this.timer)
        },
        startTimer() {
            if (this.duration > 0) {
                this.timer = setTimeout(() => {
                    if (!this.closed) {
                        this.close()
                    }
                }, this.duration)
            }
        },
        keydown(e) {
            if (e.keyCode === 27) {
                // esc关闭消息
                if (!this.closed) {
                    this.close()
                }
            }
        }
    },
    mounted() {
        this.startTimer()
        document.addEventListener('keydown', this.keydown)
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keydown)
    }
}
</script>

<style lang="scss" scope>
.message {
    min-width: 200px;
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px solid #ebeef5;
    position: fixed;
    left: 50%;
    top: 20px;
    transform: translateX(-50%);
    background-color: #edf2f3;
    transition: opacity 0.3s, transform 0.4s;
    overflow: hidden;
    padding: 10px;
    display: flex;
    align-items: center;
}
.message-icon {
    width: 15px;
    height: 15px;
    border-radius: 100%;
    background: #fff;
    display: inline-block;
    margin-right: 10px;
}
.message-success {
    background: #f2f8ec;
    border-color: #e4f2da;
    .message-content {
        color: #7ebe50;
    }
}
.message-error {
    background: #fcf0f0;
    border-color: #f9e3e2;
    .message-content {
        color: #e57470;
    }
}
.message-warning {
    background: #fcf6ed;
    border-color: #f8ecda;
    .message-content {
        color: #dca450;
    }
}
.message-info {
    background: #eef2fb;
    border-color: #ebeef4;
    .message-content {
        color: #919398;
    }
}
.message-fade-enter,
.message-fade-leave-active {
    opacity: 0;
    transform: translate(-50%, -100%);
}
</style>