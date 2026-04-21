import { useState, useEffect } from 'react';

export function useResizablePanels(initialLeft = 500, initialMiddle = 1000) {
  const [leftWidth, setLeftWidth] = useState(initialLeft);
  const [middleWidth, setMiddleWidth] = useState(initialMiddle);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isResizingLeft) {
        setLeftWidth(Math.max(250, Math.min(600, e.clientX)));
      } else if (isResizingRight) {
        setMiddleWidth(Math.max(300, Math.min(1000, e.clientX - leftWidth)));
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = 'default';
    };

    if (isResizingLeft || isResizingRight) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = 'auto';
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight, leftWidth]);

  return {
    leftWidth,
    middleWidth,
    isResizingLeft,
    isResizingRight,
    startResizeLeft: () => setIsResizingLeft(true),
    startResizeRight: () => setIsResizingRight(true),
  };
}
