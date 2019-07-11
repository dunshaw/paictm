<template>
  <div class="historys">
    <el-header style="height:40px;">
      <!-- <el-button icon="el-icon-d-arrow-left" circle size='mini' @click="backform" type="primary"></el-button> -->
      <el-page-header @back="backform"></el-page-header>
    </el-header>

    <div style="height:50px;">
      <el-tag style="cursor: pointer;" @click="showselects"><h3><i class="el-icon-d-caret" style="margin-right:5px;"></i>{{project_name}} 测试记录</h3></el-tag>
    </div>
    <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" border :cell-style="isCenter" :header-cell-style="isThead">
<!--       <el-table-column type="selection" width="55">
      </el-table-column> -->
      <el-table-column label="创建日期" width="200">
        <template slot-scope="scope">{{ scope.row.create_date }}</template>
      </el-table-column>
      <el-table-column prop="name" label="任务名称" >
      </el-table-column>
      <el-table-column label="测试类型" show-overflow-tooltip width="100">
        <template slot-scope="scope">{{ scope.row.task_type | conditions }}</template>
      </el-table-column>
      <el-table-column label="测试模式" show-overflow-tooltip width="100">
        <template slot-scope="scope">{{ scope.row.task_model | Taskmodels }}</template>
      </el-table-column>
      <el-table-column label="执行语言" show-overflow-tooltip width="100">
        <template slot-scope="scope"><el-tag size='small '>{{ scope.row.code | codetions }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_by_name" label="执行人" show-overflow-tooltip width="100">
      </el-table-column>
      <el-table-column label="测试结果" show-overflow-tooltip width="100">
        <template slot-scope="scope"><el-tag :type="scope.row.result" size='mini'>{{ scope.row.result | testresult }}</el-tag></template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button-group>
            <el-button size="mini" type='primary'
              @click="handleEdit(scope.row.id,scope.row.name)" round>查看</el-button>
            <el-button size="mini" type="danger"
              @click="handleDelete(scope.$index, scope.row.id)" round>删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        layout="prev, pager, next"
        :total="totals"
        :current-page='currentpage'
        :page-size="pagesize"
        @current-change="handleCurrentChange">
      </el-pagination>

    </div>


    <!-- 获取工程列表模态 -->
    <el-dialog title="请选择工程查看历史记录" :visible.sync="dialogFormVisible">
      <el-select v-model="project_id" placeholder="请选择工程" style="margin-bottom:2em;" size="small" @change='gethistory'>
        <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id" >
        </el-option>
      </el-select>
    </el-dialog>
  </div>
</template>


<script>
import {mapState} from 'vuex'

export default {
  name: 'historys',
    data(){
      return {
        project_id:'',
        project_name:'',
        multipleSelection:[],
        dialogFormVisible:false,
        tableData: [],
        projects: [],
        totals:50,
        currentpage:1,
        pagesize:10,
      }
    },
    created(){
      this.getRouterData()
    },
    methods:{
      backform(){
        this.$router.go(-1)
      },
      getRouterData(){
        this.project_name = this.$route.query.project_name
        this.project_id = this.$route.query.project_id
        if(this.project_id  && this.project_name){
          this.gethistory()
        }else{
          this.getprojects()
        }
      },
      //css样式
      isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==2 || columnIndex==4){
            return 'font-size:12px;text-align: center;color:#00477d;'
          }else{
            return 'font-size:12px;font-weight:500;text-align:center;color:#003964;'
          }
      },
      isThead({row,column,rowIndex,columnIndex}){
          return 'color:#666;font-size:14px;letter-spacing:1px;font-weight:bold;text-align:center;'
      },
      // 多选框操作
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 显示工程列表
      showselects(){
        // console.log(this.projects)
        if(this.projects == false){
          this.getprojects()
        }else{
          this.dialogFormVisible=true
        }
      },
      // 获取工程列表
      getprojects(){
        let _this=this;
        _this.$axios({
            method:'post',
            url:'/api/project/select_all',
            data:_this.$qs.stringify({'user_name':_this.$store.state.isLoginName}),
        }).then(function (res){
            console.log(res.data.data);
            if(res.data.status==200){
                _this.projects = res.data.data
                _this.dialogFormVisible=true
            }
        }).catch(function (error){
            console.log(error)
        })
      },
      // 获取历史记录
      gethistory(){
        if(this.project_id==''){
          this.dialogFormVisible=true
          return this.$message.warning('请先选择工程！！')
        }
        console.log(this.project_name,this.project_id)
        let mydata ={
          'project_id':this.project_id,
          'current_page':this.currentpage,
          'page_size':this.pagesize
        }
        let _this = this
        _this.$axios({
            method:'post',
            url:'/api/task/get_task_history_paging',
            data:_this.$qs.stringify(mydata),
        }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.project_name=res.data.project_name
              _this.totals = res.data.task_history_total
              _this.tableData = res.data.task_history_list
              _this.dialogFormVisible=false
            }
        }).catch(function (error){
          console.log(error)
        })
      },
      // 当前页改变
      handleCurrentChange(val){
        this.currentpage = val
        // console.log(val)
        this.gethistory()
      },
      // 查看详情
      handleEdit(id,name){
        // console.log(id);
        this.$router.push({
          path:'/TaskHistory/Details',
          query:{
            task_id:id,
            task_name:name
          }
        })
      },
      // 删除
      handleDelete(index,id){
        // console.log(index,id)
        let _this=this;
        this.$confirm('此操作将删除整个任务, 是否删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          _this.$axios({
            method:'post',
            url:'/api/task/delete_task_history',
            data:_this.$qs.stringify({'task_id':id}),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.gethistory()
              return _this.$message.success(res.data.msg)
            }
            return _this.$message.error(res.data.msg)
          })
        }).catch(()=>{
          return this.$message.info('取消操作 !')
        })
      },
    },
    // 过滤器
    filters:{
      conditions:function(data){
        // console.log(data)
        switch (data){
          case "compatibility":
            return '兼容测试'
          case '':
            return '稳定测试'
          case 'performance':
            return '性能测试'
        }
      },
      codetions:function(data){
        // console.log(data)
        if(data){
          return data
        }
        return '无'
      },
      testresult:function(data){
        // console.log(data)
        if(data=='success'){
          return '成功'
        }else{
          return '失败'
        }
      },
      Taskmodels:function(data){
        if(data=="normal"){
          return '调试模式'
        }else{
          return '报告模式'
        }
      }
    },
}
;
</script>

<style scoped>
  .historys{
    width: 95%;
    border-radius: 4px;
    margin:0 auto;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 1em;
    text-align: center;
  }
  .block{
    margin-top: 15px;
  }
  .el-header{
    text-align: left;
  }
</style>

