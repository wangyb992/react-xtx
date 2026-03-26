import React from 'react';
import { Link } from 'react-router-dom';
import {
  CustomerServiceOutlined,
  QuestionCircleOutlined,
  WechatOutlined,
  WeiboOutlined,
  QrcodeOutlined,
  ShoppingOutlined,
  CarOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import './Footer.scss';
const Footer = () => {
  return (
    <footer className="app_footer">
      {/* 联系我们 */}
      <div className="contact">
        <div className="container">
          <dl>
            <dt>客户服务</dt>
            <dd>
              <CustomerServiceOutlined className="iconfont" /> 在线客服
            </dd>
            <dd>
              <QuestionCircleOutlined className="iconfont" /> 问题反馈
            </dd>
          </dl>
          <dl>
            <dt>关注我们</dt>
            <dd>
              <WechatOutlined className="iconfont" /> 公众号
            </dd>
            <dd>
              <WeiboOutlined className="iconfont" /> 微博
            </dd>
          </dl>
          <dl>
            <dt>下载APP</dt>
            <dd className="qrcode">
              <img src='/src\assets\images\qrcode.jpg' alt="二维码" width="120" height="120" />
            </dd>
            <dd className="download">
              <span>扫描二维码</span>
              <span>立马下载APP</span>
              <Link to="javascript:;">下载页面</Link>
            </dd>
          </dl>
          <dl>
            <dt>服务热线</dt>
            <dd className="hotline">
              400-0000-000 <small>周一至周日 8:00-18:00</small>
            </dd>
          </dl>
        </div>
      </div>

      {/* 其它 */}
      <div className="extra">
        <div className="container">
          <div className="slogan">
            <Link to="javascript:;">
              <ShoppingOutlined className="iconfont" />
              <span>价格亲民</span>
            </Link>
            <Link to="javascript:;">
              <CarOutlined className="iconfont" />
              <span>物流快捷</span>
            </Link>
            <Link to="javascript:;">
              <SmileOutlined className="iconfont" />
              <span>品质新鲜</span>
            </Link>
          </div>

          {/* 版权信息 */}
          <div className="copyright">
            <p>
              <Link to="javascript:;">关于我们</Link>
              <Link to="javascript:;">帮助中心</Link>
              <Link to="javascript:;">售后服务</Link>
              <Link to="javascript:;">配送与验收</Link>
              <Link to="javascript:;">商务合作</Link>
              <Link to="javascript:;">搜索推荐</Link>
              <Link to="javascript:;">友情链接</Link>
            </p>
            <p>CopyRight © 小兔鲜儿</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;