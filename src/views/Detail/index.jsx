import React from 'react';
import { Breadcrumb, Button, Tabs } from 'antd';
import { InputNumber } from 'antd';
import GoodsHots from './components/GoodsHots'
import ImageView from '@/components/ImageView'
import '@ant-design/v5-patch-for-react-19';
import { message } from 'antd';

// 单独导入每个图标
import { 
  ShoppingOutlined, 
  MessageOutlined, 
  StarOutlined, 
  HeartOutlined, 
  HomeOutlined,
  TruckOutlined,
  TagOutlined,
  CheckCircleFilled,
} from '@ant-design/icons';
import './GoodsDetail.scss';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDetail } from '@/api/detail'
import GoodsSku from '@/components/GoodsSku'
const { TabPane } = Tabs;
import { useCartStore } from '@/stores/cart';


const GoodsDetail = () => {
  const { addCart } = useCartStore();
  // 商品详情数据
  const { id } = useParams();
  const [goodsDetail, setGoodsDetail] = useState({});
  const getDetailInfo = async () => {
    const res = await getDetail(id)
    console.log(res);
    setGoodsDetail(res.data.result)
  }
  useEffect(() => {
    getDetailInfo()
  }, [id])
  // 面包屑导航数据
  const breadcrumbItems = [
    { title: <a href="/"><HomeOutlined /> 首页</a> },
    { title: <a href={`/category/${goodsDetail.categories?.[1]?.id}`}>{goodsDetail.categories?.[1]?.name}</a> },
    { title: <a href={`/category/${goodsDetail.categories?.[0]?.id}`}>{goodsDetail.categories?.[0]?.name}</a> },
    { title: <span>{goodsDetail?.name}</span> },
  ];
  // 数量
  const [count, setCount] = useState(1)
  const handleChange = (value) => { 
    setCount(value)
  }
  // sku选择
  let [skuobj, setSkuobj] = useState({})
  const skuChange = (sku) => {
    console.log(sku);
    setSkuobj(sku)
  }
  // 添加购物车
  const add = () => {
    console.log(skuobj);
    if (skuobj.skuId) {
      // 规则已经选择  触发action
      addCart({
        id: goodsDetail.id,
        name: goodsDetail.name,
        picture: goodsDetail.mainPictures[0],
        price: goodsDetail.price,
        count: count,
        skuId: skuobj.skuId,
        attrsText: skuobj.specText,
        selected: true
      })
    } else {
      // 规格没有选择 提示用户
      message.warning('请选择规格')
    }
  }

  return (
    <div className="xtx-goods-page">
      <div className="container" >
        {/* 面包屑导航 */}
        <div className="bread-container">
          <Breadcrumb items={breadcrumbItems} separator=">" />
        </div>

        {/* 商品信息 */}
        <div className="info-container">
          <div>
            <div className="goods-info">
              <div className="media">
                {/* 图片预览区 - 使用Card组件优化展示 */}
                
                  <ImageView imageList={goodsDetail.mainPictures} />
                
                
                {/* 统计数量 */}
                <ul className="goods-sales">
                  <li>
                    <p>销量人气</p>
                    <p>{goodsDetail.salesCount}</p>
                    <p><ShoppingOutlined /> 查看销量</p>
                  </li>
                  <li>
                    <p>商品评价</p>
                    <p>{goodsDetail.commentCount}</p>
                    <p><MessageOutlined /> 查看评价</p>
                  </li>
                  <li>
                    <p>收藏人气</p>
                    <p>{goodsDetail.collectCount}</p>
                    <p><HeartOutlined /> 收藏商品</p>
                  </li>
                  <li>
                    <p>品牌信息</p>
                    <p></p>
                    <p><StarOutlined /> 品牌主页</p>
                  </li>
                </ul>
              </div>

              <div className="spec">
                {/* 商品信息区 */}
                <h1 className="g-name">{goodsDetail.name}</h1>
                <p className="g-desc">{goodsDetail.desc}</p>
                
                {/* 价格区域 */}
                <div className="g-price">
                  <span>{goodsDetail.price}</span>
                  <span>{goodsDetail.oldPrice}</span>
                  {/* <Badge status="success" text="限时优惠" style={{ marginLeft: 10 }} /> */}
                </div>

                {/* 服务与促销信息 */}
                <div className="g-service">
                  <dl>
                    <dt>促销</dt>
                    <dd>
                      <TagOutlined style={{ color: '#f50' }} />
                      12月好物放送，App领券购买直降120元
                    </dd>
                  </dl>
                  <dl>
                    <dt>服务</dt>
                    <dd>
                      <span> <CheckCircleFilled style={{ color: '#1890ff' }} /> 无忧退货</span>
                      <span> <CheckCircleFilled style={{ color: '#1890ff' }} /> 快速退款</span>
                      <span><TruckOutlined style={{ color: '#1890ff' }} /> 免费包邮</span>
                      <a href="javascript:;">了解详情</a>
                    </dd>
                  </dl>
                </div>

                {/* SKU选择区域 - 可根据实际需求扩展 */}
                <GoodsSku goods={goodsDetail} onChange={skuChange}/>

                {/* 购买按钮区域 */}
                
                
                <div className="action-buttons">
                  <InputNumber min={1} max={10} style={{ width: 100,height: 39 }} value={count} onChange={handleChange} />

                  <Button color="cyan" variant="outlined" size="large" 
                    className="btn"
                    style={{ marginRight: 10, padding: '0 30px' ,width: 130,marginLeft: 20 }}
                    onClick={add}
                    >
                      <ShoppingOutlined />
                    加入购物车
                  </Button>
                </div>
              </div>
            </div>

            {/* 商品详情区域 */}
            <div className="goods-footer">
              <div className="goods-article">
                <div className="goods-tabs">
                  <nav>
                    <a>商品详情</a>
                  </nav>
                  
                    
                  <div className="goods-detail">
                    {/* 属性列表 */}
                    <ul className="attrs">
                      {goodsDetail.details?.properties.map((item, index) => (
                        <li key={index}>
                          <span className="dt">{item.name}</span>
                          <span className="dd">{item.value}</span>
                        </li>
                      ))}
                    </ul>
                    
                    {/* 商品详情图片 */}
                    <div className="detail-images">
                      {goodsDetail.details?.pictures.map((item) => (
                        <img 
                          key={item}
                          alt='' 
                          src={item}   
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 侧边栏 - 24热榜+专题推荐 */}
              <div className="goods-aside">
              <GoodsHots type="1" />
              <GoodsHots type="2" />
              </div>
            </div>  
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoodsDetail;
    