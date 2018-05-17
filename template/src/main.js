import i18n from '@/plugins/i18n';
import router from '@/plugins/router';
import store from '@/store';
import App from '@/App';
import Vue from 'vue';

/* eslint-disable no-new */
new Vue({
  el: `#app`,
  store,
  i18n,
  router,
  render: h => h(App)
});
