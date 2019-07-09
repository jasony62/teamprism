<template>
    <div id="enroll">
        <div>记录活动</div>
        <div>
            <button v-on:click="checkEntryRule">第一步：获取活动进入规则，根据进入规则提示用户进行下一步操作</button>
        </div>
    </div>
</template>

<script>
export default {
    name: "enroll",
    methods: {
        checkEntryRule: () => {
            alert("checkEntryRule");
        }
    }
};
</script>

<style>
#enroll {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
