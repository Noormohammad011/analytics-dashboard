"use client"

import * as React from "react"

import { useDebouncedValue } from "@/hooks/use-debounced-value"

export const ORDERS_SEARCH_DEBOUNCE_MS = 300

export const useOrdersSearch = (initialQuery = "") => {
  const [searchInput, setSearchInput] = React.useState(initialQuery)
  const debouncedSearch = useDebouncedValue(searchInput, ORDERS_SEARCH_DEBOUNCE_MS)

  const isSearchDebouncing =
    searchInput.trim() !== debouncedSearch.trim()

  const handleSearchChange = React.useCallback((q: string) => {
    setSearchInput(q)
  }, [])

  return {
    searchInput,
    debouncedSearch,
    isSearchDebouncing,
    handleSearchChange,
    resetSearch: React.useCallback(() => setSearchInput(""), []),
  }
}
