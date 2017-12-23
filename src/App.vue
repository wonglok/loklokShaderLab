<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
html, body {
  height: 100%;
}

#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

header {
  z-index: 100;
  width: 100%;
  position: fixed;
  top: 0px;
  left: 0px;
  margin: 0;
  height: 56px;
  background-color: #35495E;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
}

.taller{
  height: 56px;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
  margin: 0px 10px;

  transform: perspective(100vmax) translate3d(0px, 0px, 2px);
}

.todo{
  color: white;
}
</style>
