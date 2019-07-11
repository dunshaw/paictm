<template>
  <el-main>
    <el-row>
      <el-col v-for="item in object" :key="item.id" :style="classObject">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" @click.native="goto(item.path)">
          <img :src="item.src" />  
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
import {mapState} from 'vuex'


export default {
    name: 'Systems',
      data(){
        return {
          msg:'Systems!',
          object:[
          {'name':'移动设备管理','src':require('../../assets/equipment.png'),'path':'/Equipment'},
          {'name':'执行设备管理','src':require('../../assets/computer.png'),'path':'/Computers'},
          {'name':'工程管理','src':require('../../assets/engineering.png'),'path':'/Engineering'},
          // {'name':'邮箱管理','src':require('../../assets/mailbox.png'),'path':'/Mailbox'},
          {'name':'Appium管理','src':require('../../assets/appium.png'),'path':'/Appium'},
          ],
          classObject:{
            'width':'30%',
            'margin-right':'3%',
            'margin-bottom':'3%',
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
  img{
    /*width: 30%;*/
    margin: 1em;
    height: 100px;
  }
  span{
    color: red;color: #f35626;
    background-image: -webkit-linear-gradient(92deg,#f35626,#feab3a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;}

  .el-row{
    padding: 2em;

  }




</style>