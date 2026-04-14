import React from 'react';
import styles from './legalSupport.module.scss';

const legalItems = [
    { title: 'Terms & Conditions', path: '/terms' },
    { title: 'Privacy Policy', path: '/privacy' },
    { title: 'Contact Us', path: '/contact' },
    { title: 'FAQ', path: '/faq' },
];

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clip-path="url(#clip0_5087_8735)">
            <path d="M4.16602 10H15.8327" stroke="#171717" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.834 15L15.834 10" stroke="#171717" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M10.834 5L15.834 10" stroke="#171717" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" />
        </g>
        <defs>
            <clipPath id="clip0_5087_8735">
                <rect width="20" height="20" fill="white" />
            </clipPath>
        </defs>
    </svg>
);

export default function LegalSupport() {
    return (
        <div className={styles.legalSupport}>
            {legalItems.map((item, index) => (
                <div key={index} className={styles.legalCard}>
                    <span className={styles.title}>{item.title}</span>
                    <div className={styles.iconWrapper}>
                        <ChevronRight />
                    </div>
                </div>
            ))}
        </div>
    );
}
