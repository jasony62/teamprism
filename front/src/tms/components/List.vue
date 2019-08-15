<template>
    <div id="tms-list">
        <DynamicScroller
            :items="items"
            :min-item-size="54"
            class="scroller"
        >
            <template v-slot="{ item, index, active }">
                
            </template>
        </DynamicScroller>
    </div>
</template>
<script>
export default {
    props: {
        items: Array
    }
};
</script>
<style scoped>
#tms-list,
.scroller {
    height: 100%;
}

#tms-list {
    overflow: hidden;
}

.message {
    display: flex;
    min-height: 32px;
    padding: 12px;
    box-sizing: border-box;
}

</style>