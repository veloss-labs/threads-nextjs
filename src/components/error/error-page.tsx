import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { cn } from '~/utils/utils';
import { Button } from '~/components/ui/button';

interface ErrorPageProps {
  className?: string;
  status: number;
  title?: React.ReactNode;
  description?: React.ReactNode;
  footer?: React.ReactNode;
  back?: () => void;
  home?: () => void;
}

export default function ErrorPage({
  className,
  status,
  title,
  description,
  footer,
  back,
  home,
}: ErrorPageProps) {
  const router = useRouter();

  const onBack = useCallback(() => {
    if (typeof back === 'function') {
      back();
      return;
    }

    router.back();
  }, [back, router]);

  const onHome = useCallback(() => {
    if (typeof home === 'function') {
      home();
      return;
    }

    router.back();
  }, [home, router]);

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className="m-auto flex size-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">{status}</h1>

        <span className="font-medium">{title}</span>
        <p className="text-center text-muted-foreground">{description}</p>
        <div className="mt-6 flex gap-4">
          {footer ? (
            <>{footer}</>
          ) : (
            <>
              <Button variant="outline" onClick={onBack}>
                뒤로가기
              </Button>
              <Button onClick={onHome}>돌아가기</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
