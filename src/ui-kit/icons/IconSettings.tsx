import React from 'react';
import { IconProps } from './types';

export const IconSettings: React.FC<IconProps> = ({
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
        fill={color}
        d="M11.585 21.995a4.869 4.869 0 0 1-1.927-.3 2.646 2.646 0 0 1-1.39-1.869 2.491 2.491 0 0 1-.804.19 3.526 3.526 0 0 1-2.78-1.239 4.755 4.755 0 0 1-1.152-1.579 2.584 2.584 0 0 1 .16-1.998h-.11c-1.39-.55-1.569-1.999-1.569-3.238a3.578 3.578 0 0 1 1.122-2.918c.252-.215.541-.381.854-.49a2.264 2.264 0 0 1-.14-.26c-.615-1.418.279-2.587 1.143-3.446 1.201-1.21 2.264-1.59 3.376-1.13.575-1.469 1.906-1.708 3.217-1.708a3.504 3.504 0 0 1 2.82 1.099c.175.2.319.426.426.67.45-.3.98-.453 1.52-.44.926.12 1.773.587 2.373 1.309 1.35 1.369 1.658 2.568.913 3.857C21.255 8.825 22 9.934 22 11.932c0 1.829-.606 2.908-1.936 3.328.715 1.269.397 2.458-.924 3.797-1.32 1.339-2.74 1.689-4.13.72-.397 1.518-1.48 2.218-3.425 2.218Zm-2.493-5.067c.14.002.278.029.407.08a.995.995 0 0 1 .586 1c-.07.799.13 1.758.378 1.868.36.104.736.147 1.112.13 1.33 0 1.539-.2 1.539-1.549a3.434 3.434 0 0 0-.1-.91 1.005 1.005 0 0 1 .603-1.198.986.986 0 0 1 1.244.49c.177.298.398.567.655.799.944.95 1.222.95 2.175 0 .953-.95.933-1.21 0-2.169a2.653 2.653 0 0 0-.258-.23 1.001 1.001 0 0 1-.278-1.139.998.998 0 0 1 .993-.639h.347c1.33 0 1.53-.21 1.53-1.549s-.19-1.529-1.53-1.529c-.286 0-.572.023-.854.07a.988.988 0 0 1-1.151-.52 1.005 1.005 0 0 1 .327-1.218c.186-.13.359-.277.516-.44.993-1 .934-1.22 0-2.168-.466-.48-.824-.72-.992-.73-.17-.01-.447.08-1.093.73-.129.12-.228.24-.327.35a.992.992 0 0 1-1.593-.115 1.004 1.004 0 0 1-.155-.605.778.778 0 0 1 0-.14 1.52 1.52 0 0 0-.218-1.17 1.785 1.785 0 0 0-1.32-.409c-1.38-.01-1.55.14-1.55 1.41a1.004 1.004 0 0 1-.61.917.987.987 0 0 1-1.078-.208c-.774-.75-.993-.89-1.985.12-.993 1.009-.795 1.139-.745 1.249.3.418.631.813.993 1.179a1.001 1.001 0 0 1 .228 1.129.997.997 0 0 1-.993.6h-.178a1.55 1.55 0 0 0-1.34.18c-.296.379-.432.86-.378 1.338 0 1.26.238 1.35.357 1.4.348.117.716.164 1.083.139a.989.989 0 0 1 .913.64 1.005 1.005 0 0 1-.238 1.089c-.437.44-.785 1.109-.715 1.289.187.326.421.622.695.88.31.37.752.606 1.231.659a1.455 1.455 0 0 0 .993-.68l.1-.12a.99.99 0 0 1 .674-.3Z"
      />
      <path
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M10.46 14.32c-.72-.28-1-1-1-2.33 0-2 .72-2.53 2.53-2.53 1.81 0 2.55.48 2.55 2.53s-.72 2.55-2.55 2.55a3.811 3.811 0 0 1-1.53-.22v0Z"
      />
    </svg>
  );
};