import React from 'react';
import ButtonMyPage from '~/components/layout/button-mypage';
import ButtonLink from '~/components/layout/button-link';
import ButtonThread from '~/components/layout/button-thread';
import ButtonHome from '~/components/layout/button-home';
import { type NavItem } from '~/constants/nav';

interface ButtonGroupProps {
  item: NavItem;
  type: 'footer' | 'header';
}

export default function ButtonGroup({ item, type }: ButtonGroupProps) {
  switch (item.type) {
    case 'home': {
      return <ButtonHome item={item} type={type} />;
    }
    case 'thread': {
      return <ButtonThread item={item} type={type} />;
    }
    case 'link': {
      return <ButtonLink item={item} type={type} />;
    }
    case 'myPage': {
      return <ButtonMyPage item={item} type={type} />;
    }
    default: {
      return null;
    }
  }
}
