import { Image } from 'lucide-react';
import { useState } from 'react';

interface ToolLogoProps {
  logo: string | null;
}

export function ToolLogo({ logo }: ToolLogoProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!logo?.startsWith('http')) {
    // assume simpleicons
    logo = `https://cdn.simpleicons.org/${logo}`;
  }

  return (
    <div className="h-8 w-8 shrink-0 text-sm font-bold">
      {!imageLoaded && (
        <div className="bg-primary/10 flex h-full w-full items-center justify-center rounded">
          <Image className="text-muted-foreground h-5 w-5" />
        </div>
      )}
      <img
        src={logo}
        alt="Tool logo"
        className="h-full w-full"
        style={imageLoaded ? { objectFit: 'contain' } : { visibility: 'hidden' }}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
      />
    </div>
  );
}
