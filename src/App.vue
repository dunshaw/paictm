<template>
  <div id="app">
    <!-- header 部分 -->

    <!-- main 部分 -->
<!--     <transition>
      <home v-if="isLoginFlag"></home>
    </transition> -->

    <router-view></router-view>

    <!-- footer 部分 -->
  </div>
</template>

<script>
import {mapState} from 'vuex'



export default {
  name: 'app',
  data(){
    return {
      msg:'欢迎来到2020年!',
    }
  },
  created () {
    //在页面加载时读取sessionStorage里的状态信息
    if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign({}, this.$store.state,JSON.parse(sessionStorage.getItem("store"))))
    } 

    //在页面刷新时将vuex里的信息保存到sessionStorage里
    window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
    })
  }
};
</script>

<style>
body{
  font-family:Helvetica,'PingFang SC','Hiragino Sans GB','Microsoft YaHei',SimSun,sans-serif;
  margin:0;
  padding: 0;
}
html,body,div,h1,h2,h3,p,img,input,textarea,a,span,label,i,canvas,ul,li{
  margin: 0;
  padding: 0;
  border: 0;
}
a{
  text-decoration: none;
}


/*隐藏滚动*/
::-webkit-scrollbar {
    display: none;
}
</style>
