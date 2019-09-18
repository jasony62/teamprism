<template>
    <skeleton id="link" :site="site" :matter="matter"></skeleton>
</template>
<script>
import mxnShell from '@/ue/matter/_mixin/shell'
import apis from '@/apis/matter/link'

export default {
    mixins: [mxnShell],
    methods: {
        apis() {
            return apis
        }
    }
}
</script>