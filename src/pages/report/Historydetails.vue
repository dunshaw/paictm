<template>
  <div>
     <!-- <p>{{ task_id }}</p> -->
    <el-header style="height:40px;">
      <!-- <el-button icon="el-icon-d-arrow-left" circle size='mini' @click="backform" type="primary" ></el-button> -->
      <el-page-header @back="backform"></el-page-header>
    </el-header>

      <el-main>

        <h3 style="text-align:center;margin-bottom:10px;"><el-tag type="info"><i class="el-icon-tickets" style="margin-right:2px;"></i>{{task_name}}</el-tag></h3>
        <div style="margin:1em;text-align:center;">
          <!-- <el-tag size='mini'>测试对象.apk</el-tag> -->
          <el-tag size='mini' type='info' v-if="!task_model">调试模式</el-tag>
          <el-tag size='mini' type='warning' v-if="task_model">报告模式</el-tag>
<!--           <el-tag size='mini' v-if="!task_perfor">适配测试</el-tag>
          <el-tag size='mini' v-if="task_perfor">性能测试</el-tag> -->
        </div>
        <el-table :data="tableData" border stripe style="width: 95%;margin:0 auto;" @selection-change="handleSelectionChange" :cell-style="isCenter" :header-cell-style="isThead">
          <el-table-column label="状态" width="55">
            <template slot-scope="scope">
              <i class="el-icon-success" v-if="scope.row.run_status" style="color:#67c23a;"></i>
              <i class="el-icon-remove" v-if="!scope.row.run_status" style="color:red;"></i>
            </template>
          </el-table-column>
          <el-table-column prop="create_date" label="时间" width="180">
          </el-table-column>
          <el-table-column label="设备" width="180">
            <template slot-scope="scope"><el-link type="primary" @click='devicedetail(scope.row.device_id,scope.row.device_name)'>{{scope.row.device_name}}</el-link></template>
          </el-table-column>
          <el-table-column label="执行语言" width="180">
            <template slot-scope="scope"><el-tag size='small '>{{ scope.row.code | codetions }}</el-tag></template>
          </el-table-column>
          <el-table-column label="结果" width="180">
            <template slot-scope="scope"><el-tag :type="scope.row.result" size='small '>{{ scope.row.result | testresult }}</el-tag></template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button size="mini" type='primary' @click="handleEdit(scope.row.device_id,scope.row.device_name,1)" v-show="task_function" plain>适配报告</el-button>
              <el-button size="mini" type='primary' @click="handleEdit(scope.row.device_id,scope.row.device_name,2)" v-show="task_perfor" plain>性能报告</el-button>
            </template>
          </el-table-column>
          <el-table-column label="更新" width="80" v-if="task_model">
            <template slot-scope="scope">
              <el-button type="primary" icon="el-icon-refresh" circle size="mini" @click='handleupdate(scope.row.device_id,scope.$index)' v-if='scope.row.device_status=="true"'></el-button>
              <el-tooltip class="item" effect="dark" content="更新中..." placement="top">
                <el-button type="danger" icon="el-icon-loading" circle size="mini" v-if='scope.row.device_status!="true"'></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>

        <div style="text-align:center;margin-top:20px;">
            <el-button type="warning" round size='small' @click="get_journal" v-if="task_model">生成报告模板</el-button>
            <el-button type="primary" round size='small' @click="get_reports">下 载 日 志</el-button>
        </div>


        <!-- //模态组件区域  -->
        <transition enter-active-class="fadeInDown" leave-active-class="fadeOutDown" :duration='{enter:800, leave: 800}'>
          <myform class="animated" v-if="isModelFlag" :editFlag='editFlag'></myform>
        </transition>


      </el-main>

      


  </div>
</template>



<script>
import {mapState} from 'vuex'
import myforms from '../../components/Froms'
  

export default {
  data() {
    return {
      editFlag:false,
      task_id:'',
      task_name:'',
      task_model:'',
      task_perfor:false,
      task_function:false,
      multipleSelection: [],
      tableData: [], 
    }
  },
  mounted(){
    this.getRouterData()
  },
  computed:{
    ...mapState({
      isModelFlag:state => state.isModelFlag,
    }),
  },
  components:{
    myform:myforms,
  },
  methods:{
    backform(){
      this.$router.go(-1)
    },
    getRouterData(){
      this.task_id = this.$route.query.task_id
      this.task_name = this.$route.query.task_name
      this.get_details()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //css样式
    isCenter({row,column,rowIndex,columnIndex}){
        if(columnIndex==0){
          return 'text-align:center;'
        }else{
          return 'font-size:12px;font-weight:500;text-align:center;color:#003964;'
        }
    },
    isThead({row,column,rowIndex,columnIndex}){
        return 'color:#666;font-size:14px;letter-spacing:1px;font-weight:bold;text-align:center;'
    },
    // 更新device
    handleupdate(deviceid,index){
      console.log(deviceid,index);
      let _this=this;
      this.$confirm('此操作将更新该设备的数据结果, 是否更新?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.$axios({
          method:'post',
          url:'/api/task/renew_task',
          data:_this.$qs.stringify({'task_id':_this.task_id,'device_id':deviceid,'performance':_this.task_perfor}),
        }).then(function (res){
          console.log(res);
          if(res.data.status==200){
            _this.tableData[index].device_status='false'
            _this.pushtask()
            return _this.$message.success(res.data.msg)
          }
          return _this.$message.error(res.data.msg)
        })
      }).catch(()=>{
        return this.$message.info('取消操作 !')
      })
    },

    pushtask(){
      console.log(this.task_id)
      console.log(this.$store.state.isRunTasks)
      if(this.$store.state.isRunTasks.indexOf(this.task_id) == -1){
        this.$store.commit('isRunTasks',this.task_id)
        let $index = this.$store.state.isFinishData.indexOf(this.task_id);
        if($index != -1){
          this.$store.commit('isRenewTask',$index)
        }
      }
    },
    // 查看
    handleEdit(deviceid,devicename,type){
      let routeData = this.$router.resolve({ path: '/ReportsIndex', name:'reportsdata', query: {
          taskid:this.task_id,
          taskname:this.task_name,
          deviceid:deviceid,
          devicename:devicename,
          reportmodel:type
        } });
      window.open(routeData.href, '_blank');

      // this.$router.push({
      //   name:'reportsdata',
      //   path:'/ReportsData',
      //   query:{
      //     taskid:this.task_id,
      //     taskname:this.task_name,
      //     deviceid:deviceid,
      //   }
      // })
    },

    // 获取taks所以设备数据
    get_details(){
      let _this=this;
      _this.$axios({
          method:'post',
          url:'/api/task/get_task_detail',
          data:_this.$qs.stringify({'task_id':_this.task_id}),
      }).then(function (res){
          console.log(res.data);
          if(res.data.status==200){
            _this.task_model = res.data.task_model
            _this.juedemode(res.data.report)
            _this.tableData = res.data.device_list
          }
      }).catch(function (error){
          console.log(error)
          return this.$message.error(error)
      })
    },
    juedemode(mode){
      switch (mode){
        case 'performance_report':
          return this.task_perfor = true
        case 'all':
          return this.task_perfor = this.task_function = true
        case 'adapt_report':
          return this.task_function = true
      }
    },
    // 获取设备详情
    devicedetail(id,name){
      let data = {'id':id,'name':name}
      let _this=this;
      _this.$axios({
        method:'post',
        url:'/api/device/select',
        data:_this.$qs.stringify(data)
      }).then(function (res){
        if(res.data.status==200){
          // console.log(res)
          _this.$store.commit('isModelData',res.data.data)
          _this.$store.commit('isModelFlag',true)
        }
      })
    },
    // 下载日志
    get_reports(){
      let _this=this;
      _this.$axios({
        method:'post',
        url:'/api/report/download_html_report',
        data:_this.$qs.stringify({'task_id':_this.task_id}),
        responseType: 'blob',
      }).then(function (res){
        // console.log(res);
        if(res.data){
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', _this.task_name+'.zip')
          document.body.appendChild(link)
          link.click()
        }
      }).catch(function (error) {
        console.log(error)
        return this.$message.error(error)
      })
    },
    // 生成报告
    get_journal(){
      if(!this.downnloads()){
        return this.$message.error('无报告可供下载!')
      }
      let _this=this;
      _this.$axios({
        method:'post',
        url:'/api/report/download_report',
        data:_this.$qs.stringify({'task_id':_this.task_id}),
        responseType: 'blob',
      }).then(function (res){
        // console.log(res);
        if(res.data){
          let url = window.URL.createObjectURL(new Blob([res.data]))
          let link = document.createElement('a')
          link.style.display = 'none'
          link.href = url
          link.setAttribute('download', _this.task_name+'.doc')
          document.body.appendChild(link)
          link.click()
        }
      }).catch(function (error) {
        console.log(error)
        return this.$message.error(error)
      })
    },
    // 判断逻辑
    downnloads(){
      for (let i of this.tableData) {
          if (i.run_status) {return true}else{return false} 
      }
    }
  },
  // 过滤器
  filters:{
    testresult:function(data){
      // console.log(data)
      if(data=='success'){
        return '成功'
      }else{
        return '失败'
      }
    },
    codetions:function(data){
      console.log(data)
      if(data){
        return data
      }
      return '无'
    }
  }


};
</script>

<style scoped>
  .el-main{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width: 95%;
    margin: 0 auto;
  }
  .el-header>>>.el-button{
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  }
</style>