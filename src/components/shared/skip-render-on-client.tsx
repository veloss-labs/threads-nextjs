import * as React from 'react';

const useIsFirstRender = (): boolean => {
  const isFirst = React.useRef(true);

  if (isFirst.current) {
    isFirst.current = false;

    return true;
  } else {
    return false;
  }
};

/**
 * `SkipRenderOnClient` is a SSR performance hack that allows you to
 * conditionally render components on the client-side, bypassing hydration,
 * without introducing hydration mismatches.
 *
 * ```tsx
 * <SkipRenderOnClient shouldRenderOnClient={() => window.innerWidth <= 500}>
 *   <MyComponent />
 * </SkipRenderOnClient>
 * ```
 *
 * Context:
 *
 * When using React's server-side rendering, we often need to render components
 * on the server even if they are conditional on the client e.g. hidden based on
 * window width.
 *
 * However, in order for hydration to succeed, the first client render must
 * match the DOM generated from the HTML returned by the server. This means the
 * component must be rendered again during the first client render.
 *
 * Hydration is expensive, so we really don't want to pay that penalty only for
 * the element to be hidden or removed immediately afterwards.
 *
 * `SkipRenderOnClient` conditionally skips hydrating children by removing them
 * from the DOM _before the first client render_. Removing them before ensures
 * hydration is successful.
 */
interface SkipRenderOnClientProps {
  children: React.ReactNode;
  shouldRenderOnClient: () => boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function SkipRenderOnClient({
  children,
  shouldRenderOnClient,
  className,
  style,
}: SkipRenderOnClientProps) {
  const id = React.useId();
  const isClient = typeof window !== 'undefined';
  const isFirstRender = useIsFirstRender();

  if (isClient && isFirstRender && shouldRenderOnClient() === false) {
    const el = document.getElementById(id);
    if (el !== null) {
      el.innerHTML = '';
    }
  }

  const shouldRender = isClient ? shouldRenderOnClient() : true;

  return (
    <div id={id} className={className} style={style}>
      {shouldRender && children}
    </div>
  );
}
