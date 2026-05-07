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
import DataTable from '@/components/dataTable';


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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalCount, setTotalCount] = useState(0);

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

    const handleCategoryChange = (cat) => {
        if (cat !== categoryTab) {
            setCategoryTab(cat);
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
            if (debouncedSearch.trim()) payload.task_title = debouncedSearch.trim();

            const response = activeTab === 'available'
                ? await getAvailableTasks(payload)
                : await getMySubmissions({
                    limit: pageSize,
                    offset: (currentPage - 1) * pageSize,
                    ... (categoryTab === 'social' ? { is_survey_task: false } : {}),
                    ... (categoryTab === 'surveys' ? { is_survey_task: true } : {}),
                    ... (debouncedSearch.trim() ? { task_title: debouncedSearch.trim() } : {})
                });

            if (response.success) {
                if (activeTab === 'available') {
                    const newItems = response.data?.tasks || [];
                    if (isInitial) {
                        setTasks(newItems);
                    } else {
                        setTasks(prev => [...prev, ...newItems]);
                    }
                    setHasMore(newItems.length === LIMIT);
                } else {
                    const subData = response.data?.submissions || [];
                    setSubmissions(subData);
                    setTotalCount(response.data?.total_count || 0);
                }
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'available') {
            setOffset(0);
            setHasMore(true);
            fetchTasks(0, true);
        } else {
            fetchTasks(0, true);
        }
        if (gridRef.current) {
            gridRef.current.scrollTop = 0;
        }
    }, [activeTab, categoryTab, appliedFilters, debouncedSearch, currentPage, pageSize]);

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

    const displayTasks = tasks.map(mapTaskData);
    const hasData = activeTab === 'available' ? displayTasks.length > 0 : submissions.length > 0;

    const submissionColumns = [
        {
            key: 'sr_no',
            label: 'Sr. No.',
            render: (_, row, index) => (currentPage - 1) * pageSize + index + 1
        },
        {
            key: 'platform.platform_name',
            label: 'Platform',
            render: (val, row) => (
                <div className={styles.platformCell}>
                    {row.platform?.platform_logo_url && (
                        <img src={row.platform.platform_logo_url} alt={val} className={styles.platformLogo} />
                    )}
                    <span title={val}>{val}</span>
                </div>
            )
        },
        {
            key: 'task_title',
            label: 'Task Title',
            render: (val, row) => (
                <div className={styles.titleCell} title={val}>
                    {row.task_for_prime_user && (
                        <div className={styles.titleProIcon}>
                            <ProIcon />
                        </div>
                    )}
                    <span>{val}</span>
                </div>
            )
        },
        {
            key: 'is_survey_task',
            label: 'Type',
            render: (val) => val ? 'Survey' : 'Social'
        },
        {
            key: 'reward',
            label: 'Reward',
            render: (_, row) => {
                const isCashbackPoint = row.earning_type === 'CASHBACKPOINT';
                const amount = isCashbackPoint
                    ? row.task_performance_cashpoints_amount_earned
                    : row.task_performance_real_amount_earned;
                return (
                    <div className={styles.tableReward}>
                        {isCashbackPoint ? (
                            <span className={styles.coinText}>{amount} CB</span>
                        ) : (
                            <span className={styles.rupeeText}>₹ {amount}</span>
                        )}
                    </div>
                );
            }
        },
        {
            key: 'created_at',
            label: 'Date',
            render: (val) => {
                if (!val) return '-';
                const d = new Date(val);
                const day = String(d.getDate()).padStart(2, '0');
                const month = String(d.getMonth() + 1).padStart(2, '0');
                const year = d.getFullYear();
                let hours = d.getHours();
                const minutes = String(d.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                hours = hours % 12;
                hours = hours ? hours : 12;
                const hoursStr = String(hours).padStart(2, '0');
                return `${day}-${month}-${year} | ${hoursStr}:${minutes} ${ampm}`;
            }
        },
        {
            key: 'task_status',
            label: 'Status',
            render: (val) => {
                const status = val?.toLowerCase();
                return (
                    <div className={styles.statusActive}>
                        <div className={`${styles.dot} ${status === 'approved' ? styles.greenDot :
                            status === 'pending' || status === 'review' ? styles.yellowDot :
                                styles.redDot
                            }`}></div>
                        {val || 'Pending'}
                    </div>
                )
            }
        },
        {
            key: 'actions',
            label: 'Actions',
            render: (_, row) => (
                <button
                    className={styles.tableActionBtn}
                    onClick={() => {
                        const taskData = mapSubmissionData(row);
                        setSelectedTask(taskData);
                        if (taskData.is_survey) {
                            setIsSurveyDrawerOpen(true);
                        } else {
                            setIsDrawerOpen(true);
                        }
                    }}
                >
                    View Details
                </button>
            )
        }
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
                            <button className={categoryTab === 'all' ? styles.active : ''} onClick={() => handleCategoryChange('all')}>All Tasks</button>
                            <button className={categoryTab === 'social' ? styles.active : ''} onClick={() => handleCategoryChange('social')}>Social Tasks</button>
                            <button className={categoryTab === 'surveys' ? styles.active : ''} onClick={() => handleCategoryChange('surveys')}>Surveys</button>
                        </div>
                        <button className={styles.filterBtn} onClick={() => setIsFilterOpen(true)}>
                            <FilterIcon />
                            Filter
                        </button>
                    </div>
                </div>

                <div className={activeTab === 'available' ? styles.taskGrid : styles.tableView} ref={gridRef} onScroll={activeTab === 'available' ? handleScroll : undefined}>
                    {activeTab === 'available' && !hasData && !loading ? (
                        <div className={styles.emptyState}>No Data Found.</div>
                    ) : activeTab === 'available' ? (
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
                    ) : (
                        <DataTable
                            columns={submissionColumns}
                            data={submissions}
                            loading={loading}
                            totalItems={totalCount}
                            totalPages={Math.ceil(totalCount / pageSize)}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            onPageChange={(p) => setCurrentPage(p)}
                            onPageSizeChange={(s) => {
                                setPageSize(s);
                                setCurrentPage(1);
                            }}
                        />
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
