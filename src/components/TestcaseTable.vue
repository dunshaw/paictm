<template>
    <div>
      <h3 style="text-align:center;margin-bottom:10px;color:#333;">测试用例列表</h3>
      <el-header style="margin:0;height:40px;width:95%;margin:0 auto;">
        <el-input v-model="search" size="mini" style="margin:0;height:40px;" placeholder="搜索用例"/>
        <el-button size="mini" type="primary" plain @click="handleAdd">新增测试用例</el-button> 
      </el-header>
      <div style="width:95%;margin:0 auto;">
        <el-table :data="table" style="width: 100%" :show-header="false" size="small" :cell-style="isCenter" border stripe>
          <el-table-column :cell-style="isCenter" width="400">
            <template slot-scope="scope">
              <i class="el-icon-document"></i>
              <span style="margin-left: 10px">{{ scope.row.name }}</span>
            </template>
          </el-table-column >
          <el-table-column align="right">
            <template slot-scope="scope">
              <el-button-group style="margin-right: 80px">
                <el-button size="mini" type="warning" icon="el-icon-edit" round @click="handleRename(scope.row.id,scope.$index)">重命名</el-button>
                <el-button size="mini" type="primary" icon="el-icon-edit-outline" round @click="handleEdit(scope.row.id,scope.row.name,scope.row.script_type)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete" round @click="handleDelete(scope.row.id,scope.$index)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-footer style="text-align:center;margin-top:10px;">
        <el-button-group>
          <el-button type="primary" round icon="el-icon-mobile-phone" size='mini' @click="modelflag('isDevicesFlag',true)">设备管理</el-button>
          <el-button type="success" size='mini' round icon="el-icon-setting" @click="getprojects">自定义运行</el-button>
        </el-button-group>
      </el-footer>


      <el-dialog title="自定义用例运行" :visible.sync="dialogFormVisible">
        <div class="codeselect">
          <el-dropdown @command="codechange" trigger="click">
            <span class="el-dropdown-link">
              <i class="el-icon-caret-bottom"></i>{{codeLang}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="ruby">ruby</el-dropdown-item>
              <el-dropdown-item command="python">python</el-dropdown-item>
              <el-dropdown-item command="javascript">javascript</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <el-checkbox-group v-model="caselists">
          <el-checkbox v-for="item in caseoptions" :label="item.id" :key="item.id" style="width:40%;">{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sendruninfo" size='mini'>确 定</el-button>
        </div>
      </el-dialog>

      <!-- //模态组件区域  -->
      <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
          <div class="frombg animated" v-if="isDevicesFlag">
            <Devices :projectid="projectid"></Devices> <!-- 手机设备 -->
          </div>

          <div class="frombg animated" v-if="BeforeRunFlag">
            <Runsetup :projectid="projectid" :runid="caselists" :codeLang="codeLang" :runtype="runtypes"></Runsetup> <!-- 运行准备 -->
          </div>
      </transition>

    </div>
</template>




<script>
import {mapState} from 'vuex'
import runsetup from './Runsetup'
import devices from './Devices'


export default {
    name: 'testtable',
      data(){
        return {
          tableData: [],
          search: '',
          runtypes:'caselist',
          dialogFormVisible:false,
          //语言
          codeLang:'ruby',
          caseoptions:['case1','case2','case3'],
          caselists:[],
        }
      },
      props: ['projectid','projectname'],
      components:{
        Devices:devices,
        Runsetup:runsetup
      },
      mounted(){
        this.getdata()
      },
      computed:{
        ...mapState({
          isDevicesFlag:state => state.isDevicesFlag,
          BeforeRunFlag:state => state.BeforeRunFlag,
        }), 
        table() {
          let _this = this;
          if (_this.search) {
            return this.tableData.filter(item=>{
                if(item.name.toLowerCase().includes(_this.search.toLowerCase())){
                    return item
                }
            });
          }
          return this.tableData 
        },
      },
      methods: {
        // 修改缓存
        modelflag(state,flag){
            this.$store.commit(state,flag)
        },
        // 获取所有用例
        getdata(){
          console.log(this.projectid);
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/test_case/select',
              data:_this.$qs.stringify({'project_id':_this.projectid})
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.tableData=res.data.data
              }
          })
        },
        //重命名
        handleRename(id,$index) {
          console.log($index,id);
          this.$prompt('请输入新的用例名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '用例名不能为空！'
          }).then(({ value }) => {
              let _this=this;
              let data = {'id':id,'name':value,'project_id':_this.projectid}
              console.log(data)
              _this.$axios({
                method:'post',
                url:'/api/test_case/rename',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  _this.tableData[$index].name=value
                  return _this.$message.success(res.data.msg)
                }else{
                  return _this.$message.error(res.data.msg)
                }
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });       
          })
        },
        //删除
        handleDelete(id,$index) {
          console.log($index, id);
          this.$confirm('此操作将永久删除用例, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let _this=this;
            let data = {'id':id,'project_id':_this.projectid}
            console.log(data)
              _this.$axios({
                method:'post',
                url:'/api/test_case/delete',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  _this.tableData.splice($index,1);
                  return _this.$message.success(res.data.msg)
                }else{
                  return _this.$message.error(res.data.msg)
                }
              }) 
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },
        //编辑事件，跳转
        handleEdit(id,name,language){
          // console.log(language)
          this.$store.commit('isCodeLang',language)
          this.$router.push({
            name:'functiontestcasesteps',
            path:'/Project/FunctionTestCase/Editor',
            query:{
              caseid:id,
              casename:name,
              projectid:this.projectid,
              projectname:this.projectname,
              // codeLang:language
            }
          })
        },
        //新增用例
        handleAdd(){
          this.$prompt('请输入用例名', '新建', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S/,
            inputErrorMessage: '用例名不能为空！'
          }).then(({ value }) => {
              let _this=this;
              let data = {'name':value,'project_id':_this.projectid}
              // console.log(data)
              _this.$axios({
                method:'post',
                url:'/api/test_case/create',
                data:_this.$qs.stringify(data),
              }).then(function (res){
                console.log(res);
                if(res.data.status==200){
                  _this.tableData.push({'name':value,'project_id':_this.projectid,'id':res.data.id,'script_type':'ruby'})
                  return _this.$message.success(res.data.msg)
                }else{
                  return _this.$message.error(res.data.msg)
                }
              })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });       
          })
        },
        //语言改变事件
        codechange(command){
          // console.log(command);
          if(this.codeLang!=command){
            this.codeLang=command;
            this.getprojects()
          }else{
            return false
          }
        },
        // 获取所选语言的所有用例
        getprojects(){
          console.log(this.codeLang)
          this.caselists=[]
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/task/get_project_script_test_cases',
              data:_this.$qs.stringify({'project_id':_this.projectid,'script_type':_this.codeLang}),
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.caselists=[]
                _this.caseoptions = res.data.test_case_list
                _this.dialogFormVisible=true
              }
          }).catch(function (error){
              console.log(error)
          })
        },
        // 
        sendruninfo(){
          console.log(this.caselists)
          if(this.caselists== false){
            return this.$message.error('请至少选择一个测试用例！！')
          }
          this.modelflag('BeforeRunFlag',true)
          this.dialogFormVisible=false
        },
        //样式
        isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==0){
            return 'color:#999;padding-left:30px;font-size:14px;letter-spacing:1px;'
          }
        },
      },

    };
</script>
<style scoped>
  .el-input{
    width: 200px;
    margin-right: 100px;
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
  .codeselect{
    position:absolute; 
    top: 10%;
    right: 10%;
  }
  .el-dropdown-link {
      cursor: pointer;
      color: #409EFF;
  }
  .el-icon-arrow-down {
    font-size: 12px;
  }
</style>