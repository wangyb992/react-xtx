import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomePanel from '../HomePanel';
import { getHotAPI } from '@/api/layout';
import './HotProducts.scss';

const HotProducts = () => {
  const [hotList, setHotList] = useState([]);

  const getHotList = async () => {
    try {
      const res = await getHotAPI();
      setHotList(res.data.result || []);
    } catch (error) {
      console.error('获取人气推荐列表失败:', error);
    }
  };

  // 组件挂载时获取数据，相当于Vue的setup中直接调用函数
  useEffect(() => {
    getHotList();
  }, []);

  return (
    <div className="hot-products">
    <HomePanel title="人气推荐" subTitle="人气爆款 不容错过">
      <ul className="goods-list">
        {hotList.map(item => (
          <li key={item.id}>
            <Link to="/">
              {/* 假设使用了图片懒加载库，这里用原生loading属性作为替代 */}
              <img 
                src={item.picture} 
                alt={item.alt || item.title} 
                loading="lazy" 
              />
              <p className="name">{item.title}</p>
              <p className="desc">{item.alt}</p>
            </Link>
          </li>
        ))}
      </ul>
    </HomePanel>
    </div>
  );
};

export default HotProducts;
    