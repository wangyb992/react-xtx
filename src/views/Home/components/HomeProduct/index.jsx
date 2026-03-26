import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import GoodsItem from '../GoodsItem';
import HomePanel from '../HomePanel';
import { getGoodsAPI } from '@/api/layout';
import styles from './HomeProduct.module.scss';

const HomeProduct = () => {
  const [goodsProduct, setGoodsProduct] = useState([]);

  const getGoodsProduct = async () => {
    try {
      const res = await getGoodsAPI();
      setGoodsProduct(res.data.result || []);
    } catch (error) {
      console.error('获取商品数据失败:', error);
    }
  };

  // 组件挂载时获取数据
  useEffect(() => {
    getGoodsProduct();
  }, []);

  return (
    <div className={styles['home-product']}>
      {goodsProduct.map(cate => (
        <HomePanel key={cate.id} title={cate.name}>
          <div className={styles.box}>
            <Link to="/" className={styles.cover}>
              <img 
                src={cate.picture} 
                alt={`${cate.name}馆`} 
                loading="lazy" 
              />
              <strong className={styles.label}>
                <span>{cate.name}馆</span>
                <span>{cate.saleInfo}</span>
              </strong>
            </Link>

            <ul className={styles['goods-list']}>
              {cate.goods?.map(good => (
                <li key={good.id}>
                  <GoodsItem goods={good} />
                </li>
              ))}
            </ul>
          </div>
        </HomePanel>
      ))}
    </div>
  );
};

export default HomeProduct;
