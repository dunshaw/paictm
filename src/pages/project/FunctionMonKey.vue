<template>
    <div>
      <el-header style="height:40px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
          <el-breadcrumb-item >稳定性测试</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>
      <div style="width:90%;margin:0 auto;box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1); padding:1em;"> 
        <h3 style="text-align:center;margin-bottom:10px;">稳定性测试</h3>
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
                <el-button size="mini" type="warning" icon="el-icon-edit-outline" plain @click="handleEdit(scope.row.id,scope.row.name,scope.row.system_type)">进入任务</el-button>
                <el-button size="mini" type="info" icon="el-icon-delete" plain @click="handleEdit(scope.row.name,scope.row.id)">历史纪录</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-footer style="text-align:center;margin-top:10px;">
        <el-button-group>
          <el-button type="success" round icon="el-icon-plus" size='mini' @click="showForm">新增测试工程</el-button>
        </el-button-group>
      </el-footer>

      <!-- 新增工程表单 -->
      <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
        <div class="frombg animated" v-if="isFromFlag">
          <projectform @transferData='AddData' :showtypes='monkey'></projectform>
        </div>
      </transition>
    </div>
</template>




<script>
import {mapState} from 'vuex'
import projectform from '../../components/Project_from'

export default {
  name: 'monkey',
  data(){
    return{
      monkey:false,
      tableData:[],
      showtable:'android',
    }
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
    projectform:projectform,
  },
  mounted(){
    this.getfunction()
  },
  methods:{
    getfunction(){
      let _this=this;
      _this.$axios({
          method:'post',
          url:'/api/project/select_all',
          data:_this.$qs.stringify({'user_name':_this.$store.state.isLoginName}),
      }).then(function (res){
          console.log(res.data.data);
          if(res.data.status==200){
              _this.tableData = res.data.data
          }
      }).catch(function (error) {
          console.log(error)
      })
    },
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
    // from显示控制
    showForm(){
      this.$store.commit('isFromFlag',true)
    },
    // 新增project
    AddData(data){
      this.tableData.push(data)
    },
    // 进入任务
    handleEdit(id,name,type){
      console.log(id,name,type)
      return this.$message.error('sorry,功能正在开发~~~')
    },
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

</style>