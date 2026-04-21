import React from 'react'
import styles from './uploadDocumnentList.module.scss';
import UploadBox from '@/components/uploadBox';

export default function UploadDocumnentList({ onChange, disabled, kycStatus, kycData }) {

    return (
        <div className={styles.uploadDocumnentList}>
            <div className={styles.twocol}>
                <div className={styles.items}>
                    <h6>Upload ID Proof</h6>
                    <UploadBox
                        subtitle="Aadhaar, PAN, Passport, or Driver's License"
                        onFileSelect={(file) => onChange('id_proof', file)}
                        disabled={disabled}
                        existingImage={kycData?.id_proof}
                    />
                </div>
                <div className={styles.items}>
                    <h6>Upload Selfie Proof</h6>
                    <UploadBox
                        subtitle="Clear photo of your face"
                        onFileSelect={(file) => onChange('selfie_image', file)}
                        disabled={disabled}
                        existingImage={kycData?.selfie_image}
                    />
                </div>
                <div className={styles.items}>
                    <h6>Address Proof</h6>
                    <UploadBox
                        subtitle="Proof of address document should include"
                        onFileSelect={(file) => onChange('address_proof', file)}
                        disabled={disabled}
                        existingImage={kycData?.address_proof}
                    />
                </div>
            </div>
            {kycStatus?.toLowerCase() !== 'approved' && kycStatus?.toLowerCase() !== 'rejected' &&
                <div className={styles.yourDocument}>
                    <p>ℹ️ Your documents will be verified within 24-48 hours. KYC is required for withdrawals.</p>
                </div>
            }
        </div>
    )
}
