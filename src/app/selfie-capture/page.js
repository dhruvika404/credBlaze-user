'use client';
import { useState, useRef } from 'react';
import styles from './selfie.module.scss';

export default function SelfieCapturePage() {
    const [captured, setCaptured] = useState(false);
    const [imageData, setImageData] = useState(null);
    const fileInputRef = useRef(null);

    const handleCapture = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageData(reader.result);
                setCaptured(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRetake = () => {
        setCaptured(false);
        setImageData(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = () => {
        // Store in localStorage to be retrieved by parent window
        if (imageData) {
            localStorage.setItem('selfie_capture', imageData);
            alert('Selfie captured! You can now close this window and return to the main page.');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Capture Selfie</h1>
                <p>Take a clear photo of your face</p>
            </div>

            <div className={styles.content}>
                {!captured ? (
                    <div className={styles.captureSection}>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            capture="user"
                            onChange={handleCapture}
                            style={{ display: 'none' }}
                        />
                        <div className={styles.placeholder}>
                            <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#9CA3AF" strokeWidth="2"/>
                                <circle cx="12" cy="10" r="3" stroke="#9CA3AF" strokeWidth="2"/>
                                <path d="M6 19C6 16.7909 8.68629 15 12 15C15.3137 15 18 16.7909 18 19" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                            <p>Position your face in the frame</p>
                        </div>
                        <button 
                            className={styles.captureButton}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                                <circle cx="12" cy="12" r="6" fill="white"/>
                            </svg>
                            Take Photo
                        </button>
                    </div>
                ) : (
                    <div className={styles.previewSection}>
                        <img src={imageData} alt="Captured selfie" className={styles.preview} />
                        <div className={styles.actions}>
                            <button className={styles.retakeButton} onClick={handleRetake}>
                                Retake
                            </button>
                            <button className={styles.uploadButton} onClick={handleUpload}>
                                Use This Photo
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
