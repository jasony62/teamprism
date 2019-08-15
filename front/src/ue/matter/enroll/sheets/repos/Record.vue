<template>
    <div id="repos-record">
        <div>Repos Record</div>
        <tms-list :items="records">
            <template v-slot:item="{ item }">
                <record-list-item :record="item"></record-list-item>
            </template>
        </tms-list>
    </div>
</template>
<script>
import TmsList from '@/tms/components/List.vue'
import RecordListItem from '../../common/RecordListItem'

export default {
    components: { TmsList, RecordListItem },
    data: function() {
        return {
            records: [
                { id: 1, label: 'record-1' },
                { id: 2, label: 'record-2' },
                { id: 3, label: 'record-3' },
                { id: 4, label: 'record-4' },
                { id: 5, label: 'record-5' },
                { id: 6, label: 'record-6' },
                { id: 7, label: 'record-7' },
            ]
        }
    }
}
</script>