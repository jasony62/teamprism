<template>
    <div class="cowork">
        <div>{{cowork.id}}</div>
        <div>{{cowork.label}}</div>
    </div>
</template>

<script>
export default {
    props: { cowork: Object }
}
</script>