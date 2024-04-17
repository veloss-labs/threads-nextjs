import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { NAV_CONFIG } from '~/constants/nav';
import {
  useMainLinkActive,
  useScrollNavLinkActive,
} from '../useMainLinkActive';

const mockUsePathname = vi.fn();

function setupNextNavigationMock() {
  vi.mock('next/navigation', async (importOriginal) => {
    return {
      ...(await importOriginal<typeof import('next/navigation')>()),
      usePathname: () => mockUsePathname(),
    };
  });
}

describe('useMainLinkActive', () => {
  beforeEach(() => {
    setupNextNavigationMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();

    vi.clearAllMocks();
  });

  test('useMainLinkActive - init', () => {
    for (const item of NAV_CONFIG.mainNav) {
      const { result } = renderHook(() =>
        useMainLinkActive({
          item,
        }),
      );

      expect(result.current).toMatchObject({
        href: item.href ? item.href : '#',
        Icon: item.icon,
        isActive: false,
      });
    }
  });

  test('useMainLinkActive - href', () => {
    for (const item of NAV_CONFIG.mainNav) {
      mockUsePathname.mockImplementation(() => item.href);

      const { result } = renderHook(() =>
        useMainLinkActive({
          item,
        }),
      );

      expect(result.current.href).toBe(item.href ?? '#');
    }
  });

  describe('useMainLinkActive - isActive', () => {
    test('useMainLinkActive navigation 렌더링 - isActive (href)', () => {
      for (const item of NAV_CONFIG.mainNav) {
        mockUsePathname.mockImplementation(() => item.href);

        const { result } = renderHook(() =>
          useMainLinkActive({
            item,
          }),
        );

        if (item.type === 'myPage') {
          expect(result.current.isActive).toBeFalsy();
        } else {
          expect(result.current.isActive).toBeTruthy();
        }
      }
    });

    test('useMainLinkActive navigation 렌더링 - isActive (relationHrefs)', () => {
      for (const item of NAV_CONFIG.mainNav) {
        const relationHrefs = item.relationHrefs ?? [];
        for (const relationHref of relationHrefs) {
          mockUsePathname.mockImplementation(() => relationHref);

          const { result } = renderHook(() =>
            useMainLinkActive({
              item,
            }),
          );

          expect(result.current.isActive).toBeTruthy();
        }
      }
    });
  });

  describe('useMainLinkActive - icon', () => {
    test('useMainLinkActive navigation 렌더링 - icon (icon)', () => {
      for (const item of NAV_CONFIG.mainNav) {
        mockUsePathname.mockImplementation(() => item.href);

        const { result } = renderHook(() =>
          useMainLinkActive({
            item,
          }),
        );

        expect(result.current.Icon).toMatchObject(item.icon);
      }
    });

    test('useMainLinkActive navigation 렌더링 - icon (relationIcons)', () => {
      for (const item of NAV_CONFIG.mainNav) {
        if (!item.relationIcons) {
          continue;
        }

        const relationHrefs = item.relationHrefs ?? [];
        for (const relationHref of relationHrefs) {
          mockUsePathname.mockImplementation(() => relationHref);

          const { result } = renderHook(() =>
            useMainLinkActive({
              item,
            }),
          );

          const icon = item.relationIcons[relationHref];

          if (!icon) {
            throw new Error('icon is not defined');
          }

          expect(result.current.Icon).toMatchObject(icon);
        }
      }
    });
  });
});

describe('useScrollNavLinkActive', () => {
  beforeEach(() => {
    setupNextNavigationMock();
  });

  afterEach(() => {
    vi.unstubAllGlobals();

    vi.clearAllMocks();
  });

  test('useScrollNavLinkActive - init', () => {
    for (const item of NAV_CONFIG.scrollNav) {
      const { result } = renderHook(() =>
        useScrollNavLinkActive({
          item,
        }),
      );

      expect(result.current).toMatchObject({
        isActive: false,
      });
    }
  });

  test('useScrollNavLinkActive - isActive', () => {
    for (const item of NAV_CONFIG.scrollNav) {
      mockUsePathname.mockImplementation(() => item.href);

      const { result } = renderHook(() =>
        useScrollNavLinkActive({
          item,
        }),
      );

      expect(result.current.isActive).toBeTruthy();
    }
  });
});
