<template>
    <div class="remark">
        <div>{{remark.id}}</div>
        <div>{{remark.label}}</div>
    </div>
</template>

<script>
export default {
    props: { remark: Object }
}
</script>