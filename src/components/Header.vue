<template>
    <div id="headers">
      <img src="@/assets/logo.png" style="height:45px;margin:6px;">
      <el-dropdown trigger="click" @command="handleCommand">
        <el-tag type="warning" class="username">{{isLoginName}}<i class="el-icon-caret-bottom el-icon--right"></i></el-tag>
        <el-badge class="item" value="new" :hidden="changed"/>
        <el-dropdown-menu slot="dropdown" style="min-width:90px;">
          <el-dropdown-item class="clearfix" style="font-size:12px;" command="task">
            任务进度
            <el-badge class="mark" :value="tasks" />
          </el-dropdown-item>
          <el-dropdown-item class="clearfix" style="font-size:12px;" command="taskhistory">
            任务历史
          </el-dropdown-item>
          <el-dropdown-item class="clearfix" style="font-size:12px;" command="weditor">
            Weditor
          </el-dropdown-item>
          <el-dropdown-item :command="isLoginName" style="font-size:12px;">
            退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-menu class="el-menu-demo" mode="horizontal">
        <el-menu-item index="1"><router-link to="/Project" class="project">我的工作台</router-link></el-menu-item>
        <el-menu-item index="2"><router-link to="/Help">帮助中心</router-link></el-menu-item>
        <el-menu-item index="3"><router-link to="/Systems">系统管理</router-link></el-menu-item>
        <el-menu-item index="4"><router-link to="/Counts">用户管理</router-link></el-menu-item>
       <!--  <el-popover
          placement="top-start"
          width="80"
          trigger="hover"
          content="点击退出登录！">
          <el-button type="warning" round style="padding:8px 20px;" slot="reference" @click="LogoOut(isLoginName)">{{isLoginName}}</el-button>
        </el-popover> -->
      </el-menu>
      
      <transition enter-active-class="slideInRight" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
        <!-- 任务进度 -->
        <div class="taskList animated" v-if='taskflag'>
          <el-main>
            <el-button type="danger" icon="el-icon-caret-bottom" circle @click="taskflag=false" class="taskbtn" size="mini"></el-button>
            <el-tag><h3 style="text-align:center;margin-bottom:10px;">任务进度</h3></el-tag>
            <el-table :data="tables" style="width: 100%;" :cell-style="isCenter" stripe :header-cell-style="isThead" border>
              <el-table-column type="index" width="50"></el-table-column>
              <el-table-column label="任务名称" prop="task_name" width="150">
              </el-table-column>
              <el-table-column label="创建时间" width="220">
                <template slot-scope="scope">
                  <i class="el-icon-time"></i>
                  <span style="margin-left: 10px">{{ scope.row.date }}</span>
                </template>
              </el-table-column>
              <el-table-column label="任务进度">
                <template slot-scope="scope">
                  <el-progress :text-inside="true" :stroke-width="18" :percentage="scope.row.schedule"></el-progress>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleEdit(scope.row.status,scope.row.id,scope.row.task_name)" :type="scope.row.type" v-if="scope.row.schedule != 100">
                  {{ scope.row.status | condition}}</el-button>
                  <el-button size="mini" @click="handlecheck(scope.row.id,scope.row.task_name)" :type="scope.row.type" v-else="scope.row.schedule != 100">
                  {{ scope.row.status | condition}}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-main>

          <!-- taskdetails任务进度 -->
          <transition enter-active-class="slideInRight" leave-active-class="slideOutRight" :duration='{enter:800, leave: 800}'>
            <div class="animated taskdetails" v-if='detailsflag'>
              <Details :showtaskname="showtaskname" :showtaskid="showtaskid" @transferflag='transferflag'></Details>
            </div>
          </transition>
        </div>
      </transition>
    </div>
</template>

<script>
import {mapState} from 'vuex'
import mydetails from './Details_task'

  export default {
    name: 'headers',
    data() {
      return {
        name:'',
        tasks:'',
        timer:'',
        changed:true,
        taskflag:false,
        detailsflag:false,
        showtaskname:'',
        showtaskid:'',
        tableData: [
        // {
        //   id: '12987122',
        //   task_name:'hrx',
        //   date: '2016-05-04 11:12:48',
        //   schedule:46,
        //   status:'text',
        //   type:''
        // },{
        //   id: '987122',
        //   task_name:'cucule',
        //   date: '2016-05-24 11:12:48',
        //   schedule:16,
        //   status:'exception',
        //   type:'danger'
        // }, {
        //   id: '1823',
        //   task_name:'tencent',
        //   date: '2016-06-14 12:02:48',
        //   schedule:100,
        //   status:'success',
        //   type:'success'
        // }
        ],
      };
    },
    components:{
      Details:mydetails
    },
    mounted() { 
      document.querySelector('.project').click()
      this.showtask()
    },
    beforeDestroy(){
      clearInterval(this.timer)
    },
    computed:mapState({
        isLoginName:state => state.isLoginName,
        isFinishData:state => state.isFinishData,
        runtask () {
          // return this.$store.state.isRunTasks  //监听任务变化
          return this.$store.getters.getRunTasks
        },
        tables() {
          return this.tableData.concat(this.isFinishData)   // 显示数据的处理
        },
    }),
    watch:{
      runtask(newstep,oldstep){
        // console.log('new:'+newstep,'old:'+oldstep)
        let _this =this;
        if(newstep==0){
          this.tasks=''
          console.log('overtask')
          clearInterval(this.timer)
        }else{
          this.tasks=newstep
          if(oldstep==0){
            console.log('gogogo')
            this.timer = setInterval(this.gettaskinfo,5000)
          }
        }
        this.changed=false
        setTimeout(()=>{
          this.changed=true
        },5000)
      }
    },
    methods:{
      showtask(){
        console.log('task',this.$store.state.isRunTasks.length)
        if(this.$store.state.isRunTasks.length==0){
          this.tasks=''
        }else{
          this.tasks=this.$store.state.isRunTasks.length
        }
        
      },
      //css样式
      isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==1){
            return 'font-size:12px;text-align:center;color:#003964;'
          }
          if(columnIndex==2){
            return 'font-size:12px;text-align: center;color:#666;'
          }
          return 'font-size:12px;text-align: center;'
      },
      isThead({row,column,rowIndex,columnIndex}){
          return 'text-align: center;'
      },
      // 登出
      LogoOut(name){
        let _this = this;
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            'name':name
          }
          _this.$axios({
              method:'post',
              url:'/api/users/cancle',
              data:_this.$qs.stringify(data)
          }).then(function (res){
            console.log(res)
            if(res.data.status==200){
              // console.log('logout')
              localStorage.removeItem('usertoken');
              _this.$router.push('/')
              _this.$store.commit('logOut')
            }
          }).catch(function (error) {
              console.log(error)
          })
        }).catch(() =>{
            return false
        })
      },
      // 下拉操作的判断
      handleCommand(command){
        // console.log(command)
        if(command=='task'){
          this.taskflag=true
        }
        else if(command=='taskhistory'){
          console.log('历史记录')
          this.$router.push({
            name:'taskhistorys',
            path:'/TaskHistory',
            query:{
              project_id:'',
              project_name:'',
            }
          })
        }else if(command == 'weditor'){
          console.log(command)
          window.open('http://11.240.100.27:17310', '_blank');
        }
        else{
          this.LogoOut(command)
        }  
      },
      // 获取任务的进度  
      gettaskinfo(){
        // console.log('time')
        let data = this.$store.state.isRunTasks
        console.log('dataid',data)
        let _this = this
        _this.$axios({
            method:'post',
            url:'/api/task/get_total_task_progress',
            data:_this.$qs.stringify({'task_id_list':JSON.stringify(data)})
        }).then(function (res){
          console.log(res)
          console.log('hahahahaha')
          if(res.data.status==200){
            _this.completed(res.data.data)
          }
        }).catch(function (error) {
            console.log(error)
        })
      },
      // 对完成任务的task操作
      completed(data){
        for(let i of data){
          if(i.schedule==100){
            var index = this.$store.state.isRunTasks.findIndex(item=>{
              if(item==i.id){
                return true
              }
            })
            this.$store.commit('isFinishData',i)
            this.$store.commit('isFinishTasks',index)
            data.splice(index,1)
            setTimeout(()=>{
              this.$notify.success('任务'+i.task_name+'已经完成!')
            },3000)
          }
        }
        this.tableData = data
      },
      // 处理操作按钮点击事件
      handleEdit(type,id,name){
        // return this.$message.error("正在开发.!");
        console.log(type,id,name)
        this.detailsflag=true
        this.showtaskname=name
        this.showtaskid=id
      },
      // 跳转已完成历史任务
      handlecheck(id,name){
        console.log(id)
        this.taskflag = false
        this.$router.push({
          path:'/TaskHistory/Details',
          query:{
            task_id:id,
            task_name:name
          }
        })
      },
      transferflag(data){
        this.detailsflag = data
      },
    },
    filters:{
      condition:function(data){
        // console.log(data)
        if(data=='exception'){
          return '失败'
        }
        return '查看'
      },
    },
  };
</script>

<style scoped>
    .logo{
      float: left;
      color: #f35626;
      background-image: -webkit-linear-gradient(92deg,#f35626,#feab3a);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      -webkit-animation: hue 60s infinite linear;
      font-weight: 100;
    }
    .el-menu{
      /*width: 50%;*/
      float: right;
      color: #888;
      /*line-height: 60px;*/
    }
    .el-menu-item{
      margin-right: 15px;
    }
    #headers{
      height: 60px;
      line-height: 60px;
      padding-left: 4%;
      border-bottom:1px solid #eee;
      box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.1);
    }
    .el-dropdown{
      float: right;
      margin-right: 2%;
      width: 100px;
      text-align: center;
    }
    .username{
      cursor: pointer;
      /*font-size: 14px;*/
      width: 100px;
    }
    .demonstration {
      display: block;
      color: #8492a6;
      font-size: 12px;
      margin-bottom: 20px;
    }
    .item {
      position: absolute;
      top: -15px;
      right: 0;
      display: inline;
      height: 0px;
    }
    .taskList{
      width: 100%;
      height:100%;
      overflow-y:auto;
      position: fixed;
      background: #fff;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 990;
      text-align: center;
      
    }
    .demo-table-expand .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
      width: 50%;
    }
    .taskbtn{
      position: absolute;
      right:12%;
      z-index: 998;
    }
    .el-main{
      width:80%;
      /*border:1px solid red;*/
      margin:0 auto;
      margin-top: 2%;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }
    .taskdetails{
      width: 82%;
      min-height: 400px;
      border: 1px solid red;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
      position: fixed;
      left: 9%;
      top: 2%;
      background-color: #fff;
      z-index: 999;
    }
</style>
