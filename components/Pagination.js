"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function Pagination({
    name,
    currentPage,
    totalItems,
    itemsPerPage,
}) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    // These values drive the "Showing X to Y" summary for the current slice of records.
    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    function handlePageChange(page) {
        if (page < 1 || page > totalPages || page === currentPage) return;

        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set('page', page.toString());
        router.push(`${pathname}?${newParams.toString()}`)
    }

    function getPageNumbers() {
        const pages = [];
        const maxVisible = 7; // Maximum number of page buttons to show

        if (totalPages <= maxVisible) {
            for (let page = 1; page <= totalPages; page++) {
                pages.push(page);
            }
            return pages;
        }

        // Keep the current page centered when possible, then collapse the far ranges with ellipses.
        const siblingCount = 1;
        const leftBoundary = Math.max(currentPage - siblingCount, 2);
        const rightBoundary = Math.min(currentPage + siblingCount, totalPages - 1);

        pages.push(1);

        if (leftBoundary > 2) {
            pages.push("...");
        }

        for (let page = leftBoundary; page <= rightBoundary; page++) {
            pages.push(page);
        }

        if (rightBoundary < totalPages - 1) {
            pages.push("...");
        }

        pages.push(totalPages);
        return pages;
    }

    const pageNumbers = getPageNumbers();

    return (
        <div className="px-6 py-4 bg-foregd border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">{startItem}</span> to{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{endItem}</span> of{' '}
                <span className="font-semibold text-gray-900 dark:text-white">{totalItems}</span> {name}
            </p>
            <div className="flex items-center gap-2">
                {/* Previous Button */}
                <button
                    type="button"
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="cursor-pointer px-3 py-1 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 disabled:opacity-50"
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {/* Page Numbers */}
                {pageNumbers.map((page, index) =>{
                    if (page === '...'){
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="px-3 py-2 text-gray-500 dark:text-gray-400"
                            >
                                ...
                            </span>
                        );
                    }
                    const pageNum = parseInt(page);
                    const isActive = pageNum === currentPage;
                    return(
                        <button
                            key={pageNum}
                            type="button"
                            onClick={() => handlePageChange(pageNum)}
                            className={`w-8 h-8 cursor-pointer flex items-center justify-center text-sm font-bold rounded-md transition-colors ${
                                isActive
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 hover:text-blue-500"
                            }`}
                            aria-current={isActive ? "page" : undefined}
                        >
                            {pageNum}
                        </button>
                    )
                })}
                
                

                {/* Next Button */}
                <button
                    className="cursor-pointer px-3 py-1 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600 hover:text-blue-500 disabled:opacity-50"
                    type="button"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage == totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    )
}
