import React from 'react';
import { Icons } from '../icons';

export default function PageLoading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background opacity-75">
      <div className="flex items-center text-sm text-muted-foreground">
        <Icons.spinner className="mr-2 size-8 animate-spin" />
      </div>
    </div>
  );
}
