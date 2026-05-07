'use client';

import React, { useState } from 'react';
import styles from './pagination.module.scss';

export default function Pagination({
    currentPage = 1,
    totalPages = 10,
    totalItems,
    pageSize = 10,
    pageSizeOptions = [10, 25, 50, 100],
    onPageChange,
    onPageSizeChange,
}) {
    const [gotoValue, setGotoValue] = useState('');

    const buildPages = () => {
        const delta = 1; // siblings around current page
        const pages = [];
        const left = currentPage - delta;
        const right = currentPage + delta;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= left && i <= right)
            ) {
                pages.push(i);
            }
        }

        // Insert ellipsis gaps
        const withEllipsis = [];
        let prev = null;
        for (const p of pages) {
            if (prev !== null && p - prev > 1) {
                withEllipsis.push('...');
            }
            withEllipsis.push(p);
            prev = p;
        }
        return withEllipsis;
    };

    const handleGoto = (e) => {
        if (e.key === 'Enter') {
            const page = parseInt(gotoValue, 10);
            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                onPageChange?.(page);
            }
            setGotoValue('');
        }
    };

    const pages = buildPages();

    return (
        <div className={styles.pagination}>
            {/* Left — arrows + page buttons */}
            <div className={styles.leftSide}>
                {/* Prev */}
                <button
                    className={styles.arrowBox}
                    disabled={currentPage === 1}
                    onClick={() => onPageChange?.(currentPage - 1)}
                    aria-label="Previous page"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Page buttons */}
                <div className={styles.pages}>
                    {pages.map((p, i) =>
                        p === '...' ? (
                            <span key={`dots-${i}`} className={styles.dots}>…</span>
                        ) : (
                            <button
                                key={p}
                                className={`${styles.page} ${p === currentPage ? styles.active : ''}`}
                                onClick={() => onPageChange?.(p)}
                                aria-current={p === currentPage ? 'page' : undefined}
                            >
                                {p}
                            </button>
                        )
                    )}
                </div>

                {/* Next */}
                <button
                    className={styles.arrowBox}
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange?.(currentPage + 1)}
                    aria-label="Next page"
                >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Right — total count, per-page, go-to */}
            <div className={styles.rightSide}>
                {/* Total results badge */}
                {typeof totalItems === 'number' && (
                    <span className={styles.totalLabel}>
                        {totalItems.toLocaleString()} Results
                    </span>
                )}

                {/* Per-page selector */}
                {pageSizeOptions?.length > 0 && (
                    <div className={styles.perPage}>
                        <select
                            value={pageSize}
                            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                            aria-label="Rows per page"
                        >
                            {pageSizeOptions.map((opt) => (
                                <option key={opt} value={opt}>{opt} / page</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Go-to page */}
                <span className={styles.gotoLabel}>Go To</span>
                <div className={styles.inputBox}>
                    <input
                        type="text"
                        value={gotoValue}
                        placeholder={String(currentPage)}
                        onChange={(e) => setGotoValue(e.target.value)}
                        onKeyDown={handleGoto}
                        aria-label="Go to page"
                    />
                </div>
            </div>
        </div>
    );
}
