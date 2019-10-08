<template>
  <nav class="navbar navbar-default">
    <div class="navbar-header">
      <a class="navbar-brand" href="/rest/home" target="_self">首页</a>
    </div>
  </nav>
</template>
<style lang="less" scoped>
.navbar {
  position: relative;
  height: 50px;
  &.navbar-default {
    background-color: #28323c;
  }
  .navbar-brand {
    display: block;
    padding: 12.5px 0;
    font-size: 18px;
    line-height: 25px;
    padding-left: 8px;
    color: #ff8018;
  }
}
</style>