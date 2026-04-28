'use client';
import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from './uploadBox.module.scss';
import DragFileIcon from '@/icons/dragFileIcon';

export default function UploadBox({ subtitle = "Aadhaar, PAN, Passport, or Driver's License", onFileSelect, disabled, existingImage, showPreview = true }) {
    const inputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState(existingImage || null);
    const [fileName, setFileName] = useState(null);

    useEffect(() => {
        if (existingImage) setPreview(existingImage);
    }, [existingImage]);

    const handleFile = useCallback((file) => {
        if (!file || disabled) return;
        if (!showPreview) {
            // Don't set preview or filename, just call the callback
            onFileSelect?.(file);
            return;
        }
        setFileName(file.name);
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
        onFileSelect?.(file);
    }, [onFileSelect, disabled, showPreview]);

    const handleDragOver = (e) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleDrop = (e) => {
        if (disabled) return;
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleChange = (e) => {
        if (disabled) return;
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        if (disabled) return;
        setPreview(null);
        setFileName(null);
        if (inputRef.current) inputRef.current.value = '';
        onFileSelect?.(null);
    };

    return (
        <div
            className={`${styles.uploadBox} ${isDragging ? styles.dragging : ''} ${fileName && showPreview ? styles.hasFile : ''} ${disabled ? styles.disabled : ''}`}
            onClick={() => !disabled && inputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            role="button"
            tabIndex={disabled ? -1 : 0}
            onKeyDown={(e) => e.key === 'Enter' && !disabled && inputRef.current?.click()}
            aria-label="Upload file"
            aria-disabled={disabled}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            <input
                ref={inputRef}
                type="file"
                accept="image/*,.pdf"
                className={styles.hiddenInput}
                onChange={handleChange}
                onClick={(e) => e.stopPropagation()}
                disabled={disabled}
            />

            {showPreview && preview ? (
                <div className={styles.previewWrap}>
                    <img src={preview} alt="preview" className={styles.previewImg} />
                    {!disabled && (
                        <button className={styles.clearBtn} onClick={handleClear} aria-label="Remove file">✕</button>
                    )}
                </div>
            ) : showPreview && fileName ? (
                <div className={styles.fileInfo}>
                    <DragFileIcon />
                    <span className={styles.fileName}>{fileName}</span>
                    {!disabled && (
                        <button className={styles.clearBtn} onClick={handleClear} aria-label="Remove file">✕</button>
                    )}
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
