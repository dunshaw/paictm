<template>
  <div>
    <el-header style="height:40px;">
      <el-breadcrumb separator-class="el-icon-arrow-right" style="font-size:12px;">
        <el-breadcrumb-item :to="{ path: '/Project' }" >工作台</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/Functions' }" >兼容性测试</el-breadcrumb-item>
        <el-breadcrumb-item>{{this.$route.query.appium_config_name}}</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>

    <el-main class="mainbox">
      <el-row style="height:40px;">
        <el-col :span="24"><div>
          <el-tag size="medium" type="info">Appium版本</el-tag>
          <el-select v-model="appium_version" placeholder="请选择Appium版本" size="mini" style="width:20%;" 
          :disabled='flag' @change="getdetailsdata(appium_version,0)">
            <el-option
              v-for="item in vsoptions"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
          <el-tag size="medium" type="info" style="margin-left:5%;">Appium配置名称</el-tag>
          <el-input v-model="detailsname" placeholder="请输入Appium配置名称" size="mini" style="width:30%;" :disabled='flag'></el-input>
          <el-button round size='mini'  @click="backto" style="float:right">返回</el-button>
          <el-button @click="savedetails" size="mini" type="success" style="float:right;margin-right:10px;" round>保 存</el-button>
        </div></el-col>
      </el-row>

      <el-table ref="filterTable" :data="tableData" style="width: 100%" :cell-style="isCenter" stripe :header-cell-style="isThead" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="name" label="参数名" width="180">
        </el-table-column>
        <el-table-column prop="desc" label="描述">
        </el-table-column>
        <el-table-column label="参数值">
          <template slot-scope="scope">
            <el-popover trigger="click" placement="top"
              padding='20px'>
              <h3 style="margin:5px;color:#f35626;text-align:center;">编辑参数</h3>
              <el-input v-model="scope.row.value" size="mini" suffix-icon="el-icon-edit" placeholder="请输入参数值">
                <template slot="prepend">{{scope.row.name}}</template>
              </el-input>
              <div slot="reference" class="name-wrapper">
                {{ scope.row.value |conditions }}
              </div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="essential" label="属性" width="100"
          :filters="[{ text: '必填', value: '必填' }, { text: '选填', value: '选填' }]"
          :filter-method="filterTag"
          filter-placement="bottom-end">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.essential === '必填' ? 'danger' : 'info'"
              disable-transitions>{{scope.row.essential}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        flag:null,
        detailsid:'',
        detailsname:'',
        projectid:'',
        projectname:'',
        appium_version:'',
        vsoptions:[],
        tableData: []
      }
    },
    created(){
      this.getRouterData()
    },
    filters:{
      conditions:function(data){
        // console.log(data)
        if(data){
          return data
        }
        return '请输入参数值'
      }
    },
    methods: {
      //接收传参
      getRouterData(){
        this.projectid = this.$route.query.project_id
        this.projectname = this.$route.query.project_name
        if(this.$route.query.appium_config_id){
          this.flag=true
          this.detailsid = this.$route.query.appium_config_id
          this.detailsname = this.$route.query.appium_config_name
          this.getdetailsdata(0,this.detailsid)
        }else{
          this.getAppiumversion()
        }

      },
      filterTag(value, row) {
        return row.essential === value;
      },
      //css样式
      isCenter({row,column,rowIndex,columnIndex}){
          if(columnIndex==3){
            return 'color:#7BAEE4;font-size:12px;letter-spacing:1px;font-weight:500;text-align: center;'
          }else{
            return 'color:#666;font-size:12px;letter-spacing:1px;font-weight:500;text-align: center;'
          }
      },
      isThead({row,column,rowIndex,columnIndex}){
          return 'color:#666;font-size:14px;letter-spacing:1px;font-weight:bold;text-align: center;'
      },
      //保存
      savedetails(){
        // console.log(this.appium_version,this.detailsname)
        if(this.appium_name=='' || this.detailsname == ''){
          return this.$message.warning("请填写Appium配置名!");
        }
        let _this=this;
        for (let i of this.tableData) {
          if (i.essential == '必填' && i.value=='') {
            return this.$message.warning("请填写完所有必填项!");}
        }
        let data={
          'deploy_id':this.detailsid,
          'deploy_name':this.detailsname,
          'appium_name':this.appium_version,
          'create_by':this.$store.state.isLoginName,
          'project_id':this.projectid,
          'deploy_data':JSON.stringify(this.tableData),
        }
        console.log(data)
        _this.$axios({
            method:'post',
            url:'/api/deploy/deploy_parameters_save',
            data:_this.$qs.stringify(data),
        }).then(function (res){
            console.log(res);
            if(res.data.status==200){
                _this.$router.push({
                  name:'functionappium',
                  path:'/Project/FunctionAppium',
                  query:{
                    project_id:_this.projectid,
                    project_name:_this.projectname,
                  }
                })
                return _this.$message.success("appium参数配置成功!");
            }else{
              return _this.$message.error(res.data.msg);  
            }
        })
      },
      //获取appium版本
      getAppiumversion(){
        let _this=this;
        _this.$axios({
            method:'post',
            url:'/api/appium/get_appium_param',
        }).then(function (res){
            console.log(res);
            if(res.data.status==200){
                _this.vsoptions = res.data.data
            }
        })
      },
      //获取配置数据
      getdetailsdata(version,deploy){
        let _this=this;
        let data={"appium_id":version,'project_id':_this.projectid,'deploy_id':deploy}
        console.log(data)
        _this.$axios({
            method:'post',
            url:'/api/appium/get_appium_keys',
            data:_this.$qs.stringify(data),
        }).then(function (res){
            console.log(res);
            if(res.data.status==200){
                _this.tableData=res.data.appium_key_list
                if(res.data.appium_name){
                  _this.appium_version=res.data.appium_name
                }
                return _this.$message.success("版本数据获取成功!"); 
            }
        })
      },
      backto(){
        this.$router.back(-1)
      },
    }
  };
</script>
<style scoped>
  .mainbox{
/*    border: 1px solid red;*/
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    width:95%;
    margin:0 auto;
  }
  .el-pagination{
    margin: 2em;
  }
</style>