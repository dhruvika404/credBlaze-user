'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './adsCard.module.scss';
import { getBannerAds } from '@/services/ads';

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
    }),
    center: {
        x: 0,
        opacity: 1,
    },
    exit: (direction) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0,
    }),
};

export default function AdsCard() {
    const [adsSlides, setAdsSlides] = useState([]);
    const [[page, direction], setPage] = useState([0, 1]);

    const activeIndex = adsSlides.length > 0 ? (((page % adsSlides.length) + adsSlides.length) % adsSlides.length) : 0;

    const paginate = useCallback((newDirection) => {
        setPage((prev) => [prev[0] + newDirection, newDirection]);
    }, []);

    const handleDotClick = (idx) => {
        const diff = idx - activeIndex;
        if (diff === 0) return;
        setPage([page + diff, diff > 0 ? 1 : -1]);
    };

    useEffect(() => {
        const fetchAds = async () => {
            try {
                const response = await getBannerAds();
                if (response.success && response.data) {
                    let allAds = [];
                    if (Array.isArray(response.data)) {
                        if (response.data.length > 0 && response.data[0].ads) {
                            response.data.forEach(client => {
                                if (client.ads && Array.isArray(client.ads)) {
                                    client.ads.forEach(ad => {
                                        allAds.push({
                                            id: ad.id,
                                            image: ad.ad_file,
                                            link: ad.destination_link
                                        });
                                    });
                                }
                            });
                        } else {
                            allAds = response.data.map(ad => ({
                                id: ad.id,
                                image: ad.ad_file,
                                link: ad.destination_link
                            }));
                        }
                    }
                    setAdsSlides(allAds);
                }
            } catch (error) {
                console.error('Error fetching ads:', error);
            }
        };
        fetchAds();
    }, []);

    useEffect(() => {
        if (adsSlides.length <= 1) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 4000);
        return () => clearInterval(timer);
    }, [page, paginate, adsSlides.length]);


    const currentSlide = adsSlides[activeIndex];

    return (
        <div className={styles.adsCardSection}>
            <div className={styles.sliderWrapper}>
                {adsSlides.length > 0 ? (
                    <AnimatePresence initial={false} custom={direction} mode="popLayout">
                        <motion.div
                            key={page}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'tween', ease: 'easeInOut', duration: 0.5 },
                                opacity: { duration: 0.4 },
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.8}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = Math.abs(offset.x) * velocity.x;
                                if (swipe < -5000 || offset.x < -80) {
                                    paginate(1);
                                } else if (swipe > 5000 || offset.x > 80) {
                                    paginate(-1);
                                }
                            }}
                            onTap={() => currentSlide?.link !== '#' && window.open(currentSlide?.link, '_blank')}
                            style={{ cursor: currentSlide?.link !== '#' ? 'pointer' : 'grab' }}
                            className={styles.slide}
                        >
                            <img
                                src={currentSlide?.image}
                                alt={`Ad ${currentSlide?.id}`}
                                draggable={false}
                            />
                        </motion.div>
                    </AnimatePresence>
                ) : (
                    <div className={styles.noAdsPlaceholder}>
                        <span>No ads available</span>
                    </div>
                )}
            </div>

            {adsSlides.length > 0 && (
                <div className={styles.pagination}>
                    {adsSlides.map((_, idx) => (
                        <button
                            key={idx}
                            className={`${styles.dot} ${activeIndex === idx ? styles.active : ''}`}
                            onClick={() => handleDotClick(idx)}
                            aria-label={`Go to ad ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
