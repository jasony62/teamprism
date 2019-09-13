import Skeleton from '../_components/Skeleton.vue'

export default {
    components: { Skeleton },
    data() {
        return {
            loading: true,
            site: { name: 'loading' },
            matter: { title: 'loading' }
        }
    },
    mounted() {
        this.$eventHub.$on('main-loaded', async () => {
            let apis = this.apis()
            if (apis && apis.skeleton && typeof apis.skeleton === 'function') {
                let matter
                let params = this.$route.params
                try {
                    if (params.appId) {
                        matter = await apis.skeleton(params.appId)
                        this.site = matter.site
                        this.matter = matter
                        this.$eventHub.$emit('shell-loaded', matter)
                    }
                } catch (e) {
                    // 不满足进入规则
                    if (e.code && e.code === 30001) {
                        if (this.$router.currentRoute.name !== 'guide')
                            this.$router.push({ name: 'guide' })
                    } else {
                        this.$message({
                            message: e,
                            type: 'error',
                            duration: 60000,
                            showClose: true
                        })
                    }
                    this.$eventHub.$emit('shell-failed')
                } finally {
                    this.loading = false
                }
            }
        })
        this.$eventHub.$on('main-failed', () => {
            this.loading = false
        })
    }
}