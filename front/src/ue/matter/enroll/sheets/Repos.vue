<template>
    <div id="repos">
        <div>{{app.title}}</div>
        <div>Repos</div>
        <van-tabs v-model="activeName" swipeable @change="changeRouter(activeName)">
            <van-tab v-for="tab in tabs" :key="tab" :title="tab.title" :name="tab.value">
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
    props: {
        app: Object,
        user: Object
    },
    data() {
        return {
            tabs: [{
                title: '问题',
                value: 'record'
            },{
                title: '答案',
                value: 'cowork'
            },{
                title: '评论',
                value: 'remark'
            },{
                title: '专题',
                value: 'topic'
            }],
            activeName: "record"
        }
    },
    mounted(){
        this.$router.push(this.activeName)
    },
    methods: {
        changeRouter: function(name) {
            this.$router.push(name);
        }
    }
}
</script>

<style >

</style>