<template>
    <skeleton id="article" :site="site" :matter="matter"></skeleton>
</template>
<script>
import mxnShell from '@/ue/matter/_mixin/shell'
import apis from '@/apis/matter/article'

export default {
    mixins: [mxnShell],
    methods: {
        apis() {
            return apis
        }
    }
}
</script>