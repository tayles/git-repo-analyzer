import { Image } from 'lucide-react';
import { useState } from 'react';

import { cn } from '../lib/utils';

interface IconWithFallbackProps {
  url: string | null;
  alt?: string;
  className?: string;
}

export function IconWithFallback({ url, alt, className }: IconWithFallbackProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className={cn('size-8 shrink-0 text-sm font-bold', className)}>
      {!imageLoaded && (
        <div className="bg-primary/10 flex h-full w-full items-center justify-center rounded">
          <Image className="text-muted-foreground h-[80%] w-[80%]" />
        </div>
      )}
      <img
        src={url ?? undefined}
        alt={alt}
        className="h-full w-full"
        style={imageLoaded ? { objectFit: 'contain' } : { visibility: 'hidden' }}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
