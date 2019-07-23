<template>
    <div>
      <el-header style="height:40px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
          <el-breadcrumb-item >兼容性测试</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <!-- tab -->
      <el-tabs type="border-card" @tab-click="handleClick">
        <el-tab-pane v-for="item in titles" :label="item.name" :key="item.id">
         <el-table :data="table" style="width: 100%" :show-header="false" size="small" :cell-style="isCenter" stripe>
          <el-table-column :cell-style="isCenter" width="400">
            <template slot-scope="scope">
              <i class="el-icon-mobile-phone"></i>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column >
          <el-table-column >
            <template slot-scope="scope">
              <el-button size="mini" type="warning" plain @click="testcaseEdit(scope.row.id,scope.row.name)">用例</el-button>
              <el-button size="mini" type="warning" plain @click="testsuiteEdit(scope.row.id,scope.row.name)">用例集</el-button>
              <el-button size="mini" type="primary" plain @click="testcaseAppium(scope.row.id,scope.row.name,scope.row.task_tool,scope.row.appPackage)">{{scope.row.task_tool | condition}}</el-button>
              <el-button size="mini" type="primary" plain @click="gotoCommand(scope.row.id,scope.row.name,scope.row.task_tool)">命令</el-button>
              <el-button size="mini" type="success" plain @click="projectEdit(scope.$index, scope.row.id)">工程</el-button>
              <el-button size="mini" type="success" plain @click="projectCopy(scope.$index, scope.row.id)">复制</el-button>
              <el-button size="mini" type="info" plain @click="taskhistory(scope.row.name, scope.row.id)">任务历史</el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-tab-pane>
      </el-tabs>  

      <!-- button -->
      <el-main style="margin:1em;padding:0;text-align:center;">
          <el-button size="small" type="primary" icon="el-icon-circle-plus-outline" round @click="showForm()">新增工程</el-button>
          <el-upload
            class="upload-demo"
            action="/api/apk/apk_upload"
            :headers='uploadheaders'
            :before-upload='beforeUpload'
            :before-remove="beforeRemove"
            :on-success="UploadSuccess"
            :on-error="UploadError"
            :limit="1"
            :file-list="fileList">
            <el-button size="small" type="primary" icon="el-icon-upload" round>上传APK</el-button>
          </el-upload>
      </el-main>
      
      <!-- 新增工程表单 -->
      <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
        <div class="frombg animated" v-if="isFromFlag">
          <projectform @transferData='AddData' :showtypes='funtion'></projectform>
        </div>
      </transition>
      <el-dialog
        title="AppPackage"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
        <el-input v-model="appPackage" placeholder="请输入appPackage"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="SaveappPackage">确 定</el-button>
        </span>
      </el-dialog>
       



    </div>
</template>




<script>
import {mapState} from 'vuex'
import projectform from '../../components/Project_from'


export default {
    name: 'Functions',
      data(){
        return {
          false:'false',
          fileList:[],
          funtion:true,
          titles:[{'name':'Android工程'},{'name':'Ios工程'}],
          showtable:'',
          tableData: [],
          uploadheaders:{ },
          centerDialogVisible:false,
          appPackage:'',
          showAppId:'',
        }
      },
      computed:{
        ...mapState({
          isFromFlag:state => state.isFromFlag,
        }),
        table() {
          let _this = this;
          if (_this.showtable) {
            return this.tableData.filter(item=>{
                if(item.system_type.toLowerCase()==_this.showtable){
                    return item
                }
            });
          }
          return this.tableData 
        },
      },
      mounted(){
        this.showtable='android'
        this.getfunction()
        this.uploadheaders['Authentication-Token'] = this.$store.state.isToken
      },
      components:{
        projectform:projectform,
      },
      methods: {
        //样式
        isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==0){
            return 'font-weight: bold;color:#999;padding-left:20px;'
          }else{
            return 'text-align: center;'
          }
        },
        // 获取数据
        getfunction(){
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/project/select_all',
              data:_this.$qs.stringify({'user_name':_this.$store.state.isLoginName}),
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                  _this.tableData = res.data.data
              }else{
                return this.$message.error(res.data.msg)
              }
          }).catch(function (error) {
              console.log(error)
          })
        },
        // tab事件
        handleClick(tab, event) {
          let _this=this
          _this.$store.commit('isDevicesData',[])
          if(tab.index==0){
            _this.showtable='android'
          }else{
            _this.showtable='ios'
          }
        },
        // from显示控制
        showForm(){
          this.$store.commit('isFromFlag',true)
        },
        // 新增project
        AddData(data){
          let _this=this;
          _this.tableData.push(data)
        },
        // 工程任务历史
        taskhistory(name, id) {
          // return this.$message.error('sorry,功能正在开发!')  
          // console.log(name, id);
          this.$router.push({
            name:'taskhistorys',
            path:'/TaskHistory',
            query:{
              project_id:id,
              project_name:name,
            }
          })
        },
        //工程配置事件
        projectEdit(index,id){
          // console.log(index,id)
          this.$store.commit('isFromData',id)
          this.$store.commit('isFromShow',false)
          this.showForm()
        },
        //复制事件
        projectCopy(index,id){
          // console.log(index,id)
          this.$prompt('请输入新的工程名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '工程名不能为空！'
          }).then(({ value }) => {
              let data = {'id':id,'newname':value}
              // console.log(data)
              let _this=this;
              _this.$axios({
                method:'post',
                url:'/api/project/copy_project',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  _this.getfunction()
                  return _this.$message.success(res.data.msg)
                }else{
                  return _this.$message.error(res.data.msg)
                }
              })
          }).catch(() => {
            return this.$message.info('取消复制')     
          })
        },
        //跳转测试命令管理页面
        gotoCommand(id,name,tool){
          this.$router.push({
            name:'commands',
            path:'/CommandsControl',
            query:{
              projectid:id,
              projectname:name,
              task_tool:tool,
            }
          })
        },

        // 点击用例事件
        testcaseEdit(id,name){
          console.log(id,name)
          //路由传参,跳转
          this.$router.push({
            name:'functiontestcase',
            path:'/Project/FunctionTestCase',
            query:{
              project_id:id,
              project_name:name,
            }
          })
        },

        // 用例集事件
        testsuiteEdit(id,name){
          console.log(id,name)
          //路由传参,跳转
          this.$router.push({
            name:'functiontestsuite',
            path:'/Project/FunctionTestSuite',
            query:{
              project_id:id,
              project_name:name,
            }
          })
        },
        
        // 点击appium事件
        testcaseAppium(id,name,type,app){
          // return console.log(id,name,type,app)
          let _this = this;
          if(type=='behave'){
            _this.appPackage = app;
            _this.showAppId = id;
            _this.centerDialogVisible = true;
          }else{
            //路由传参,跳转
            this.$router.push({
              name:'functionappium',
              path:'/Project/FunctionAppium',
              query:{
                project_id:id,
                project_name:name,
              }
            })
          }
          
        },
        SaveappPackage(){
          console.log(this.showAppId,this.appPackage);
          let data = {'project_id':this.showAppId,'appPackage':this.appPackage,"loginName":this.$store.state.isLoginName};
          let _this=this;
          _this.$axios({
            method:'post',
            url:'/api/deploy/save_atx_deploy',
            data:_this.$qs.stringify(data),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.centerDialogVisible = false
              _this.getfunction()
            }else{
              return _this.$message.error(res.data.msg)
            }
          })
        },
        uploadChange(file, fileList){
          console.log(file, fileList)
        },
        beforeRemove(file, fileList) {
          console.log(this.fileList)
          // return this.$confirm(`确定移除 ${ file.name }？`);
        },
        beforeUpload(file, fileList){
          let postfix = file.name.split('.').pop()
          console.log(postfix)
          if(postfix){
            // if(postfix != 'apk'){
            //   this.$message.warning("请上传有效的apk文件!"); 
            //   return false
            // }
          }else{
            this.$message.warning("请上传apk文件!"); 
            return false
          }
        },
        UploadSuccess(res, file, fileList){
          if(res.status==200){
            this.fileList=[]
            return this.$message.success(res.msg); 
          }else{
            // this.fileList=[]
            return this.$message.error(res.msg); 
          }
        },
        UploadError(err, file, fileList){
          this.fileList=[]
          return this.$message.error(err.msg); 
        },
      },
      filters:{
        condition:val=>{
          if(val==='behave'){
            return ` BeHave `
          }else{
            return ` Appium `
          }
        }
      },
};
</script>
<style scoped>

.frombg{
    background-color: rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index:99;
}
.el-tabs{
  width: 95%;
  margin:0 auto;
}
.upload-demo{
  display: inline-block;
}
.upload-demo>>>.el-upload-list{
  background: #f5f7fa;
  width: 25%;
  position: absolute;
  top: 70px;
  right:3%;
  text-align: left;
}
.upload-demo>>>li{
  margin:0 3px 0px 3px;
}
</style>