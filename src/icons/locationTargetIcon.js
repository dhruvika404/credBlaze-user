import React from 'react';

export default function LocationTargetIcon() {
  return (
    <svg width="96" height="96" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="44" fill="#4F46E5" fillOpacity="0.04" />
      <circle cx="50" cy="50" r="34" fill="#4F46E5" fillOpacity="0.10" />
      <circle cx="50" cy="50" r="26" fill="#4F46E5" fillOpacity="0.18" />
      <circle cx="50" cy="50" r="21" fill="url(#vibrantBlueGrad)" filter="url(#iconGlow)" />
      <g transform="translate(40, 40)">
        <path
          d="M7.5 9.16663C7.5 9.82967 7.76339 10.4656 8.23223 10.9344C8.70107 11.4032 9.33696 11.6666 10 11.6666C10.663 11.6666 11.2989 11.4032 11.7678 10.9344C12.2366 10.4656 12.5 9.82967 12.5 9.16663C12.5 8.50358 12.2366 7.8677 11.7678 7.39886C11.2989 6.93002 10.663 6.66663 10 6.66663C9.33696 6.66663 8.70107 6.93002 8.23223 7.39886C7.76339 7.8677 7.5 8.50358 7.5 9.16663Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.7142 13.8806L11.1783 17.4164C10.8658 17.7286 10.4422 17.904 10.0004 17.904C9.55869 17.904 9.13503 17.7286 8.82251 17.4164L5.28585 13.8806C4.35353 12.9482 3.71863 11.7603 3.46142 10.4671C3.20421 9.17394 3.33625 7.83352 3.84085 6.61536C4.34544 5.39721 5.19993 4.35604 6.29625 3.62351C7.39257 2.89098 8.68149 2.5 10 2.5C11.3185 2.5 12.6075 2.89098 13.7038 3.62351C14.8001 4.35604 15.6546 5.39721 16.1592 6.61536C16.6638 7.83352 16.7958 9.17394 16.5386 10.4671C16.2814 11.7603 15.6465 12.9482 14.7142 13.8806Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <defs>
        <linearGradient id="vibrantBlueGrad" x1="35" y1="35" x2="65" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E40AF" />
          <stop offset="40%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <filter id="iconGlow" x="25" y="25" width="50" height="50" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1E40AF" floodOpacity="0.3" />
        </filter>
      </defs>
    </svg>
  );
}
