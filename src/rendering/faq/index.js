'use client'
import React, { useState } from 'react';
import styles from './faq.module.scss';

const tabs = ['All', 'Ordering', 'Shipping', 'Returns', 'Support'];

const faqData = [
    {
        question: 'What payment methods do you accept?',
        answer: 'Ordering is easy! Simply browse our website, add items to your cart, and proceed to checkout. Follow the prompts to enter your details and complete your purchase.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept a variety of payment methods, including credit/debit cards, net banking, and select digital wallets. Choose the option that suits you best during checkout.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept a variety of payment methods, including credit/debit cards, net banking, and select digital wallets. Choose the option that suits you best during checkout.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'Ordering is easy! Simply browse our website, add items to your cart, and proceed to checkout. Follow the prompts to enter your details and complete your purchase.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept a variety of payment methods, including credit/debit cards, net banking, and select digital wallets. Choose the option that suits you best during checkout.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept a variety of payment methods, including credit/debit cards, net banking, and select digital wallets. Choose the option that suits you best during checkout.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept a variety of payment methods, including credit/debit cards, net banking, and select digital wallets. Choose the option that suits you best during checkout.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept a variety of payment methods, including credit/debit cards, net banking, and select digital wallets. Choose the option that suits you best during checkout.'
    }
];

export default function Faq() {
    const [activeTab, setActiveTab] = useState('Shipping');

    return (
        <div className={styles.faqSectionAlignment}>
            <div className={styles.header}>
                <h1>Have Questions? We Have Answers.</h1>
                <p>Ease into the world of StyleLoom with clarity. Our FAQs cover a spectrum of topics.</p>
            </div>

            <div className={styles.tabs}>
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        className={`${styles.tab} ${activeTab === tab ? styles.active : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div className={styles.faqGrid}>
                {faqData.map((item, index) => (
                    <div key={index} className={styles.faqItem}>
                        <h3>{item.question}</h3>
                        <p>{item.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
