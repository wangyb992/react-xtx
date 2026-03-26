import { createBrowserRouter } from 'react-router-dom'
import { Suspense, createElement, lazy } from 'react'

const Login = lazy(() => import('../views/Login/index.jsx'))
const Layout = lazy(() => import('../views/Layout/index.jsx'))
const Home = lazy(() => import('../views/Home/index.jsx'))
const Category = lazy(() => import('../views/Category/index.jsx'))
const SubCategory = lazy(() => import('../views/SubCategory/index.jsx'))
const Detail = lazy(() => import('../views/Detail/index.jsx'))
const CartList = lazy(() => import('../views/CartList/index.jsx'))
const CheckOut = lazy(() => import('../views/CheckOut/index.jsx'))
const Pay = lazy(() => import('../views/Pay/index.jsx'))
const Member = lazy(() => import('../views/Member/index.jsx'))
const MemberInfo = lazy(() => import('../views/Member/MemberInfo/index.jsx'))
const MemberOrder = lazy(() => import('../views/Member/MemberOrder/index.jsx'))

const withSuspense = (Component) => (
  <Suspense fallback={<div className="container">页面加载中...</div>}>
    {createElement(Component)}
  </Suspense>
)

// 创建路由配置
const router = createBrowserRouter([
  {
    path: '/',
    element: withSuspense(Layout),
    children: [
        {
          path: '',
          element: withSuspense(Home)
        },
        {
          path: '/category/:id',
          element: withSuspense(Category)
        },
        {
          path: 'category/sub/:id',
          element: withSuspense(SubCategory)
        },
        {
          path: '/detail/:id',
          element: withSuspense(Detail)
        },
                {
          path: '/cartlist',
          element: withSuspense(CartList)
        },
        {
          path: '/checkout',
          element: withSuspense(CheckOut)
        },
        {
          path: '/pay',
          element: withSuspense(Pay)
        },
        {
          path: '/member',
          element: withSuspense(Member),
          children: [
            {
              path: 'user',
              element: withSuspense(MemberInfo)
            },
            {
              path: 'order',
              element: withSuspense(MemberOrder)
            }
          ]
        }
    ]
  },
  {
    path: '/login',
    element: withSuspense(Login),
  },
  
], {
  // 配置滚动行为  
  scrollRestoration: 'manual'
})

export default router