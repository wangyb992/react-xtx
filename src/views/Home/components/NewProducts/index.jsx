import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HomePanel from '../HomePanel';
import { findNewAPI } from '@/api/layout';
import './NewProducts.scss';

const NewProducts = () => {
  const [newList, setNewList] = useState([]);

  const getNewList = async () => {
    try {
      const res = await findNewAPI();
      console.log('New list:', res);
      setNewList(res.data.result || []);
    } catch (error) {
      console.error('Failed to fetch new list:', error);
    }
  };

  useEffect(() => {
    getNewList();
  }, []);

  return (
    <HomePanel title="最新商品" subTitle="更多">
      <ul className="goods-list">
        {newList.map(item => (
          <li key={item.id}>
            <Link to={`/detail/${item.id}`}>
              <img src={item.picture} alt={item.name} loading="lazy" decoding="async" />
              <p className="name">{item.name}</p>
              <p className="price">¥{item.price}</p>
            </Link>
          </li>
        ))}
      </ul>
    </HomePanel>
  );
};

export default NewProducts;
