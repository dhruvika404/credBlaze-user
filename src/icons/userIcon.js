import React from 'react';

const UserIcon = ({ width = 24, height = 24, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle cx="12" cy="12" r="12" fill="#E5E7EB" />
      <path
        d="M12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"
        fill="#9CA3AF"
      />
      <path
        d="M6 18.5V18C6 15.7909 7.79086 14 10 14H14C16.2091 14 18 15.7909 18 18V18.5C18 19.3284 17.3284 20 16.5 20H7.5C6.67157 20 6 19.3284 6 18.5Z"
        fill="#9CA3AF"
      />
    </svg>
  );
};

export default UserIcon;
