import React from 'react';
import { Link, Outlet,NavLink } from 'react-router-dom';
import './Member.scss';

const MemberCenter = () => {
  return (
    <div className='container'>
      <div className="member-container">
        <div className="xtx-member-aside">
          <div className="user-manage">
            <h4>我的账户</h4>
            <div className="links">
              <NavLink 
                to="/member/user" 
              >
                个人中心
              </NavLink>
            </div>

            <h4>交易管理</h4>
            <div className="links">
              <NavLink 
                to="/member/order" 
              >
                我的订单
              </NavLink>
            </div>
          </div>
        </div>

        <div className="article">
          {/* 三级路由的挂载点 */}
          <Outlet />
        </div>
      </div>
    </div>

  );
};

export default MemberCenter;
