<template>
    <div class="matter-card panel">
        <div class="panel-body">
            <div class="item">
                <h4>{{matter.title}}</h4>
            </div>
            <div class="item headpic" v-if="matter.hide_pic!=='Y'">
                <span>
                    <img :src="matter.pic" />
                </span>
            </div>
            <div class="item summary">{{matter.summary}}</div>
        </div>
    </div>
</template>
<script>
export default {
    props: ['matter']
}
</script>
<style lang='less' scoped>
.panel {
    border-color: #ddd;
    margin-bottom: 16px;
    .panel-body {
        padding: 16px;
        background: #fff;
        .item {
            margin-bottom: 16px;
            img {
                max-width: 100%;
            }
        }
    }
}
</style>