import { shallowMount } from "@vue/test-utils"
import MainVue from "@/ue/matter/enroll/Main.vue"
import Vue from "vue"

describe("ue", () => {
    describe("matter", () => {
        describe("enroll", () => {
            describe("Main.vue", () => {
                const wrapper = shallowMount(MainVue, { stubs: ['router-view', 'router-link'] })
                it("页面首屏内容", () => {
                    return Vue.nextTick().then(function() {
                        expect(wrapper.html()).toContain('这是一个记录活动')
                    })
                })
            })
        })
    })
})