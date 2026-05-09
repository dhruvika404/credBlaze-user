'use client';
import React, { useEffect, useState } from 'react';
import styles from './termsConditions.module.scss';
import { getTermsConditions } from '@/services/legal';

export default function TermsConditions() {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTermsConditions()
            .then((res) => {
                if (res.success) {
                    setContent(res.data.content.replace(/&nbsp;/g, ' '));
                }
            })
            .catch((err) => {
                console.error('Error fetching terms:', err);
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
            <h1>Terms and Conditions</h1>
            <div
                className={styles.content}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}

