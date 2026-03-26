import React, { useState, useRef  } from 'react';
import './ImageView.scss';

const GoodsImage = (props) => {
  // 图片列表
  const imageList = props?.imageList || [];
  // 图片列表
  // const imageList = [
  //   "https://yanxuan-item.nosdn.127.net/d917c92e663c5ed0bb577c7ded73e4ec.png",
  //   "https://yanxuan-item.nosdn.127.net/e801b9572f0b0c02a52952b01adab967.jpg",
    // "https://yanxuan-item.nosdn.127.net/b52c447ad472d51adbdde1a83f550ac2.jpg",
    // "https://yanxuan-item.nosdn.127.net/f93243224dc37674dfca5874fe089c60.jpg",
    // "https://yanxuan-item.nosdn.127.net/f881cfe7de9a576aaeea6ee0d1d24823.jpg"


  // 状态管理
  const [activeIndex, setActiveIndex] = useState(0);
  const [showLarge, setShowLarge] = useState(false);
  const [layerPos, setLayerPos] = useState({ left: 0, top: 0 });
  const [bgPos, setBgPos] = useState({ x: 0, y: 0 });
  
  // DOM引用
  const middleRef = useRef(null);

  // 处理小图点击切换
  const handleSmallImgClick = (index) => {
    setActiveIndex(index);
    // 重置位置
    setLayerPos({ left: 0, top: 0 });
    setBgPos({ x: 0, y: 0 });
  };

  // 处理鼠标移动事件
  const handleMouseMove = (e) => {
    if (!middleRef.current) return;
    
    const { left, top, width, height } = middleRef.current.getBoundingClientRect();
    const layerSize = 200; // 滑块大小
    const maxLeft = width - layerSize;
    const maxTop = height - layerSize;
    
    // 计算鼠标在中间图片内的相对位置
    let mouseX = e.clientX - left;
    let mouseY = e.clientY - top;
    
    // 限制滑块在图片范围内
    let layerLeft = mouseX - layerSize / 2;
    let layerTop = mouseY - layerSize / 2;
    
    layerLeft = Math.max(0, Math.min(layerLeft, maxLeft));
    layerTop = Math.max(0, Math.min(layerTop, maxTop));
    
    // 计算大图背景位置（反向移动，比例为2倍）
    const bgX = -layerLeft * 2;
    const bgY = -layerTop * 2;
    
    setLayerPos({ left: layerLeft, top: layerTop });
    setBgPos({ x: bgX, y: bgY });
  };

  // 处理鼠标进入和离开
  const handleMouseEnter = () => {
    setShowLarge(true);
  };

  const handleMouseLeave = () => {
    setShowLarge(false);
  };

  return (
    <div className="goods-image">
      {/* 左侧大图 */}
      <div 
        className="middle" 
        ref={middleRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img src={imageList[activeIndex]} alt="商品图片" />
        {/* 蒙层小滑块 */}
        <div 
          className="layer" 
          style={{ 
            left: `${layerPos.left}px`, 
            top: `${layerPos.top}px` 
          }}
        ></div>
      </div>

      {/* 小图列表 */}
      <ul className="small">
        {imageList.map((img, i) => (
          <li 
            key={i} 
            onClick={() => handleSmallImgClick(i)}
            className={i === activeIndex ? 'active' : ''}
          >
            <img src={img} alt={`商品缩略图 ${i+1}`} />
          </li>
        ))}
      </ul>

      {/* 放大镜大图 */}
      <div 
        className="large" 
        style={{
          backgroundImage: `url(${imageList[activeIndex]})`,
          backgroundPositionX: `${bgPos.x}px`,
          backgroundPositionY: `${bgPos.y}px`,
          display: showLarge ? 'block' : 'none'
        }}
      ></div>
    </div>
  );
};

export default GoodsImage;
