'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './storyPreview.module.scss';
import { markAdAsSeen } from '@/services/ads';


export default function StoryPreview({ stories = [], onClose, initialIndex = 0, onStorySeen }) {
    const clampedInitial = Math.min(initialIndex, stories.length - 1);
    const [currentIndex, setCurrentIndex] = useState(clampedInitial >= 0 ? clampedInitial : 0);
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef(null);

    useEffect(() => {
        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, []);

    useEffect(() => {
        setActiveItemIndex(0);
        setProgress(0);
    }, [currentIndex]);

    const handleNextUser = useCallback(() => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            onClose?.();
        }
    }, [currentIndex, stories.length, onClose]);

    const handlePrevUser = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    }, [currentIndex]);

    const handleNextItem = useCallback((e) => {
        e?.stopPropagation();
        const currentGroup = stories[currentIndex];
        if (currentGroup && activeItemIndex < (currentGroup.items?.length || 1) - 1) {
            setActiveItemIndex(prev => prev + 1);
            setProgress(0);
        } else {
            handleNextUser();
        }
    }, [currentIndex, activeItemIndex, stories, handleNextUser]);

    const handlePrevItem = useCallback((e) => {
        e?.stopPropagation();
        if (activeItemIndex > 0) {
            setActiveItemIndex(prev => prev - 1);
            setProgress(0);
        } else {
            handlePrevUser();
        }
    }, [activeItemIndex, handlePrevUser]);

    // Close on Escape key
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose?.();
        } else if (e.key === 'ArrowRight') {
            handleNextItem();
        } else if (e.key === 'ArrowLeft') {
            handlePrevItem();
        }
    }, [onClose, handleNextItem, handlePrevItem]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Auto advance progress
    useEffect(() => {
        if (!isPlaying) return;

        const currentGroup = stories[currentIndex];
        if (!currentGroup || !currentGroup.items || currentGroup.items.length === 0) return;

        let animationFrame;
        let start = Date.now();
        const duration = 15000; // 15 seconds per image

        const tick = () => {
            if (!isPlaying) return;
            const elapsed = Date.now() - start;
            const newProgress = Math.min((elapsed / duration) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                handleNextItem();
            } else {
                animationFrame = requestAnimationFrame(tick);
            }
        };

        animationFrame = requestAnimationFrame(tick);

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [currentIndex, activeItemIndex, isPlaying, stories, handleNextItem]);

    // Track seen status
    useEffect(() => {
        const currentGroup = stories[currentIndex];
        const currentItem = currentGroup?.items?.[activeItemIndex];

        if (currentItem && currentItem.id && !currentItem.seen && currentItem.isAd) {
            markAdAsSeen(currentItem.id)
                .then(response => {
                    if (response.success) {
                        onStorySeen?.(currentItem.id);
                    }
                })
                .catch(error => console.error('Error marking story as seen:', error));
        }
    }, [currentIndex, activeItemIndex, stories, onStorySeen]);

    // Close when clicking the dark backdrop (not the cards)
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose?.();
        }
    };

    const getCardStyle = (i) => {
        const diff = i - currentIndex;
        const sign = Math.sign(diff);
        const absDiff = Math.abs(diff);

        let x = 0;
        if (absDiff > 0) {
            x = sign * (324 + (absDiff - 1) * 248);
        }

        return {
            x,
            scale: absDiff === 0 ? 1 : 0.6,
            zIndex: 10 - absDiff,
            filter: absDiff === 0 ? 'brightness(1)' : 'brightness(0.4)',
            opacity: absDiff > 2 ? 0 : 1
        };
    };

    if (stories.length === 0) return null;

    return (
        <motion.div
            className={styles.storyPreviewWrapper}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={handleBackdropClick}
        >
            <button className={styles.globalCloseBtn} onClick={onClose}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
            </button>

            <div className={styles.sliderContainer}>
                {stories.map((group, i) => {
                    const diff = i - currentIndex;
                    const isActive = diff === 0;

                    const items = group.items || [];
                    const currentItemIndex = isActive ? activeItemIndex : 0;
                    const currentItem = items[currentItemIndex] || {};

                    return (
                        <motion.div
                            key={group.id}
                            className={`${styles.storyCard} ${isActive ? styles.active : ''}`}
                            initial={false}
                            animate={getCardStyle(i)}
                            transition={{ type: "tween", duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
                            onClick={() => !isActive && setCurrentIndex(i)}
                            drag={isActive ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.8}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = offset.x + velocity.x * 0.2;
                                if (swipe < -50) {
                                    handleNextUser();
                                } else if (swipe > 50) {
                                    handlePrevUser();
                                }
                            }}
                        >
                            {currentItem.type === 'video' ? (
                                <video
                                    ref={isActive ? videoRef : null}
                                    src={currentItem.videoUrl || currentItem.image}
                                    className={styles.cardBgImage}
                                    autoPlay={isActive}
                                    muted={isMuted}
                                    playsInline
                                    loop
                                    draggable={false}
                                />
                            ) : (
                                <img src={currentItem.image} alt="story" className={styles.cardBgImage} draggable={false} />
                            )}

                            {isActive && (
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', zIndex: 2 }}>
                                    <div style={{ flex: 1 }} onClick={handlePrevItem} />
                                    <div style={{ flex: 1 }} onClick={handleNextItem} />
                                </div>
                            )}

                            <AnimatePresence>
                                {!isActive && (
                                    <motion.div
                                        key="inactive"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={styles.inactiveOverlay}
                                    >
                                        <div className={styles.avatarWrapper}>
                                            <div
                                                className={styles.gradientRing}
                                                style={group.seen ? { background: '#444' } : {}}
                                            >
                                                <img src={group.avatar} alt={group.username} className={styles.avatar} draggable={false} />
                                            </div>
                                        </div>
                                        <span className={styles.inactiveUsername}>{group.username}</span>
                                        <span className={styles.inactiveTime}>{currentItem.time}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <AnimatePresence>
                                {isActive && (
                                    <motion.div
                                        key="active"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className={styles.activeContent}
                                    >
                                        <div className={styles.topOverlay} style={{ pointerEvents: 'none' }}>
                                            <div className={styles.progressContainer}>
                                                {items.map((item, idx) => {
                                                    let fillWidth = '0%';
                                                    if (idx < activeItemIndex) fillWidth = '100%';
                                                    else if (idx === activeItemIndex) fillWidth = `${progress}%`;

                                                    return (
                                                        <div key={item.id || idx} className={styles.progressBar}>
                                                            <div className={styles.progressFill} style={{ width: fillWidth }}></div>
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            <div className={styles.activeHeader} style={{ pointerEvents: 'auto' }}>
                                                <div className={styles.userInfo}>
                                                    <img
                                                        src={group.avatar}
                                                        alt="user"
                                                        className={styles.activeAvatar}
                                                        style={{ border: 'none', width: '36px', height: '36px', padding: 0 }}
                                                        draggable={false}
                                                    />
                                                    <span className={styles.activeUsername}>{group.username}</span>
                                                    <span className={styles.activeTime}>{currentItem.time}</span>
                                                </div>
                                                {/* <div className={styles.controls}>
                                                    <button className={styles.iconBtn}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                                                        </svg>
                                                    </button>
                                                    <button className={styles.iconBtn}>
                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                                                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
                                                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
                                                        </svg>
                                                    </button>
                                                </div> */}
                                            </div>
                                        </div>

                                        {currentItem.link && currentItem.link !== '#' && (
                                            <div
                                                className={styles.storyLinkSection}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(currentItem.link, '_blank');
                                                }}
                                            >
                                                <div className={styles.linkContent}>
                                                    <span className={styles.linkText}>{currentItem.linkText || 'Visit Link'}</span>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="9 18 15 12 9 6"></polyline>
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}

                {currentIndex > 0 && (
                    <button className={`${styles.navBtn} ${styles.prevBtn}`} onClick={handlePrevUser}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6"></polyline>
                        </svg>
                    </button>
                )}
                {currentIndex < stories.length - 1 && (
                    <button className={`${styles.navBtn} ${styles.nextBtn}`} onClick={handleNextUser}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
