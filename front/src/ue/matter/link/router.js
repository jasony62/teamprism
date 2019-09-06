import Vue from "vue"
import VueRouter from "vue-router"

import Guide from './sheets/Guide.vue'
import Failure from './sheets/Failure.vue'
import Content from './sheets/Content.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/ue/matter/link/:siteId/:appId/guide', name: 'guide', component: Guide, props: true },
    { path: '/ue/matter/link/:siteId/:appId/Content', name: 'content', component: Content, props: true },
    { path: '/ue/matter/link/*', name: 'failure', component: Failure, props: true }
]

const router = new VueRouter({ mode: 'history', routes })

export default router