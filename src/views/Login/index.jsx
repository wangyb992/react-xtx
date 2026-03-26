import React from 'react';
import '@ant-design/v5-patch-for-react-19';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Input, Checkbox, Button, message } from 'antd';
import './Login.scss';
import { UserOutlined, LockOutlined, DoubleRightOutlined } from '@ant-design/icons';
// import { AngleRight } from '@tabler/icons-react';
import { useState } from 'react';
import { useUserStore } from '@/stores/user';

const Login = () => {
  const navigate = useNavigate();
  const { getUserInfo } = useUserStore();
  const [form] = Form.useForm();
// 表单数据对象
const [userInfo] = useState({
    account: "xiaotuxian001",
    password: "123456",
    agree: false
})
  const onFinish = async (values) => {
    console.log('登录表单提交:', values);
    await getUserInfo({ account: values.account, password: values.password })  
    // 这里添加登录逻辑
    message.success('登录成功');
    message.success({
      content: '登录成功',
      placement: 'topRight',
    });
    // 登录成功后跳转到首页
    navigate('/');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('登录表单验证失败:', errorInfo);
    message.error('请检查输入的信息');
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="container m-top-20">
          <h1 className="logo">
            <Link to="/">小兔鲜</Link>
          </h1>
          <Link className="entry" to="/">
          <DoubleRightOutlined style={{ color: '#52c41a' }} />
            进入网站首页

          </Link>
        </div>
      </header>

      <section className="login-section">
        <div className="wrapper">
          <nav>
            <a href="javascript:;">账户登录</a>
          </nav>

          <div className="account-box">
            <div className="form">
              <Form
                form={form}
                layout="horizontal"
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                statusIcon
                initialValues={userInfo}
              >
                <Form.Item
                  label="账户"
                  name="account"
                  rules={[{ required: true, message: '请输入账户名' }]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Username" value={userInfo.account} />
                </Form.Item>

                <Form.Item 
                  label="密码"
                  name="password"
                  rules={[{ required: true, message: '请输入密码' }]}
                >
                  <Input prefix={<LockOutlined />} type="password" placeholder="Password" value={userInfo.password} />
                </Form.Item>

                <Form.Item
                  name="agreement"
                  valuePropName="checked"
                  wrapperCol={{ offset: 6, span: 18 }}
                  rules={[{ required: true, message: '请同意隐私条款和服务条款' }]}
                >
                  <Checkbox size="large">
                    我已同意隐私条款和服务条款
                  </Checkbox>
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                  <Button 
                    type="primary" 
                    size="large" 
                    htmlType="submit" 
                    className="subBtn"
                  >
                    点击登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </section>

      <footer className="login-footer">
        <div className="container">
          <p>
            <a href="javascript:;">关于我们</a>
            <a href="javascript:;">帮助中心</a>
            <a href="javascript:;">售后服务</a>
            <a href="javascript:;">配送与验收</a>
            <a href="javascript:;">商务合作</a>
            <a href="javascript:;">搜索推荐</a>
            <a href="javascript:;">友情链接</a>
          </p>
          <p>CopyRight &copy; 小兔鲜儿</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
    