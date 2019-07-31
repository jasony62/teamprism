<template>
    <div class="tms-notice-box">
        <div class="msg" v-bind:class="type">{{msg}}</div>
        <div class="act" v-if="buttons.length">
            <div v-for="btn in buttons" v-bind:key="btn.value">
                <button @click="doConfirm(btn)">{{btn.label}}</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'NoticeBox',
    data: () => {
        return {
            msg: '没有消息',
            type: '',
            buttons: []
        }
    },
    mounted: function() {
        document.body.appendChild(this.$el)
    },
    destroyed: function() {
        document.body.removeChild(this.$el)
    },
    methods: {
        error: function(msg) {
            this.type = 'error'
            this.msg = msg
        },
        warn: function(msg) {
            this.type = 'warning'
            this.msg = msg
        },
        success: function(msg) {
            this.type = 'success'
            this.msg = msg
        },
        info: function(msg) {
            this.type = 'info'
            this.msg = msg
        },
        progress: function(msg) {
            this.msg = msg
        },
        confirm: function(msg, buttons) {
            this.type = 'confirm'
            this.msg = msg
            if (buttons && buttons.length) {
                this.buttons.splice(0, this.buttons.length)
                buttons.forEach(btn => {
                    this.buttons.push(btn)
                })
            }
            return new Promise(resolve => {
                this._confirmResolve = resolve
            })
        },
        doConfirm: function(button) {
            if (this._confirmResolve) this._confirmResolve(button.value)
            this.$destroy()
        },
        close: function() {
            this.$destroy()
        }
    }
}
</script>

<style lang='scss' scoped>
.tms-notice-box {
    position: absolute;
    top: 1px;
    width: 300px;
    left: 50%;
    margin-left: -150px;
    text-align: center;
    word-break: break-all;
}
</style>
