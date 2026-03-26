import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCartOutlined  } from '@ant-design/icons';
import { Input, Space } from 'antd';
import './Header.scss';
const { Search } = Input;
import { FiSearch } from 'react-icons/fi';
import { NavLink } from 'react-router-dom';
import { useCategoryStore } from '@/stores/category';
import { useEffect } from 'react';
import HeaderCart from './HeaderCart';

const Header = () => {
  const { categoryList, getCategory } = useCategoryStore();
  useEffect(() => {
    getCategory()
  }, [getCategory])


  
  return (
    <header className="app-header">
      <div className="container">
        {/* 网站Logo */}
        <h1 className="logo">
          <Link to="/">小兔鲜</Link>
        </h1>
        
        {/* 主导航 */}
        <ul className="app-header-nav">
          {
            categoryList.map(item => (
              <li key={item.id}>
                <NavLink className={({ isActive }) => (isActive ? 'active' : '')} to={`/category/${item.id}`}>{item.name}</NavLink>
              </li>
            ))
          }
        </ul>
        
        {/* 搜索框 */}

      <div className="search">
        {/* <i className="iconfont icon-search"></i> */}
        <FiSearch className="iconfont" />
        <input type="text" placeholder="搜一搜" />
      </div>
        {/* 购物车 */}
        <div className="cart">
          
          <HeaderCart />
          
          {/* <Link to="/cart" className="curr">
            <ShoppingCartOutlined className='icon-cart' />
            {cartItemCount > 0 && (
              <em>{cartItemCount}</em>
            )}
            
          </Link> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
    