import React, { useState, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import styles from './supportTicketModal.module.scss';
import Button from '@/components/button';
import { useAuth } from '@/context/AuthContext';
import { supportTicketUserReply } from '@/services/supportTicket';

const AttachmentIcon = () => (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
    </svg>
);

export default function TicketDetailsModal({ isOpen, onClose, selectedTicket, onSuccess }) {
    const { user } = useAuth();
    const [replyQuery, setReplyQuery] = useState('');
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [replying, setReplying] = useState(false);
    const [isReopenedLocally, setIsReopenedLocally] = useState(false);
    const chatHistoryRef = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (chatHistoryRef.current) {
            chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
        }
    }, [selectedTicket?.conversations, isOpen]);

    if (!isOpen || !selectedTicket) return null;

    const handleCloseDetails = () => {
        setReplyQuery('');
        setSelectedFiles([]);
        setIsReopenedLocally(false);
        onClose();
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseDetails();
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setSelectedFiles(prev => [...prev, ...filesArray]);
        }
    };

    const removeFile = (index) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSendReply = async () => {
        if (!replyQuery.trim()) {
            toast.error('Please enter a message.');
            return;
        }

        try {
            setReplying(true);
            const formData = new FormData();
            formData.append('query', replyQuery.trim());
            selectedFiles.forEach((file) => {
                formData.append('files', file);
            });

            const res = await supportTicketUserReply(selectedTicket.id, formData);
            if (res?.success) {
                toast.success('Reply submitted successfully.');
                handleCloseDetails();
                if (onSuccess) {
                    await onSuccess(selectedTicket.id);
                }
            } else {
                toast.error(res?.message || 'Failed to submit reply.');
            }
        } catch (err) {
            console.error('Failed to submit reply:', err);
            toast.error('An error occurred while sending the reply.');
        } finally {
            setReplying(false);
        }
    };

    return (
        <div className={styles.popupOverlay} onClick={handleOverlayClick}>
            <div className={`${styles.popupContent} ${styles.w720}`}>
                <div className={styles.header}>
                    <h3 className={styles.title}>Ticket Conversation Details</h3>
                    <button className={styles.closeBtn} onClick={handleCloseDetails}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.ticketDetailPopup}>
                        {/* Summary Block */}
                        <div className={styles.ticketSummary}>
                            <div className={styles.infoField}>
                                <span className={styles.label}>Ticket ID</span>
                                <span className={styles.value}>{selectedTicket.id}</span>
                            </div>
                            <div className={styles.infoField}>
                                <span className={styles.label}>Subject</span>
                                <span className={styles.value}>{selectedTicket.Subject}</span>
                            </div>
                            <div className={styles.infoField}>
                                <span className={styles.label}>Raised By</span>
                                <span className={styles.value}>{selectedTicket.user_name || user?.name || 'You'}</span>
                            </div>
                            <div className={styles.infoField}>
                                <span className={styles.label}>Status</span>
                                <span className={styles.value}>
                                    {(() => {
                                        const status = selectedTicket.status?.toLowerCase();
                                        const displayStatus = status === 'submit' ? 'Submitted' : status === 'open' ? 'Open' : status?.startsWith('close') ? 'Closed' : status;
                                        const dotClass = (status === 'submit' || status === 'open') ? styles.greenDot : styles.redDot;
                                        return (
                                            <div className={styles.statusActive} style={{ marginTop: '2px' }}>
                                                <div className={`${styles.dot} ${dotClass}`}></div>
                                                <span style={{ textTransform: 'capitalize' }}>{displayStatus}</span>
                                            </div>
                                        );
                                    })()}
                                </span>
                            </div>
                        </div>

                        {/* Chat Feed */}
                        <div className={styles.chatSection}>
                            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1E293B' }}>Conversation History</h4>
                            <div className={styles.chatHistory} ref={chatHistoryRef}>
                                {(!selectedTicket.conversations || selectedTicket.conversations.length === 0) ? (
                                    <div className={styles.emptyChat}>No messages in this ticket yet.</div>
                                ) : (
                                    selectedTicket.conversations.map((msg, index) => {
                                        const isSenderAdmin = msg.sender_type === 'Admin';
                                        return (
                                            <div
                                                key={msg.id || index}
                                                className={`${styles.msgWrapper} ${isSenderAdmin ? styles.adminMsg : styles.userMsg}`}
                                            >
                                                <div className={styles.msgInfo}>
                                                    {isSenderAdmin ? (
                                                        <>
                                                            <span className={styles.senderName}>{msg.sender_name || "Admin"}</span>
                                                            <span className={styles.msgTime}>{moment.utc(msg.created_at).local().format('YYYY-MM-DD hh:mm A')}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span className={styles.msgTime}>{moment.utc(msg.created_at).local().format('YYYY-MM-DD hh:mm A')}</span>
                                                            <span className={styles.senderName}>You</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className={styles.msgBubble}>
                                                    <p>{msg.query}</p>
                                                    {msg.files && msg.files.length > 0 && (
                                                        <div className={`${styles.attachments} ${!isSenderAdmin ? styles.userAttachments : ''}`}>
                                                            {msg.files.map((fileItem, fIdx) => {
                                                                const fileUrl = fileItem && typeof fileItem === 'object' ? (fileItem.file || fileItem.url || '') : fileItem;
                                                                if (!fileUrl) return null;

                                                                // Strip S3 query string params
                                                                const cleanUrl = fileUrl.split('?')[0];
                                                                let fileName = cleanUrl.split('/').pop() || `Attachment_${fIdx + 1}`;
                                                                try {
                                                                    fileName = decodeURIComponent(fileName);
                                                                } catch (e) {
                                                                    // Fallback
                                                                }

                                                                return (
                                                                    <a
                                                                        key={fIdx}
                                                                        href={fileUrl}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className={styles.attachmentLink}
                                                                    >
                                                                        <AttachmentIcon />
                                                                        <span>{fileName}</span>
                                                                    </a>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>

                        {/* Reply Form (Only if ticket is not closed or reopened locally) */}
                        {(!selectedTicket.status?.toLowerCase()?.startsWith('close') || isReopenedLocally) && (
                            <div className={styles.replyForm}>
                                <label htmlFor="reply-textarea">Post a Reply</label>
                                <textarea
                                    id="reply-textarea"
                                    placeholder="Type your reply message to support..."
                                    value={replyQuery}
                                    onChange={(e) => setReplyQuery(e.target.value)}
                                    disabled={replying}
                                />

                                {/* Premium drag-and-drop & previews file upload for replies */}
                                <div className={styles.uploadSection}>
                                    <div
                                        className={styles.dragUpload}
                                        onClick={() => fileInputRef.current?.click()}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                            e.preventDefault();
                                            if (e.dataTransfer.files) {
                                                const filesArray = Array.from(e.dataTransfer.files);
                                                setSelectedFiles(prev => [...prev, ...filesArray]);
                                            }
                                        }}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            multiple
                                            onChange={handleFileChange}
                                            disabled={replying}
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

                                {selectedFiles.length > 0 && (
                                    <div className={styles.selectedFilesContainer}>
                                        {selectedFiles.map((file, idx) => {
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
                                                            removeFile(idx);
                                                        }}
                                                        disabled={replying}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}

                                {/* Actions - Only Cancel and Send Reply */}
                                <div className={styles.popupFooterActions}>
                                    <Button
                                        text="Cancel"
                                        lightbutton
                                        onClick={handleCloseDetails}
                                        disabled={replying}
                                    />
                                    <Button
                                        text={replying ? 'Submitting...' : 'Send Reply'}
                                        onClick={handleSendReply}
                                        disabled={replying || !replyQuery.trim()}
                                    />
                                </div>
                            </div>
                        )}

                        {(selectedTicket.status?.toLowerCase()?.startsWith('close') && !isReopenedLocally) && (
                            <div className={styles.popupFooterActions}>
                                <Button
                                    text="Cancel"
                                    lightbutton
                                    onClick={handleCloseDetails}
                                />
                                <Button
                                    text="Reopen Ticket"
                                    onClick={() => setIsReopenedLocally(true)}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
