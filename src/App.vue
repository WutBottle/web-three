<style lang="scss">
  body {
    background: #555555;
    overflow: hidden;
  }
</style>

<template>
  <div id="app">
    <WorkPage/>
  </div>
</template>

<script>
  import WorkPage from "./routers/WorkPage";
export default {
  name: 'App',
  components: {
    WorkPage,
  }
}
</script>
