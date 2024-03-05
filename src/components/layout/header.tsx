'use client';
import React, { useEffect, useRef, useState } from 'react';
import { getTargetElement, getWindowScrollTop } from '~/libs/browser/dom';
import { useEventListener } from '~/libs/hooks/useEventListener';
import { optimizeAnimation } from '~/utils/utils';

interface HeaderProps {
  children: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  return <Header.Internal>{children}</Header.Internal>;
}

Header.Internal = function Item({ children }: HeaderProps) {
  const ref = useRef<HTMLElement>(null);
  const [translateY, setTranslateY] = useState(0);
  const [height, setHeight] = useState(0);

  const prevScrollTop = useRef(0);

  const scrollMethod = optimizeAnimation(() => {
    const scrollTop = getWindowScrollTop();

    // 현재 스크롤이 내려가는지 올라가는지 판단
    const isScrollDown = scrollTop > prevScrollTop.current;

    // 스크롤이 내려가는 경우
    if (isScrollDown) {
      // 헤더가 사라지는 경우
      if (scrollTop > height) {
        setTranslateY(-height);
      } else {
        setTranslateY(-scrollTop);
      }
    } else {
      // 스크롤이 올라가는 경우
      setTranslateY(0);
    }

    prevScrollTop.current = scrollTop;
  });

  useEventListener('scroll', scrollMethod);

  useEffect(() => {
    const $ele = getTargetElement(ref);
    if (!$ele) return;
    const bounding = $ele.getBoundingClientRect();
    const height = bounding.height + 10;
    setHeight(height);
  }, []);

  return (
    <header
      className="sticky top-0 z-40 backdrop-blur-md"
      style={{
        transform: `translateY(${translateY}px)`,
      }}
      ref={ref}
    >
      <div className="container">
        <div className="flex h-16 items-center justify-between sm:h-20 sm:py-6">
          {children}
        </div>
      </div>
    </header>
  );
};
