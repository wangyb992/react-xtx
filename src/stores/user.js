// 管理用户数据相关
import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { loginAPI } from '@/api/user'
import { useCartStore } from './cart'
import { mergeCartAPI } from '@/api/cart'
export const useUserStore = create(
  devtools(
    persist(
      (set) => ({
        // 定义用户数据状态
        userInfo: {},
        
        // 定义获取用户信息的action函数
        getUserInfo: async ({ account, password }) => {
          const res = await loginAPI({ account, password })
          // 更新状态
          set({ userInfo: res.data.result })
          // 合并购物车          
          await mergeCartAPI(useCartStore.getState().cartList.map(item => {return {
            skuId: item.skuId,
            selected: item.selected,
            count: item.count
          }}))
          useCartStore.getState().updateNewList()
        },
         // 退出时清除用户信息
        clearUserInfo: () => {
          set({ userInfo: {} })
          useCartStore.getState().clearCart()
        },
        
        // 可以添加退出登录的方法
        logout: () => set({ userInfo: {} })
      }),
      {
        // 持久化配置，相当于Pinia的persist: true
        name: 'user-storage', // 存储的键名
      }
    ),
  {
    name: 'user-storage',
  }
  ),
)
