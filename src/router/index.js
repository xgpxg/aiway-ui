import {createRouter, createWebHistory, createWebHashHistory} from 'vue-router'
import Layout from '@/layout/index.vue'

const routes = [
    // 登录页
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/login/index.vue'),
        meta: {
            title: '登录'
        }
    },
    // 仪表盘
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: '仪表盘'
                }
            }
        ]
    }
]


const router = createRouter({
    //history: createWebHashHistory(),  // hash 模式
    history: createWebHistory(),  // history 模式
    routes: routes
})

router.beforeEach((to, from, next) => {
    // console.log(to, from)
    if (to.meta.title) {
        document.title = `${to.meta.title}`;
    }
    next()
})

export default router