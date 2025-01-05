import React from 'react';
import { IconProps } from './types';

export const IconReload: React.FC<IconProps> = ({
  size = 24,
  color = 'currentColor',
  ...nativeProps
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...nativeProps}
    >
      <path
        d="M14.7508 2.59177C14.8428 2.94671 14.8954 3.30166 14.9348 3.66975C14.9742 4.02469 14.9874 4.37964 14.9874 4.74773C14.9874 5.10267 14.9742 5.45762 14.9348 5.82571C14.8954 6.18065 14.8428 6.5356 14.7376 6.89054C14.6062 7.31122 14.1592 7.56099 13.7385 7.44268C13.4624 7.3638 13.2653 7.14032 13.1864 6.89054C13.0812 6.5356 13.0286 6.18065 13.0023 5.81256C12.9629 5.45762 12.9629 5.10267 12.9629 4.73458C12.9629 4.37964 12.9892 4.02469 13.0155 3.6566C13.0549 3.30166 13.1075 2.94671 13.1995 2.59177C13.3178 2.17109 13.7517 1.90817 14.1855 2.02648C14.4747 2.09221 14.685 2.3157 14.7508 2.59177Z"
        fill={color}
      />
      <path
        d="M14.0024 7.61404C13.6474 7.70606 13.2925 7.75865 12.9375 7.79809C12.5826 7.83753 12.2276 7.85067 11.8595 7.85067C11.5046 7.85067 11.1497 7.85067 10.7816 7.81123C10.4266 7.7718 10.0717 7.71921 9.70358 7.62719C9.26976 7.50887 9.03313 7.06191 9.15145 6.62808C9.23032 6.35202 9.44066 6.15482 9.70358 6.07595C10.0585 5.97078 10.4135 5.91819 10.7684 5.87876C11.1234 5.83932 11.4783 5.82617 11.8464 5.82617C12.2013 5.82617 12.5563 5.83932 12.9244 5.87876C13.2793 5.91819 13.6343 5.95763 14.0024 6.0628C14.4362 6.16797 14.686 6.61494 14.5808 7.03561C14.4888 7.32483 14.2653 7.53517 14.0024 7.61404Z"
        fill={color}
      />
      <path
        d="M2 6.1154C3.06483 4.11719 5.18136 2.75 7.61339 2.75C9.9271 2.75 11.9647 3.98573 13.069 5.83933"
        stroke={color}
        strokeWidth="1.7"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.23663 14.5815C1.14461 14.2265 1.09202 13.8716 1.05258 13.5035C1.01315 13.1486 1 12.7936 1 12.4255C1 12.0706 1.01315 11.7156 1.05258 11.3475C1.09202 10.9926 1.14461 10.6377 1.24978 10.2827C1.38124 9.86203 1.8282 9.61226 2.24888 9.73057C2.52495 9.80945 2.72214 10.0329 2.80102 10.2827C2.90619 10.6377 2.95877 10.9926 2.98506 11.3607C3.0245 11.7156 3.0245 12.0706 3.0245 12.4387C3.0245 12.7936 2.99821 13.1486 2.97192 13.5166C2.93248 13.8716 2.87989 14.2265 2.78787 14.5815C2.66956 15.0022 2.23573 15.2651 1.80191 15.1468C1.52584 15.0679 1.31551 14.8444 1.23663 14.5815Z"
        fill={color}
      />
      <path
        d="M1.99835 9.5462C2.35329 9.45418 2.70824 9.40159 3.06318 9.36215C3.41812 9.32272 3.77307 9.30957 4.14116 9.30957C4.49611 9.30957 4.85105 9.30957 5.21914 9.34901C5.57409 9.38845 5.92903 9.44103 6.29712 9.53305C6.73094 9.65137 6.96757 10.0983 6.84926 10.5322C6.77038 10.8082 6.56004 11.0054 6.29712 11.0843C5.94218 11.1895 5.58723 11.242 5.23229 11.2815C4.8642 11.3209 4.50925 11.3341 4.14116 11.3341C3.78622 11.3341 3.43127 11.3209 3.06318 11.2815C2.70824 11.242 2.35329 11.2026 1.9852 11.0974C1.55138 10.9923 1.3016 10.5453 1.40677 10.1246C1.49879 9.83541 1.72228 9.62508 1.99835 9.5462Z"
        fill={color}
      />
      <path
        d="M13.9889 11.0449C12.9241 13.0431 10.8076 14.4103 8.37556 14.4103C6.06184 14.4103 4.02419 13.1746 2.91992 11.321"
        stroke={color}
        strokeWidth="1.7"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};