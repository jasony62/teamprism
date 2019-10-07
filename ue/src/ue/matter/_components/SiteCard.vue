<template>
  <div class="site">
    <div class="title">
      <img :src="site.heading_pic" class="img-circle" />
      <a>{{site.name}}</a>
    </div>
    <p class="summary">{{site.summary}}</p>
  </div>
</template>
<script>
export default {
  props: ['site']
}
</script>
<style lang="less" scoped>
.site {
  position: relative;
  padding: 8px 16px;
  background-color: #fff;
  overflow: hidden;
  margin-bottom: 8px;
  .title {
    display: flex;
    overflow: hidden;
    margin-bottom: 20px;
    img {
      display: inline-block;
      width: 2em;
      height: 2em;
      margin: 0 8px 0 0;
    }
  }
  .summary {
    line-height: 1.7;
    color: #666;
    white-space: normal;
    overflow: hidden;
    word-break: break-all;
  }
}
@media screen and (max-width: 768px) {
  .site {
    .title,
    .summary {
      margin-bottom: 4px;
    }
    .summary {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }
}
</style>