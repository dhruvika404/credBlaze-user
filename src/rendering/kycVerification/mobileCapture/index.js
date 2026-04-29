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
    const urlToken = searchParams.get('token');
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [error, setError] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // Store token from URL to localStorage for API calls
        if (urlToken) {
            localStorage.setItem('token', urlToken);
        }
        
        startCamera();
        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [urlToken]);

    const startCamera = async () => {
        try {
            setCameraReady(false);
            setError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
                videoRef.current.onloadedmetadata = () => {
                    setCameraReady(true);
                };
            }
        } catch (err) {
            console.error('Camera error:', err);
            setCameraReady(false);
            if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setError('Camera not found. Please ensure your device has a camera.');
            } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setError('Camera access denied. Please allow camera permissions to continue.');
            } else {
                setError('Unable to access camera. Please check your device settings.');
            }
        }
    };

    const captureImage = () => {
        if (!cameraReady || !stream) {
            return;
        }
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageData);
            stream?.getTracks().forEach(track => track.stop());
            setCameraReady(false);
        }
    };

    const retake = () => {
        setCapturedImage(null);
        setError(null);
        startCamera();
    };

    const submitImage = async () => {
        if (!capturedImage || !sessionId) {
            setError('Please capture an image first.');
            return;
        }
        
        try {
            const response = await fetch(capturedImage);
            const blob = await response.blob();
            const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
            const formData = new FormData();
            formData.append('file', file);
            formData.append('session_id', sessionId);
            
            const result = await uploadMobileImage(formData);
            console.log("API Response:", result);
            
            if (result?.success && result?.data) {
                // Broadcast the image data to other tabs/windows
                if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
                    const channel = new BroadcastChannel(`kyc_upload_${sessionId}`);
                    channel.postMessage({
                        type: 'IMAGE_UPLOADED',
                        sessionId: sessionId,
                        data: result.data
                    });
                    channel.close();
                }
                setSubmitted(true);
            } else {
                throw new Error('Invalid API response');
            }
        } catch (err) {
            console.error('Upload error:', err);
            setError('Failed to submit image. Please try again.');
        }
    };

    return (
        <div className={styles.container}>
            {!submitted ? (
                <>
                    <h1>Capture Selfie</h1>
                    {error && <p className={styles.error}>{error}</p>}
                    
                    {!capturedImage ? (
                        <div className={styles.cameraContainer}>
                            <video ref={videoRef} autoPlay playsInline className={styles.video} />
                            <button 
                                className={styles.cameraButton} 
                                onClick={captureImage}
                                disabled={!cameraReady}
                                style={{ opacity: cameraReady ? 1 : 0.5 }}
                            >
                                <CameraIcon />
                            </button>
                        </div>
                    ) : (
                        <div className={styles.previewContainer}>
                            <img src={capturedImage} alt="Captured" className={styles.preview} />
                            <div className={styles.actions}>
                                <Button text="Retake" lightbutton onClick={retake} />
                                <Button text="Submit" onClick={submitImage} disabled={!capturedImage} />
                            </div>
                        </div>
                    )}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                </>
            ) : (
                <div className={styles.successContainer}>
                    <div className={styles.successIcon}>
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                            <circle cx="40" cy="40" r="40" fill="#10B981"/>
                            <path d="M25 40L35 50L55 30" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                    <h1 className={styles.successTitle}>Image Submitted Successfully!</h1>
                    <p className={styles.successText}>You can safely close this window and continue with your verification.</p>
                </div>
            )}
        </div>
    );
}
