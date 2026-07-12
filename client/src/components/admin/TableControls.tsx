'use client';

import React from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface FilterOption {
  value: string;
  label: string;
}

interface TableControlsProps {
  // Search
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  
  // Filter
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;

  // Pagination
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;

  // Rendering Layout Flags
  showSearchAndFilter?: boolean;
  showPagination?: boolean;
}

export default function TableControls({
  searchTerm = "",
  onSearchChange = () => {},
  searchPlaceholder = "Search...",
  filterValue = "",
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "All Categories",
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 10,
  showSearchAndFilter = true,
  showPagination = true
}: TableControlsProps) {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Pagination info
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full">
      {/* Search and Filter Row */}
      {showSearchAndFilter && (
        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-surface dark:bg-background/50 border border-secondary/15 rounded-2xl pl-12 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm placeholder:text-secondary/50 text-foreground"
            />
          </div>

          {/* Filter Selection (Optional) */}
          {onFilterChange && filterOptions.length > 0 && (
            <div className="relative min-w-[180px] flex items-center">
              <SlidersHorizontal className="absolute left-4 text-secondary pointer-events-none" size={16} />
              <select
                value={filterValue}
                onChange={(e) => onFilterChange(e.target.value)}
                className="w-full bg-surface dark:bg-background/50 border border-secondary/15 rounded-2xl pl-11 pr-10 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm appearance-none cursor-pointer text-foreground/80 font-semibold"
              >
                <option value="">{filterPlaceholder}</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* Custom dropdown arrow */}
              <div className="absolute right-4 pointer-events-none text-secondary">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pagination Row */}
      {showPagination && totalItems > 0 && (
        <div className={cn(
          "flex flex-col sm:flex-row gap-4 items-center justify-between text-xs sm:text-sm",
          showSearchAndFilter ? "pt-4 border-t border-secondary/10 mt-4" : ""
        )}>
          <p className="text-secondary/70 font-semibold uppercase tracking-wider text-[10px] sm:text-xs">
            Showing <span className="text-foreground font-extrabold">{startItem}</span> to{' '}
            <span className="text-foreground font-extrabold">{endItem}</span> of{' '}
            <span className="text-foreground font-extrabold">{totalItems}</span> entries
          </p>

          {totalPages > 1 && (
            <div className="flex items-center gap-1.5">
              {/* Prev Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2.5 rounded-xl border border-secondary/10 bg-surface/50 dark:bg-slate-900/40 hover:border-primary/30 hover:bg-primary/5 hover:text-primary text-secondary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary disabled:hover:border-secondary/10 transition-all cursor-pointer flex items-center justify-center"
                aria-label="Previous Page"
              >
                <ChevronLeft size={16} />
              </motion.button>

              {/* Page Number Buttons */}
              {pageNumbers.map((page) => (
                <motion.button
                  key={page}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onPageChange(page)}
                  className={cn(
                    "w-9 h-9 rounded-xl font-extrabold flex items-center justify-center transition-all text-xs border cursor-pointer",
                    currentPage === page
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/25"
                      : "border-secondary/10 bg-surface/50 dark:bg-slate-900/40 hover:border-primary/30 hover:bg-primary/5 hover:text-primary text-secondary"
                  )}
                >
                  {page}
                </motion.button>
              ))}

              {/* Next Button */}
              <motion.button
                whileTap={{ scale: 0.95 }}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2.5 rounded-xl border border-secondary/10 bg-surface/50 dark:bg-slate-900/40 hover:border-primary/30 hover:bg-primary/5 hover:text-primary text-secondary disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-secondary disabled:hover:border-secondary/10 transition-all cursor-pointer flex items-center justify-center"
                aria-label="Next Page"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
