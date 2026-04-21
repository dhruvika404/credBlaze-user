'use client';
import React, { useState, useEffect } from 'react'
import styles from './kycVerification.module.scss';
import Kycpending from './kycpending';
import UploadDocumnentList from './uploadDocumnentList';
import Button from '@/components/button';
import { submitKyc, getKycDetails } from '@/services/kyc';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

export default function KycVerification() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const kycStatus = user && user?.kyc_status;
    const [kycData, setKycData] = useState(null);
    const [formData, setFormData] = useState({
        id_proof: null,
        selfie_image: null,
        address_proof: null
    });

    useEffect(() => {
        if (kycStatus && kycStatus.toLowerCase() !== 'pending') {
            fetchKycDetails();
        }
    }, [user]);

    const fetchKycDetails = async () => {
        try {
            const response = await getKycDetails();
            setKycData(response?.data);
        } catch (error) {
            console.error('Error fetching KYC details:', error);
        }
    };

    const handleFileChange = (name, file) => {
        setFormData(prev => ({ ...prev, [name]: file }));
    };

    const status = kycData?.status?.toLowerCase();
    const isDisabled = status === 'approved' || status === 'pending';

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const payload = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key]) payload.append(key, formData[key]);
            });

            await submitKyc(payload);
            toast.success('KYC submitted successfully!');
            await fetchKycDetails();
        } catch (error) {
            console.error('Error submitting KYC:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.outlinebox}>
            <div className={styles.spacingGrid}>
                <Kycpending status={kycStatus} />
                <UploadDocumnentList
                    onChange={handleFileChange}
                    kycStatus={kycStatus}
                    kycData={kycData}
                    disabled={isDisabled}
                />
            </div>
            <div className={styles.boxFooter}>
                <Button text="Cancel" disabled={isDisabled} lightbutton />
                <Button
                    text={loading ? "Submitting..." : "Submit KYC"}
                    onClick={handleSubmit}
                    disabled={isDisabled}
                />
            </div>
        </div>
    )
}
