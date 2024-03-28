import { afterAll, describe, expect, test, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useMainLinkActive } from '../useMainLinkActive';
import { NAV_CONFIG } from '~/constants/nav';
import { Icons } from '~/components/icons';

describe('useMainLinkActive', () => {
  afterAll(() => {
    vi.unstubAllGlobals();
  });

  describe('useMainLinkActive navigation 렌더링', () => {
    test('mainNav - Home', () => {
      const item = NAV_CONFIG.mainNav.at(0)!;

      const { result } = renderHook(() =>
        useMainLinkActive({
          item,
        }),
      );

      expect(result.current).toMatchObject({
        isActive: false,
        href: '/',
        Icon: Icons.home,
      });
    });

    test('mainNav - search', () => {
      const item = NAV_CONFIG.mainNav.at(1)!;

      const { result } = renderHook(() =>
        useMainLinkActive({
          item,
        }),
      );

      expect(result.current).toMatchObject({
        isActive: false,
        href: '/',
        Icon: Icons.search,
      });
    });

    test('mainNav - thread', () => {
      const item = NAV_CONFIG.mainNav.at(2)!;

      const { result } = renderHook(() =>
        useMainLinkActive({
          item,
        }),
      );

      expect(result.current).toMatchObject({
        isActive: false,
        href: '/',
        Icon: Icons.pen,
      });
    });

    test('mainNav - activity', () => {
      const item = NAV_CONFIG.mainNav.at(3)!;

      const { result } = renderHook(() =>
        useMainLinkActive({
          item,
        }),
      );

      expect(result.current).toMatchObject({
        isActive: false,
        href: '/',
        Icon: Icons.heart,
      });
    });

    test('mainNav - myPage', () => {
      const item = NAV_CONFIG.mainNav.at(4)!;

      const { result } = renderHook(() =>
        useMainLinkActive({
          item,
        }),
      );

      expect(result.current).toMatchObject({
        isActive: false,
        href: '/',
        Icon: Icons.user,
      });
    });
  });
});
