import { useNavigate, Link } from 'react-router-dom';
import { Checkbox, InputNumber, Popconfirm, Empty, Button } from 'antd';
import { useCartStore } from '@/stores/cart'; // 假设使用类似Pinia的React状态管理库
import './CartList.scss'
const CartPage = () => {
  const navigate = useNavigate();
  const cartStore = useCartStore();
  const { singleCheck, allCheck, getTotalCount, isAllChecked, selectedCount, selectedPrice, delCart, updateCount  } = cartStore;
  
  // 处理单个商品选择状态变化
  const handleSingleCheck = (item, selected) => {
    singleCheck(item.skuId, selected);
  };
  
  // 处理全选状态变化
  const handleAllCheck = (selected) => {
    allCheck(selected);
  };
  
  // 处理删除商品确认
  const handleDelete = (skuId) => {
    delCart(skuId);
  };
  
  // 计算小计金额
  const calculateSubtotal = (price, count) => {
    return (price * count).toFixed(2);
  };

  return (
    <div className="xtx-cart-page">
      <div className="container m-top-20">
        <div className="cart">
          <table>
            <thead>
              <tr>
                <th width="120">
                  <Checkbox 
                    checked={isAllChecked()} 
                    onChange={(e) => handleAllCheck(e.target.checked)} 
                  />
                </th>
                <th width="400">商品信息</th>
                <th width="220">单价</th>
                <th width="180">数量</th>
                <th width="180">小计</th>
                <th width="140">操作</th>
              </tr>
            </thead>
            
            {/* 商品列表 */}
            <tbody>
              {cartStore.cartList.map(item => (
                <tr key={item.id}>
                  <td>
                    <Checkbox 
                      checked={item.selected} 
                      onChange={(e) => handleSingleCheck(item, e.target.checked)} 
                    />
                  </td>
                  <td>
                    <div className="goods">
                      <Link to="/">
                        <img src={item.picture} alt={item.name} />
                      </Link>
                      <div>
                        <p className="name ellipsis">
                          {item.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="tc">
                    <p>¥{item.price}</p>
                  </td>
                  <td className="tc">
                    <InputNumber 
                    min={1} max={99}
                      value={item.count} 
                      onChange={(value) => {
                        // 这里需要更新商品数量的逻辑
                        // 假设cartStore有更新数量的方法
                        updateCount(item.skuId, value);
                      }} 
                    />
                  </td>
                  <td className="tc">
                    <p className="f16 red">¥{calculateSubtotal(item.price, item.count)}</p>
                  </td>
                  <td className="tc">
                    <Popconfirm
                      title="确认删除吗?"
                      onConfirm={() => handleDelete(item.skuId)}
                      okText="确认"
                      cancelText="取消"
                    >
                      <a href="javascript:;">删除</a>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
              
              {cartStore.cartList.length === 0 && (
                <tr>
                  <td colSpan="6">
                    <div className="cart-none">
                      <Empty description="购物车列表为空">
                        <Button type="primary">随便逛逛</Button>
                      </Empty>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* 操作栏 */}
        <div className="action">
          <div className="batch">
            共 {getTotalCount()} 件商品，已选择 {selectedCount()} 件，商品合计：
            <span className="red">¥ {selectedPrice()} </span>
          </div>
          <div className="total">
            <Button 
              size="large" 
              type="primary" 
              onClick={() => navigate('/checkout')}
            >
              下单结算
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
