<template>
    <div class="record">
        <div>{{record.id}}</div>
        <div>{{record.label}}</div> 
    </div>
</template>

<script>
export default {
    props: { record: Object }
};
</script>
<style scoped>

</style>