'use client';

import React, { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import moment from 'moment';
import styles from './support-tickets.module.scss';
import Button from '@/components/button';
import DataTable from '@/components/dataTable';
import { useAuth } from '@/context/AuthContext';
import { getSupportTickets } from '@/services/supportTicket';
import CreateTicketModal from '@/components/modal/supportTicketModal/CreateTicketModal';
import TicketDetailsModal from '@/components/modal/supportTicketModal/TicketDetailsModal';

const ListviewIcon = () => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#020204" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
);

export default function SupportTicketPage() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [sort, setSort] = useState({
        key: 'created_at',
        direction: 'desc'
    });

    const fetchTickets = useCallback(async (currentSelectedId = null) => {
        if (!user?.user_id) return;
        try {
            setLoading(true);
            const offset = (pagination.page - 1) * pagination.limit;
            let sortByValue = 'date_desc';
            if (sort.key === 'created_at') {
                sortByValue = sort.direction === 'asc' ? 'date_asc' : 'date_desc';
            } else if (sort.key === 'status') {
                sortByValue = sort.direction === 'asc' ? 'status_asc' : 'status_desc';
            }

            const params = {
                limit: pagination.limit,
                offset,
                sort_by: [sortByValue]
            };

            const res = await getSupportTickets(user?.user_id, params);
            if (res?.success) {
                const resultData = res.data;
                const fetchedTickets = resultData.tickets || res.data || [];
                const finalTickets = Array.isArray(fetchedTickets) ? fetchedTickets : [];
                setTickets(finalTickets);

                const totalCount = resultData.total_count || finalTickets.length || 0;
                setPagination(prev => ({
                    ...prev,
                    total: totalCount,
                    totalPages: Math.ceil(totalCount / prev.limit)
                }));

                if (currentSelectedId) {
                    const updated = finalTickets.find(t => t.id === currentSelectedId);
                    if (updated) {
                        setSelectedTicket(updated);
                    }
                }
            } else {
                setTickets([]);
            }
        } catch (err) {
            toast.error('Failed to fetch support tickets.');
        } finally {
            setLoading(false);
        }
    }, [user?.user_id, pagination.page, pagination.limit, sort.key, sort.direction]);

    useEffect(() => {
        if (user?.user_id) {
            fetchTickets();
        }
    }, [user?.user_id, fetchTickets]);

    const handleSort = (key) => {
        setSort(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
        }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const handleViewDetails = (ticket) => {
        setSelectedTicket(ticket);
        setIsDetailsOpen(true);
    };

    const handleCloseDetails = () => {
        setIsDetailsOpen(false);
        setSelectedTicket(null);
    };

    const handleOpenCreate = () => {
        setIsCreateOpen(true);
    };

    const handleCloseCreate = () => {
        setIsCreateOpen(false);
    };

    const columns = [
        { key: 'sno', label: 'Sr.No', render: (_, __, index) => (pagination.page - 1) * pagination.limit + index + 1 },
        { key: 'id', label: 'Ticket ID' },
        { key: 'Subject', label: 'Subject' },
        {
            key: 'status',
            label: 'Status',
            isSorting: true,
            render: (val) => {
                const status = val?.toLowerCase();
                const displayStatus = status === 'submit' ? 'Submitted' : status === 'open' ? 'Open' : status?.startsWith('close') ? 'Closed' : status;
                const dotClass = (status === 'submit' || status === 'open') ? styles.greenDot : styles.redDot;
                return (
                    <div className={styles.statusActive}>
                        <div className={`${styles.dot} ${dotClass}`}></div>
                        <span style={{ textTransform: 'capitalize' }}>{displayStatus}</span>
                    </div>
                );
            }
        },
        {
            key: 'created_at',
            label: 'Created At',
            isSorting: true,
            render: (val) => moment.utc(val).local().format('YYYY-MM-DD hh:mm A')
        },
        {
            key: 'action',
            label: 'Action',
            render: (_, row) => (
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <button className={styles.actionBtn} onClick={() => handleViewDetails(row)}>
                        View & Reply
                    </button>
                </div>
            )
        }
    ];

    return (
        <div className={styles.supportTicketPage}>
            <div className={styles.supportTicketContent}>
                <div className={styles.tableHeader}>
                    <div className={styles.titleInfo}>
                        <div className={styles.icon}>
                            <ListviewIcon />
                        </div>
                        <span>Support Ticket Log</span>
                    </div>
                    <div className={styles.rightControls}>
                        <div className={styles.createBtnWrapper}>
                            <Button
                                text="Create Ticket"
                                onClick={handleOpenCreate}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <DataTable
                        columns={columns}
                        data={tickets}
                        loading={loading}
                        totalItems={pagination.total}
                        totalPages={pagination.totalPages}
                        currentPage={pagination.page}
                        pageSize={pagination.limit}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        onPageChange={(p) => setPagination(prev => ({ ...prev, page: p }))}
                        onPageSizeChange={(s) => {
                            setPagination(prev => ({ ...prev, limit: s, page: 1 }));
                        }}
                        onSort={handleSort}
                        sortKey={sort.key}
                        sortDirection={sort.direction}
                    />
                </div>
            </div>

            <CreateTicketModal
                isOpen={isCreateOpen}
                onClose={handleCloseCreate}
                onSuccess={fetchTickets}
            />

            <TicketDetailsModal
                isOpen={isDetailsOpen}
                onClose={handleCloseDetails}
                selectedTicket={selectedTicket}
                onSuccess={fetchTickets}
            />
        </div>
    );
}
