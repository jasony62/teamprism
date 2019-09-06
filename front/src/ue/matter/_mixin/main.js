import Shell from '@/ue/matter/_components/Shell.vue'

export default {
    components: {
        Shell
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