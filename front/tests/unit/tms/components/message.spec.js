import Message from '@/tms/components/message'
import { shallowMount } from "@vue/test-utils"

describe("components", () => {
    describe("tms", () => {
        describe("message", () => {
            it('默认消息', () => {
                let msg = '这是1条消息提示'
                let wrapper = Message({ message: msg, mount: shallowMount })
                let regx = new RegExp(`class=".*message-info.*"`)
                expect(wrapper.html()).toMatch(regx)
                regx = new RegExp(`<p class="message-content">${msg}</p>`)
                expect(wrapper.html()).toMatch(regx)
            })
        })
    })
})