import { mount, createLocalVue } from "@vue/test-utils"
import VueRouter from "vue-router"
import {  Tab, Tabs } from 'vant'
import Repos from "@/ue/matter/enroll/sheets/Repos.vue"
import ReposRecord from "@/ue/matter/enroll/sheets/repos/Record.vue"
import ReposCowork from "@/ue/matter/enroll/sheets/repos/Cowork.vue"


const localVue = createLocalVue()
localVue.use(VueRouter)

const $route = [
    { path: '/111/222/repos/record', name: 'repos-record', component: ReposRecord },
    { path: '/111/222/repos/cowork', name: 'repos-cowork', component: ReposCowork }
]

describe("ue", () => {
    describe("matter", () => {
        describe("enroll", () => {
            describe("sheets", () => {
                describe("repos.js", () => {
                    const wrapper = mount(Repos, {
                        localVue,
                        mocks:{ $route },
                        stubs: {
                            'tab-component': Tab,
                            'tabs-component': Tabs
                        }
                    })
                    it("渲染子组件",() => {
                        expect(wrapper.vm.$route.path).toBe('ddd')
                        expect(wrapper.find(ReposCowork).exists()).toBe(true)
                    });
                    it("切换路由",() => {
                        
                    });
                })
            })
        })
    })
})
