import Vue from "vue"
import VueRouter from "vue-router"

import Cover from '../_components/Cover.vue'
import Failure from './sheets/Failure.vue'
import Content from './sheets/Content.vue'

Vue.use(VueRouter)

const routes = [
    { path: '/ue/matter/link/:siteId/:appId/cover', name: 'cover', component: Cover, props: true },
    { path: '/ue/matter/link/:siteId/:appId/content', name: 'content', component: Content, props: true },
    { path: '/ue/matter/link/*', name: 'failure', component: Failure, props: true }
]

const router = new VueRouter({ mode: 'history', routes })

export default router