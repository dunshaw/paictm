<template>
    <div>
      <el-header style="height:40px;">
        <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
          <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/Functions' }" >兼容性测试</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/Project/FunctionTestSuite',query:{project_id:project_id,project_name:project_name}  }" >{{$route.query.projectname}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.query.suitename}}</el-breadcrumb-item>
        </el-breadcrumb>
      </el-header>



      <el-main>
        <h3 style="text-align:center;margin-bottom:10px;color:#333;">{{ suitename }}</h3>
        <el-header style="margin:0;height:40px;width:95%;margin:0 auto;">
          <el-tag size="mini">{{system_type}}</el-tag>
          <el-tag type="success" size="mini">{{app_file_name}}</el-tag>
        </el-header>
        <div style="width:95%;margin:0 auto;">
          <el-table :data="tableData" style="width: 100%" :show-header="false" size="small" :cell-style="isCenter" border stripe>
            <el-table-column :cell-style="isCenter" width="400">
              <template slot-scope="scope">
                <el-tag size="mini" style="margin-right:10px;">{{ scope.row.position }}</el-tag>
<!--                 <i class="el-icon-document"></i> -->
                <span style="margin-left: 10px">{{ scope.row.test_case_name }}</span>
              </template>
            </el-table-column >
            <el-table-column align="right">
              <template slot-scope="scope">
                <el-button-group style="margin-right: 80px">
                  <el-button size="mini" type="primary" icon="el-icon-view" round @click="handleEdit(scope.row.test_case_id,scope.row.test_case_name)">查看</el-button>
                  <el-button size="mini" type="danger" icon="el-icon-delete" round @click="handleDelete(scope.row.test_case_id,scope.$index)">删除</el-button>
                </el-button-group>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-footer style="text-align:center;height:50px;margin-top:20px;">
          <el-button-group>
              <el-button size="mini" type="" icon="el-icon-sort" @click="modelflag('isOrderFlag',true)">编辑</el-button>
              <el-button size="mini" type="primary" icon="el-icon-plus" @click='showallcase'>添加</el-button>
              <el-button size="mini" type="success" icon="el-icon-refresh" @click="modelflag('BeforeRunFlag',true)">运行</el-button>
          </el-button-group>
        </el-footer>
      </el-main>


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

      <!-- //模态组件区域  -->
      <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
          <div class="frombg animated" v-if="isDevicesFlag">
            <Devices :projectid="project_id"></Devices> <!-- 手机设备 -->
          </div>

          <div class="frombg animated" v-if="isParameterFlag">
            <Parameter :projectid="project_id"></Parameter> <!-- 设备参数 -->
          </div>

          <div class="frombg animated" v-if="BeforeRunFlag">
            <Runsetup :projectid="project_id" :runid="suiteid" :codeLang="script_type" :runtype="runtype" :tool="tasktool"></Runsetup> <!-- 运行准备 -->
          </div>

          <div class="frombg animated" v-if="isOrderFlag">
            <orderfrom :datalist='tableData' ordertype='2' @transferData='afterorder'></orderfrom>
          </div>
      </transition>

      <el-dialog title="新增测试用例" :visible.sync="dialogFormVisible" >
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.id" v-for="item in caselist" :key="item.key" style='width:40%;margin:2px;'>{{item.name}}</el-checkbox>
        </el-checkbox-group>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible=false" size="mini">取 消</el-button>
          <el-button type="primary" @click="handleAdd" size="mini">确 定</el-button>
        </div>
      </el-dialog>
        


        
    </div>

</template>




<script>
import {mapState} from 'vuex'
import devices from '../../components/Devices'
import parameter from '../../components/Parameter'
import runsetup from '../../components/Runsetup'
import orderfrom from '../../components/OrderFrom'

export default {

      data(){
        return {
          runtype:'suite',
          project_name:'',
          project_id:'',
          tableData: [],
          suitename: '',
          suiteid:'',
          app_file_name:'',
          system_type:'',
          dialogFormVisible: false,
          script_type:'',
          checkList: [],
          caselist:[],
          tasktool:'',
        }
      },
      created(){
        this.getRouterData()
      },
      components:{
        Devices:devices,
        Parameter:parameter,
        Runsetup:runsetup,
        orderfrom:orderfrom
      },
      computed:{
        ...mapState({
          isDevicesFlag:state => state.isDevicesFlag,
          isParameterFlag:state => state.isParameterFlag,
          BeforeRunFlag:state => state.BeforeRunFlag,
          isOrderFlag:state => state.isOrderFlag,
        }),
      },
      methods: {
        getRouterData(){
          this.project_name = this.$route.query.projectname
          this.project_id = this.$route.query.projectid
          this.suiteid = this.$route.query.suiteid
          this.suitename = this.$route.query.suitename
          this.script_type = this.$route.query.script_type
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/test_suit/get_test_suit_cases',
              data:_this.$qs.stringify({'test_suit_id':_this.suiteid})
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.tableData=res.data.test_case_list
                _this.system_type=res.data.system_type
                _this.app_file_name = res.data.app_file_name
                _this.orderdata(res.data.test_case_list)
              }else{
                return _this.$message.error(res.data.msg) 
              }
          })
        },
        //样式
        isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==0){
            return 'color:#999;padding-left:30px;font-size:14px;letter-spacing:1px;'
          }
        },
        //修改缓存
        modelflag(status,flag){
            this.$store.commit(status,flag)
        },
        // 添加保存
        handleAdd(){
          // console.log(this.checkList)
          let data = JSON.stringify(this.checkList)
          let _this = this
          _this.$axios({
              method:'post',
              url:'/api/test_suit/update',
              data:_this.$qs.stringify({'test_case_list':data,'test_suit_id':_this.suiteid})
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.tableData=res.data.test_case_list
                _this.dialogFormVisible=false
                return _this.$message.success(res.data.msg)
              }else{
                return _this.$message.error(res.data.msg) 
              }
          })
        },
        //删除
        handleDelete(id,$index) {
          console.log($index, id);
          this.$confirm('此操作将从用例集中删除该用例, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center: true
          }).then(() => {
            let _this=this;
            let data = {'test_suit_id':_this.suiteid,'test_case_id':id}
            console.log(data)
            _this.$axios({
              method:'post',
              url:'/api/test_suit/test_case_delete_in_test_suit',
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
            return _this.$message.info('已取消删除')
          });
        },
        
        //编辑事件，跳转
        handleEdit(id,name){
          this.$store.commit('isCodeLang',this.script_type)
          this.$router.push({
            name:'functiontestcasesteps',
            path:'/Project/FunctionTestCase/Editor',
            query:{
              caseid:id,
              casename:name,
              projectid:this.project_id,
              projectname:this.project_name,
              // codeLang:language
            }
          })
        },
        //跳转测试命令管理页面
        gotoCommand(){
          console.log('跳转测试命令管理页面!',this.projectid)
          this.$router.push({
            name:'commands',
            path:'/CommandsControl',
            query:{
              projectid:this.project_id,
              projectname:this.project_name,
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
              project_id:this.project_id,
              project_name:this.projecti_name,
            }
          })
        },
        // 获取工程全部case
        showallcase(){
          let _this=this;
          _this.$axios({
              method:'post',
              url:'/api/test_case/get_project_test_cases',
              data:_this.$qs.stringify({'project_id':_this.project_id,script_type:_this.script_type,'test_suit_id':_this.suiteid})
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.caselist=res.data.test_case_list
                _this.condition()
                _this.dialogFormVisible=true
              }else{
                return _this.$message.error(res.data.msg) 
              }
          })
        },
        condition(){
          let _this=this;
          this.checkList=[]
          this.caselist.forEach(item=>{
            if(item.isselected){
              _this.checkList.push(item.id)
            }
          })
        },
        orderdata(data){
          let _this = this;
          data.map((item,index)=>{
            item.content = item.test_case_name
          })
        },
        // 重置数据
        afterorder(data){
          this.$message.success(data) 
          this.getRouterData()
        },
      },
    };
</script>
<style scoped>
  .el-input{
    width: 200px;
    margin-right: 100px;
  }
  .el-main{
    /*border: 1px solid red;*/
    border-radius: 4px;
    width:96%;
    margin:0 auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    min-height: 200px;
  }
  .el-menu-vertical-demo {
    width: 50px;
    text-align: center;
    padding: 0;
  }
  .el-menu{
    position: fixed;
    left: -10px;
    top: 35%;
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
    z-index:999;
}


</style>