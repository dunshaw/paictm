import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'





Vue.use(Router);

function resolveView(View){
  return ()=> import(/*webpack chunk name*/ `@/pages/${View}.vue`)
}




const routes = [
    {
        path:'',
        redirect:'/Login'
    },
    {
        path:'/Login',
        name:'Login',
        component:resolveView('Login'),
        meta:{keepAlive:false}
    },
    {
        path:'/Home',
        component:resolve => require(['@/pages/Home'] , resolve),
        children:[
            // logon
            { path:'', redirect:'/Project' },
            // header模块
            { path:'/Project',
              component: resolveView('tabbar/Project'),
              meta:{keepAlive:false} 
            },
            { path:'/Help', component: resolveView('tabbar/Help'),meta:{keepAlive:false}},
            { path:'/Counts', component: resolveView('tabbar/Counts'),meta:{keepAlive:false}},
            { path:'/Systems', component: resolveView('tabbar/Systems'),meta:{keepAlive:false}},
            //  兼容性测试
            { path:'/Functions', 
              component : resolve => require(['@/pages/project/Functions'] , resolve), 
              meta:{keepAlive:false}
              // component: ProjectFunctions 
            },
            { path:'/Project/FunctionTestCase', name:'functiontestcase',component: resolve => require(['@/pages/project/FunctionTestCase'] , resolve),meta:{keepAlive:false} },
            { path:'/Project/FunctionTestCase/Editor', name:'functiontestcasesteps',component: resolve => require(['@/pages/project/FunctionTestCaseEditor'] , resolve),meta:{keepAlive:false} },
            { path:'/CommandsControl', name:'commands',component: resolve => require(['@/pages/project/CommandsControl'] , resolve),meta:{keepAlive:false} },
            { path:'/Project/FunctionTestSuite', name:'functiontestsuite',component: resolve => require(['@/pages/project/FunctionTestSuite'] , resolve),meta:{keepAlive:false}  },
            { path:'/Project/FunctionTestSuite/Edit', name:'functiontestsuiteedit',component: resolve => require(['@/pages/project/FunctionTestSuiteEdit'] , resolve),meta:{keepAlive:false}  },
            { path:'/Project/FunctionAppium', name:'functionappium',component: resolve => require(['@/pages/project/FunctionAppium'] , resolve),meta:{keepAlive:false} },
            { path:'/Project/FunctionAppium/Details', name:'functionappiumdetails',component: resolve => require(['@/pages/project/FunctionAppiumDetails'] , resolve),meta:{keepAlive:false} },
            // 稳定性测试
            { path:'/Stability', component : resolve => require(['@/pages/project/FunctionMonKey'] , resolve),},

            // 性能测试
            { path:'/Performance', component : resolve => require(['@/pages/project/Performance'] , resolve), },
            { path:'/PerformanceEdit', name:'performanceedit', component : resolve => require(['@/pages/project/PerformanceEdit'] , resolve), },
            //  管理项目

            { path:'/Equipment', component: resolve => require(['@/pages/systems/Equipment'] , resolve) },
            { path:'/Engineering', component: resolve => require(['@/pages/systems/Engineering'] , resolve) },
            { path:'/Mailbox', component: resolve => require(['@/pages/systems/Mailbox'] , resolve) },
            { path:'/Computers', component: resolve => require(['@/pages/systems/Computers'] , resolve) },
            { path:'/Appium', component: resolve => require(['@/pages/systems/Appium'] , resolve) },
            { path:'/Appium/add', component: resolve => require(['@/pages/systems/AppiumAdd'] , resolve) },
            { path:'/Appium/edit', name:'appiumedit',component: resolve => require(['@/pages/systems/AppiumEdit'] , resolve) },
            // 报告历史记录模块
            { path:'/TaskHistory', name:'taskhistorys',component: resolve => require(['@/pages/report/Historys'] , resolve) },
            { path:'/TaskHistory/Details',component: resolve => require(['@/pages/report/Historydetails'] , resolve) },


        ]
    },
    { path:'/ReportsIndex', name:'reportsdata', component : resolve => require(['@/pages/report/ReportsData'] , resolve), },

]


const router = new Router({
    routes,

});

router.beforeEach((to, from, next) => {
    
    const token = store.state.isToken
    if(to.meta.requireAuth){
        if(token){
            next()
        }else{
            console.log('请登录.')
            next({
                path: '/Login'
            })
        }
    }else{
       next() 
    }  
})

export default router