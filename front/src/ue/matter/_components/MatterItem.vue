<template>
    <div class="media">
        <div class="media-left">
            <div
                v-if="matter.pic"
                class="media-object"
                v-bind:style="{'background-image':'url('+matter.pic+')'}"
            ></div>
            <div v-if="!matter.pic" class="media-object"></div>
        </div>
        <div class="media-body">
            <div class="media-body-flex">
                <div class="heading" v-once>{{matter.title}}</div>
                <div class="summary" v-once>{{matter.summary}}</div>
                <div class="attr">
                    <div class="put_at">
                        <span v-once>{{matter._createAt}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['matter']
}
</script>
<style lang="less" scoped>
.media {
    .media-left {
        width: 288px;
        height: 162px;
        float: left;
        .media-object {
            width: 100%;
            height: 100%;
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
        }
    }
    .media-body {
        display: table-cell;
        height: 162px;
        width: 1200px;
        padding-left: 16px;
        padding-right: 16px;
        position: relative;
        .media-body-flex {
            position: absolute;
            top: 0;
            right: 8px;
            bottom: 0;
            left: 8px;
            display: flex;
            flex-direction: column;
            .summary {
                flex-grow: 1;
            }
        }
    }
}
@media screen and (max-width: 768px) {
    .media {
        .media-left {
            width: 144px;
            height: 81px;
            padding: 0;
        }
        .media-body {
            height: 81px;
            padding: 0 8px;
            .heading {
                flex-grow: 1;
            }
            .summary {
                display: none;
            }
        }
    }
}
</style>