<template>
    <div id="repos-remark">
        <div>Repos Remark</div>
        <tms-list :items="remarks">
            <template v-slot:item="{ item }">
                <remark-list-item :remark="item"></remark-list-item>
            </template>
        </tms-list>
    </div>
</template>
<script>
import TmsList from '@/tms/components/List.vue'
import RemarkListItem from '../../common/RemarkListItem'

export default {
    components: { TmsList, RemarkListItem },
    data: function() {
        return {
            remarks: [
                { id: 1, label: 'remark-1' },
                { id: 2, label: 'remark-2' }
            ]
        }
    }
}
</script>