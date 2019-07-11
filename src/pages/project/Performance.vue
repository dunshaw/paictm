<template>
  <div>
    <el-header style="height:40px;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
        <el-breadcrumb-item >性能测试</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main>
      <h3 style="text-align:center;margin-bottom:10px;color:#333;">性能测试</h3>
      <el-table :data="tables" style="width: 100%" size="small" :cell-style="isCenter" :header-cell-style="isThead" border stripe>
        <el-table-column :cell-style="isCenter" width="300" label="工程名">
          <template slot-scope="scope">
            <!-- <i class="el-icon-document"></i> -->
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column >
        <el-table-column :cell-style="isCenter" width="200" label="Apk">
          <template slot-scope="scope">
            <i class="el-icon-service"></i>
            <span style="margin-left: 10px">{{ scope.row.app_file_name }}</span>
          </template>
        </el-table-column >
        <el-table-column :cell-style="isCenter" width="200" label="系统">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.system_type }}</span>
          </template>
        </el-table-column >
        <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button size="mini" type="warning" icon="el-icon-edit-outline" plain @click="handleEdit(scope.row.id,scope.row.name,scope.row.app_file_name)">进入任务</el-button>
              <el-button size="mini" type="info" icon="el-icon-delete" plain @click="taskhistory(scope.row.name,scope.row.id)">历史纪录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>

    <!-- button -->
    <el-footer style="margin:1em;padding:0;text-align:center;">
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
    </el-footer>

    <!-- 新增工程表单 -->
    <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
      <div class="frombg animated" v-if="isFromFlag">
        <projectform @transferData='AddData' :showtypes='performance'></projectform>
      </div>
    </transition>
  </div>

</template>




<script>
import {mapState} from 'vuex'
import projectform from '../../components/Project_from'


export default {
  name: 'performance',
    data(){
      return {
        performance:false,
        tableData: [],
        fileList:[],
        uploadheaders:{ },
      }
    },
    mounted(){
      this.getfunction()
      this.uploadheaders['Authentication-Token'] = this.$store.state.isToken
    },
    computed:{
      ...mapState({
        isFromFlag:state => state.isFromFlag,
      }),
      tables() {
        let _this = this;
        return this.tableData.filter(item=>{
            if(item.system_type.toLowerCase()=='android'){
                return item
            }
        });
      },
    },
    components:{
      projectform,
    },
    methods:{
      //css样式
      isCenter({row,column,rowIndex,columnIndex}){
        if(columnIndex==0){
          return 'color:#7BAEE4;font-size:12px;letter-spacing:1px;font-weight:bold;text-align: center;'
        }else{
          return 'color:#666;font-size:12px;letter-spacing:1px;font-weight:500;text-align: center;'
        }
      },
      isThead({row,column,rowIndex,columnIndex}){
        return 'color:#666;font-size:14px;letter-spacing:1px;font-weight:bold;text-align:center;'
      },
      // 获取已有的任务
      getfunction(){
        let _this=this;
        _this.$axios({
            method:'post',
            url:'/api/project/select_all',
            data:_this.$qs.stringify({'user_name':_this.$store.state.isLoginName}),
        }).then(function (res){
            // console.log(res.data.data);
            if(res.data.status==200){
                _this.tableData = res.data.data
            }
        }).catch(function (error) {
            console.log(error)
        })
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
      // 进入工程任务详情
      handleEdit(id,name,apk){
        this.$router.push({
          name:'performanceedit',
          path:'/PerformanceEdit',
          query:{
            project_id:id,
            project_name:name,
            project_apk:apk
          }
        })
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
      // upload
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
          if(postfix != 'apk'){
            this.$message.warning("请上传有效的apk文件!"); 
            return false
          }
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
        return 
      },
    },
  };
</script>
<style scoped>
  .el-main{
    /*border: 1px solid red;*/
    border-radius: 4px;
    width:96%;
    margin:0 auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
/*    min-height: 200px;*/
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
  .frombg{
    background-color: rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index:99;
  }
</style>