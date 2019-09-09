<template>
    <nav class="navbar navbar-default">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="/rest/home" target="_self">首页</a>
            </div>
        </div>
    </nav>
</template>
<style lang="less" scoped>
.navbar {
    position: relative;
    min-height: 50px;
    margin-bottom: 0;
    border: 1px solid transparent;
    &.navbar-default {
        background-color: #28323c;
        border-color: #28323c;
    }
    .navbar-brand {
        float: left;
        padding: 12.5px 0;
        font-size: 18px;
        line-height: 25px;
        height: 50px;
        padding-left: 4px;
        color: #ff8018;
    }
}
</style>