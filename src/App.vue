<template>
  <div class="root-container" id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style lang="scss" scoped>
.root-container {
  background-color: rgb(255, 226, 145);
  height: 100%;
}
</style>
