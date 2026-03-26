import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/stores/cart';
import './HeaderCart.scss';
import { ShoppingCartOutlined  } from '@ant-design/icons';
import { CloseOutlined } from '@ant-design/icons';
const HeaderCart = () => {
  const cartStore = useCartStore();
  const navigate = useNavigate();
  const{ getTotalPrice, getTotalCount, delCart } = useCartStore()
  return (
    <div className="cart">
      <a className="curr" >
        <ShoppingCartOutlined className='icon-cart' />
            {cartStore.cartList.length > 0 && (
              <em>{cartStore.cartList.length}</em>
            )}
      </a>

      <div className="layer">
        <div className="list">
          {cartStore.cartList.map((item) => (
            <div className="item" key={item.skuId}>
              <a href="#" onClick={(e) => {
                e.preventDefault();
                // 这里可以添加点击商品的路由跳转逻辑
                // navigate(`/product/${item.skuId}`);
              }}>
                <img src={item.picture} alt={item.name} />
                <div className="center">
                  <p className="name ellipsis-2">
                    {item.name}
                  </p>
                  <p className="attr ellipsis">{item.attrsText}</p>
                </div>
                <div className="right">
                  <p className="price">¥{item.price}</p>
                  <p className="count">x{item.count}</p>
                </div>
              </a>
              <i 
                className="iconfont icon-close-new" 
                onClick={() => delCart(item.skuId)}
              >
                <CloseOutlined />
              </i>
            </div>
          ))}
        </div>
        <div className="foot">
          <div className="total">
            <p>共 {getTotalCount()} 件商品</p>
            <p>¥ {getTotalPrice()}</p>
          </div>
          <button 
            className="el-button el-button--primary el-button--large" 
            onClick={() => navigate('/cartlist')}
          >
            去购物车结算
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeaderCart;
