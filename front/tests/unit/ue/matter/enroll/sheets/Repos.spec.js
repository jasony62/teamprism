import { shallowMount } from "@vue/test-utils"

import ReposVue from "@/ue/matter/enroll/sheets/Repos"

describe("ue", () => {
    describe("matter", () => {
        describe("enroll", () => {
            describe("sheets", () => {
                describe("repos.js", () => {
                    it("点击后，当前路由、activeName是否改变", ()=> {
                        const wrapper = shallowMount(ReposVue);

                        //1、获得点击的按钮
                        //2、触发点击事件
                        //3、断言activeName是否与点击前不一致
                        //4、断言路由是否已改变
                        //5、断言路由是否与activeName相同
                    })

                })
            })
        })
    })
})
