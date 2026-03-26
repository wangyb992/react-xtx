import React, { useState, useEffect } from 'react';
import { Tabs, Empty, Button, Pagination, Badge } from 'antd';
import { ClockCircleFilled } from '@ant-design/icons';
import './Memberoder.scss';
import { getUserOrder } from '@/api/user';

const { TabPane } = Tabs;

// 订单状态映射
const orderStateMap = {
  1: '待付款',
  2: '待发货',
  3: '待收货',
  4: '待评价',
  5: '已完成',
  6: '已取消'
};

const MemberOrder = () => {
  // 订单列表
  const [orderList, setOrderList] = useState([]);
  // 总页数
  const [total, setTotal] = useState(0);
  const [params, setParams] = useState({
    orderState:0,
    page:1,
    pageSize:2
  })
  const getOrderList = async () => {
    const res = await getUserOrder(params);
    console.log(res);
    setOrderList(res.data.result.items);
    setTotal(res.data.result.counts);
  }
  useEffect(() => {
    getOrderList();
  }, [params])
  // tab列表
  const tabTypes = [
    { name: "all", label: "全部订单" },
    { name: "unpay", label: "待付款" },
    { name: "deliver", label: "待发货" },
    { name: "receive", label: "待收货" },
    { name: "comment", label: "待评价" },
    { name: "complete", label: "已完成" },
    { name: "cancel", label: "已取消" }
  ];
  
  // 示例订单数据（实际项目中可能从API获取）
  // const [orderList] = useState([
  //   {
  //     id: '20230915001',
  //     createTime: '2023-09-15 10:30:25',
  //     orderState: 1,
  //     countdown: '01:23:45',
  //     skus: [
  //       {
  //         id: 'sku1001',
  //         image: 'https://picsum.photos/70/70?random=1',
  //         name: '高级无线耳机 主动降噪 长续航 高清通话',
  //         attrsText: '颜色:黑色;容量:128G',
  //         realPay: 899,
  //         quantity: 1
  //       }
  //     ],
  //     payMoney: 899,
  //     postFee: 0
  //   },
  //   {
  //     id: '20230914002',
  //     createTime: '2023-09-14 16:45:12',
  //     orderState: 3,
  //     skus: [
  //       {
  //         id: 'sku2002',
  //         image: 'https://picsum.photos/70/70?random=2',
  //         name: '智能手表 心率监测 运动计步 睡眠分析',
  //         attrsText: '颜色:银色;款式:标准版',
  //         realPay: 1299,
  //         quantity: 1
  //       }
  //     ],
  //     payMoney: 1299,
  //     postFee: 15
  //   }
  // ]);

  // 处理标签页变化,获得对应的索引下标,并更新params.orderState
  const handleTabChange = (key) => {
    console.log(tabTypes.findIndex(item => item.name === key));
    setParams({
      ...params,
      orderState:tabTypes.findIndex(item => item.name === key),
    })
    // 实际项目中这里可以根据标签筛选订单
  };
  const handlePageChange = (page) => {
    console.log(page);
    setParams({
      ...params,
      page:page,
    })
  }

  return (
    <div className="order-container">
      <Tabs 
        defaultActiveKey="all" 
        onChange={handleTabChange}
        tabBarStyle={{ marginBottom: 20 }}
      >
        {/* 标签页切换 */}
        {tabTypes.map(item => (
          <TabPane tab={item.label} key={item.name}>
            <div className="main-container">
              {orderList.length === 0 ? (
                <div className="holder-container">
                  <Empty description="暂无订单数据" />
                </div>
              ) : (
                <>
                  {/* 订单列表 */}
                  {orderList.map(order => (
                    <div className="order-item" key={order.id}>
                      <div className="head">
                        <span>下单时间：{order.createTime}</span>
                        <span>订单编号：{order.id}</span>
                        
                        {/* 未付款，显示倒计时 */}
                        {order.orderState === 1 && (
                          <span className="down-time">
                            <ClockCircleFilled />
                            <b>付款截止: {order.countdown}</b>
                          </span>
                        )}
                      </div>
                      
                      <div className="body">
                        <div className="column goods">
                          <ul>
                            {order.skus.map(item => (
                              <li key={item.id}>
                                <a className="image" href="javascript:;">
                                  <img src={item.image} alt={item.name} />
                                </a>
                                
                                <div className="info">
                                  <p className="name ellipsis-2">
                                    {item.name}
                                  </p>
                                  <p className="attr ellipsis">
                                    <span>{item.attrsText}</span>
                                  </p>
                                </div>
                                
                                <div className="price">¥{item.realPay?.toFixed(2)}</div>
                                <div className="count">x{item.quantity}</div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="column state">
                          <p>
                            <Badge status="processing" text={orderStateMap[order.orderState]} />
                          </p>
                          
                          {order.orderState === 3 && (
                            <p><a href="javascript:;" className="green">查看物流</a></p>
                          )}
                          
                          {order.orderState === 4 && (
                            <p><a href="javascript:;" className="green">评价商品</a></p>
                          )}
                          
                          {order.orderState === 5 && (
                            <p><a href="javascript:;" className="green">查看评价</a></p>
                          )}
                        </div>
                        
                        <div className="column amount">
                          <p className="red">¥{order.payMoney?.toFixed(2)}</p>
                          <p>（含运费：¥{order.postFee?.toFixed(2)}）</p>
                          <p>在线支付</p>
                        </div>
                        
                        <div className="column action">
                          {order.orderState === 1 && (
                            <Button type="primary" size="small">
                              立即付款
                            </Button>
                          )}
                          
                          {order.orderState === 3 && (
                            <Button type="primary" size="small">
                              确认收货
                            </Button>
                          )}
                          
                          <p><a href="javascript:;">查看详情</a></p>
                          
                          {[2, 3, 4, 5].includes(order.orderState) && (
                            <p><a href="javascript:;">再次购买</a></p>
                          )}
                          
                          {[4, 5].includes(order.orderState) && (
                            <p><a href="javascript:;">申请售后</a></p>
                          )}
                          
                          {order.orderState === 1 && (
                            <p><a href="javascript:;">取消订单</a></p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* 分页 */}
                  <div className="pagination-container">
                    <Pagination 
                      background 
                      showSizeChanger={false}
                      pageSize={params.pageSize}
                      onChange={handlePageChange}
                      defaultCurrent={params.page} 
                      total={total} 
                      showTotal={total => `共 ${total} 条订单`}
                    />
                  </div>
                </>
              )}
            </div>
          </TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default MemberOrder;
