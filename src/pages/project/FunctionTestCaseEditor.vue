<template>
    <div style="">
      <el-header style="height:40px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;float:left">
          <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/Functions' }" >兼容性测试</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/Project/FunctionTestCase',query:{project_id:projectid,project_name:projectname}  }" >{{$route.query.projectname}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{casename}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="codeselect">
          <el-dropdown @command="codechange" trigger="click">
            <span class="el-dropdown-link">
              {{codeLang}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="ruby">ruby</el-dropdown-item>
              <el-dropdown-item command="python">python</el-dropdown-item>
              <el-dropdown-item command="javascript">javascript</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>


      <!-- 侧边栏 -->
      <el-menu class="el-menu-vertical-demo" :collapse="true" >
        <el-menu-item index="1" @click="modelflag('isDevicesFlag',true)">
          <i class="el-icon-mobile-phone iconstyle"></i>
          <span slot="title">设备管理</span>
        </el-menu-item>
        <el-menu-item index="2" @click="modelflag('isParameterFlag',true)">
          <i class="el-icon-news iconcolor" ></i>
          <span slot="title">参数管理</span>
        </el-menu-item>
        <el-menu-item index="3" @click="gotoCommand">
          <i class="el-icon-document iconstyle"></i>
          <span slot="title">命令管理</span>
        </el-menu-item>
        <el-menu-item index="4" @click="testcaseAppium">
          <i class="el-icon-printer iconstyle"></i>
          <span slot="title">Appium管理</span>
        </el-menu-item>
      </el-menu>

      <!-- //操作组件区域 -->
      <el-main>
        <el-row :gutter="5" style='padding:2px;outline: 1px solid #eee;'>
          <el-col :span="12"><div class="box" style="box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1)">
            <Tasklist :projectid="projectid" :caseid="caseid" @transferData='AddData'></Tasklist>
          </div></el-col>
          <el-col :span="12"><div class="box" style="box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.1)">
            <!-- 实现代码 -->
            <el-table :data="showcode" size="small">
              <el-table-column label="!执行代码">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.start" :disabled="true" class='codetitle' size="mini"></el-input>
                  <el-input type="textarea"  placeholder="请输入内容" v-model="scope.row.code" :autosize="{ minRows: 6, maxRows: 10 }"></el-input>
                  <el-input v-model="scope.row.end" :disabled="true" size="mini" style="border-radius:0px;"></el-input>
                  <el-button type="success" round size="mini" style="float:right;margin:5px;" @click="savestepcode(scope.row.command_id)">保存</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div></el-col>
        </el-row>
      </el-main>

      <!-- //模态组件区域  -->
      <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
          <div class="frombg animated" v-if="isDevicesFlag">
            <Devices :projectid="projectid"></Devices> <!-- 手机设备 -->
          </div>

          <div class="frombg animated" v-if="isParameterFlag">
            <Parameter :projectid="projectid"></Parameter> <!-- 设备参数 -->
          </div>

          <div class="frombg animated" v-if="BeforeRunFlag">
            <Runsetup :projectid="projectid" :runid="caseid" :codeLang="codeLang" :runtype="runtypes"></Runsetup> <!-- 运行准备 -->
          </div>
      </transition>
      
        
    </div>

</template>




<script>
import {mapState} from 'vuex'
import tasklist from '../../components/TaskList'
import devices from '../../components/Devices'
import parameter from '../../components/Parameter'
import runsetup from '../../components/Runsetup'


export default {
    name: 'functionTestcaseEdit',
      data(){
        return {
          runtypes:'case',
          codeLangs:['ruby','python','java','javascript'],
          codeLang:'',
          caseid:'',
          casename:'',
          projectid:'',
          projectname:'',
          showcode:[],
          tasktool:'',
        }
      },
      computed:{
        ...mapState({
          isDevicesFlag:state => state.isDevicesFlag,
          isParameterFlag:state => state.isParameterFlag,
          BeforeRunFlag:state => state.BeforeRunFlag,
          isCodeLang :state => state.isCodeLang,
        }),
        StepCodeid () {
          return this.$store.state.isStepCodeid  //监听step变化
        },
      },
      watch:{
        StepCodeid(newstep,oldstep){
          this.getstepcode(newstep)
        }
      },
      created(){
        this.$store.commit('isStepCodeid',0)
        this.getRouterData()
      },
      components:{
        Tasklist:tasklist,
        Devices:devices,
        Parameter:parameter,
        Runsetup:runsetup
      },
      methods: {
        //接收route参数
        getRouterData(){
          this.caseid = this.$route.query.caseid
          this.casename = this.$route.query.casename
          this.projectid = this.$route.query.projectid
          this.projectname = this.$route.query.projectname
          this.codeLang = this.$store.state.isCodeLang
        },
        modelflag(state,flag){
            this.$store.commit(state,flag)
        },
        //跳转测试命令管理页面
        gotoCommand(){
          console.log('跳转测试命令管理页面!',this.projectid)
          this.$router.push({
            name:'commands',
            path:'/CommandsControl',
            query:{
              projectid:this.projectid,
              projectname:this.projectiname,
              task_tool:this.tasktool,
            }
          })
        },
        // 点击appium事件
        testcaseAppium(){
          //路由传参,跳转
          this.$router.push({
            name:'functionappium',
            path:'/Project/FunctionAppium',
            query:{
              project_id:this.projectid,
              project_name:this.projectiname,
            }
          })
        },
        //语言改变事件
        codechange(command){
          // console.log(command);
          this.codeLang=command;
          this.$store.commit('isCodeLang',this.codeLang)
        },

        //获取步骤实现代码
        getstepcode(stepid){
          if(stepid==0){
            return 
          }
          console.log('代码',stepid)
          let _this=this;
          _this.$axios({
            method:'post',
            url:'/api/test_step/get_step_code',
            data:_this.$qs.stringify({'test_step_id':stepid,'code':_this.codeLang}),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.showcode = res.data.code
              return _this.$message.success(res.data.msg)
            }else{
              return _this.$message.error(res.data.msg)
            }
          }).catch(function (error) {
            console.log(error)
          })
        },
        savestepcode(){
          console.log(this.showcode)
          let _this=this;
          _this.$axios({
            method:'post',
            url:'/api/command/code_update',
            data:_this.$qs.stringify(_this.showcode[0]),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              return _this.$message.success(res.data.msg)
            }else{
              return _this.$message.error(res.data.msg)
            }
          }).catch(function (error) {
            console.log(error)
          })
        },
        AddData(tool){
          this.tasktool = tool;
        },
      },

    };
</script>
<style scoped>
.box{
  padding: 10px;
}
.el-main{
  width: 96%;
  margin: 0 auto;
  padding-top: 0;
}

.el-menu-vertical-demo {
    width: 50px;
    text-align: center;
    padding: 0;
}
.el-menu{
  position: fixed;
  left: -10px;
  z-index: 99;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
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
.codetitle{
  height: 30px;
  margin: 0;
}
.codeselect{
  float: right;
  text-align: right;
}
.el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
}
.el-icon-arrow-down {
  font-size: 12px;
}
</style>