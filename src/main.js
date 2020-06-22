import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 导入初始化样式
import './assets/global.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token');
    return config
})
Vue.prototype.$http = axios
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component('tree-table', ZkTable)
    // Vue.prototype.$message = ElementUI
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')