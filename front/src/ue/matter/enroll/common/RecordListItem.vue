<template>
    <div class="record">
        <DynamicScrollerItem
            :item="record"
            :active="active"
            :size-dependencies="[record.label]"
            :data-index="index"
            :data-active="active"
            :title="`Click to change message ${index}`"
            class="message"
            @click.native="alertId(record)"
        >
            <div class="text">
                {{ item.label }}
            </div>
        </DynamicScrollerItem>
    </div>
</template>

<script>
export default {
    props: { record: Object },
    methods: {
        alertId(record) {
            window.alert(record.id);
        }
    }
};
</script>
<style scoped>
.index,
.text {
    flex: 1;
}

.text {
    max-width: 400px;
}
</style>