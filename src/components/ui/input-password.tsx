import * as React from 'react';

import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Icons } from '~/components/icons';

export type InputPasswordProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'type'
>;

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  ({ className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    return (
      <div className="relative rounded-md">
        <Input
          type={showPassword ? 'text' : 'password'}
          className={className}
          ref={ref}
          {...props}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="absolute right-1 top-1/2 size-6 -translate-y-1/2 rounded-md text-muted-foreground"
          onClick={() => {
            setShowPassword((prev) => !prev);
          }}
        >
          {showPassword ? <Icons.eye /> : <Icons.eyeOff />}
        </Button>
      </div>
    );
  },
);

InputPassword.displayName = 'InputPassword';

export { InputPassword };
