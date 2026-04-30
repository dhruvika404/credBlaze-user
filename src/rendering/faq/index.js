'use client';
import React, { useState, useEffect } from 'react';
import styles from './faq.module.scss';
import { getFaqs } from '@/services/legal';

export default function Faq() {
    const [faqData, setFaqData] = useState([]);
    const [tabs, setTabs] = useState(['All']);
    const [activeTab, setActiveTab] = useState('All');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getFaqs()
            .then((res) => {
                if (res.success) {
                    setFaqData(res?.data?.items);
                    const categories = ['All', ...new Set(res?.data?.items.map((item) => item.category))];
                    setTabs(categories);
                }
            })
            .catch((err) => {
                console.error('Error fetching FAQs:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredFaqs = activeTab === 'All'
        ? faqData
        : faqData.filter((item) => item.category === activeTab);

    if (loading) {
        return <div className={styles.faqSectionAlignment}>Loading...</div>;
    }

    return (
        <div className={styles.faqSectionAlignment}>
            <div className={styles.header}>
                <h1>Have Questions? We Have Answers.</h1>
                <p>Ease into the world of CredBlaze with clarity. Our FAQs cover a spectrum of topics.</p>
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
                {filteredFaqs.map((item, index) => (
                    <div key={index} className={styles.faqItem}>
                        <h3>{item.question}</h3>
                        <div
                            dangerouslySetInnerHTML={{ __html: item.answer }}
                        />
                    </div>
                ))}
                {filteredFaqs.length === 0 && <p>No FAQs found for this category.</p>}
            </div>
        </div>
    );
}
