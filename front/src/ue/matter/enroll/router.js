import Vue from "vue"
import VueRouter from "vue-router"

import Guide from './sheets/Guide.vue'
import Repos from './sheets/Repos.vue'
import ReposRecord from './sheets/repos/Record.vue'
import ReposCowork from './sheets/repos/Cowork.vue'
import ReposRemark from './sheets/repos/Remark.vue'
import ReposTopic from './sheets/repos/Topic.vue'
import Record from './sheets/Record.vue'
import RecordInput from './sheets/record/Input.vue'
import RecordResult from './sheets/record/Result.vue'
import RecordCowork from './sheets/record/Cowork.vue'
import Event from './sheets/Event.vue'
import Analyze from './sheets/Analyze.vue'
import Topic from './sheets/Topic.vue'
import Share from './sheets/Share.vue'
import NotFound from './sheets/404.vue'

const AnalyzeRank = () => import('./sheets/analyze/Rank.vue')
const AnalyzeKanban = () => import('./sheets/analyze/Kanban.vue')

Vue.use(VueRouter)

const routes = [
    { path: '/ue/matter/enroll/:siteId/:appId/guide', name: 'guide', component: Guide, props: true },
    {
        path: '/ue/matter/enroll/:siteId/:appId/repos',
        name: 'repos',
        component: Repos,
        children: [
            { path: 'record', name: 'repos-record', component: ReposRecord },
            { path: 'cowork', name: 'repos-cowork', component: ReposCowork },
            { path: 'remark', name: 'repos-remark', component: ReposRemark },
            { path: 'topic', name: 'repos-topic', component: ReposTopic }
        ],
        props: true
    },
    {
        path: '/ue/matter/enroll/:siteId/:appId/record/:ek',
        name: 'record',
        component: Record,
        children: [
            { path: 'input', name: 'record-input', component: RecordInput },
            { path: 'result', name: 'record-result', component: RecordResult },
            { path: 'cowork', name: 'record-cowork', component: RecordCowork }
        ],
        props: true
    },
    { path: '/ue/matter/enroll/:siteId/:appId/event', name: 'event', component: Event },
    {
        path: '/analyze',
        name: 'analyze',
        component: Analyze,
        children: [
            { path: 'rank', name: 'analyze-rank', component: AnalyzeRank },
            { path: 'kanban', name: 'analyze-kanban', component: AnalyzeKanban }
        ],
        props: true
    },
    { path: '/ue/matter/enroll/:siteId/:appId/topic', name: 'topic', component: Topic, props: true },
    { path: '/ue/matter/enroll/:siteId/:appId/share', name: 'share', component: Share, props: true },
    { path: '/ue/matter/enroll/*', name: 'notfound', component: NotFound, props: true }
]

const router = new VueRouter({ mode: 'history', routes })

export default router