'use client';

import React from 'react';
import styles from './dataTable.module.scss';
import Pagination from '@/components/pagination';
import SortingIcon from '@/icons/sortingIcon';

export default function DataTable({
    columns = [],
    data = [],
    rowKey = 'id',
    loading = false,
    emptyMessage = 'No Data Found.',

    // Pagination
    currentPage,
    totalPages,
    totalItems,
    pageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
    onPageSizeChange,
    onSort,
    sortKey,
    sortDirection,
}) {
    const hasPagination = typeof totalPages === 'number';

    // Helper to resolve nested keys like "userType.type"
    // Helper to resolve nested keys like "userType.type"
    const resolveValue = (obj, path) => {
        if (!path) return '';
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    // Check if a serial number column already exists in columns to avoid duplication
    const hasSrNo = columns.some(col => {
        const k = col.key?.toLowerCase() || '';
        const l = col.label?.toLowerCase() || '';
        return k === 'sr_no' || k === 'sno' || l.includes('sr') || l.includes('sno') || l.includes('serial');
    });

    const finalColumns = hasSrNo ? columns : [
        {
            label: 'Sr. No.',
            key: 'sr_no',
            render: (value, row, rowIndex) => {
                const page = typeof currentPage === 'number' ? currentPage : 1;
                const size = typeof pageSize === 'number' ? pageSize : 10;
                return (page - 1) * size + rowIndex + 1;
            }
        },
        ...columns
    ];

    return (
        <div className={styles.dataTableSection}>
            {/* ── Table ── */}
            <div className={styles.tableResponsive}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            {finalColumns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`${col.className ? (styles[col.className] || col.className) : ''} ${col.isSorting ? styles.sortableHeader : ''}`}
                                    onClick={() => col.isSorting && onSort && onSort(col.key)}
                                >
                                    <div className={styles.headerContent}>
                                        {col.label}
                                        {col.isSorting && (
                                            <SortingIcon
                                                active={sortKey === col.key}
                                                direction={sortKey === col.key ? sortDirection : null}
                                            />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            // Skeleton rows
                            Array.from({ length: pageSize > 5 ? 5 : pageSize }).map((_, ri) => (
                                <tr key={`skeleton-${ri}`} className={styles.skeletonRow}>
                                    {finalColumns.map((_, ci) => (
                                        <td key={ci}>
                                            <span className={styles.skeletonCell} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={finalColumns.length} className={styles.emptyCell}>
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={row[rowKey] ?? rowIndex}>
                                    {finalColumns.map((col, ci) => {
                                        const cellValue = resolveValue(row, col.key);
                                        return (
                                            <td
                                                key={ci}
                                                className={col.className ? (styles[col.className] || col.className) : ''}
                                            >
                                                {col.render
                                                    ? col.render(cellValue, row, rowIndex)
                                                    : cellValue ?? "-"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Pagination ── */}
            {hasPagination && (
                <div className={styles.paginationLine}>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={totalItems}
                        pageSize={pageSize}
                        pageSizeOptions={pageSizeOptions}
                        onPageChange={onPageChange}
                        onPageSizeChange={onPageSizeChange}
                    />
                </div>
            )}
        </div>
    );
}
