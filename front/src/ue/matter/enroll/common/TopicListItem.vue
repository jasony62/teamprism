<template>
    <div class="topic" @click="gotoTopic(topic, $event)">
        <van-cell-group class="topic-cell-group">
            <van-cell class="topic-header" icon="user-o" :title="topic.nickname || '隐藏'"  :value="topic._createAt"></van-cell>
            <van-cell class="topic-content" :title="topic.title" :label="topic.summary"></van-cell>
        </van-cell-group>
</template>

<script>
import { Icon, Cell, CellGroup} from "vant"

export default {
    props: { 
        topic: Object,
        user: Object
    },
    components: {
        [Icon.name]: Icon,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup
    },
    methods: {
        gotoTopic: function(topic, event) {
            if(event) event.preventDefault()
            let params, target
            params = this.$route.params
            target = event.target;

            this.$router.push(`/ue/matter/enroll/${params.siteId}/${params.appId}/topic/${topic.id}`);
        }
    }
}
</script>