import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
// import login from '@/pages/Login/template.vue'
// import my from '@/pages/My/template.vue'
// import register from '@/pages/Register/template.vue'
// import user from '@/pages/User/template.vue'
// import create from '@/pages/Create/template.vue'
// import detail from '@/pages/Detail/template.vue'
// import edit from '@/pages/Edit/template.vue'
// import index from '@/pages/Index/template.vue'

Vue.use(Router)

// const router = new Router({
//     routes: [
//       {
//         path: '/',
//         component: index
//       },
//       {
//         path: '/login',
//         component: login
//       },
//       {
//         path: '/my',
//         component: my,
//         meta: {requiresAuth: true}
//       },
//       {
//         path: '/register',
//         component: register
//       },
//       {
//         path: '/user/:userId',
//         component: user
//       },
//       {
//         path: '/create',
//         component: create,
//         meta: {requiresAuth: true}
//       },
//       {
//         path: '/detail/:blogId',
//         component: detail
//       },
//       {
//         path: '/edit/:blogId',
//         component: edit,
//         meta: {requiresAuth: true}
//       }
//     ]
// })

const router = new Router({
  routes: [
    {
      // 设置默认路径
      path: "/",
      // Index为首页
      component: () => import("../pages/Index/template.vue"),
      meta: { requireAuth: true }
    },
    {
      path: "/login",
      component: () => import("../pages/Login/template.vue")
    },

    {
      path: "/create",
      component: () => import("../pages/Create/template.vue"),
      // 只有经过身份验证的用户才能创建帖子
      meta: { requireAuth: true }
    },
    {
      path: "/user/:userId",
      component: () => import("../pages/User/template.vue")
    },
    {
      path: "/edit/:blogId",
      component: () => import("../pages/Edit/template.vue"),
      // 只有经过身份验证的用户才能编辑帖子
      meta: { requireAuth: true }
    },
    {
      path: "/my",
      component: () => import("../pages/My/template.vue"),
      // 只有经过身份验证的用户才能访问自己的内容
      meta: { requireAuth: true }
    },
    {
      path: "/index",
      component: () => import("../pages/Index/template.vue")
    },

    {
      path: "/register",
      component: () => import("../pages/Register/template.vue")
    },
    {
      path: "/detail/:blogId",
      component: () => import("../pages/Detail/template.vue")
    }
  ]
});



router.beforeEach((to, from, next) => {
  // 如果matched的标准化路由数组中，有一个标准化路由记录的meta中的requireAuth为真，那么就执行下面的函数
  if (to.matched.some(record => record.meta.requiresAuth)) {
    store.dispatch('checkLogin').then(isLogin =>{
      if (!store.getters.isLogin) {
        next({
          path: '/login',
          query: {redirect: to.fullPath},
        })
      } else {
        next()
      }
    })
  } else {
    next()
  }
})

export default router
