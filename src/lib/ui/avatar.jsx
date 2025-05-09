import React from "react";

const Avatar = ({ className, children, ...props }) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
    {...props}
  >
    {children}
  </div>
);

const AvatarImage = ({ className, src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full object-cover ${className}`}
    {...props}
  />
);

const AvatarFallback = ({ className, children, ...props }) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-gray-300 text-white ${className}`}
    {...props}
  >
    {children || "?"}
  </div>
);

export { Avatar, AvatarImage, AvatarFallback };
