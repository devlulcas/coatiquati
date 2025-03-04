'use client';

import { Button } from '@/shared/components/ui/button';
import { Input, type InputProps } from '@/shared/components/ui/input';
import { cn } from '@/shared/utils/cn';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { forwardRef, useState } from 'react';

const EyeOff = motion(EyeOffIcon);
const EyeOn = motion(EyeIcon);

const PasswordInput = forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input
        id="password"
        type={showPassword ? 'text' : 'password'}
        placeholder="********"
        className={cn('pr-10', className)}
        ref={ref}
        {...props}
      />
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-1 right-1 flex h-7 w-7 items-center justify-center"
        onClick={() => setShowPassword(!showPassword)}
      >
        <EyeOff
          className="absolute size-4"
          animate={{ y: showPassword ? -10 : 0, opacity: showPassword ? 0 : 1 }}
          transition={{ type: 'spring', bounce: 0.25 }}
        />

        <EyeOn
          className="absolute size-4"
          animate={{ y: showPassword ? 0 : 10, opacity: showPassword ? 1 : 0 }}
          transition={{ type: 'spring', bounce: 0.25 }}
        />
        <span className="sr-only">Toggle password visibility</span>
      </Button>
    </div>
  );
});
PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
