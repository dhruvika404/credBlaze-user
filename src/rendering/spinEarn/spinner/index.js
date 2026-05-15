'use client';
import React, { useState, useRef, useCallback, useEffect } from 'react';
import styles from './spinner.module.scss';
import SpinMeterIcon from '@/icons/spinMeterIcon';

const LIGHT_COUNT = 16;

function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = (angleDeg - 90) * (Math.PI / 180);
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(cx, cy, r, startAngle, endAngle) {
    const start = polarToCartesian(cx, cy, r, endAngle);
    const end = polarToCartesian(cx, cy, r, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 0 ${end.x} ${end.y} Z`;
}

const DEFAULT_SEGMENTS = [
    { id: 1, label: '10', color: 'silver' },
    { id: 2, label: '20', color: 'blue' },
    { id: 3, label: '30', color: 'silver' },
    { id: 4, label: '40', color: 'blue' },
    { id: 5, label: '50', color: 'silver' },
    { id: 6, label: '60', color: 'blue' },
    { id: 7, label: '70', color: 'silver' },
    { id: 8, label: '80', color: 'blue' },
];

const Spinner = React.forwardRef(({ segments = DEFAULT_SEGMENTS }, ref) => {
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [stopping, setStopping] = useState(false);
    const [lightsOn, setLightsOn] = useState(true);
    const [spinDuration, setSpinDuration] = useState(15);
    const wheelRef = useRef(null);
    const requestRef = useRef(null);

    const animate = useCallback(() => {
        setRotation(prev => prev + 10); // Adjust speed here (degrees per frame)
        requestRef.current = requestAnimationFrame(animate);
    }, []);

    const startSpin = useCallback(() => {
        if (spinning) return;
        setSpinning(true);
        setStopping(false);
        setLightsOn(true);
        // Start indefinite rotation using requestAnimationFrame to keep 'rotation' accurate
        requestRef.current = requestAnimationFrame(animate);
    }, [spinning, animate]);

    const stopSpin = useCallback((targetIndex, onFinished, isError = false) => {
        if (requestRef.current) {
            cancelAnimationFrame(requestRef.current);
            requestRef.current = null;
        }

        setStopping(true);
        const duration = isError ? 2 : 15;
        setSpinDuration(duration);
        const segAngle = 360 / (segments.length || 1);

        // At this point, 'rotation' is the actual visual angle.
        // We want (finalRotation % 360) = 360 - (targetIndex + 0.5) * segAngle
        const currentAngle = rotation % 360;
        const targetPos = (360 - (targetIndex * segAngle) - (segAngle / 2)) % 360;

        // Calculate how many more degrees to reach targetPos, adding some full spins for duration
        const extraSpins = isError ? 1 : 10;
        const diff = (targetPos - currentAngle + 360) % 360;
        const finalRotation = rotation + diff + (extraSpins * 360);

        setRotation(finalRotation);

        setTimeout(() => {
            setSpinning(false);
            setStopping(false);
            if (onFinished) onFinished();
            setTimeout(() => setLightsOn(false), 2000);
        }, duration * 1000);
    }, [rotation, segments]);

    useEffect(() => {
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    React.useImperativeHandle(ref, () => ({
        startSpin,
        stopSpin
    }));

    const segAngle = 360 / (segments.length || 1);
    const cx = 200, cy = 200, radius = 175;

    const splitLabel = (label) => {
        if (!label) return [];
        const threshold = segments.length <= 4 ? 14 : 10;

        if (label.length <= threshold) return [label];

        const words = label.trim().split(/\s+/);
        if (words.length <= 1) return [label];

        const mid = Math.ceil(words.length / 2);
        return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    };

    return (
        <div className={styles.wheelContainer}>
            <div className={styles.outerRing}>
                {Array.from({ length: LIGHT_COUNT }).map((_, i) => {
                    const angle = (360 / LIGHT_COUNT) * i;
                    const rad = (angle - 90) * (Math.PI / 180);
                    const lightRadius = 196;
                    const lx = 50 + (lightRadius / 200) * 50 * Math.cos(rad);
                    const ly = 50 + (lightRadius / 200) * 50 * Math.sin(rad);
                    return (
                        <div
                            key={i}
                            className={`${styles.light} ${lightsOn || spinning ? (i % 2 === 0 ? styles.lightOn : styles.lightOnAlt) : ''}`}
                            style={{
                                left: `${lx}%`,
                                top: `${ly}%`,
                            }}
                        />
                    );
                })}
            </div>
            <svg
                ref={wheelRef}
                className={styles.wheelSvg}
                viewBox="0 0 400 400"
                style={{
                    transform: `rotate(${rotation}deg)`,
                    transition: stopping ? `transform ${spinDuration}s cubic-bezier(0.15, 0, 0.15, 1)` : 'none',
                }}
            >
                <defs>
                    <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#1447E6" />
                        <stop offset="100%" stopColor="#2B5BF0" />
                    </linearGradient>
                    <linearGradient id="silverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#E8EAF0" />
                        <stop offset="100%" stopColor="#D0D4DE" />
                    </linearGradient>
                    <filter id="segShadow">
                        <feDropShadow dx="0" dy="1" stdDeviation="1" floodOpacity="0.15" />
                    </filter>
                </defs>

                {/* Segments */}
                {segments.map((seg, i) => {
                    const startAngle = i * segAngle;
                    const endAngle = startAngle + segAngle;
                    const path = describeArc(cx, cy, radius, startAngle, endAngle);
                    const midAngle = startAngle + segAngle / 2;
                    const textR = radius * 0.68;
                    const textPos = polarToCartesian(cx, cy, textR, midAngle);
                    const isBlue = i % 2 !== 0;
                    const lines = splitLabel(seg.label);

                    return (
                        <g key={seg.id || i}>
                            <path
                                d={path}
                                fill={isBlue ? 'url(#blueGrad)' : 'url(#silverGrad)'}
                                stroke="#2a2a4a"
                                strokeWidth="0.5"
                                filter="url(#segShadow)"
                            />
                            <text
                                x={textPos.x}
                                y={textPos.y}
                                fill={isBlue ? '#FFFFFF' : '#1a1a2e'}
                                fontSize={segments.length <= 4 ? "18" : (segments.length > 8 ? "12" : "14")}
                                fontWeight="700"
                                fontFamily="var(--font-manrope), sans-serif"
                                textAnchor="middle"
                                dominantBaseline="central"
                                transform={`rotate(${midAngle + 90}, ${textPos.x}, ${textPos.y})`}
                            >
                                {lines.map((line, idx) => (
                                    <tspan
                                        key={idx}
                                        x={textPos.x}
                                        dy={idx === 0 ? (lines.length > 1 ? "-0.6em" : "0") : "1.2em"}
                                    >
                                        {line}
                                    </tspan>
                                ))}
                            </text>
                        </g>
                    );
                })}
            </svg>
            <div className={styles.meterIcon}>
                <SpinMeterIcon />
            </div>
        </div>
    );
});

export default Spinner;
