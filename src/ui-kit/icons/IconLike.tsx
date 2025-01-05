import React from 'react';
import { IconProps } from './types';

export const IconLike: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  ...nativeProps
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...nativeProps}
    >
      <path
        d="M7.48047 18.35L10.5805 20.75C10.9805 21.15 11.8805 21.35 12.4805 21.35L16.2805 21.35C17.4805 21.35 18.7805 20.45 19.0805 19.25L21.4805 11.95C21.9805 10.55 21.0805 9.34997 19.5805 9.34997L15.5805 9.34997C14.9805 9.34997 14.4805 8.84997 14.5805 8.14997L15.0805 4.94997C15.2805 4.04997 14.6805 3.04997 13.7805 2.74997C12.9805 2.44997 11.9805 2.84997 11.5805 3.44997L7.48047 9.54997"
        stroke={color}
        strokeWidth="1.8"
        strokeMiterlimit="10"
      />
      <path
        d="M2.37988 18.3499L2.37988 8.5499C2.37988 7.1499 2.97988 6.6499 4.37988 6.6499L5.37988 6.6499C6.77988 6.6499 7.37988 7.1499 7.37988 8.5499L7.37988 18.3499C7.37988 19.7499 6.77988 20.2499 5.37988 20.2499L4.37988 20.2499C2.97988 20.2499 2.37988 19.7499 2.37988 18.3499Z"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};