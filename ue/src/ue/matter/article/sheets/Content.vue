<template>
    <div class="content">
        <div class="title">
            <h2>{{matter.title}}</h2>
        </div>
        <div class="attribute">
            <span>{{matter.author}}</span>
            <span class="time" ng-bind="article.modify_at*1000|date:'yy-MM-dd'"></span>
            <span class="read">阅读 {{matter.read_num}}</span>
        </div>
        <div class="summary">{{matter.summary}}</div>
        <div class="headpic" v-if="matter.hide_pic!=='Y'">
            <span>
                <img :src="matter.pic" />
            </span>
        </div>
        <div class="body" v-html="matter.body"></div>
        <div class="url" v-if="matter.url">
            <a :href="matter.url" target="_self">阅读原文</a>
        </div>
        <div class="channels" v-if="matter.channels&&matter.channels.length">
            <button
                class="chanel"
                v-for="c in matter.channels"
                :key="c.id"
                v-on:click="gotoChannel(c)"
                v-once
            >{{c.title}}</button>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        matter: Object
    },
    mounted() {
        this.$tmsOn('shell-loaded', article => {})
    },
    methods: {
        gotoChannel(channel) {}
    }
}
</script>
<style lang="less">
.content {
    img {
        display: block;
        max-width: 100%;
        margin: 5px auto;
    }
}
</style>
<style lang="less" scoped>
.content {
    background-color: #fff;
    padding: 1px 16px;
    .headpic {
        margin: 10px 0;
    }
    .attribute {
        margin-top: 10px;
        margin-bottom: 30px;
        padding: 0;
    }
    .attribute > span {
        margin-right: 15px;
        color: #999;
    }
    .body {
        margin: 12pt 0 30pt 0;
        p {
            margin: 0 0 12pt;
            line-height: 2em;
        }
        .div[wrap='table'] {
            width: 100%;
            overflow-x: auto;
        }
        table {
            width: 100%;
            border: solid 1px #ddd;
            border-top: 0;
            border-left: 0;
            border-collapse: collapse;
            border-spacing: 0;
            position: relative;
            table-layout: fixed;
            text-align: center;

            th,
            td {
                border-left: 1px solid #ddd;
                border-top: 1px solid #ddd;
                padding: 5px;
                empty-cells: show;
            }
        }
    }

    .url {
        margin-top: 20px;
    }
}
</style>