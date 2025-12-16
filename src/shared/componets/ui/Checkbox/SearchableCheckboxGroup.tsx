// components/Checkbox/SearchableCheckboxGroup.tsx
import React, { useState, useMemo } from 'react';
import { FormCheckboxArray, CheckboxOption } from './FormCheckboxArray';
import { Control, FieldValues, Path } from 'react-hook-form';
import styles from './SearchableCheckboxGroup.module.css';

interface SearchableCheckboxGroupProps<TForm extends FieldValues> {
    control: Control<TForm>;
    name: Path<TForm>;
    options: CheckboxOption[];
    title?: string;
    description?: string;
    searchPlaceholder?: string;
    showStats?: boolean;
    loading?: boolean;
}

export function SearchableCheckboxGroup<TForm extends FieldValues>({
   control,
   name,
   options,
   title,
   description,
   searchPlaceholder = 'ძიება...',
   showStats = false,
   loading = false,
}: SearchableCheckboxGroupProps<TForm>) {
    const [searchQuery, setSearchQuery] = useState('');

    // ✅ Filter options based on search
    const filteredOptions = useMemo(() => {
        if (!searchQuery) return options;

        const query = searchQuery.toLowerCase();
        return options.filter(option => {
            const labelText = typeof option.label === 'string'
                ? option.label
                : String(option.label);
            return labelText.toLowerCase().includes(query);
        });
    }, [options, searchQuery]);

    const handleClear = () => {
        setSearchQuery('');
    };

    return (
        <div className={styles.searchableGroup}>
            {/* Search Container */}
            <div className={styles.searchContainer}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder={searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />

                {/* Search Icon */}
                <svg
                    className={styles.searchIcon}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                </svg>

                {/* Clear Button */}
                {searchQuery && (
                    <button
                        type="button"
                        className={`${styles.clearButton} ${styles.visible}`}
                        onClick={handleClear}
                        aria-label="გასუფთავება"
                    >
                        <svg
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
            </div>

            {/* Results Count */}
            {searchQuery && !loading && (
                <div className={styles.resultsCount}>
                    ნაპოვნია: <strong>{filteredOptions.length}</strong> / {options.length}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className={styles.loading}>
                    <span className={styles.spinner}></span>
                    იტვირთება...
                </div>
            )}

            {/* Stats Bar */}
            {showStats && !loading && (
                <div className={styles.statsBar}>
                    <span className={styles.total}>სულ: {options.length}</span>
                </div>
            )}

            {/* Checkbox Array */}
            {!loading && filteredOptions.length > 0 && (
                <FormCheckboxArray
                    control={control}
                    name={name}
                    options={filteredOptions}
                    title={title}
                    description={description}
                />
            )}

            {/* No Results */}
            {!loading && searchQuery && filteredOptions.length === 0 && (
                <div className={styles.noResults}>
                    <span className={styles.noResultsIcon}>🔍</span>
                    <p className={styles.noResultsText}>არაფერი მოიძებნა</p>
                    <p className={styles.noResultsQuery}>"{searchQuery}"</p>
                </div>
            )}
        </div>
    );
}