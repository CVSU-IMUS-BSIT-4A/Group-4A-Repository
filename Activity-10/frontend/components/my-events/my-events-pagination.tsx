"use client";

import { motion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MyEventsPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPrevPage: () => void;
    onNextPage: () => void;
    isLoading?: boolean;
}

export function MyEventsPagination({
    currentPage,
    totalPages,
    onPageChange,
    onPrevPage,
    onNextPage,
    isLoading,
}: MyEventsPaginationProps) {
    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        
        if (totalPages <= 7) {
            // Show all pages if 7 or fewer
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);
            
            if (currentPage > 3) {
                pages.push("ellipsis");
            }
            
            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            
            if (currentPage < totalPages - 2) {
                pages.push("ellipsis");
            }
            
            // Always show last page
            pages.push(totalPages);
        }
        
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <motion.div
            className="flex items-center justify-center gap-2 py-4 mt-4 sticky bottom-0 bg-neutral-50/80 dark:bg-neutral-950/80 backdrop-blur-sm md:relative md:bg-transparent md:backdrop-blur-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.1 }}
        >
            {/* Previous Button */}
            <button
                onClick={onPrevPage}
                disabled={currentPage === 1 || isLoading}
                className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {pageNumbers.map((page, index) =>
                    page === "ellipsis" ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-2 text-neutral-400 dark:text-neutral-600"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            disabled={isLoading}
                            className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                    ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900"
                                    : "bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                            } disabled:cursor-not-allowed`}
                        >
                            {page}
                        </button>
                    )
                )}
            </div>

            {/* Next Button */}
            <button
                onClick={onNextPage}
                disabled={currentPage === totalPages || isLoading}
                className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </motion.div>
    );
}

