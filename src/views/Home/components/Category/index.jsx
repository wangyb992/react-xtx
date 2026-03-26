import React from 'react';
import { Link } from 'react-router-dom';
import './HomeCategory.scss';
import { getCategoryAPI } from '@/api/layout';
import { useEffect, useState } from 'react';


const HomeCategory = () => {
  const [categoryList, setCategoryList] = useState([]);
  useEffect(() => {
    getCategoryAPI().then(res => {
      console.log('分类数据', res);
      setCategoryList(res.data.result);
    })
  }, [])
  return (
    <div className="home-category">
      <ul className="menu">
        {/* 循环渲染一级分类 */}
        {categoryList.map((category) => (
          <li key={category.id}>
            {/* 一级分类链接 */}
            <Link to="/">{category.name}</Link>
            {/* 循环渲染二级分类链接 */}
            {category.children.slice(0, 2).map((subCat) => (
              <Link key={subCat.id} to="/">{subCat.name}</Link>
            ))}
            
            {/*  hover 弹层（子分类商品推荐） */}
            <div className="layer">
              <h4>
                分类推荐 
                <small>根据您的购买或浏览记录推荐</small>
              </h4>
              <ul>
                {/* 循环渲染推荐商品 */}
                {category.goods.map((product, prodIndex) => (
                  <li key={prodIndex}>
                    <Link to="/">
                      <img src={product.picture} alt='' loading="lazy" decoding="async" />
                      <div className="info">
                        <p className="name ellipsis-2">{product.name}</p>
                        <p className="desc ellipsis">{product.desc}</p>
                        <p className="price">
                          <i>¥</i>{product.price}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomeCategory;