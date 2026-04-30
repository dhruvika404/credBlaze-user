'use client'
import React, { useState, useEffect } from 'react'
import styles from './tasks.module.scss'
import SearchIcon from '@/icons/searchIcon'
import FilterIcon from '@/icons/filterIcon'
import TaskDrawer from '@/components/modal/taskDrawer';
import FilterDrawer from '@/components/modal/filterDrawer';
import ProIcon from '@/icons/proIcon';
import { getAvailableTasks, getMySubmissions } from '@/services/task';

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState('available');
    const [categoryTab, setCategoryTab] = useState('social');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});

    useEffect(() => {
        if (activeTab === 'available') {
            fetchAvailableTasks();
        } else {
            fetchMySubmissions();
        }
    }, [activeTab, categoryTab, searchQuery, appliedFilters]);

    const fetchAvailableTasks = async () => {
        try {
            setLoading(true);
            
            const filters = {
                ...appliedFilters,
                search: searchQuery,
                category: categoryTab === 'social' ? 'social' : 
                         categoryTab === 'surveys' ? 'surveys' : 
                         categoryTab === 'reviews' ? 'reviews' : undefined
            };
            
            const response = await getAvailableTasks(filters);
            if (response.success) {
                setTasks(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMySubmissions = async () => {
        try {
            setLoading(true);
            const response = await getMySubmissions();
            if (response.success) {
                setSubmissions(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Map API data to component format
    const mapTaskData = (task) => ({
        id: task.id,
        title: task.task_title,
        description: task.task_description,
        reward: task.task_cost_per_user,
        rewardType: task.task_cost_per_user_type === 'CASHBACKPOINT' ? 'coin' : 'rupee',
        isPrime: task.task_for_prime_user,
        image: task.platform?.platform_logo_url,
        category: 'social',
        taskUrl: task.task_url,
        taskBanner: task.task_banner,
        termsAndConditions: task.task_term_and_condition,
        screenshotRequired: task.task_screenshot_required,
        performanceLinkRequired: task.task_performance_link_required,
        manualApprovalRequired: task.task_manual_apprval_required,
        platformName: task.platform?.platform_name,
        categoryName: task.category?.category_name,
        surveys: task.surveys || [],
        rawData: task
    });

    const mapSubmissionData = (submission) => {
        return {
            id: submission.id,
            taskCampaignId: submission.task_campaign_id,
            title: submission.task_title || 'Task',
            description: submission.task_description || '',
            reward: submission.task_performance_real_amount_earned || submission.task_performance_cashpoints_amount_earned || 0,
            rewardType: submission.task_performance_cashpoints_amount_earned > 0 ? 'coin' : 'rupee',
            isPrime: false,
            image: submission.platform?.platform_logo_url,
            taskBanner: submission.task_banner,
            taskUrl: submission.task_performance_url,
            status: submission.task_status, // pending, approved, rejected
            submittedAt: submission.created_at,
            media: submission.media || [],
            earnedAmount: submission.task_performance_real_amount_earned,
            earnedPoints: submission.task_performance_cashpoints_amount_earned,
            platformName: submission.platform?.platform_name,
            isSubmission: true,
            rawData: submission
        };
    };

    const displayTasks = activeTab === 'available' 
        ? tasks.map(mapTaskData)
        : submissions.map(mapSubmissionData);

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
                    {loading ? (
                        <div className={styles.loadingState}>Loading tasks...</div>
                    ) : displayTasks.length === 0 ? (
                        <div className={styles.emptyState}>No tasks available</div>
                    ) : (
                        displayTasks.map((task) => (
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
                        ))
                    )}
                </div>
            </div>

            <TaskDrawer
                isOpen={isDrawerOpen}
                onClose={() => {
                    setIsDrawerOpen(false);
                }}
                task={selectedTask}
                onTaskSubmitted={() => {
                    if (activeTab === 'available') {
                        fetchAvailableTasks();
                    } else {
                        fetchMySubmissions();
                    }
                }}
            />
            <FilterDrawer
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                initialFilters={appliedFilters}
                onApplyFilters={(filters) => {
                    setAppliedFilters(filters);
                }}
            />
        </div>
    );
}
