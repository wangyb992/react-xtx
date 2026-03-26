基于 React 的黑马小兔鲜项目。

# 性能优化说明（FCP / LCP）

已完成以下优化：

- 路由懒加载：`src/router/index.jsx` 使用 `React.lazy + Suspense` 按路由拆分页面代码。
- 大包分 chunk：`vite.config.js` 增加 `manualChunks`，将 `react`、`react-router`、`antd`、`zustand` 等拆分为独立 chunk。
- 图片加载策略：首屏 Banner 首图高优先级加载，其余列表图懒加载并异步解码。
- CDN 加速支持：`vite.config.js` 读取 `VITE_CDN_BASE_URL` 作为构建 `base`。

## CDN 配置

1. 复制 `.env.example` 为 `.env.production`（或 `.env`）
2. 设置：

```env
VITE_CDN_BASE_URL=https://cdn.example.com/react-xiaotuxian/
```

> 注意：末尾建议保留 `/`，避免静态资源路径拼接问题。

## 本地运行

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
npm run preview
```
