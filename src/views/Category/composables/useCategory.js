import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getTopCategoryAPI } from '@/api/category';

export function useCategory() {
  // 获取路由参数
  const { id } = useParams();
  const location = useLocation();
  const [category, setCategory] = useState({});

  // 获取分类数据的函数
  const getCategory = async (categoryId = id) => {
    const res = await getTopCategoryAPI(categoryId);
    console.log(res);
    setCategory(res.data.result);
  };

  // 组件挂载时获取数据
  useEffect(() => {
    getCategory(id);
  }, [id]); // 依赖id变化时重新请求

  // 监听路由变化（针对相同组件内路由参数变化的情况）
  useEffect(() => {
    // 当路由路径变化时重新获取数据
    getCategory(id);
  }, [location.pathname, id]);

  return {
    category,
    getCategory
  };
}
