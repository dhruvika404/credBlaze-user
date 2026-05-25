'use client';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './authSlider.module.scss';
import { getDynamicImages } from '@/services/dynamicImages';


const variants = {
    enter: (direction) => {
        return {
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0
        };
    },
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => {
        return {
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        };
    }
};

export default function AuthSlider() {
    const [slides, setSlides] = useState([]);
    const [[page, direction], setPage] = useState([0, 0]);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const res = await getDynamicImages('ONBOARDING');
                if (res.success && Array.isArray(res.data) && res.data.length > 0) {
                    const activeImages = res.data.filter(item => item.is_active === true);
                    const sortedData = [...activeImages].sort((a, b) => (a.sequence || 0) - (b.sequence || 0));
                    const mappedSlides = sortedData.map(item => ({
                        id: item.id,
                        image: item.image_url,
                        title: item.title || '',
                    }));
                    setSlides(mappedSlides);
                }
            } catch (error) {
                console.error('Error fetching onboarding images:', error);
            }
        };
        fetchImages();
    }, []);

    useEffect(() => {
        if (slides.length === 0) return;

        const timer = setInterval(() => {
            setPage((prev) => [prev[0] + 1, 1]);
        }, 3000);

        return () => clearInterval(timer);
    }, [page, slides.length]);

    if (!slides || slides.length === 0) {
        return null;
    }

    const wrappedIndex = ((page % slides.length) + slides.length) % slides.length;

    const handleDotClick = (idx) => {
        const diff = idx - wrappedIndex;
        if (diff === 0) return;
        const dir = diff > 0 ? 1 : -1;
        setPage([page + diff, dir]);
    };

    const slide = slides[wrappedIndex];

    return (
        <div className={styles.authSlider}>
            <AnimatePresence initial={false} custom={direction}>
                <motion.div
                    key={page}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: "tween", ease: "easeInOut", duration: 0.6 },
                        opacity: { duration: 0.6 }
                    }}
                    className={styles.slide}
                >
                    <div className={styles.imageWrapper}>
                        {slide?.image ? (
                            <img src={slide?.image} alt={slide?.title || 'Slide'} className={styles.image} />
                        ) : (
                            <div className={styles.placeholderImg}>
                                <div className={styles.coupon}>%</div>
                                <div className={styles.gift}>🎁</div>
                            </div>
                        )}
                    </div>
                    <div className={styles.bottomContent}>
                        <p className={styles.textContent}>{slide?.title}</p>
                    </div>
                </motion.div>
            </AnimatePresence>

            <div className={styles.pagination}>
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={classNames(styles.dot, {
                            [styles.active]: wrappedIndex === idx
                        })}
                        onClick={() => handleDotClick(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
