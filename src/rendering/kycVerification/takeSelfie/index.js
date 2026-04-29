'use client';
import React, { useState, useRef, useEffect } from 'react'
import QRCode from 'react-qr-code';
import { getMobileImage } from '@/services/kyc';
import styles from './takeSelfie.module.scss';
import Button from '@/components/button';
import CameraIcon from '@/icons/cameraIcon';
const WebCamIcon = '/assets/icons/web-cam.svg';
const UseIcon = '/assets/icons/use.svg';

export default function TakeSelfie({ onContinue, onCancel }) {
    const [selfieCaptured, setSelfieCaptured] = useState(false);
    const [selfieMode, setSelfieMode] = useState('webcam');
    const [stream, setStream] = useState(null);
    const [capturedImage, setCapturedImage] = useState(null);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
    const [mobileImage, setMobileImage] = useState(null);
    const [cameraError, setCameraError] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const pollIntervalRef = useRef(null);

    useEffect(() => {
        if (selfieMode === 'webcam') {
            startWebcam();
        } else {
            stopWebcam();
            startPolling();
        }
        return () => {
            stopWebcam();
            stopPolling();
        };
    }, [selfieMode]);

    const startWebcam = async () => {
        try {
            setCameraError(null);
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user' }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error('Camera access denied:', err);
            if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
                setCameraError('Camera not found. Please connect a camera.');
            } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setCameraError('Camera access denied. Please allow camera permissions.');
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

    const startPolling = () => {
        pollIntervalRef.current = setInterval(async () => {
            try {
                const data = await getMobileImage();
                if (data?.image || data?.url) {
                    setMobileImage(data.image || data.url);
                    setSelfieCaptured(true);
                    stopPolling();
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 2000);
    };

    const stopPolling = () => {
        if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
        }
    };

    const captureWebcam = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (video && canvas) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0);
            const imageData = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageData);
            setSelfieCaptured(true);
            stopWebcam();
        }
    };

    const retakeWebcam = () => {
        setCapturedImage(null);
        setSelfieCaptured(false);
        startWebcam();
    };

    const handleModeChange = (mode) => {
        setSelfieMode(mode);
        setSelfieCaptured(false);
        setCapturedImage(null);
        setMobileImage(null);
        setCameraError(null);
    };

    const handleContinue = () => {
        if (selfieCaptured) {
            const imageToSend = selfieMode === 'webcam' ? capturedImage : mobileImage;
            if (imageToSend) {
                fetch(imageToSend)
                    .then(res => res.blob())
                    .then(blob => {
                        const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
                        onContinue({ selfie_image: file });
                    });
            }
        }
    };

    const mobileUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/mobile-capture?session=${sessionId}`
        : '';

    return (
        <div className={styles.documentUpload}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            <div className={styles.documentHeader}>
                <div className={styles.counter}>2</div>
                <div>
                    <h2>Take Selfie</h2>
                    <p>Take your live selfie to insure that your identy</p>
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
                                        <img src={WebCamIcon} alt='Camera Error' />
                                    </div>
                                    <p className={styles.errorText}>{cameraError}</p>
                                </div>
                            ) : !capturedImage ? (
                                <>
                                    <video 
                                        ref={videoRef} 
                                        autoPlay 
                                        playsInline 
                                        className={styles.videoFeed}
                                    />
                                    <button className={styles.cameraButton} onClick={captureWebcam}>
                                        <CameraIcon />
                                    </button>
                                </>
                            ) : (
                                <>
                                    <img src={capturedImage} alt="Captured" className={styles.capturedImage} />
                                    <button className={styles.retakeButton} onClick={retakeWebcam}>
                                        <CameraIcon />
                                        Retake
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className={styles.selfiBox}>
                            {!mobileImage ? (
                                <div className={styles.qrContainer}>
                                    <div className={styles.qrCodeWrapper}>
                                        <QRCode value={mobileUrl} size={180} />
                                    </div>
                                    <p className={styles.qrText}>Scan QR to capture<br />photo using your device</p>
                                </div>
                            ) : (
                                <div className={styles.imageCenter}>
                                    <img src={mobileImage} alt="Mobile Capture" className={styles.mobileImage} />
                                    <div className={styles.scannedBadge}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                            <circle cx="12" cy="12" r="12" fill="#10B981"/>
                                            <path d="M7 12L10.5 15.5L17 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </div>
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
