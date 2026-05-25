import React from 'react'

export default function SortingIcon({ active, direction }) {
    const isUpActive = active && direction === 'asc';
    const isDownActive = active && direction === 'desc';

    const upColor = isUpActive ? '#0040C1' : '#6B7280';
    const downColor = isDownActive ? '#0040C1' : '#6B7280';

    return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_2652_33001)">
                <path d="M4.66699 2V14" stroke={upColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M6.66699 4L4.66699 2L2.66699 4" stroke={upColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M13.333 12L11.333 14L9.33301 12" stroke={downColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M11.333 14V2" stroke={downColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_2652_33001">
                    <rect width="16" height="16" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

