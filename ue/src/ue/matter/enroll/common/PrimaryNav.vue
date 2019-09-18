<template>
    <div class="primary-nav">
        <div>
            <router-link :to="{name:'repos'}">Go to Repos</router-link>
        </div>
        <div>
            <router-link :to="{name:'event'}">Go to Event</router-link>
        </div>
        <div>
            <router-link :to="{name:'analyze'}">Go to Analyze</router-link>
        </div>
    </div>
</template>
<script>
export default {
    name: 'primary-nav'
}
</script>