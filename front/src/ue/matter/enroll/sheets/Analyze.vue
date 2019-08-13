<template>
    <div id="analyze">
        <div>Analyze</div>
        <div>
            <router-link :to="{name:'analyze-rank'}">Go to Rank</router-link>
        </div>
        <div>
            <router-link :to="{name:'analyze-kanban'}">Go to Kanban</router-link>
        </div>
        <div>
            <router-view :app="app"></router-view>
        </div>
        <div>
            <hr />
            <primary-nav />
        </div>
    </div>
</template>
<script>
import PrimaryNav from '../common/PrimaryNav'

export default {
    components: { PrimaryNav }
}
</script>