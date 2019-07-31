import Vue from "vue"
import VueRouter from "vue-router"

import Repos from './sheets/Repos.vue'
import Cowork from './sheets/Cowork.vue'
const Kanban = () => import('./sheets/Kanban.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/repos', name: 'repos', component: Repos },
    { path: '/cowork', name: 'cowork', component: Cowork },
    { path: '/kanban', name: 'kanban', component: Kanban }
]

const router = new VueRouter({ routes })

export default router