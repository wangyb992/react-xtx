import { useState, useEffect, useMemo } from 'react';

export const useCountDown = () => {
  // 存储原始秒数
  const [seconds, setSeconds] = useState(0);
  // 用于存储定时器ID，以便清除
  const [timer, setTimer] = useState(null);

  // 格式化时间为 mm:ss 格式
  const formatTime = useMemo(() => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    // 确保分和秒都是两位数，不足补零
    return `${mins.toString().padStart(2, '0')}分:${secs.toString().padStart(2, '0')}秒`;
  }, [seconds]);

  // 开启倒计时的函数
  const start = (duration) => {
    // 清除之前的定时器，防止多个定时器同时运行
    if (timer) {
      clearInterval(timer);
    }
    
    // 设置初始时间（确保是正数）
    const initialSeconds = Math.max(0, Math.floor(duration));
    setSeconds(initialSeconds);
    
    // 如果时间为0则不需要启动定时器
    if (initialSeconds === 0) {
      setTimer(null);
      return;
    }
    
    // 创建新的定时器
    const newTimer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(newTimer);
          setTimer(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    // 存储新的定时器ID
    setTimer(newTimer);
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);


  return {
    formatTime,  // 格式化后的时间字符串，如 "02:30"
    start        // 开启倒计时的方法，参数为秒数
  };
};

export default useCountDown;
