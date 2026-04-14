'use client';
import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './authSlider.module.scss';

const slides = [
    {
        id: 1,
        image: '/assets/images/slider1.png',
        text: 'Refer your friends & earn rewards with our Referral Program'
    },
    {
        id: 2,
        image: '/assets/images/slider2.png',
        text: 'Get paid to provide feedback & quality checks an reviews for service'
    },
    {
        id: 3,
        image: '/assets/images/slider3.png',
        text: 'Shop products & redeem your earnings easily in the Shop'
    }
];

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
    const [[page, direction], setPage] = useState([0, 0]);

    // Handle circular indices gracefully
    const wrappedIndex = ((page % slides.length) + slides.length) % slides.length;

    const handleDotClick = (idx) => {
        const diff = idx - wrappedIndex;
        if (diff === 0) return;
        const dir = diff > 0 ? 1 : -1;
        setPage([page + diff, dir]);
    };

    // Autoplay functionality: resets if the user manually changes the slide
    useEffect(() => {
        const timer = setInterval(() => {
            setPage((prev) => [prev[0] + 1, 1]); // Always slide forward on autoplay
        }, 3000);

        return () => clearInterval(timer);
    }, [page]);

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
                        {slide.image ? (
                            <img src={slide.image} alt={`Slide ${slide.id}`} className={styles.image} />
                        ) : (
                            <div className={styles.placeholderImg}>
                                <div className={styles.coupon}>%</div>
                                <div className={styles.gift}>🎁</div>
                            </div>
                        )}
                    </div>
                    <div className={styles.bottomContent}>
                        <p className={styles.textContent}>{slide.text}</p>
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
