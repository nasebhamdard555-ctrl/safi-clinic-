import React, { useState } from 'react';
import { Leaf } from 'lucide-react';

interface BotanicalImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const BotanicalImage: React.FC<BotanicalImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel,
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-[#EAE5DA] text-[#141815] p-4 text-center ${className}`}
        role="img"
        aria-label={alt}
      >
        <Leaf className="w-7 h-7 text-[#8C5A32] mb-1.5" />
        <span className="text-[11px] font-medium tracking-wide uppercase text-[#5A5248] line-clamp-2">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
