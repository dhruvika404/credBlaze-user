import React from 'react'
import styles from './tutorialVideoModal.module.scss';

const CloseIcon = '/assets/icons/close-black.svg';

export default function TutorialVideoModal({
    isOpen,
    onClose,
    videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ"
}) {
    if (!isOpen) return null;

    return (
        <div className={styles.videoModalWrapper} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.closeButton} onClick={onClose}>
                    <img src={CloseIcon} alt="close" />
                </div>
                <div className={styles.videoContainer}>
                    <iframe
                        width="100%"
                        height="100%"
                        src={videoUrl}
                        title="Tutorial Video"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    )
}