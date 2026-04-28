'use client';
import React, { useState } from 'react'
import styles from './kycVerified.module.scss';
import Button from '@/components/button';
import CloseIcon from '@/icons/closeIcon';
import { useRouter } from 'next/navigation';
const VerifiedIcon = '/assets/icons/Verified.svg';

export default function KycVerified({ kycDetails }) {
    const router = useRouter();
    const [previewImage, setPreviewImage] = useState(null);

    const handleImagePreview = (imageSrc) => {
        setPreviewImage(imageSrc);
    };

    const closePreview = () => {
        setPreviewImage(null);
    };

    const handleGoToDashboard = () => {
        router.push('/dashboard');
    };

    const documents = [
        {
            name: 'ID Proof',
            image: kycDetails?.id_proof
        },
        {
            name: 'Selfie Image',
            image: kycDetails?.selfie_image
        },
        {
            name: 'Address Proof',
            image: kycDetails?.address_proof
        }
    ];

    return (
        <>
            <div className={styles.kycVerified}>
                <div className={styles.contentCenter}>
                    <div className={styles.iconCenter}>
                        <img src={VerifiedIcon} alt="VerifiedIcon" />
                    </div>
                    <h2>
                        KYC Verified.
                    </h2>
                    <p>
                        Your identity has been verified successfully!
                        Here you can found what you have been add
                    </p>
                </div>
                <div className={styles.secContent}>
                    <div className={styles.grid}>
                        {documents.map((doc, index) => (
                            <div className={styles.items} key={index}>
                                <div className={styles.imageWrapper}>
                                    <div className={styles.image}>
                                        <img
                                            src={doc.image || '/assets/images/proof.png'}
                                            alt={doc.name}
                                        />
                                    </div>
                                    <div className={styles.details}>
                                        <p>{doc.name}</p>
                                        <div onClick={() => handleImagePreview(doc.image)} style={{ cursor: 'pointer' }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                <path d="M2.38323 9.60412C3.17148 10.9579 5.39298 14.1056 8.99673 14.1056C12.6065 14.1056 14.8242 10.9564 15.6117 9.60412C15.719 9.4203 15.7755 9.21125 15.7754 8.9984C15.7753 8.78555 15.7185 8.57656 15.611 8.39287C14.8235 7.03987 12.6035 3.89062 8.99673 3.89062C5.38998 3.89062 3.17073 7.03837 2.38323 8.39137C2.27552 8.57531 2.21875 8.7846 2.21875 8.99775C2.21875 9.2109 2.27552 9.42019 2.38323 9.60412Z" stroke="#020204" strokeWidth="1.125" strokeLinejoin="round" />
                                                <path d="M9 10.9688C9.52214 10.9687 10.0229 10.7613 10.3921 10.3921C10.7613 10.0229 10.9687 9.52214 10.9688 9C10.9687 8.47786 10.7613 7.9771 10.3921 7.60788C10.0229 7.23867 9.52214 7.03125 9 7.03125C8.47786 7.03125 7.9771 7.23867 7.60788 7.60788C7.23867 7.9771 7.03125 8.47786 7.03125 9C7.03125 9.52214 7.23867 10.0229 7.60788 10.3921C7.9771 10.7613 8.47786 10.9687 9 10.9688Z" stroke="#020204" strokeWidth="1.125" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={styles.buttonCenter}>
                        <Button text="Go to Dashboard" onClick={handleGoToDashboard} />
                    </div>
                </div>
            </div>

            {previewImage && (
                <div className={styles.imagePreviewModal} onClick={closePreview}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeButton} onClick={closePreview}>
                            <CloseIcon />
                        </button>
                        <div className={styles.imageContainer}>
                            <img src={previewImage} alt="Preview" />
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
