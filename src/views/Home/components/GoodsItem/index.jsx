import React from 'react';
import { Link } from 'react-router-dom';
import styles from './GoodsItem.module.scss';

// 定义商品项组件，接收goods作为props
const GoodsItem = ({ goods = {} }) => {
  // 从goods对象中解构所需属性，使用默认值避免undefined
  const { id, picture, name, desc, price } = goods;

  return (
    <Link 
      to={`/detail/${id}`} 
      className={styles['goods-item']}
    >
      <img 
        src={picture} 
        alt={name || '商品图片'} 
        loading="lazy" 
      />
      <p className={styles.name}>{name}</p>
      <p className={styles.desc}>{desc}</p>
      <p className={styles.price}>&yen;{price}</p>
    </Link>
  );
};

export default GoodsItem;
