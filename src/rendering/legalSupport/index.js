import React from 'react';
import Link from 'next/link';
import styles from './legalSupport.module.scss';

const legalItems = [
    { title: 'Terms & Conditions', path: '/settings/terms-conditions' },
    { title: 'Privacy Policy', path: '/settings/privacy-policy' },
    { title: 'FAQ', path: '/settings/faq' },
];

const ChevronRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <g clipPath="url(#clip0_5087_8735)">
            <path d="M4.16602 10H15.8327" stroke="#171717" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.834 15L15.834 10" stroke="#171717" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M10.834 5L15.834 10" stroke="#171717" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
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
                <Link key={index} href={item.path} className={styles.legalCard}>
                    <span className={styles.title}>{item.title}</span>
                    <div className={styles.iconWrapper}>
                        <ChevronRight />
                    </div>
                </Link>
            ))}
        </div>
    );
}
