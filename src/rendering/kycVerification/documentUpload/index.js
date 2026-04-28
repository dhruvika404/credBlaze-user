'use client';
import React, { useState } from 'react'
import styles from './documentUpload.module.scss';
import UploadBox from '@/components/uploadBox';
import CloseDanger from '@/icons/closeDanger';
import Button from '@/components/button';
const IdIcon = '/assets/icons/id.svg';
const PassportIcon = '/assets/icons/Passport.svg';
const DrivingIcon = '/assets/icons/Driving.svg';

export default function DocumentUpload({ onContinue, onCancel }) {
    const [activeTab, setActiveTab] = useState('id');
    const [uploadedFile, setUploadedFile] = useState(null);
console.log(uploadedFile)
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setUploadedFile(null); // Clear uploaded file when tab changes
    };

    const handleFileUpload = (file) => {
        if (file && !uploadedFile) {
            setUploadedFile({
                file: file,
                name: file.name,
                size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
            });
        }
    };

    const handleRemoveFile = () => {
        setUploadedFile(null);
    };

    const handleContinue = () => {
        if (uploadedFile) {
            onContinue({ id_proof: uploadedFile.file, documentType: activeTab });
        }
    };

    return (
        <div className={styles.documentUpload}>
            <div className={styles.documentHeader}>
                <div className={styles.counter}>1</div>
                <div>
                    <h2>
                        Document Upload
                    </h2>
                    <p>
                        To verify your identity, please upload any of your document
                    </p>
                </div>
            </div>

            <div className={styles.documentContent}>
                <div className={styles.contentAlignment}>
                    <div className={styles.tabgrid}>
                        <button
                            className={activeTab === 'id' ? styles.active : ''}
                            onClick={() => handleTabChange('id')}
                            disabled={uploadedFile !== null}
                        >
                            <img src={IdIcon} alt='IdIcon' />
                            ID
                        </button>
                        <button
                            className={activeTab === 'passport' ? styles.active : ''}
                            onClick={() => handleTabChange('passport')}
                            disabled={uploadedFile !== null}
                        >
                            <img src={PassportIcon} alt='PassportIcon' />
                            Passport
                        </button>
                        <button
                            className={activeTab === 'driving' ? styles.active : ''}
                            onClick={() => handleTabChange('driving')}
                            disabled={uploadedFile !== null}
                        >
                            <img src={DrivingIcon} alt='DrivingIcon' />
                            Driving License
                        </button>
                    </div>
                    <UploadBox 
                        onFileSelect={handleFileUpload}
                        disabled={uploadedFile !== null}
                        showPreview={false}
                    />
                    {uploadedFile && (
                        <div className={styles.uploadList}>
                            <div className={styles.proof}>
                                <div className={styles.image}>
                                    <img 
                                        src={URL.createObjectURL(uploadedFile.file)} 
                                        alt="Uploaded document"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                </div>
                                <div className={styles.content}>
                                    <div>
                                        <h3>{uploadedFile.name}</h3>
                                        <p>{uploadedFile.size}</p>
                                    </div>
                                    <div className={styles.close} onClick={handleRemoveFile}>
                                        <CloseDanger />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={styles.buttonGrid}>
                        <Button text="Cancel" lightbutton onClick={onCancel} />
                        <Button
                            text="Continue"
                            onClick={handleContinue}
                            disabled={!uploadedFile}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
