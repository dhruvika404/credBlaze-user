'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './selfieCapture.module.scss';
import toast from 'react-hot-toast';

export default function SelfieCapturePage() {
    const [capturedImage, setCapturedImage] = useState(null);
    const [stream, setStream] = useState(null);
    const [sessionId, setSessionId] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        // Get session ID from URL
        const params = new URLSearchParams(window.location.search);
        const sid = params.get('sid');
        setSessionId(sid);

        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: 640, height: 480 }
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            toast.error('Camera access denied');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
    };

    const handleCapture = () => {
        if (!videoRef.current || !canvasRef.current) return;

        const canvas = canvasRef.current;
        const video = videoRef.current;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        const context = canvas.getContext('2d');
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(imageData);
        stopCamera();
        toast.success('Selfie captured!');
    };

    const handleRetake = () => {
        setCapturedImage(null);
        startCamera();
    };

    const handleSubmit = () => {
        if (!capturedImage || !sessionId) {
            toast.error('No selfie captured or invalid session');
            return;
        }

        // Store in localStorage first
        localStorage.setItem(`selfie_${sessionId}`, capturedImage);
        console.log('Selfie stored in localStorage with key:', `selfie_${sessionId}`);
        
        // Try to communicate with parent window
        try {
            if (window.opener && !window.opener.closed) {
                window.opener.postMessage({
                    type: 'SELFIE_CAPTURED',
                    sessionId: sessionId,
                    imageData: capturedImage
                }, window.location.origin);
                console.log('Selfie sent via postMessage');
            }
        } catch (error) {
            console.error('PostMessage error:', error);
        }

        toast.success('Selfie saved! You can close this window.');
        
        // Auto close after 2 seconds
        setTimeout(() => {
            try {
                window.close();
            } catch (e) {
                console.log('Cannot auto-close window');
            }
        }, 2000);
    };

    return (
        <div className={styles.container}>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            
            <div className={styles.header}>
                <h1>Take Your Selfie</h1>
                <p>Capture a clear photo of your face</p>
            </div>

            <div className={styles.cameraBox}>
                {capturedImage ? (
                    <div className={styles.preview}>
                        <img src={capturedImage} alt="Captured" />
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={styles.video}
                    />
                )}
            </div>

            <div className={styles.controls}>
                {capturedImage ? (
                    <>
                        <button onClick={handleRetake} className={styles.retakeBtn}>
                            Retake
                        </button>
                        <button onClick={handleSubmit} className={styles.submitBtn}>
                            Submit
                        </button>
                    </>
                ) : (
                    <button onClick={handleCapture} className={styles.captureBtn}>
                        <svg width="60" height="60" viewBox="0 0 60 60">
                            <circle cx="30" cy="30" r="28" fill="white" stroke="#000" strokeWidth="2"/>
                            <circle cx="30" cy="30" r="22" fill="#000"/>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
}
