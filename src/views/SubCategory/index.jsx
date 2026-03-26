import InfiniteScroll from 'react-infinite-scroll-component';
import React, { useState, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Breadcrumb, Tabs, List, Card, Image, Spin, Empty } from 'antd';
import { getCategoryFilterAPI, getSubCategoryAPI } from '@/api/category';
import GoodsItem from '../Home/components/GoodsItem';
import './SubCategoryGoodsList.scss';
import { Avatar } from 'antd';
import VirtualList from 'rc-virtual-list';
const CONTAINER_HEIGHT = 400;
const PAGE_SIZE = 20;
const { TabPane } = Tabs;

const SubCategoryGoodsList = () => {
  // 路由相关
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 状态管理
  const [filterData, setFilterData] = useState({});
  const [goodList, setGoodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [subCategoryParams, setSubCategoryParams] = useState({
    categoryId: id,
    page: 1,
    pageSize: 20,
    sortField: 'publishTime'
  });

  // 获取分类筛选数据
  const getCategoryFilter = useCallback(async (categoryId) => {
    try {
      const res = await getCategoryFilterAPI(categoryId);
      setFilterData(res.data.result);
    } catch (error) {
      console.error('获取分类筛选数据失败:', error);
    }
  }, []);

  // 获取商品列表数据
  const getSubCategory = useCallback(async () => {
    try {
      const res = await getSubCategoryAPI(subCategoryParams);
      setGoodList(res.data.result.items);
    } catch (error) {
      console.error('获取商品列表失败:', error);
    } 
  }, [subCategoryParams]);

  // 标签切换处理
  const handleTabChange = (key) => {
    setSubCategoryParams(prev => ({
      ...prev,
      sortField: key,
      page: 1
    }));
  };

  // 加载更多数据
const loadMore = useCallback(async () => {
  console.log('加载更多数据咯');
  if (disabled || loading) return;
  setLoading(true);
  console.log('加载更多数据咯');

  try {
    const nextPage = subCategoryParams.page + 1;
    const params = { ...subCategoryParams, page: nextPage };
    const res = await getSubCategoryAPI(params);
    
    if (res.data.result && res.data.result.items) {
      // 添加新数据到现有列表
      setGoodList(prev => [...prev, ...res.data.result.items]);
      // 更新页码
      setSubCategoryParams(prev => ({ ...prev, page: nextPage }));
      // 如果没有更多数据，禁用加载更多
      if (res.data.result.items.length === 0) {
        setDisabled(true);
      }
    }
  } catch (error) {
    console.error('加载更多数据失败:', error);
  } finally {
    setLoading(false);
  }
}, [subCategoryParams, disabled, loading, getSubCategoryAPI]);


  // 监听参数变化重新获取数据
  useEffect(() => {
    getSubCategory();
  });

  // 组件挂载时获取分类数据
  useEffect(() => {
    getCategoryFilter(id);
    // 初始化参数
    setSubCategoryParams(prev => ({
      ...prev,
      categoryId: id,
      page: 1
    }));
  }, [id]);

  // 渲染商品项
  

  return (
    <div className="container">
      {/* 面包屑导航 */}
      <div className="bread-container">
        <Breadcrumb separator=">">
          <Breadcrumb.Item onClick={() => navigate('/')}>首页</Breadcrumb.Item>
          {filterData.parentId && (
            <Breadcrumb.Item onClick={() => navigate(`/category/${filterData.parentId}`)}>
              {filterData.parentName}
            </Breadcrumb.Item>
          )}
          <Breadcrumb.Item>{filterData.name}</Breadcrumb.Item>
        </Breadcrumb>
      </div>

      <div className="sub-container">
        {/* 排序标签 */}
        <Tabs 
          activeKey={subCategoryParams.sortField} 
          onChange={handleTabChange}
          className="sort-tabs"
        >
          <TabPane tab="最新商品" key="publishTime" />
          <TabPane tab="最高人气" key="orderNum" />
          <TabPane tab="评论最多" key="evaluateNum" />
        </Tabs>

        {/* 商品列表 */}
        
            <InfiniteScroll
              dataLength={goodList.length}
              next={loadMore}
              hasMore={!disabled}
            >
            <div className='body'>
          {goodList.map((item) => (
              <GoodsItem key={item.id} goods={item} />
            ))}
            </div>
            </InfiniteScroll>
      
                        
      </div>
    </div>
  );
};


export default SubCategoryGoodsList;
