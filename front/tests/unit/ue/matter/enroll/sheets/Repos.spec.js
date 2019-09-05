import ReposVue from "@/ue/matter/enroll/sheets/Repos"
import { shallowMount } from "@vue/test-utils"

describe("ue", () => {
    describe("matter", () => {
        describe("enroll", () => {
            describe("sheets", () => {
                describe("repos.js", () => {
                    it("是否触发点击事件", ()=> {
                        const wrapper = shallowMount(ReposVue, {
                            propsData: {
                                app: {title: '111'},
                                user: {}
                            }
                        });
                        wrapper.findAll(".van-tab").at(1).addClass("van-tab-active");
                        expect(wrapper.vm.changeRouter).toHaveBeenCalledTimes(1);
                    });
                    it("改变后当前路由是否与activeName相匹配", ()=> {

                    })

                })
            })
        })
    })
})
