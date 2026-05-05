'use client'
import React, { useState, useEffect, useRef } from 'react'
import styles from './tasks.module.scss'
import SearchIcon from '@/icons/searchIcon'
import FilterIcon from '@/icons/filterIcon'
import TaskDrawer from '@/components/modal/taskDrawer';
import SurveyDrawer from '@/components/modal/surveyDrawer';
import FilterDrawer from '@/components/modal/filterDrawer';
import ProIcon from '@/icons/proIcon';
import { getAvailableTasks, getMySubmissions } from '@/services/task';

export default function TasksPage() {
    const [activeTab, setActiveTab] = useState('available');
    const [categoryTab, setCategoryTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');

    useEffect(() => {
        const timer = setTimeout(() => setDebouncedSearch(searchQuery), 300);
        return () => clearTimeout(timer);
    }, [searchQuery]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [isSurveyDrawerOpen, setIsSurveyDrawerOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [appliedFilters, setAppliedFilters] = useState({});
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const gridRef = useRef(null);
    const LIMIT = 30;

    const handleTabChange = (tab) => {
        if (tab !== activeTab) {
            setActiveTab(tab);
            setCategoryTab('all');
            setAppliedFilters({});
            setSearchQuery('');
            setDebouncedSearch('');
        }
    };

    const fetchTasks = async (newOffset = 0, isInitial = false) => {
        try {
            setLoading(true);
            const payload = {
                limit: LIMIT,
                offset: newOffset,
            };
            if (categoryTab === 'social') payload.is_survey_task = false;
            if (categoryTab === 'surveys') payload.is_survey_task = true;
            if (appliedFilters.platforms?.length) payload.platform_ids = appliedFilters.platforms;
            if (appliedFilters.taskTypes?.length) payload.category_ids = appliedFilters.taskTypes;
            if (appliedFilters.minPrice) payload.min_task_cost = Number(appliedFilters.minPrice);
            if (appliedFilters.maxPrice) payload.max_task_cost = Number(appliedFilters.maxPrice);
            if (appliedFilters.pro && !appliedFilters.nonPro) payload.is_prime = true;
            if (appliedFilters.nonPro && !appliedFilters.pro) payload.is_prime = false;

            const response = activeTab === 'available'
                ? await getAvailableTasks(payload)
                : await getMySubmissions(payload);

            if (response.success) {
                const rawData = activeTab === 'available' ? response.data?.tasks : response.data?.submissions;
                const newItems = rawData || [];

                if (isInitial) {
                    if (activeTab === 'available') setTasks(newItems);
                    else setSubmissions(newItems);
                } else {
                    if (activeTab === 'available') setTasks(prev => [...prev, ...newItems]);
                    else setSubmissions(prev => [...prev, ...newItems]);
                }
                setHasMore(newItems.length === LIMIT);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setOffset(0);
        setHasMore(true);
        fetchTasks(0, true);
        if (gridRef.current) {
            gridRef.current.scrollTop = 0;
        }
    }, [activeTab, categoryTab, appliedFilters]);

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 100 && !loading && hasMore) {
            const nextOffset = offset + LIMIT;
            setOffset(nextOffset);
            fetchTasks(nextOffset, false);
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
        is_survey: task.is_survey_task || false,
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
        const isCashbackPoint = submission.earning_type === 'CASHBACKPOINT';
        return {
            id: submission.id,
            taskCampaignId: submission.task_campaign_id,
            title: submission.task_title,
            description: submission.task_description,
            reward: isCashbackPoint
                ? (submission.task_performance_cashpoints_amount_earned || 0)
                : (submission.task_performance_real_amount_earned || 0),
            rewardType: isCashbackPoint ? 'coin' : 'rupee',
            earning_type: submission.earning_type,
            isPrime: submission.task_for_prime_user || false,
            image: submission.platform?.platform_logo_url,
            is_survey: submission.is_survey_task || false,
            taskBanner: submission.task_banner,
            taskUrl: submission.task_performance_url,
            status: submission.task_status,
            submittedAt: submission.created_at,
            media: submission.media || [],
            earnedAmount: submission.task_performance_real_amount_earned,
            earnedPoints: submission.task_performance_cashpoints_amount_earned,
            task_performance_real_amount_earned: submission.task_performance_real_amount_earned,
            task_performance_cashpoints_amount_earned: submission.task_performance_cashpoints_amount_earned,
            platformName: submission.platform?.platform_name,
            isSubmission: true,
            rawData: submission
        };
    };

    useEffect(() => {
        if (typeof window !== 'undefined' && tasks.length > 0) {
            const urlParams = new URLSearchParams(window.location.search);
            const taskId = urlParams.get('taskId');
            if (taskId) {
                const foundTaskRaw = tasks.find(t => t.id === taskId);
                if (foundTaskRaw) {
                    setSelectedTask(mapTaskData(foundTaskRaw));
                    setIsDrawerOpen(true);
                    window.history.replaceState({}, '', window.location.pathname);
                }
            }
        }
    }, [tasks]);

    const allDisplayTasks = activeTab === 'available'
        ? tasks.map(mapTaskData)
        : submissions.map(mapSubmissionData);

    const displayTasks = debouncedSearch.trim()
        ? allDisplayTasks.filter(t => t.title?.toLowerCase().includes(debouncedSearch.toLowerCase()))
        : allDisplayTasks;

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
                        onClick={() => handleTabChange('available')}
                    >
                        Available Tasks
                    </button>
                    <button
                        className={activeTab === 'my' ? styles.active : ''}
                        onClick={() => handleTabChange('my')}
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
                            <button className={categoryTab === 'all' ? styles.active : ''} onClick={() => setCategoryTab('all')}>All Tasks</button>
                            <button className={categoryTab === 'social' ? styles.active : ''} onClick={() => setCategoryTab('social')}>Social Tasks</button>
                            <button className={categoryTab === 'surveys' ? styles.active : ''} onClick={() => setCategoryTab('surveys')}>Surveys</button>
                        </div>
                        <button className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
                            <FilterIcon />
                            Filter
                        </button>
                    </div>
                </div>

                <div className={styles.taskGrid} ref={gridRef} onScroll={handleScroll}>
                    {displayTasks.length === 0 && !loading ? (
                        <div className={styles.emptyState}>No tasks available</div>
                    ) : (
                        <>
                            {displayTasks.map((task) => (
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
                                        <h3>{task.title || '-'}</h3>
                                        <p>{task.description || '-'}</p>
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
                                                if (task.is_survey) {
                                                    setIsSurveyDrawerOpen(true);
                                                } else {
                                                    setIsDrawerOpen(true);
                                                }
                                            }}
                                        >
                                            View
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
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
                    fetchTasks(0, true);
                }}
            />
            <SurveyDrawer
                isOpen={isSurveyDrawerOpen}
                onClose={() => {
                    setIsSurveyDrawerOpen(false);
                }}
                task={selectedTask}
                onTaskSubmitted={() => {
                    fetchTasks(0, true);
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
