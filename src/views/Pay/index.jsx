import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getOrderAPI } from '@/api/pay';
import './pay.scss';
import { CheckCircleFilled } from '@ant-design/icons';
import useCountDown from '@/composabale/useCountDown';
const PaymentPage = () => {
  // 倒计时
  const {formatTime,start}=useCountDown()
  // 获取路由参数
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  console.log(orderId);
 
  // 订单信息状态
  const [payInfo, setPayInfo] = useState({});
  
  // 获取订单数据
  const getPayInfo = async () => {
    const res = await getOrderAPI(orderId);
    console.log(res);
    start(res.data.result.countdown);
    setPayInfo(res.data.result);
  };


  // 组件挂载时获取订单信息
  useEffect(() => {
    getPayInfo();
    
  }, [orderId]);

  // 支付地址相关
  const baseURL = 'http://pcapi-xiaotuxian-front-devtest.itheima.net/';
  const backURL = 'http://127.0.0.1:5173/paycallback';
  const redirectUrl = encodeURIComponent(backURL);
  const payUrl = `${baseURL}pay/aliPay?orderId=${orderId}&redirect=${redirectUrl}`;


  return (
    <div className="xtx-pay-page">
      <div className="container">
        {/* 付款信息 */}
        <div className="pay-info">
          
          <CheckCircleFilled className="icon"/>
          <div className="tip">
            <p>订单提交成功！请尽快完成支付。</p>
            <p>支付还剩 <span>{formatTime}</span>, 超时后将取消订单</p>
          </div>

          <div className="amount">
            <span>应付总额：</span>
            <span>¥{payInfo.payMoney !== undefined ? payInfo.payMoney.toFixed(2) : '0.00'}</span>
          </div>
        </div>

        {/* 付款方式 */}
        <div className="pay-type">
          <p className="head">选择以下支付方式付款</p>

          <div className="item">
            <p>支付平台</p>
            <a className="btn wx" href="javascript:;"></a>
            <a className="btn alipay" href={payUrl}></a>
          </div>

          <div className="item">
            <p>支付方式</p>
            <a className="btn" href="javascript:;">招商银行</a>
            <a className="btn" href="javascript:;">工商银行</a>
            <a className="btn" href="javascript:;">建设银行</a>
            <a className="btn" href="javascript:;">农业银行</a>
            <a className="btn" href="javascript:;">交通银行</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
