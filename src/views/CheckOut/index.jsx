import React, { useState } from 'react';
import { Button, Table, Modal, Input, Form, Select, Divider } from 'antd';
import {getCheckoutInfoAPI, createOrderAPI, addAddressAPI} from '@/api/checkout'
import {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cart';

import './CheckOut.scss'; // 自定义样式

const { Option } = Select;
const { Item } = Form;

const CheckoutPage = () => {
  // 状态管理
  const [checkInfo, setCheckInfo] = useState({});
  const [curAddress, setCurAddress] = useState(null);
  const [toggleFlag, setToggleFlag] = useState(false);
  const [addFlag, setAddFlag] = useState(false);
  const [deliveryTime, setDeliveryTime] = useState('unlimited');
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [newAddress, setNewAddress] = useState({
    receiver: "",
    contact: "",
    provinceCode: "111111",
    cityCode: "111111",
    countyCode: "111111",
    address: "",
    postalCode: "111111",
    addressTags: "家",
    isDefault: 1,
    fullLocation: ""
});

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { updateNewList } = useCartStore();
  const getCheckoutInfo = async () => {
    try {
      const res = await getCheckoutInfoAPI();
      console.log('res',res);
      // 先保存获取到的结果
      const result = res.data.result;
      // 更新状态
      setCheckInfo(result);  
      // 直接使用获取到的结果来查找，而不是依赖状态
      if (result?.userAddresses) {
        const item = result.userAddresses.find(item => item.isDefault === 0);
        setCurAddress(item);
      }
    } catch (error) {
      console.error('获取结算信息失败:', error);
    }
  };

  useEffect(() => {
    getCheckoutInfo();
  }, []);


const createOrder = async () => {
  const res = await createOrderAPI({
    deliveryTimeType: 1,
    payType: 1,
    payChannel: 1,
    buyerMessage: '',
    addressId: curAddress.id,
    goods: checkInfo.goods.map(item => ({
      skuId: item.skuId,
      count: item.count
    }))
  });
  console.log('res',res);
  const orderId = res.data.result.id;
  navigate({
    pathname: '/pay',
    search: `?id=${orderId}`
  });
  
  // 调用购物车相关的store方法清空购物车
  updateNewList();
};

  // 商品列定义
  const columns = [
    {
      title: '商品信息',
      dataIndex: 'name',
      key: 'name',
      width: 520,
      render: (text, record) => (
        <a href="javascript:;" className="info">
          <img src={record.picture} alt={text} />
          <div className="right">
            <p>{text}</p>
            <p>{record.attrsText}</p>
          </div>
        </a>
      )
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      width: 170,
      align: 'left',
      render: price => `¥${price}`
    },
    {
      title: '数量',
      dataIndex: 'count',
      key: 'count',
      align: 'left',
      width: 170
    },
    {
      title: '小计',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      align: 'left',
      width: 170,
      render: price => `¥${price}`
    },
    {
      title: '实付',
      dataIndex: 'totalPayPrice',
      key: 'totalPayPrice',
      align: 'left',
      width: 170,
      render: price => `¥${price}`
    }
  ];



  // 保存新地址
  const handleSaveAddress = () => {
    form.validateFields()
      .then(async values => {
        // 处理地址保存逻辑
        // 解构出省份、城市、区/县的值
        const { province, city, district, address, receiver, contact } = values;
        // 拼接成完整地址
        const fullLocation = `${province} ${city} ${district}`;
        // 合并新地址对象
        const Address = {          
          ...newAddress,          
          receiver,
          contact,
          address,
          fullLocation,}
        setNewAddress(Address);
        // 调用添加地址接口
        await addAddressAPI(Address)
        console.log('values',values);
        setCurAddress(values);
        setAddFlag(false);
        form.resetFields();
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <div className="xtx-pay-checkout-page">
      <div className="container">
        <div className="wrapper">
          {/* 收货地址 */}
          <h3 className="box-title">收货地址</h3>
          <div className="box-body">
            <div className="address">
              <div className="text">
                {!curAddress ? (
                  <div className="none">您需要先添加收货地址才可提交订单。</div>
                ) : (
                  <ul>
                    <li><span>收<i />货<i />人：</span>{curAddress.receiver}</li>
                    <li><span>联系方式：</span>{curAddress.contact}</li>
                    <li>
                      <span>收货地址：</span>
                      {`${ curAddress.fullLocation } ${curAddress.address}`}
                    </li>
                  </ul>
                )}
              </div>
              <div className="action">
                <Button size="large" onClick={() => setToggleFlag(true)}>
                  切换地址
                </Button>
                <Button size="large" type="primary" onClick={() => setAddFlag(true)}>
                  添加地址
                </Button>
              </div>
            </div>
          </div>

          {/* 商品信息 */}
          <h3 className="box-title">商品信息</h3>
          <div className="box-body">
            <Table
              columns={columns}
              dataSource={checkInfo.goods}
              rowKey="id"
              pagination={false}
              className="goods"
            />
          </div>

          {/* 配送时间 */}
          <h3 className="box-title">配送时间</h3>
          <div className="box-body">
            <a 
              className={`my-btn ${deliveryTime === 'unlimited' ? 'active' : ''}`} 
              href="javascript:;"
              onClick={() => setDeliveryTime('unlimited')}
            >
              不限送货时间：周一至周日
            </a>
            <a 
              className={`my-btn ${deliveryTime === 'workday' ? 'active' : ''}`} 
              href="javascript:;"
              onClick={() => setDeliveryTime('workday')}
            >
              工作日送货：周一至周五
            </a>
            <a 
              className={`my-btn ${deliveryTime === 'holiday' ? 'active' : ''}`} 
              href="javascript:;"
              onClick={() => setDeliveryTime('holiday')}
            >
              双休日、假日送货：周六至周日
            </a>
          </div>

          {/* 支付方式 */}
          <h3 className="box-title">支付方式</h3>
          <div className="box-body">
            <a 
              className={`my-btn ${paymentMethod === 'online' ? 'active' : ''}`} 
              href="javascript:;"
              onClick={() => setPaymentMethod('online')}
            >
              在线支付
            </a>
            <a 
              className={`my-btn ${paymentMethod === 'cod' ? 'active' : ''}`} 
              href="javascript:;"
              onClick={() => setPaymentMethod('cod')}
            >
              货到付款
            </a>
            <span style={{ color: '#999' }}>货到付款需付5元手续费</span>
          </div>

          {/* 金额明细 */}
          <h3 className="box-title">金额明细</h3>
          <div className="box-body">
            <div className="total">
              <dl>
                <dt>商品件数：</dt>
                <dd>{checkInfo.summary?.goodsCount}件</dd>
              </dl>
              <dl>
                <dt>商品总价：</dt>
                <dd>¥{checkInfo.summary?.totalPrice.toFixed(2)}</dd>
              </dl>
              <dl>
                <dt>运<i></i>费：</dt>
                <dd>¥{checkInfo.summary?.postFee.toFixed(2)}</dd>
              </dl>
              <dl>
                <dt>应付总额：</dt>
                <dd className="price">¥{checkInfo.summary?.totalPayPrice.toFixed(2)}</dd>
              </dl>
            </div>
          </div>

          {/* 提交订单 */}
          <div className="submit">
            <Button type="primary" size="large" onClick={createOrder}>
              提交订单
            </Button>
          </div>
        </div>
      </div>

      {/* 切换地址模态框 */}
      <Modal
        title="选择收货地址"
        visible={toggleFlag}
        onCancel={() => setToggleFlag(false)}
        footer={null}
        width={600}
      >
        <div className="addressWrapper">
          {/* 这里可以添加已保存的地址列表 */}
          {checkInfo.userAddresses?.map(item => (
            <div className="text item" onClick={() => {
            // 模拟选择一个地址
            setCurAddress(item);
            setToggleFlag(false);
          }}>
            <ul>
              <li><span>收<i />货<i />人：</span>{item.receiver}</li>
              <li><span>联系方式：</span>{item.contact}</li>
              <li><span>收货地址：</span>{`${item.fullLocation} ${item.address}`}</li>
            </ul>
          </div>
          ))}          
          <Divider dashed />
          
          <Button type="dashed" block onClick={() => {
            setToggleFlag(false);
            setAddFlag(true);
          }}>
            + 添加新地址
          </Button>
        </div>
      </Modal>

      {/* 添加地址模态框 */}
      <Modal
        title="添加收货地址"
        visible={addFlag}
        onCancel={() => setAddFlag(false)}
        onOk={handleSaveAddress}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Item
            name="receiver"
            label="收货人"
            rules={[{ required: true, message: '请输入收货人姓名' }]}
          >
            <Input placeholder="请输入收货人姓名" />
          </Item>
          <Item
            name="contact"
            label="联系方式"
            rules={[{ required: true, message: '请输入联系电话' }]}
          >
            <Input placeholder="请输入联系电话" />
          </Item>
          <div style={{ display: 'flex', gap: 16 }}>
            <Item
              name="province"
              label="省份"
              rules={[{ required: true, message: '请选择省份' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择省份">
                <Option value="北京市">北京市</Option>
                <Option value="上海市">上海市</Option>
                <Option value="广东省">广东省</Option>
                {/* 更多省份选项 */}
              </Select>
            </Item>
            <Item
              name="city"
              label="城市"
              rules={[{ required: true, message: '请选择城市' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择城市">
                <Option value="北京市">北京市</Option>
                <Option value="上海市">上海市</Option>
                <Option value="广州市">广州市</Option>
                {/* 更多城市选项 */}
              </Select>
            </Item>
            <Item
              name="district"
              label="区/县"
              rules={[{ required: true, message: '请选择区/县' }]}
              style={{ flex: 1 }}
            >
              <Select placeholder="请选择区/县">
                <Option value="朝阳区">朝阳区</Option>
                <Option value="海淀区">海淀区</Option>
                {/* 更多区县选项 */}
              </Select>
            </Item>
          </div>
          <Item
            name="address"
            label="详细地址"
            rules={[{ required: true, message: '请输入详细地址' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入详细地址" />
          </Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CheckoutPage;
