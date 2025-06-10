import React from 'react';
import { PaginatedResponse } from '../types/response.types';

interface PaginationProps {
    pagination: PaginatedResponse<any>;
    onPageChange: (page: number) => void;
    onSizeChange?: (size: number) => void;
    showSizeSelector?: boolean;
    sizeOptions?: number[];
}

const Pagination: React.FC<PaginationProps> = ({
    pagination,
    onPageChange,
    onSizeChange,
    showSizeSelector = false,
    sizeOptions = [5, 10, 20, 50]
}) => {
    const { page, size, totalElements, totalPages, hasNext, hasPrevious, isFirst, isLast } = pagination;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            onPageChange(newPage);
        }
    };

    const handleSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(event.target.value);
        if (onSizeChange) {
            onSizeChange(newSize);
        }
    };

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        if (totalPages <= maxVisiblePages) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (page <= 2) {
                for (let i = 0; i < maxVisiblePages - 1; i++) {
                    pages.push(i);
                }
                pages.push(totalPages - 1);
            } else if (page >= totalPages - 3) {
                pages.push(0);
                for (let i = totalPages - maxVisiblePages + 1; i < totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(0);
                for (let i = page - 1; i <= page + 1; i++) {
                    pages.push(i);
                }
                pages.push(totalPages - 1);
            }
        }
        
        return pages;
    };

    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-white border-t">
            <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>
                    Showing {page * size + 1} to {Math.min((page + 1) * size, totalElements)} of {totalElements} results
                </span>
                {showSizeSelector && onSizeChange && (
                    <div className="flex items-center gap-2">
                        <span>per page:</span>
                        <select
                            value={size}
                            onChange={handleSizeChange}
                            className="border border-gray-300 rounded px-2 py-1 text-sm"
                            aria-label="Items per page"
                        >
                            {sizeOptions.map(option => (
                                <option key={option} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-1">
                {/* First Page */}
                <button
                    onClick={() => handlePageChange(0)}
                    disabled={isFirst}
                    className={`px-3 py-1 text-sm rounded ${
                        isFirst
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    First
                </button>

                {/* Previous Page */}
                <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={!hasPrevious}
                    className={`px-3 py-1 text-sm rounded ${
                        !hasPrevious
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Previous
                </button>

                {/* Page Numbers */}
                {getPageNumbers().map((pageNum, index) => {
                    const isCurrentPage = pageNum === page;
                    const isEllipsis = index > 0 && pageNum - getPageNumbers()[index - 1] > 1;
                    
                    return (
                        <React.Fragment key={pageNum}>
                            {isEllipsis && (
                                <span className="px-2 py-1 text-sm text-gray-500">...</span>
                            )}
                            <button
                                onClick={() => handlePageChange(pageNum)}
                                className={`px-3 py-1 text-sm rounded ${
                                    isCurrentPage
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                {pageNum + 1}
                            </button>
                        </React.Fragment>
                    );
                })}

                {/* Next Page */}
                <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={!hasNext}
                    className={`px-3 py-1 text-sm rounded ${
                        !hasNext
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Next
                </button>

                {/* Last Page */}
                <button
                    onClick={() => handlePageChange(totalPages - 1)}
                    disabled={isLast}
                    className={`px-3 py-1 text-sm rounded ${
                        isLast
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                >
                    Last
                </button>
            </div>
        </div>
    );
};

export default Pagination; 