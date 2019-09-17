<template>
    <div id="cover">
        <matter-card :matter="matter"></matter-card>
        <div class="entry-rule">
            <div class="group" v-if="entryRule.scope.group==='Y'">{{entryRule.result.group}}</div>
        </div>
    </div>
</template>
<script>
import MatterCard from '@/ue/matter/_components/MatterCard.vue'

export default {
    props: {
        matter: Object
    },
    components: {
        MatterCard
    },
    computed: {
        entryRule: function() {
            if (this.matter && this.matter.entryRule)
                return this.matter.entryRule
            return { scope: {} }
        }
    }
}
</script>
<style lang="less" scoped>
.entry-rule {
    border: 1px solid #ddd;
    padding: 16px;
    background: #fff;
}
</style>