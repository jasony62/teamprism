<template>
    <div class="cowork" @click="remarkRecord(cowork, $event)">
        <van-cell-group class="record-cell-group">
            <van-cell icon="user-o" :title="cowork.nickname || '隐藏'" class="record-header">
                <van-button type="danger" size="mini" v-if="cowork.agreed==='Y'">推荐</van-button>
            </van-cell>
            <van-cell class="record-content">
                <ui-schemas class="repos-cowork" :schema-rec="cowork" :schema-name="schemas"></ui-schemas>
            </van-cell>
            <van-cell :title="cowork._createAt" class="record-footer">                  
                <span class="record-indicator" v-if="cowork.like_num!='0'" :class="{'like': cowork.like_log[user.uid]}">
                    <van-icon name="thumb-circle-o" tag="span"/>&nbsp;<span v-text="cowork.like_num"></span>
                </span>
                <span class="record-indicator" v-if="cowork.dislike_num!='0'" :class="{'like': cowork.dislike_log[user.uid]}">
                    <van-icon name="thumb-circle-o" tag="span"/>&nbsp;<span v-text="cowork.dislike_num"></span>
                </span>
                <span class="record-indicator" v-if="cowork.remark_num!='0'">
                    <van-icon name="chat-o" tag="span"/>&nbsp;<span v-text="cowork.remark_num"></span>
                </span>
                <span class="record-indicator" v-if="cowork.coworkDataTotal&&cowork.coworkDataTotal!='0'">
                    <van-icon name="envelop-o" tag="span"/>&nbsp;<span v-text="cowork.coworkDataTotal"></span>
                </span>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
import { Icon, Button, Cell, CellGroup} from "vant"
import UiSchemas from "@/ue/matter/enroll/assert/UiSchemas"

export default {
    props: {
        cowork: Object,
        user: Object,
        schemas: Array
    },
    components: {
        [Icon.name]: Icon,
        [Button.name]: Button,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        UiSchemas
    },
    methods: {
        remarkRecord(cowork, event) {
            if(event) event.preventDefault()
            let params, target
            params = this.$route.params
            target = event.target;
            if (target.getAttribute('ng-click') || target.parentNode.getAttribute('ng-click')) return;
            if (/button/i.test(target.tagName) || /button/i.test(target.parentNode.tagName)) return;

            this.$router.push(`/ue/matter/enroll/${params.siteId}/${params.appId}/record/${cowork.enroll_key}/cowork`)
        }
    }
}
</script>