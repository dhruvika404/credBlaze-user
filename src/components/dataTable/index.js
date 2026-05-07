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
}) {
    const hasPagination = typeof totalPages === 'number';

    // Helper to resolve nested keys like "userType.type"
    const resolveValue = (obj, path) => {
        if (!path) return '';
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    return (
        <div className={styles.dataTableSection}>
            {/* ── Table ── */}
            <div className={styles.tableResponsive}>
                <table className={styles.dataTable}>
                    <thead>
                        <tr>
                            {columns.map((col, i) => (
                                <th
                                    key={i}
                                    className={`${col.className ? (styles[col.className] || col.className) : ''} ${col.isSorting ? styles.sortableHeader : ''}`}
                                    onClick={() => col.isSorting && onSort && onSort(col.key)}
                                >
                                    <div className={styles.headerContent}>
                                        {col.label}
                                        {col.isSorting && <SortingIcon />}
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
                                    {columns.map((_, ci) => (
                                        <td key={ci}>
                                            <span className={styles.skeletonCell} />
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className={styles.emptyCell}>
                                    {emptyMessage}
                                </td>
                            </tr>
                        ) : (
                            data.map((row, rowIndex) => (
                                <tr key={row[rowKey] ?? rowIndex}>
                                    {columns.map((col, ci) => {
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
