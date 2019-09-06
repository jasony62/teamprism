<template>
    <div class="site">
        <div class="title">
            <img :src="site.heading_pic" class="img-circle" />
            <a v-once>{{site.name}}</a>
        </div>
        <p class="summary" v-once>{{site.summary}}</p>
    </div>
</template>
<script>
export default {
    props: ['site']
}
</script>