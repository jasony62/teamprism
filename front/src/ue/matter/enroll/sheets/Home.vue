<template>
    <div id="home">
        <div>home</div>
        <div>
            <router-link :to="{name:'repos'}">Go to Repos</router-link>
            <router-link :to="{name:'kanban'}">Go to Kanban</router-link>
        </div>
        <router-view :app="app"></router-view>
    </div>
</template>

<script>
export default {
    name: 'home'
}
</script>