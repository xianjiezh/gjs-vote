// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import axios from 'axios'
import {Rate, Message, Loading, Dialog, Button} from 'element-ui'
import { Lazyload } from 'mint-ui'
import VueAwesomeSwiper from 'vue-awesome-swiper'

import 'swiper/dist/css/swiper.css'
Vue.use(Lazyload)

Vue.config.productionTip = false
window.log = console.log.bind(this)
Vue.use(VueAwesomeSwiper)
Vue.use(Button)
Vue.use(Rate)
Vue.use(Loading)
Vue.use(Dialog)

Vue.prototype.$message = Message
Vue.prototype.$http = axios
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
})
