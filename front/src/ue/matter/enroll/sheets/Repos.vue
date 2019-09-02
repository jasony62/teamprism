<template>
    <div id="repos">
        <div>{{app.title}}</div>
        <div>Repos</div>
        <van-tabs v-model="activeName" swipeable @change="changeRouter(activeName)">
            <van-tab name="record" title="Go to Record">
                <router-view :app="app" :user="user"></router-view>
            </van-tab>
            <van-tab name="cowork" title="Go to Cowork">
                <router-view :app="app" :user="user"></router-view>
            </van-tab>
            <van-tab name="remark" title="Go to Remark">
                <router-view :app="app" :user="user"></router-view>
            </van-tab>
            <van-tab name="topic" title="Go to topic">
                <router-view :app="app" :user="user"></router-view>
            </van-tab>
        </van-tabs>
        <hr />
        <div>
            <hr />
            <primary-nav />
        </div>
    </div>
</template>
<script>
import PrimaryNav from '../common/PrimaryNav'
import {  Tab, Tabs } from 'vant'
export default {
    components: { 
        [Tab.name]: Tab, 
        [Tabs.name]: Tabs, 
        PrimaryNav 
    },
    props: ['app', 'user'],
    data() {
        return {
            activeName: "cowork"
        }
    },
    methods: {
        changeRouter: function(name) {
            this.$router.push(name);
        }
    }
}
</script>