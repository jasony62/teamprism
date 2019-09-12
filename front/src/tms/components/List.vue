<template>
    <div id="tms-list">
        <ul>
            <li v-for="item in items" :key="item.id">
                <slot name="item" :item="item"></slot>
            </li>
            <li v-if="pageInfo.total > items.length">
                <button @click="onload()">加载更多</button>
            </li>
        </ul> 
    </div>
</template>
<script>
export default {
    props: {
        items: Array,
        pageInfo:Object
    },
    data() {
        return {
            loading: false,
            finished: false
        }
    },
    methods: {
        onload() {
            this.$emit("loadmore")
        }
    }
};
</script>
<style >
#tms-list {
    background-color: #ddd;
}
#tms-list ul li {
    margin-bottom: 20px;
}
</style>