// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './store/index.js'
import qs from 'qs'

import ElementUI from 'element-ui'
import { Message, Loading } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'


import '../static/animate.css'


// axios.defaults.timeout =20000
// 添加请求拦截器
axios.interceptors.request.use(config => {
    // 在发送请求之前做些什么
    // 判断是否存在token，如果存在将每个页面header都添加token
    if (localStorage.getItem('usertoken')) {
        config.headers.common['Authentication-Token'] = localStorage.getItem('usertoken')
    }
    // 跳过后台进度的loading显示
    if(config.url != '/api/task/get_total_task_progress' && config.url != '/api/task/get_device_task_progress' && config.url !='/api/task/get_the_task_progress'){
      let loading = Loading.service({
          fullscreen: true,
          text: '拼命加载中...',
          background: 'rgba(0, 0, 0, 0.3)'
      });
    }
    // console.log(config)
return config;
}, error => {
    // 对请求错误做些什么
    console.log("发送失败");

    let loading = Loading.service({});
    loading.close();    //关闭加载前，记得重新定义实例

return Promise.reject(error);
});

let errs = 0;
// http response 拦截器
axios.interceptors.response.use(response => {
  errs = 0;
    // 跳过后台进度的loading显示
    if(response.config.url != '/api/task/get_total_task_progress' && response.config.url != '/api/task/get_device_task_progress' && response.config.url !='/api/task/get_the_task_progress'){
      let loading = Loading.service({});
      loading.close();
    }
    // console.log(response);
    if(response.data.status == 119){
      Message.error({'message':response.data.msg})
      router.push('Login')
      return 
    }  
return response;
},
error => {
    let loading = Loading.service({
      fullscreen: true,
      text: '拼命加载中...',
      background: 'rgba(0, 0, 0, 0.3)'
    });
    console.log(error.response.status)
    if (error.response) {
        loading.close();
        errs+=1
        if(errs>3){store.commit('isEmptyTask')};
        
        switch (error.response.status) {
            case 404:
                Message.error({'message':'系统异常'})
                return
            case 504:
                Message.error({'message':'服务器异常'})
                return
            case 500:
                Message.error({'message':'服务器错误'})
                return
        }
    }
 
    loading.close();
    return Promise.reject(error.response.data)

})





Vue.use(ElementUI);
Vue.prototype.$qs = qs
Vue.prototype.$axios = axios
Vue.config.productionTip = false



axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';




/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
