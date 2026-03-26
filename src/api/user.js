import http from '@/utils/http'

export const loginAPI = ({ account, password }) => {
  return http({
    method: 'POST',
    url: '/login',
    data: {
      account,
      password
    }
  })
}
export const getLikeListAPI = ({ limit = 4 }) => {
  return http({
    url:'/goods/relevant',
    params: {
      limit 
    }
  })
}
/*
params: {
    orderState:0,
  page:1,
  pageSize:2
}
*/


export const getUserOrder = (params) => {
  return http({
    url:'/member/order',
    method:'GET',
    params
  })
}