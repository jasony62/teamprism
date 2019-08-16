<template>
    <div id="record">
        <div>Record</div>
        <div>
            <router-link :to="{name:'record-cowork'}">Go to Cowork</router-link>
        </div>
        <div>
            <router-link :to="{name:'record-input'}">Go to Input</router-link>
        </div>
        <div>
            <router-view :app="app"></router-view>
        </div>
    </div>
</template>