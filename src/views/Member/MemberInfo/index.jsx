import React from 'react';
import './Memberinfo.scss';
import {useUserStore} from '@/stores/user'
import GoodsItem from '@/views/Home/components/GoodsItem';
import { getLikeListAPI } from '@/api/user';
import { useState, useEffect } from 'react';

const MemberInfo = () => {
  const {userInfo} = useUserStore();
  const [likeList, setLikeList] = useState([]);
  // 获取猜你喜欢列表
  const getLikeList = async () => {
    const res = await getLikeListAPI({ limit: 4 });
    console.log(res);
    setLikeList(res.data.result);
  }
  // 组件挂载时获取猜你喜欢列表
  useEffect(() => {
    getLikeList();
  }, []);
  return (
    <>
      <div className="member-home-overview">
        {/* 用户信息 */}
        <div className="user-meta">
          <div className="avatar">
            <img src={userInfo?.avatar} alt="用户头像" />
          </div>
          <h4>{userInfo?.account}</h4>
        </div>

        <div className="item">
          <a href="javascript:;">
            <span className="iconfont icon-hy"></span>
            <p>会员中心</p>
          </a>

          <a href="javascript:;">
            <span className="iconfont icon-aq"></span>
            <p>安全设置</p>
          </a>

          <a href="javascript:;">
            <span className="iconfont icon-dw"></span>
            <p>地址管理</p>
          </a>
        </div>
      </div>

      <div className="like-container">
        <div className="member-home-panel">
          <div className="header">
            <h4>猜你喜欢</h4>
          </div>

          <div className="goods-list">
            {/* 这里可以渲染商品列表，类似于Vue中的GoodsItem组件 */}
            {likeList.map(good => (
              <GoodsItem key={good.id} goods={good} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MemberInfo;
    