import React from 'react'
import styles from './tutorialVideoModal.module.scss';

const CloseIcon = '/assets/icons/close-black.svg';

export default function TutorialVideoModal({
    isOpen,
    onClose,
    videoUrl,
    adData
}) {
    if (!isOpen) return null;

    const mediaUrl = adData ? adData.ad_file : (videoUrl || "https://www.youtube.com/embed/dQw4w9WgXcQ");
    const destinationLink = adData?.destination_link;
    const isVideo = mediaUrl?.match(/\.(mp4|webm|ogg)$/i) || mediaUrl?.includes('youtube.com') || mediaUrl?.includes('youtu.be');

    const handleMediaClick = () => {
        if (destinationLink && destinationLink !== '#') {
            window.open(destinationLink, '_blank');
        }
    };

    return (
        <div className={styles.videoModalWrapper} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.closeButton} onClick={onClose}>
                    <img src={CloseIcon} alt="close" />
                </div>
                <div 
                    className={styles.videoContainer} 
                    onClick={handleMediaClick}
                    style={{ cursor: destinationLink ? 'pointer' : 'default' }}
                >
                    {isVideo ? (
                        mediaUrl.includes('youtube.com') || mediaUrl.includes('youtu.be') ? (
                            <iframe
                                width="100%"
                                height="100%"
                                src={mediaUrl.includes('watch?v=') ? mediaUrl.replace('watch?v=', 'embed/') : mediaUrl}
                                title="Media Content"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        ) : (
                            <video
                                src={mediaUrl}
                                controls
                                autoPlay
                                className={styles.videoPlayer}
                            />
                        )
                    ) : (
                        <img src={mediaUrl} alt="Ad Content" className={styles.adImage} />
                    )}
                </div>
            </div>
        </div>
    )
}