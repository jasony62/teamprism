import { shallowMount, config } from "@vue/test-utils"
import MainVue from "@/ue/matter/enroll/Main.vue"
import Vue from "vue"


describe("ue", () => {
    describe("matter", () => {
        describe("enroll", () => {
            describe("Main.vue", () => {
                config.methods['fetchApp'] = () => {}
                const wrapper = shallowMount(MainVue, { stubs: ['router-view', 'router-link'] })
                it("等待加载数据", () => {
                    return Vue.nextTick().then(function() {
                        expect(wrapper.html()).toContain('Loading...')
                    })
                })
            })
        })
    })
})