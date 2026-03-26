import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import  './HeaderFix.scss';

import { NavLink } from 'react-router-dom';
import { useScroll } from '@reactuses/core'
import { useCategoryStore } from '@/stores/category';
const HeaderFix = () => { 
  const elementRef = useRef(window);
  const [ , y ] = useScroll(elementRef);
const { categoryList, getCategory } = useCategoryStore();
  useEffect(() => {
    getCategory()
  }, [getCategory])
  return (
    
    <div 
      className={`app-header-sticky ${y > 100 ? 'show' : ''}` } 
    >
      <div className="container">
                {/* 网站Logo */}
        <h1 className="logo">
          <Link to="/"></Link>
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

        <div className="right">
          <Link to="/">品牌</Link>
          <Link to="/">专题</Link>
        </div>
      </div>
    </div>
  );
};

export default HeaderFix;
