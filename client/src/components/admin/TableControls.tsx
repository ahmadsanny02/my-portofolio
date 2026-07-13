'use client';

import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, SlidersHorizontal, ChevronDown } from 'lucide-react';
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
  const [isOpen, setIsOpen] = useState(false);
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Pagination info
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const selectedOption = filterOptions.find(opt => opt.value === filterValue);
  const currentLabel = selectedOption ? selectedOption.label : filterPlaceholder;

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

          {/* Custom Filter Dropdown */}
          {onFilterChange && filterOptions.length > 0 && (
            <div className="relative min-w-[220px] flex items-center">
              {isOpen && (
                <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
              )}
              
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between bg-surface dark:bg-background/50 border border-secondary/15 rounded-2xl pl-11 pr-4 py-3 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-sm cursor-pointer text-foreground/80 font-semibold relative z-20 text-left"
              >
                <SlidersHorizontal className="absolute left-4 text-secondary pointer-events-none" size={16} />
                <span className="truncate pr-2">{currentLabel}</span>
                <ChevronDown size={16} className={cn("text-secondary transition-transform duration-300 shrink-0", isOpen && "rotate-180")} />
              </button>

              {isOpen && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-surface/95 dark:bg-slate-900/95 border border-secondary/15 rounded-2xl p-1.5 shadow-2xl z-20 space-y-0.5 backdrop-blur-md max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-200">
                  <button
                    type="button"
                    onClick={() => {
                      onFilterChange("");
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center px-4 py-2.5 text-xs text-left rounded-xl transition-all cursor-pointer font-semibold",
                      filterValue === ""
                        ? "text-primary bg-primary/10 font-bold"
                        : "text-secondary hover:text-foreground hover:bg-secondary/5"
                    )}
                  >
                    {filterPlaceholder}
                  </button>
                  {filterOptions.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        onFilterChange(opt.value);
                        setIsOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center px-4 py-2.5 text-xs text-left rounded-xl transition-all cursor-pointer font-semibold",
                        filterValue === opt.value
                          ? "text-primary bg-primary/10 font-bold"
                          : "text-secondary hover:text-foreground hover:bg-secondary/5"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
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
