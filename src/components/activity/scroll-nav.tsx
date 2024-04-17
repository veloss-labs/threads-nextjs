'use client';

import React, { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import type { ScrollNavItem } from '~/constants/nav';

import { Button } from '~/components/ui/button';
import { ScrollArea } from '~/components/ui/scroll-area';
import { NAV_CONFIG } from '~/constants/nav';
import { useScrollNavLinkActive } from '~/libs/hooks/useMainLinkActive';

export default function ScrollNav() {
  return (
    <ScrollArea>
      <div className="flex flex-row space-x-3">
        {NAV_CONFIG.scrollNav.map((item) => (
          <ScrollNav.Item key={`scroll-nav-${item.id}`} item={item} />
        ))}
      </div>
    </ScrollArea>
  );
}

interface ItemProps {
  item: ScrollNavItem;
}

ScrollNav.Item = function Item({ item }: ItemProps) {
  const { isActive } = useScrollNavLinkActive({ item });

  const router = useRouter();

  const onClick = useCallback(() => {
    router.push(item.href);
  }, [item.href, router]);

  return (
    <Button
      role="link"
      variant={isActive ? 'default' : 'outline'}
      data-href={item.href}
      tabIndex={isActive ? -1 : 0}
      onClick={onClick}
    >
      {item.title}
    </Button>
  );
};
