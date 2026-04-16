import React from 'react'
import styles from './uploadDocumnentList.module.scss';
import UploadBox from '@/components/uploadBox';
const DocumnentImage = '/assets/images/document.png';
export default function UploadDocumnentList() {
    return (
        <div className={styles.uploadDocumnentList}>
            <div className={styles.twocol}>
                <div className={styles.items}>
                    <h6>Upload ID Proof</h6>
                    <UploadBox subtitle="Aadhaar, PAN, Passport, or Driver's License" />
                    <div className={styles.idnumber}>
                        <p>ID number manually</p>
                    </div>
                </div>
                <div className={styles.items}>
                    <h6>Upload Selfie Proof</h6>
                    <UploadBox subtitle="Clear photo of your face" />
                    <div className={styles.documentImage}>
                        <img src={DocumnentImage} alt='DocumnentImage' />
                        <img src={DocumnentImage} alt='DocumnentImage' />
                        <img src={DocumnentImage} alt='DocumnentImage' />
                    </div>
                </div>
                <div className={styles.items}>
                    <h6>Address Proof</h6>
                    <UploadBox subtitle="Proof of address document should include" />
                </div>
            </div>
            <div className={styles.yourDocument}>
                <p>ℹ️ Your documents will be verified within 24-48 hours. KYC is required for withdrawals.</p>
            </div>
        </div>
    )
}
