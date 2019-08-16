<template>
    <div id="repos-topic">
        <div>Repos Topic</div>
        <tms-list :items="topics">
            <template v-slot:item="{ item }">
                <topic-list-item :topic="item"></topic-list-item>
            </template>
        </tms-list>
    </div>
</template>
<script>
import TmsList from '@/tms/components/List.vue'
import TopicListItem from '../../common/TopicListItem'

export default {
    components: { TmsList, TopicListItem },
    data: function() {
        return {
            topics: [{ id: 1, label: 'topic-1' }, { id: 2, label: 'topic-2' }]
        }
    }
}
</script>