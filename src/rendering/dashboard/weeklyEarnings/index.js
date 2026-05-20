'use client';
import React, { useState, useMemo } from 'react';
import styles from './weeklyEarnings.module.scss';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import moment from 'moment';
import FileIcon from '@/icons/fileIcon';

export default function WeeklyEarnings({ overviewData }) {
    const [timeRange, setTimeRange] = useState('weekly');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const activeChartData = useMemo(() => {
        const graph = overviewData?.graph_data;
        if (!graph) return [];

        if (timeRange === 'weekly' && graph.weekly) {
            return graph.weekly.map(item => ({
                day: moment(item.date).format('ddd'),
                value: Number(item.amount || 0)
            }));
        }

        if (timeRange === 'monthly' && graph.monthly) {
            return graph.monthly.map(item => ({
                day: moment(item.date).format('D MMM'),
                value: Number(item.amount || 0)
            }));
        }

        if (timeRange === 'yearly' && graph.yearly) {
            return graph.yearly.map(item => ({
                day: moment(item.date, 'YYYY-MM').format('MMM'),
                value: Number(item.amount || 0)
            }));
        }

        return [];
    }, [timeRange, overviewData]);

    const rangeLabels = {
        'weekly': 'This Week',
        'monthly': 'This Month',
        'yearly': 'This Year'
    };

    return (
        <div className={styles.taskActivity}>
            <div className={styles.statusHeader}>
                <div className={styles.titleArea}>
                    <div className={styles.iconContainer}>
                        <FileIcon />
                    </div>
                    <h2>{timeRange.charAt(0).toUpperCase() + timeRange.slice(1)} Earnings</h2>
                </div>

                <div className={styles.dropdownWrapper}>
                    <button
                        className={styles.dropdownBtn}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.calIcon}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        <span>{rangeLabels[timeRange]}</span>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.arrowIcon}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className={styles.dropdownMenu}>
                            {Object.entries(rangeLabels).map(([key, label]) => (
                                <div
                                    key={key}
                                    className={`${styles.menuItem} ${timeRange === key ? styles.active : ''}`}
                                    onClick={() => {
                                        setTimeRange(key);
                                        setIsDropdownOpen(false);
                                    }}
                                >
                                    {label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.chartArea}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={activeChartData} margin={{ top: 10, right: 15, left: -25, bottom: 0 }}>
                        <defs>
                            <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="-22.22%" stopColor="#593BF2" stopOpacity={0.2} />
                                <stop offset="100%" stopColor="#FFFFFF" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={false} stroke="#F5F5F5" />
                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12, fontFamily: 'Manrope' }}
                            padding={{ left: 10, right: 10 }}
                        />
                        <YAxis hide />
                        <Tooltip
                            contentStyle={{
                                background: '#FFFFFF',
                                border: '1px solid #E6E8EA',
                                borderRadius: '12px',
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
                                fontFamily: 'Manrope',
                                fontSize: '13px'
                            }}
                            labelStyle={{ fontWeight: 600, color: '#171717' }}
                            itemStyle={{ color: '#593BF2' }}
                            formatter={(value) => [`${Number(value).toLocaleString()} CB`, 'Earnings']}
                        />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#0000EE"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#purpleGradient)"
                            dot={{ r: 4, fill: '#0000EE', strokeWidth: 1.5, stroke: '#FFFFFF' }}
                            activeDot={{ r: 6, fill: '#0000EE' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
