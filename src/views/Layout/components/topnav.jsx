import React from 'react';
import { Popconfirm } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './topNav.scss';
import { useUserStore } from '@/stores/user';
import { useNavigate } from 'react-router-dom';
const TopNav = () => {
  const navigate = useNavigate();
  // 这里使用一个状态模拟登录状态，实际项目中可能从全局状态管理获取
  // const isLoggedIn = false;
  // const username = "周杰伦";
  const { userInfo, clearUserInfo} = useUserStore();
  // 退出登录处理函数
  const handleLogout = () => {
    // 实际项目中这里会处理退出登录逻辑
    clearUserInfo()
    console.log("用户已退出登录");
  };

  return (
    <nav className="app-topnav">
      <div className="container">
        <ul>
          {userInfo.token ? (
            <>
              <li>
                <a href="javascript:;">
                  <UserOutlined />
                  {userInfo.nickname}
                </a>
              </li>
              <li>
                <Popconfirm
                  title="确认退出吗?"
                  onConfirm={handleLogout}
                  okText="确认"
                  cancelText="取消"
                >
                  <a href="javascript:;" className="logout-link">退出登录</a>
                </Popconfirm>
              </li>
              <li><a href="javascript:;" onClick={() => navigate('/member/order')}>我的订单</a></li>
              <li><a href="javascript:;" onClick={() => navigate('/member/user')}>会员中心</a></li>
            </>
          ) : (
            <>
              <li><a href="/login">请先登录</a></li>
              <li><a href="javascript:;">帮助中心</a></li>
              <li><a href="javascript:;">关于我们</a></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default TopNav;
