<template>
  <div class="box">
    <h3 style="text-align:center;margin-bottom:10px;">运行配置</h3>
    <template>
      <el-table :data="tableData" style="width: 100%" size="mini" :cell-style="isCenter" stripe :header-cell-style="isThead" :empty-text="emptydevice">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="设备名称:" >
                <span>{{ props.row.name }}</span>
              </el-form-item>
              <el-form-item label="所属品牌:">
                <span>{{ props.row.brand }}</span>
              </el-form-item>
              <el-form-item label="用途:">
                <span>{{ props.row.test_type | condition}}</span>
              </el-form-item>
              <el-form-item label="系统:">
                <span>{{ props.row.device_type }}</span>
              </el-form-item>
              <el-form-item label="url:">
                <span>{{ props.row.server_url }}</span>
              </el-form-item>
              <el-form-item label="系统版本:">
                <span>{{ props.row.os }}</span>
              </el-form-item>
              <el-form-item label="终端型号:">
                <span>{{ props.row.imei }}</span>
              </el-form-item>
              <el-form-item label="CPU型号:">
                <span>{{ props.row.cpu_model }}</span>
              </el-form-item>
              <el-form-item label="CPU频率:">
                <span>{{ props.row.cpu_frequency }}</span>
              </el-form-item>
              <el-form-item label="CPU核数:">
                <span>{{ props.row.cpu_cores }}</span>
              </el-form-item>
              <el-form-item label="屏幕尺寸:">
                <span>{{ props.row.screen_size }}</span>
              </el-form-item>
              <el-form-item label="网络:">
                <span>{{ props.row.net_work }}</span>
              </el-form-item>
              <el-form-item label="分辨率:">
                <span>{{ props.row.cpu_cores }}</span>
              </el-form-item>
              <el-form-item label="运行内存:">
                <span>{{ props.row.ram }}</span>
              </el-form-item>
              <el-form-item label="储存空间:">
                <span>{{ props.row.internal_storage_space }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="设备名称" prop="name"></el-table-column>
        <el-table-column label="设备Appium配置" >
          <template slot-scope="scope" >
            <el-select v-model="scope.row.value" placeholder="请选择" size="mini">
              <el-option v-for="item in deploy_infos" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="检查" width="180">
          <template slot-scope="scope">
            <el-button size="mini" @click="handlecheck(scope.row.id)" type='primary' plain disabled>是否连接</el-button>
          </template>
        </el-table-column>
      </el-table>
      <section style="margin:0.5rem;text-align:center;">
        <el-switch v-model="reports" active-color="#13ce66" inactive-color="#ff4949" active-text='报告模式' inactive-text="调试模式" @change='switchcg1'></el-switch>
        <el-switch v-model="performance" active-color="#13ce66" inactive-color="#ff4949" active-text='性能测试' inactive-text="适配测试" @change='switchcg2'></el-switch>

      </section>
    </template>
    <div class="footer">
      <el-button-group>
        <el-button type="success" size="small" @click="startRun" round>开始</el-button>
        <el-button type="info" size="small" @click="modelflag(false)" round>取消</el-button>
      </el-button-group>
    </div>
  
    <!-- <el-dialog title="请选择您想要运行的测试工具:" :visible.sync="centerDialogVisible" width="30%" :append-to-body='true'>
      <el-select v-model="task_tool" placeholder="请选择" size='small' style='width:100%;'>
        <el-option v-for="item in options" :key="item.id" :label="item" :value="item">
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false" size='mini'>取 消</el-button>
        <el-button type="primary" @click="startRun" size='mini'>确 定</el-button>
      </span>
    </el-dialog> -->


  </div>
</template>



<script>
import {mapState} from 'vuex'

  export default {
    data() {
      return {
        emptydevice:'暂无数据,请先选择测试设备！！',
        tableData: [],
        deploy_infos:[],
        reports:false, 
        performance:false,
        centerDialogVisible:false,
        // options:['cucumber','behave'],
        // task_tool:'cucumber',
      }
    },
    props: ['projectid','codeLang','runid','runtype'],
    computed:{
      ...mapState({
          isDevicesData:state => state.isDevicesData,
          isLoginName:state => state.isLoginName,
      }),
    },
    mounted(){
      this.getdata()
    },
    methods: {
      switchcg1(){
        if(this.reports){
          return this.$message.warning('您已打开报告模式,请注意!');
        }
      },
      switchcg2(){
        if(this.performance){
          return this.$message.warning('您已选择性能测试,请注意!');
        }
      },
      //修改模态flag
      modelflag(flag){   
          this.$store.commit('BeforeRunFlag',flag)
      },
      //获取设备和appium数据
      getdata(){
        if(this.isDevicesData.length==0){
          return this.$message.warning('请先选择测试设备！！')
        }
        let _this=this;
        console.log(this.isDevicesData)
        let data={
          project_id:this.projectid,
          devices:JSON.stringify(this.isDevicesData)
        }
        _this.$axios({
            method:'post',
            url:'/api/project/get_project_deploys_devices',
            data:_this.$qs.stringify(data),
        }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.deploy_infos=res.data.deploy_infos
              _this.tableData=res.data.device_infos
            }
        })
      },
      // 检查连接
      handlecheck(id){
        console.log(id)
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/device/check_device_connect',
          data:_this.$qs.stringify({'device_id':id}),
        }).then(function (res){
          // console.log(res.data);
          if(res.data.status==200){
            return _this.$message.success(res.data.msg)
          }
          return _this.$message.error(res.data.msg)
        })
      },
      //开始运行
      startRun(){
        // console.log(this.runid,this.runtype)
        // this.centerDialogVisible=false;
        let DevicesData=[]
        for (let i of this.tableData) {
          if(!i['value']){
            return this.$message.error('请先选择Appium配置！')
          }else{
            DevicesData.push({'device_id':i.id,'deploy_id':i.value})
          }
        }

        let data={
          user_name:this.isLoginName,
          script_type:this.codeLang,
          project_id:this.projectid,
          task_type:'compatibility',
          devices:JSON.stringify(DevicesData),
          task_model:this.reports,
          performance:this.performance,
          // task_tool:this.task_tool
        }
        let _this=this;
        // 单个用例
        if(this.runtype=='case'){
          data['test_case_id']=this.runid
          console.log(data)
          _this.$axios({
              method:'post',
              url:'/api/task/new_test_case_task',
              data:_this.$qs.stringify(data),
          }).then(function (res){
              console.log(res);
              if(res.data.status==200){
                _this.$store.commit('isRunTasks',res.data.task_id)
                let $index = _this.$store.state.isFinishData.indexOf(res.data.task_id);
                if($index != -1){
                  _this.$store.commit('isRenewTask',$index)
                }
                _this.modelflag(false)
                return _this.$message.success(res.data.msg+',可以在任务进度中查看!')
              }
              return _this.$message.error(res.data.msg)
          })
        }
        // 自定义用例数组
        else if(this.runtype=='caselist'){
          // console.log('hahahahaha')
          // console.log(this.projectid,this.codeLang,this.runid,this.runtype)
          data['test_case_id_list']=JSON.stringify(this.runid)
          console.log(data)
          _this.$axios({
            method:'post',
            url:'/api/task/new_test_cases_task',
            data:_this.$qs.stringify(data),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.$store.commit('isRunTasks',res.data.task_id)
              let $index = _this.$store.state.isFinishData.indexOf(res.data.task_id);
              if($index != -1){
                _this.$store.commit('isRenewTask',$index)
              }
              _this.modelflag(false)
              return _this.$notify.success(res.data.msg+',可以在任务进度中查看!')
            }
            return _this.$message.error(res.data.msg)
          })
        }
        // 用例集
        else{
          data['test_suit_id']=this.runid
          _this.$axios({
            method:'post',
            url:'/api/task/new_test_suit_task',
            data:_this.$qs.stringify(data),
          }).then(function (res){
            console.log(res);
            if(res.data.status==200){
              _this.$store.commit('isRunTasks',res.data.task_id)
              let $index = _this.$store.state.isFinishData.indexOf(res.data.task_id);
              if($index != -1){
                _this.$store.commit('isRenewTask',$index)
              }
              _this.modelflag(false)
              return _this.$notify.success(res.data.msg+',可以在任务进度中查看!')
            }
            return _this.$message.error(res.data.msg)
          })
        }
        
      },
      //css样式
      isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==3 ){
            return 'text-align: center;'
          }
      },
      isThead({row,column,rowIndex,columnIndex}){
        if(columnIndex==3){
          return 'text-align: center;'}
      },
    },
    filters:{
      condition:function(data){
        // console.log(data[0])
        let text=''
        if(data[0]==1){
          text+='兼容测试/'
        }
        if(data[1]==1){
          text+='性能测试/'
        }
        if(data[2]==1){
          text+='稳定测试'
        }
        return text
      }
    },

  };
</script>

<style scoped>
  .box{
    width: 70%;
    background-color: #fff;
    margin:  0 auto;
    margin-top: 3%;
    margin-bottom: 5%;
    padding: 2em;
    border-radius: 10px;
    position: relative;
  }
  .footer{
    padding: 1em;
    margin-left: 0;
    height: 30px;
    text-align: center;
  }
  .titleh3{
    text-align:center;
    margin-bottom:10px;
    color: #666;
  }
  .demo-table-expand {
    font-size: 0;
  }
  .el-form-item {
    color: #99a9bf;
    margin-right: 0;
    margin-bottom: 0;
    width: 33%;

  }
  .el-switch{
    margin: 1rem;
  }
</style>