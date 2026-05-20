'use client';
import React, { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './recentTasks.module.scss';
import ProIcon from '@/icons/proIcon';
import FileIcon from '@/icons/fileIcon';

const ChevronRightIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.arrowIcon}>
        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export default function RecentTasks({ overviewData, loading }) {
    const router = useRouter();

    const displayTasks = useMemo(() => {
        if (!overviewData?.recent_tasks) return [];
        return overviewData.recent_tasks.slice(0, 3).map(task => ({
            id: task.id,
            title: task.title,
            description: task.description,
            reward: parseFloat(task.reward || 0),
            rewardType: task.reward?.includes('CASHBACKPOINT') ? 'coin' : 'rupee',
            isPrime: false,
            image: '/assets/images/story.png'
        }));
    }, [overviewData?.recent_tasks]);

    const handleTaskClick = () => {
        router.push('/tasks');
    };

    return (
        <div className={styles.recentTasksContainer}>
            {/* Header: Recent Tasks & View All */}
            <div className={styles.header}>
                <div className={styles.titleArea}>
                    <div className={styles.iconBox}>
                        <FileIcon />
                    </div>
                    <span className={styles.title}>Recent Tasks</span>
                </div>

                <button className={styles.viewAllBtn} onClick={() => router.push('/tasks')}>
                    <span>View All</span>
                    <ChevronRightIcon />
                </button>
            </div>

            {/* Content Cards Row */}
            <div className={styles.cardsRow}>
                {loading ? (
                    // Beautiful Shimmer Loaders
                    Array.from({ length: 3 }).map((_, idx) => (
                        <div key={idx} className={`${styles.taskCard} ${styles.shimmerCard}`}>
                            <div className={styles.shimmerHeader}>
                                <div className={styles.shimmerCircle} />
                                <div className={styles.shimmerPill} />
                            </div>
                            <div className={styles.shimmerTitle} />
                            <div className={styles.shimmerDesc} />
                            <div className={styles.shimmerDivider} />
                            <div className={styles.shimmerFooter}>
                                <div className={styles.shimmerPillSmall} />
                                <div className={styles.shimmerButton} />
                            </div>
                        </div>
                    ))
                ) : displayTasks.length === 0 ? (
                    <div className={styles.emptyState}>No available tasks found. Check back later!</div>
                ) : (
                    displayTasks.map((task) => (
                        <div key={task.id} className={styles.taskCard}>
                            <div className={styles.cardHeader}>
                                <img
                                    src={task.image}
                                    alt={task.title}
                                    className={styles.taskImage}
                                    onError={(e) => { e.target.src = '/assets/images/story.png'; }}
                                />
                                {task.isPrime && (
                                    <div className={styles.proBadge}>
                                        <ProIcon />
                                        <span>Pro Task</span>
                                    </div>
                                )}
                            </div>

                            <div className={styles.cardBody}>
                                <h3>{task.title || '-'}</h3>
                                <p>{task.description || '-'}</p>
                            </div>

                            <div className={styles.divider} />

                            <div className={styles.cardFooter}>
                                <div className={styles.reward}>
                                    <div className={styles.rewardIcon}>
                                        <img src="/assets/icons/star.svg" alt="reward" />
                                    </div>
                                    <span>
                                        {task.reward} {task.rewardType === 'coin' ? 'CB' : 'Points'}
                                    </span>
                                </div>
                                <button className={styles.viewBtn} onClick={handleTaskClick}>
                                    View
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
