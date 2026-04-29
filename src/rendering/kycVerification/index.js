'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DocumentUpload from './documentUpload';
import KycAddress from './kycAddress';
import KycComplete from './kycComplete';
import KycPending from './kycpending';
import styles from './kycVerification.module.scss';
import KycVerified from './kycVerified';
import TakeSelfie from './takeSelfie';
import VerificationProgress from './verificationProgress';
import VerificationReject from './verificationReject';
import { getKycDetails, submitKyc } from '@/services/kyc';

export default function KycVerification() {
    const [currentStep, setCurrentStep] = useState('selfie');
    const [loading, setLoading] = useState(true);
    const [kycDetails, setKycDetails] = useState(null);
    const [kycData, setKycData] = useState({
        id_proof: null,
        selfie_image: null,
        address_proof: null,
        address: '',
        city: '',
        state: '',
        pincode: '',
        country: ''
    });

    useEffect(() => {
        fetchKycDetails();
    }, []);

    const fetchKycDetails = async () => {
        try {
            const response = await getKycDetails();
            const status = response?.data?.status?.toLowerCase();

            // Store the complete KYC details
            if (response?.data) {
                setKycDetails(response.data);
            }

            // if (status === 'approved') {
            //     setCurrentStep('approved');
            // } else if (status === 'pending') {
            //     setCurrentStep('progress');
            // } else if (status === 'rejected') {
            //     setCurrentStep('rejected');
            // } else {
            //     setCurrentStep('pending');
            // }
        } catch (error) {
            console.error('Error fetching KYC details:', error);
            setCurrentStep('pending');
        } finally {
            setLoading(false);
        }
    };

    const handleStartKYC = () => {
        setCurrentStep('document');
    };

    const handleDocumentContinue = (documentData) => {
        setKycData(prev => ({ ...prev, ...documentData }));
        setCurrentStep('selfie');
    };

    const handleSelfieContinue = (selfieData) => {
        setKycData(prev => ({ ...prev, ...selfieData }));
        setCurrentStep('address');
    };

    const handleAddressContinue = async (addressData) => {
        try {
            const finalData = { ...kycData, ...addressData };

            const response = await submitKyc(finalData);

            if (response?.success || response?.status) {
                toast.success('KYC submitted successfully! Verification in progress.');
                setCurrentStep('progress');
            } else {
                toast.error('KYC submission failed. Please try again.');
                setCurrentStep('address');
            }
        } catch (error) {
            console.error('Error submitting KYC:', error);
            toast.error(error?.message || 'Failed to submit KYC. Please try again.');
            setCurrentStep('address');
        }
    };

    const handleCancel = () => {
        setCurrentStep('pending');
        setKycData({
            id_proof: null,
            selfie_image: null,
            address_proof: null,
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        });
    };

    const handleReupload = () => {
        setCurrentStep('document');
        setKycData({
            id_proof: null,
            selfie_image: null,
            address_proof: null,
            address: '',
            city: '',
            state: '',
            pincode: '',
            country: ''
        });
    };

    const handleRejectCancel = () => {
        setCurrentStep('rejected');
    };

    if (loading) {
        return (
            <div className={styles.outlinebox}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className={styles.outlinebox}>
            {currentStep === 'pending' && (
                <>
                    <KycPending />
                    <KycComplete onStart={handleStartKYC} />
                </>
            )}
            {currentStep === 'document' && (
                <DocumentUpload
                    onContinue={handleDocumentContinue}
                    onCancel={handleCancel}
                />
            )}
            {currentStep === 'selfie' && (
                <TakeSelfie
                    onContinue={handleSelfieContinue}
                    onCancel={handleCancel}
                />
            )}
            {currentStep === 'address' && (
                <KycAddress
                    onContinue={handleAddressContinue}
                    onCancel={handleCancel}
                />
            )}
            {currentStep === 'progress' && <VerificationProgress />}
            {currentStep === 'approved' && <KycVerified kycDetails={kycDetails} />}
            {currentStep === 'rejected' && (
                <VerificationReject
                    rejectionReason={kycDetails?.rejection_reason}
                    onReupload={handleReupload}
                    onCancel={handleRejectCancel}
                />
            )}
        </div>
    )
}
