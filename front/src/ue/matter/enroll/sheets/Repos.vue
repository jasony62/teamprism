<template>
    <div id="repos">
        <div>{{app.title}}</div>
        <div>Repos</div>
        <div>
            <router-link :to="{name:'repos-record'}">Go to Record</router-link>
        </div>
        <div>
            <router-link :to="{name:'repos-cowork'}">Go to Cowork</router-link>
        </div>
        <div>
            <router-link :to="{name:'repos-remark'}">Go to Remark</router-link>
        </div>
        <div>
            <router-link :to="{name:'repos-topic'}">Go to Topic</router-link>
        </div>
        <hr />
        <div>
            <router-view :app="app" :user="user"></router-view>
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
    components: { PrimaryNav },
    props: ['app', 'user']
}
</script>