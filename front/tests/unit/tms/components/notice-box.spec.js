import Vue from 'vue'
import NoticeBox from '@/tms/components/NoticeBox.vue'
import { mount } from "@vue/test-utils"
import sinon from "sinon"

describe("#components", () => {
    describe("#notice-box.js", () => {
        it('检查error方法渲染结果', (done) => {
            const nbox = new Vue(NoticeBox).$mount()
            const msg = '这是1条错误信息'
            nbox.error(msg)
            Vue.nextTick(() => {
                let regx = new RegExp(`<div.* class=".*error.*".*>${msg}</div>`)
                expect(nbox.$el.innerHTML).toMatch(regx)
                done()
            })
        })
        it('检查info方法渲染结果', (done) => {
            const nbox = new Vue(NoticeBox).$mount()
            const msg = '这是1条提示信息'
            nbox.info(msg)
            Vue.nextTick(() => {
                let regx = new RegExp(`<div.* class=".*info.*".*>${msg}</div>`)
                expect(nbox.$el.innerHTML).toMatch(regx)
                done()
            })
        })
        it('检查confirm方法渲染结果', (done) => {
            const nbox = new Vue(NoticeBox).$mount()
            const msg = '这是1条确认信息'
            nbox.confirm(msg, [{ label: 'btn1', value: 'btn1-value' }])
            Vue.nextTick(() => {
                let regx = new RegExp(`<div.* class=".*confirm.*".*>${msg}</div>`)
                expect(nbox.$el.innerHTML).toMatch(regx)
                regx = new RegExp(`<div class="act"><div><button>btn1</button></div></div>`)
                expect(nbox.$el.innerHTML).toMatch(regx)
                done()
            })
        })
        it('检查doConfirm方法调用', (done) => {
            const spy = sinon.spy(NoticeBox.methods, "doConfirm")
            const wrapper = mount(NoticeBox)
            const msg = '这是1条确认信息'
            wrapper.vm.confirm(msg, [{ label: 'btn1', value: 'btn1-value' }]).then(val => {
                expect(val).toBe('btn1-value')
                done()
            })
            wrapper.find("button").trigger("click")
            sinon.assert.calledOnce(spy)
        })
        it('调用close方法', () => {
            const spy = sinon.spy(NoticeBox, "destroyed")
            const wrapper = mount(NoticeBox)
            wrapper.vm.info('notice')
            wrapper.vm.close()
            sinon.assert.calledOnce(spy)
        })
    })
})