import { lazy, Suspense, useEffect, useState } from 'react';
import HomeCategory from './components/Category';
import HomeBanner from './components/Banner';

const HomeNewProducts = lazy(() => import('./components/NewProducts'));
const HotProducts = lazy(() => import('./components/HotProducts'));
const HomeProduct = lazy(() => import('./components/HomeProduct'));

const Home = () => {
  const [showBelowFold, setShowBelowFold] = useState(false);

  useEffect(() => {
    let timer;
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(() => setShowBelowFold(true), { timeout: 1200 });
    } else {
      timer = window.setTimeout(() => setShowBelowFold(true), 400);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, []);

  return (
  <>
    <div className="container">
    <HomeCategory />
    <HomeBanner />
    </div>

    {showBelowFold && (
      <Suspense fallback={<div className="container">内容加载中...</div>}>
        <HomeNewProducts />
        <HotProducts />
        <HomeProduct />
      </Suspense>
    )}
  </>

  )
}
export default Home;