import { useState, useEffect, useRef } from 'react';

export function useResizablePanels(initialLeft = 320, initialMiddle = 560) {
  const [leftWidth, setLeftWidth] = useState(initialLeft);
  const [middleWidth, setMiddleWidth] = useState(initialMiddle);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const startResizeLeft = (e) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    startWidthRef.current = leftWidth;
    setIsResizingLeft(true);
  };

  const startResizeRight = (e) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    startWidthRef.current = middleWidth;
    setIsResizingRight(true);
  };

  useEffect(() => {
    if (!isResizingLeft && !isResizingRight) return;

    const handlePointerMove = (e) => {
      const delta = e.clientX - startXRef.current;
      if (isResizingLeft) {
        setLeftWidth(Math.max(250, Math.min(600, startWidthRef.current + delta)));
      } else {
        setMiddleWidth(Math.max(300, Math.min(1000, startWidthRef.current + delta)));
      }
    };

    const handlePointerUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isResizingLeft, isResizingRight]);

  return {
    leftWidth,
    middleWidth,
    isResizingLeft,
    isResizingRight,
    startResizeLeft,
    startResizeRight,
  };
}
