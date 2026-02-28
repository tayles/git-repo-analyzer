import { Image } from 'lucide-react';
import { useState } from 'react';

import { cn } from '../lib/utils';

interface IconWithFallbackProps {
  url: string | null;
  alt?: string;
  className?: string;
  hideOnError?: boolean;
}

export function IconWithFallback({
  url,
  alt,
  className,
  hideOnError = false,
}: IconWithFallbackProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (hideOnError && (imageError || !url)) {
    return null;
  }

  return (
    <div className={cn('size-8 shrink-0 text-sm font-bold', className)}>
      {!imageLoaded && (
        <div className="flex h-full w-full items-center justify-center rounded">
          <Image className="text-muted-foreground/30 h-[80%] w-[80%]" />
        </div>
      )}
      {url && (
        <img
          src={url}
          alt={alt}
          className="h-full w-full"
          style={imageLoaded ? { objectFit: 'contain' } : { visibility: 'hidden' }}
          loading="lazy"
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
        />
      )}
    </div>
  );
}
