<template>
  <div>
    <el-header style="height:40px;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/Performance' }">性能测试</el-breadcrumb-item>
        <el-breadcrumb-item>{{$route.query.project_name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main>
      <el-tooltip class="item" effect="dark" content="设备选择" placement="top" >
        <el-button icon="el-icon-mobile" circle size='medium' @click="showtips('isDevicesFlag')" type="primary" style="margin:1rem;"></el-button>
      </el-tooltip>
      <h3 style="text-align:center;margin-bottom:10px;color:#333;"><el-tag size='medium'>{{project_name}}</el-tag></h3>
      <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="160px" size="mini" :label-position="labelPosition">
        <el-form-item label="测试任务对象" >
          <el-input v-model="ruleForm.apk" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="Package名" prop="package">
          <el-input v-model="ruleForm.package"></el-input>
        </el-form-item>
        <el-form-item label="帧率间隔时间(s)" prop="fps" >
          <el-input v-model="ruleForm.fps.value"></el-input>
        </el-form-item>
        <el-form-item label="流量间隔时间(s)" prop="net" >
          <el-input v-model="ruleForm.net.value"></el-input>
        </el-form-item>
        <el-form-item label="电量间隔时间(s)" prop="battery" >          
          <el-input v-model="ruleForm.battery.value" ></el-input>
        </el-form-item>
        <el-form-item label="CPU/内存间隔时间(s)" prop="cpu" >          
          <el-input v-model="ruleForm.cpu.value" ></el-input>
        </el-form-item>
      </el-form>
      <section style="width: 80%;margin: 0 auto;">
        <i class="el-icon-setting">参数设置:</i>
        <el-row :gutter="5" type="flex" class="row-bg" justify="space-around">
          <el-col :span="4"><div class="grid-content bg-purple">
            <span>FPS帧率</span><el-switch v-model="ruleForm.fps.type" active-color="#13ce66" inactive-color="#909399">
            </el-switch>
          </div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple">
            <span>流量</span><el-switch v-model="ruleForm.net.type" active-color="#13ce66" inactive-color="#909399">
            </el-switch>
          </div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple">
            <span>电量</span><el-switch v-model="ruleForm.battery.type" active-color="#13ce66" inactive-color="#909399">
            </el-switch>
          </div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple">
            <span>CPU内存</span><el-switch v-model="ruleForm.cpu.type" active-color="#13ce66" inactive-color="#909399">
            </el-switch>
          </div></el-col>
        </el-row>
      </section>
      <div class="footer">
        <el-button @click="showtips('isTipsFlag')" round type="success" size='small' icon='el-icon-video-play'>开始运行</el-button>
      </div>

      <!-- //模态组件区域  -->
      <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
        <div class="frombg animated" v-if="isDevicesFlag">
          <Devices :projectid="project_id"></Devices> <!-- 手机设备 -->
        </div>

        <div class="frombg animated" v-if="isTipsFlag">
          <Mytips @transferData='submitForm'/>                <!-- 温馨提示 -->
        </div>

        <div class="frombg animated" v-if="running">
          <section class="runbox">                <!-- 正在运行 -->
            <el-header>
              <h3>运行详情</h3>
              <i class="el-icon-close" v-show='!runflag' @click='closerunbox'></i>
            </el-header>
            <div>
              <span>{{project_name}} 性能测试</span>
              <el-button @click="stoprun()" round type="warning" size='mini' v-show="runflag">关闭运行<i class="el-icon-switch-button el-icon--right" ></i></el-button>
              <el-button @click="gotoreport()" round type="success" size='mini' v-show="!runflag">查看报告<i class="el-icon-notebook-2 el-icon--right" ></i></el-button>  
            </div> 
          </section>
        </div>
      </transition>
    </el-main>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import devices from '../../components/Devices'
import Mytips from '../../components/Testtips'

export default {
  name: 'performanceedit',
  data() {
    return {
      labelPosition:'left',
      taskid:'',
      taskname:'',
      running:false,
      runflag:true,
      project_id:'',
      project_name:'',
      ruleForm: {
        project_id:'',
        task_type:'performance',
        user_name:'',
        apk:'',
        package:'',
        net:{'value':'1','type':false},
        cpu:{'value':'1','type':false},
        fps:{'value':'1','type':false},
        battery:{'value':'1','type':false},
      },
      rules: {
        package: [
          { required: true, message: '请输入Package名', trigger: 'blur' },
        ],
        net: [
          { required: false, message: '请输入流量间隔时间', trigger: 'blur' },
        ],
        cpu: [
          { required: false, message: '请输入CPU/内存间隔时间', trigger: 'blur' },
        ],
        fps: [
          { required: false, message: '请输入帧率间隔时间', trigger: 'blur' },
        ],
        battery: [
          { required: false, message: '请输入电量间隔时间', trigger: 'blur' },
        ],
      },
    }
  },
  mounted(){
    this.getPerData()
  },
  computed:{
    ...mapState({
      isDevicesFlag:state => state.isDevicesFlag,
      isTipsFlag:state => state.isTipsFlag
    })
  },
  components:{
    Devices:devices,
    Mytips,
  },
  methods: {
    // 获取性能测试数据
    getPerData(){
      this.project_id= this.$route.query.project_id
      this.ruleForm.project_id= this.$route.query.project_id
      this.project_name = this.$route.query.project_name
      this.ruleForm.apk = this.$route.query.project_apk
      this.ruleForm.user_name= this.$store.state.isLoginName
      // let _this=this;
      // _this.$axios({
      //   method:'post',
      //   url:'/api/',
      //   data:_this.$qs.stringify({})
      // }).then(function (res){
      //   console.log(res);
      //   if(res.data.status===200){
          
      //   }
      // })
    },
    submitForm(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let devices = this.$store.state.isDevicesData
          if(devices.length == 0){
            return this.$message.error('请选择测试设备!'); 
          }
          this.ruleForm['devices']=JSON.stringify(devices)
          console.log(this.ruleForm);
          let _this=this;
          _this.$axios({
            method:'post',
            url:'/api/performance/performance_start',
            data:_this.$qs.stringify(_this.ruleForm)
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.running=true
              _this.taskid=res.data.task_id
              _this.taskname = res.data.task_name
              return _this.$message.success(res.data.msg); 
            }
            return _this.$message.error(res.data.msg); 
          })
        } else {
          return this.$message.error('请填写红色部分信息!'); 
        }
      });
    },
    stoprun(){
      let _this=this;
      _this.$axios({
        method:'post',
        url:'/api/performance/performance_stop',
        data:_this.$qs.stringify({task_id:_this.taskid})
      }).then(function (res){
        console.log(res);
        if(res.data.status==200){
          _this.runflag=false
          return _this.$message.success(res.data.msg); 
        }
        return _this.$message.error(res.data.msg); 
      })
    },
    showtips(tip){
      this.$store.commit(tip,true)
    },
    // 查看结果
    gotoreport(){
      this.closerunbox()
      this.$router.push({
        path:'/TaskHistory/Details',
        query:{
          task_id:this.taskid,
          task_name:this.taskname
        }
      })
    },
    closerunbox(){
      this.running = false;
      this.runflag = true;
    },
  }
};
</script>

<style scoped lang="scss">
.el-main{
  border-radius: 4px;
  width:90%;
  margin:0 auto;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding:2em;
  margin-bottom: 2rem;
  .el-form{
    width: 80%;
    margin: 0 auto;
    padding:1rem;
    .el-form-item{
      display: inline-block;
      width: 45%;
      margin: 1rem;
    }
  }
  section>>>i{
    font-size: 14px;
    color: #e6a23c;
    font-weight: bold;
  }
}
.footer{
  text-align: center;
}
.frombg{
  background-color: rgba(0,0,0,.5);
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index:99;
}
.el-row {
  margin:20px;
  span{
    color: #666;
    font-size: 14px;
    margin:0.5rem;
  }
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.runbox{
  width: 50%;
  background: #fff;
  border-radius:4px;
  margin: 0 auto;
  margin-top: 5%;
  .el-header{
    height: 50px !important;
    line-height: 50px;
    background: rgb(112,185,229);
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    text-align: center;
    color: #fff;
    h3{
      display: inline-block;
    }
    i{
      float: right;
      line-height: 50px;
      cursor: pointer;
    }
  }
  div{
    font-size: 16px;
    text-align: center;
    padding: 2rem;
    span{
      margin: 2em;
      font-size: #999;
    }
  }
}
</style>