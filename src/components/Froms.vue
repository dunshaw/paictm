<template>
  <div id="myforms">
    <el-form ref="form" :model="sizeForm" label-width="100px" size="mini" :rules = "rules" label-position="left">
      <el-button icon="el-icon-close" size="mini" class="closebtn" @click="closeModel"></el-button>
      <el-tabs v-model="activeName">
        <el-tab-pane label="主要信息" name="first">
          <el-form-item label="系统" style="padding-left:5%" prop='os'>
            <el-select v-model="sizeForm.os" placeholder="请选择所属系统" class="style1">
              <el-option label="IOS" value="ios"></el-option>
              <el-option label="Android" value="android"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备类型" style="padding-left:5%" prop='device_type'>
            <el-select v-model="sizeForm.device_type" placeholder="请选择设备类型" class="style1">
              <el-option label="IOS" value="IOS"></el-option>
              <el-option label="Android" value="ANDROID"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="执行机" style="padding-left:5%" prop='connect_computer'>
            <el-select v-model="sizeForm.connect_computer_id" placeholder="请绑定执行机" class="style1">
              <el-option :label="item.name+': ('+item.file_path+')'" :value="item.id" v-for="item in computers" :key='item.id'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用途" size="mini" style="padding-left:5%" prop='test_type'>
            <el-checkbox-group v-model="sizeForm.test_type" class="style1">
              <el-checkbox-button label="功能/适配测试" name="type" ></el-checkbox-button>
              <el-checkbox-button label="性能测试" name="type"></el-checkbox-button>
              <el-checkbox-button label="稳定性测试" name="type"></el-checkbox-button>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="设备名" prop="name" style="padding-left:5%">
            <el-input v-model="sizeForm.name" class="style1" :disabled="!datatype"></el-input>
          </el-form-item>
          <el-form-item label="品牌" style="padding-left:5%" prop="brand">
            <el-select v-model="sizeForm.brand" placeholder="请选择所属品牌" class="style1">
              <el-option v-for="item in brands" :label='item' :value ='item' :key='item.id'></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="Udid" style="padding-left:5%">
            <el-input v-model="sizeForm.udid" class="style1"></el-input>
          </el-form-item>
          <el-form-item label="IP地址" style="padding-left:5%">
            <el-input v-model="sizeForm.ip" class="style1"></el-input>
          </el-form-item>
          <el-form-item label="Server Url" style="padding-left:5%">
            <el-input v-model="sizeForm.server_url" class="style1"></el-input>
          </el-form-item>
          <el-form-item label="检查连接" style="font-size:12px;padding-left:5%">
            <el-button type="primary" style="margin-left: 50px;" round size="mini" @click='nofunction'>Appium</el-button>
            <el-button type="primary" style="margin-left: 50px;" round size="mini" @click='handlecheck' disabled>移动设备</el-button>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="其他信息" name="second" style="font-size:12px;">
<!--           <el-form-item label="终端型号" class="style2">
            <el-input v-model="sizeForm.terminal_type" ></el-input>
          </el-form-item> -->
          <el-form-item label="系统版本" class="style2">
            <el-input v-model="sizeForm.system_version"></el-input>
          </el-form-item>
          <el-form-item label="IMEI" class="style2">
            <el-input v-model="sizeForm.imei"></el-input>
          </el-form-item>
          <el-form-item label="CPU 型号" class="style2">
            <el-input v-model="sizeForm.cpu_model"></el-input>
          </el-form-item>
          <el-form-item label="CPU 核数" class="style2">
            <el-input v-model="sizeForm.cpu_cores"></el-input>
          </el-form-item>
          <el-form-item label="CPU 频率" class="style2">
            <el-input v-model="sizeForm.cpu_frequency"></el-input>
          </el-form-item>
          <el-form-item label="屏幕尺寸" class="style2">
            <el-input v-model="sizeForm.screen_size"></el-input>
          </el-form-item>
          <el-form-item label="分辨率" class="style2">
            <el-input v-model="sizeForm.resolution"></el-input>
          </el-form-item>
          <el-form-item label="网络" class="style2">
            <el-input v-model="sizeForm.net_work"></el-input>
          </el-form-item>
          <el-form-item label="运行内存" class="style2">
            <el-input v-model="sizeForm.ram"></el-input>
          </el-form-item>
          <el-form-item label="内部空间" class="style2">
            <el-input v-model="sizeForm.internal_storage_space"></el-input>
          </el-form-item>
        </el-tab-pane>
      </el-tabs>
      <el-footer style='padding:0;' v-if="editFlag">
        <el-button icon="el-icon-check" size="mini" class="commitbtn" type="success"  @click="dialog"></el-button>
        <el-button icon="el-icon-delete" size="mini" type="danger" @click="mydelete" v-if="!datatype"></el-button>
      </el-footer> 
    </el-form>
  </div>
</template>




<script>
import {mapState} from 'vuex'


export default {
    name: 'myforms',
    data() {
      return {
        activeName:'first',
        datatype:true,
        computers:[],
        brands:[],
        sizeForm: {
          os:'',
          connect_computer_id:'',
          name: '',
          logo:'',
          udid: '',
          ip: '',
          device_type:'',
          server_url:'',
          test_type: [],
          brand:'',
          system_version:'',
          imei:'',
          cpu_model:'',
          cpu_cores:'',
          cpu_frequency:'',
          screen_size:'',
          resolution:'',
          net_work:'',
          ram:'',
          internal_storage_space:'',
        },
        rules:{
            name:[
                { required: true, message: '请输入设备名', trigger: 'blur' },
                // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
            ],
            os:[
                { required: true, message: '请选择系统', trigger: 'change' }
            ],
            connect_computer_id:[
                { required: true, message: '请绑定执行机', trigger: 'change' }
            ],
            device_type:[
                { required: true, message: '请选择设备类型', trigger: 'change' }
            ],
            brand:[
                { required: true, message: '请选择品牌', trigger: 'change' }
            ],
            test_type:[
                { type: 'array', required: true, message: '请至少选择一个', trigger: 'change' }
            ],
        },
      }
    },
    props: ['editFlag'],
    created(){
      let _this = this
      if(this.$store.state.isModelData){
        this.sizeForm=this.$store.state.isModelData
        this.condition()
        this.datatype=false
      }else{
        this.datatype=true
      }
      // 执行2个并发请求
      this.$axios.all([this.getcomputers(),this.getbrands()]).then(this.$axios.spread(function(acct,perms){
        // console.log(acct,perms)
        if(acct.data.status==200){
          _this.computers=acct.data.computer_list
        }
        if(perms.data.status==200){
          _this.brands=perms.data.data
        }
      }))
      .catch(error=>{
        console.log(error);
        // return this.$message.error(error)
      })
    },
    methods:{
      nofunction(){
        return this.$message.error('sorry,功能正在开发~~~')
      },
      //获取执行机
      getcomputers(){
        return this.$axios.post('/api/computer/get_computers')
      },
      //获取品牌
      getbrands(){
        return this.$axios.post('/api/devices/get_brands')
      },
      //close模态框
      closeModel(){
        this.$store.commit('isModelFlag',false)
        this.$store.commit('isModelData',false)
      },
      // 检查连接
      handlecheck(){
        let _this=this;
        _this.$axios({
          method:'post',
          url:'/api/device/check_device_connect',
          data:_this.$qs.stringify({'device_id':_this.sizeForm.id}),
        }).then(function (res){
          // console.log(res.data);
          if(res.data.status==200){
            return _this.$message.success(res.data.msg)
          }
          return _this.$message.error(res.data.msg)
        })
      },
      // 更新上传数据
      dialog(){
        let _this = this;
        this.$confirm('此操作将更新设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if(this.sizeForm.os.toLowerCase() != this.sizeForm.device_type.toLowerCase()){
            return this.$message.error('系统和设备类型不匹配!')
          }
          //新建
          if(_this.datatype){
            _this.$refs.form.validate(function(valid){
              if(valid){
                let data = {
                    name: _this.sizeForm.name,
                    connect_computer_id:_this.sizeForm.connect_computer_id,
                    ip: _this.sizeForm.ip,
                    udid: _this.sizeForm.udid,
                    appium_version_id: '', 
                    device_type: _this.sizeForm.device_type,
                    os:_this.sizeForm.os,
                    logo:_this.sizeForm.logo,
                    test_type:JSON.stringify(_this.sizeForm.test_type),
                    isrun:'',
                    server_url:_this.sizeForm.server_url,
                    image_url:'',
                    brand:_this.sizeForm.brand,
                    system_version:_this.sizeForm.system_version,
                    imei:_this.sizeForm.imei,
                    cpu_model:_this.sizeForm.cpu_model,
                    cpu_cores:_this.sizeForm.cpu_cores,
                    cpu_frequency:_this.sizeForm.cpu_frequency,
                    screen_size:_this.sizeForm.screen_size,
                    resolution:_this.sizeForm.resolution,
                    device_detailscol:'',
                    net_work:_this.sizeForm.net_work,
                    ram:_this.sizeForm.ram,
                    internal_storage_space:_this.sizeForm.internal_storage_space,
                };
                console.log(data)
                _this.$axios({
                    method:'post',
                    url:'/api/device/create',
                    data:_this.$qs.stringify(data)
                }).then(function (res){
                    if(res.data.status==200){
                      console.log(_this.sizeForm.test_type)
                        _this.$message.success(res.data.msg)
                        _this.$emit('transferData',true)
                        _this.closeModel() 
                    }else{
                      return _this.$message.error(res.data.msg)
                    }
                }).catch(function (error) {
                    console.log(error)
                })
              }else{
                  console.log(valid)
                  return false;
              }
            })
          }
          //更新
          else{
            _this.$refs.form.validate(function(valid){
              if(valid){
                let data = {
                    id:_this.sizeForm.id,
                    name: _this.sizeForm.name,
                    connect_computer_id:_this.sizeForm.connect_computer_id,
                    ip: _this.sizeForm.ip,
                    udid: _this.sizeForm.udid,
                    appium_version_id: '', 
                    device_type:_this.sizeForm.device_type,
                    os:_this.sizeForm.os,
                    logo:_this.sizeForm.logo,
                    test_type:JSON.stringify(_this.sizeForm.test_type),
                    isrun:'',
                    server_url:_this.sizeForm.server_url,
                    image_url:'',
                    brand:_this.sizeForm.brand,
                    system_version:_this.sizeForm.system_version,
                    imei:_this.sizeForm.imei,
                    cpu_model:_this.sizeForm.cpu_model,
                    cpu_cores:_this.sizeForm.cpu_cores,
                    cpu_frequency:_this.sizeForm.cpu_frequency,
                    screen_size:_this.sizeForm.screen_size,
                    resolution:_this.sizeForm.resolution,
                    device_detailscol:'',
                    net_work:_this.sizeForm.net_work,
                    ram:_this.sizeForm.ram,
                    internal_storage_space:_this.sizeForm.internal_storage_space,
                };
                _this.$axios({
                    method:'post',
                    url:'/api/device/update',
                    data:_this.$qs.stringify(data)
                }).then(function (res){
                    console.log(res);
                    if(res.data.status==200){
                        _this.$message.success(res.data.msg)
                        _this.$emit('transferData',true)
                        _this.closeModel()
                    }else{
                      return _this.$message.error(res.data.msg)
                    }
                }).catch(function (error) {
                    console.log(error)
                })
              }else{
                  console.log(valid)
                  return false;
              }
            })
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      },
      mydelete(){
        let _this = this;
        this.$confirm('此操作将删除设备, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(_this.sizeForm.id)
          let data = {
            id:_this.sizeForm.id,
          }
          _this.$axios({
              method:'post',
              url:'/api/device/delete',
              data:_this.$qs.stringify(data)
          }).then(function (res){
              console.log(res);
              if(res.data.status===200){
                _this.$emit('transferDalete',data)
                _this.$notify({
                title: '成功',
                message: res.data.msg,
                type: 'success'});
                _this.closeModel() 
              }else{
                _this.$notify.error({
                title: '失败',
                message: res.data.msg});
              }
          }).catch(function (error) {
              console.log(error)
          })
        }).catch(() =>{
          this.$message({
            type: 'info',
            message: '已取消'
          }); 
        })
      },
      // 修改type数据显示
      condition(){
        let _this=this;
        let data = []
        if(String(_this.sizeForm.test_type)[0]==='1'){
          data.push('功能/适配测试')
        }
        if(String(_this.sizeForm.test_type)[1]==='1'){
          data.push('性能测试')
        }
        if(String(_this.sizeForm.test_type)[2]==='1'){
          data.push('稳定性测试')
        }
        _this.sizeForm.test_type=data
      },
    },
  };
</script>

<style scoped>
  #myforms{
    background-color: rgba(0,0,0,.5);
    width: 100%;
    height: 100%;
    font-size: 12px;
    position: fixed;
    top: 0;
    left: 0;
    z-index:99;
  }
  .el-form{
    width: 40%;
    max-height: 85%;
    background-color: #fff;
    margin:  0 auto;
    margin-top: 2%;
    margin-bottom: 25%;
    padding: 2em;
    border-radius: 10px;
    position: relative;
    overflow-y:auto;
  }
  .style1{
    width: 80%;
    /*margin-left: 50px;*/
  }
  .style2{
    width: 40%;
    display: inline-block;
  }
  .mybtn{
    margin-left: 40%;
    text-align: center;
    /*display: inline;*/

  }
  .closebtn{
    display: inline; 
    position: absolute;
    right:2%; 
    z-index: 999;
    border: none;
  }
  .commitbtn{
    display: inline; 
    position: absolute;
    right:2%; 
  }
</style>