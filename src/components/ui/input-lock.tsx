import * as React from 'react';

import { cn } from '~/utils/utils';
import { Icons } from '~/components/icons';

export interface InputLockProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const InputLock = React.forwardRef<HTMLInputElement, InputLockProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <div className="relative rounded-md">
        <Icons.lock className="absolute left-2 top-1/2 size-4 -translate-y-1/2" />
        <input
          type={type}
          className={cn(
            'flex h-10 w-full rounded-md border border-slate-200 bg-white px-8 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-slate-300',
            className,
          )}
          ref={ref}
          {...props}
        />
      </div>
    );
  },
);
InputLock.displayName = 'InputLock';

export { InputLock };
