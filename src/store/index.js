import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {

        //是否登录成功
        isLoginFlag:false,

        //模态框显示
        isModelFlag:false,

        //模态框内容
        isModelData:false,

        //token
        isToken:'',

        //username
        isLoginName:'',

        //新数据
        isAddData:"",

        //project模态框,Data
        isFromFlag:false,

        isFromData:'',

        isFromShow:true,

        // 新增步骤模态
        isStepFlag:false,

        // 顺序模板
        isOrderFlag:false,

        // 设备模态,缓存
        isDevicesFlag:false,
        isDevicesData:[],

        // 参数模态,缓存
        isParameterFlag:false,

        // 运行前模态,缓存
        BeforeRunFlag:false,

        // 步骤实现代码id
        isStepCodeid:false,

        // 正在跑的任务项目
        isRunTasks:[],

        // 完成的任务项目
        isFinishData:[],

        // 当前选择语言
        isCodeLang:'',
        
        // 温馨提示
        isTipsFlag:false,
    },
    mutations: {
        changeToken: (state, status) => {
            state.isToken = status
        },
        changeLoginName: (state, status) => {
            state.isLoginName = status
        },
        changeLoginFlag(state, status){
            state.isLoginFlag = status
        },

        isModelFlag(state, status){
            state.isModelFlag = status
        },

        isModelData(state, status){
            state.isModelData = status
        },

        isAddData(state, status){
            state.isAddData = status
        },

        isFromFlag(state, status,id){
            state.isFromFlag = status
        },

        isFromData(state, status){
            state.isFromData = status
        },

        isFromShow(state, status){
            state.isFromShow = status
        },

        isStepFlag(state, status){
            state.isStepFlag = status
        },

        isOrderFlag(state, status){
            state.isOrderFlag = status
        },

        isTipsFlag(state, status){
            state.isTipsFlag = status
        },

        isDevicesFlag(state, status){
            state.isDevicesFlag = status
        },

        isDevicesData(state, status){
            state.isDevicesData = status
        },

        isCodeLang(state, status){
            state.isCodeLang = status
        },

        isParameterFlag(state, status){
            state.isParameterFlag = status
        },

        BeforeRunFlag(state, status){
            state.BeforeRunFlag = status
        },

        isStepCodeid(state, status){
            state.isStepCodeid = status
        },

        isRunTasks(state,status){
            state.isRunTasks.push(status)
        },
        isFinishTasks(state,status){
            state.isRunTasks.splice(status,1)
        },

        isFinishData(state,status){
            state.isFinishData.unshift(status)
        },

        isRenewTask(state,status){
            state.isFinishData.splice(status,1)
        },
        isEmptyTask(state){
            state.isRunTasks = []
        },
        logOut(state){
            state.isToken=''
            state.isLoginName = ''
            state.isStepFlag = false
            state.isOrderFlag = false
            state.isFromFlag=false
            state.isLoginFlag = false
            state.isDevicesFlag=false
            state.BeforeRunFlag=false
            state.isParameterFlag=false
            state.isDevicesData = []
            state.isCodeLang=''
            state.isStepCodeid=false
            state.isRunTasks=[]
            state.isFinishData=[]
            state.isTipsFlag = false
        },
    },
    getters: {
        getRunTasks(state) {
          return state.isRunTasks.length
        },
        getFinishfive(state) {
            return state.isFinishData.slice(0,4)
        },
    }

})



export default store
