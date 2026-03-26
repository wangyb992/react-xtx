import React, { useState, useEffect, useMemo } from 'react';
import getPowerSet from './power-set';
import './GoodsSku.scss';

const spliter = '★';

// 根据skus数据得到路径字典对象
const getPathMap = (skus) => {
  const pathMap = {};
  if (skus && skus.length > 0) {
    skus.forEach(sku => {
      // 1. 过滤出有库存有效的sku
      if (sku.inventory) {
        // 2. 得到sku属性值数组
        const specs = sku.specs.map(spec => spec.valueName);
        // 3. 得到sku属性值数组的子集
        const powerSet = getPowerSet(specs);
        // 4. 设置给路径字典对象
        powerSet.forEach(set => {
          const key = set.join(spliter);
          // 如果没有就先初始化一个空数组
          if (!pathMap[key]) {
            pathMap[key] = [];
          }
          pathMap[key].push(sku.id);
        });
      }
    });
  }
  return pathMap;
};

// 初始化禁用状态
const initDisabledStatus = (specs, pathMap) => {
  if (!specs || specs.length === 0) return;
  
  return specs.map(spec => ({
    ...spec,
    values: spec.values.map(val => ({
      ...val,
      disabled: !pathMap[val.name]
    }))
  }));
};

// 得到当前选中规格集合
const getSelectedArr = (specs) => {
  const selectedArr = [];
  specs.forEach((spec, index) => {
    const selectedVal = spec.values.find(val => val.selected);
    selectedArr[index] = selectedVal ? selectedVal.name : undefined;
  });
  return selectedArr;
};

// 更新按钮的禁用状态
const updateDisabledStatus = (specs, pathMap) => {
  // 遍历每一种规格
  return specs.map((item, i) => {
    // 拿到当前选择的项目
    const selectedArr = getSelectedArr(specs);
    
    // 遍历每一个按钮
    const updatedValues = item.values.map(val => {
      if (val.selected) {
        return val;
      }
      
      // 创建临时选中数组来检查
      const tempSelectedArr = [...selectedArr];
      tempSelectedArr[i] = val.name;
      
      // 去掉undefined之后组合成key
      const key = tempSelectedArr.filter(value => value).join(spliter);
      
      return {
        ...val,
        disabled: !pathMap[key]
      };
    });
    
    return {
      ...item,
      values: updatedValues
    };
  });
};

const GoodsSku = ({ goods = { specs: [], skus: [] }, onChange }) => {
  const [specs, setSpecs] = useState([]);
  const pathMap = useMemo(() => getPathMap(goods.skus), [goods.skus]);
  
  // 初始化规格状态
  useEffect(() => {
    if (goods.specs && goods.specs.length > 0) {
      // 深拷贝初始规格数据并添加selected属性
      const initialSpecs = goods.specs.map(spec => ({
        ...spec,
        values: spec.values.map(val => ({
          ...val,
          selected: false
        }))
      }));
      
      // 初始化禁用状态
      const specsWithDisabled = initDisabledStatus(initialSpecs, pathMap);
      setSpecs(specsWithDisabled);
    }
  }, [goods.specs, pathMap]);
  
  const handleClickSpecs = (item, val) => {
    if (val.disabled) return;
    
    // 更新选中状态
    const updatedSpecs = specs.map(spec => {
      if (spec.id !== item.id) return spec;
      
      const updatedValues = spec.values.map(v => {
        // 如果点击的是已选中的值，则取消选中
        if (v.name === val.name) {
          return { ...v, selected: !v.selected };
        }
        // 否则，只有当前点击的才选中
        return { ...v, selected: false };
      });
      
      return { ...spec, values: updatedValues };
    });
    
    // 更新禁用状态
    const specsWithUpdatedDisabled = updateDisabledStatus(updatedSpecs, pathMap);
    setSpecs(specsWithUpdatedDisabled);
    
    // 准备传递给父组件的数据
    const selectedArr = getSelectedArr(specsWithUpdatedDisabled).filter(value => value);
    
    // 如果选中的规格数量和传入的规格总数相等则传出完整信息
    if (selectedArr.length === goods.specs.length) {
      const skuId = pathMap[selectedArr.join(spliter)][0];
      const sku = goods.skus.find(sku => sku.id === skuId);
      
      onChange && onChange({
        skuId: sku.id,
        price: sku.price,
        oldPrice: sku.oldPrice,
        inventory: sku.inventory,
        specsText: sku.specs.reduce((p, n) => `${p} ${n.name}：${n.valueName}`, '').trim()
      });
    } else {
      onChange && onChange({});
    }
  };
  
  return (
    <div className="goods-sku">
      {specs.map(item => (
        <dl key={item.id}>
          <dt>{item.name}</dt>
          <dd>
            {item.values.map(val => (
              val.picture ? (
                <img
                  key={val.name}
                  className={`${val.selected ? 'selected' : ''} ${val.disabled ? 'disabled' : ''}`}
                  onClick={() => handleClickSpecs(item, val)}
                  src={val.picture}
                  alt={val.name}
                />
              ) : (
                <span
                  key={val.name}
                  className={`${val.selected ? 'selected' : ''} ${val.disabled ? 'disabled' : ''}`}
                  onClick={() => handleClickSpecs(item, val)}
                >
                  {val.name}
                </span>
              )
            ))}
          </dd>
        </dl>
      ))}
    </div>
  );
};

export default GoodsSku;
