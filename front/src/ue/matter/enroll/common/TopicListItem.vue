<template>
    <div class="topic">
        <div>{{topic.id}}</div>
        <div>{{topic.label}}</div>
    </div>
</template>

<script>
export default {
    props: { topic: Object }
}
</script>