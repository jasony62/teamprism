<template>
    <div v-if="rec" class="rec-data">
        <div v-if="rec.recordDir && rec.recordDir.length" class="rec-data-dir"><span v-for="dir in rec.recordDir" :key="dir.index"><span v-text="dir"></span><span v-if="dir.index!==rec.recordDir.length-1"> / </span></span></div>
        <div v-if="rec.data[schema.id]" v-for="schema in schemas" :key="schema.id" class='rec-data-schema' :class="{'cowork':schema.cowork==='Y'}">
            <div class='rec-data-title van-ellipsis'><span v-text="schema.title"></span></div>
            <div v-if="schema.type==='file'">
                <div v-for="file in rec.data[schema.id]" :key="file.index">
                    <video v-if="file.type==='video'" controls="controls" preload="none">
                        <source :src="file.url" :type="file.type" />
                    </video>
                    <audio v-else-if="file.type==='audio'" controls="controls" preload="none">
                        <source :src="file.url" :type="file.type" />
                    </audio>
                    <audio v-else-if="file.type==='audio/x-m4a'" controls="controls" preload="none">
                        <source :src="file.url" :type="file.type" />
                    </audio>
                    <audio v-else-if="file.type==='audio/mp3'" controls="controls" preload="none">
                        <source :src="file.url" :type="file.type" />
                    </audio>
                    <img v-else-if="file.type==='image'" :src="file.url" style="width:40%" />
                    <a v-else href @click="open(file)" :text="file.name"></a>
                </div>
            </div>
            <div v-else-if="schema.type==='voice'">
                <div v-for="voice in rec.data[schema.id]" :key="voice.index">
                    <audio controls="controls" preload="none">
                        <source :src="voice.url" :type="voice.type" />
                    </audio>
                </div>
            </div>
            <div v-else-if="schema.type==='image'">
                <ul class='list-unstyled'>
                    <li v-for="img in rec.data[schema.id].split(',')" :key="img.index"><img :src="img" /></li>
                </ul>
            </div>
            <div v-else-if="schema.type==='score'">
                <div v-for="item in rec.data[schema.id]" :key="item.index">
                    <span :text="item.title"></span>:<span :text="item.score"></span>;
                </div>
            </div>
            <div v-else-if="schema.type==='multitext' && (!schema.cowork||schema.cowork!=='Y')">
                <span v-for="item in rec.data[schema.id]" :key="item.index">
                    <span :text="item.value"></span><span v-hide="item.index==rec.data[schema.id].length-1">;</span>
                </span>
            </div>
            <div v-else-if="schema.type==='multitext' && schema.cowork==='Y'" style="display:block;">
                <p v-for="item in rec.data[schema.id]" :key="item.index">
                    <span dynamic-html="item.value"></span>
                </p>
            </div>
            <div v-else-if="schema.type==='single'"><span :text="rec.data[schema.id]"></span></div>
            <div v-else-if="schema.type==='multiple'" >
                <span v-for="item in rec.data[schema.id]" :key="item.index">
                    <span :text="item"></span><span v-hide="item.index==rec.data[schema.id].length-1">,</span>
                </span>
            </div>
            <div v-else-if="schema.type==='longtext'">
                <span v-html="rec.data[schema.id]"></span>
            </div>
            <div v-else-if="schema.type==='url'">
                <span v-html="rec.data[schema.id]._text"></span>
            </div>
            <div v-else>
                <span v-html="rec.data[schema.id]"></span>
            </div>
            <div v-if="schema.supplement&&schema.supplement==='Y'&& rec.supplement && rec.supplement[schema.id]" class='supplement' v-html="rec.supplement[schema.id]"></div>
            <div v-if="rec.voteResult && rec.voteResult[schema.id]" class='small'>
                <span v-if="rec.voteResult[schema.id].state!=='BS'">得票：<span v-text="rec.voteResult[schema.id].vote_num"></span></span>
                <button class='van-button van-button--default van-button--mini' v-if="rec.voteResult[schema.id].state==='IP'&&rec.voteResult[schema.id].vote_at===0" @click="vote(rec.voteResult[schema.id], $event)"><span class='van-icon van-icon-play' style="transform:rotate(-90deg)"></span> 投票</button>
                <button class='van-button van-button--default van-button--mini' v-if="rec.voteResult[schema.id].state==='IP'&&rec.voteResult[schema.id].vote_at!==0" @click="unvote(rec.voteResult[schema.id], $event)"><span class='van-icon van-icon-play' style="transform:rotate(90deg)"></span> 撤销投票</button>
            </div>
        </div>
    </div>
</template>
<script>
import qs from 'query-string'
export default {
    props:{
        schemas: Array,
        rec: Object
    },
    created() {
        console.log(this.rec);
    },
    methods: {
        open(file) {
            let url, appID, data;
            appID = qs.parse(location.search).app;
            data = {
                name: file.name,
                size: file.size,
                url: file.oUrl,
                type: file.type
            }
            url = '/rest/site/fe/matter/enroll/attachment/download?app=' + appID;
            url += '&file=' + JSON.stringify(data);
            window.open(url);
        }
    }
}
</script>
<style lang="scss">
.rec-data {
    &-title:before {
        content: ' ';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-top: 6px solid #fff;
        border-right: 6px solid #fff;
        border-bottom: 6px solid #fff;
        border-left: 6px solid #ff8018;   
        box-sizing: border-box; 
    }
}
</style>
