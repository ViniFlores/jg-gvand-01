import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { createProvider } from './vue-apollo'
import vuetify from './plugins/vuetify';
import Toasted from 'vue-toasted';

Vue.config.productionTip = false

Vue.use(Toasted, {
  duration: 3000,
})

new Vue({
  router,
  store,
  apolloProvider: createProvider(),
  vuetify,
  render: h => h(App)
}).$mount('#app')