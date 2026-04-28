'use client';
import React, { useState, useRef, useEffect } from 'react'
import styles from './takeSelfie.module.scss';
import Button from '@/components/button';
import CameraIcon from '@/icons/cameraIcon';
import toast from 'react-hot-toast';
const WebCamIcon = '/assets/icons/web-cam.svg';
const UseIcon = '/assets/icons/use.svg';
const ScanImage = '/assets/images/scan.svg';

export default function TakeSelfie({ onContinue, onCancel }) {
    const [selfieCaptured, setSelfieCaptured] = useState(false);
    const [selfieMode, setSelfieMode] = useState('webcam');
    const [selfieFile, setSelfieFile] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [stream, setStream] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const [qrCodeUrl, setQrCodeUrl] = useState(null);
    const [hasCameraDevice, setHasCameraDevice] = useState(false);
    const [sessionId, setSessionId] = useState(null);
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        // Generate unique session ID
        const sid = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionId(sid);

        // Listen for selfie from public link
        const handleMessage = (event) => {
            if (event.origin !== window.location.origin) return;
            
            if (event.data.type === 'SELFIE_CAPTURED' && event.data.sessionId === sid) {
                handleSelfieReceived(event.data.imageData);
            }
        };

        window.addEventListener('message', handleMessage);

        // Check localStorage periodically for selfie
        const checkInterval = setInterval(() => {
            const storedSelfie = localStorage.getItem(`selfie_${sid}`);
            if (storedSelfie) {
                handleSelfieReceived(storedSelfie);
                localStorage.removeItem(`selfie_${sid}`);
                clearInterval(checkInterval);
            }
        }, 1000);

        return () => {
            window.removeEventListener('message', handleMessage);
            clearInterval(checkInterval);
            stopWebcam();
        };
    }, []);

    useEffect(() => {
        if (selfieMode === 'webcam') {
            checkAndStartWebcam();
        } else {
            stopWebcam();
            generateQRCode();
        }

        return () => {
            stopWebcam();
        };
    }, [selfieMode]);

    const checkAndStartWebcam = async () => {
        try {
            setCameraError(null);
            // First check if camera devices exist
            const devices = await navigator.mediaDevices.enumerateDevices();
            const videoDevices = devices.filter(device => device.kind === 'videoinput');
            
            if (videoDevices.length === 0) {
                setHasCameraDevice(false);
                setCameraError('No camera found on your device.');
                return;
            }
            
            setHasCameraDevice(true);
            
            // Now try to access the camera
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });
            
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Camera access error:', error);
            
            if (error.name === 'NotAllowedError') {
                setCameraError('Camera access denied. Please allow camera permission in your browser settings.');
                toast.error('Please allow camera access to continue');
            } else if (error.name === 'NotFoundError') {
                setHasCameraDevice(false);
                setCameraError('No camera found on your device.');
            } else {
                setCameraError('Unable to access camera. Please check your device settings.');
            }
        }
    };

    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const generateQRCode = () => {
        const currentUrl = `${window.location.origin}/selfie-capture?sid=${sessionId}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(currentUrl)}`;
        setQrCodeUrl(qrUrl);
    };

    const handleSelfieReceived = (imageData) => {
        // Convert base64 to blob
        fetch(imageData)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
                setSelfieFile(file);
                setCapturedImage(imageData);
                setSelfieCaptured(true);
                toast.success('Selfie received from your device!');
            })
            .catch(error => {
                console.error('Error processing selfie:', error);
                toast.error('Failed to process selfie');
            });
    };

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
            if (blob) {
                const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
                const imageUrl = URL.createObjectURL(blob);
                
                setSelfieFile(file);
                setCapturedImage(imageUrl);
                setSelfieCaptured(true);
                stopWebcam();
                toast.success('Selfie captured successfully!');
            }
        }, 'image/jpeg', 0.95);
    };

    const handleRetake = () => {
        setSelfieCaptured(false);
        setCapturedImage(null);
        setSelfieFile(null);
        if (selfieMode === 'webcam') {
            checkAndStartWebcam();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setSelfieFile(file);
            setCapturedImage(imageUrl);
            setSelfieCaptured(true);
            toast.success('Image uploaded successfully!');
        }
    };

    const handleModeChange = (mode) => {
        setSelfieMode(mode);
        setSelfieCaptured(false);
        setSelfieFile(null);
        setCapturedImage(null);
        setCameraError(null);
    };

    const handleDeviceCapture = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleContinue = () => {
        if (selfieCaptured && selfieFile) {
            onContinue({ selfie_image: selfieFile });
        }
    };

    return (
        <div className={styles.documentUpload}>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="user"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className={styles.documentHeader}>
                <div className={styles.counter}>2</div>
                <div>
                    <h2>Take Selfie</h2>
                    <p>Take your live selfie to ensure your identity</p>
                </div>
            </div>

            <div className={styles.documentContent}>
                <div className={styles.contentAlignment}>
                    <div className={styles.tabgrid}>
                        <button
                            className={selfieMode === 'webcam' ? styles.active : ''}
                            onClick={() => handleModeChange('webcam')}
                        >
                            <img src={WebCamIcon} alt='WebCamIcon' />
                            Use Web Cam
                        </button>
                        <button
                            className={selfieMode === 'device' ? styles.active : ''}
                            onClick={() => handleModeChange('device')}
                        >
                            <img src={UseIcon} alt='UseIcon' />
                            Use your Device
                        </button>
                    </div>

                    {selfieMode === 'webcam' ? (
                        <div className={styles.selfiBox}>
                            {cameraError ? (
                                <div className={styles.errorContainer}>
                                    <div className={styles.errorIcon}>
                                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="10" stroke="#EF4444" strokeWidth="2"/>
                                            <path d="M12 8V12M12 16H12.01" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/>
                                        </svg>
                                    </div>
                                    <p className={styles.errorText}>{cameraError}</p>
                                </div>
                            ) : selfieCaptured ? (
                                <div className={styles.capturedImageContainer}>
                                    <img src={capturedImage} alt="Captured Selfie" className={styles.capturedImage} />
                                    <button className={styles.retakeButton} onClick={handleRetake}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.89124 18 5.33579" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                            <path d="M21 3V7H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Retake
                                    </button>
                                </div>
                            ) : stream ? (
                                <div className={styles.videoContainer}>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className={styles.videoElement}
                                    />
                                    <button className={styles.cameraButton} onClick={handleCapture}>
                                        <CameraIcon />
                                    </button>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className={styles.selfiBox}>
                            {selfieCaptured ? (
                                <div className={styles.capturedImageContainer}>
                                    <img src={capturedImage} alt="Uploaded Selfie" className={styles.capturedImage} />
                                    <button className={styles.retakeButton} onClick={handleRetake}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.3051 3 16.4077 3.89124 18 5.33579" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                                            <path d="M21 3V7H17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                        Change Photo
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.qrContainer}>
                                    <div className={styles.imageCenter}>
                                        {qrCodeUrl ? (
                                            <img src={qrCodeUrl} alt='QR Code' className={styles.qrCode} />
                                        ) : (
                                            <img src={ScanImage} alt='ScanImage' />
                                        )}
                                    </div>
                                    <p>Scan QR code to open camera on your device</p>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className={styles.buttonGrid}>
                        <Button text="Cancel" lightbutton onClick={onCancel} />
                        <Button
                            text="Continue"
                            onClick={handleContinue}
                            disabled={!selfieCaptured}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
