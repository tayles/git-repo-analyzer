import { useState } from 'react';
import { Image } from 'lucide-react';

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
        <div className="bg-primary/10 h-full w-full flex items-center justify-center rounded">
        <Image className="h-5 w-5 text-muted-foreground" />
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
