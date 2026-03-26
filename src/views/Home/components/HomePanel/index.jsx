import React from 'react';
import './HomePanel.scss';

const HomePanel = ({ title = '默认标题', subTitle = '默认副标题', children }) => {
  return (
    <div className="home-panel">
      <div className="container">
        <div className="head">
          {/* 主标题和副标题 */}
          <h3>
            {title}
            <small>{subTitle}</small>
          </h3>
        </div>

        {/* 主体内容区域 */}
        {children}
      </div>
    </div>
  );
};

export default HomePanel;