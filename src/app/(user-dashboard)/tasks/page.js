'use client'
import React, { useState } from 'react'
import styles from './tasks.module.scss'
import SearchIcon from '@/icons/searchIcon'
import FilterIcon from '@/icons/filterIcon'
import TaskDrawer from '@/components/modal/taskDrawer';
import FilterDrawer from '@/components/modal/filterDrawer';
import ProIcon from '@/icons/proIcon';

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState('available');
    const [categoryTab, setCategoryTab] = useState('social');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const tasks = [
        { id: 1, title: 'Like Our Facebook Page', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: false, image: '/assets/platforms/facebook.svg', category: 'social' },
        { id: 2, title: 'Follow Us on Instagram', description: 'Visit our Facebook page and give us a like to suppo...', reward: 800, rewardType: 'rupee', isPrime: false, image: '/assets/platforms/instagram.svg', category: 'social' },
        { id: 3, title: 'Subscribe to YouTube Channel', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: true, image: '/assets/platforms/utube.svg', category: 'social' },
        { id: 4, title: 'Like Our Facebook Page', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: true, image: '/assets/platforms/facebook.svg', category: 'social' },
        { id: 5, title: 'Subscribe to YouTube Channel', description: 'Visit our Facebook page and give us a like to suppo...', reward: 800, rewardType: 'rupee', isPrime: false, image: '/assets/platforms/utube.svg', category: 'social' },
        { id: 6, title: 'Follow Us on Instagram', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: false, image: '/assets/platforms/instagram.svg', category: 'social' },
        { id: 7, title: 'Subscribe to YouTube Channel', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: false, image: '/assets/platforms/utube.svg', category: 'social' },
        { id: 8, title: 'Follow Us on Instagram', description: 'Visit our Facebook page and give us a like to suppo...', reward: 800, rewardType: 'rupee', isPrime: false, image: '/assets/platforms/instagram.svg', category: 'social' },
        { id: 9, title: 'Like Our Facebook Page', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: true, image: '/assets/platforms/facebook.svg', category: 'social' },
        { id: 10, title: 'Subscribe to YouTube Channel', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: false, image: '/assets/platforms/utube.svg', category: 'social' },
        { id: 11, title: 'Follow Us on Instagram', description: 'Visit our Facebook page and give us a like to suppo...', reward: 800, rewardType: 'rupee', isPrime: false, image: '/assets/platforms/instagram.svg', category: 'social' },
        { id: 12, title: 'Like Our Facebook Page', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: true, image: '/assets/platforms/facebook.svg', category: 'social' },
        { id: 13, title: 'Subscribe to YouTube Channel', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: false, image: '/assets/platforms/utube.svg', category: 'social' },
        { id: 14, title: 'Follow Us on Instagram', description: 'Visit our Facebook page and give us a like to suppo...', reward: 800, rewardType: 'rupee', isPrime: false, image: '/assets/platforms/instagram.svg', category: 'social' },
        { id: 15, title: 'Like Our Facebook Page', description: 'Visit our Facebook page and give us a like to suppo...', reward: 50, rewardType: 'coin', isPrime: true, image: '/assets/platforms/facebook.svg', category: 'social' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.headerSection}>
                <div className={styles.titleInfo}>
                    <h1>Available Tasks</h1>
                    <p>Complete tasks and earn coins.</p>
                </div>
                <div className={styles.mainTabs}>
                    <button
                        className={activeTab === 'available' ? styles.active : ''}
                        onClick={() => setActiveTab('available')}
                    >
                        Available Tasks
                    </button>
                    <button
                        className={activeTab === 'my' ? styles.active : ''}
                        onClick={() => setActiveTab('my')}
                    >
                        My Task
                    </button>
                </div>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.filterBar}>
                    <div className={styles.searchBox}>
                        <SearchIcon />
                        <input
                            type="text"
                            placeholder="Search Task..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className={styles.rightControls}>
                        <div className={styles.categoryTabs}>
                            <button className={categoryTab === 'social' ? styles.active : ''} onClick={() => setCategoryTab('social')}>Social Tasks</button>
                            <button className={categoryTab === 'reviews' ? styles.active : ''} onClick={() => setCategoryTab('reviews')}>Reviews and ratings</button>
                            <button className={categoryTab === 'surveys' ? styles.active : ''} onClick={() => setCategoryTab('surveys')}>Surveys</button>
                        </div>
                        <button className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
                            <FilterIcon />
                            Filter
                        </button>
                    </div>
                </div>

                <div className={styles.taskGrid}>
                    {tasks.map((task) => (
                        <div key={task.id} className={styles.taskCard}>
                            <div className={styles.cardHeader}>
                                <img src={task.image} alt={task.title} className={styles.taskImage} />
                                {task.isPrime && (
                                    <div className={styles.proBadge}>
                                        <ProIcon />
                                        <span>Pro Task</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.cardBody}>
                                <h3>{task.title}</h3>
                                <p>{task.description}</p>
                            </div>
                            <div className={styles.divider} />
                            <div className={styles.cardFooter}>
                                <div className={styles.reward}>
                                    {task.rewardType === 'coin' ? (
                                        <>
                                            <div className={styles.rewardIcon}>
                                                <img src="/assets/icons/star.svg" alt="reward" />
                                            </div>
                                            <span>{task.reward} CB</span>
                                        </>
                                    ) : (
                                        <span>₹ {task.reward}</span>
                                    )}
                                </div>
                                <button
                                    className={styles.viewBtn}
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setIsDrawerOpen(true);
                                    }}
                                >
                                    View
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <TaskDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                task={selectedTask}
            />
            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
            />
        </div>
    );
}
