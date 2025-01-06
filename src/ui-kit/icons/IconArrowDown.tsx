import React from 'react';
import { IconProps } from './types';

export const IconArrowDown: React.FC<IconProps> = ({
  size = 16,
  color = 'currentColor',
  ...nativeProps
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...nativeProps}
    className={`rotate-180 ${nativeProps.className || ''}`}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.54105 5.09686C10.1015 4.59372 10.6887 4.12134 11.3003 3.6818C11.4453 3.58807 11.6116 3.5347 11.7824 3.52583C11.8001 3.52168 11.818 3.51801 11.836 3.51485C11.9641 3.49231 12.0954 3.49546 12.2223 3.52411C12.3492 3.55276 12.4691 3.60633 12.5751 3.68173C13.1998 4.06418 13.7352 4.52312 14.2961 5.03305L14.2961 5.03306C14.857 5.54299 15.418 6.05292 15.9406 6.58834C16.0283 6.67816 16.1164 6.76798 16.2045 6.85793L16.2045 6.85793C16.6419 7.30413 17.0822 7.7533 17.4959 8.22012C17.9931 8.78104 18.4903 9.34197 18.9492 9.95389C19.0455 10.136 19.0828 10.3435 19.056 10.5478C19.0292 10.752 18.9396 10.9429 18.7997 11.094C18.6597 11.2452 18.4763 11.3491 18.2747 11.3915C18.0731 11.4339 17.8634 11.4127 17.6744 11.3307C17.0115 10.8973 16.3741 10.4256 15.8004 9.92839C15.2267 9.43121 14.6786 8.90853 14.1431 8.38585C13.8113 8.06194 13.4844 7.72825 13.1624 7.39083C13.1931 7.80637 13.2126 8.22127 13.2126 8.64067C13.2126 9.04908 13.2211 9.45608 13.2296 9.86261C13.2466 10.6742 13.2635 11.484 13.2126 12.2994C13.1701 12.9794 13.1669 13.6554 13.1638 14.3318C13.1613 14.8729 13.1588 15.4143 13.1361 15.9582C13.0851 17.182 13.0341 18.3421 12.9194 19.6169C12.8964 19.8446 12.7947 20.0571 12.6318 20.2177C12.4688 20.3783 12.2549 20.4769 12.027 20.4966C11.7691 20.5181 11.513 20.4383 11.3131 20.274C11.1131 20.1098 10.9851 19.8741 10.9561 19.6169C10.8833 18.8396 10.8464 18.057 10.8096 17.2759C10.7884 16.8273 10.7673 16.3791 10.7394 15.9327C10.6629 14.7088 10.5992 13.4978 10.6629 12.2739C10.6967 11.6261 10.6983 10.9783 10.6998 10.3324C10.7013 9.75802 10.7027 9.18518 10.7267 8.61517C10.7461 8.15296 10.7656 7.69633 10.7893 7.23746C10.4253 7.62919 10.0501 8.00432 9.66854 8.38592C9.13311 8.92135 8.58493 9.43128 8.02401 9.92846C7.4424 10.4288 6.83382 10.897 6.201 11.3308C6.03722 11.4352 5.84704 11.4906 5.65282 11.4906C5.45861 11.4906 5.26843 11.4352 5.10465 11.3308C4.90724 11.1787 4.77411 10.9581 4.73161 10.7126C4.68912 10.467 4.74035 10.2145 4.87518 10.005C5.32137 9.39303 5.8058 8.80661 6.31574 8.25844C6.37767 8.19186 6.43961 8.12509 6.50161 8.05825C6.9501 7.57476 7.40218 7.0874 7.88377 6.6394C8.06747 6.46852 8.24973 6.29478 8.43248 6.12058C8.79509 5.77492 9.15962 5.42744 9.54105 5.09686Z"
      fill={color}
    />
  </svg>
);
