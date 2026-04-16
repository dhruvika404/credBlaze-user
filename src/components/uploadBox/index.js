'use client';
import React, { useRef, useState, useCallback } from 'react';
import styles from './uploadBox.module.scss';
import DragFileIcon from '@/icons/dragFileIcon';

export default function UploadBox({ subtitle = "Aadhaar, PAN, Passport, or Driver's License", onFileSelect }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(null);
    const [fileName, setFileName] = useState(null);

    const handleFile = useCallback((file) => {
        if (!file) return;
        setFileName(file.name);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
        onFileSelect?.(file);
    }, [onFileSelect]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setPreview(null);
        setFileName(null);
        if (inputRef.current) inputRef.current.value = '';
        onFileSelect?.(null);
    };

    return (
        <div
            className={`${styles.uploadBox} ${isDragging ? styles.dragging : ''} ${fileName ? styles.hasFile : ''}`}
            onClick={() => inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            aria-label="Upload file"
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                className={styles.hiddenInput}
                onChange={handleChange}
                onClick={(e) => e.stopPropagation()}
            />

            {preview ? (
                <div className={styles.previewWrap}>
                    <img src={preview} alt="preview" className={styles.previewImg} />
                    <button className={styles.clearBtn} onClick={handleClear} aria-label="Remove file">✕</button>
                </div>
            ) : fileName ? (
                <div className={styles.fileInfo}>
                    <DragFileIcon />
                    <span className={styles.fileName}>{fileName}</span>
                    <button className={styles.clearBtn} onClick={handleClear} aria-label="Remove file">✕</button>
                </div>
            ) : (
                <div className={styles.placeholder}>
                    <div className={styles.iconCenter}>
                        <DragFileIcon />
                    </div>
                    <p>Click to upload or drag and drop</p>
                    <span>{subtitle}</span>
                </div>
            )}
        </div>
    );
}
