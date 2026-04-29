'use client';
import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { uploadMobileImage } from '@/services/kyc';
import Button from '@/components/button';
import CameraIcon from '@/icons/cameraIcon';
import styles from './mobileCapture.module.scss';

export default function MobileCapture() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session');
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            setError('Camera access denied');
        }
    };

    const captureImage = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageData);
            stream?.getTracks().forEach(track => track.stop());
        }
    };

    const retake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const submitImage = async () => {
        if (!capturedImage || !sessionId) return;
        
        try {
            const response = await fetch(capturedImage);
            const blob = await response.blob();
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('session_id', sessionId);
            
            await uploadMobileImage(formData);
            alert('Image submitted successfully!');
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to submit image');
        }
    };

    return (
        <div className={styles.container}>
            <h1>Capture Selfie</h1>
            {error && <p className={styles.error}>{error}</p>}
            
            {!capturedImage ? (
                <div className={styles.cameraContainer}>
                    <video ref={videoRef} autoPlay playsInline className={styles.video} />
                    <button className={styles.cameraButton} onClick={captureImage}>
                        <CameraIcon />
                    </button>
                </div>
            ) : (
                <div className={styles.previewContainer}>
                    <img src={capturedImage} alt="Captured" className={styles.preview} />
                    <div className={styles.actions}>
                        <Button text="Retake" lightbutton onClick={retake} />
                        <Button text="Submit" onClick={submitImage} />
                    </div>
                </div>
            )}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
}
