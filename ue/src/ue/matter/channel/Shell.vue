<template>
    <skeleton id="channel" :site="site" :matter="matter"></skeleton>
</template>
<script>
import mxnShell from '@/ue/matter/_mixin/shell'
import apis from '@/apis/matter/channel'

export default {
    mixins: [mxnShell],
    methods: {
        apis() {
            return apis
        }
    }
}
</script>