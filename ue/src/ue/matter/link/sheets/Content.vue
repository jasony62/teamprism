<template>
  <div id="content">
    <iframe></iframe>
  </div>
</template>
<script>
export default {
  props: {
    matter: Object
  },
  mounted() {
    this.$tmsOn('shell-loaded', async link => {
      document.querySelector('#content>iframe').setAttribute('src', link.url)
    })
  }
}
</script>
<style lang="less" scoped>
#content {
  height: 100%;
  iframe {
    border: 0;
    width: 100%;
    height: 100%;
  }
}
</style>