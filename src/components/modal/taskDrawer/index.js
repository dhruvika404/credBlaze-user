'use client'
import React, { useState, useRef } from 'react'
import styles from './taskDrawer.module.scss'
import QuestionNMark from '@/icons/questionmark';
import FileIcon from '@/icons/fileIcon';
import ShareIcon from '@/icons/shareIcon';
import CloseIcon from '@/icons/closeIcon';
import PerformIcon from '@/icons/performIcon';
import ProIcon from '@/icons/proIcon';
import TaskStatusModal from '@/components/modal/taskStatusModal';
import InfoIcon from '@/icons/infoIcon';
import { submitTask } from '@/services/task';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
export default function TaskDrawer({ isOpen, onClose, task, onTaskSubmitted }) {
    const [view, setView] = useState('details'); // 'details' or 'perform'
    const [agreed, setAgreed] = useState(false);
    const [proofImage, setProofImage] = useState(null);
    const [proofFile, setProofFile] = useState(null);
    const [performanceUrl, setPerformanceUrl] = useState('');
    const [submissionLink, setSubmissionLink] = useState('');
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [proofSubmitted, setProofSubmitted] = useState(false);
    const { user, fetchAndSetProfile } = useAuth();
    const isUserPro = user?.is_prime;
    const isPrimeTask = task?.isPrime;
    const [copied, setCopied] = useState(false);
    const [shareCopied, setShareCopied] = useState(false);
    const fileInputRef = useRef(null);
    
    const isSubmission = task?.isSubmission || false;
    const submissionStatus = task?.status; // pending, approved, rejected

    React.useEffect(() => {
        if (isOpen) {
            if (isSubmission) {
                setIsStatusModalOpen(true);
            } else {
                setView('details');
                setAgreed(false);
                setProofImage(null);
                setProofFile(null);
                setPerformanceUrl('');
                setSubmissionLink('');
                setIsStatusModalOpen(false);
                setIsSubmitting(false);
                setProofSubmitted(false);
            }
        }
    }, [isOpen, isSubmission]);

    if (!isOpen || !task) return null;

    const handlePerformTask = () => {
        if (agreed) {
            setView('perform');
        }
    }

    const handleCompleteTask = async () => {
        if (!task?.rawData?.id) {
            toast.error('Invalid task data');
            return;
        }

        if (task.screenshotRequired && !proofFile) {
            toast.error('Please upload a screenshot');
            return;
        }

        if (task.performanceLinkRequired && !submissionLink.trim()) {
            toast.error('Please enter the submission link');
            return;
        }

        try {
            setIsSubmitting(true);

            const formData = new FormData();
            formData.append('task_campaign_id', task.rawData.id);

            if (proofFile) {
                formData.append('media_files', proofFile);
            }

            if (submissionLink.trim()) {
                formData.append('task_performance_url', submissionLink.trim());
            }

            const response = await submitTask(formData);

            if (response.success) {
                toast.success('Task submitted successfully!');
                setProofSubmitted(true);
                setIsStatusModalOpen(true);
                await fetchAndSetProfile();
                if (onTaskSubmitted) {
                    onTaskSubmitted();
                }
            }
        } catch (error) {
            console.error('Error submitting proof:', error);
            toast.error(error?.message || 'Failed to submit task');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleFile = (file) => {
        if (!file) return;
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => setProofImage(e.target.result);
            reader.readAsDataURL(file);
            setProofFile(file);
        }
    }

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        handleFile(file);
    };

    const handleChange = (e) => {
        const file = e.target.files?.[0];
        handleFile(file);
    };

    const handleClearImage = (e) => {
        e.stopPropagation();
        setProofImage(null);
        setProofFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const isPerformView = view === 'perform';

    const handleCopyLink = () => {
        if (task?.taskUrl) {
            navigator.clipboard.writeText(task.taskUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleShareTask = async () => {
        if (!task) return;

        const shareUrl = `${window.location.origin}/tasks?taskId=${task.id}`;

        try {
            await navigator.clipboard.writeText(shareUrl);
            setShareCopied(true);
            setTimeout(() => setShareCopied(false), 2000);
        } catch (err) {
            console.error('Error copying task link:', err);
            toast.error('Failed to copy link');
        }
    };

    const standardConditions = task?.termsAndConditions
        ? task.termsAndConditions.split('\n').filter(c => c.trim()).map(c => c.trim())
        : [];

    return (
        <>
            <div className={styles.overlay} onClick={onClose} style={{ display: isStatusModalOpen ? 'none' : 'flex' }}>
                <div
                    className={`${styles.drawer} ${isPerformView ? styles.perform : (isPrimeTask ? styles.pro : styles.standard)}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className={styles.header}>
                        <div className={styles.drawerHeader}>
                            <div className={styles.title}>
                                <h2>Task Details</h2>
                            </div>
                            <button className={styles.closeBtn} onClick={onClose}>
                                <CloseIcon />
                            </button>
                        </div>
                        <div className={styles.divider} />
                    </div>

                    <div className={styles.scrollContent}>
                        {/* View Specific Content */}
                        {view === 'details' ? (
                            <>
                                {/* Task Info */}
                                <div className={styles.taskInfo}>
                                    <div className={styles.textInfo}>
                                        <h3>{task?.title || '-'}</h3>
                                        <p>{task?.description || '-'}</p>
                                    </div>
                                    <div className={`${styles.priceTag} ${task?.rewardType === 'coin' ? styles.coin : ''}`}>
                                        {task?.rewardType === 'coin' ? (
                                            <div className={styles.reward}>
                                                <div className={styles.rewardIcon}>
                                                    <img src="/assets/icons/star.svg" alt="reward" />
                                                </div>
                                                <span>{task?.reward} CB</span>
                                            </div>
                                        ) : (
                                            <span>₹ {task?.reward}</span>
                                        )}
                                    </div>
                                </div>

                                {/* Media */}
                                <div className={styles.mediaSection}>
                                    <img src={task?.taskBanner} alt="task" />
                                    {isPrimeTask && (
                                        <div className={styles.proBadge}>
                                            <ProIcon />
                                            <span>Pro Task</span>
                                        </div>
                                    )}
                                </div>

                                {/* Guidelines */}
                                <div className={styles.guidelines}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.title}>
                                            <div className={styles.icon}>
                                                <FileIcon />
                                            </div>
                                            <span>Terms & Conditions</span>
                                        </div>
                                        <div className={styles.helpIcon}>
                                            <QuestionNMark />
                                        </div>
                                    </div>
                                    <div className={styles.divider} />
                                    <div className={styles.list}>
                                        {standardConditions.map((text, index) => (
                                            <div key={index + 1} className={styles.item}>
                                                <div className={styles.number}>{index + 1}</div>
                                                <span>{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Agreement - Only for standard tasks or pro users */}
                                {(!isPrimeTask || isUserPro) && (
                                    <label className={styles.checkboxLabel}>
                                        <input
                                            type="checkbox"
                                            checked={agreed}
                                            onChange={(e) => setAgreed(e.target.checked)}
                                        />
                                        <div className={styles.customCheckbox}>
                                            {agreed && (
                                                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M1 5L4.5 8.5L11 1" stroke="#0000EE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            )}
                                        </div>
                                        <span>I have read and agree to the task guidelines.</span>
                                    </label>
                                )}

                                {/* Info Alert - Only for non-pro users on pro tasks */}
                                {isPrimeTask && !isUserPro && (
                                    <div className={styles.infoAlert}>
                                        <div className={styles.icon}>
                                            <InfoIcon />
                                        </div>
                                        <p>We'll review your submission within 24 hours and notify you once approved.</p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <>
                                {/* Perform View Content */}
                                <div className={styles.taskInfo}>
                                    <div className={styles.textInfo}>
                                        <h3>{task?.title || '-'}</h3>
                                        <p>{task?.description || '-'}</p>
                                    </div>
                                    <div className={`${styles.priceTag} ${task?.rewardType === 'coin' ? styles.coin : styles.rupee}`}>
                                        {task?.rewardType === 'coin' ? (
                                            <div className={styles.reward}>
                                                <div className={styles.rewardIcon}>
                                                    <img src="/assets/icons/star.svg" alt="reward" />
                                                </div>
                                                {task?.reward} CB
                                            </div>
                                        ) : `₹ ${task?.reward}`}
                                    </div>
                                </div>

                                <div className={styles.performMediaWrapper}>
                                    <div className={styles.mediaSectionPerform}>
                                        <img src={task?.taskBanner} alt="task" />
                                    </div>
                                    {task?.taskUrl && (
                                        <div className={styles.readOnlyInput}>
                                            <div className={styles.label}>{task.taskUrl}</div>
                                            <div className={styles.copyWrapper}>
                                                {copied && <span className={styles.copiedMsg}>Copied!</span>}
                                                <div className={styles.icon} onClick={handleCopyLink} style={{ cursor: 'pointer' }}>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clipPath="url(#clip0_486_10212)">
                                                            <path d="M5.83594 8.056C5.83594 7.46655 6.07009 6.90125 6.48689 6.48445C6.90369 6.06765 7.46899 5.8335 8.05844 5.8335H15.2801C15.572 5.8335 15.861 5.89098 16.1306 6.00267C16.4003 6.11437 16.6453 6.27807 16.8516 6.48445C17.058 6.69083 17.2217 6.93584 17.3334 7.20548C17.4451 7.47513 17.5026 7.76413 17.5026 8.056V15.2777C17.5026 15.5695 17.4451 15.8585 17.3334 16.1282C17.2217 16.3978 17.058 16.6428 16.8516 16.8492C16.6453 17.0556 16.4003 17.2193 16.1306 17.331C15.861 17.4427 15.572 17.5002 15.2801 17.5002H8.05844C7.76657 17.5002 7.47757 17.4427 7.20792 17.331C6.93828 17.2193 6.69327 17.0556 6.48689 16.8492C6.28051 16.6428 6.11681 16.3978 6.00512 16.1282C5.89342 15.8585 5.83594 15.5695 5.83594 15.2777V8.056Z" stroke="#3D3D3D" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                            <path d="M3.34333 13.9475C3.08779 13.8018 2.87523 13.5912 2.72715 13.3371C2.57906 13.0829 2.50071 12.7942 2.5 12.5V4.16667C2.5 3.25 3.25 2.5 4.16667 2.5H12.5C13.125 2.5 13.465 2.82083 13.75 3.33333" stroke="#3D3D3D" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_486_10212">
                                                                <rect width="20" height="20" fill="white" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.guidelines}>
                                    <div className={styles.sectionHeader}>
                                        <div className={styles.title}>
                                            <div className={styles.icon}>
                                                <FileIcon />
                                            </div>
                                            <span>Conditions To Upload Proof</span>
                                        </div>
                                        <div className={styles.helpIcon} style={{ opacity: 0 }}>
                                            <QuestionNMark />
                                        </div>
                                    </div>
                                    <div className={styles.divider} />
                                    <div className={styles.list}>
                                        {standardConditions.map((text, index) => (
                                            <div key={index + 1} className={styles.item}>
                                                <div className={styles.number}>{index + 1}</div>
                                                <span>{text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {task?.screenshotRequired && (
                                    <div className={styles.submitProofWrapper}>
                                        <div className={styles.statusHeader}>
                                            <div className={styles.titleWrapper}>
                                                <div className={styles.icon}>
                                                    <FileIcon />
                                                </div>
                                                <div className={styles.textStack}>
                                                    <span className={styles.titleText}>Submit Proof</span>
                                                    <span className={styles.subText}>Upload a clear screenshot showing you've completed the task</span>
                                                </div>
                                            </div>
                                            <div className={styles.helpIcon} style={{ opacity: 0 }}>
                                                <QuestionNMark />
                                            </div>
                                        </div>

                                        <div className={styles.uploadSection}>
                                            <div
                                                className={`${styles.dragUpload} ${proofImage ? styles.hasPreview : ''}`}
                                                onClick={() => fileInputRef.current?.click()}
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={handleDrop}
                                            >
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    style={{ display: 'none' }}
                                                    accept="image/*"
                                                    onChange={handleChange}
                                                />
                                                {proofImage ? (
                                                    <div className={styles.previewContainer}>
                                                        <img src={proofImage} alt="proof" className={styles.previewImg} />
                                                        <button className={styles.clearBtn} onClick={handleClearImage}>✕</button>
                                                    </div>
                                                ) : (
                                                    <>
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
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {task?.performanceLinkRequired && (
                                    <div className={styles.submissionLinkInput}>
                                        <label>Submission link</label>
                                        <input
                                            type="url"
                                            placeholder="Enter your submission link"
                                            value={submissionLink}
                                            onChange={(e) => setSubmissionLink(e.target.value)}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer Buttons */}
                    {!isPerformView ? (
                        <div className={styles.footer}>
                            {isPrimeTask && !isUserPro ? (
                                <button
                                    className={`${styles.mainBtn} ${styles.pro}`}
                                    onClick={() => {/* Upgrade Logic */ }}
                                >
                                    Upgrade to Pro
                                </button>
                            ) : (
                                <button
                                    className={styles.mainBtn}
                                    onClick={handlePerformTask}
                                    disabled={!agreed}
                                >
                                    Perform Task
                                    <PerformIcon />
                                </button>
                            )}
                            <button className={styles.shareBtn} onClick={handleShareTask}>
                                {shareCopied ? 'Link Copied!' : 'Share Tasks'}
                                <ShareIcon />
                            </button>
                        </div>
                    ) : (
                        <div className={`${styles.footer} ${styles.performFooter}`}>
                            <button
                                className={`${styles.mainBtn} ${styles.back}`}
                                onClick={handleCompleteTask}
                                disabled={(task?.screenshotRequired && !proofImage) || isSubmitting || (task?.performanceLinkRequired && !submissionLink.trim())}
                            >
                                {isSubmitting ? 'Submitting...' : 'Complete Task'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <TaskStatusModal
                isOpen={isStatusModalOpen}
                onClose={() => {
                    setIsStatusModalOpen(false);
                    onClose();
                }}
                status={isSubmission ? (submissionStatus === 'pending' ? 'review' : submissionStatus) : "review"}
                reward={isSubmission ? (task?.earnedAmount || task?.earnedPoints || '0') : '0'}
            />
        </>
    )
}
