/* eslint-disable @next/next/no-img-element -- the image pipeline is added by the frontend-substrate pass */

interface SiteImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function SiteImage({ src, alt, className, priority }: SiteImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
