import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Breadcrumb, Tabs } from 'antd';
import { getCategoryFilterAPI, getSubCategoryAPI } from '@/api/category';
import Waterfall from '@/components/Waterfall';
import './SubCategoryGoodsList.scss';

const PAGE_SIZE = 20;
const { TabPane } = Tabs;

const DEFAULT_IMAGE_SIZE = { width: 1, height: 1 };

const loadImageSize = (src) => {
  return new Promise((resolve) => {
    if (!src) {
      resolve(DEFAULT_IMAGE_SIZE);
      return;
    }
    const image = new window.Image();
    image.onload = () => {
      resolve({
        width: image.naturalWidth || DEFAULT_IMAGE_SIZE.width,
        height: image.naturalHeight || DEFAULT_IMAGE_SIZE.height
      });
    };
    image.onerror = () => resolve(DEFAULT_IMAGE_SIZE);
    image.src = src;
  });
};

const SubCategoryGoodsList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState({});
  const [goodList, setGoodList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [imageSizeMap, setImageSizeMap] = useState({});
  const [subCategoryParams, setSubCategoryParams] = useState({
    categoryId: id,
    page: 1,
    pageSize: PAGE_SIZE,
    sortField: 'publishTime'
  });
  const { categoryId, sortField, pageSize } = subCategoryParams;

  const getCategoryFilter = useCallback(async (categoryId) => {
    try {
      const res = await getCategoryFilterAPI(categoryId);
      setFilterData(res.data.result);
    } catch (error) {
      console.error('获取分类筛选数据失败:', error);
    }
  }, []);

  const getGoodsByParams = useCallback(async (params) => {
    const res = await getSubCategoryAPI(params);
    return res?.data?.result?.items || [];
  }, []);

  const fetchFirstPage = useCallback(async (params) => {
    setLoading(true);
    try {
      const nextParams = { ...params, page: 1 };
      const items = await getGoodsByParams(nextParams);
      setGoodList(items);
      setDisabled(items.length < PAGE_SIZE);
      setSubCategoryParams((prev) => ({ ...prev, page: 1 }));
    } catch (error) {
      console.error('获取商品列表失败:', error);
    } finally {
      setLoading(false);
    }
  }, [getGoodsByParams]);

  const loadMore = useCallback(async () => {
    if (disabled || loading) return;

    setLoading(true);
    try {
      const nextPage = subCategoryParams.page + 1;
      const params = { ...subCategoryParams, page: nextPage, categoryId: id };
      const items = await getGoodsByParams(params);

      setGoodList((prev) => [...prev, ...items]);
      setSubCategoryParams((prev) => ({ ...prev, page: nextPage }));
      if (items.length < PAGE_SIZE) {
        setDisabled(true);
      }
    } catch (error) {
      console.error('加载更多数据失败:', error);
    } finally {
      setLoading(false);
    }
  }, [disabled, loading, subCategoryParams, id, getGoodsByParams]);

  useEffect(() => {
    getCategoryFilter(id);
    setGoodList([]);
    setDisabled(false);
    setImageSizeMap({});
    setSubCategoryParams((prev) => ({
      ...prev,
      categoryId: id,
      page: 1,
      sortField: 'publishTime'
    }));
  }, [id, getCategoryFilter]);

  useEffect(() => {
    if (!categoryId) return;
    fetchFirstPage({
      categoryId,
      page: 1,
      pageSize,
      sortField
    });
  }, [categoryId, sortField, pageSize, fetchFirstPage]);

  useEffect(() => {
    let cancelled = false;
    const uncachedItems = goodList.filter(
      (item) => item.picture && !imageSizeMap[item.picture]
    );

    if (!uncachedItems.length) return;

    Promise.all(
      uncachedItems.map(async (item) => {
        const size = await loadImageSize(item.picture);
        return { src: item.picture, size };
      })
    ).then((results) => {
      if (cancelled) return;

      setImageSizeMap((prev) => {
        const next = { ...prev };
        let changed = false;

        results.forEach(({ src, size }) => {
          if (!next[src]) {
            next[src] = size;
            changed = true;
          }
        });

        return changed ? next : prev;
      });
    });

    return () => {
      cancelled = true;
    };
  }, [goodList, imageSizeMap]);

  const handleTabChange = (key) => {
    setSubCategoryParams(prev => ({
      ...prev,
      sortField: key,
      page: 1
    }));
    setDisabled(false);
  };

  const waterfallList = useMemo(() => {
    return goodList.map((item) => {
      const size = imageSizeMap[item.picture] || DEFAULT_IMAGE_SIZE;
      return {
        ...item,
        width: size.width,
        height: size.height
      };
    });
  }, [goodList, imageSizeMap]);

  return (
    <div className="container">
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
        <Tabs 
          activeKey={subCategoryParams.sortField} 
          onChange={handleTabChange}
          className="sort-tabs"
        >
          <TabPane tab="最新商品" key="publishTime" />
          <TabPane tab="最高人气" key="orderNum" />
          <TabPane tab="评论最多" key="evaluateNum" />
        </Tabs>

        <Waterfall
          list={waterfallList}
          cols={5}
          colGap={16}
          rowGap={16}
          height={760}
          loadMore={loadMore}
          hasMore={!disabled}
          loading={loading}
          renderItem={(item) => (
            <Link to={`/detail/${item.id}`} className="waterfall-goods-card">
              <img src={item.picture} alt={item.name || '商品图片'} loading="lazy" />
              <p className="name">{item.name}</p>
              <p className="desc">{item.desc}</p>
              <p className="price">&yen;{item.price}</p>
            </Link>
          )}
        />
      </div>
    </div>
  );
};


export default SubCategoryGoodsList;
