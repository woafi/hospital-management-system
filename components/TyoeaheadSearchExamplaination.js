"use client";

// Next.js Link component for client-side navigation
import Link from "next/link";

// Next.js router for programmatic navigation
import { useRouter } from "next/navigation";

// React hooks
import { useEffect, useId, useRef, useState, useTransition } from "react";

// Server action for searching directory data
import { searchDirectory } from "@/app/actions/directorySearchAction";

// Delay before triggering search request
const DEBOUNCE_MS = 500;

export default function TypeaheadSearch({
  entity,
  placeholder = "Search by name, ID, phone, or email...",
}) {
  // Stores current input value
  const [query, setQuery] = useState("");

  // Stores search results
  const [results, setResults] = useState([]);

  // Controls dropdown visibility
  const [isOpen, setIsOpen] = useState(false);

  // Tracks currently highlighted item in keyboard navigation
  const [activeIndex, setActiveIndex] = useState(-1);

  // Stores error message
  const [error, setError] = useState("");

  // React concurrent UI state for pending async transition
  const [isPending, startTransition] = useTransition();

  // Next.js router instance
  const router = useRouter();

  // Unique ID for accessibility
  const listId = useId();

  // Keeps track of latest search request ID
  // Prevents race conditions from outdated requests
  const searchIdRef = useRef(0);

  // Reference to entire component
  // Used for outside click detection
  const rootRef = useRef(null);

  /**
   * SEARCH EFFECT
   * Runs whenever query or entity changes
   */
  useEffect(() => {
    // Remove extra spaces
    const term = query.trim();

    // Generate unique search ID
    const searchId = searchIdRef.current + 1;
    searchIdRef.current = searchId;

    // Stop searching if input is empty
    if (!term) {
      return;
    }

    // Debounce search request
    const timer = setTimeout(() => {
      startTransition(async () => {
        try {
          // Fetch matching data from server action
          const matches = await searchDirectory(entity, term);

          // Ignore old/outdated requests
          if (searchIdRef.current !== searchId) return;

          // Update state with new results
          setResults(matches);
          setError("");
          setIsOpen(true);

          // Automatically highlight first item
          setActiveIndex(matches.length ? 0 : -1);
        } catch (searchError) {
          // Ignore outdated requests
          if (searchIdRef.current !== searchId) return;

          console.error(searchError);

          // Show error state
          setResults([]);
          setError("Search is unavailable right now.");
          setIsOpen(true);
          setActiveIndex(-1);
        }
      });
    }, DEBOUNCE_MS);

    // Cleanup old timer when query changes
    return () => clearTimeout(timer);
  }, [entity, query]);

  /**
   * OUTSIDE CLICK DETECTION
   * Closes dropdown when clicking outside component
   */
  useEffect(() => {
    function handlePointerDown(event) {
      // If click is outside component
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);

    // Cleanup listener
    return () =>
      document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  // Determines if dropdown should be shown
  const showDropdown = isOpen && query.trim();

  // Boolean check for results
  const hasResults = results.length > 0;

  /**
   * Handles input value changes
   */
  function handleQueryChange(event) {
    const nextQuery = event.target.value;

    setQuery(nextQuery);

    // Reset states if input becomes empty
    if (!nextQuery.trim()) {
      setResults([]);
      setError("");
      setIsOpen(false);
      setActiveIndex(-1);
    }
  }

  /**
   * Handles keyboard interactions
   */
  function handleKeyDown(event) {
    // Stop if dropdown isn't visible
    if (!showDropdown) return;

    // Close dropdown on ESC
    if (event.key === "Escape") {
      setIsOpen(false);
      return;
    }

    // Stop if no results available
    if (!hasResults) return;

    // Move selection downward
    if (event.key === "ArrowDown") {
      event.preventDefault();

      setActiveIndex((index) => (index + 1) % results.length);
    }

    // Move selection upward
    if (event.key === "ArrowUp") {
      event.preventDefault();

      setActiveIndex((index) =>
        index <= 0 ? results.length - 1 : index - 1
      );
    }

    // Navigate to selected result on Enter
    if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();

      router.push(results[activeIndex].href);
    }
  }

  return (
    <div ref={rootRef} className="relative group">
      {/* Search Icon */}
      <svg
        className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {/* Search Input */}
      <input
        type="search"
        value={query}
        onChange={handleQueryChange}
        onFocus={() => {
          // Open dropdown when input gains focus
          if (query.trim()) setIsOpen(true);
        }}
        onKeyDown={handleKeyDown}
        className="w-full pl-10 pr-11 py-2.5 bg-foregd border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:outline-none focus:ring-blue-600 transition-all text-sm"
        placeholder={placeholder}
        autoComplete="off"
        role="combobox"
        aria-controls={listId}
        aria-expanded={Boolean(showDropdown)}
        aria-autocomplete="list"
      />

      {/* Right-side loading spinner or clear button */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {isPending ? (
          // Loading spinner
          <span className="block h-4 w-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        ) : query ? (
          // Clear input button
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setResults([]);
              setError("");
              setIsOpen(false);
              setActiveIndex(-1);
            }}
            className="cursor-pointer text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label="Clear search"
          >
            <svg
              className="h-4 w-4"
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
        ) : null}
      </div>

      {/* Dropdown Results */}
      {showDropdown && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-gray-200 bg-foreground shadow-lg dark:border-gray-700">
          {/* Error Message */}
          {error ? (
            <div className="px-4 py-3 text-sm text-red-500">{error}</div>
          ) : hasResults ? (
            // Results List
            <ul
              id={listId}
              role="listbox"
              className="max-h-80 overflow-y-auto py-1"
            >
              {results.map((result, index) => (
                <li
                  key={result.id}
                  role="option"
                  aria-selected={activeIndex === index}
                >
                  <Link
                    href={result.href}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                      activeIndex === index
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                    }`}
                  >
                    {/* Avatar / Image */}
                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-blue-100">
                      {result.image ? (
                        // User image
                        <div
                          className="h-full w-full bg-cover bg-center"
                          style={{
                            backgroundImage: `url("${result.image}")`,
                          }}
                          aria-hidden="true"
                        />
                      ) : (
                        // Fallback first letter avatar
                        <div className="flex h-full w-full items-center justify-center bg-blue-600 text-sm font-bold text-white">
                          {result.title?.charAt(0)?.toUpperCase() || "S"}
                        </div>
                      )}
                    </div>

                    {/* Result Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {/* Main title */}
                        <p className="truncate text-sm font-bold text-gray-900 dark:text-white">
                          {result.title}
                        </p>

                        {/* Small code badge */}
                        <span className="flex-shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          {result.code}
                        </span>
                      </div>

                      {/* Subtitle and contact info */}
                      <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                        {[result.subtitle, result.contact]
                          .filter(Boolean)
                          .join(" - ")}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            // Empty state
            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
              No matches found for &quot;{query.trim()}&quot;.
            </div>
          )}
        </div>
      )}
    </div>
  );
}