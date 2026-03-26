


import http from '@/utils/http'

export function getCategoryAPI () {
  return http({
    url: '/home/category/head'
  })
}

export function getBannerAPI (params = {}) {
  // 默认为1 商品为2
  const { distributionSite = '1' } = params
  return http({
    url: '/home/banner',
    params: {
      distributionSite
    }
  })
}

export const findNewAPI = () => {
  return http({
    url:'/home/new'
  })
}
export const getHotAPI = () => {
  return  http({
    url:'/home/hot'
  })
}
export const getGoodsAPI = () => {
  return http({
    url: '/home/goods'
  })
}