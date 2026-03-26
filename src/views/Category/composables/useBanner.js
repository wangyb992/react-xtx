import { useState, useEffect } from 'react';
import { getBannerAPI } from '@/api/layout';

export function useBanner() {
  // 用useState替代Vue的ref来管理状态
  const [bannerList, setBannerList] = useState([]);
  const [loading, setLoading] = useState(false); // 增加加载状态
  const [error, setError] = useState(null); // 增加错误状态

  const getBanner = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getBannerAPI({
        distributionSite: '2'
      });
      setBannerList(res.data.result || []);
    } catch (err) {
      console.error('获取轮播图数据失败:', err);
      setError(err);
      setBannerList([]);
    } finally {
      setLoading(false);
    }
  };

  // 用useEffect替代Vue的onMounted生命周期
  useEffect(() => {
    getBanner();
  }, []); // 空依赖数组表示只在组件挂载时执行

  return {
    bannerList,
    getBanner,
    loading,
    error
  };
}
    