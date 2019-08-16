<template>
    <div id="repos-cowork">
        <div>Repos Cowork</div>
        <tms-list :items="coworks">
            <template v-slot:item="{ item }">
                <cowork-list-item :cowork="item"></cowork-list-item>
            </template>
        </tms-list>
    </div>
</template>
<script>
import TmsList from '@/tms/components/List.vue'
import CoworkListItem from '../../common/CoworkListItem'

export default {
    components: { TmsList, CoworkListItem },
    data: function() {
        return {
            coworks: [
                { id: 1, label: 'cowork-1' },
                { id: 2, label: 'cowork-2' }
            ]
        }
    }
}
</script>