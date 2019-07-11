<template>
    <div>
        <!-- 头部 -->
        <myheader></myheader>
        
        <el-main>
          <router-view></router-view>
        </el-main>
        
    </div>

</template>




<script>
import {mapState} from 'vuex'
import headers from '../components/Header'



export default {
    name: 'Home',
      data(){
        return {
          msg:'欢迎来到2020年!',

        }
      },
      components:{
        myheader:headers,
      },
}
</script>
<style scoped>

</style>