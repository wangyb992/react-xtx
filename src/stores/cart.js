// 封装购物车模块
import { create } from 'zustand'
import { persist, devtools } from 'zustand/middleware'
import { useUserStore } from './user'
import { insertCartAPI, findNewCartListAPI, delCartAPI } from '@/api/cart';
export const useCartStore = create(
    devtools(
      persist(
      (set, get) => ({
        // 1. 定义state - cartList
        cartList: [],
        updateNewList : async () => {
            const res = await findNewCartListAPI()
            set({ cartList: res.data.result })
          },
        // 2. 定义action - addCart
        addCart: async (goods) => {
          const { skuId, count } = goods;
          // const  userInfo = useUserStore.getState()
          // const isLogin = userInfo.token
          const token = useUserStore.getState().userInfo.token;
          if(token) {
            // 登录状态：调用接口添加购物车
            console.log('登录状态', skuId, count)
            await insertCartAPI({ skuId, count })
            await get().updateNewList()
          } else {
            // 未登录状态：本地添加
          console.log('添加', goods)
          // 获取当前购物车列表
          const currentCartList = get().cartList
          // 查找是否已添加过该商品
          const item = currentCartList.find((item) => goods.skuId === item.skuId)
          
          if (item) {
            // 已添加过 - 更新数量
            set({
              cartList: currentCartList.map(item => 
                item.skuId === goods.skuId 
                  ? { ...item, count: item.count + goods.count } 
                  : item
              )
            })
          } else {
            // 未添加过 - 添加到购物车
            set({
              cartList: [...currentCartList, goods]
            })
          }
          }

        },
          // 清空购物车
        clearCart:  () => {
            set({ cartList: [] })
          },
        // 更新购物车商品数量
        updateCount: (skuId, count) => {
          set((state) => ({
            cartList: state.cartList.map(item => 
              item.skuId === skuId ? { ...item, count } : item
            )
          }));
        },
                // 删除购物车商品
        delCart: async (skuId) => {
          const token = useUserStore.getState().userInfo.token;
          if(token) {
            // 登录状态：调用接口删除购物车
            await delCartAPI([skuId])
            await get().updateNewList()
          }else {
                        // 未登录状态：本地删除
            const currentCartList = get().cartList
            set({
              cartList: currentCartList.filter(item => item.skuId !== skuId)
            })
          }
  
        },
              // 单选功能
        singleCheck: (skuId, selected) => {
          set((state) => ({
            cartList: state.cartList.map(item => 
              item.skuId === skuId ? { ...item, selected } : item
            )
          }));
        },

        // 全选功能
        allCheck: (selected) => {
          set((state) => ({
            cartList: state.cartList.map(item => ({ ...item, selected }))
          }));
        },

        // 3. 新增方法 - 计算购物车总价
        getTotalPrice: () => {
          const currentCartList = get().cartList
          // 遍历购物车列表，累加每个商品的价格（单价 × 数量）
          return currentCartList.reduce((total, item) => {
            // 确保item有price和count属性，避免计算错误
            return total + (item.price || 0) * (item.count || 0)
          }, 0)
        },
        getTotalCount: () => {
          const currentCartList = get().cartList
          // 遍历购物车列表，累加每个商品的数量
          return currentCartList.reduce((total, item) => {
          // 确保item有count属性，避免计算错误
            return total + (item.count || 0)
          }, 0)
        },
        // 计算属性 - 是否全选
        isAllChecked: () => {
          const currentCartList = get().cartList
          return currentCartList.every(item => item.selected);
        },

        // 计算属性 - 已选择数量
        selectedCount: () => {
          const currentCartList = get().cartList
          return currentCartList
            .filter(item => item.selected)
            .reduce((total, item) => total + item.count, 0);
        },

        // 计算属性 - 已选择商品总价
        selectedPrice: () => {
          const currentCartList = get().cartList
          return currentCartList
            .filter(item => item.selected)
            .reduce((total, item) => total + (item.count * item.price), 0);
        }
      }),
      {
        // 持久化配置
        name: 'cart-storage', // 存储的键名
      }
    )
  )
)