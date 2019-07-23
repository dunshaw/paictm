<template>
  <div>
    <el-button icon="el-icon-d-arrow-right" circle @click="transfer" class="detailsbtn" size="mini"></el-button>
    <el-tag><h3 style="text-align:center;margin-bottom:10px;">{{showtaskname}}{{showtaskid}}</h3></el-tag>

    <el-collapse v-model="activeName" accordion>
      <el-collapse-item v-for="item in devicesdata" :name="item.device_id" :key="item.id">
        <template slot="title">
          <i class="header-icon el-icon-mobile-phone deviceicon"></i>
          <span class="devicename">{{item.device_name}}</span>
          <div style="width:80%;text-align:center;">
          <el-progress :text-inside="true" :stroke-width="18" :percentage="item.progress"></el-progress></div>
        </template>
          <div><span class="nowsetp">{{item.device_type}} : {{item.test_case_name}}</span></div>
          <div>{{item.test_step_name}}</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>


<script>
import {mapState} from 'vuex'

  export default {
    name: 'taskdetails',
    data() {
      return {
        activeName:'',
        devicesdata:[],
        timer:'',
      }
    },
    props: ['showtaskname','showtaskid'],
    created() {
      this.timer = setInterval(this.getdevicedata,3000) 
    },
    computed:mapState({
      isfinish(){return this.$store.state.isFinishData}
    }),
    // 监听完成的任务 ，如果任务已完成，关闭窗口
    watch:{
      isfinish(newdata,olddata){
        for(let i of newdata){
          if(i.id == this.showtaskid){this.transfer()}
        }
      }
    },
    beforeDestroy(){
      clearInterval(this.timer)
    },
    methods:{
      transfer(){
        this.devicesdata = []
        clearInterval(this.timer)
        this.$emit('transferflag',false)
      },
      getdevicedata(){
        console.log('taskdetails')
        let _this = this
        _this.$axios({
            method:'post',
            url:'/api/task/get_the_task_progress',
            data:_this.$qs.stringify({'task_id':_this.showtaskid})
        }).then(function (res){
          console.log(res)
          if(res.data.status==200){
            _this.devicesdata = res.data.data
          }
        }).catch(function (error) {
            console.log(error)
        })
      },
    },
  };

</script>

<style scoped>
  .detailsbtn{
    position: absolute;
    left: 2%;
    margin: 1em;
  }
  .el-collapse{
    margin: 1em;
  }
  .deviceicon{
    margin-left:20px;
  }
  .devicename{
    width: 100px;
    text-align: center;
    color: #034667;
  }
  .nowsetp{
    width: 20%;
    text-align: center;
    color: #ff4500;
  }
</style>