import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Carousel } from 'antd'; // 假设使用Ant Design替代Element Plus
import GoodsItem from '@/views/Home/components/GoodsItem';
import { useBanner } from '@/views/Category/composables/useBanner';
import { useCategory } from '@/views/Category/composables/useCategory';
import styles from './Category.module.scss';

const Category = () => {
  // 获取分类和轮播数据
  const { category } = useCategory();
  const { bannerList } = useBanner();

  // 处理可能的undefined数据
  const children = category?.children || [];

  return (
    <div className={styles['top-category']}>
      <div className={`${styles.container} ${styles['m-top-20']}`}>
        {/* 面包屑导航 */}
        <div className={styles['bread-container']}>
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/">首页</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{category?.name || ''}</Breadcrumb.Item>
          </Breadcrumb>
        </div>

        {/* 轮播图 */}
        <div className={styles['home-banner']}>
          <Carousel height="500px">
            {bannerList.map(item => (
              <div key={item.id}>
                <img 
                  src={item.imgUrl} 
                  alt={`轮播图${item.id}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}
          </Carousel>
        </div>
        

        {/* 子分类列表 */}
        <div className={styles['sub-list']}>
          <h3>全部分类</h3>
          <ul>
            {children.map(i => (
              <li key={i.id}>
                <Link to={`/category/sub/${i.id}`}>
                  <img src={i.picture} alt={i.name} />
                  <p>{i.name}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* 推荐商品 */}
        {children.map(item => (
          <div key={item.id} className={styles['ref-goods']}>
            <div className={styles.head}>
              <h3>- {item.name} -</h3>
            </div>
            <div className={styles.body}>
              {item.goods?.map(good => (
                <GoodsItem key={good.id} goods={good} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
