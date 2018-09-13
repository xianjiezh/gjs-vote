<template>
  <div id="app">
    <top-logo/>
    <main-container/>
  </div>
</template>

<script>
import TopLogo from './components/TopLogo'
import MainContainer from './components/MainContainer'
export default {
  name: 'App',
  components: {
    TopLogo,
    MainContainer
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #555;
  margin-top: 50px;
}
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}
ul,
li {
  list-style: none;
}
@media screen and (max-width: 435px) {
  .el-dialog {
    width: 70% !important;
  }
}
@media screen and (min-width: 436px) {
  .el-dialog {
    width: 300px !important;
  }
}
</style>
