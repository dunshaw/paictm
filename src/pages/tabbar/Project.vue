<template>
  <el-main>
    <el-row>
      <el-col v-for="item in object" :key="item.id" :style="classObject">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" @click.native="goto(item.path)">
          <el-image :src="item.src" fit='scale-down'></el-image>  
          <div style="padding: 14px;">
            <router-link :to="item.path"><span>{{item.name}}</span></router-link>
            <div class="bottom clearfix"></div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
</template>




<script>



export default {
    name: 'Project',
      data(){
        return {
          msg:'Project!',
          object:[
          {'name':'兼容性测试','src':require('../../assets/functions.png'),'path':'/Functions'},
          {'name':'稳定性测试','src':require('../../assets/stability.png'),'path':'/Stability'},
          // {'name':'性能测试','src':require('../../assets/performance.png'),'path':'/Help'}
          {'name':'性能测试','src':require('../../assets/performance.png'),'path':'/Performance'}
          ],
          classObject:{
            'width':'30%',
            'margin-right':'3%',
            'text-align': 'center',
            'cursor':'pointer',
          },
        }
      },
      methods:{
        goto(path){
          this.$router.push(path) 
        }
      },
    };
</script>
<style scoped>

  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }



  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }
  .el-image{
    width: 50%;
    margin: 1em;
    height: 160px;
  }
  span{
    color: red;color: #f35626;
    background-image: -webkit-linear-gradient(92deg,#f35626,#feab3a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;}
</style>