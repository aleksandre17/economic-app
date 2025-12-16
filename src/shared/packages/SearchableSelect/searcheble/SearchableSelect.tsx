// src/shared/components/SearchableSelect/SearchableSelect.tsx

import React, { useState, useRef, useEffect, useMemo, forwardRef } from 'react';
import styles from './SearchableSelect.module.css';

export interface SearchableSelectOption {
    id: string | number;
    name: string;
    code?: string | number;
    isActive?: boolean; // Header/group - არ არჩევადი
    parentId?: string | number;
    disabled?: boolean;
    metadata?: Record<string, any>;
}

export interface SearchableSelectProps {
    // Data
    options?: SearchableSelectOption[];
    value?: string | number;
    onChange?: (value: string | number, option: SearchableSelectOption) => void;
    valueField?: 'id' | 'code';  // Which field to use as value (default: 'id')

    // Display
    placeholder?: string;
    label?: string;
    error?: string;
    disabled?: boolean;
    required?: boolean;

    // Search
    searchable?: boolean;
    searchPlaceholder?: string;
    noResultsText?: string;

    // Styling
    className?: string;

    // React Hook Form support
    name?: string;
    onBlur?: () => void;
}

/**
 * Professional Searchable Select Component
 *
 * Features:
 * - Search functionality
 * - React Hook Form compatible
 * - Parent/Header support (non-selectable)
 * - Keyboard navigation
 * - Accessibility
 * - TypeScript support
 * - Choose value field (id or code)
 *
 * @example
 * // Simple usage (returns ID)
 * <SearchableSelect
 *   options={categories}
 *   value={selectedId}
 *   onChange={(value) => setSelectedId(value)}
 *   placeholder="აირჩიეთ კატეგორია"
 * />
 *
 * @example
 * // Return CODE instead of ID
 * <SearchableSelect
 *   options={categories}
 *   value={selectedCode}
 *   onChange={(value) => setSelectedCode(value)}
 *   valueField="code"
 *   placeholder="აირჩიეთ კატეგორია"
 * />
 *
 * @example
 * // With React Hook Form
 * <SearchableSelect
 *   {...register('category')}
 *   options={categories}
 *   error={errors.category?.message}
 *   valueField="code"
 * />
 */

const getOptionValue = (option: SearchableSelectOption | undefined, valueField: string): string | number => {
    if (!option) return '';  // Safety check

    if (valueField === 'code') {
        return option.code || option.id; // Fallback to id if code is missing
    }
    return option.id;
};

export const SearchableSelect = forwardRef<HTMLInputElement, SearchableSelectProps>(
    (
        {
            options,
            value,
            onChange,
            valueField = 'id',  // Default to 'id'
            placeholder = 'აირჩიეთ...',
            label,
            error,
            disabled = false,
            required = false,
            searchable = true,
            searchPlaceholder = 'ძებნა...',
            noResultsText = 'შედეგი არ მოიძებნა',
            className,
            name,
            onBlur,
        },
        ref
    ) => {
        const [isOpen, setIsOpen] = useState(false);
        const [searchTerm, setSearchTerm] = useState('');
        const [focusedIndex, setFocusedIndex] = useState(-1);

        const containerRef = useRef<HTMLDivElement>(null);
        const searchInputRef = useRef<HTMLInputElement>(null);
        const optionsRef = useRef<(HTMLDivElement | null)[]>([]);

        // Get selected option
        const selectedOption = useMemo(() => {
            if (!value) return undefined;
            return options.find((opt) => getOptionValue(opt, valueField) === value);
        }, [options, value, valueField]);

        // Filter options based on search
        const filteredOptions = useMemo(() => {
            if (!searchTerm) return options;

            const term = searchTerm.toLowerCase();

            return options.filter((option) => {
                // Parents are always shown if they have matching children
                if (option.isActive) {
                    const hasMatchingChildren = options.some(
                        (child) =>
                            child.parentId === option.id &&
                            (child.name.toLowerCase().includes(term) ||
                                child.code?.toLowerCase().includes(term))
                    );
                    return hasMatchingChildren;
                }

                // Regular options
                return (
                    option.name.toLowerCase().includes(term) ||
                    option.code == term
                );
            });
        }, [options, searchTerm]);

        // Get selectable options only (exclude parents)
        const selectableOptions = useMemo(() => {
            return filteredOptions.filter((opt) => !opt.isActive && !opt.disabled);
        }, [filteredOptions]);

        // Handle option select
        const handleSelect = (option: SearchableSelectOption) => {
            if (option.isActive || option.disabled) return;

            // Return value based on valueField (code or id)
            const returnValue = getOptionValue(option, valueField);
            onChange?.(returnValue, option);

            // Trigger blur for React Hook Form
            onBlur?.();
            setIsOpen(false);
            setSearchTerm('');
            setFocusedIndex(-1);
        };

        // Handle keyboard navigation
        const handleKeyDown = (e: React.KeyboardEvent) => {
            if (disabled) return;

            switch (e.key) {
                case 'Enter':
                    e.preventDefault();
                    if (!isOpen) {
                        setIsOpen(true);
                    } else if (focusedIndex >= 0 && focusedIndex < selectableOptions.length) {
                        handleSelect(selectableOptions[focusedIndex]);
                    }
                    break;

                case 'Escape':
                    e.preventDefault();
                    setIsOpen(false);
                    setSearchTerm('');
                    setFocusedIndex(-1);
                    break;

                case 'ArrowDown':
                    e.preventDefault();
                    if (!isOpen) {
                        setIsOpen(true);
                    } else {
                        setFocusedIndex((prev) =>
                            prev < selectableOptions.length - 1 ? prev + 1 : prev
                        );
                    }
                    break;

                case 'ArrowUp':
                    e.preventDefault();
                    setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    break;

                default:
                    if (!isOpen && e.key.length === 1) {
                        setIsOpen(true);
                    }
                    break;
            }
        };

        // Scroll focused option into view
        useEffect(() => {
            if (focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
                optionsRef.current[focusedIndex]?.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth',
                });
            }
        }, [focusedIndex]);

        // Close dropdown when clicking outside
        useEffect(() => {
            const handleClickOutside = (event: MouseEvent) => {
                if (
                    containerRef.current &&
                    !containerRef.current.contains(event.target as Node)
                ) {
                    setIsOpen(false);
                    setSearchTerm('');
                    setFocusedIndex(-1);
                }
            };

            if (isOpen) {
                document.addEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [isOpen]);

        // Focus search input when dropdown opens
        useEffect(() => {
            if (isOpen && searchable && searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, [isOpen, searchable]);

        // Render option
        const renderOption = (option: SearchableSelectOption, index: number) => {
            const optionValue = getOptionValue(option, valueField);
            const isSelected = optionValue == value;

            // Safely get focused option value
            const focusedOption = selectableOptions[focusedIndex];
            const focusedValue = focusedOption ? getOptionValue(focusedOption) : null;
            const isFocused = focusedValue !== null && focusedValue === optionValue;

            if (option.isActive) {
                return (
                    <div
                        key={option.id}
                        className={styles.optionHeader}
                        role="presentation"
                    >
                        {option.name}
                    </div>
                );
            }

            const selectableIndex = selectableOptions.findIndex((opt) => getOptionValue(opt) === optionValue);

            return (
                <div
                    key={option.id}
                    ref={(el) => {
                        if (selectableIndex >= 0) {
                            optionsRef.current[selectableIndex] = el;
                        }
                    }}
                    className={`
                        ${styles.option}
                        ${isSelected ? styles.optionSelected : ''}
                        ${isFocused ? styles.optionFocused : ''}
                        ${option.disabled ? styles.optionDisabled : ''}
                    `}
                    onClick={() => handleSelect(option)}
                    role="option"
                    aria-selected={isSelected}
                    aria-disabled={option.disabled}
                >
                    <span className={styles.optionName}>{option.name}</span>
                    {option.code && (
                        <span className={styles.optionCode}>({option.code})</span>
                    )}
                    {isSelected && <span className={styles.checkmark}>✓</span>}
                </div>
            );
        };

        return (
            <div
                ref={containerRef}
                className={`${styles.container} ${className || ''}`}
            >
                {/* Label */}
                {label && (
                    <label className={styles.label}>
                        {label}
                        {required && <span className={styles.required}>*</span>}
                    </label>
                )}

                {/* Hidden input for React Hook Form */}
                <input
                    ref={ref}
                    type="hidden"
                    name={name}
                    value={value || ''}
                    onBlur={onBlur}
                />

                {/* Select Button */}
                <button
                    type="button"
                    className={`
                        ${styles.selectButton}
                        ${isOpen ? styles.selectButtonOpen : ''}
                        ${error ? styles.selectButtonError : ''}
                        ${disabled ? styles.selectButtonDisabled : ''}
                    `}
                    onClick={() => !disabled && setIsOpen(!isOpen)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span
                        className={`
                            ${styles.selectedValue}
                            ${!selectedOption ? styles.placeholder : ''}
                        `}
                    >
                        {selectedOption ? selectedOption.name : placeholder}
                    </span>
                    <span
                        className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ''}`}
                    >
                        ▼
                    </span>
                </button>

                {/* Dropdown */}
                {isOpen && (
                    <div className={styles.dropdown} role="listbox">
                        {/* Search Input */}
                        {searchable && (
                            <div className={styles.searchContainer}>
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    className={styles.searchInput}
                                    placeholder={searchPlaceholder}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setFocusedIndex(0);
                                    }}
                                    onKeyDown={handleKeyDown}
                                />
                                <span className={styles.searchIcon}>🔍</span>
                            </div>
                        )}

                        {/* Options List */}
                        <div className={styles.optionsList}>
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((option, index) =>
                                    renderOption(option, index)
                                )
                            ) : (
                                <div className={styles.noResults}>{noResultsText}</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && <div className={styles.error}>{error}</div>}
            </div>
        );
    }
);

SearchableSelect.displayName = 'SearchableSelect';