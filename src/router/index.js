import Vue from 'vue'
import VueRouter from 'vue-router'
import AboutView from '../views/AboutView'
import store from "../../store";
import ElementUI from "element-ui";

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Manage',
        component: () => import('../views/Manage'),
        redirect: '/front/home',
        children: [
            {
                path: 'home',
                name: 'Home',
                meta: {headerName: '首页',isAuth: true},
                component: () => import('../views/Home')
            },
            {
                path: 'user',
                name: 'User',
                meta: {headerName: '用户管理', isAuth: true},
                component: () => import('../views/User')
            },
            {
                path: 'person',
                name: 'Person',
                meta: {headerName: '个人信息', isAuth: true},
                component: () => import('../views/Person')
            },
            {
                path: 'password',
                name: 'Password',
                meta: {headerName: '修改密码', isAuth: true},
                component: () => import('../views/Password')
            },
            {
                path: 'file',
                name: 'File',
                meta: {headerName: '所有文件', isAuth: true},
                component: () => import('../views/File')
            },
            {
                path: 'picture',
                name: 'Picture',
                meta: {headerName: '图片管理', isAuth: true},
                component: () => import('../views/Picture')
            },
            {
                path: 'music',
                name: 'Music',
                meta: {headerName: '音乐管理', isAuth: true},
                component: () => import('../views/Music')
            },
            {
                path: 'video',
                name: 'Video',
                meta: {headerName: '视频管理', isAuth: true},
                component: () => import('../views/Video')
            },
            {
                path: 'role',
                name: 'Role',
                meta: {headerName: '角色管理', isAuth: true},
                component: () => import('../views/Role')
            },
            {
                path: 'roleSetting',
                name: 'RoleSetting',
                meta: {headerName: '角色设置',isAuth: true},
                component: () => import('../views/RoleSetting')
            },
            {
                path: 'menu',
                name: 'Menu',
                meta: {headerName: '菜单管理', isAuth: true},
                component: () => import('../views/Menu')
            },
            {
                path: 'dictIcon',
                name: 'DictIcon',
                meta: {headerName: '图标管理', isAuth: true},
                component: () => import('../views/DictIcon')
            },
            {
                path: 'course',
                name: 'Course',
                meta: {headerName: '课程管理', isAuth: true},
                component: () => import('../views/Course')
            },
            {
                path: 'teacher',
                name: 'Teacher',
                meta: {headerName: '教师管理', isAuth: true},
                component: () => import('../views/Teacher')
            },
            {
                path: 'student',
                name: 'Student',
                meta: {headerName: '学生管理', isAuth: true},
                component: () => import('../views/Student')
            },
            {
                path: 'mapContainer',
                name: 'MapContainer',
                meta: {headerName: '缺德地图', isAuth: true},
                component: () => import('../views/MapContainer')
            },
            {
                path: 'article',
                name: 'Article',
                meta: {headerName: '文章管理', isAuth: true},
                component: () => import('../views/Article')
            },
        ]
    },
    {
        path: '/about',
        name: 'About',
        component: AboutView
    },
    {
        path: '/login',
        name: "Login",
        meta: {isAuth: false},
        component: () => import('../views/Login')
    },
    {
        path: '*',
        name: "NotFound",
        meta: {isAuth: false},
        component: () => import('../views/404')
    },
    {
        path: '/front',
        name: "Front",
        meta: {isAuth: false},
        component: () => import('../views/front/Front'),
        children: [
            {
                path: 'home',
                name: "FrontHome",
                meta: {isAuth: false},
                component: () => import('../views/front/Home')
            },
            {
                path: 'itemMusic',
                name: "ItemMusic",
                meta: {isAuth: false},
                component: () => import('../views/front/ItemMusic')
            },
            {
                path: 'itemPicture',
                name: "ItemPicture",
                meta: {isAuth: false},
                component: () => import('../views/front/ItemPicture')
            },
            {
                path: 'itemVideo',
                name: "ItemVideo",
                meta: {isAuth: false},
                component: () => import('../views/front/ItemVideo')
            },
            {
                path: 'videoDetail',
                name: "VideoDetail",
                meta: {isAuth: false},
                component: () => import('../views/front/VideoDetail')
            },
            {
                path: 'article',
                name: "Article",
                meta: {isAuth: false},
                component: () => import('../views/front/Article')
            },
            {
                path: 'articleDetail',
                name: "ArticleDetail",
                meta: {isAuth: false},
                component: () => import('../views/front/ArticleDetail')
            }
        ]
    },
    {
        path: '/register',
        name: "Register",
        meta: {isAuth: false},
        component: () => import('../views/Register')
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

router.beforeEach((to, from, next) =>{
    let user = JSON.parse(localStorage.getItem("user"))
    if (to.meta.isAuth){ //需要守卫验证
        if (user !== null){
            if (user.token !== null && user.token !== ''){
                localStorage.setItem('currentPathName',to.meta.headerName)
                store.commit('setPath')
                let path = getPath(user);
                //定义标识
                let found = false
                for (let i in path) {
                    if (path[i] === to.path) {
                        found = true
                    }
                }
                //判断路由
                if (found) {
                    next()
                }else {
                    next({
                        path: '/home',
                    })
                    ElementUI.Message({
                        message: '无权限',
                        type: 'error'
                    })
                }
            }else {
                next({
                    path: '/login',
                })
                ElementUI.Message({
                    message: 'token错误，请登录',
                    type: 'error'
                })
            }
        }else {
            next({
                path: '/login',
            })
            ElementUI.Message({
                message: '无token，请登录',
                type: 'error'
            })
        }
    }else{
        next()
    }
})

const getPath = (user) => {
    let path = []
    //循环当前用户的所有菜单，拿到其中的path
    //循环一级菜单
    for (let i in user.menus) {
        //一级菜单中有path
        if (user.menus[i].path) {
            //拿到当前用户所有的path,再次存储到数组中
            path.push(user.menus[i].path)
            // console.log('一级菜单',user.menus[i].path)
        }else {
            //一级菜单中没有path
            //开始找二级菜单
            for (let j in user.menus[i].children) {
                //有路径是二级菜单
                if (user.menus[i].children[j].path) {
                    //拿到当前用户所有的path,再次存储到数组中
                    path.push(user.menus[i].children[j].path)
                    // console.log('二级菜单',user.menus[i].children[j])
                }else {
                    //找三级菜单
                    for (let k in user.menus[i].children[j].children) {
                        if (user.menus[i].children[j].children[k].path) {
                            //拿到当前用户所有的path,再次存储到数组中
                            path.push(user.menus[i].children[j].children[k].path)
                            // console.log('三级菜单',user.menus[i].children[j].children[k])
                        }else {
                            //还有四级菜单的话找四级菜单,找四级菜单
                        }
                    }
                }
            }
        }
    }
    return path;
}

export default router
