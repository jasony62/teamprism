import { shallowMount } from "@vue/test-utils"
import GuideVue from "@/ue/matter/enroll/sheets/Guide.vue"
import sinon from "sinon"

describe("ue", () => {
    describe("matter", () => {
        describe("enroll", () => {
            describe("sheets", () => {
                describe("Guide.vue", () => {
                    const spyWxOAuth2 = sinon.spy(GuideVue.methods, "wxOAuth2")
                    const wrapper = shallowMount(GuideVue, { provide: { app: { id: 'anyappid' } } })
                    it("微信网页授权", () => {
                        wrapper.find("#wxOAuth2").trigger("click")
                        sinon.assert.calledOnce(spyWxOAuth2)
                    })
                })
            })
        })
    })
})