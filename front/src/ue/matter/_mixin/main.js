import Skeleton from '@/ue/matter/_components/Skeleton.vue'

export default {
    components: {
        Skeleton
    },
    data() {
        return {
            loading: true,
            matter: { title: 'loading' },
            user: {}
        }
    },
    mounted() {
        this.$eventHub.$on('main-mounted', () => {
            if (this.fetchApp) this.fetchApp()
        })
        this.$eventHub.$on('main-failed', () => {
            this.loading = false
        })
    }
}