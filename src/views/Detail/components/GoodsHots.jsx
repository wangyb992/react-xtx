import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getchHotGoodsAPI } from '@/api/detail';
import './GoodHots.scss';

const GoodsHots = ({ type = 1 }) => {   
  const [goodList, setGoodList] = useState([]);
  const { id } = useParams();
  
  // 标题映射表
  const TITLEMAP = {
    1: '24小时热榜',
    2: '周热榜',
    3: '总热销榜'
  };
  
  // 获取热榜数据
  const getHotList = async () => {
    try {
      const res = await getchHotGoodsAPI({
        id: id,
        type: type
      });
      setGoodList(res.data.result);
    } catch (error) {
      console.error('获取热榜数据失败:', error);
    }
  };
  
  // 组件挂载时和type变化时获取数据
  useEffect(() => {
    getHotList();
  }, [type, id]);
  
  return (
    <div className="goods-hot">
      <h3>{TITLEMAP[type]}</h3>
      
      {/* 商品区块 */}
      {goodList.map(item => (
        <Link to="/" className="goods-item" key={item.id}>
          <img src={item.picture} alt={item.name} />
          <p className="name ellipsis">{item.name}</p>
          <p className="desc ellipsis">{item.desc}</p>
          <p className="price">¥{item.price}</p>
        </Link>
      ))}
    </div>
  );
};

export default GoodsHots;
