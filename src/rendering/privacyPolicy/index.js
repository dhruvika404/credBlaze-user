'use client';
import React, { useEffect, useState } from 'react';
import styles from '../termsConditions/termsConditions.module.scss';
import { getPrivacyPolicy } from '@/services/legal';

export default function PrivacyPolicy() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getPrivacyPolicy()
            .then((res) => {
                if (res.success) {
                    setContent(res.data.content);
                }
            })
            .catch((err) => {
                console.error('Error fetching privacy policy:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div className={styles.termsConditions}>Loading...</div>;
    }

    return (
        <div className={styles.termsConditions}>
            <h1>Privacy Policy</h1>
            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
