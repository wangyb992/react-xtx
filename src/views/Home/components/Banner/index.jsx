import React, { useMemo } from 'react';
import './HomeBanner.scss';
import { getBannerAPI } from '@/api/home';
import { useEffect, useState } from 'react';

// 轮播图数据（实际项目可替换为接口请求数据）


const HomeBanner = () => {
  const [bannerList, setBannerList] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const safeIndex = useMemo(() => {
    if (!bannerList.length) return 0;
    return Math.min(activeIndex, bannerList.length - 1);
  }, [activeIndex, bannerList.length]);

  useEffect(() => {
    getBannerAPI().then(res => {
      console.log('轮播图数据', res);
      setBannerList(res.data.result);
    })
  }, [])

  useEffect(() => {
    if (bannerList.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % bannerList.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [bannerList.length]);

  return (
    <div className="home-banner">
      <div className="slides" style={{ transform: `translateX(-${safeIndex * 100}%)` }}>
        {bannerList.map((banner, index) => (
          <div className="slide" key={banner.id}>
            <img 
              src={banner.imgUrl} 
              alt=''
              loading={index === 0 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : 'low'}
              decoding={index === 0 ? 'sync' : 'async'}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1240x500?text=Banner+Error';
              }}
            />
          </div>
        ))}
      </div>

      <div className="dots">
        {bannerList.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={index === safeIndex ? 'active' : ''}
            onClick={() => setActiveIndex(index)}
            aria-label={`切换到第${index + 1}张轮播图`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeBanner;