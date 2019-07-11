<template>
  <div>
    <div class="template-manage">
      <div class="temp-list">
        <el-table :data="tempList.slice((currentPage-1)*pagesize,currentPage*pagesize)" size="small" @cell-mouse-enter="showbtn" @cell-mouse-leave="hidebtn" stripe>
          <el-table-column type="index" :index="indexMethod"></el-table-column>
          <el-table-column label="测试步骤">
            <template slot-scope="scope">
                <span>{{ scope.row.content }}</span>
            </template>
          </el-table-column>
          <el-table-column label="">
            <template slot-scope="scope">
                <el-button-group v-show="scope.row.showflag" >
                    <el-button size="mini" type="info" round @click="stepremark(scope.row.id,scope.$index)">备注</el-button>
                    <el-button size="mini" type="danger" @click="stepdelete(scope.row.id,scope.$index)" round>删除</el-button>
                </el-button-group>
                <el-button icon="el-icon-d-arrow-right" circle size="mini" v-show="scope.row.showflag" style="float:right;" @click="modelflag('isStepCodeid',scope.row.id)"></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-footer style="text-align:left;height:50px;margin-top:20px;">
            <el-button-group>
                <el-button size="mini" type=""  @click="modelflag('isOrderFlag',true)">编辑</el-button>
                <el-button size="mini" type="primary"  @click="modelflag('isStepFlag',true)">添加</el-button>
                <el-button size="mini" type="success"  @click="modelflag('BeforeRunFlag',true)">运行</el-button>
            </el-button-group>
        </el-footer>
      </div>
      <el-pagination v-if="tempList.length>pagesize"
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
        :current-page="currentPage"
        :page-size="pagesize"
        :total="tempList.length">
      </el-pagination>
    </div>

    <!-- 新增 -->
    <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
        <div class="frombg animated" v-if="isStepFlag">
          <stepfrom :testcaseid="caseid" :projectid='projectid' @transferData='AddData'></stepfrom>
        </div>
        <div class="frombg animated" v-if="isOrderFlag">
          <orderfrom :datalist='tempList' ordertype='1' @transferData='orderdata'></orderfrom>
        </div>
    </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import stepfrom from './StepFrom'
import orderfrom from './OrderFrom'


export default {
  data () {
    return {
      tempList:[],
      pagesize:10,
      currentPage:1,
    }
  },
  props: ['projectid','caseid'],
  components:{
    stepfrom:stepfrom,
    orderfrom:orderfrom
  },
  computed:{
    ...mapState({
        isStepFlag:state => state.isStepFlag,
        isOrderFlag:state => state.isOrderFlag,
    }),
    isCodelang () {
      return this.$store.state.isCodeLang　　//监听的code语言改变
    }
  },
  watch:{
    isCodelang(newcode,oldcode){
      this.getsteps(newcode,1)
    }
  },
  mounted(){
    this.$store.commit('isStepFlag',false)
    this.$store.commit('isOrderFlag',false)
    this.getsteps(this.$store.state.isCodeLang,0)
  },
  methods:{
    //修正index
    indexMethod(index){
      return (this.currentPage-1)*this.pagesize+index+1;
    },
    //分页函数
    handleSizeChange(val) {
      console.log('size',val)
      this.pagesize = val;
      this.handleCurrentChange(this.currentPage);
    },
    handleCurrentChange(val){
      console.log('Current',val)
      let _this=this
      _this.currentPage = val;
    },
    //============================ hover事件 ===============================//
    showbtn(row, column, cell, event){
        row.showflag=true
    },
    hidebtn(row, column, cell, event){
        row.showflag=false
    },
    //============================ 函数事件 ===============================//
    //获取用例已有步骤
    getsteps(isCodeLang,isupdate){
      // console.log('isCode',isCodeLang)
      let _this=this;
      if(isCodeLang){
        _this.$axios({
          method:'post',
          url:'/api/test_case/into_test_case',
          data:_this.$qs.stringify({'test_case_id':_this.caseid,'script_type':isCodeLang,'model':isupdate,'project_id':_this.projectid}),
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.$emit('transferData',res.data.task_tool)
            _this.tempList=res.data.steps
            return _this.$message.success(res.data.msg)
          }else{
            return _this.$message.error(res.data.msg)
          }
        }).catch(function (error) {
          console.log(error)
        })
      } 
    },
    //修改缓存
    modelflag(status,flag){
        this.$store.commit(status,flag)
    },
    //备注步骤
    stepremark(stepid,index){
      let _this=this;
      _this.$axios({
      method:'post',
      url:'/api/test_step/get_annotation',
      data:_this.$qs.stringify({'test_step_id':stepid}),
      }).then(function (res){
      console.log(res);
      if(res.data.status==200){
        _this.$prompt('请输入步骤备注', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue:res.data.data,
        }).then(({ value }) => {
            let data = {'id':stepid,'annotation':value}
            _this.$axios({
              method:'post',
              url:'/api/test_step/test_step_update',
              data:_this.$qs.stringify(data),
            }).then(function (res){
              if(res.data.status==200){
                return _this.$notify.success(res.data.msg);
              }else{
                return _this.$message.error(res.data.msg);  
              }
            })
        }).catch(() => {
          return false
        })
      }
      }).catch(function (error) {
        console.log(error)
      })

      
    },
    //删除步骤
    stepdelete(stepid,index){
      let _this=this;
      this.$confirm('此操作将永久删除该步骤, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center: true
      }).then(() => {
        let data = {'test_step_id':stepid}
          _this.$axios({
            method:'post',
            url:'/api/test_step/test_step_delete',
            data:_this.$qs.stringify(data),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.tempList.splice(index,1);
              return _this.$message.success(res.data.msg);  
            }else{
              return _this.$message.error(res.data.msg);  
            }
          }) 
      }).catch(() => {
          return this.$message.info('已取消删除')
      });
    },
    //添加步骤回执
    AddData(data){
      this.tempList.push(data)
    },
    orderdata(data){
      this.getsteps(this.$store.state.isCodeLang,0)
    }

  },
}
;
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
