<template>
    <div id="tms-list">
        <ul>
            <li v-for="item in items" :key="item.id">
                <slot name="item" :item="item"></slot>
            </li>
        </ul> 
    </div>
</template>
<script>
export default {
    props: {
        items: Array
    },
    data() {
        return {
            loading: false,
            finished: false
        };
    }
};
</script>
<style scoped>
</style>