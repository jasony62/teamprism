<template>
    <div v-if="record" class="rec-data">
        <div v-if="record.recordDir && record.recordDir.length" class="rec-data-dir">
            <span v-for="(dir, key, index) in record.recordDir" :key="key">
                <span v-text="dir"></span><span v-if="key!==record.recordDir.length-1"> / </span>
            </span>
        </div>
        <div v-if="record.data[subject.id]" v-for="subject in subjects" :key="subject.id" class='rec-data-subject'>
            <div class="rec-data-title text-muted" v-bind:class="[schemasLen > 1 ? 'more' : 'one']"><span v-text="subject.title"></span></div>
            <div v-if="subject.type==='file'">
                <div v-for="file in record.data[subject.id]" :key="file.index">
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
                    <a v-else href @click="open(file)" v-text="file.name"></a>
                </div>
            </div>
            <div v-else-if="subject.type==='voice'">
                <div v-for="voice in record.data[subject.id]" :key="voice.index">
                    <audio controls="controls" preload="none">
                        <source :src="voice.url" :type="voice.type" />
                    </audio>
                </div>
            </div>
            <div v-else-if="subject.type==='image'">
                <ul class='list-unstyled'>
                    <li v-for="img in record.data[subject.id].split(',')" :key="img.index"><img :src="img" /></li>
                </ul>
            </div>
            <div v-else-if="subject.type==='score'">
                <div v-for="item in record.data[subject.id]" :key="item.index">
                    <span v-text="item.title"></span>:<span v-text="item.score"></span>;
                </div>
            </div>
            <div v-else-if="subject.type==='multitext' && (!subject.cowork||subject.cowork!=='Y')">
                <span v-for="item in record.data[subject.id]" :key="item.index">
                    <span v-text="item.value"></span><span v-hide="item.index==record.data[subject.id].length-1">;</span>
                </span>
            </div>
            <div v-else-if="subject.type==='multitext' && subject.cowork==='Y'" class="cowork">
                <p v-for="item in record.data[subject.id]" :key="item.index">
                    <span dynamic-html="item.value"></span>
                </p>
            </div>
            <div v-else-if="subject.type==='single'"><span v-text="record.data[subject.id]"></span></div>
            <div v-else-if="subject.type==='multiple'">
                <span v-for="item in record.data[subject.id]" :key="item.index">
                    <span v-text="item"></span><span v-hide="item.index==record.data[subject.id].length-1">,</span>
                </span>
            </div>
            <div v-else-if="subject.type==='longtext'">
                <span v-html="record.data[subject.id]"></span>
            </div>
            <div v-else-if="subject.type==='url'">
                <span v-html="record.data[subject.id]._text"></span>
            </div>
            <div v-else>
                <span v-html="record.data[subject.id]"></span>
            </div>
            <div v-if="subject.supplement&&subject.supplement==='Y'&& record.supplement && record.supplement[subject.id]" class='supplement' v-html="record.supplement[subject.id]"></div>
            <div v-if="record.voteResult && record.voteResult[subject.id]" class='small'>
                <span v-if="record.voteResult[subject.id].state!=='BS'">得票：<span v-text="record.voteResult[subject.id].vote_num"></span></span>
                <button class='van-button van-button--default van-button--mini' v-if="record.voteResult[subject.id].state==='IP'&&record.voteResult[subject.id].vote_at===0" @click="vote(record.voteResult[subject.id], $event)"><span class='van-icon van-icon-play' style="transform:rotate(-90deg)"></span> 投票</button>
                <button class='van-button van-button--default van-button--mini' v-if="record.voteResult[subject.id].state==='IP'&&record.voteResult[subject.id].vote_at!==0" @click="unvote(record.voteResult[subject.id], $event)"><span class='van-icon van-icon-play' style="transform:rotate(90deg)"></span> 撤销投票</button>
            </div>
            <div v-if="subject.showHistoryAtRepos==='Y'">
                <button class='btn btn-sm btn-default' @click="showHistory($event,subject,rec)">查看历史数据</button>
            </div>
        </div>
    </div>
</template>

<script>
import qs from "query-string";
import  tmsSchema  from "@/assets/js/xxt.ui.schema";

export default {
    props: ['rec', 'subjects'],
    computed: {
        record: function() {
            let oRecord = this.rec, oSchemas = this.subjects, oSchamaValue;
            for (let oSchema of oSchemas) {
                if (oRecord.data[oSchema.id]) {
                    oSchamaValue = oRecord.data[oSchema.id];
                    switch (oSchema.type) {
                        case "longtext":
                            oRecord.data[oSchema.id] = tmsSchema.txtSubstitute(oSchamaValue);
                            break;
                        case "url":
                            oRecord.data[oSchema.id]._text = tmsSchema.urlSubstitute(oSchamaValue);
                            break;
                    }
                }
            }
            return oRecord;
        },
        schemasLen: function() {
            let len = this.subjects.length;
            for(let subject of this.subjects){
                if (Object.keys(subject).indexOf('cowork') !== -1 && subject.cowork === 'Y') {
                    len--;
                }
            }
            return len;
        }
    },
    
    methods: {
        showHistory: function(event, oSchema, oRecord) {
            event.stopPropagation();
            event.preventDefault();
            console.log(oSchema, oRecord);
            //(new enlHistory()).show(oSchema, oRecord);
            return;
        },
        open: function(file) {
            let url, appID, data;
            appID = qs.parse(location.search).app;
            data = {
                name: file.name,
                size: file.size,
                url: file.url,
                type: file.type
            };
            url = "/rest/site/fe/matter/enroll/attachment/download?app=" + appID;
            url += "&file=" + JSON.stringify(data);
            window.open(url);
        }
    }
};
</script>

<style lang="scss">
.repos-record.rec-data {
    .rec-data-title.one {
        display: none;
    }

    .rec-data-title.one + div{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .rec-data-title.more {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .rec-data-title.more + div{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
.repos-cowork.rec-data {
    .rec-data-title.one {
        display: none;
    }

    .rec-data-title.one + div{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .rec-data-title.one + div.cowork{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }

    .rec-data-title.more {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
    }

    .rec-data-title.more + div{
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
    }
}
.rec-data {
    cursor: pointer;
    
    &-title:before {
        content: " ";
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
