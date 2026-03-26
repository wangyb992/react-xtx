import { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const DEFAULT_WINDOW_SIZE = 24;
const DEFAULT_BUFFER = 200;

const createDebounce = (fn, delay) => {
  let timer = null;
  const debounced = (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
};

const getSafeRatioHeight = (item, columnWidth) => {
  const width = Number(item.width);
  const height = Number(item.height);
  if (!width || !height || width <= 0 || height <= 0) {
    return columnWidth;
  }
  return (columnWidth * height) / width;
};

const Waterfall = ({
  list = [],
  cols = 2,
  colGap = 12,
  rowGap = 12,
  loadMore,
  hasMore = false,
  loading = false,
  height = 760,
  renderItem
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: DEFAULT_WINDOW_SIZE });
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const loadMoreTriggerRef = useRef(null);

  const columnWidth = useMemo(() => {
    if (!containerWidth || cols <= 0) return 0;
    return (containerWidth - (cols - 1) * colGap) / cols;
  }, [containerWidth, cols, colGap]);

  const positioned = useMemo(() => {
    if (!columnWidth || !list.length) {
      return { items: [], heights: new Array(cols).fill(0) };
    }

    const heights = new Array(cols).fill(0);
    const items = list.map((item) => {
      const actualHeight = getSafeRatioHeight(item, columnWidth);
      const minHeight = Math.min(...heights);
      const colIndex = heights.indexOf(minHeight);
      const top = minHeight;
      const left = colIndex * (columnWidth + colGap);
      heights[colIndex] = minHeight + actualHeight + rowGap;

      return {
        ...item,
        top,
        left,
        actualHeight,
        width: columnWidth,
        bottom: top + actualHeight
      };
    });

    return { items, heights };
  }, [list, columnWidth, cols, colGap, rowGap]);

  const containerHeight = useMemo(() => {
    if (!positioned.heights.length) return 0;
    return Math.max(...positioned.heights, 0);
  }, [positioned]);

  const updateVisibleRange = useCallback(() => {
    const container = containerRef.current;
    if (!container || !positioned.items.length) return;

    const scrollTop = container.scrollTop;
    const clientHeight = container.clientHeight;
    const viewTop = scrollTop - DEFAULT_BUFFER;
    const viewBottom = scrollTop + clientHeight + DEFAULT_BUFFER;

    const visibleItems = positioned.items.filter(
      (item) => item.bottom > viewTop && item.top < viewBottom
    );

    if (!visibleItems.length) {
      setVisibleRange({ start: 0, end: Math.min(DEFAULT_WINDOW_SIZE, positioned.items.length) });
      return;
    }

    const firstIndex = positioned.items.indexOf(visibleItems[0]);
    const lastIndex = positioned.items.indexOf(visibleItems[visibleItems.length - 1]);
    const nextStart = Math.max(0, firstIndex - 8);
    const nextEnd = Math.min(positioned.items.length, lastIndex + 9);

    setVisibleRange((prev) => {
      if (prev.start === nextStart && prev.end === nextEnd) {
        return prev;
      }
      return { start: nextStart, end: nextEnd };
    });
  }, [positioned]);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    const debouncedResize = createDebounce(updateWidth, 250);
    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      debouncedResize.cancel();
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateVisibleRange);
    updateVisibleRange();

    return () => {
      container.removeEventListener('scroll', updateVisibleRange);
    };
  }, [updateVisibleRange]);

  useEffect(() => {
    updateVisibleRange();
  }, [positioned.items.length, updateVisibleRange]);

  useEffect(() => {
    const target = loadMoreTriggerRef.current;
    const root = containerRef.current;
    if (!target || !root || !loadMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        root,
        rootMargin: '120px'
      }
    );

    observer.observe(target);

    return () => observer.disconnect();
  }, [loadMore, hasMore, loading, containerHeight]);

  const visibleList = useMemo(() => {
    return positioned.items.slice(visibleRange.start, visibleRange.end);
  }, [positioned.items, visibleRange]);

  return (
    <div
      ref={containerRef}
      className="waterfall-container"
      style={{
        position: 'relative',
        width: '100%',
        height,
        overflow: 'auto'
      }}
    >
      <div style={{ position: 'relative', height: `${containerHeight}px` }}>
        {visibleList.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              top: `${item.top}px`,
              left: `${item.left}px`,
              width: `${item.width}px`,
              height: `${item.actualHeight}px`
            }}
          >
            {renderItem ? renderItem(item) : null}
          </div>
        ))}
      </div>

      <div
        ref={loadMoreTriggerRef}
        style={{
          position: 'absolute',
          top: `${Math.max(containerHeight - 1, 0)}px`,
          left: 0,
          width: '100%',
          height: '1px',
          pointerEvents: 'none'
        }}
      />

      {loading && (
        <div
          style={{
            position: 'absolute',
            top: `${containerHeight + 12}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#666',
            fontSize: 14
          }}
        >
          加载中...
        </div>
      )}

      {!hasMore && list.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: `${containerHeight + 12}px`,
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#999',
            fontSize: 14
          }}
        >
          没有更多了
        </div>
      )}
    </div>
  );
};

export default Waterfall;