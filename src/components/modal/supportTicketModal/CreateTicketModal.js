import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import styles from './supportTicketModal.module.scss';
import Button from '@/components/button';
import { createSupportTicket } from '@/services/supportTicket';

const AttachmentIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
);

export default function CreateTicketModal({ isOpen, onClose, onSuccess }) {
    const [newTicketSubject, setNewTicketSubject] = useState('');
    const [newTicketMessage, setNewTicketMessage] = useState('');
    const [newTicketFiles, setNewTicketFiles] = useState([]);
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState('');
    const [subjectError, setSubjectError] = useState('');
    const newFileInputRef = useRef(null);
    if (!isOpen) return null;

    const handleCloseCreate = () => {
        setNewTicketSubject('');
        setNewTicketMessage('');
        setNewTicketFiles([]);
        setCreateError('');
        setSubjectError('');
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseCreate();
        }
    };

    const handleNewFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewTicketFiles(prev => [...prev, ...filesArray]);
        }
    };

    const removeNewFile = (index) => {
        setNewTicketFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleCreateTicket = async () => {
        let hasError = false;
        if (!newTicketSubject.trim()) {
            setSubjectError('Subject is required.');
            hasError = true;
        }
        if (!newTicketMessage.trim()) {
            setCreateError('Initial message is required.');
            hasError = true;
        }
        if (hasError) return;

        try {
            setCreating(true);
            const formData = new FormData();
            formData.append('Subject', newTicketSubject.trim());
            formData.append('query', newTicketMessage.trim());
            newTicketFiles.forEach((file) => {
                formData.append('files', file);
            });

            const res = await createSupportTicket(formData);
            if (res?.success) {
                toast.success('Support ticket created successfully.');
                handleCloseCreate();
                if (onSuccess) {
                    await onSuccess();
                }
            } else {
                toast.error(res?.message || 'Failed to create support ticket.');
            }
        } catch (err) {
            console.error('Failed to create ticket:', err);
            toast.error('An error occurred while creating the ticket.');
        } finally {
            setCreating(false);
        }
    };

    return (
        <div className={styles.popupOverlay} onClick={handleOverlayClick}>
            <div className={`${styles.popupContent} ${styles.w560}`}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Create Support Ticket</h3>
                    <button className={styles.closeBtn} onClick={handleCloseCreate}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.createTicketForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="subject-input">
                                Subject <span style={{ color: '#EC221F', fontWeight: 'bold' }}>*</span>
                            </label>
                            <input
                                id="subject-input"
                                type="text"
                                placeholder="Enter ticket subject..."
                                value={newTicketSubject}
                                onChange={(e) => {
                                    setNewTicketSubject(e.target.value);
                                    if (e.target.value.trim()) {
                                        setSubjectError('');
                                    }
                                }}
                                className={subjectError ? styles.errorInput : ''}
                                disabled={creating}
                                style={{
                                    width: '100%',
                                    height: '40px',
                                    padding: '0 12px',
                                    borderRadius: '8px',
                                    border: subjectError ? '1px solid #EC221F' : '1px solid #CBD5E1',
                                    fontSize: '13px',
                                    color: '#1E293B',
                                    outline: 'none'
                                }}
                            />
                            {subjectError && <span className={styles.errorText}>{subjectError}</span>}
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="query-textarea">
                                Initial Message <span style={{ color: '#EC221F', fontWeight: 'bold' }}>*</span>
                            </label>
                            <textarea
                                id="query-textarea"
                                placeholder="Describe your issue or request in detail..."
                                value={newTicketMessage}
                                onChange={(e) => {
                                    setNewTicketMessage(e.target.value);
                                    if (e.target.value.trim()) {
                                        setCreateError('');
                                    }
                                }}
                                className={createError ? styles.errorInput : ''}
                                disabled={creating}
                            />
                            {createError && <span className={styles.errorText}>{createError}</span>}
                        </div>

                        {/* File Attachment Section with drag-and-drop & previews */}
                        <div className={styles.uploadSection}>
                            <div
                                className={styles.dragUpload}
                                onClick={() => newFileInputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (e.dataTransfer.files) {
                                        const filesArray = Array.from(e.dataTransfer.files);
                                        setNewTicketFiles(prev => [...prev, ...filesArray]);
                                    }
                                }}
                            >
                                <input
                                    type="file"
                                    ref={newFileInputRef}
                                    style={{ display: 'none' }}
                                    multiple
                                    onChange={handleNewFileChange}
                                    disabled={creating}
                                />
                                <div className={styles.icon}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3M12 3L7 8M12 3V15" stroke="#0000EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className={styles.text}>
                                    <div className={styles.mainText}>
                                        Drag your file(s) or <span className={styles.browse}>browse</span>
                                    </div>
                                    <div className={styles.subText}>Max 10 MB files are allowed</div>
                                </div>
                            </div>
                        </div>

                        {newTicketFiles.length > 0 && (
                            <div className={styles.selectedFilesContainer}>
                                {newTicketFiles.map((file, idx) => {
                                    const isImage = file.type?.startsWith('image/');
                                    const fileUrl = isImage ? URL.createObjectURL(file) : null;
                                    return (
                                        <div key={idx} className={styles.previewFileCard}>
                                            {isImage ? (
                                                <div className={styles.thumbnailWrapper}>
                                                    <img src={fileUrl} alt={file.name} className={styles.thumbnailImg} />
                                                </div>
                                            ) : (
                                                <div className={styles.fileIconWrapper}>
                                                    <AttachmentIcon />
                                                </div>
                                            )}
                                            <div className={styles.fileMeta}>
                                                <span className={styles.fileName}>{file.name}</span>
                                                <span className={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                            <button
                                                type="button"
                                                className={styles.removeFileBtn}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeNewFile(idx);
                                                }}
                                                disabled={creating}
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className={styles.popupFooterActions}>
                            <Button
                                text="Cancel"
                                lightbutton
                                onClick={handleCloseCreate}
                                disabled={creating}
                            />
                            <Button
                                text={creating ? 'Submitting...' : 'Submit Ticket'}
                                onClick={handleCreateTicket}
                                disabled={creating}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
