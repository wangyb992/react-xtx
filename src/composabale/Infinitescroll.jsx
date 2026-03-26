import React, { useRef, useEffect, useState, useCallback } from 'react';

const InfiniteScroll = ({
  load,
  disabled = false,
  threshold = 100, // 距离底部多少像素时触发加载
  children,
  loadingIndicator = <div>加载中...</div>
}) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // 处理滚动事件
  const handleScroll = useCallback(() => {
    // 如果禁用或正在加载，则不执行
    if (disabled || isLoading) return;

    const container = containerRef.current;
    if (!container) return;

    // 计算滚动位置
    const { scrollTop, clientHeight, scrollHeight } = container;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - threshold;

    // 接近底部时触发加载
    if (isNearBottom) {
      setIsLoading(true);
      // 执行加载函数，并等待其完成
      Promise.resolve(load()).finally(() => {
        setIsLoading(false);
      });
    }
  }, [load, disabled, isLoading, threshold]);

  // 添加滚动监听
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // 初始检查一次，可能内容不足需要立即加载
      handleScroll();
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  return (
    <div ref={containerRef} style={{ overflow: 'auto', height: '100%' }}>
      {children}
      {/* 显示加载指示器（如果正在加载且未禁用） */}
      {!disabled && isLoading && loadingIndicator}
    </div>
  );
};

export default InfiniteScroll;