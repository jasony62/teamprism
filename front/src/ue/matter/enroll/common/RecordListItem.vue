<template>
    <div class="record" @click="remarkRecord(record, $event)">
        <van-cell-group class="record-cell-group">
            <van-cell icon="user-o" :title="record.nickname || '隐藏'" class="record-header">
                <van-button type="info" size="mini" v-if="record.favored" @click="favorRecord(record)">已收藏</van-button>
                <van-button type="danger" size="mini" v-if="record.agreed==='Y'">推荐</van-button>
            </van-cell>
            <van-cell class="record-content">
                <ui-schemas class="repos-record" :rec="record" :subjects="schemas"></ui-schemas>
            </van-cell>
            <van-cell :title="record.enroll_at*1000 | formatDate" class="record-footer">                  
                <span class="record-indicator" v-if="record.like_num!='0'" :class="{'like': record.like_log[user.uid]}">
                    <van-icon name="thumb-circle-o" tag="span"/>&nbsp;<span v-text="record.like_num"></span>
                </span>
                <span class="record-indicator" v-if="record.dislike_num!='0'" :class="{'like': record.dislike_log[user.uid]}">
                    <van-icon name="thumb-circle-o" tag="span"/>&nbsp;<span v-text="record.dislike_num"></span>
                </span>
                <span class="record-indicator" v-if="record.remark_num!='0'">
                    <van-icon name="chat-o" tag="span"/>&nbsp;<span v-text="record.remark_num"></span>
                </span>
                <span class="record-indicator" v-if="record.coworkDataTotal&&record.coworkDataTotal!='0'">
                    <van-icon name="envelop-o" tag="span"/>&nbsp;<span v-text="record.coworkDataTotal"></span>
                </span>
                <span class="record-indicator" >
                    <van-icon name="ellipsis" tag="span" />
                </span>
            </van-cell>
            <van-cell class="record-tag" v-if="record.tags||record.userTags">
                <van-button type="info" size="mini" v-for="tag in record.tags" :key="tag.tag_id" @click="shiftTag(tag,true)" :text="tag.label"></van-button>
                <van-button type="default" size="mini" v-for="tag in record.userTags" :key="tag.tag_id" @click="shiftTag(tag,true)" :text="tag.label"></van-button>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
import { Col, Icon, Button, Cell, CellGroup} from "vant"
import UiSchemas from "@/ue/matter/enroll/assert/UiSchemas"

export default {
    props: ['record', 'user', 'schemas'],
    components: {
        [Col.name]: Col,
        [Icon.name]: Icon,
        [Button.name]: Button,
        [Cell.name]: Cell,
        [CellGroup.name]: CellGroup,
        UiSchemas
    },
    filters: {
        formatDate: function(value) {
            let date = new Date(value);
            let y = date.getFullYear();
            let MM = date.getMonth() + 1;
            MM = MM < 10 ? "0" + MM : MM;
            let d = date.getDate();
            d = d < 10 ? "0" + d : d;
            let h = date.getHours();
            h = h < 10 ? "0" + h : h;
            let m = date.getMinutes();
            m = m < 10 ? "0" + m : m;
            let s = date.getSeconds();
            s = s < 10 ? "0" + s : s;
            return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
        }
    },
    methods: {
        remarkRecord(record, event) {
            if(event) event.preventDefault()
            let params, target
            params = this.$route.params
            target = event.target;
            if (target.getAttribute('ng-click') || target.parentNode.getAttribute('ng-click')) return;
            if (/button/i.test(target.tagName) || /button/i.test(target.parentNode.tagName)) return;

            //addToCache();
            this.$router.push({name: 'record-cowork', path: `/ue/matter/enroll/${params.siteId}/${params.appId}/record/${record.enroll_key}/cowork`})
        }
    }
};
</script>

<style lang="scss">
.record {
    &-indicator{
        flex: 1;
        display: inline-block;
        margin-left: 10px;

        &.like {
            color: #ff8018;
        }
    }
}
</style>